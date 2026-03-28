// scripts.js — Inicialización general
document.addEventListener("DOMContentLoaded", () => {

  // ── Carrito: cargar desde localStorage y enlazar botones ──
  carrito = cargarCarritoLocal();

  const btnAbrir  = document.getElementById("btn-carrito");
  const btnCerrar = document.getElementById("btn-cerrar-carrito");
  const btnVaciar = document.getElementById("btn-vaciar-carrito");
  const btnPagar  = document.getElementById("btn-ir-pagar");

  if (btnAbrir)  btnAbrir.addEventListener("click", abrirCarrito);
  if (btnCerrar) btnCerrar.addEventListener("click", cerrarCarrito);
  if (btnVaciar) btnVaciar.addEventListener("click", vaciarCarrito);
  if (btnPagar)  btnPagar.addEventListener("click", confirmarVenta); // ← enlace que faltaba

  actualizarVistaCarrito();

  // ── Validaciones: solo activas en registro.html ──
  const formulario = document.getElementById("form-registro");
  if (formulario) {
    formulario.addEventListener("submit", validarFormularioRegistro);
    if (typeof activarValidacionEnTiempoReal === "function") activarValidacionEnTiempoReal();
    if (typeof actualizarIndicadorFortaleza  === "function") actualizarIndicadorFortaleza();
  }

  // ── Filtros: solo activos en productos.html ──
  if (typeof inicializarBotonesCategoria === "function") inicializarBotonesCategoria();
  if (typeof inicializarFiltroPrecio     === "function") inicializarFiltroPrecio();
  if (typeof activarBusquedaEnTiempoReal === "function") activarBusquedaEnTiempoReal();

  const btnReset = document.getElementById("btn-resetear-filtros");
  if (btnReset && typeof resetearFiltros === "function") {
    btnReset.addEventListener("click", resetearFiltros);
  }

  // ── Menú según sesión y rol ──
  verificarSesionEnMenu();

});

// ─────────────────────────────────────────────────────────────
//  CONTROL DE MENÚ SEGÚN ROL
// ─────────────────────────────────────────────────────────────
function verificarSesionEnMenu() {
  fetch("php/sesion_activa.php")
    .then(res => res.json())
    .then(data => {
      const linkVentas   = document.getElementById("link-ventas");
      const linkRegistro = document.getElementById("link-registro");
      const btnSesion    = document.getElementById("btn-sesion");

      if (data.activa) {
        if (btnSesion) {
          btnSesion.textContent = "Cerrar sesión (" + data.nombre + ")";
          btnSesion.onclick = () => window.location.href = "php/logout.php";
        }
        if (linkRegistro) linkRegistro.style.display = "none";
        if (linkVentas)   linkVentas.style.display   = data.rol === "administrador" ? "block" : "none";
      } else {
        if (btnSesion) {
          btnSesion.textContent = "Iniciar sesión";
          btnSesion.onclick = () => window.location.href = "login.html";
        }
        if (linkVentas)   linkVentas.style.display   = "none";
        if (linkRegistro) linkRegistro.style.display = "block";
      }
    })
    .catch(() => {
      const linkVentas = document.getElementById("link-ventas");
      if (linkVentas) linkVentas.style.display = "none";
    });
}