<?php
include("conexion.php");

$nombre = $_POST['nombre'];
$apellido = $_POST['apellido'];
$email = $_POST['email'];
$telefono = $_POST['telefono'];
$password = $_POST['password'];

// Encriptar contraseña
$contrasena_segura = password_hash($password, PASSWORD_DEFAULT);

$sql = "INSERT INTO usuarios (nombre, apellido, email, telefono, contrasena)
VALUES ('$nombre', '$apellido', '$email', '$telefono', '$contrasena_segura')";

if($conexion->query($sql)){
    echo "Usuario registrado correctamente";
}else{
    echo "Error: " . $conexion->error;
}
?>