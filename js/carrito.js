// ─────────────────────────────────────────────────────────────
//  ESTADO DEL CARRITO
//  El carrito se guarda en un array de objetos en memoria.
//  Cada objeto representa un producto con su cantidad.
// ─────────────────────────────────────────────────────────────

/**
 * Array principal del carrito.
 * Cada item tiene la forma:
 * {
 *   id_producto     : number,
 *   nombre          : string,
 *   precio_unitario : number,
 *   cantidad        : number,
 *   imagen          : string
 * }
 */
let carrito = [];

// ─────────────────────────────────────────────────────────────
//  AGREGAR PRODUCTO AL CARRITO
// ─────────────────────────────────────────────────────────────

/**
 * Agrega un producto al carrito.
 * Si el producto ya existe, solo incrementa la cantidad.
 * Si es nuevo, lo agrega como un item nuevo.
 *
 * @param {number} id       - ID del producto.
 * @param {string} nombre   - Nombre del producto.
 * @param {number} precio   - Precio unitario del producto.
 * @param {string} imagen   - Ruta de la imagen del producto.
 */
function agregarAlCarrito(id, nombre, precio, imagen) {
  // Buscar si el producto ya existe en el carrito
  const itemExistente = carrito.find(item => item.id_producto === id);

  if (itemExistente) {
    // Si ya existe, solo aumentar la cantidad
    itemExistente.cantidad++;
  } else {
    // Si es nuevo, agregarlo al array
    carrito.push({
      id_producto     : id,
      nombre          : nombre,
      precio_unitario : precio,
      cantidad        : 1,
      imagen          : imagen
    });
  }

  actualizarVistaCarrito();
  mostrarNotificacion(`"${nombre}" agregado al carrito.`);
}

// ─────────────────────────────────────────────────────────────
//  ELIMINAR PRODUCTO DEL CARRITO
// ─────────────────────────────────────────────────────────────

/**
 * Elimina completamente un producto del carrito por su ID.
 * @param {number} id - ID del producto a eliminar.
 */
function eliminarDelCarrito(id) {
  // Filtrar el array dejando solo los productos que NO sean el eliminado
  carrito = carrito.filter(item => item.id_producto !== id);
  actualizarVistaCarrito();
}

// ─────────────────────────────────────────────────────────────
//  CAMBIAR CANTIDAD DE UN PRODUCTO
// ─────────────────────────────────────────────────────────────

/**
 * Aumenta o disminuye la cantidad de un producto en el carrito.
 * Si la cantidad llega a 0, el producto se elimina automáticamente.
 *
 * @param {number} id    - ID del producto.
 * @param {number} delta - Cantidad a sumar (+1) o restar (-1).
 */
function cambiarCantidad(id, delta) {
  const item = carrito.find(item => item.id_producto === id);

  if (!item) return;

  item.cantidad += delta;

  // Si la cantidad llega a 0 o menos, eliminar el producto
  if (item.cantidad <= 0) {
    eliminarDelCarrito(id);
    return;
  }

  actualizarVistaCarrito();
}

// ─────────────────────────────────────────────────────────────
//  VACIAR EL CARRITO COMPLETO
// ─────────────────────────────────────────────────────────────

/**
 * Elimina todos los productos del carrito de una vez.
 * Pide confirmación antes de proceder.
 */
function vaciarCarrito() {
  if (carrito.length === 0) return;

  const confirmar = confirm("¿Estás seguro de que quieres vaciar el carrito?");
  if (!confirmar) return;

  carrito = [];
  actualizarVistaCarrito();
}

// ─────────────────────────────────────────────────────────────
//  CALCULAR TOTALES
// ─────────────────────────────────────────────────────────────

/**
 * Calcula el número total de items en el carrito
 * (sumando las cantidades de todos los productos).
 * @returns {number}
 */
function calcularTotalItems() {
  return carrito.reduce((total, item) => total + item.cantidad, 0);
}

/**
 * Calcula el precio total del carrito.
 * @returns {number}
 */
function calcularTotalPrecio() {
  return carrito.reduce((total, item) => {
    return total + (item.precio_unitario * item.cantidad);
  }, 0);
}

/**
 * Formatea un número como precio con separador de miles y decimales.
 * Ejemplo: 12500 → "$12.500,00"
 * @param   {number} precio
 * @returns {string}
 */
