// ─────────────────────────────────────────────────────────────
//  UTILIDADES GENERALES
// ─────────────────────────────────────────────────────────────

/**
 * Muestra un mensaje de error debajo de un campo.
 * @param {HTMLElement} campo   - El input que falló la validación.
 * @param {string}      mensaje - Texto del error a mostrar.
 */
function mostrarError(campo, mensaje) {
  const errorExistente = campo.parentElement.querySelector(".error-msg");
  if (!errorExistente) {
    const span = document.createElement("span");
    span.className = "error-msg";
    span.textContent = mensaje;
    // El span se inserta justo después del input en el DOM
    campo.parentElement.appendChild(span);
  }
  campo.classList.add("input-error"); // Agrega borde rojo al input
}

/**
 * Elimina el mensaje de error de un campo si existe.
 * @param {HTMLElement} campo - El input que pasó la validación.
 */
function limpiarError(campo) {
  const errorExistente = campo.parentElement.querySelector(".error-msg");
  if (errorExistente) errorExistente.remove();
  campo.classList.remove("input-error");
}

/**
 * Verifica si una cadena de texto está vacía o solo tiene espacios.
 * @param  {string}  valor - Texto a evaluar.
 * @returns {boolean}
 */
function estaVacio(valor) {
  return valor.trim() === "";
}

/**
 * Valida que un email tenga un formato correcto (usuario@dominio.ext).
 * @param  {string}  email - Email a evaluar.
 * @returns {boolean}
 */
function emailValido(email) {
  // Expresión regular estándar para validar emails
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email.trim());
}

/**
 * Valida que un número de teléfono tenga entre 7 y 15 dígitos.
 * Acepta espacios, guiones y paréntesis como separadores.
 * @param  {string}  telefono - Teléfono a evaluar.
 * @returns {boolean}
 */
function telefonoValido(telefono) {
  const soloDigitos = telefono.replace(/[\s\-().]/g, "");
  return /^\d{7,15}$/.test(soloDigitos);
}

/**
 * Valida que una contraseña cumpla los requisitos mínimos:
 * - Al menos 6 caracteres
 * - Al menos una letra mayúscula
 * - Al menos un número
 * @param  {string}  contrasena - Contraseña a evaluar.
 * @returns {boolean}
 */
function contrasenaValida(contrasena) {
  const minimoCaracteres = contrasena.length >= 6;
  const tieneMayuscula   = /[A-Z]/.test(contrasena);
  const tieneNumero      = /[0-9]/.test(contrasena);
  return minimoCaracteres && tieneMayuscula && tieneNumero;
}

// ─────────────────────────────────────────────────────────────
//  VALIDACIÓN INDIVIDUAL DE CADA CAMPO
//  Cada función valida un campo específico y muestra/limpia
//  su mensaje de error. Retorna true si el campo es válido.
// ─────────────────────────────────────────────────────────────

/**
 * Valida el campo Nombre.
 * Reglas: obligatorio, mínimo 2 caracteres, solo letras y espacios.
 */
function validarNombre(campo) {
  const valor = campo.value.trim();

  if (estaVacio(valor)) {
    mostrarError(campo, "El nombre es obligatorio.");
    return false;
  }
  if (valor.length < 2) {
    mostrarError(campo, "El nombre debe tener al menos 2 caracteres.");
    return false;
  }
  if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(valor)) {
    mostrarError(campo, "El nombre solo puede contener letras.");
    return false;
  }

  limpiarError(campo);
  return true;
}

/**
 * Valida el campo Apellido.
 * Reglas: obligatorio, mínimo 2 caracteres, solo letras y espacios.
 */
function validarApellido(campo) {
  const valor = campo.value.trim();

  if (estaVacio(valor)) {
    mostrarError(campo, "El apellido es obligatorio.");
    return false;
  }
  if (valor.length < 2) {
    mostrarError(campo, "El apellido debe tener al menos 2 caracteres.");
    return false;
  }
  if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(valor)) {
    mostrarError(campo, "El apellido solo puede contener letras.");
    return false;
  }

  limpiarError(campo);
  return true;
}

/**
 * Valida el campo Email.
 * Reglas: obligatorio, formato válido (usuario@dominio.ext).
 */
