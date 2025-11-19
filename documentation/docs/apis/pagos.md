---
title: Pagos API
sidebar_label: Pagos
---

# API de Pagos

Integración con Mercado Pago para procesamiento de pagos de suscripciones.

## Crear Pago

### POST `/api/v1/payments`

Crea un nuevo pago para upgrade de plan.

**Request Body:**
```json

  "userId": 1,
  "amount": 9.99

```

**Response (201 Created):**
```json

  "id": 1,
  "mercadopagoPaymentId": "MP-123e4567-e89b-12d3-a456-426614174000",
  "amount": 9.99,
  "status": "PENDING",
  "createdAt": "2025-11-10T10:00:00Z"

```

## Obtener Transacción

### GET `/api/v1/payments/transactionId`

Consulta el estado de una transacción.

**Response (200 OK):**
```json
{
  "id": 1,
  "mercadopagoPaymentId": "MP-123e4567-e89b-12d3-a456-426614174000",
  "amount": 9.99,
  "status": "APPROVED",
  "createdAt": "2025-11-10T10:00:00Z"
}
```

## Webhook Mercado Pago

### POST `/api/v1/payments/webhook`

Recibe notificaciones de Mercado Pago.

**Mercado Pago enviará:**
```json
{
  "action": "payment.updated",
  "data": {
    "id": "123456789"
  }
}
```

**Response (200 OK):**
```json
{
  "message": "Webhook processed successfully"
}
```

## Status

**Estado actual:** Servicio implementado, endpoints pendientes (Fase 4)
