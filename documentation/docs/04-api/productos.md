---
sidebar_position: 3
title: Productos
---

# API de Productos

CRUD de productos con busqueda y filtros.

## Endpoints

### GET /api/products

Lista todos los productos.

**Query Parameters:**
- `page` (int): Numero de pagina (default: 0)
- `size` (int): Tamaño de pagina (default: 20)
- `search` (string): Buscar por nombre
- `categoryId` (long): Filtrar por categoria

**Response (200 OK):**
```json
{
  "content": [
    {
      "id": 1,
      "name": "Laptop HP",
      "description": "Laptop con Intel i5",
      "price": 2500000.00,
      "stock": 10,
      "category": {
        "id": 1,
        "name": "Electronica"
      }
    }
  ],
  "page": 0,
  "size": 20,
  "totalElements": 1,
  "totalPages": 1
}
```

### GET /api/products/{id}

Obtiene un producto por ID.

**Response (200 OK):**
```json
{
  "id": 1,
  "name": "Laptop HP",
  "description": "Laptop con Intel i5",
  "price": 2500000.00,
  "stock": 10,
  "category": {
    "id": 1,
    "name": "Electronica"
  },
  "createdAt": "2025-01-07T10:00:00"
}
```

### POST /api/products

Crea un nuevo producto (requiere ROLE_ADMIN).

**Request:**
```json
{
  "name": "Mouse Logitech",
  "description": "Mouse inalambrico",
  "price": 80000.00,
  "stock": 50,
  "categoryId": 1
}
```

**Response (201 Created):**
```json
{
  "id": 2,
  "name": "Mouse Logitech",
  "description": "Mouse inalambrico",
  "price": 80000.00,
  "stock": 50,
  "category": {
    "id": 1,
    "name": "Electronica"
  }
}
```

### PUT /api/products/{id}

Actualiza un producto (requiere ROLE_ADMIN).

### DELETE /api/products/{id}

Elimina un producto (requiere ROLE_ADMIN).

**Response (204 No Content)**
