// ─────────────────────────────────────────────────────────────
//  FILTRAR POR CATEGORÍA
//  Muestra solo los productos que pertenecen a la categoría
//  seleccionada. Si se elige "Todos", muestra todos.
// ─────────────────────────────────────────────────────────────

/**
 * Filtra las tarjetas de productos por categoría.
 * Recorre todos los elementos con clase "producto-card" y
 * oculta los que no coincidan con la categoría seleccionada.
 *
 * @param {string} categoria - Nombre de la categoría a filtrar,
 *                             o "todos" para mostrar todo.
 */
function filtrarPorCategoria(categoria) {
  const tarjetas = document.querySelectorAll(".producto-card");

  tarjetas.forEach(tarjeta => {
    // Cada tarjeta tiene un atributo data-categoria con su categoría
    const categoriaTarjeta = tarjeta.dataset.categoria.toLowerCase();
    const categoriaFiltro  = categoria.toLowerCase();

    if (categoriaFiltro === "todos" || categoriaTarjeta === categoriaFiltro) {
      tarjeta.style.display = "block"; // Mostrar
    } else {
      tarjeta.style.display = "none";  // Ocultar
    }
  });

  // Actualizar qué botón de categoría está activo visualmente
  actualizarBotonesCategoria(categoria);

  // Verificar si quedaron productos visibles
  verificarResultadosVacios();
}

// ─────────────────────────────────────────────────────────────
//  FILTRAR POR PRECIO
//  Muestra solo los productos cuyo precio esté dentro del
//  rango definido por el usuario con el slider o inputs.
// ─────────────────────────────────────────────────────────────

/**
 * Filtra los productos por rango de precio.
 * Solo muestra los productos cuyo precio esté entre
 * precioMin y precioMax.
 *
 * @param {number} precioMin - Precio mínimo del rango.
 * @param {number} precioMax - Precio máximo del rango.
 */
function filtrarPorPrecio(precioMin, precioMax) {
  const tarjetas = document.querySelectorAll(".producto-card");

  tarjetas.forEach(tarjeta => {
    // Cada tarjeta tiene data-precio con el precio numérico
    const precio = parseFloat(tarjeta.dataset.precio);

    if (precio >= precioMin && precio <= precioMax) {
      tarjeta.style.display = "block";
    } else {
      tarjeta.style.display = "none";
    }
  });

  verificarResultadosVacios();
}

// ─────────────────────────────────────────────────────────────
//  FILTRO COMBINADO
//  Aplica categoría Y precio al mismo tiempo.
//  Es la función principal que se usa cuando el usuario
//  tiene ambos filtros activos simultáneamente.
// ─────────────────────────────────────────────────────────────

/**
 * Aplica los filtros de categoría y precio al mismo tiempo.
 * Una tarjeta solo es visible si cumple AMBAS condiciones.
 */
function aplicarFiltrosCombinados() {
  const tarjetas = document.querySelectorAll(".tarjeta-producto");

  // Leer la categoría activa
  const btnActivo   = document.querySelector(".btn-categoria.activo");
  const categoriaActiva = btnActivo ? btnActivo.dataset.categoria.toLowerCase() : "todos";

  // Leer el rango de precio actual
  const inputMin = document.getElementById("precio-min");
  const inputMax = document.getElementById("precio-max");
  const precioMin = inputMin ? parseFloat(inputMin.value) || 0       : 0;
  const precioMax = inputMax ? parseFloat(inputMax.value) || Infinity : Infinity;

  // Leer el texto de búsqueda activo
  const inputBusqueda = document.getElementById("buscador");
  const textoBusqueda = inputBusqueda ? inputBusqueda.value.toLowerCase().trim() : "";

  tarjetas.forEach(tarjeta => {
    const categoriaTarjeta = tarjeta.dataset.categoria.toLowerCase();
    const precioTarjeta    = parseFloat(tarjeta.dataset.precio);
    const nombreTarjeta    = tarjeta.dataset.nombre.toLowerCase();

    // Condición 1: categoría coincide o es "todos"
    const pasaCategoria = categoriaActiva === "todos" || categoriaTarjeta === categoriaActiva;

    // Condición 2: precio dentro del rango
    const pasaPrecio = precioTarjeta >= precioMin && precioTarjeta <= precioMax;

    // Condición 3: nombre contiene el texto buscado
    const pasaBusqueda = textoBusqueda === "" || nombreTarjeta.includes(textoBusqueda);

    // Solo mostrar si pasa los tres filtros
    tarjeta.style.display = (pasaCategoria && pasaPrecio && pasaBusqueda) ? "block" : "none";
  });

  verificarResultadosVacios();
}

// ─────────────────────────────────────────────────────────────
//  BÚSQUEDA POR NOMBRE
//  Filtra los productos mientras el usuario escribe en
//  el campo de búsqueda, sin necesidad de presionar Enter.
// ─────────────────────────────────────────────────────────────

/**
 * Activa la búsqueda en tiempo real sobre el campo de texto.
 * Cada vez que el usuario escribe una letra, se aplican
 * todos los filtros combinados.
 */
function activarBusquedaEnTiempoReal() {
  const inputBusqueda = document.getElementById("buscador");
  if (!inputBusqueda) return;

  inputBusqueda.addEventListener("input", () => {
    aplicarFiltrosCombinados();
  });
}

