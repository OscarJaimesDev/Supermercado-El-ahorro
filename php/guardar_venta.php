<?php
include("conexion.php");

// Datos del formulario
$id_usuario = $_POST['id_usuario'];
$id_producto = $_POST['id_producto'];
$producto = $_POST['producto'];
$cantidad = $_POST['cantidad'];
$precio = $_POST['precio'];

// Calcular total
$total = $cantidad * $precio;

// 1. Insertar en tabla ventas
$sqlVenta = "INSERT INTO ventas (id_usuario, total) VALUES ('$id_usuario', '$total')";
$conexion->query($sqlVenta);

// Obtener ID de la venta recién creada
$id_venta = $conexion->insert_id;

// Calcular subtotal
$subtotal = $cantidad * $precio;

// 2. Insertar en detalle
$sqlDetalle = "INSERT INTO ventas_detalle (id_venta, id_producto, cantidad, precio_unitario, subtotal)
VALUES ('$id_venta', '$id_producto','$producto', '$cantidad', '$precio', '$subtotal')";

if($conexion->query($sqlDetalle)){
    echo "Venta registrada correctamente";
}else{
    echo "Error: " . $conexion->error;
}
?>