# Diagrama de Flujo - Autenticacion

Este diagrama muestra paso a paso como funciona el proceso de login, verificacion de sesion y logout en la aplicacion.

---

## Flujo completo de autenticacion

```mermaid
flowchart TD
    A([Usuario abre la app]) --> B[App.tsx llama\nGET /api/auth/me]

    B --> C{¿Hay cookie\nde sesion valida?}

    C -- No / expirada --> D[/Muestra LoginPage/]
    C -- Si --> E[Backend devuelve\nnombre de usuario]
    E --> F[/Muestra navbar\n+ ProductsPage/]

    D --> G[Usuario ingresa\nusuario y contrasena]
    G --> H[Frontend envia\nPOST /api/auth/login]

    H --> I[Backend busca el usuario\nen la tabla usuarios]
    I --> J{¿Existe\nel usuario?}

    J -- No existe --> K[Backend responde 401]
    K --> L[/LoginPage muestra\nmensaje de error/]
    L --> G

    J -- Si existe --> M[bcrypt compara\ncontrasena con el hash]
    M --> N{¿Coincide?}

    N -- No coincide --> K
    N -- Si coincide --> O[Backend guarda userId\nen la sesion del servidor]
    O --> P[Servidor envia cookie\nconnect.sid al navegador]
    P --> F

    F --> Q[Usuario usa la app]
    Q --> R[Click en\nCerrar sesion]
    R --> S[Frontend envia\nPOST /api/auth/logout]
    S --> T[Backend destruye la sesion\ny borra la cookie]
    T --> D
```

---

## Flujo de una peticion protegida

Cada vez que el frontend pide datos de productos, la peticion pasa primero por el middleware `requireAuth`.

```mermaid
flowchart TD
    A([Frontend envia peticion\na /api/productos]) --> B[requireAuth revisa\nreq.session.userId]

    B --> C{¿Hay userId\nen la sesion?}

    C -- No hay userId --> D[Responde 401\nNo autorizado]
    D --> E([Frontend recibe el error])

    C -- Si hay userId --> F[La peticion pasa\nal controlador]
    F --> G[productController\nejenta la consulta SQL]
    G --> H[PostgreSQL devuelve\nlos datos]
    H --> I[Backend responde\ncon JSON]
    I --> J([Frontend actualiza la UI])
```

---

## Estados posibles de la sesion

```mermaid
stateDiagram-v2
    [*] --> Verificando : App carga

    Verificando --> SinSesion : GET /auth/me devuelve 401
    Verificando --> ConSesion : GET /auth/me devuelve usuario

    SinSesion --> ConSesion : Login exitoso
    ConSesion --> SinSesion : Logout

    SinSesion --> SinSesion : Login fallido
    ConSesion --> ConSesion : Peticiones a /api/productos
```
