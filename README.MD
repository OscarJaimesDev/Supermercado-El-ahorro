# Supermercado El Ahorro

Sitio web completo para un supermercado desarrollado como proyecto final. Permite a los usuarios explorar productos, registrarse, iniciar sesión, agregar productos al carrito y registrar compras. Los administradores tienen acceso a un panel exclusivo con historial de ventas y gestión de usuarios.

---

## Tecnologías utilizadas

- **HTML5** — Estructura de las páginas
- **CSS3** — Diseño visual y responsivo
- **JavaScript** — Carrito de compras, filtros y validaciones
- **PHP 8** — Backend y lógica del servidor
- **MySQL / MariaDB** — Base de datos
- **PDO** — Conexión segura a la base de datos
- **XAMPP** — Entorno de desarrollo local

---

## Estructura del proyecto
```
/supermarket
├── index.html              Página de inicio
├── productos.html          Catálogo con filtros
├── registro.html           Formulario de registro
├── login.html              Inicio de sesión
├── ofertas.php             Ofertas exclusivas (requiere login)
├── admin.php               Panel de administración (solo admins)
├── ventas.php              Redirección a admin.php
├── /css
│   └── style.css           Estilos globales
├── /js
│   ├── carrito.js          Carrito de compras y localStorage
│   ├── filtros.js          Filtros de productos en tiempo real
│   ├── validaciones.js     Validaciones del formulario de registro
│   └── scripts.js          Inicialización y control del menú
├── /php
│   ├── conexion.php        Conexión PDO a la base de datos
│   ├── registro.php        Registrar nuevo usuario
│   ├── login.php           Iniciar sesión
│   ├── logout.php          Cerrar sesión
│   ├── guardar_venta.php   Registrar venta
│   └── sesion_activa.php   Consulta de sesión para el menú
├── /db
│   └── Supermercado.sql    Script de creación de la base de datos
└── /images
    └── /Productos          Imágenes de los productos
```

---

## Instalación y configuración

**Requisitos:** XAMPP (o cualquier servidor con Apache, PHP 8 y MySQL)

1. Clonar o copiar la carpeta del proyecto dentro de `htdocs` de XAMPP
2. Iniciar los servicios de **Apache** y **MySQL** desde el panel de XAMPP
3. Abrir **phpMyAdmin** en `http://localhost/phpmyadmin`
4. Crear la base de datos ejecutando el archivo `/db/Supermercado.sql`
5. Verificar que en `php/conexion.php` las credenciales coincidan con las de tu entorno:
```php
   $host = "localhost";
   $db   = "supermercado";
   $user = "root";
   $pass = "";
```
6. Abrir el sitio en `http://localhost/supermarket`

---

## Control de versiones

Este proyecto fue desarrollado de forma colaborativa usando **Git** y **GitHub**.

- **Git** — Control de versiones local mediante Git Bash
- **GitHub** — Repositorio remoto para sincronizar el trabajo entre los 3 integrantes

### Flujo de trabajo utilizado

Cada integrante trabajó en su rama según su área de responsabilidad:

- `frontend` — HTML y CSS (Persona 1)
- `javascript` — Archivos JS (Persona 2)  
- `backend` — PHP y base de datos (Persona 3)

Los cambios se integraron a la rama `main` mediante **pull requests** al finalizar cada módulo.

### Comandos principales utilizados
```bash
git init                         # Inicializar el repositorio
git clone <url>                  # Clonar el repositorio desde GitHub
git checkout -b nombre-rama      # Crear y cambiar a una nueva rama
git add .                        # Agregar todos los cambios al staging
git commit -m "descripcion"      # Confirmar los cambios con mensaje
git push origin nombre-rama      # Subir los cambios al repositorio remoto
git pull origin main             # Traer los últimos cambios de la rama principal
git merge nombre-rama            # Fusionar una rama con la actual
```

## Funcionalidades

### Usuarios
- Registro con validación en frontend y backend
- Inicio de sesión con verificación de contraseña encriptada
- Cierre de sesión que destruye la sesión del servidor
- Página de ofertas exclusiva para usuarios registrados

