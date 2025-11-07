---
sidebar_position: 4
title: Ordenes
---

# API de Ordenes

Gestion de ordenes y pedidos.

## Endpoints

### POST /api/orders

Crea una nueva orden.

**Request:**
```json
{
  "items": [
    {
      "productId": 1,
      "quantity": 2
    },
    {
      "productId": 2,
      "quantity": 1
    }
  ],
  "shippingAddress": {
    "street": "Calle 123",
    "city": "Bogota",
    "country": "Colombia",
    "postalCode": "110111"
  }
}
```

**Response (201 Created):**
```json
{
  "id": 1,
  "orderNumber": "ORD-2025-00001",
  "userId": 1,
  "items": [
    {
      "productId": 1,
      "productName": "Laptop HP",
      "quantity": 2,
      "price": 2500000.00,
      "subtotal": 5000000.00
    }
  ],
  "total": 5080000.00,
  "status": "PENDING",
  "createdAt": "2025-01-07T10:00:00"
}
```

### GET /api/orders

Lista todas las ordenes del usuario autenticado.

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "orderNumber": "ORD-2025-00001",
    "total": 5080000.00,
    "status": "PENDING",
    "createdAt": "2025-01-07T10:00:00"
  }
]
```

### GET /api/orders/{id}

Obtiene detalles de una orden.

### PUT /api/orders/{id}/status

Actualiza el estado de una orden (requiere ROLE_ADMIN).

**Request:**
```json
{
  "status": "CONFIRMED"
}
```

**Estados posibles:**
- PENDING
- CONFIRMED
- PROCESSING
- SHIPPED
- DELIVERED
- CANCELLED
