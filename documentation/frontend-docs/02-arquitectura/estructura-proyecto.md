---
id: estructura-proyecto
title: Estructura del Proyecto
---

# Estructura del Proyecto Frontend

El frontend de CrudCloud está organizado para facilitar la escalabilidad, la reutilización de componentes y la claridad al navegar por el código.

A nivel general, la estructura es similar a la siguiente:

```text
Crudcloud_Frontend/
├── src/
│   ├── api/
│   ├── assets/
│   ├── components/
│   ├── context/
│   ├── hooks/
│   ├── layouts/
│   ├── pages/
│   ├── routes/
│   ├── services/
│   ├── styles/
│   ├── utils/
│   ├── App.jsx
│   └── main.jsx
├── public/
├── package.json
├── vite.config.js
└── otros archivos de configuración
```

A continuación se describe el propósito de cada carpeta.

## src/api/ – Configuración de la API

Contiene la configuración base para llamar al backend:

Instancia de cliente HTTP (por ejemplo Axios).

Configuración de headers, timeouts e interceptores.

Definición centralizada de endpoints.

Objetivo: centralizar el acceso HTTP y evitar repetir lógica de red en las páginas o componentes.

## src/assets/ – Recursos estáticos

Incluye recursos que se usan en la UI:

Imágenes (logos, ilustraciones, fondos).

Iconos SVG.

Fuentes personalizadas (si aplica).

Estos archivos se importan desde componentes, layouts o páginas.

## src/components/ – Componentes reutilizables

Aquí se agrupan los componentes de UI y de dominio:

components/ui/: botones, inputs, cards, modales, alertas, tooltips, etc.

components/auth/: componentes relacionados con login/registro y formularios de autenticación.

components/instances/: tarjetas, tablas y formularios para gestionar instancias de bases de datos.

components/plans/: componentes para planes, precios y upgrades.

components/dashboard/: widgets, tarjetas de métricas, gráficos, etc.

La idea es que las páginas utilicen estos componentes en lugar de reescribir la UI desde cero.

## src/context/ – Estado global

Define los contextos de React que comparten estado entre múltiples secciones:

AuthContext: información de usuario, tokens, estado de sesión.

InstanceContext: listado y estado de instancias de bases de datos.

PlanContext: plan actual, límites y upgrade/downgrade.

ThemeContext: modo claro/oscuro u otras preferencias de UI.

Cada contexto suele incluir:

Estado inicial.

Reducers o funciones de actualización.

Efectos para sincronizar con el backend.

## src/hooks/ – Custom hooks

Contiene hooks personalizados que encapsulan lógica reutilizable:

useAuth: acceso a los datos y acciones del contexto de autenticación.

useInstances: lógica de carga, creación y actualización de instancias.

usePlans: obtención de planes y cambios de suscripción.

useForm, useModal, useToast, etc.

Estos hooks permiten:

Mantener las páginas más limpias.

Reutilizar lógica compleja en diferentes componentes.

## src/layouts/ – Layouts principales

Define los esqueletos visuales de alto nivel:

PublicLayout: para páginas públicas (landing, pricing, about, etc.).

DashboardLayout: para la sección autenticada (dashboard, instancias, planes…).

AuthLayout: para pantallas de login y registro.

Los layouts suelen incluir:

Header y/o navbar.

Sidebar (en el caso del dashboard).

Contenedor principal donde se renderizan las páginas.

## src/pages/ – Páginas completas

Representan las pantallas principales de la aplicación:

pages/public/*: landing, precios, información general.

pages/auth/*: login, registro, recuperación de contraseña (si aplica).

pages/dashboard/*: dashboard principal, instancias, planes, perfil, etc.

Cada página:

Orquesta componentes, hooks y servicios.

Contiene la lógica específica de la vista (por ejemplo, qué filtros se aplican en una lista).

## src/routes/ – Definición de rutas

Contiene la configuración de React Router:

Rutas públicas y privadas.

Rutas anidadas bajo cada layout.

Componente de rutas protegidas para secciones que requieren autenticación.

Esta carpeta se encarga de decidir qué página se muestra para cada URL.

## src/services/ – Servicios de dominio

Encapsulan la lógica relacionada con casos de uso específicos:

authService: login, registro, refresco de token, cierre de sesión.

instanceService: CRUD de instancias de bases de datos.

planService: consulta y cambio de planes.

userService: actualización de perfil, datos de usuario.

paymentService: integración de pagos a través del backend.

Los servicios se apoyan en src/api/ para hacer llamadas HTTP.

## src/styles/ – Estilos globales

Agrupa los estilos globales y configuración de Tailwind:

global.css: importa Tailwind y define estilos base.

Archivos adicionales para variables, temas o normalización si se requieren.

## src/utils/ – Utilidades

Incluye helpers y funciones auxiliares:

Validadores de formularios.

Formateadores de fecha, moneda y texto.

Constantes de dominio (por ejemplo, estados de instancia, tipos de plan).

Helpers para manejo de almacenamiento local (localStorage, sessionStorage).

## Entrypoints principales

App.jsx: componente raíz de la aplicación, donde se definen providers y rutas.

main.jsx: punto de entrada que monta la aplicación en el DOM.

Esta estructura facilita:

Localizar rápidamente dónde vive cada responsabilidad.

Escalar el proyecto añadiendo nuevas features sin desordenar el código.

Mantener una separación clara entre UI, estado, servicios y utilidades.