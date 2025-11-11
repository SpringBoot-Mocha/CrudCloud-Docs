---
sidebar_position: 5
title: Plans
---

# Plans API

Endpoints para consultar los planes de suscripción disponibles en CrudCloud.

## Base URL

```
http://localhost:8080/api/v1/plans
```

## Autenticación

Los endpoints de planes son **públicos** y no requieren autenticación JWT.

---

## Listar Todos los Planes

### GET /plans

Obtiene la lista completa de planes de suscripción disponibles.

**Request:**
```http
GET /api/v1/plans
```

**Response (200 OK):**
```json
{
  "plans": [
    {
      "id": 1,
      "name": "Free",
      "description": "Perfect for getting started with CrudCloud",
      "price": 0.00,
      "currency": "USD",
      "billingCycle": "monthly",
      "maxInstances": 2,
      "features": [
        "2 database instances",
        "MySQL, PostgreSQL support",
        "Basic monitoring",
        "Community support",
        "Email notifications"
      ],
      "limitations": [
        "No custom configurations",
        "Standard performance",
        "Limited backup retention (7 days)"
      ],
      "isActive": true,
      "sortOrder": 1
    },
    {
      "id": 2,
      "name": "Standard",
      "description": "For small teams and growing projects",
      "price": 9.99,
      "currency": "USD",
      "billingCycle": "monthly",
      "maxInstances": 5,
      "features": [
        "5 database instances",
        "All database engines (MySQL, PostgreSQL, MongoDB, Redis, SQL Server, Cassandra)",
        "Advanced monitoring & metrics",
        "Email support (24h response)",
        "Custom configurations",
        "Automated backups (30 days retention)",
        "Performance analytics",
        "99.5% SLA guarantee"
      ],
      "limitations": [
        "Max 5 concurrent instances",
        "Standard resource allocation"
      ],
      "isActive": true,
      "sortOrder": 2,
      "popular": true
    },
    {
      "id": 3,
      "name": "Premium",
      "description": "For enterprises and high-demand applications",
      "price": 19.99,
      "currency": "USD",
      "billingCycle": "monthly",
      "maxInstances": 10,
      "features": [
        "10 database instances",
        "All database engines with advanced configurations",
        "Real-time monitoring & alerting",
        "Priority support (1h response)",
        "Dedicated resources",
        "Automated backups (90 days retention)",
        "Advanced security features",
        "Performance optimization",
        "99.9% SLA guarantee",
        "Custom integrations"
      ],
      "limitations": [],
      "isActive": true,
      "sortOrder": 3,
      "recommended": true
    }
  ],
  "totalPlans": 3
}
```

**Response Fields:**

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | Long | Identificador único del plan |
| `name` | String | Nombre del plan |
| `description` | String | Descripción breve del plan |
| `price` | Decimal | Precio mensual |
| `currency` | String | Código de moneda (USD, COP, etc.) |
| `billingCycle` | String | Ciclo de facturación (monthly, yearly) |
| `maxInstances` | Integer | Número máximo de instancias permitidas |
| `features` | Array | Lista de características incluidas |
| `limitations` | Array | Lista de limitaciones |
| `isActive` | Boolean | Si el plan está disponible para suscripción |
| `sortOrder` | Integer | Orden de visualización |
| `popular` | Boolean | Etiqueta de plan más popular |
| `recommended` | Boolean | Etiqueta de plan recomendado |

**Errores:**
- `500 Internal Server Error`: Error al obtener planes

---

## Obtener Plan por ID

### GET /plans/{id}

Obtiene los detalles de un plan específico.

**Request:**
```http
GET /api/v1/plans/2
```

