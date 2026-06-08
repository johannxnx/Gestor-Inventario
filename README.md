<div align="center">

# Gestor de Inventario

</div>

**Johan Moises Cardona Rosales**

---

Aplicacion web para administrar el catalogo de productos. Permite a usuarios autenticados consultar, crear, editar y eliminar productos desde una interfaz web con sesion persistente.

---

## Tecnologias

| Capa           | Tecnologia                            |
|----------------|---------------------------------------|
| Frontend       | React 19, TypeScript, Vite            |
| Backend        | Node.js, Express 5, TypeScript        |
| Base de datos  | PostgreSQL                            |
| Autenticacion  | express-session, bcryptjs             |
| HTTP Client    | Axios                                 |

---

## Funcionalidades

- Inicio de sesion con usuario y contrasena
- Sesion persistente con cookie httpOnly (dura 8 horas)
- Listado completo de productos en tabla interactiva
- Crear, editar y eliminar productos
- Validacion de campos obligatorios en formularios
- Rutas protegidas: solo usuarios autenticados acceden al inventario

---

## Requisitos previos

- Node.js v18 o superior
- PostgreSQL (local o remoto)

---

## Instalacion y uso

### 1. Configurar variables de entorno

Crear el archivo `backend/.env`:

```env
PORT=3001
DB_USER=postgres
DB_PASSWORD=tu_contrasena_postgres
DB_SERVER=localhost
DB_NAME=gestorinventario
DB_PORT=5432
SESSION_SECRET=una-clave-secreta-larga
FRONTEND_URL=http://localhost:5173
```

### 2. Crear la base de datos en PostgreSQL

```sql
CREATE TABLE productos (
    id          SERIAL PRIMARY KEY,
    codigo      VARCHAR(50)    NOT NULL,
    nombre      VARCHAR(100)   NOT NULL,
    descripcion VARCHAR(255),
    precio      DECIMAL(10,2)  NOT NULL,
    categoria   VARCHAR(100)   NOT NULL,
    created_at  TIMESTAMP      DEFAULT NOW()
);

CREATE TABLE usuarios (
    id            SERIAL PRIMARY KEY,
    usuario       VARCHAR(50)    NOT NULL UNIQUE,
    password_hash VARCHAR(255)   NOT NULL,
    created_at    TIMESTAMP      DEFAULT NOW()
);
```

### 3. Instalar dependencias

```bash
cd backend && npm install
cd ../frontend && npm install
```

### 4. Crear el usuario administrador inicial

```bash
cd backend
npm run seed
```

Crea el usuario `admin` con contrasena `admin123`.

### 5. Levantar el proyecto

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

Abrir en el navegador: `http://localhost:5173`

---

## Estructura del proyecto

```
Gestor-Inventario/
├── backend/
│   ├── src/
│   │   ├── controllers/    authController, productController
│   │   ├── database/       conexion PostgreSQL (Pool)
│   │   ├── middleware/     requireAuth
│   │   └── routes/         authRoutes, productRoutes
│   │   └── server.ts
│   └── scripts/
│       └── seedAdmin.ts    crea el usuario admin inicial
├── frontend/
│   └── src/
│       ├── components/     ProductForm, ProductTable
│       ├── pages/          LoginPage, ProductsPage
│       └── services/       authService, productService, axiosInstance
└── docs/
    ├── base-de-datos.md
    ├── decisiones-tecnicas.md
    ├── Diagramas/
    └── Manuales/
```

---

## Documentacion

| Documento | Descripcion |
|-----------|-------------|
| [Base de datos](docs/base-de-datos.md) | Schema de tablas y variables de entorno |
| [Decisiones tecnicas](docs/decisiones-tecnicas.md) | Justificacion de las elecciones de diseno |
| [Arquitectura general](docs/Diagramas/Diagrama%20de%20Arquitectura%20General.md) | Estructura y flujos de la aplicacion |
| [Flujo de login](docs/Diagramas/Diagrama%20de%20Flujo%20-%20Login.md) | Diagrama del proceso de autenticacion |
| [Endpoints](docs/Diagramas/endpoints.md) | Referencia completa de la API REST |
| [Manual de usuario](docs/Manuales/Manual%20de%20Usuario.md) | Guia de uso de la aplicacion |
| [Manual tecnico](docs/Manuales/Manual%20Tecnico.md) | Guia de instalacion y configuracion |
