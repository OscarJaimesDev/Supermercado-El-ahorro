<?php
include("conexion.php");

$sql = "SELECT id_usuario, nombre, apellido, email, telefono, fecha_registro FROM usuarios";
$resultado = $conexion->query($sql);

echo "<h2>Lista de Usuarios</h2>";

echo "<table border='1'>
<tr>
<th>ID</th>
<th>Nombre</th>
<th>Apellido</th>
<th>Email</th>
<th>Teléfono</th>
<th>Fecha Registro</th>
</tr>";

while($fila = $resultado->fetch_assoc()){
    echo "<tr>
    <td>{$fila['id_usuario']}</td>
    <td>{$fila['nombre']}</td>
    <td>{$fila['apellido']}</td>
    <td>{$fila['email']}</td>
    <td>{$fila['telefono']}</td>
    <td>{$fila['fecha_registro']}</td>
    </tr>";
}

echo "</table>";
?>