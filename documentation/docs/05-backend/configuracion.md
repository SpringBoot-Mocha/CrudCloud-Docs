---
sidebar_position: 1
title: Configuración del Backend
---

# Configuración del Backend

- **Perfil dev** usa Postgres local (ver `application.properties`).
- Para prod, define `application-prod.yml` y variables de entorno.
- **Swagger/OpenAPI**: expuesto por `springdoc`. Acceso:
  - UI: `/swagger-ui/index.html` (ajusta si tu app base path es `/api`).
  - JSON: `/v3/api-docs`.

## Endpoints principales

- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `GET /api/v1/instances/{id}`
- `DELETE /api/v1/instances/{id}`
- `GET /api/v1/subscriptions/current`
- `POST /api/v1/subscriptions/upgrade`
- `GET /api/v1/payments/{id}`
- `POST /api/v1/payments/webhook`
- `GET /api/v1/plans/{id}`
- `GET|PUT|DELETE /api/v1/users/{id}`
