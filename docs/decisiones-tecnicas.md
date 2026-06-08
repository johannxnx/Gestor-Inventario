# Decisiones Tecnicas

Este documento explica el razonamiento detras de las principales elecciones de diseno y tecnologia del proyecto.

---

## 1. PostgreSQL como motor de base de datos

**Alternativas consideradas:** MySQL, SQLite, SQL Server

**Decision:** PostgreSQL

**Razon:**

Se eligio PostgreSQL por ser un motor de base de datos relacional gratuito, de codigo abierto y compatible con todos los entornos donde corre el proyecto (Windows local y Ubuntu en EC2). Se adapta bien al tipo de datos del proyecto: un catalogo de productos con campos numericos (precios con decimales exactos via `DECIMAL(10,2)`) y texto estructurado.

PostgreSQL ofrece un buen equilibrio entre facilidad de uso, robustez y compatibilidad multiplataforma. pgAdmin simplifica la administracion visual de la base de datos durante el desarrollo.

---

## 2. Autenticacion basada en sesiones en lugar de JWT

**Alternativas consideradas:** JWT (JSON Web Tokens), OAuth

**Decision:** express-session con cookies httpOnly

**Razon:**

Para un sistema interno de uso local, las sesiones del lado del servidor son una opcion mas simple y segura que JWT:

- **Revocacion inmediata:** cerrar sesion destruye la sesion en el servidor al instante. Con JWT el token sigue siendo valido hasta que expira aunque el usuario haya cerrado sesion.
- **Sin estado en el cliente:** el navegador solo guarda una cookie con el ID de sesion, no datos sensibles del usuario.
- **httpOnly:** la cookie no es accesible desde JavaScript, lo que protege contra ataques XSS.
- **Complejidad reducida:** no se necesita manejar refresh tokens, blacklists de tokens ni logica adicional en el cliente.

JWT seria preferible si hubiera multiples servicios o una app movil consumiendo la misma API, pero para este caso de uso no aporta ventajas.

---

## 3. Express 5 como framework de backend

**Alternativas consideradas:** Fastify, NestJS, Hono

**Decision:** Express 5

**Razon:**

Express es el framework mas establecido del ecosistema Node.js. La version 5 agrega manejo nativo de errores en funciones async (ya no se necesita `try/catch` obligatorio para que los errores lleguen al error handler), lo que simplifica el codigo de los controladores.

Se descarto NestJS por agregar una capa de complejidad (decoradores, modulos, inyeccion de dependencias) innecesaria para el alcance de este proyecto. Fastify y Hono son opciones validas pero Express tiene mayor ecosistema de middlewares compatibles, como `express-session`.

---

## 4. React 19 con Vite para el frontend

**Alternativas consideradas:** Vue 3, Angular, Next.js

**Decision:** React 19 + Vite

**Razon:**

React es la libreria de UI con mayor adopcion en la industria y con la que hay mayor familiarizacion. Vite reemplaza a Create React App como herramienta de build por ser significativamente mas rapido en desarrollo (HMR instantaneo) y generar builds de produccion optimizados.

Se descarto Next.js porque el proyecto no requiere SSR (Server Side Rendering) ni generacion estatica: es una SPA (Single Page Application) con autenticacion propia y no necesita renderizado en el servidor.

---

## 5. Consultas parametrizadas para prevenir SQL Injection

**Decision:** usar parametros `$1`, `$2`, `$3`... del driver `pg` en todas las consultas

**Razon:**

Nunca se concatenan valores del usuario directamente en el SQL. En su lugar, cada valor se pasa como parametro posicional. Esto garantiza que aunque alguien envie codigo SQL malicioso en un campo del formulario, el driver lo trata como un valor de dato y no como parte de la consulta.

**Ejemplo de lo que NO se hace:**
```typescript
// INSEGURO - vulnerable a SQL Injection
pool.query(`SELECT * FROM usuarios WHERE usuario = '${usuario}'`)
```

**Lo que SÍ se hace:**
```typescript
// SEGURO - parametro posicional
pool.query("SELECT * FROM usuarios WHERE usuario = $1", [usuario])
```

---

## 6. Separacion frontend / backend en puertos distintos

**Decision:** backend en puerto 3001, frontend en puerto 5173

**Razon:**

Mantener el frontend y backend como proyectos independientes permite:

- Desarrollar y desplegar cada parte de forma independiente
- Escalar cada capa por separado si fuera necesario
- Claridad en la arquitectura: el frontend es solo un cliente que consume la API REST

CORS esta configurado explicitamente con `credentials: true` y un `origin` especifico (no `*`) para permitir el intercambio de cookies de sesion entre los dos puertos de forma segura.

---

## 7. bcryptjs para el hashing de contrasenas

**Alternativas consideradas:** crypto (modulo nativo de Node), argon2

**Decision:** bcryptjs

**Razon:**

bcrypt es el estandar mas utilizado para hashing de contrasenas en aplicaciones web. Se eligio `bcryptjs` (implementacion pura en JavaScript) sobre el modulo nativo `crypto` porque:

- `crypto` no tiene una funcion de hashing de contrasenas con salt incorporado listo para usar.
- bcrypt incorpora un salt automatico y un factor de costo configurable (salt rounds), lo que lo hace resistente a ataques de fuerza bruta y rainbow tables.
- Se uso `salt rounds: 10`, que es el valor estandar recomendado: suficientemente seguro sin impactar el rendimiento de forma notable.

argon2 es tecnicamente superior a bcrypt pero requiere dependencias nativas de compilacion, lo que complica la instalacion en distintos entornos. Para el alcance de este proyecto, bcrypt es mas que suficiente.