### Carrito de compras
- Agregar, eliminar y cambiar cantidades de productos
- Cálculo automático del total en tiempo real
- Persistencia del carrito con localStorage (sobrevive recargas)
- Confirmación antes de registrar la compra

### Catálogo de productos
- Filtro por categoría con botones interactivos
- Filtro por rango de precio mínimo y máximo
- Búsqueda por nombre en tiempo real
- Los tres filtros funcionan de forma combinada simultáneamente

### Panel de administración
- Acceso exclusivo para usuarios con rol `administrador`
- Historial completo de ventas con detalle de productos
- Lista de todos los usuarios registrados
- Opción para eliminar ventas

---

## Seguridad implementada

- **Prepared statements** con PDO en todas las consultas SQL
- **password_hash / password_verify** para almacenamiento seguro de contraseñas
- **session_regenerate_id** al autenticarse para prevenir session fixation
- **Verificación de sesión en PHP** en páginas protegidas (no solo en JavaScript)
- **htmlspecialchars** al mostrar datos de la base de datos para prevenir XSS
- **Transacciones de base de datos** en el registro de ventas
- **Validación doble** en cliente y servidor
- **Cálculo del total en el servidor** sin confiar en datos del cliente

---

## Base de datos

El sistema usa 4 tablas relacionadas:

| Tabla | Descripción |
|-------|-------------|
| `usuarios` | Datos de registro y rol de cada usuario |
| `productos` | Catálogo de productos con categoría y precio |
| `ventas` | Cabecera de cada venta con total y fecha |
| `ventas_detalle` | Detalle de productos por venta |

### Datos iniciales de productos

Después de ejecutar el script `Supermercado.sql`, insertar los productos con el siguiente comando:
```sql
INSERT INTO productos (nombre, categoria, precio, imagen) VALUES
('Manzana Roja',    'frutas',   3.50, 'images/Productos/manzana.jpg'),
('Banano',          'frutas',   2.50, 'images/Productos/banano.jpg'),
('Uvas Verdes',     'frutas',   4.00, 'images/Productos/uva.jpg'),
('Fresas 500g',     'frutas',   5.50, 'images/Productos/fresa.jpg'),
('Zanahoria',       'verduras', 1.50, 'images/Productos/zanahoria.jpg'),
('Cebolla',         'verduras', 2.20, 'images/Productos/cebolla.jpg'),
('Tomate Chonto',   'verduras', 3.00, 'images/Productos/tomate.jpg'),
('Papa Sabanera',   'verduras', 2.80, 'images/Productos/papa.jpg'),
('Leche Entera',    'lacteos',  1.20, 'images/Productos/leche.jpg'),
('Queso Campesino', 'lacteos',  4.50, 'images/Productos/queso.jpg'),
('Yogurt Fresa',    'lacteos',  2.50, 'images/Productos/yogurt.jpg'),
('Mantequilla',     'lacteos',  3.80, 'images/Productos/mantequilla.jpg'),
('Jugo Naranja',    'bebidas',  4.00, 'images/Productos/jugo.jpg'),
('Gaseosa 1.5L',    'bebidas',  2.50, 'images/Productos/gaseosa.jpg'),
('Agua Mineral',    'bebidas',  1.00, 'images/Productos/agua.jpg'),
('Six Pack Cerveza','bebidas',  6.00, 'images/Productos/cerveza.jpg'),
('Arroz 1kg',       'granos',   8.50, 'images/Productos/arroz.jpg');
```

---

## Roles de usuario

| Rol | Acceso |
|-----|--------|
| `cliente` | Inicio, productos, carrito, ofertas, su propio perfil |
| `administrador` | Todo lo anterior más el panel de administración |

Para crear un administrador, ejecutar en MySQL:
```sql
UPDATE usuarios SET rol = 'administrador' WHERE email = 'tu@email.com';
```

---

## Autores

Proyecto desarrollado en equipo como trabajo final de la materia.

---

## Repositorio

[https://github.com/OscarJaimesDev/Supermercado-El-ahorro.git] 