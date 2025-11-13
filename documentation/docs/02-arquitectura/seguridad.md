---
sidebar_position: 3
title: Seguridad (JWT & CORS)
---

# Seguridad

- **JWT**: login/registro devuelven `token`; el frontend lo guarda en `localStorage` y lo envía en `Authorization: Bearer <token>`.
- **CORS**: configurado en `SecurityConfig` para permitir el origen del frontend (configurable por env).
- **Rutas públicas**: `/api/v1/auth/**`, (añadir aquí si hay más).
- **Rutas protegidas**: resto de `/api/v1/**`.
- **401/403**: manejar en frontend (redirigir a login o mostrar mensaje).
