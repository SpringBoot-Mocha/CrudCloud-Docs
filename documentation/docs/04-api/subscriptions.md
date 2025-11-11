---
sidebar_position: 4
title: Subscriptions
---

# Subscriptions API

Endpoints para gestionar suscripciones de usuarios a planes de CrudCloud.

## Base URL

```
http://localhost:8080/api/v1/subscriptions
```

## Autenticación

Todos los endpoints requieren autenticación JWT.

```http
Authorization: Bearer <your-jwt-token>
```

---

## Obtener Suscripción Actual

### GET /subscriptions/current

Obtiene la suscripción activa del usuario autenticado.

**Request:**
```http
GET /api/v1/subscriptions/current?userId=10
Authorization: Bearer <jwt-token>
```

**Query Parameters:**

| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|-----------|-------------|
| `userId` | Long | Sí | ID del usuario |

**Response (200 OK):**
```json
{
  "id": 25,
  "userId": 10,
  "planId": 1,
  "planName": "Free",
  "planPrice": 0.00,
  "maxInstances": 2,
  "currentInstances": 1,
  "isActive": true,
  "startDate": "2025-11-01T00:00:00Z",
  "endDate": null,
  "createdAt": "2025-11-01T10:30:00Z",
  "updatedAt": "2025-11-10T12:00:00Z"
}
```

**Response Fields:**

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | Long | ID de la suscripción |
| `userId` | Long | ID del usuario propietario |
| `planId` | Long | ID del plan asociado |
| `planName` | String | Nombre del plan (Free, Standard, Premium) |
| `planPrice` | Decimal | Precio mensual del plan |
| `maxInstances` | Integer | Máximo de instancias permitidas |
| `currentInstances` | Integer | Número actual de instancias activas |
| `isActive` | Boolean | Estado de la suscripción |
| `startDate` | DateTime | Fecha de inicio |
| `endDate` | DateTime | Fecha de finalización (null si activa) |

**Errores:**
- `401 Unauthorized`: Token JWT inválido
- `404 Not Found`: No se encontró suscripción activa para el usuario

---

## Crear o Actualizar Suscripción

### POST /subscriptions/upgrade

Crea una nueva suscripción o actualiza el plan actual del usuario.

**Request:**
```http
POST /api/v1/subscriptions/upgrade
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "userId": 10,
  "planId": 2
}
```

**Request Body:**

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `userId` | Long | Sí | ID del usuario |
| `planId` | Long | Sí | ID del nuevo plan |

**Response (201 Created):**
```json
{
  "id": 26,
  "userId": 10,
  "planId": 2,
  "planName": "Standard",
  "planPrice": 9.99,
  "maxInstances": 5,
  "currentInstances": 1,
  "isActive": true,
  "startDate": "2025-11-10T18:00:00Z",
  "endDate": null,
  "createdAt": "2025-11-10T18:00:00Z",
  "updatedAt": "2025-11-10T18:00:00Z",
  "message": "Subscription upgraded successfully",
  "previousPlan": {
    "id": 25,
    "planName": "Free",
    "endDate": "2025-11-10T18:00:00Z"
  }
}
```

**Escenarios:**

1. **Usuario sin suscripción**: Crea una nueva suscripción con el plan especificado
2. **Upgrade (Free → Standard/Premium)**: Desactiva el plan anterior y crea uno nuevo
3. **Downgrade**: Requiere que el usuario tenga menos instancias que el límite del nuevo plan

**Errores:**
- `400 Bad Request`: Datos de validación incorrectos
- `401 Unauthorized`: Token JWT inválido
- `403 Forbidden`: Usuario no autorizado para esta operación
- `404 Not Found`: Plan o usuario no encontrado
- `409 Conflict`: No se puede hacer downgrade - demasiadas instancias activas

---

## Obtener Suscripción por ID

### GET /subscriptions/{id}

Obtiene los detalles de una suscripción específica.

**Request:**
```http
GET /api/v1/subscriptions/26
Authorization: Bearer <jwt-token>
```

**Response (200 OK):**
```json
{
  "id": 26,
  "userId": 10,
  "planId": 2,
  "planName": "Standard",
  "planPrice": 9.99,
  "maxInstances": 5,
  "currentInstances": 2,
  "isActive": true,
  "startDate": "2025-11-10T18:00:00Z",
  "endDate": null,
  "createdAt": "2025-11-10T18:00:00Z",
  "updatedAt": "2025-11-10T19:30:00Z",
  "billingCycle": "monthly",
  "nextBillingDate": "2025-12-10T18:00:00Z",
  "autoRenew": true
}
```

**Errores:**
- `401 Unauthorized`: Token JWT inválido
- `403 Forbidden`: El usuario no es dueño de esta suscripción
- `404 Not Found`: Suscripción no encontrada

---

## Listar Todas las Suscripciones del Usuario

### GET /subscriptions

Obtiene el historial de todas las suscripciones del usuario autenticado.

**Request:**
```http
GET /api/v1/subscriptions?userId=10&includeInactive=true
Authorization: Bearer <jwt-token>
```

**Query Parameters:**

| Parámetro | Tipo | Default | Descripción |
|-----------|------|---------|-------------|
| `userId` | Long | - | ID del usuario |
| `includeInactive` | Boolean | false | Incluir suscripciones inactivas |
| `page` | Integer | 0 | Número de página |
| `size` | Integer | 10 | Tamaño de página |

**Response (200 OK):**
```json
{
  "content": [
    {
      "id": 26,
      "planName": "Standard",
      "isActive": true,
      "startDate": "2025-11-10T18:00:00Z",
      "endDate": null
    },
    {
      "id": 25,
      "planName": "Free",
      "isActive": false,
      "startDate": "2025-11-01T00:00:00Z",
      "endDate": "2025-11-10T18:00:00Z"
    }
  ],
  "totalElements": 2,
  "totalPages": 1,
  "currentPage": 0
}
```

