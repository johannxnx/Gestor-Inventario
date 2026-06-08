# Endpoints de la API

Todos los endpoints tienen la base `http://localhost:3001`.

---

## Autenticacion

Rutas públicas — no requieren sesión activa.

Definidas en: `backend/src/routes/authRoutes.ts`
Lógica en: `backend/src/controllers/authController.ts`

---

### POST `/api/auth/login`

Recibe usuario y contraseña, verifica las credenciales contra la tabla `usuarios` y crea la sesión si son correctas.

**Body (JSON):**
```json
{
  "usuario": "admin",
  "password": "admin123"
}
```

**Respuesta exitosa `200`:**
```json
{
  "usuario": "admin"
}
```

**Respuesta de error `400`** — faltan campos:
```json
{ "error": "Usuario y contraseña son requeridos" }
```

**Respuesta de error `401`** — credenciales incorrectas:
```json
{ "error": "Usuario o contraseña incorrectos" }
```

---

### POST `/api/auth/logout`

Destruye la sesión activa en el servidor y borra la cookie `connect.sid` del navegador.

**Body:** ninguno

**Respuesta exitosa `200`:**
```json
{ "message": "Sesión cerrada correctamente" }
```

---

### GET `/api/auth/me`

Verifica si hay una sesión activa. El frontend lo llama al cargar la app para saber si el usuario ya estaba logueado.

**Body:** ninguno

**Respuesta exitosa `200`:**
```json
{ "usuario": "admin" }
```

**Respuesta de error `401`** — no hay sesión:
```json
{ "error": "No hay sesión activa" }
```

---

## Productos

Rutas protegidas — requieren sesión activa. Si no hay sesión, `requireAuth` responde `401` antes de llegar al controlador.

Definidas en: `backend/src/routes/productRoutes.ts`
Lógica en: `backend/src/controllers/productController.ts`
Middleware: `backend/src/middleware/authMiddleware.ts`

---

### GET `/api/productos`

Devuelve todos los productos registrados en la tabla `productos`.

**Body:** ninguno

**Respuesta exitosa `200`:**
```json
[
  {
    "id": 1,
    "codigo": "PROD-001",
    "nombre": "Cemento",
    "descripcion": "Saco de 50kg",
    "precio": 85.00,
    "categoria": "Construccion",
    "created_at": "2026-06-08T10:00:00.000Z"
  }
]
```

**Respuesta de error `500`** — fallo en la base de datos:
```json
{ "message": "Error obteniendo productos" }
```

---

### GET `/api/productos/:id`

Devuelve un solo producto por su `id`.

**Parámetro de URL:** `id` — número entero

**Ejemplo:** `GET /api/productos/3`

**Respuesta exitosa `200`:**
```json
{
  "id": 3,
  "codigo": "PROD-003",
  "nombre": "Arena",
  "descripcion": null,
  "precio": 45.00,
  "categoria": "Construccion",
  "created_at": "2026-06-08T10:00:00.000Z"
}
```

**Respuesta de error `400`** — id no es número:
```json
{ "message": "El id del producto debe ser un numero valido" }
```

**Respuesta de error `404`** — no existe:
```json
{ "message": "Producto no encontrado" }
```

---

### POST `/api/productos`

Crea un producto nuevo en la tabla `productos`.

**Body (JSON):**
```json
{
  "codigo": "PROD-010",
  "nombre": "Pintura blanca",
  "descripcion": "Galón de pintura interior",
  "precio": 120.00,
  "categoria": "Pintura"
}
```

> `descripcion` es opcional, puede omitirse o enviarse como `null`.

**Respuesta exitosa `201`:**
```json
{ "message": "Producto creado correctamente" }
```

**Respuesta de error `400`** — faltan campos obligatorios:
```json
{ "message": "Codigo, nombre, precio y categoria son obligatorios" }
```

---

### PUT `/api/productos/:id`

Actualiza todos los campos de un producto existente por su `id`.

**Parámetro de URL:** `id` — número entero

**Ejemplo:** `PUT /api/productos/3`

**Body (JSON):**
```json
{
  "codigo": "PROD-003",
  "nombre": "Arena fina",
  "descripcion": "Arena de río cernida",
  "precio": 50.00,
  "categoria": "Construccion"
}
```

**Respuesta exitosa `200`:**
```json
{ "message": "Producto actualizado correctamente" }
```

**Respuesta de error `400`** — id inválido o faltan campos:
```json
{ "message": "El id del producto debe ser un numero valido" }
```

**Respuesta de error `404`** — no existe:
```json
{ "message": "Producto no encontrado" }
```

---

### DELETE `/api/productos/:id`

Elimina un producto de la tabla `productos` por su `id`.

**Parámetro de URL:** `id` — número entero

**Ejemplo:** `DELETE /api/productos/3`

**Body:** ninguno

**Respuesta exitosa `200`:**
```json
{ "message": "Producto eliminado correctamente" }
```

**Respuesta de error `404`** — no existe:
```json
{ "message": "Producto no encontrado" }
```

---

## Resumen

| Método | Endpoint              | Archivo de ruta         | Controlador              | Protegido | Función                        |
|--------|-----------------------|-------------------------|--------------------------|-----------|--------------------------------|
| POST   | /api/auth/login       | authRoutes.ts           | authController.login     | No        | Inicia sesión                  |
| POST   | /api/auth/logout      | authRoutes.ts           | authController.logout    | No        | Cierra sesión                  |
| GET    | /api/auth/me          | authRoutes.ts           | authController.getMe     | No        | Verifica sesión activa         |
| GET    | /api/productos        | productRoutes.ts        | productController.getProductos     | Sí | Lista todos los productos |
| GET    | /api/productos/:id    | productRoutes.ts        | productController.getProductoById  | Sí | Obtiene un producto      |
| POST   | /api/productos        | productRoutes.ts        | productController.createProducto   | Sí | Crea un producto         |
| PUT    | /api/productos/:id    | productRoutes.ts        | productController.updateProducto   | Sí | Actualiza un producto    |
| DELETE | /api/productos/:id    | productRoutes.ts        | productController.deleteProducto   | Sí | Elimina un producto      |
