---
title: Database Instances API
sidebar_label: Database Instances
---

# Database Instances API

Endpoints para crear, gestionar y eliminar instancias de bases de datos en contenedores Docker.

## Base URL

```
http://localhost:8080/api/v1/instances
```

## Autenticación

Todos los endpoints requieren autenticación JWT.

```http
Authorization: Bearer your-jwt-token
```

---

## Crear Instancia de Base de Datos

### POST /instances

Crea una nueva instancia de base de datos en un contenedor Docker.

**Request:**
```http
POST /api/v1/instances
Authorization: Bearer jwt-token
Content-Type: application/json

{
  "engineId": 1,
  "name": "my-mysql-instance",
  "description": "MySQL instance for production",
  "subscriptionId": 5
}
```

**Request Body:**

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `engineId` | Long | Sí | ID del motor de base de datos (MySQL, PostgreSQL, etc.) |
| `name` | String | Sí | Nombre único para la instancia |
| `description` | String | No | Descripción de la instancia |
| `subscriptionId` | Long | Sí | ID de la suscripción activa del usuario |

**Response (201 Created):**
```json
{
  "id": 42,
  "name": "my-mysql-instance",
  "description": "MySQL instance for production",
  "status": "CREATING",
  "containerName": "crudcloud-mysql-42",
  "engineId": 1,
  "engineName": "MySQL",
  "engineVersion": "8.0",
  "userId": 10,
  "subscriptionId": 5,
  "createdAt": "2025-11-10T14:30:00Z",
  "cpuUsage": 0.0,
  "memoryUsage": 0.0
}
```

**Posibles Estados:**
- `CREATING`: Instancia siendo creada
- `RUNNING`: Instancia activa y lista para usar
- `SUSPENDED`: Instancia pausada
- `DELETED`: Instancia eliminada

**Errores:**
- `400 Bad Request`: Datos de validación incorrectos
- `401 Unauthorized`: Token JWT inválido o expirado
- `403 Forbidden`: Usuario alcanzó el límite de instancias de su plan
- `404 Not Found`: Motor de base de datos o suscripción no encontrada

---

## Listar Instancias del Usuario

### GET /instances

Obtiene todas las instancias de bases de datos del usuario autenticado.

**Request:**
```http
GET /api/v1/instances
Authorization: Bearer jwt-token
```

**Query Parameters (opcionales):**

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `status` | String | Filtrar por estado (RUNNING, CREATING, SUSPENDED, DELETED) |
| `engineId` | Long | Filtrar por motor de base de datos |
| `page` | Integer | Número de página (default: 0) |
| `size` | Integer | Tamaño de página (default: 10, max: 100) |

**Request Example:**
```http
GET /api/v1/instances?status=RUNNING&page=0&size=20
Authorization: Bearer jwt-token
```

**Response (200 OK):**
```json
{
  "content": [
    {
      "id": 42,
      "name": "my-mysql-instance",
      "description": "MySQL instance for production",
      "status": "RUNNING",
      "containerName": "crudcloud-mysql-42",
      "engineId": 1,
      "engineName": "MySQL",
      "engineVersion": "8.0",
      "userId": 10,
      "subscriptionId": 5,
      "createdAt": "2025-11-10T14:30:00Z",
      "cpuUsage": 15.2,
      "memoryUsage": 256.8
    },
    {
      "id": 43,
      "name": "postgres-dev",
      "description": "PostgreSQL for development",
      "status": "RUNNING",
      "containerName": "crudcloud-postgres-43",
      "engineId": 2,
      "engineName": "PostgreSQL",
      "engineVersion": "15",
      "userId": 10,
      "subscriptionId": 5,
      "createdAt": "2025-11-10T15:00:00Z",
      "cpuUsage": 8.5,
      "memoryUsage": 512.0
    }
  ],
  "totalElements": 2,
  "totalPages": 1,
  "currentPage": 0,
  "pageSize": 20
}
```