function formatearPrecio(precio) {
  return "$" + precio.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

// ─────────────────────────────────────────────────────────────
//  ACTUALIZAR VISTA DEL CARRITO
//  Reconstruye el HTML del panel del carrito cada vez que
//  se agrega, elimina o cambia la cantidad de un producto.
// ─────────────────────────────────────────────────────────────

/**
 * Actualiza todo el contenido visual del carrito:
 * - Lista de productos
 * - Contador del ícono del carrito
 * - Total a pagar
 */
function actualizarVistaCarrito() {
  const lista          = document.getElementById("carrito-lista");
  const totalElemento  = document.getElementById("carrito-total");
  const contadorBadge  = document.getElementById("carrito-contador");

  // Actualizar el contador del ícono (ej: "3" en el badge del menú)
  if (contadorBadge) {
    const totalItems = calcularTotalItems();
    contadorBadge.textContent = totalItems;
    // Ocultar el badge si el carrito está vacío
    contadorBadge.style.display = totalItems === 0 ? "none" : "inline-block";
  }

  // Si no existe el contenedor de la lista, no continuar
  if (!lista) return;

  // Carrito vacío: mostrar mensaje
  if (carrito.length === 0) {
    lista.innerHTML = `
      <p class="carrito-vacio">Tu carrito está vacío.</p>
    `;
    if (totalElemento) totalElemento.textContent = formatearPrecio(0);
    return;
  }

  // Construir el HTML de cada producto en el carrito
  const itemsHTML = carrito.map(item => `
    <div class="carrito-item" data-id="${item.id_producto}">

      <img src="${item.imagen}" alt="${item.nombre}" class="carrito-item-img">

      <div class="carrito-item-info">
        <p class="carrito-item-nombre">${item.nombre}</p>
        <p class="carrito-item-precio">${formatearPrecio(item.precio_unitario)}</p>
      </div>

      <div class="carrito-item-controles">
        <!-- Botón para disminuir cantidad -->
        <button
          class="btn-cantidad"
          onclick="cambiarCantidad(${item.id_producto}, -1)"
          aria-label="Disminuir cantidad">−
        </button>

        <span class="carrito-item-cantidad">${item.cantidad}</span>

        <!-- Botón para aumentar cantidad -->
        <button
          class="btn-cantidad"
          onclick="cambiarCantidad(${item.id_producto}, +1)"
          aria-label="Aumentar cantidad">+
        </button>
      </div>

      <div class="carrito-item-subtotal">
        <p>${formatearPrecio(item.precio_unitario * item.cantidad)}</p>
        <!-- Botón para eliminar el producto -->
        <button
          class="btn-eliminar"
          onclick="eliminarDelCarrito(${item.id_producto})"
          aria-label="Eliminar producto">✕
        </button>
      </div>

    </div>
  `).join("");

  // Insertar los items y el total en el HTML
  lista.innerHTML = itemsHTML;
  if (totalElemento) {
    totalElemento.textContent = formatearPrecio(calcularTotalPrecio());
  }
}

// ─────────────────────────────────────────────────────────────
//  ABRIR Y CERRAR EL PANEL LATERAL DEL CARRITO
// ─────────────────────────────────────────────────────────────

/**
 * Abre el panel lateral del carrito agregando la clase "abierto".
 * El CSS de la Persona 1 se encarga de la animación de entrada.
 */
function abrirCarrito() {
  const panel = document.getElementById("carrito-panel");
  if (panel) panel.classList.add("abierto");
}

/**
 * Cierra el panel lateral del carrito.
 */
function cerrarCarrito() {
  const panel = document.getElementById("carrito-panel");
  if (panel) panel.classList.remove("abierto");
}

// ─────────────────────────────────────────────────────────────
//  NOTIFICACIÓN FLOTANTE
//  Muestra un pequeño mensaje temporal cuando se agrega
//  un producto al carrito.
// ─────────────────────────────────────────────────────────────

/**
 * Muestra una notificación flotante en la esquina de la pantalla.
 * Desaparece automáticamente después de 2.5 segundos.
 * @param {string} mensaje - Texto a mostrar.
 */
function mostrarNotificacion(mensaje) {
  const noti = document.getElementById("notificacion");
  if (!noti) return;

  noti.textContent = mensaje;
  noti.classList.add("visible");

  // Quitar la clase "visible" después de 2.5 segundos
  setTimeout(() => {
    noti.classList.remove("visible");
  }, 2500);
}

// ─────────────────────────────────────────────────────────────
//  PREPARAR DATOS PARA EL PHP (se usará el jueves)
//  Esta función convierte el carrito en el formato que
//  espera guardar_venta.php cuando se integre el backend.
// ─────────────────────────────────────────────────────────────

/**
 * Convierte el array del carrito al formato JSON que
 * necesita guardar_venta.php para registrar la venta.
 * @returns {string} JSON con los productos del carrito.
 */
function obtenerCarritoParaPHP() {
  const datos = carrito.map(item => ({
    id_producto     : item.id_producto,
    cantidad        : item.cantidad,
    precio_unitario : item.precio_unitario
  }));
  return JSON.stringify(datos);
}

// ─────────────────────────────────────────────────────────────
//  INICIALIZACIÓN DEL CARRITO
//  Se agrega dentro del DOMContentLoaded que ya existe.
// ─────────────────────────────────────────────────────────────

// Dentro del document.addEventListener("DOMContentLoaded") que
// ya tienes al final del archivo, agregar estas líneas:
//
//   const btnAbrirCarrito = document.getElementById("btn-carrito");
//   if (btnAbrirCarrito) {
//     btnAbrirCarrito.addEventListener("click", abrirCarrito);
//   }
//
//   const btnCerrarCarrito = document.getElementById("btn-cerrar-carrito");
//   if (btnCerrarCarrito) {
//     btnCerrarCarrito.addEventListener("click", cerrarCarrito);
//   }
//
//   const btnVaciar = document.getElementById("btn-vaciar-carrito");
//   if (btnVaciar) {
//     btnVaciar.addEventListener("click", vaciarCarrito);
//   }
//
//   // Inicializar la vista del carrito vacío al cargar la página
//   actualizarVistaCarrito();