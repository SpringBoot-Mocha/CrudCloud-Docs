---
id: login
title: Pantalla de Login
---

# Pantalla de Login

La pantalla de Login es la puerta de entrada al dashboard de CrudCloud.
Desde aquí el usuario introduce sus credenciales y, si son válidas, accede a las secciones protegidas de la aplicación.

## Objetivos de la pantalla de Login

Proporcionar un formulario sencillo y claro para autenticarse.

Validar la información antes de enviarla al backend.

Mostrar errores de forma amigable (credenciales incorrectas, campos vacíos, etc.).

Redirigir al usuario al Dashboard cuando el inicio de sesión sea exitoso.

## Elementos principales del UI

La pantalla suele incluir:

### Título y descripción breve (ej. “Inicia sesión en CrudCloud”).

### Formulario de credenciales:

Campo de email/usuario.

Campo de contraseña.

### Botón de envío (Login / Iniciar sesión).

Enlaces secundarios:

“¿No tienes cuenta? Regístrate” (si existe registro).

“¿Olvidaste tu contraseña?” (si existe recuperación).

Ejemplo conceptual de estructura:

AuthLayout como layout general.

LoginForm como componente encargado del formulario.

Uso de componentes UI genéricos (Input, Button, Alert, etc.).

## Flujo de interacción

1. El usuario abre la ruta /login.

2. Rellena el formulario con sus credenciales.

3. Hace clic en el botón de Iniciar sesión.

4. El frontend:

Valida los campos (formato de email, contraseña no vacía, etc.).

Llama al servicio de autenticación (authService.login).

5. Si el backend responde con éxito:

Se actualiza el AuthContext con la información de usuario y token.

Opcionalmente se persiste la sesión (por ejemplo, en localStorage).

Se redirige al usuario al Dashboard (/dashboard).

6. Si hay un error:

Se muestra un mensaje descriptivo al usuario.

El formulario permanece visible para reintentar.

## Validaciones típicas

Validaciones en el frontend (antes de hacer la petición):

Campo email:

No vacío.

Formato de email válido (si aplica).

Campo contraseña:

No vacío.

Longitud mínima (por ejemplo, 6–8 caracteres).

Si el backend devuelve errores (por ejemplo, 401 o 400):

Mensaje de “Credenciales inválidas” o equivalente.

Sin exponer detalles internos del servidor.

## Conexión con AuthContext y servicios

La pantalla de Login se apoya en:

useAuth o AuthContext:

Para llamar a una función del estilo login(credentials).

Para saber si hay una sesión ya activa (y redirigir si el usuario intenta ir al login estando autenticado).

authService:

Encapsula la llamada HTTP a /api/auth/login (endpoint real según el backend).

Devuelve datos del usuario y token si las credenciales son correctas.

Flujo típico en código (a alto nivel):

El componente LoginForm:

Maneja el estado del formulario (email, password).

Llama a login( email, password ) desde el contexto.

Muestra estados de carga (isLoading), éxito o error.

## Manejo de estados de carga y error

Para ofrecer una buena UX:

Mientras se envía la petición:

Deshabilitar el botón de login.

Mostrar un indicador de carga (spinner, texto Iniciando sesión..., etc.).

Si hay error:

Mostrar un componente Alert o mensaje destacado.

Permitir reintento sin recargar la página.

## Redirecciones

Comportamientos recomendados:

Si el usuario ya está autenticado y entra a /login:

Redirigir directamente a /dashboard para evitar mostrar el formulario innecesariamente.

Tras un login exitoso:

Redirigir a:

/dashboard, o

La última ruta protegida a la que el usuario intentó acceder (si se implementa esa lógica).

## Accesibilidad y UX

Buenas prácticas:

Asociar correctamente las etiquetas (label) con los inputs.

Permitir enviar el formulario con la tecla Enter.

Indicar claramente los errores bajo los campos correspondientes.

Usar textos comprensibles para los botones (por ejemplo, “Iniciar sesión” en lugar de algo genérico).