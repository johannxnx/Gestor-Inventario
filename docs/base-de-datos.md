# Base de Datos

## Criterio de Implementacion

Para esta prueba tecnica se utilizo SQL Server como motor de base de datos.

El enunciado indica que el tipo y diseno de base de datos queda a criterio del desarrollador, por lo que se eligio SQL Server porque permite almacenar la informacion de los productos de forma estructurada, centralizada y porque ya se tenía familiaridad.

Tambien se tomaron nombres de productos y categorias de ejemplo, ya que el enunciado permite utilizar los nombres de servicios y productos que se deseen.

## Informacion General

- Motor de base de datos: SQL Server
- Servidor: localhost
- Puerto: 1433
- Base de datos: GestorInventario
- Tabla principal: productos

## Tabla Productos

La tabla `productos` almacena la informacion principal del catalogo.

```sql
CREATE TABLE productos (
    id INT PRIMARY KEY IDENTITY(1,1),
    codigo VARCHAR(50) NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    descripcion VARCHAR(255),
    precio DECIMAL(10,2) NOT NULL,
    categoria VARCHAR(100) NOT NULL,
    created_at DATETIME DEFAULT GETDATE()
);
```

## Campos de la Tabla

- `id`: identificador unico del producto.
- `codigo`: codigo interno del producto.
- `nombre`: nombre del producto.
- `descripcion`: descripcion general del producto.
- `precio`: precio del producto.
- `categoria`: categoria a la que pertenece el producto.
- `created_at`: fecha en que se registro el producto.

## Variables de Entorno

La conexion se configura por medio de variables de entorno en el archivo `.env`.

```env
DB_USER=tu_usuario
DB_PASSWORD=tu_password
DB_SERVER=localhost
DB_NAME=GestorInventario
DB_PORT=1433
```

No se recomienda subir credenciales reales al repositorio.
