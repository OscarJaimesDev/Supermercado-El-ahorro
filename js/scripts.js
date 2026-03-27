// scripts.js — Inicialización general
document.addEventListener("DOMContentLoaded", () => {

  // ── Validaciones ──
  const formulario = document.getElementById("form-registro");
  if (formulario) formulario.addEventListener("submit", validarFormularioRegistro);
  activarValidacionEnTiempoReal();
  actualizarIndicadorFortaleza();

  // ── Carrito ──
  const btnAbrir   = document.getElementById("btn-carrito");
  const btnCerrar  = document.getElementById("btn-cerrar-carrito");
  const btnVaciar  = document.getElementById("btn-vaciar-carrito");
  if (btnAbrir)  btnAbrir.addEventListener("click", abrirCarrito);
  if (btnCerrar) btnCerrar.addEventListener("click", cerrarCarrito);
  if (btnVaciar) btnVaciar.addEventListener("click", vaciarCarrito);
  actualizarVistaCarrito();

  // ── Filtros ──
  inicializarBotonesCategoria();
  inicializarFiltroPrecio();
  activarBusquedaEnTiempoReal();
  const btnReset = document.getElementById("btn-resetear-filtros");
  if (btnReset) btnReset.addEventListener("click", resetearFiltros);

});

// ─────────────────────────────────────────────────────────────
//  CONTROL DE MENÚ SEGÚN ROL
//  Muestra u oculta enlaces según si el usuario es admin.
//  Se ejecuta al cargar cada página.
// ─────────────────────────────────────────────────────────────

/**
 * Verifica con el servidor si hay una sesión activa y cuál es el rol.
 * Ajusta el menú de navegación según el resultado.
 */
function verificarSesionEnMenu() {
    fetch('php/sesion_activa.php')
        .then(res => res.json())
        .then(data => {
            const linkVentas  = document.getElementById("link-ventas");
            const linkRegistro = document.getElementById("link-registro");
            const btnSesion   = document.getElementById("btn-sesion");

            if (data.activa) {
                // Usuario logueado: mostrar su nombre en el menú
                if (btnSesion) btnSesion.textContent = "Cerrar sesión (" + data.nombre + ")";
                if (btnSesion) btnSesion.onclick = () => window.location.href = "php/logout.php";

                // Ocultar el enlace de Registro si ya está logueado
                if (linkRegistro) linkRegistro.style.display = "none";

                // Mostrar Ventas solo si es administrador
                if (linkVentas) {
                    linkVentas.style.display = data.rol === "administrador" ? "block" : "none";
                }
            } else {
                // Sin sesión: ocultar Ventas, mostrar Registro
                if (linkVentas)   linkVentas.style.display   = "none";
                if (linkRegistro) linkRegistro.style.display = "block";
                if (btnSesion)    btnSesion.textContent       = "Iniciar sesión";
                if (btnSesion)    btnSesion.onclick = () => window.location.href = "login.html";
            }
        })
        .catch(() => {
            // Si falla la petición, ocultar Ventas por seguridad
            const linkVentas = document.getElementById("link-ventas");
            if (linkVentas) linkVentas.style.display = "none";
        });
}

