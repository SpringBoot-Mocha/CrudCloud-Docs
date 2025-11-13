---
sidebar_position: 4
title: Variables de Entorno
---

# Variables de Entorno

## Backend (Spring Boot)

| Variable | Descripción | Ejemplo |
|---|---|---|
| `SPRING_PROFILES_ACTIVE` | Perfil activo | `dev` / `prod` |
| `DB_URL` | JDBC URL | `jdbc:postgresql://localhost:5432/crudcloud` |
| `DB_USER` | Usuario BD | `postgres` |
| `DB_PASS` | Password BD | `postgres` |
| `JWT_SECRET` | Secreto para firmar JWT | `changeme_super_secret` |
| `CORS_ALLOWED_ORIGINS` | Orígenes permitidos | `http://localhost:3000` |

> En `application.properties` actual apunta a Postgres local. Para prod usa perfiles y variables.

## Frontend (Vite)

| Variable | Descripción | Ejemplo |
|---|---|---|
| `VITE_API_BASE_URL` | Base URL del backend | `http://localhost:8080/api` / `https://api.name-team.crudzaso.com/api` |

## Docs

Si usas despliegue dockerizado para Docusaurus, no suelen requerirse secrets.