function validarEmail(campo) {
  const valor = campo.value.trim();

  if (estaVacio(valor)) {
    mostrarError(campo, "El email es obligatorio.");
    return false;
  }
  if (!emailValido(valor)) {
    mostrarError(campo, "Ingresa un email válido (ej: nombre@correo.com).");
    return false;
  }

  limpiarError(campo);
  return true;
}

/**
 * Valida el campo Teléfono.
 * Reglas: opcional, pero si se ingresa debe tener entre 7 y 15 dígitos.
 */
function validarTelefono(campo) {
  const valor = campo.value.trim();

  // El teléfono es opcional: si está vacío se acepta sin error
  if (estaVacio(valor)) {
    limpiarError(campo);
    return true;
  }
  if (!telefonoValido(valor)) {
    mostrarError(campo, "El teléfono debe tener entre 7 y 15 dígitos.");
    return false;
  }

  limpiarError(campo);
  return true;
}

/**
 * Valida el campo Contraseña.
 * Reglas: obligatoria, mínimo 6 caracteres, una mayúscula y un número.
 */
function validarContrasena(campo) {
  const valor = campo.value;

  if (estaVacio(valor)) {
    mostrarError(campo, "La contraseña es obligatoria.");
    return false;
  }
  if (valor.length < 6) {
    mostrarError(campo, "La contraseña debe tener al menos 6 caracteres.");
    return false;
  }
  if (!/[A-Z]/.test(valor)) {
    mostrarError(campo, "La contraseña debe tener al menos una mayúscula.");
    return false;
  }
  if (!/[0-9]/.test(valor)) {
    mostrarError(campo, "La contraseña debe tener al menos un número.");
    return false;
  }

  limpiarError(campo);
  return true;
}

/**
 * Valida que la confirmación de contraseña coincida con la contraseña.
 * @param {HTMLElement} campoConfirm  - Input de confirmación.
 * @param {HTMLElement} campoPassword - Input de contraseña original.
 */
function validarConfirmacion(campoConfirm, campoPassword) {
  if (campoConfirm.value !== campoPassword.value) {
    mostrarError(campoConfirm, "Las contraseñas no coinciden.");
    return false;
  }

  limpiarError(campoConfirm);
  return true;
}

// ─────────────────────────────────────────────────────────────
//  VALIDACIÓN COMPLETA DEL FORMULARIO
//  Se ejecuta al hacer clic en "Registrarse".
//  Valida todos los campos y solo envía si todos pasan.
// ─────────────────────────────────────────────────────────────

/**
 * Valida todos los campos del formulario de registro.
 * Si todos son válidos, permite el envío al servidor (PHP).
 * Si alguno falla, detiene el envío y muestra los errores.
 * @param {Event} evento - El evento submit del formulario.
 */
function validarFormularioRegistro(evento) {
  // Detener el envío del formulario hasta validar
  evento.preventDefault();

  // Obtener todos los campos del formulario
  const nombre    = document.getElementById("nombre");
  const apellido  = document.getElementById("apellido");
  const email     = document.getElementById("email");
  const telefono  = document.getElementById("telefono");
  const password  = document.getElementById("password");
  const confirmar = document.getElementById("confirmar_password");

  // Ejecutar cada validación y guardar el resultado
  // Se evalúan TODAS (sin cortocircuito) para mostrar todos los errores a la vez
  const resultados = [
    validarNombre(nombre),
    validarApellido(apellido),
    validarEmail(email),
    validarTelefono(telefono),
    validarContrasena(password),
    validarConfirmacion(confirmar, password),
  ];

  // Si todos los campos son válidos, enviar el formulario
  const formularioValido = resultados.every(r => r === true);

  if (formularioValido) {
    // Aquí el formulario se enviará al PHP (registro.php)
    // Por ahora mostramos un mensaje de éxito de prueba
    mostrarMensajeExito("¡Registro exitoso! Bienvenido al supermercado.");
    // Cuando el backend esté listo, reemplazar la línea anterior por:
    // evento.target.submit();
  }
}

// ─────────────────────────────────────────────────────────────
//  VALIDACIÓN EN TIEMPO REAL (campo por campo al salir del input)
//  Valida cada campo en el momento en que el usuario lo abandona,
//  para dar retroalimentación inmediata sin esperar al submit.
// ─────────────────────────────────────────────────────────────

/**
 * Agrega validación en tiempo real a cada campo del formulario.
 * El evento "blur" se dispara cuando el usuario sale de un campo.
 */