**Response (200 OK):**
```json
{
  "id": 2,
  "name": "Standard",
  "description": "For small teams and growing projects",
  "price": 9.99,
  "currency": "USD",
  "billingCycle": "monthly",
  "maxInstances": 5,
  "features": [
    "5 database instances",
    "All database engines (MySQL, PostgreSQL, MongoDB, Redis, SQL Server, Cassandra)",
    "Advanced monitoring & metrics",
    "Email support (24h response)",
    "Custom configurations",
    "Automated backups (30 days retention)",
    "Performance analytics",
    "99.5% SLA guarantee"
  ],
  "limitations": [
    "Max 5 concurrent instances",
    "Standard resource allocation"
  ],
  "isActive": true,
  "sortOrder": 2,
  "popular": true,
  "detailedSpecs": {
    "cpuCoresPerInstance": 2,
    "ramPerInstanceGB": 4,
    "storagePerInstanceGB": 50,
    "networkBandwidthMbps": 100,
    "backupFrequency": "daily",
    "backupRetentionDays": 30,
    "supportChannels": ["email", "documentation"],
    "supportResponseTime": "24 hours",
    "slaUptime": "99.5%"
  }
}
```

**Errores:**
- `404 Not Found`: Plan no encontrado

---

## Comparar Planes

### GET /plans/compare

Compara características entre múltiples planes.

**Request:**
```http
GET /api/v1/plans/compare?planIds=1,2,3
```

**Query Parameters:**

| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|-----------|-------------|
| `planIds` | String (CSV) | Sí | IDs de planes separados por comas |

**Response (200 OK):**
```json
{
  "comparison": {
    "features": [
      {
        "feature": "Max Instances",
        "Free": "2",
        "Standard": "5",
        "Premium": "10"
      },
      {
        "feature": "Database Engines",
        "Free": "MySQL, PostgreSQL",
        "Standard": "All engines",
        "Premium": "All engines + advanced configs"
      },
      {
        "feature": "Monitoring",
        "Free": "Basic",
        "Standard": "Advanced",
        "Premium": "Real-time + Alerting"
      },
      {
        "feature": "Support",
        "Free": "Community",
        "Standard": "Email (24h)",
        "Premium": "Priority (1h)"
      },
      {
        "feature": "SLA",
        "Free": "None",
        "Standard": "99.5%",
        "Premium": "99.9%"
      },
      {
        "feature": "Backup Retention",
        "Free": "7 days",
        "Standard": "30 days",
        "Premium": "90 days"
      },
      {
        "feature": "Price (Monthly)",
        "Free": "$0.00",
        "Standard": "$9.99",
        "Premium": "$19.99"
      }
    ]
  }
}
```

**Errores:**
- `400 Bad Request`: IDs de planes inválidos
- `404 Not Found`: Uno o más planes no encontrados

---

## Obtener Plan Recomendado

### GET /plans/recommended

Obtiene el plan recomendado basado en las necesidades del usuario.

**Request:**
```http
GET /api/v1/plans/recommended?instances=7&budget=15
```

**Query Parameters:**

| Parámetro | Tipo | Default | Descripción |
|-----------|------|---------|-------------|
| `instances` | Integer | - | Número estimado de instancias necesarias |
| `budget` | Decimal | - | Presupuesto mensual máximo (USD) |
| `engines` | String (CSV) | all | Motores de BD requeridos |
| `support` | String | standard | Nivel de soporte (basic, standard, priority) |

**Response (200 OK):**
```json
{
  "recommendedPlan": {
    "id": 3,
    "name": "Premium",
    "price": 19.99,
    "maxInstances": 10,
    "reason": "You need 7 instances, which exceeds the Standard plan limit of 5"
  },
  "alternatives": [
    {
      "id": 2,
      "name": "Standard",
      "price": 9.99,
      "maxInstances": 5,
      "note": "Consider reducing instances to 5 to fit this plan"
    }
  ]
}
```

**Errores:**
- `400 Bad Request`: Parámetros de búsqueda inválidos

---

## Resumen de Planes

### Tabla Comparativa Rápida

| Característica | Free | Standard | Premium |
|---------------|------|----------|---------|
| **Precio Mensual** | $0.00 | $9.99 | $19.99 |
| **Máximo Instancias** | 2 | 5 | 10 |
| **Motores de BD** | MySQL, PostgreSQL | Todos | Todos + avanzado |
| **Monitoreo** | Básico | Avanzado | Tiempo real |
| **Soporte** | Comunidad | Email (24h) | Prioritario (1h) |
| **SLA** | - | 99.5% | 99.9% |
| **Backups** | 7 días | 30 días | 90 días |
| **CPU por Instancia** | 1 core | 2 cores | 4 cores |
| **RAM por Instancia** | 2 GB | 4 GB | 8 GB |
| **Storage** | 20 GB | 50 GB | 100 GB |