// ─────────────────────────────────────────────────────────────
//  BOTONES DE CATEGORÍA
//  Maneja los clics sobre los botones de categoría y
//  actualiza cuál aparece visualmente como "activo".
// ─────────────────────────────────────────────────────────────

/**
 * Inicializa los botones de categoría.
 * Cada botón debe tener la clase "btn-categoria" y un
 * atributo data-categoria con el nombre de su categoría.
 */
function inicializarBotonesCategoria() {
  const botones = document.querySelectorAll(".btn-categoria");

  botones.forEach(boton => {
    boton.addEventListener("click", () => {
      const categoria = boton.dataset.categoria;
      actualizarBotonesCategoria(categoria);
      aplicarFiltrosCombinados();
    });
  });
}

/**
 * Marca visualmente el botón de la categoría activa
 * y quita la marca de los demás.
 * @param {string} categoriaActiva - Categoría seleccionada.
 */
function actualizarBotonesCategoria(categoriaActiva) {
  const botones = document.querySelectorAll(".btn-categoria");

  botones.forEach(boton => {
    if (boton.dataset.categoria.toLowerCase() === categoriaActiva.toLowerCase()) {
      boton.classList.add("activo");
    } else {
      boton.classList.remove("activo");
    }
  });
}

// ─────────────────────────────────────────────────────────────
//  SLIDER DE RANGO DE PRECIO
//  Permite al usuario definir un precio mínimo y máximo
//  usando inputs de tipo range o de tipo number.
// ─────────────────────────────────────────────────────────────

/**
 * Inicializa los controles de rango de precio.
 * Escucha cambios en los inputs y aplica el filtro combinado.
 */
function inicializarFiltroPrecio() {
  const inputMin   = document.getElementById("precio-min");
  const inputMax   = document.getElementById("precio-max");
  const labelMin   = document.getElementById("label-precio-min");
  const labelMax   = document.getElementById("label-precio-max");

  if (!inputMin || !inputMax) return;

  // Función interna para actualizar las etiquetas y filtrar
  function actualizarPrecio() {
    const min = parseFloat(inputMin.value) || 0;
    const max = parseFloat(inputMax.value) || Infinity;

    // Evitar que el mínimo supere al máximo
    if (min > max && max > 0) {
      inputMin.value = max;
    }

    // Actualizar las etiquetas visuales si existen
    if (labelMin) labelMin.textContent = formatearPrecio(parseFloat(inputMin.value) || 0);
    if (labelMax) labelMax.textContent = formatearPrecio(parseFloat(inputMax.value) || 0);

    aplicarFiltrosCombinados();
  }

  inputMin.addEventListener("input", actualizarPrecio);
  inputMax.addEventListener("input", actualizarPrecio);
}

// ─────────────────────────────────────────────────────────────
//  RESETEAR TODOS LOS FILTROS
//  Vuelve a mostrar todos los productos y limpia
//  los controles de filtro a su estado inicial.
// ─────────────────────────────────────────────────────────────

/**
 * Restablece todos los filtros a su valor por defecto:
 * - Categoría: "todos"
 * - Precio: rango completo
 * - Búsqueda: vacía
 */
function resetearFiltros() {
  // Limpiar el buscador
  const inputBusqueda = document.getElementById("buscador");
  if (inputBusqueda) inputBusqueda.value = "";

  // Resetear los inputs de precio a sus valores originales
  const inputMin = document.getElementById("precio-min");
  const inputMax = document.getElementById("precio-max");
  if (inputMin) inputMin.value = inputMin.min || 0;
  if (inputMax) inputMax.value = inputMax.max || 999999;

  // Marcar el botón "Todos" como activo
  actualizarBotonesCategoria("todos");

  // Mostrar todos los productos
  const tarjetas = document.querySelectorAll(".producto-card");
  tarjetas.forEach(t => t.style.display = "block");

  // Ocultar el mensaje de sin resultados
  const sinResultados = document.getElementById("sin-resultados");
  if (sinResultados) sinResultados.style.display = "none";
}

// ─────────────────────────────────────────────────────────────
//  VERIFICAR SI NO HAY RESULTADOS
//  Muestra un mensaje cuando ningún producto coincide
//  con los filtros aplicados.
// ─────────────────────────────────────────────────────────────

/**
 * Revisa si hay alguna tarjeta visible.
 * Si no hay ninguna, muestra el mensaje "Sin resultados".
 */
function verificarResultadosVacios() {
  const sinResultados = document.getElementById("sin-resultados");
  if (!sinResultados) return;

  const tarjetasVisibles = document.querySelectorAll(".producto-card[style*='block']");
  sinResultados.style.display = tarjetasVisibles.length === 0 ? "block" : "none";
}

// ─────────────────────────────────────────────────────────────
//  INICIALIZACIÓN DEL FILTRO
//  Agregar dentro del DOMContentLoaded que ya existe.
// ─────────────────────────────────────────────────────────────

//  Dentro del document.addEventListener("DOMContentLoaded") agregar:
//
//   inicializarBotonesCategoria();
//   inicializarFiltroPrecio();
//   activarBusquedaEnTiempoReal();
//
//   const btnReset = document.getElementById("btn-resetear-filtros");
//   if (btnReset) btnReset.addEventListener("click", resetearFiltros);