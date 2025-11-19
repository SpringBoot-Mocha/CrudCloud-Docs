---
id: overview
title: Autenticación en el Frontend
---

# Autenticación en el Frontend

El frontend de CrudCloud implementa un flujo de autenticación basado en **tokens** y gestionado a través de **contextos** y **servicios de API**, manteniendo la lógica sensible en el backend.

La autenticación es necesaria para acceder a:

- El **Dashboard**
- La gestión de **instancias**
- La vista de **planes** y **pagos**
- Cualquier otra sección protegida de la aplicación

## Objetivos del sistema de autenticación

- Proteger las rutas internas del dashboard.
- Mantener el estado de sesión del usuario de forma clara y centralizada.
- Integrarse con los endpoints de autenticación del backend (login, registro, refresh, etc.).
- Ofrecer una UX fluida (redirecciones automáticas, mensajes de error claros, etc.).

## Componentes principales

En el frontend, la autenticación se apoya en tres piezas clave:

1. **Contexto de autenticación**
2. **Servicios de autenticación (API)**
3. **Rutas y componentes protegidos**

### 1. Contexto de autenticación

El contexto (por ejemplo `AuthContext`) se encarga de:

- Guardar el estado de sesión:
  - Usuario autenticado (datos básicos).
  - Token o información necesaria para llamar al backend.
- Exponer acciones como:
  - `login(credentials)`
  - `logout()`
  - `refreshSession()` (si aplica)
- Hacer accesible este estado en toda la aplicación mediante un `AuthProvider`.

Desde los componentes se suele acceder al contexto a través de un hook como `useAuth`.

### 2. Servicios de autenticación (API)

Los servicios de autenticación encapsulan las llamadas al backend:

- `login`:
  - Envía las credenciales del usuario al backend.
  - Recibe el token y los datos del usuario.
- `register` (si existe registro desde el frontend):
  - Envía los datos del nuevo usuario.
  - Opcionalmente inicia sesión automáticamente tras el registro.
- `refresh` (si se maneja refresh token):
  - Solicita un nuevo token antes de que expire el actual.
- `logout`:
  - Limpia tokens en el frontend.
  - Opcionalmente notifica al backend.

Estos servicios utilizan la configuración de `src/api/` (cliente HTTP, interceptores, etc.).

### 3. Rutas y componentes protegidos

Las secciones internas (Dashboard, Instancias, Planes, Pagos…) se protegen mediante:

- Un componente `ProtectedRoute` que:
  - Verifica si el usuario está autenticado.
  - Si no lo está, redirige a `/login`.
- Layouts específicos (por ejemplo `DashboardLayout`) que solo se montan cuando la sesión es válida.

Esto garantiza que:

- Un usuario no autenticado no pueda ver rutas internas simplemente escribiendo la URL.
- Las rutas restringidas dependan siempre del estado global de autenticación.

## Flujo de inicio de sesión (login)

Un flujo típico de login en el frontend es:

1. El usuario abre la pantalla de **Login** (`/login`).
2. Completa el formulario con correo/usuario y contraseña.
3. El frontend llama a `authService.login(credentials)`.
4. Si el backend responde correctamente:
   - Se guardan los datos del usuario y el token en el contexto.
   - Opcionalmente se persiste la sesión (por ejemplo, en `localStorage`).
   - Se redirige al usuario al **Dashboard** (`/dashboard`).
5. Si hay error:
   - Se muestra un mensaje adecuado (credenciales inválidas, cuenta bloqueada, etc.).

## Flujo de cierre de sesión (logout)

Al cerrar sesión:

1. Se limpia el estado de autenticación en el contexto.
2. Se eliminan tokens almacenados localmente (si se usan).
3. Se redirige al usuario a una página pública (`/` o `/login`).

Esto ayuda a garantizar que:

- No queden restos de sesión en el navegador.
- El usuario no pueda seguir accediendo a rutas protegidas.

## Manejo de estado de sesión

Para mejorar la experiencia de usuario, el frontend puede:

- Verificar si existe una sesión previa al cargar la app (por ejemplo, leyendo tokens de `localStorage`).
- Intentar rehidratar el estado de usuario llamando a un endpoint de perfil o `me` en el backend.
- Mostrar estados de **carga** mientras se verifica la autenticación inicial (evitando parpadeos entre pantallas públicas/protegidas).

## Buenas prácticas

- Mantener las credenciales y tokens **fuera** del código (usar variables de entorno y almacenamiento seguro).
- No almacenar información sensible en `localStorage` si no es estrictamente necesario.
- Manejar expiración de tokens de forma clara:
  - Mensajes de sesión expirada.
  - Redirección al login cuando el backend responda con errores de autenticación (por ejemplo, 401).
- Mostrar siempre feedback en el login (errores, estado de carga, etc.).

---