# Manual Tecnico
## Gestor de Inventario - 

## Descripcion del sistema

El Gestor de Inventario es una aplicacion web full-stack para administrar el catalogo de productos. Permite a usuarios autenticados realizar operaciones CRUD sobre productos a traves de una interfaz web.

---

## Stack tecnologico

| Capa        | Tecnologia                                      |
|-------------|-------------------------------------------------|
| Frontend    | React 19, TypeScript, Vite                      |
| Backend     | Node.js, Express 5, TypeScript                  |
| Base de datos | SQL Server                                    |
| Autenticacion | express-session, bcryptjs                    |
| HTTP Client | Axios (con withCredentials para cookies)        |

---

## Requisitos del sistema

### Para ejecutar el proyecto

- **Node.js** v18 o superior
- **npm** v9 o superior
- **SQL Server** (local o remoto) con la base de datos `GestorInventario` creada
- Sistema operativo: Windows, macOS o Linux

### Verificar versiones instaladas

```bash
node --version
npm --version
```

---

## Estructura del proyecto

```txt
Gestor-Inventario/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── authController.ts       login, logout, getMe
│   │   │   └── productController.ts    CRUD de productos
│   │   ├── database/
│   │   │   └── db.ts                   conexion a SQL Server
│   │   ├── middleware/
│   │   │   └── authMiddleware.ts       requireAuth (protege rutas)
│   │   └── routes/
│   │       ├── authRoutes.ts           rutas publicas /api/auth
│   │       └── productRoutes.ts        rutas protegidas /api/productos
│   │   └── server.ts                   entry point del servidor
│   ├── scripts/
│   │   └── seedAdmin.ts                crea el usuario admin inicial
│   ├── .env                            variables de entorno (no subir al repo)
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ProductForm.tsx         formulario crear/editar
│   │   │   └── ProductTable.tsx        tabla de productos
│   │   ├── interfaces/
│   │   │   └── Producto.ts             tipos TypeScript
│   │   ├── pages/
│   │   │   ├── LoginPage.tsx           pantalla de login
│   │   │   └── ProductsPage.tsx        pantalla principal
│   │   ├── services/
│   │   │   ├── authService.ts          llamadas login/logout/getMe
│   │   │   ├── axiosInstance.ts        axios con withCredentials
│   │   │   └── productService.ts       llamadas CRUD de productos
│   │   ├── App.tsx                     componente raiz con logica de sesion
│   │   ├── App.css                     estilos globales
│   │   └── main.tsx                    punto de entrada de React
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
│
└── docs/
    ├── base-de-datos.md
    ├── Diagramas/
    │   ├── Diagrama de Arquitectura General.md
    │   └── Diagrama de Flujo - Login.md
    └── Manuales/
        ├── Manual de Usuario.md
        └── Manual Tecnico.md
```

---

## Configuracion de la base de datos

### 1. Crear la base de datos

Ejecutar en SQL Server Management Studio o cualquier cliente SQL:

```sql
CREATE DATABASE GestorInventario;
```

### 2. Crear las tablas

```sql
USE GestorInventario;

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

---

## Instalacion y configuracion

### 1. Clonar el repositorio

```bash
git clone <url-del-repositorio>
cd Gestor-Inventario
```

### 2. Configurar variables de entorno del backend

Crear el archivo `backend/.env` con el siguiente contenido:

```env
DB_USER=tu_usuario_sql
DB_PASSWORD=tu_contrasena_sql
DB_SERVER=localhost
DB_NAME=GestorInventario
DB_PORT=1433

SESSION_SECRET=una_clave_secreta_larga_y_aleatoria
```

> `SESSION_SECRET` debe ser un string largo y aleatorio. En produccion nunca usar valores predecibles.

### 3. Instalar dependencias del backend

```bash
cd backend
npm install
```

### 4. Instalar dependencias del frontend

```bash
cd ../frontend
npm install
```

### 5. Crear el usuario administrador inicial

Desde la carpeta `backend`, ejecutar una sola vez:

```bash
npm run seed
```

Esto crea el usuario `admin` con contrasena `admin123` en la tabla `usuarios`. Cambiar la contrasena despues del primer ingreso.

---

## Ejecutar el proyecto en desarrollo

### Backend

```bash
cd backend
npm run dev
```

El servidor queda disponible en: `http://localhost:3001`

### Frontend

```bash
cd frontend
npm run dev
```

La aplicacion queda disponible en: `http://localhost:5173`

> Es necesario tener ambos servidores corriendo al mismo tiempo.

---

## Scripts disponibles

### Backend (`backend/package.json`)

| Comando         | Descripcion                                  |
|-----------------|----------------------------------------------|
| `npm run dev`   | Inicia el servidor en modo desarrollo        |
| `npm run build` | Compila TypeScript a JavaScript              |
| `npm run seed`  | Crea el usuario admin inicial en la BD       |

### Frontend (`frontend/package.json`)

