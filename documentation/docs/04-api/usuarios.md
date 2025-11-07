---
sidebar_position: 2
title: Usuarios
---

# API de Usuarios

CRUD completo para gestion de usuarios.

## Endpoints

### GET /api/users

Lista todos los usuarios (requiere rol ADMIN).

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "username": "johndoe",
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "active": true,
    "roles": ["ROLE_USER"]
  }
]
```

### GET /api/users/{id}

Obtiene un usuario por ID.

**Response (200 OK):**
```json
{
  "id": 1,
  "username": "johndoe",
  "email": "john@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "active": true,
  "createdAt": "2025-01-07T10:00:00",
  "roles": ["ROLE_USER"]
}
```

**Errores:**
- `404 Not Found`: Usuario no existe

### GET /api/users/me

Obtiene el perfil del usuario autenticado.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "id": 1,
  "username": "johndoe",
  "email": "john@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "roles": ["ROLE_USER"]
}
```

### PUT /api/users/{id}

Actualiza un usuario.

**Request:**
```json
{
  "firstName": "John Updated",
  "lastName": "Doe Updated",
  "email": "newemail@example.com"
}
```

**Response (200 OK):**
```json
{
  "id": 1,
  "username": "johndoe",
  "email": "newemail@example.com",
  "firstName": "John Updated",
  "lastName": "Doe Updated"
}
```

### DELETE /api/users/{id}

Elimina un usuario (requiere rol ADMIN).

**Response (204 No Content)**

## Autorizacion

- `GET /users` - ROLE_ADMIN
- `GET /users/{id}` - ROLE_ADMIN o propio usuario
- `GET /users/me` - Usuario autenticado
- `PUT /users/{id}` - ROLE_ADMIN o propio usuario
- `DELETE /users/{id}` - ROLE_ADMIN