**Errores:**
- `401 Unauthorized`: Token JWT inválido
- `403 Forbidden`: Acceso denegado

---

## Cancelar Suscripción

### DELETE /subscriptions/{id}

Cancela una suscripción activa. El usuario volverá al plan Free.

**Request:**
```http
DELETE /api/v1/subscriptions/26
Authorization: Bearer <jwt-token>
```

**Response (200 OK):**
```json
{
  "message": "Subscription cancelled successfully",
  "subscriptionId": 26,
  "cancelledAt": "2025-11-10T20:00:00Z",
  "newSubscription": {
    "id": 27,
    "planName": "Free",
    "maxInstances": 2,
    "startDate": "2025-11-10T20:00:00Z"
  },
  "refundInfo": {
    "refundAmount": 6.66,
    "refundReason": "Prorated refund for unused period",
    "refundStatus": "PENDING"
  }
}
```

**Notas:**
- Al cancelar una suscripción de pago, se crea automáticamente una suscripción Free
- Si el usuario tiene más instancias que el límite Free (2), deberá eliminar instancias
- Los reembolsos se procesan automáticamente de forma prorrateada

**Errores:**
- `400 Bad Request`: No se puede cancelar plan Free
- `401 Unauthorized`: Token JWT inválido
- `403 Forbidden`: El usuario no es dueño de esta suscripción
- `404 Not Found`: Suscripción no encontrada
- `409 Conflict`: Demasiadas instancias activas para plan Free

---

## Reactivar Suscripción

### PUT /subscriptions/{id}/reactivate

Reactiva una suscripción cancelada previamente.

**Request:**
```http
PUT /api/v1/subscriptions/26/reactivate
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "paymentMethodId": "pm_123456789"
}
```

**Request Body:**

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `paymentMethodId` | String | Sí (para planes de pago) | ID del método de pago de Mercado Pago |

**Response (200 OK):**
```json
{
  "id": 26,
  "planName": "Standard",
  "isActive": true,
  "reactivatedAt": "2025-11-11T10:00:00Z",
  "nextBillingDate": "2025-12-11T10:00:00Z",
  "message": "Subscription reactivated successfully"
}
```

**Errores:**
- `400 Bad Request`: Suscripción ya está activa
- `401 Unauthorized`: Token JWT inválido
- `402 Payment Required`: Fallo en el procesamiento del pago
- `404 Not Found`: Suscripción no encontrada

---

## Validaciones y Reglas de Negocio

### Límites de Instancias

Al cambiar de plan, se valida el número de instancias activas:

```json
// Error al intentar downgrade con demasiadas instancias
{
  "error": "Downgrade not allowed",
  "message": "You have 5 active instances. The Free plan allows only 2 instances.",
  "currentInstances": 5,
  "targetPlanMaxInstances": 2,
  "requiredAction": "Delete 3 instances before downgrading",
  "instancesToDelete": [
    {"id": 10, "name": "mysql-instance-1"},
    {"id": 11, "name": "postgres-instance-2"},
    {"id": 12, "name": "redis-instance-3"}
  ]
}
```

### Cambios de Plan

| Desde | Hacia | Requiere Pago | Validaciones |
|-------|-------|---------------|--------------|
| Free | Standard | Sí | Ninguna |
| Free | Premium | Sí | Ninguna |
| Standard | Premium | Sí | Ninguna |
| Standard | Free | No | Max 2 instancias |
| Premium | Standard | No (reembolso) | Max 5 instancias |
| Premium | Free | No (reembolso) | Max 2 instancias |

---

## Ejemplos de Uso

### Obtener suscripción actual

```bash
curl -X GET "http://localhost:8080/api/v1/subscriptions/current?userId=10" \
  -H "Authorization: Bearer <your-token>"
```

### Upgrade a plan Standard

```bash
curl -X POST http://localhost:8080/api/v1/subscriptions/upgrade \
  -H "Authorization: Bearer <your-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 10,
    "planId": 2
  }'
```

### Cancelar suscripción

```bash
curl -X DELETE http://localhost:8080/api/v1/subscriptions/26 \
  -H "Authorization: Bearer <your-token>"
```

### Historial de suscripciones

```bash
curl -X GET "http://localhost:8080/api/v1/subscriptions?userId=10&includeInactive=true" \
  -H "Authorization: Bearer <your-token>"
```

---

## Integración con Pagos

Cuando se crea o actualiza una suscripción a un plan de pago, se debe:

1. **Llamar al endpoint de suscripciones** para crear/actualizar
2. **Procesar el pago** con el endpoint `/api/v1/payments`
3. **Activar la suscripción** una vez confirmado el pago

Ver la documentación de [Pagos](/docs/api/pagos) para más detalles sobre procesamiento de pagos con Mercado Pago.

---

## Estados de Suscripción

| Estado | Descripción |
|--------|-------------|
| `ACTIVE` | Suscripción activa y funcional |
| `CANCELLED` | Suscripción cancelada por el usuario |
| `EXPIRED` | Suscripción expiró por falta de pago |
| `SUSPENDED` | Suscripción suspendida temporalmente |
| `PENDING_PAYMENT` | Esperando confirmación de pago |

---

## Notificaciones

El sistema envía notificaciones automáticas para:

- Confirmación de upgrade de plan
- Recordatorio de próximo pago (7 días antes)
- Confirmación de cancelación
- Alerta de instancias excedidas
- Confirmación de reembolso procesado