**Errores:**
- `401 Unauthorized`: Token JWT inválido
- `403 Forbidden`: Acceso denegado

---

## Obtener Detalles de Instancia

### GET /instances/id

Obtiene los detalles completos de una instancia específica.

**Request:**
```http
GET /api/v1/instances/42
Authorization: Bearer jwt-token
```

**Response (200 OK):**
```json

  "id": 42,
  "name": "my-mysql-instance",
  "description": "MySQL instance for production",
  "status": "RUNNING",
  "containerName": "crudcloud-mysql-42",
  "engineId": 1,
  "engineName": "MySQL",
  "engineVersion": "8.0",
  "userId": 10,
  "subscriptionId": 5,
  "createdAt": "2025-11-10T14:30:00Z",
  "updatedAt": "2025-11-10T16:45:00Z",
  "cpuUsage": 15.2,
  "memoryUsage": 256.8,
  "credentials": 
    "host": "91.98.225.17",
    "port": 3306,
    "databaseName": "crudcloud_db_42",
    "username": "user_42",
    "password": "encrypted_password_here"
  
```

**Errores:**
- `401 Unauthorized`: Token JWT inválido
- `403 Forbidden`: El usuario no es dueño de esta instancia
- `404 Not Found`: Instancia no encontrada

---

## Obtener Credenciales de Conexión

### GET /instances/id/credentials

Obtiene las credenciales de conexión de una instancia específica.

**Request:**
```http
GET /api/v1/instances/42/credentials
Authorization: Bearer jwt-token
```

**Response (200 OK):**
```json

  "host": "91.98.225.17",
  "port": 3306,
  "databaseName": "crudcloud_db_42",
  "username": "user_42",
  "password": "SecurePassword123!",
  "connectionString": "jdbc:mysql://91.98.225.17:3306/crudcloud_db_42",
  "connectionExample": 
    "java": "DriverManager.getConnection(\"jdbc:mysql://91.98.225.17:3306/crudcloud_db_42\", \"user_42\", \"SecurePassword123!\")",
    "python": "pymysql.connect(host='91.98.225.17', port=3306, user='user_42', password='SecurePassword123!', database='crudcloud_db_42')",
    "nodejs": "mysql.createConnection({ host: '91.98.225.17', port: 3306, user: 'user_42', password: 'SecurePassword123!', database: 'crudcloud_db_42' })"
  
```

**Errores:**
- `401 Unauthorized`: Token JWT inválido
- `403 Forbidden`: El usuario no es dueño de esta instancia
- `404 Not Found`: Instancia o credenciales no encontradas

---

## Actualizar Estado de Instancia

### PUT /instances/id/status

Actualiza el estado de una instancia (iniciar, pausar, etc.).

**Request:**
```http
PUT /api/v1/instances/42/status
Authorization: Bearer jwt-token
Content-Type: application/json


  "status": "SUSPENDED"

```

**Request Body:**

| Campo | Tipo | Valores Permitidos |
|-------|------|-------------------|
| `status` | String | `RUNNING`, `SUSPENDED` |

**Response (200 OK):**
```json

  "id": 42,
  "name": "my-mysql-instance",
  "status": "SUSPENDED",
  "message": "Instance status updated successfully",
  "updatedAt": "2025-11-10T17:00:00Z"

```

**Errores:**
- `400 Bad Request`: Estado inválido
- `401 Unauthorized`: Token JWT inválido
- `403 Forbidden`: El usuario no es dueño de esta instancia
- `404 Not Found`: Instancia no encontrada
- `409 Conflict`: No se puede cambiar el estado desde el estado actual

---

## Obtener Métricas de Instancia

### GET /instances/id/metrics

Obtiene métricas de uso en tiempo real (CPU, memoria) desde Docker Stats API.

**Request:**
```http
GET /api/v1/instances/42/metrics
Authorization: Bearer jwt-token
```

