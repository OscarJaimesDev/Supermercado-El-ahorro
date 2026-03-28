<?php
require_once 'conexion.php';
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['exito' => false, 'mensaje' => 'Método no permitido.']);
    exit;
}

$nombre   = trim($_POST['nombre']   ?? '');
$apellido = trim($_POST['apellido'] ?? '');
$email    = trim($_POST['email']    ?? '');
$telefono = trim($_POST['telefono'] ?? '');
$password = $_POST['password']      ?? '';

if (empty($nombre) || empty($apellido) || empty($email) || empty($password)) {
    echo json_encode(['exito' => false, 'mensaje' => 'Todos los campos son obligatorios.']);
    exit;
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['exito' => false, 'mensaje' => 'El email no es válido.']);
    exit;
}
if (strlen($password) < 6) {
    echo json_encode(['exito' => false, 'mensaje' => 'La contraseña debe tener mínimo 6 caracteres.']);
    exit;
}

try {
    $pdo  = conectar();
    $hash = password_hash($password, PASSWORD_DEFAULT);

    $stmt = $pdo->prepare("INSERT INTO usuarios 
        (nombre, apellido, email, telefono, contrasena) 
        VALUES (?, ?, ?, ?, ?)");
    $stmt->execute([$nombre, $apellido, $email, $telefono, $hash]);

    echo json_encode(['exito' => true, 'mensaje' => 'Usuario registrado correctamente.']);

} catch (PDOException $e) {
    if ($e->getCode() === '23000') {
        echo json_encode(['exito' => false, 'mensaje' => 'Ese email ya está registrado.']);
    } else {
        echo json_encode(['exito' => false, 'mensaje' => 'Error al guardar el usuario: ' . $e->getMessage()]);
    }
}
?>