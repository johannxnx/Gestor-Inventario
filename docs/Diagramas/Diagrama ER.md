# Diagrama Entidad-Relacion (ER)

Representa las tablas de la base de datos `GestorInventario`, sus campos, tipos y la relacion entre ellas.

---

## Diagrama

```mermaid
erDiagram
    USUARIOS {
        int id PK "IDENTITY(1,1)"
        nvarchar_50 usuario "NOT NULL UNIQUE"
        nvarchar_255 password_hash "NOT NULL"
        datetime created_at "DEFAULT GETDATE()"
    }

    PRODUCTOS {
        int id PK "IDENTITY(1,1)"
        varchar_50 codigo "NOT NULL"
        varchar_100 nombre "NOT NULL"
        varchar_255 descripcion "NULL"
        decimal_10_2 precio "NOT NULL"
        varchar_100 categoria "NOT NULL"
        datetime created_at "DEFAULT GETDATE()"
    }
```

Las tablas no tienen relacion directa entre si en la base de datos. `usuarios` gestiona el acceso al sistema y `productos` almacena el catalogo. La conexion entre ambas ocurre a nivel de aplicacion: el backend verifica la sesion del usuario antes de permitir operaciones sobre productos.

---

## Descripcion de tablas

### `usuarios`

Almacena las credenciales de acceso al sistema.

| Campo          | Tipo           | Restriccion   | Descripcion                              |
|----------------|----------------|---------------|------------------------------------------|
| id             | INT            | PK, IDENTITY  | Identificador unico autoincremental      |
| usuario        | NVARCHAR(50)   | NOT NULL, UNIQUE | Nombre de usuario (no se puede repetir) |
| password_hash  | NVARCHAR(255)  | NOT NULL      | Contrasena hasheada con bcrypt           |
| created_at     | DATETIME       | DEFAULT NOW   | Fecha de creacion del registro           |

### `productos`

Almacena el catalogo de productos del inventario.

| Campo       | Tipo           | Restriccion  | Descripcion                           |
|-------------|----------------|--------------|---------------------------------------|
| id          | INT            | PK, IDENTITY | Identificador unico autoincremental   |
| codigo      | VARCHAR(50)    | NOT NULL     | Codigo interno del producto           |
| nombre      | VARCHAR(100)   | NOT NULL     | Nombre descriptivo del producto       |
| descripcion | VARCHAR(255)   | NULL         | Descripcion opcional del producto     |
| precio      | DECIMAL(10,2)  | NOT NULL     | Precio con hasta 2 decimales          |
| categoria   | VARCHAR(100)   | NOT NULL     | Categoria a la que pertenece          |
| created_at  | DATETIME       | DEFAULT NOW  | Fecha en que se registro el producto  |

---

## Script SQL completo

```sql
CREATE DATABASE GestorInventario;
GO

USE GestorInventario;
GO

CREATE TABLE productos (
    id          INT PRIMARY KEY IDENTITY(1,1),
    codigo      VARCHAR(50)    NOT NULL,
    nombre      VARCHAR(100)   NOT NULL,
    descripcion VARCHAR(255),
    precio      DECIMAL(10,2)  NOT NULL,
    categoria   VARCHAR(100)   NOT NULL,
    created_at  DATETIME       DEFAULT GETDATE()
);

CREATE TABLE usuarios (
    id            INT PRIMARY KEY IDENTITY(1,1),
    usuario       NVARCHAR(50)   NOT NULL UNIQUE,
    password_hash NVARCHAR(255)  NOT NULL,
    created_at    DATETIME       DEFAULT GETDATE()
);
```