**Response (200 OK):**
```json

  "instanceId": 42,
  "containerName": "crudcloud-mysql-42",
  "status": "RUNNING",
  "metrics": 
    "cpuUsagePercentage": 15.2,
    "memoryUsageMB": 256.8,
    "memoryLimitMB": 512.0,
    "networkRxMB": 10.5,
    "networkTxMB": 5.2,
    "blockReadMB": 100.0,
    "blockWriteMB": 50.0
  
  "timestamp": "2025-11-10T17:10:00Z"

```

**Errores:**
- `401 Unauthorized`: Token JWT inválido
- `403 Forbidden`: El usuario no es dueño de esta instancia
- `404 Not Found`: Instancia no encontrada
- `503 Service Unavailable`: No se pueden obtener métricas (contenedor detenido)

---

## Eliminar Instancia

### DELETE /instances/id

Elimina una instancia de base de datos y su contenedor Docker asociado.

**Request:**
```http
DELETE /api/v1/instances/42
Authorization: Bearer jwt-token
```

**Response (200 OK):**
```json
{
  "message": "Database instance deleted successfully",
  "instanceId": 42,
  "instanceName": "my-mysql-instance",
  "deletedAt": "2025-11-10T17:30:00Z"
}
```

**Errores:**
- `401 Unauthorized`: Token JWT inválido
- `403 Forbidden`: El usuario no es dueño de esta instancia
- `404 Not Found`: Instancia no encontrada
- `500 Internal Server Error`: Error al eliminar contenedor Docker

---

## Validaciones

### Límites de Plan

El número de instancias activas está limitado por el plan de suscripción:

| Plan | Máximo de Instancias |
|------|---------------------|
| **Free** | 2 instancias |
| **Standard** | 5 instancias |
| **Premium** | 10 instancias |

Al intentar crear una instancia que exceda el límite:

```json
{
  "error": "Instance limit exceeded",
  "message": "Your FREE plan allows a maximum of 2 instances. Upgrade to create more.",
  "currentInstances": 2,
  "maxInstances": 2,
  "suggestedPlans": [
    {
      "planId": 2,
      "planName": "Standard",
      "maxInstances": 5,
      "price": 9.99
    },
    {
      "planId": 3,
      "planName": "Premium",
      "maxInstances": 10,
      "price": 19.99
    }
  ]
}
```

### Nombre de Instancia

- Mínimo 3 caracteres, máximo 50
- Solo caracteres alfanuméricos, guiones y guiones bajos
- Debe ser único para el usuario

---

## Ejemplos de Uso

### Crear instancia MySQL

```bash
curl -X POST http://localhost:8080/api/v1/instances \
  -H "Authorization: Bearer <your-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "engineId": 1,
    "name": "production-mysql",
    "description": "Main production database",
    "subscriptionId": 5
  }'
```

### Listar instancias activas

```bash
curl -X GET "http://localhost:8080/api/v1/instances?status=RUNNING" \
  -H "Authorization: Bearer <your-token>"
```

### Obtener credenciales

```bash
curl -X GET http://localhost:8080/api/v1/instances/42/credentials \
  -H "Authorization: Bearer <your-token>"
```

### Pausar instancia

```bash
curl -X PUT http://localhost:8080/api/v1/instances/42/status \
  -H "Authorization: Bearer <your-token>" \
  -H "Content-Type: application/json" \
  -d '{"status": "SUSPENDED"}'
```

### Eliminar instancia

```bash
curl -X DELETE http://localhost:8080/api/v1/instances/42 \
  -H "Authorization: Bearer <your-token>"
```

---

## Notas de Seguridad

- Las credenciales de bases de datos se almacenan encriptadas con AES-256
- Los puertos de los contenedores Docker se asignan dinámicamente
- Solo el propietario de la instancia puede acceder a sus credenciales
- Las instancias eliminadas no se pueden recuperar
- Recomendamos cambiar las contraseñas periódicamente
