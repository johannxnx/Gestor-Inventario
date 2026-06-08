# Base de Datos

## Criterio de Implementacion

Para esta prueba tecnica se utilizo SQL Server como motor de base de datos.

El enunciado indica que el tipo y diseno de base de datos queda a criterio del desarrollador, por lo que se eligio una base de datos relacional.

A mi criterio, una base de datos relacional era una buena opcion porque es con la que tengo mayor familiarizacion y se adaptaba mejor al manejo de un catalogo de productos.

SQL Server permite almacenar la informacion de los productos de forma estructurada y centralizada.

Tambien se tomaron nombres de productos y categorias de ejemplo, ya que el enunciado permite utilizar los nombres de servicios y productos que se deseen.

## Informacion General

- Motor de base de datos: SQL Server
- Servidor: localhost
- Puerto: 1433
- Base de datos: GestorInventario
- Tablas: `productos`, `usuarios`

## Tabla `productos`

La tabla `productos` almacena la informacion principal del catalogo.

```sql
CREATE TABLE productos (
    id          INT PRIMARY KEY IDENTITY(1,1),
    codigo      VARCHAR(50)     NOT NULL,
    nombre      VARCHAR(100)    NOT NULL,
    descripcion VARCHAR(255),
    precio      DECIMAL(10,2)   NOT NULL,
    categoria   VARCHAR(100)    NOT NULL,
    created_at  DATETIME        DEFAULT GETDATE()
);
```

### Campos

| Campo        | Tipo           | Descripcion                              |
|--------------|----------------|------------------------------------------|
| `id`         | INT            | Identificador unico, autoincremental     |
| `codigo`     | VARCHAR(50)    | Codigo interno del producto              |
| `nombre`     | VARCHAR(100)   | Nombre del producto                      |
| `descripcion`| VARCHAR(255)   | Descripcion general (opcional)           |
| `precio`     | DECIMAL(10,2)  | Precio del producto                      |
| `categoria`  | VARCHAR(100)   | Categoria a la que pertenece             |
| `created_at` | DATETIME       | Fecha de registro (se llena sola)        |

---

## Tabla `usuarios`

La tabla `usuarios` almacena las credenciales de los usuarios que pueden acceder al sistema.
Las contraseñas se guardan como hash de bcrypt, nunca en texto plano.

```sql
CREATE TABLE usuarios (
    id            INT PRIMARY KEY IDENTITY(1,1),
    usuario       NVARCHAR(50)    NOT NULL UNIQUE,
    password_hash NVARCHAR(255)   NOT NULL,
    created_at    DATETIME        DEFAULT GETDATE()
);
```

### Campos

| Campo           | Tipo          | Descripcion                                      |
|-----------------|---------------|--------------------------------------------------|
| `id`            | INT           | Identificador unico, autoincremental             |
| `usuario`       | NVARCHAR(50)  | Nombre de usuario (unico)                        |
| `password_hash` | NVARCHAR(255) | Contrasena hasheada con bcrypt (salt rounds: 10) |
| `created_at`    | DATETIME      | Fecha de creacion del usuario                    |

### Crear el usuario administrador inicial

Ejecutar una sola vez desde la carpeta `backend`:

```bash
npm run seed
```

Esto crea el usuario `admin` con contrasena `admin123`. Cambiarla despues del primer ingreso.

---

## Variables de Entorno

La conexion y la sesion se configuran por medio de variables de entorno en el archivo `.env`.

```env
DB_USER=tu_usuario
DB_PASSWORD=tu_password
DB_SERVER=localhost
DB_NAME=GestorInventario
DB_PORT=1433

SESSION_SECRET=una_clave_secreta_larga_y_aleatoria
```

No se recomienda subir credenciales reales al repositorio.

> `SESSION_SECRET` se usa para firmar las cookies de sesion. Debe ser un valor largo y aleatorio en produccion.
