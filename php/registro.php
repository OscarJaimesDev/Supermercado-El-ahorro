<?php
require_once __DIR__ . '/conexion.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $nombre    = trim($_POST['nombre']    ?? '');
    $apellido  = trim($_POST['apellido']  ?? '');
    $email     = trim($_POST['email']     ?? '');
    $telefono  = trim($_POST['telefono']  ?? '');
    $password  = $_POST['password']       ?? '';

    // Validaciones básicas del lado del servidor
    if (empty($nombre) || empty($apellido) || empty($email) || empty($password)) {
        echo json_encode(['exito' => false, 'mensaje' => 'Todos los campos son obligatorios.']);
        exit;
    }
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode(['exito' => false, 'mensaje' => 'El email no es valido.']);
        exit;
    }
    if (strlen($password) < 6) {
        echo json_encode(['exito' => false, 'mensaje' => 'La contrasena debe tener minimo 6 caracteres.']);
        exit;
    }

    $pdo  = conectar();
    $hash = password_hash($password, PASSWORD_DEFAULT);

   try {
        $stmt = $pdo->prepare("INSERT INTO usuarios 
            (nombre, apellido, email, telefono, contrasena) 
            VALUES (?, ?, ?, ?, ?)");
        $stmt->execute([$nombre, $apellido, $email, $telefono, $hash]);
        echo json_encode(['exito' => true, 'mensaje' => 'Usuario registrado correctamente.']);
    } catch (PDOException $e) {
        // Código 23000 = email duplicado
        if ($e->getCode() === '23000') {
            echo json_encode(['exito' => false, 'mensaje' => 'Ese email ya esta registrado.']);
        } else {
            echo json_encode(['exito' => false, 'mensaje' => 'Error al guardar el usuario.']);
        }
    }
}
?>