<?php
// ============================================================
//  LOGIN.PHP
//  Recibe email y password por POST, verifica contra la BD,
//  inicia sesión y devuelve JSON con el resultado.
// ============================================================

require_once 'conexion.php';

session_start();
header('Content-Type: application/json');

// Solo aceptar POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['exito' => false, 'mensaje' => 'Método no permitido.']);
    exit;
}

$email    = trim($_POST['email']    ?? '');
$password = $_POST['password']      ?? '';

// Validaciones básicas
if (empty($email) || empty($password)) {
    echo json_encode(['exito' => false, 'mensaje' => 'Email y contraseña son obligatorios.']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['exito' => false, 'mensaje' => 'El formato del email no es válido.']);
    exit;
}

try {
    $pdo  = conectar();

    // Buscar el usuario por email (prepared statement)
    $stmt = $pdo->prepare("SELECT id_usuario, nombre, contrasena, rol FROM usuarios WHERE email = ?");
    $stmt->execute([$email]);
    $usuario = $stmt->fetch();

    // Verificar que existe y que la contraseña coincide
    if (!$usuario || !password_verify($password, $usuario['contrasena'])) {
        // Mismo mensaje para ambos casos (no revelar si el email existe)
        echo json_encode(['exito' => false, 'mensaje' => 'Email o contraseña incorrectos.']);
        exit;
    }

    // Regenerar ID de sesión por seguridad (previene session fixation)
    session_regenerate_id(true);

    // Guardar datos en sesión
    $_SESSION['id_usuario'] = $usuario['id_usuario'];
    $_SESSION['nombre']     = $usuario['nombre'];
    $_SESSION['rol']        = $usuario['rol'] ?? 'cliente';

    echo json_encode([
        'exito'  => true,
        'nombre' => $usuario['nombre'],
        'rol'    => $_SESSION['rol']
    ]);

} catch (PDOException $e) {
    echo json_encode(['exito' => false, 'mensaje' => 'Error interno. Intenta de nuevo.']);
}
?>