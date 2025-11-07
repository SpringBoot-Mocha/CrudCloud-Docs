---
sidebar_position: 5
title: Pagos
---

# API de Pagos

Integracion con Mercado Pago para procesamiento de pagos.

## Endpoints

### POST /api/payments/create-preference

Crea una preferencia de pago en Mercado Pago.

**Request:**
```json
{
  "orderId": 1,
  "items": [
    {
      "title": "Laptop HP",
      "quantity": 1,
      "unitPrice": 2500000.00
    }
  ],
  "payer": {
    "email": "customer@example.com",
    "name": "John Doe"
  }
}
```

**Response (200 OK):**
```json
{
  "preferenceId": "123456789-abcd-efgh-ijkl-123456789012",
  "initPoint": "https://www.mercadopago.com.co/checkout/v1/redirect?pref_id=123456789...",
  "sandboxInitPoint": "https://sandbox.mercadopago.com.co/checkout/v1/redirect?pref_id=123456789..."
}
```

### POST /api/payments/webhook

Recibe notificaciones de Mercado Pago (webhook).

**Mercado Pago enviara:**
```json
{
  "action": "payment.created",
  "api_version": "v1",
  "data": {
    "id": "123456789"
  },
  "date_created": "2025-01-07T10:00:00Z",
  "id": 12345,
  "live_mode": false,
  "type": "payment",
  "user_id": "123456789"
}
```

### GET /api/payments/{paymentId}

Obtiene informacion de un pago.

**Response (200 OK):**
```json
{
  "id": 1,
  "orderId": 1,
  "externalId": "123456789",
  "status": "approved",
  "amount": 2500000.00,
  "paymentMethod": "credit_card",
  "createdAt": "2025-01-07T10:00:00"
}
```

## Estados de Pago

- `pending` - Pago pendiente
- `approved` - Pago aprobado
- `rejected` - Pago rechazado
- `cancelled` - Pago cancelado
- `refunded` - Pago reembolsado

## Configuracion Webhook

URL del webhook: `https://yourdomain.com/api/payments/webhook`

Configurar en: Mercado Pago Dashboard > Webhooks
