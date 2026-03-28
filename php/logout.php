<?php
// ============================================================
//  LOGOUT.PHP
//  Destruye la sesión activa y redirige al inicio.
// ============================================================

session_start();
session_unset();
session_destroy();

header('Location: ../index.html');
exit;
?>