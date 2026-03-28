<?php
// ============================================================
//  ADMIN.PHP — Panel de Administrador
//  Solo accesible para usuarios con rol = 'administrador'.
//  Muestra historial de ventas y lista de usuarios.
// ============================================================
session_start();
require_once 'php/conexion.php';

if (!isset($_SESSION['id_usuario']) || $_SESSION['rol'] !== 'administrador') {
    header('Location: index.html');
    exit;
}

// ── Acción: eliminar venta ──
$mensaje_accion = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['eliminar_venta'])) {
    $id_venta = (int)$_POST['id_venta'];
    try {
        $pdo = conectar();
        $pdo->beginTransaction();
        $pdo->prepare("DELETE FROM ventas_detalle WHERE id_venta = ?")->execute([$id_venta]);
        $pdo->prepare("DELETE FROM ventas WHERE id_venta = ?")->execute([$id_venta]);
        $pdo->commit();
        $mensaje_accion = '<p class="msg-exito">✅ Venta #' . $id_venta . ' eliminada correctamente.</p>';
    } catch (PDOException $e) {
        if ($pdo->inTransaction()) $pdo->rollBack();
        $mensaje_accion = '<p class="msg-error">❌ Error al eliminar la venta.</p>';
    }
}

// ── Cargar datos ──
try {
    $pdo = conectar();

    // Historial de ventas con detalle
    $ventas = $pdo->query("
        SELECT
            v.id_venta,
            CONCAT(u.nombre, ' ', u.apellido) AS usuario,
            GROUP_CONCAT(p.nombre, ' x', vd.cantidad SEPARATOR ', ') AS productos,
            v.total,
            v.fecha
        FROM ventas v
        JOIN usuarios u        ON v.id_usuario  = u.id_usuario
        JOIN ventas_detalle vd ON v.id_venta     = vd.id_venta
        JOIN productos p       ON vd.id_producto = p.id_producto
        GROUP BY v.id_venta
        ORDER BY v.fecha DESC
    ")->fetchAll();

    // Lista de usuarios registrados
    $usuarios = $pdo->query("
        SELECT id_usuario, nombre, apellido, email, telefono, rol, fecha_registro
        FROM usuarios
        ORDER BY fecha_registro DESC
    ")->fetchAll();

} catch (PDOException $e) {
    $ventas   = [];
    $usuarios = [];
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Panel Admin - El Ahorro</title>
    <link rel="stylesheet" href="css/style.css">
    <style>
        .admin-tabs        { display:flex; gap:10px; margin:30px 5% 0; }
        .tab-btn           { padding:10px 24px; border:2px solid var(--verde); background:white;
                             color:var(--verde); border-radius:6px 6px 0 0; font-weight:bold;
                             cursor:pointer; font-size:0.95rem; transition:all .2s; }
        .tab-btn.activo    { background:var(--verde); color:white; }
        .tab-contenido     { display:none; margin:0 5% 40px;
                             background:white; border-radius:0 6px 6px 6px;
                             box-shadow:var(--sombra); padding:24px; }
        .tab-contenido.activo { display:block; }
        .msg-exito         { background:#e8f5e9; color:var(--verde); border:1px solid var(--verde);
                             padding:12px; border-radius:6px; font-weight:bold; margin-bottom:16px; }
        .msg-error         { background:#fdecea; color:var(--rojo-error); border:1px solid var(--rojo-error);
                             padding:12px; border-radius:6px; font-weight:bold; margin-bottom:16px; }
        .admin-titulo      { color:var(--verde); margin-bottom:20px; font-size:1.3rem; }
        table              { width:100%; margin:0; border-radius:0; box-shadow:none; }
        .btn-eliminar-venta { background:none; border:1px solid var(--rojo-error);
                              color:var(--rojo-error); padding:5px 12px; border-radius:4px;
                              cursor:pointer; font-size:0.8rem; font-weight:bold; transition:all .2s; }
        .btn-eliminar-venta:hover { background:var(--rojo-error); color:white; }
        .badge-admin       { background:var(--naranja); color:white; padding:2px 8px;
                             border-radius:10px; font-size:0.75rem; font-weight:bold; }
        .badge-cliente     { background:#e0e0e0; color:#555; padding:2px 8px;
                             border-radius:10px; font-size:0.75rem; font-weight:bold; }
        .resumen-cards     { display:grid; grid-template-columns:repeat(auto-fit,minmax(180px,1fr));
                             gap:16px; margin-bottom:28px; }
        .resumen-card      { background:var(--verde-claro); border-left:4px solid var(--verde);
                             padding:16px 20px; border-radius:0 8px 8px 0; }
        .resumen-card .numero { font-size:2rem; font-weight:bold; color:var(--verde); }
        .resumen-card .label  { font-size:0.85rem; color:#555; }
        .tabla-scroll      { overflow-x:auto; }
    </style>
</head>
<body>

<header>
    <div class="logo-container">
        <h1>Supermercado El Ahorro</h1>
    </div>
    <nav>
        <ul>
            <li><a href="index.html">Inicio</a></li>
            <li><a href="productos.html">Productos</a></li>
            <li><a href="ofertas.php">Ofertas</a></li>
            <li><a href="admin.php" style="color:var(--naranja);">Panel Admin</a></li>
        </ul>
        <button onclick="window.location.href='php/logout.php'">
            Cerrar sesión (<?php echo htmlspecialchars($_SESSION['nombre']); ?>)
        </button>
    </nav>
</header>

<main>
    <?php if ($mensaje_accion) echo $mensaje_accion; ?>

    <!-- Tarjetas resumen -->
    <div class="resumen-cards" style="margin:30px 5% 0;">
        <div class="resumen-card">
            <div class="numero"><?php echo count($ventas); ?></div>
            <div class="label">Ventas registradas</div>
        </div>
        <div class="resumen-card">
            <div class="numero"><?php echo count($usuarios); ?></div>
            <div class="label">Usuarios registrados</div>
        </div>
        <div class="resumen-card">
            <div class="numero">
                $<?php
                    $totalGlobal = array_sum(array_column($ventas, 'total'));
                    echo number_format($totalGlobal, 2);
                ?>
            </div>
            <div class="label">Total en ventas</div>
        </div>
    </div>

    <!-- Tabs -->
    <div class="admin-tabs">
        <button class="tab-btn activo" onclick="cambiarTab('ventas', this)">📋 Historial de Ventas</button>
        <button class="tab-btn"       onclick="cambiarTab('usuarios', this)">👥 Usuarios</button>
    </div>

    <!-- Tab: Ventas -->
    <div id="tab-ventas" class="tab-contenido activo">
        <h2 class="admin-titulo">Historial de Ventas</h2>

        <?php if (empty($ventas)): ?>
            <p style="color:#999; text-align:center; padding:40px;">No hay ventas registradas aún.</p>
        <?php else: ?>
        <div class="tabla-scroll">
        <table>
            <thead>
                <tr>
                    <th>#</th>
                    <th>Usuario</th>
                    <th>Productos</th>
                    <th>Total</th>
                    <th>Fecha</th>
                    <th>Acción</th>
                </tr>
            </thead>
            <tbody>
            <?php foreach ($ventas as $v): ?>
                <tr>
                    <td><?php echo $v['id_venta']; ?></td>
                    <td><?php echo htmlspecialchars($v['usuario']); ?></td>
                    <td style="text-align:left; font-size:0.85rem;">
                        <?php echo htmlspecialchars($v['productos']); ?>
                    </td>
                    <td><strong>$<?php echo number_format($v['total'], 2); ?></strong></td>
                    <td><?php echo date('d/m/Y H:i', strtotime($v['fecha'])); ?></td>
                    <td>
                        <form method="POST" onsubmit="return confirmarEliminar(<?php echo $v['id_venta']; ?>)">
                            <input type="hidden" name="eliminar_venta" value="1">
                            <input type="hidden" name="id_venta" value="<?php echo $v['id_venta']; ?>">
                            <button type="submit" class="btn-eliminar-venta">🗑 Eliminar</button>
                        </form>
                    </td>
                </tr>
            <?php endforeach; ?>
            </tbody>
        </table>
        </div>
        <?php endif; ?>
    </div>

    <!-- Tab: Usuarios -->
    <div id="tab-usuarios" class="tab-contenido">
        <h2 class="admin-titulo">Usuarios Registrados</h2>

        <?php if (empty($usuarios)): ?>
            <p style="color:#999; text-align:center; padding:40px;">No hay usuarios registrados aún.</p>
        <?php else: ?>
        <div class="tabla-scroll">
        <table>
            <thead>
                <tr>
                    <th>#</th>
                    <th>Nombre</th>
                    <th>Email</th>
                    <th>Teléfono</th>
                    <th>Rol</th>
                    <th>Registro</th>
                </tr>
            </thead>
            <tbody>
            <?php foreach ($usuarios as $u): ?>
                <tr>
                    <td><?php echo $u['id_usuario']; ?></td>
                    <td><?php echo htmlspecialchars($u['nombre'] . ' ' . $u['apellido']); ?></td>
                    <td><?php echo htmlspecialchars($u['email']); ?></td>
                    <td><?php echo htmlspecialchars($u['telefono'] ?? '—'); ?></td>
                    <td>
                        <?php if ($u['rol'] === 'administrador'): ?>
                            <span class="badge-admin">Admin</span>
                        <?php else: ?>
                            <span class="badge-cliente">Cliente</span>
                        <?php endif; ?>
                    </td>
                    <td><?php echo date('d/m/Y', strtotime($u['fecha_registro'])); ?></td>
                </tr>
            <?php endforeach; ?>
            </tbody>
        </table>
        </div>
        <?php endif; ?>
    </div>

</main>

<footer>
    <p>&copy; 2026 Supermercado El Ahorro</p>
</footer>

<script>
    function cambiarTab(nombre, boton) {
        // Ocultar todos los tabs
        document.querySelectorAll('.tab-contenido').forEach(t => t.classList.remove('activo'));
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('activo'));
        // Mostrar el seleccionado
        document.getElementById('tab-' + nombre).classList.add('activo');
        boton.classList.add('activo');
    }

    function confirmarEliminar(id) {
        return confirm('¿Estás seguro de que quieres eliminar la venta #' + id + '?\nEsta acción no se puede deshacer.');
    }
</script>

</body>
</html>