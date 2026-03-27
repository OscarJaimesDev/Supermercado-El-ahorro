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