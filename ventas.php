<?php
// Verificar sesión activa
session_start();

// Si no hay sesión o no es administrador, redirigir al inicio
if (!isset($_SESSION['id_usuario']) || $_SESSION['rol'] !== 'administrador') {
    header('Location: index.html');
    exit;
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ofertas para Socios - El Ahorro</title>
    <link rel="stylesheet" href="css/style.css">
    <style>
        .carrusel-wrapper     { position: relative; overflow: hidden; margin: 30px 5%; border-radius: 20px; }
        .carrusel-track       { display: flex; transition: transform 0.5s ease; }
        .oferta-slide         { min-width: 100%; padding: 60px 40px; text-align: center; color: white; }
        .oferta-slide h2      { font-size: 2rem; margin-bottom: 16px; }
        .oferta-badge         { font-size: 1.5rem; border: 2px solid white; padding: 16px 32px; display: inline-block; border-radius: 10px; margin: 16px 0; }
        .oferta-slide p       { font-size: 1rem; opacity: 0.9; }
        .slide-verde          { background: linear-gradient(to right, #2E7D32, #1B5E20); }
        .slide-naranja        { background: linear-gradient(to right, #FF8F00, #E65100); }
        .slide-azul           { background: linear-gradient(to right, #1565C0, #0D47A1); }
        .carrusel-controles   { position: absolute; top: 50%; transform: translateY(-50%); width: 100%; display: flex; justify-content: space-between; padding: 0 16px; pointer-events: none; }
        .btn-slide            { background: rgba(255,255,255,0.3); border: none; color: white; font-size: 1.5rem; width: 40px; height: 40px; border-radius: 50%; cursor: pointer; pointer-events: all; transition: background 0.3s; }
        .btn-slide:hover      { background: rgba(255,255,255,0.6); }
        .carrusel-dots        { display: flex; justify-content: center; gap: 8px; margin-top: 14px; }
        .dot                  { width: 10px; height: 10px; border-radius: 50%; background: #ccc; cursor: pointer; transition: background 0.3s; }
        .dot.activo           { background: var(--verde); }
        .bienvenida-banner    { background: var(--verde-claro); border-left: 4px solid var(--verde); padding: 16px 24px; margin: 0 5% 30px; border-radius: 0 8px 8px 0; }
        .bienvenida-banner p  { color: var(--verde); font-weight: bold; font-size: 1rem; }
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
                <li id="link-ventas" style="display:none">
                    <a href="ventas.php">Ventas (Admin)</a>
                </li>
            </ul>
            <button id="btn-sesion">Cerrar sesión</button>
            <button id="btn-carrito">
                <img src="images/cart.png" alt="Carrito" width="24">
                <span id="carrito-contador" style="display:none">0</span>
            </button>
        </nav>
    </header>

    <div id="carrito-panel">
        <button id="btn-cerrar-carrito">✕ Cerrar</button>
        <h3>Tu carrito</h3>
        <div id="carrito-lista"></div>
        <p>Total: <span id="carrito-total">$0.00</span></p>
        <button id="btn-vaciar-carrito">Vaciar carrito</button>
        <a href="ventas.php"><button id="btn-ir-pagar">Ir a pagar</button></a>
    </div>

    <div id="notificacion"></div>

    <main>

        <!-- Banner de bienvenida personalizado con el nombre del usuario -->
        <div class="bienvenida-banner">
            <p>
                Bienvenido, <?php echo htmlspecialchars($_SESSION['nombre']); ?>!
                Estas son tus ofertas exclusivas como socio registrado.
            </p>
        </div>

        <!-- ── CARRUSEL DE OFERTAS ── -->
        <div class="carrusel-wrapper">
            <div class="carrusel-track" id="carrusel-track">

                <div class="oferta-slide slide-verde">
                    <h2>Oferta de la semana</h2>
                    <div class="oferta-badge">20% DE DESCUENTO EN FRUTAS</div>
                    <p>Solo para socios registrados. Valido hasta el viernes.</p>
                </div>

                <div class="oferta-slide slide-naranja">
                    <h2>Oferta especial</h2>
                    <div class="oferta-badge">2x1 EN BEBIDAS SELECCIONADAS</div>
                    <p>Lleva dos y paga uno. Stock limitado.</p>
                </div>

                <div class="oferta-slide slide-azul">
                    <h2>Solo hoy</h2>
                    <div class="oferta-badge">15% MENOS EN LÁCTEOS</div>
                    <p>Aprovecha mientras dure el inventario.</p>
                </div>

            </div>

            <!-- Botones anterior/siguiente -->
            <div class="carrusel-controles">
                <button class="btn-slide" id="btn-anterior">&#8592;</button>
                <button class="btn-slide" id="btn-siguiente">&#8594;</button>
            </div>
        </div>

        <!-- Puntos indicadores del carrusel -->
        <div class="carrusel-dots" id="carrusel-dots">
            <div class="dot activo" onclick="irASlide(0)"></div>
            <div class="dot"       onclick="irASlide(1)"></div>
            <div class="dot"       onclick="irASlide(2)"></div>
        </div>

        <!-- ── PRODUCTOS DESTACADOS CON DESCUENTO ── -->
        <section style="padding: 30px 5%;">
            <h2 style="color: var(--verde); margin-bottom: 24px;">
                Productos en oferta esta semana
            </h2>
            <div class="grid-productos">

                <article class="tarjeta-producto"
                    data-categoria="frutas" data-precio="2.80" data-nombre="manzana roja">
                    <p class="categoria-label">FRUTAS — 20% OFF</p>
                    <img src="images/productos/manzana.jpg" alt="Manzana">
                    <h3>Manzana Roja</h3>
                    <p style="text-decoration:line-through; color:#999; font-size:0.9rem;">$3.50</p>
                    <p class="precio">$2.80</p>
                    <button class="btn-agregar"
                        onclick="agregarAlCarrito(1, 'Manzana Roja', 2.80, 'images/productos/manzana.jpg')">
                        Agregar al carrito
                    </button>
                </article>

                <article class="tarjeta-producto"
                    data-categoria="bebidas" data-precio="2.50" data-nombre="gaseosa">
                    <p class="categoria-label">BEBIDAS — 2x1</p>
                    <img src="images/productos/gaseosa.jpg" alt="Gaseosa">
                    <h3>Gaseosa 1.5L</h3>
                    <p class="precio">$2.50 <span style="font-size:0.8rem; color:var(--naranja);">2x1</span></p>
                    <button class="btn-agregar"
                        onclick="agregarAlCarrito(14, 'Gaseosa 1.5L', 2.50, 'images/productos/gaseosa.jpg')">
                        Agregar al carrito
                    </button>
                </article>

                <article class="tarjeta-producto"
                    data-categoria="lacteos" data-precio="1.02" data-nombre="leche entera">
                    <p class="categoria-label">LÁCTEOS — 15% OFF</p>
                    <img src="images/productos/leche.jpg" alt="Leche">
                    <h3>Leche Entera</h3>
                    <p style="text-decoration:line-through; color:#999; font-size:0.9rem;">$1.20</p>
                    <p class="precio">$1.02</p>
                    <button class="btn-agregar"
                        onclick="agregarAlCarrito(9, 'Leche Entera', 1.02, 'images/productos/leche.jpg')">
                        Agregar al carrito
                    </button>
                </article>

                <article class="tarjeta-producto"
                    data-categoria="frutas" data-precio="2.00" data-nombre="banano">
                    <p class="categoria-label">FRUTAS — 20% OFF</p>
                    <img src="images/productos/banano.jpg" alt="Banano">
                    <h3>Banano (1kg)</h3>
                    <p style="text-decoration:line-through; color:#999; font-size:0.9rem;">$2.50</p>
                    <p class="precio">$2.00</p>
                    <button class="btn-agregar"
                        onclick="agregarAlCarrito(2, 'Banano', 2.00, 'images/productos/banano.jpg')">
                        Agregar al carrito
                    </button>
                </article>

            </div>
        </section>

    </main>

    <footer>
        <p>&copy; 2026 Supermercado El Ahorro</p>
    </footer>

    <script src="js/carrito.js"></script>
    <script src="js/scripts.js"></script>
    <script>
        // ── CARRUSEL ──
        let slideActual = 0;
        const totalSlides = 3;

        function irASlide(n) {
            slideActual = n;
            document.getElementById("carrusel-track").style.transform =
                `translateX(-${slideActual * 100}%)`;

            // Actualizar dots
            document.querySelectorAll(".dot").forEach((dot, i) => {
                dot.classList.toggle("activo", i === slideActual);
            });
        }

        function slideAnterior() {
            slideActual = slideActual === 0 ? totalSlides - 1 : slideActual - 1;
            irASlide(slideActual);
        }

        function slideSiguiente() {
            slideActual = slideActual === totalSlides - 1 ? 0 : slideActual + 1;
            irASlide(slideActual);
        }

        document.getElementById("btn-anterior").addEventListener("click", slideAnterior);
        document.getElementById("btn-siguiente").addEventListener("click", slideSiguiente);

        // Avance automático cada 4 segundos
        setInterval(slideSiguiente, 4000);

        // Mostrar Ventas en menú si es admin (usa sesion_activa.php)
        verificarSesionEnMenu();
    </script>

</body>
</html>