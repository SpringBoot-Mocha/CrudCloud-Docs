---
title: Autenticación API
sidebar_label: Autenticacion
---

# API de Autenticacion

Endpoints para registro, login y gestion de tokens JWT.

## Base URL

```
http://localhost:8080/api/auth
```

## Registro de Usuario

### POST /register

Registra un nuevo usuario en el sistema.

**Request:**
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "SecurePass123!",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Response (201 Created):**
```json
{
  "message": "Usuario registrado exitosamente",
  "userId": 1,
  "username": "johndoe",
  "email": "john@example.com"
}
```

**Errores:**
- `400 Bad Request`: Validacion fallida
- `409 Conflict`: Email o username ya existe

## Login

### POST /login

Autentica un usuario y retorna un token JWT.

**Request:**
```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "johndoe",
  "password": "SecurePass123!"
}
```

**Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "type": "Bearer",
  "expiresIn": 86400000,
  "username": "johndoe",
  "email": "john@example.com",
  "roles": ["ROLE_USER"]
}
```

**Errores:**
- `401 Unauthorized`: Credenciales invalidas
- `400 Bad Request`: Datos faltantes

## Uso del Token JWT

### Headers de Autenticacion

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Ejemplo con cURL

```bash
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

curl -X GET http://localhost:8080/api/users/me \
  -H "Authorization: Bearer $TOKEN"
```

## Refresh Token

### POST /refresh

Renueva un token expirado.

**Request:**
```http
POST /api/auth/refresh
Content-Type: application/json

{
  "refreshToken": "refresh-token-here"
}
```

**Response (200 OK):**
```json
{
  "token": "new-jwt-token",
  "refreshToken": "new-refresh-token",
  "expiresIn": 86400000
}
```

## Logout

### POST /logout

Invalida el token actual (si se implementa blacklist).

**Request:**
```http
POST /api/auth/logout
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (200 OK):**
```json
{
  "message": "Logout exitoso"
}
```

## Validaciones

### Password Requirements

- Minimo 8 caracteres
- Al menos una mayuscula
- Al menos una minuscula
- Al menos un numero
- Caracteres especiales recomendados

### Email Format

- Debe ser un email valido
- Unico en el sistema

## Seguridad

- Passwords hasheados con BCrypt
- Tokens JWT firmados con HS512
- Tokens expiran en 24 horas (configurable)
- HTTPS requerido en produccion
