<?php
// ============================================================
//  SESION_ACTIVA.PHP
//  Devuelve en JSON si hay una sesión activa y cuál es el rol.
//  Lo consulta el JavaScript de cada página para ajustar el menú.
// ============================================================

session_start();
header('Content-Type: application/json');

if (isset($_SESSION['id_usuario'])) {
    echo json_encode([
        'activa' => true,
        'nombre' => $_SESSION['nombre'],
        'rol'    => $_SESSION['rol']
    ]);
} else {
    echo json_encode(['activa' => false]);
}
?>  