---

## Casos de Uso por Plan

### Plan Free

Ideal para:
- Desarrollo personal y aprendizaje
- Proyectos pequeños sin requisitos de producción
- Pruebas de concepto (POC)
- Estudiantes y educadores

**Ejemplo:**
```bash
# Obtener detalles del plan Free
curl -X GET http://localhost:8080/api/v1/plans/1
```

### Plan Standard

Ideal para:
- Startups y pequeños equipos (2-10 personas)
- Aplicaciones en producción con tráfico moderado
- Proyectos con presupuesto limitado
- Múltiples entornos (dev, staging, prod)

**Ejemplo:**
```bash
# Obtener detalles del plan Standard
curl -X GET http://localhost:8080/api/v1/plans/2
```

### Plan Premium

Ideal para:
- Empresas medianas y grandes
- Aplicaciones críticas de misión
- Equipos distribuidos que requieren múltiples instancias
- Proyectos con requisitos de SLA estrictos

**Ejemplo:**
```bash
# Obtener detalles del plan Premium
curl -X GET http://localhost:8080/api/v1/plans/3
```

---

## Preguntas Frecuentes

### ¿Puedo cambiar de plan en cualquier momento?

Sí, puedes hacer upgrade o downgrade en cualquier momento. Ver [Subscriptions API](/docs/api/subscriptions) para más detalles.

### ¿Qué pasa si excedo el límite de instancias?

No podrás crear más instancias hasta que:
- Elimines instancias existentes, o
- Hagas upgrade a un plan con mayor capacidad

### ¿Hay descuentos por facturación anual?

Actualmente solo ofrecemos facturación mensual. Los planes anuales con descuento estarán disponibles próximamente.

### ¿Los precios incluyen impuestos?

Los precios mostrados no incluyen impuestos locales, que se calcularán durante el checkout.

---

## Ejemplos de Uso

### Listar todos los planes

```bash
curl -X GET http://localhost:8080/api/v1/plans
```

### Ver plan específico

```bash
curl -X GET http://localhost:8080/api/v1/plans/2
```

### Comparar planes

```bash
curl -X GET "http://localhost:8080/api/v1/plans/compare?planIds=1,2,3"
```

### Obtener plan recomendado

```bash
curl -X GET "http://localhost:8080/api/v1/plans/recommended?instances=7&budget=20"
```

---

## Integración con Frontend

### Ejemplo en JavaScript

```javascript
// Obtener todos los planes
async function getPlans() {
  const response = await fetch('http://localhost:8080/api/v1/plans');
  const data = await response.json();
  return data.plans;
}

// Mostrar planes en UI
getPlans().then(plans => {
  plans.forEach(plan => {
    console.log(`${plan.name}: $${plan.price}/month - ${plan.maxInstances} instances`);
  });
});
```

### Ejemplo en React

```jsx
import React, { useState, useEffect } from 'react';

function PlansTable() {
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8080/api/v1/plans')
      .then(res => res.json())
      .then(data => setPlans(data.plans));
  }, []);

  return (
    <div className="plans-grid">
      {plans.map(plan => (
        <div key={plan.id} className="plan-card">
          <h2>{plan.name}</h2>
          <p className="price">${plan.price}/month</p>
          <p>{plan.description}</p>
          <ul>
            {plan.features.map((feature, i) => (
              <li key={i}>{feature}</li>
            ))}
          </ul>
          <button>Select Plan</button>
        </div>
      ))}
    </div>
  );
}
```

---

## Notas Adicionales

- Los planes pueden ser actualizados por administradores sin previo aviso
- Los usuarios existentes mantienen su precio actual hasta que cambien de plan
- Nuevas características pueden ser añadidas a planes existentes
- Se recomienda revisar periódicamente los cambios en planes
