---
title: Usuarios API
sidebar_label: Usuarios
---

# API de Usuarios

Endpoints para gestión de usuarios del sistema CrudCloud.

## Crear Usuario

### POST `/api/v1/auth/register`

Registra un nuevo usuario en el sistema.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "name": "John Doe",
  "isOrganization": false
}
```

**Response (201 Created):**
```json
{
  "id": 1,
  "email": "user@example.com",
  "name": "John Doe",
  "isOrganization": false,
  "createdAt": "2025-11-10T10:00:00Z"
}
```

**Errores:**
- `400 Bad Request`: Email ya existe o validación fallida
- `500 Internal Server Error`: Error del servidor

## Obtener Usuario

### GET `/api/v1/users/{userId}`

Obtiene información de un usuario específico.

**Response (200 OK):**
```json
{
  "id": 1,
  "email": "user@example.com",
  "name": "John Doe",
  "isOrganization": false,
  "createdAt": "2025-11-10T10:00:00Z"
}
```

**Errores:**
- `404 Not Found`: Usuario no encontrado
- `401 Unauthorized`: Token JWT inválido

## Status

**Estado actual:** Pendiente de implementación (Fase 4 - Controllers)

Los servicios están implementados pero los controllers REST aún no.
