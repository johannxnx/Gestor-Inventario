# Base de Datos

## Criterio de Implementacion

Para esta prueba tecnica se utilizo PostgreSQL como motor de base de datos.

El enunciado indica que el tipo y diseno de base de datos queda a criterio del desarrollador, por lo que se eligio una base de datos relacional.

A mi criterio, una base de datos relacional era una buena opcion porque es con la que tengo mayor familiarizacion y se adaptaba mejor al manejo de un catalogo de productos.

PostgreSQL permite almacenar la informacion de los productos de forma estructurada y centralizada. Ademas es gratuito, de codigo abierto, y compatible con Windows, Linux y macOS.

Tambien se tomaron nombres de productos y categorias de ejemplo, ya que el enunciado permite utilizar los nombres de servicios y productos que se deseen.

## Informacion General

- Motor de base de datos: PostgreSQL
- Servidor: localhost
- Puerto: 5432
- Base de datos: gestorinventario
- Tablas: `productos`, `usuarios`

## Tabla `productos`

La tabla `productos` almacena la informacion principal del catalogo.

```sql
CREATE TABLE productos (
    id          SERIAL PRIMARY KEY,
    codigo      VARCHAR(50)     NOT NULL,
    nombre      VARCHAR(100)    NOT NULL,
    descripcion VARCHAR(255),
    precio      DECIMAL(10,2)   NOT NULL,
    categoria   VARCHAR(100)    NOT NULL,
    created_at  TIMESTAMP       DEFAULT NOW()
);
```

### Campos

| Campo        | Tipo           | Descripcion                              |
|--------------|----------------|------------------------------------------|
| `id`         | SERIAL         | Identificador unico, autoincremental     |
| `codigo`     | VARCHAR(50)    | Codigo interno del producto              |
| `nombre`     | VARCHAR(100)   | Nombre del producto                      |
| `descripcion`| VARCHAR(255)   | Descripcion general (opcional)           |
| `precio`     | DECIMAL(10,2)  | Precio del producto                      |
| `categoria`  | VARCHAR(100)   | Categoria a la que pertenece             |
| `created_at` | TIMESTAMP      | Fecha de registro (se llena sola)        |

---

## Tabla `usuarios`

La tabla `usuarios` almacena las credenciales de los usuarios que pueden acceder al sistema.
Las contraseñas se guardan como hash de bcrypt, nunca en texto plano.

```sql
CREATE TABLE usuarios (
    id            SERIAL PRIMARY KEY,
    usuario       VARCHAR(50)     NOT NULL UNIQUE,
    password_hash VARCHAR(255)    NOT NULL,
    created_at    TIMESTAMP       DEFAULT NOW()
);
```

### Campos

| Campo           | Tipo          | Descripcion                                      |
|-----------------|---------------|--------------------------------------------------|
| `id`            | SERIAL        | Identificador unico, autoincremental             |
| `usuario`       | VARCHAR(50)   | Nombre de usuario (unico)                        |
| `password_hash` | VARCHAR(255)  | Contrasena hasheada con bcrypt (salt rounds: 10) |
| `created_at`    | TIMESTAMP     | Fecha de creacion del usuario                    |

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
DB_USER=postgres
DB_PASSWORD=tu_password_postgres
DB_SERVER=localhost
DB_NAME=gestorinventario
DB_PORT=5432

SESSION_SECRET=una_clave_secreta_larga_y_aleatoria
```

No se recomienda subir credenciales reales al repositorio.

> `SESSION_SECRET` se usa para firmar las cookies de sesion. Debe ser un valor largo y aleatorio en produccion.
