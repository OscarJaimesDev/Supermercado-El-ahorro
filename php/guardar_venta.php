<?php
// ============================================================
//  GUARDAR_VENTA.PHP
//  Recibe el carrito completo en JSON desde el frontend,
//  inserta en tabla ventas y ventas_detalle usando PDO
//  con prepared statements (seguro contra SQL injection).
//  Solo acepta peticiones de usuarios con sesión activa.
// ============================================================

require_once 'conexion.php';
session_start();
header('Content-Type: application/json');

// ── 1. Verificar sesión ──
if (!isset($_SESSION['id_usuario'])) {
    echo json_encode(['exito' => false, 'mensaje' => 'Debes iniciar sesión para realizar una compra.']);
    exit;
}

// ── 2. Solo aceptar POST ──
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['exito' => false, 'mensaje' => 'Método no permitido.']);
    exit;
}

// ── 3. Leer y validar los datos recibidos ──
$carritoJSON = $_POST['carrito'] ?? '';

if (empty($carritoJSON)) {
    echo json_encode(['exito' => false, 'mensaje' => 'El carrito está vacío.']);
    exit;
}

$carrito = json_decode($carritoJSON, true);

if (!is_array($carrito) || count($carrito) === 0) {
    echo json_encode(['exito' => false, 'mensaje' => 'Los datos del carrito no son válidos.']);
    exit;
}

// Validar que cada item tenga los campos necesarios
foreach ($carrito as $item) {
    if (!isset($item['id_producto'], $item['cantidad'], $item['precio_unitario'])) {
        echo json_encode(['exito' => false, 'mensaje' => 'Datos de producto incompletos.']);
        exit;
    }
    if (!is_numeric($item['cantidad']) || $item['cantidad'] <= 0) {
        echo json_encode(['exito' => false, 'mensaje' => 'Cantidad inválida en uno de los productos.']);
        exit;
    }
    if (!is_numeric($item['precio_unitario']) || $item['precio_unitario'] <= 0) {
        echo json_encode(['exito' => false, 'mensaje' => 'Precio inválido en uno de los productos.']);
        exit;
    }
}

// ── 4. Calcular el total del lado del servidor ──
$total = 0;
foreach ($carrito as $item) {
    $total += (float)$item['precio_unitario'] * (int)$item['cantidad'];
}
$total = round($total, 2);

// ── 5. Guardar en base de datos con transacción ──
try {
    $pdo = conectar();

    // Iniciar transacción: si algo falla, no queda nada a medias
    $pdo->beginTransaction();

    // 5a. Insertar en tabla ventas
    $stmtVenta = $pdo->prepare(
        "INSERT INTO ventas (id_usuario, total) VALUES (?, ?)"
    );
    $stmtVenta->execute([
        (int)$_SESSION['id_usuario'],
        $total
    ]);

    $id_venta = (int)$pdo->lastInsertId();

    // 5b. Insertar cada producto en ventas_detalle
    $stmtDetalle = $pdo->prepare(
        "INSERT INTO ventas_detalle (id_venta, id_producto, cantidad, precio_unitario, subtotal)
         VALUES (?, ?, ?, ?, ?)"
    );

    foreach ($carrito as $item) {
        $cantidad        = (int)$item['cantidad'];
        $precio_unitario = round((float)$item['precio_unitario'], 2);
        $subtotal        = round($precio_unitario * $cantidad, 2);

        $stmtDetalle->execute([
            $id_venta,
            (int)$item['id_producto'],
            $cantidad,
            $precio_unitario,
            $subtotal
        ]);
    }

    // Confirmar transacción
    $pdo->commit();

    echo json_encode([
        'exito'    => true,
        'mensaje'  => '¡Venta registrada correctamente!',
        'id_venta' => $id_venta,
        'total'    => $total
    ]);

} catch (PDOException $e) {
    // Si algo falló, revertir todo
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    echo json_encode(['exito' => false, 'mensaje' => 'Error al guardar la venta. Intenta de nuevo.']);
}
?>