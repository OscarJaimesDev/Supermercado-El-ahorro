<?php
include("conexion.php");

$sql = "SELECT 
v.id_venta,
u.nombre,
p.nombre AS producto,
vd.cantidad,
vd.precio_unitario,
vd.subtotal,
v.total,
v.fecha
FROM ventas v
JOIN usuarios u ON v.id_usuario = u.id_usuario
JOIN ventas_detalle vd ON v.id_venta = vd.id_venta
JOIN productos p ON vd.id_producto = p.id_producto";

$resultado = $conexion->query($sql);

echo "<h2>Historial de Ventas</h2>";

echo "<table border='1'>
<tr>
<th>ID Venta</th>
<th>Usuario</th>
<th>Producto</th>
<th>Cantidad</th>
<th>Precio</th>
<th>Subtotal</th>
<th>Total</th>
<th>Fecha</th>
</tr>";

while($fila = $resultado->fetch_assoc()){
    echo "<tr>
    <td>{$fila['id_venta']}</td>
    <td>{$fila['nombre']}</td>
    <td>{$fila['producto']}</td>
    <td>{$fila['cantidad']}</td>
    <td>{$fila['precio_unitario']}</td>
    <td>{$fila['subtotal']}</td>
    <td>{$fila['total']}</td>
    <td>{$fila['fecha']}</td>
    </tr>";
}

echo "</table>";
?>