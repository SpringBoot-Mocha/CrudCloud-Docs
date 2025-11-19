---
id: resumen
title: Resumen de Arquitectura
---

# Arquitectura del Frontend de CrudCloud

El frontend de **CrudCloud** sigue una arquitectura moderna, escalable y orientada a capas, pensada para separar claramente la lógica de negocio, la presentación y la integración con APIs externas.

## Vista general por capas

La aplicación se organiza en varias capas lógicas:

```text
┌─────────────────────────────────────────────────────────┐
│                    Application Layer                    │
│              (Pages + Layouts + Routing)                │
├─────────────────────────────────────────────────────────┤
│                     Context Layer                       │
│     (Global State + Authentication + Business Logic)    │
├─────────────────────────────────────────────────────────┤
│                     Component Layer                     │
│           (UI Components + Custom Hooks)                │
├─────────────────────────────────────────────────────────┤
│                      Service Layer                      │
│              (API Integration + Data Fetching)          │
├─────────────────────────────────────────────────────────┤
│                     Utility Layer                       │
│           (Helpers + Validators + Formatters)           │
└─────────────────────────────────────────────────────────┘
```

## Integraciones externas principales:

CrudCloud Backend API (servicios REST)

Mercado Pago (procesamiento de pagos, a través del backend)

Otros servicios externos según la configuración del entorno

## Application Layer

Responsable de todo lo relacionado con:

Rutas de la aplicación (src/routes/)

Layouts públicos, privados y de autenticación (src/layouts/)

Páginas completas (src/pages/)

Esta capa define cómo navega el usuario, qué layout se usa en cada contexto y qué componentes de alto nivel se muestran.

## Context Layer

Gestiona el estado global y la lógica de negocio compartida:

AuthContext para autenticación y sesión de usuario.

InstanceContext para instancias de bases de datos.

PlanContext para planes y suscripciones.

ThemeContext para preferencias de tema (light/dark, etc.).

Aquí se concentran:

Estados globales.

Efectos de sincronización con APIs.

Reglas de negocio que afectan a varias vistas.

## Component Layer

Contiene los componentes reutilizables de la UI y componentes específicos por feature:

Componentes atómicos en src/components/ui/.

Componentes de dominio como:

components/auth/*

components/instances/*

components/plans/*

components/dashboard/*

El objetivo es aplicar un enfoque tipo Atomic Design:

Atoms → Molecules → Organisms → Templates → Pages

## Service Layer

Encapsula la comunicación con el backend:

src/api/ para configuración de Axios, interceptores y endpoints.

src/services/ para funciones de alto nivel:

authService

instanceService

planService

userService

paymentService

Aquí se definen:

Rutas de la API.

Manejo de errores.

Transformación de datos entre el backend y la UI.

## Utility Layer

Proporciona funcionalidades transversales:

Validación (por ejemplo, esquemas y reglas de formularios).

Formateo (monedas, fechas, textos).

Constantes de dominio.

Manejo de errores comunes.

Helpers de almacenamiento (localStorage, sessionStorage).

Esta capa ayuda a mantener el código limpio, reutilizable y fácil de testear.

## Beneficios de esta arquitectura

Mantenibilidad: cada cambio suele impactar solo una capa bien definida.

Escalabilidad: es sencillo añadir nuevos módulos (nuevos contextos, servicios, páginas).

Reutilización: componentes y utilidades se comparten entre diferentes pantallas.

Separación de responsabilidades: UI, estado y acceso a datos están claramente separados.