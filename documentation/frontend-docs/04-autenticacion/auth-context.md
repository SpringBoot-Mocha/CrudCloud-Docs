---
id: auth-context
title: AuthContext y Estado de Sesión
---

# AuthContext y Estado de Sesión

El AuthContext es el responsable de gestionar el estado de autenticación en el frontend de CrudCloud.
Centraliza toda la información relacionada con la sesión del usuario y expone funciones para iniciar y cerrar sesión.

## Responsabilidades del AuthContext

El contexto de autenticación se encarga de:

Almacenar el estado de sesión:

Usuario autenticado (datos básicos).

Token (o información equivalente para acceder al backend).

Exponer funciones de alto nivel para:

login(credentials)

logout()

(Opcional) refreshSession() o checkSession()

Sincronizar el estado con:

Servicios de autenticación (authService).

Almacenamiento local (localStorage / sessionStorage), si se utiliza.

Integrarse con:

Rutas protegidas (ProtectedRoute).

Interceptores del cliente HTTP (para añadir tokens a los requests).

## Estructura básica del AuthContext

A alto nivel, el AuthContext suele incluir:

Estado interno:

user: objeto con la información básica del usuario (id, email, nombre, rol, etc.).

token: token de acceso (si se expone).

isAuthenticated: booleano derivado (true si hay sesión válida).

isLoading: indica si se está verificando o inicializando la sesión.

Acciones:

login(credentials): inicia sesión.

logout(): finaliza la sesión.

(Opcional) initializeSession(): intenta rehidratar la sesión al cargar la app.

## Integración con servicios de autenticación

El AuthContext se apoya en un servicio como authService para comunicarse con el backend:

authService.login(credentials):

Envía email/usuario y contraseña.

Recibe en respuesta:

Datos del usuario.

Token (JWT u otro).

authService.me() (si existe):

Obtiene la información del usuario autenticado a partir del token.

authService.logout() (si aplica):

Opcionalmente notifica al backend que se cerró la sesión.

El contexto:

Usa estos servicios dentro de login, logout y/o initializeSession.

Maneja errores y estados de carga.

## Persistencia de la sesión

Si el proyecto lo requiere, el AuthContext puede persistir la sesión:

Al hacer login:

Guardar el token y/o datos mínimos del usuario en localStorage o sessionStorage.

Al iniciar la app:

Leer esos datos y:

Validarlos.

Opcionalmente llamar al backend para confirmar que el token sigue siendo válido.

Al hacer logout:

Limpiar los datos del almacenamiento local.

Buenas prácticas:

Guardar solo lo necesario (idealmente el token y un identificador).

Evitar almacenar información excesivamente sensible.

Manejar caducidad del token desde el backend (respuestas 401) y reflejarlo en el frontend.

## Relación con ProtectedRoute

ProtectedRoute usa useAuth para decidir si renderiza las rutas internas o redirige al login:

Si isAuthenticated es true:

Permite el acceso al layout privado (DashboardLayout).

Si isAuthenticated es false:

Redirige a /login.

De esta forma:

Cualquier cambio en el estado de AuthContext (por ejemplo, logout) afecta automáticamente a todas las secciones protegidas.

No es necesario comprobar manualmente la sesión en cada página.

## Interacción con interceptores de la API

El token gestionado por el AuthContext puede ser utilizado por el cliente HTTP (por ejemplo, Axios) mediante interceptores:

Antes de cada request:

Leer el token del contexto o de una capa intermedia.

Añadir el header Authorization: Bearer token si existe.

En respuestas con error:

Si el backend devuelve 401 (no autorizado):

Opcional: intentar un refresh.

Si no es posible, llamar a logout() desde el contexto.

Esto asegura que:

Todas las llamadas al backend se envían autenticadas cuando hay sesión válida.

Se maneja de forma centralizada la expiración de la sesión.

## Estados de carga y UX

El AuthContext puede manejar un estado de inicialización:

Mientras se ejecuta initializeSession (por ejemplo, en un useEffect):

isLoading está en true.

La app puede mostrar un loader global o una pantalla de “Cargando sesión…”.

Solo cuando la inicialización termina:

isLoading pasa a false.

Se decide si ir a rutas públicas o protegidas dependiendo de isAuthenticated.

Esto evita parpadeos visuales donde:

Primero se muestra una pantalla pública.

Luego, repentinamente, se cambia a una protegida (o viceversa).

## Buenas prácticas

Mantener toda la lógica de autenticación en un solo lugar (AuthContext + authService).

Evitar manipular tokens directamente en las páginas o componentes individuales.

Manejar correctamente errores y estados de carga para no dejar al usuario sin feedback.

Probar los flujos:

Inicio de sesión válido.

Credenciales inválidas.

Token expirado.

Cierre de sesión manual.