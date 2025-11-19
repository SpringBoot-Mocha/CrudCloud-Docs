---
id: ruteo
title: Ruteo y Navegación
---

# Ruteo y Navegación

El frontend de CrudCloud utiliza React Router para gestionar la navegación entre páginas públicas, privadas y de autenticación, garantizando una experiencia fluida y protegida.

## Configuración principal de rutas

La configuración de rutas se centraliza normalmente en:

src/routes/index.jsx (o un archivo equivalente)

Aquí se definen:

Rutas públicas (landing, pricing, about, etc.).

Rutas de autenticación (login, registro).

Rutas protegidas (dashboard, instancias, planes, perfil).

## Rutas públicas

Las rutas públicas son accesibles sin autenticación y suelen incluir:

Página principal (landing).

Página de precios.

Páginas de marketing o información general.

Características:

Se renderizan bajo PublicLayout.

No requieren token ni sesión de usuario.

Pueden incluir enlaces al login o registro.

## Rutas de autenticación

Incluyen las vistas relacionadas con el acceso de usuarios:

/login

/register

/forgot-password (si aplica)

Características:

Se renderizan bajo AuthLayout.

No deben ser accesibles si el usuario ya está autenticado (generalmente se redirige al dashboard).

Manejan formularios, validaciones y mensajes de error.

## Rutas protegidas (dashboard)

Son las rutas que requieren que el usuario esté autenticado:

/dashboard

/dashboard/instances

/dashboard/plans

/dashboard/profile

Otras secciones internas que se agreguen en el futuro.

Se renderizan bajo:

DashboardLayout

Envuelta por ProtectedRoute, que verifica el estado de autenticación.

## ProtectedRoute y autenticación

El componente ProtectedRoute se apoya en el contexto de autenticación (AuthContext) o en el hook useAuth para:

Verificar si el usuario está autenticado.

Redirigir al login en caso contrario.

Permitir el acceso a las rutas internas solo cuando hay sesión válida.

## Layouts y jerarquía de rutas

Los layouts (PublicLayout, AuthLayout, DashboardLayout) envuelven grupos de rutas para:

Compartir cabeceras, menús y footers.

Controlar si se muestra o no el sidebar.

Aplicar un diseño consistente en cada sección.

Beneficios:

Las páginas se enfocan en la lógica y el contenido.

Se evita duplicar estructura visual en cada ruta.

Es fácil cambiar el layout de una sección completa.

## Navegación interna

Para navegar dentro de la aplicación sin recargar la página, se utilizan componentes de React Router:

Link

NavLink

useNavigate

## Manejo de rutas no encontradas (404)

Es recomendable definir una ruta “catch-all” para gestionar URLs no válidas:

Define un componente NotFoundPage.

Añádelo como ruta path="*".

Esto evita pantallas en blanco y mejora la experiencia de usuario cuando se navega a una ruta incorrecta o antigua.