| Comando          | Descripcion                                  |
|------------------|----------------------------------------------|
| `npm run dev`    | Inicia Vite en modo desarrollo               |
| `npm run build`  | Compila la app para produccion               |
| `npm run preview`| Previsualiza el build de produccion          |

---

## API - Endpoints disponibles

### Autenticacion (rutas publicas)

| Metodo | Endpoint          | Descripcion                         | Body requerido                  |
|--------|-------------------|-------------------------------------|---------------------------------|
| POST   | /api/auth/login   | Inicia sesion y crea la cookie      | `{ usuario, password }`         |
| POST   | /api/auth/logout  | Destruye la sesion y borra la cookie| —                               |
| GET    | /api/auth/me      | Devuelve el usuario de la sesion    | —                               |

### Productos (rutas protegidas — requieren sesion activa)

| Metodo | Endpoint              | Descripcion                   | Body requerido                                     |
|--------|-----------------------|-------------------------------|----------------------------------------------------|
| GET    | /api/productos        | Lista todos los productos     | —                                                  |
| GET    | /api/productos/:id    | Obtiene un producto por id    | —                                                  |
| POST   | /api/productos        | Crea un producto nuevo        | `{ codigo, nombre, precio, categoria, descripcion }`|
| PUT    | /api/productos/:id    | Actualiza un producto         | `{ codigo, nombre, precio, categoria, descripcion }`|
| DELETE | /api/productos/:id    | Elimina un producto           | —                                                  |

### Codigos de respuesta HTTP

| Codigo | Significado          | Cuando ocurre                                 |
|--------|----------------------|-----------------------------------------------|
| 200    | OK                   | Operacion exitosa                             |
| 201    | Created              | Producto creado correctamente                 |
| 400    | Bad Request          | Faltan campos obligatorios o datos invalidos  |
| 401    | Unauthorized         | No hay sesion activa o credenciales incorrectas|
| 404    | Not Found            | El producto con ese id no existe              |
| 500    | Internal Server Error| Error inesperado en el servidor               |

---

## Arquitectura y decisiones tecnicas

### Autenticacion basada en sesiones

Se utiliza `express-session` en lugar de JWT por ser un sistema interno sin necesidad de autenticacion entre microservicios. La sesion se almacena en memoria del servidor y se identifica mediante una cookie `httpOnly` llamada `connect.sid`.

- **httpOnly: true** — la cookie no es accesible desde JavaScript del navegador (protege contra XSS)
- **secure: false** — debe cambiarse a `true` en produccion con HTTPS
- **maxAge: 8 horas** — la sesion expira automaticamente

### Seguridad en consultas SQL

Todos los controladores usan consultas parametrizadas con `.input()` de `mssql` para evitar SQL Injection. Nunca se concatenan valores del usuario directamente en el SQL.

### Contrasenas

Las contrasenas se hashean con `bcryptjs` usando 10 salt rounds antes de guardarse en la base de datos. La comparacion se hace con `bcrypt.compare()`, que nunca requiere desencriptar el hash.

### Separacion de rutas publicas y protegidas

Las rutas de autenticacion (`/api/auth`) son publicas. Las rutas de productos (`/api`) pasan por el middleware `requireAuth` antes de llegar al controlador, lo que garantiza que solo usuarios autenticados puedan acceder.

### CORS con credenciales

El backend configura CORS con `credentials: true` y `origin` especifico (no `*`) para permitir que el navegador envie y reciba cookies entre el frontend (puerto 5173) y el backend (puerto 3001).

---

## Variables de entorno — referencia completa

| Variable        | Descripcion                              | Valor por defecto   |
|-----------------|------------------------------------------|---------------------|
| `DB_USER`       | Usuario de SQL Server                    | —                   |
| `DB_PASSWORD`   | Contrasena del usuario de SQL Server     | —                   |
| `DB_SERVER`     | Direccion del servidor SQL Server        | `localhost`         |
| `DB_NAME`       | Nombre de la base de datos               | —                   |
| `DB_PORT`       | Puerto de SQL Server                     | `1433`              |
| `SESSION_SECRET`| Clave para firmar las cookies de sesion  | `disagro-secret-dev`|
| `PORT`          | Puerto en el que corre el backend        | `3001`              |
| `FRONTEND_URL`  | URL del frontend para la config de CORS  | `http://localhost:5173` |

---

## Consideraciones para produccion

- Cambiar `secure: false` a `secure: true` en la configuracion de la cookie (requiere HTTPS)
- Usar un `SESSION_SECRET` largo y aleatorio generado de forma segura
- Configurar `FRONTEND_URL` con el dominio real del frontend
- Considerar usar un almacenamiento de sesiones persistente (como `connect-mssql-v2`) en lugar de memoria RAM para que las sesiones sobrevivan reinicios del servidor
- Cambiar la contrasena del usuario `admin` inmediatamente despues del primer ingreso