function activarValidacionEnTiempoReal() {
  const nombre    = document.getElementById("nombre");
  const apellido  = document.getElementById("apellido");
  const email     = document.getElementById("email");
  const telefono  = document.getElementById("telefono");
  const password  = document.getElementById("password");
  const confirmar = document.getElementById("confirmar_password");

  if (nombre)    nombre.addEventListener("blur",    () => validarNombre(nombre));
  if (apellido)  apellido.addEventListener("blur",  () => validarApellido(apellido));
  if (email)     email.addEventListener("blur",     () => validarEmail(email));
  if (telefono)  telefono.addEventListener("blur",  () => validarTelefono(telefono));
  if (password)  password.addEventListener("blur",  () => validarContrasena(password));
  if (confirmar) confirmar.addEventListener("blur", () => validarConfirmacion(confirmar, password));
}

// ─────────────────────────────────────────────────────────────
//  INDICADOR DE FORTALEZA DE CONTRASEÑA
//  Muestra visualmente qué tan segura es la contraseña
//  mientras el usuario la escribe.
// ─────────────────────────────────────────────────────────────

/**
 * Calcula la fortaleza de una contraseña en una escala de 0 a 4.
 * @param   {string} contrasena
 * @returns {number} Puntuación entre 0 y 4.
 */
function calcularFortaleza(contrasena) {
  let puntos = 0;
  if (contrasena.length >= 6)  puntos++; // Longitud mínima
  if (contrasena.length >= 10) puntos++; // Longitud recomendada
  if (/[A-Z]/.test(contrasena)) puntos++; // Tiene mayúscula
  if (/[0-9]/.test(contrasena)) puntos++; // Tiene número
  if (/[^a-zA-Z0-9]/.test(contrasena)) puntos++; // Tiene símbolo (!@#...)
  return Math.min(puntos, 4); // Máximo 4
}

/**
 * Actualiza el indicador visual de fortaleza en el HTML.
 * Requiere un elemento con id="fortaleza-bar" en el formulario.
 */
function actualizarIndicadorFortaleza() {
  const password = document.getElementById("password");
  const barra    = document.getElementById("fortaleza-bar");
  const texto    = document.getElementById("fortaleza-texto");

  if (!password || !barra) return; // Si no existe el elemento, no hacer nada

  const niveles = [
    { label: "",          color: "#e0e0e0" }, // 0 - Vacío
    { label: "Débil",     color: "#e53935" }, // 1 - Rojo
    { label: "Regular",   color: "#fb8c00" }, // 2 - Naranja
    { label: "Buena",     color: "#fdd835" }, // 3 - Amarillo
    { label: "Muy fuerte",color: "#43a047" }, // 4 - Verde
  ];

  password.addEventListener("input", () => {
    const puntos = calcularFortaleza(password.value);
    const nivel  = niveles[puntos];

    // Actualizar ancho y color de la barra
    barra.style.width      = `${puntos * 25}%`;
    barra.style.background = nivel.color;

    // Actualizar texto descriptivo
    if (texto) texto.textContent = nivel.label;
  });
}

// ─────────────────────────────────────────────────────────────
//  MENSAJE DE ÉXITO
// ─────────────────────────────────────────────────────────────

/**
 * Muestra un mensaje de éxito en pantalla tras un registro exitoso.
 * @param {string} mensaje - Texto a mostrar.
 */
function mostrarMensajeExito(mensaje) {
  const contenedor = document.getElementById("mensaje-exito");
  if (contenedor) {
    contenedor.textContent = mensaje;
    contenedor.style.display = "block";
    // Ocultar el mensaje después de 4 segundos
    setTimeout(() => { contenedor.style.display = "none"; }, 4000);
  }
}

// ─────────────────────────────────────────────────────────────
//  INICIALIZACIÓN
//  Todo lo que se ejecuta cuando la página termina de cargar.
// ─────────────────────────────────────────────────────────────

document.addEventListener("DOMContentLoaded", () => {

  // Enlazar el formulario de registro con su función de validación
  const formulario = document.getElementById("form-registro");
  if (formulario) {
    formulario.addEventListener("submit", validarFormularioRegistro);
  }

  // Activar la validación campo por campo en tiempo real
  activarValidacionEnTiempoReal();

  // Activar el indicador de fortaleza de contraseña
  actualizarIndicadorFortaleza();

});