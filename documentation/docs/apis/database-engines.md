---
title: Database Engines API
sidebar_label: Database Engines
---

# Database Engines API

Endpoints para consultar los motores de bases de datos disponibles en CrudCloud.

## Base URL

```
http://localhost:8080/api/v1/engines
```

## Autenticación

Los endpoints de motores de bases de datos son **públicos** y no requieren autenticación JWT.

---

## Listar Todos los Motores

### GET /engines

Obtiene la lista completa de motores de bases de datos soportados.

**Request:**
```http
GET /api/v1/engines
```

**Response (200 OK):**
```json

  "engines": [
    
      "id": 1,
      "name": "MySQL",
      "version": "8.0",
      "description": "World's most popular open source relational database",
      "dockerImage": "mysql:8.0",
      "defaultPort": 3306,
      "category": "SQL",
      "icon": "https://cdn.crudcloud.com/icons/mysql.svg",
      "isActive": true,
      "documentation": "https://dev.mysql.com/doc/",
      "minPlanRequired": "Free"
    
    
      "id": 2,
      "name": "PostgreSQL",
      "version": "15",
      "description": "The world's most advanced open source relational database",
      "dockerImage": "postgres:15",
      "defaultPort": 5432,
      "category": "SQL",
      "icon": "https://cdn.crudcloud.com/icons/postgresql.svg",
      "isActive": true,
      "documentation": "https://www.postgresql.org/docs/",
      "minPlanRequired": "Free"
    
    
      "id": 3,
      "name": "MongoDB",
      "version": "6.0",
      "description": "The most popular NoSQL database for modern applications",
      "dockerImage": "mongo:6.0",
      "defaultPort": 27017,
      "category": "NoSQL",
      "icon": "https://cdn.crudcloud.com/icons/mongodb.svg",
      "isActive": true,
      "documentation": "https://docs.mongodb.com/",
      "minPlanRequired": "Standard"
    
    
      "id": 4,
      "name": "Redis",
      "version": "7.0",
      "description": "In-memory data structure store, used as database, cache, and message broker",
      "dockerImage": "redis:7.0",
      "defaultPort": 6379,
      "category": "Cache/Key-Value",
      "icon": "https://cdn.crudcloud.com/icons/redis.svg",
      "isActive": true,
      "documentation": "https://redis.io/docs/",
      "minPlanRequired": "Standard"
    
    
      "id": 5,
      "name": "SQL Server",
      "version": "2022",
      "description": "Microsoft's enterprise-grade relational database",
      "dockerImage": "mcr.microsoft.com/mssql/server:2022-latest",
      "defaultPort": 1433,
      "category": "SQL",
      "icon": "https://cdn.crudcloud.com/icons/sqlserver.svg",
      "isActive": true,
      "documentation": "https://docs.microsoft.com/sql/",
      "minPlanRequired": "Standard"
    
    
      "id": 6,
      "name": "Cassandra",
      "version": "4.1",
      "description": "Highly-scalable partitioned row store for big data",
      "dockerImage": "cassandra:4.1",
      "defaultPort": 9042,
      "category": "NoSQL/Wide-Column",
      "icon": "https://cdn.crudcloud.com/icons/cassandra.svg",
      "isActive": true,
      "documentation": "https://cassandra.apache.org/doc/",
      "minPlanRequired": "Premium"
    
  
  "totalEngines": 6,
  "categories": ["SQL", "NoSQL", "Cache/Key-Value", "NoSQL/Wide-Column"]

```

**Response Fields:**

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | Long | Identificador único del motor |
| `name` | String | Nombre del motor de base de datos |
| `version` | String | Versión soportada |
| `description` | String | Descripción breve del motor |
| `dockerImage` | String | Imagen Docker oficial utilizada |
| `defaultPort` | Integer | Puerto por defecto del motor |
| `category` | String | Categoría (SQL, NoSQL, etc.) |
| `icon` | String | URL del ícono del motor |
| `isActive` | Boolean | Si el motor está disponible |
| `documentation` | String | URL de la documentación oficial |
| `minPlanRequired` | String | Plan mínimo requerido para usar este motor |

**Errores:**
- `500 Internal Server Error`: Error al obtener motores

---

## Obtener Motor por ID

### GET /engines/id

Obtiene los detalles completos de un motor específico.

**Request:**
```http
GET /api/v1/engines/2
```

**Response (200 OK):**
```json

  "id": 2,
  "name": "PostgreSQL",
  "version": "15",
  "description": "The world's most advanced open source relational database",
  "dockerImage": "postgres:15",
  "defaultPort": 5432,
  "category": "SQL",
  "icon": "https://cdn.crudcloud.com/icons/postgresql.svg",
  "isActive": true,
  "documentation": "https://www.postgresql.org/docs/",
  "minPlanRequired": "Free",
  "specifications": 
    "maxDatabaseSize": "Unlimited",
    "maxConnections": 100,
    "supportedLanguages": ["SQL", "PL/pgSQL", "PL/Python", "PL/Perl"],
    "replicationSupport": true,
    "backupMethods": ["pg_dump", "pg_basebackup", "Continuous Archiving"],
    "performanceFeatures": [
      "Advanced indexing (B-tree, Hash, GiST, SP-GiST, GIN, BRIN)",
      "Query optimization",
      "Parallel query execution",
      "Just-in-time compilation"
    ],
    "securityFeatures": [
      "SSL support",
      "Row-level security",
      "Column-level encryption",
      "Authentication methods (SCRAM, MD5, LDAP, etc.)"
    ]
  
  "useCases": [
    "Web applications",
    "Data warehousing",
    "Geospatial applications (PostGIS)",
    "Time-series data",
    "JSON document storage"
  ],
  "connectionExample": 
    "java": "jdbc:postgresql://host:5432/database",
    "python": "postgresql://user:password@host:5432/database",
    "nodejs": "postgres://user:password@host:5432/database"
  

```

**Errores:**
- `404 Not Found`: Motor no encontrado

---

## Filtrar Motores por Categoría

### GET /engines/category/category

Obtiene motores filtrados por categoría.

**Request:**
```http
GET /api/v1/engines/category/SQL
```

**Path Parameters:**

| Parámetro | Tipo | Valores Posibles |
|-----------|------|------------------|
| `category` | String | SQL, NoSQL, Cache/Key-Value, NoSQL/Wide-Column |

**Response (200 OK):**
```json
{
  "category": "SQL",
  "engines": [
    
      "id": 1,
      "name": "MySQL",
      "version": "8.0",
      "defaultPort": 3306
    
      "id": 2,
      "name": "PostgreSQL",
      "version": "15",
      "defaultPort": 5432
    },
      "id": 5,
      "name": "SQL Server",
      "version": "2022",
      "defaultPort": 1433
    }
  ],
  "totalEngines": 3
}
```

**Errores:**
- `400 Bad Request`: Categoría inválida
- `404 Not Found`: No se encontraron motores para esta categoría

---

## Buscar Motores

### GET /engines/search

Busca motores por nombre o descripción.

**Request:**
```http
GET /api/v1/engines/search?q=mongo
```

**Query Parameters:**

| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|-----------|-------------|
| `q` | String | Sí | Término de búsqueda |
| `category` | String | No | Filtrar por categoría |
| `minPlan` | String | No | Filtrar por plan mínimo |

**Response (200 OK):**
```json
{
  "query": "mongo",
  "results": [
    {
      "id": 3,
      "name": "MongoDB",
      "version": "6.0",
      "description": "The most popular NoSQL database for modern applications",
      "category": "NoSQL",
      "minPlanRequired": "Standard",
      "relevanceScore": 1.0
    }
  ],
  "totalResults": 1
}
```

**Errores:**
- `400 Bad Request`: Parámetro de búsqueda faltante

---

## Comparar Motores

### GET /engines/compare

Compara características entre múltiples motores de bases de datos.

**Request:**
```http
GET /api/v1/engines/compare?engineIds=1,2,3
```

**Query Parameters:**

| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|-----------|-------------|
| `engineIds` | String (CSV) | Sí | IDs de motores separados por comas |

**Response (200 OK):**
```json
{
  "comparison": {
    "features": [
      {
        "feature": "Name",
        "MySQL": "MySQL 8.0",
        "PostgreSQL": "PostgreSQL 15",
        "MongoDB": "MongoDB 6.0"
      },
      {
        "feature": "Type",
        "MySQL": "SQL",
        "PostgreSQL": "SQL",
        "MongoDB": "NoSQL"
      },
      {
        "feature": "Default Port",
        "MySQL": "3306",
        "PostgreSQL": "5432",
        "MongoDB": "27017"
      },
      {
        "feature": "ACID Compliance",
        "MySQL": "Yes",
        "PostgreSQL": "Yes",
        "MongoDB": "Yes (with transactions)"
      },
      {
        "feature": "JSON Support",
        "MySQL": "Yes (JSON column type)",
        "PostgreSQL": "Yes (JSONB)",
        "MongoDB": "Native (BSON)"
      },
      {
        "feature": "Replication",
        "MySQL": "Master-Slave, Group Replication",
        "PostgreSQL": "Streaming Replication",
        "MongoDB": "Replica Sets"
      },
      {
        "feature": "Min Plan Required",
        "MySQL": "Free",
        "PostgreSQL": "Free",
        "MongoDB": "Standard"
      }
    ]
  }
}
```

**Errores:**
- `400 Bad Request`: IDs de motores inválidos
- `404 Not Found`: Uno o más motores no encontrados

---

## Catálogo de Motores Disponibles

### MySQL 8.0

**Características:**
- Base de datos relacional SQL tradicional
- Alta performance para aplicaciones web
- Ecosistema maduro y amplio soporte comunitario
- Replicación master-slave nativa

**Ideal para:**
- Aplicaciones web (WordPress, Drupal, etc.)
- E-commerce
- Sistemas de gestión de contenido (CMS)
- Aplicaciones CRUD tradicionales

**Comando de conexión:**
```bash
mysql -h 91.98.225.17 -P 3306 -u user_42 -p crudcloud_db_42
```

---

### PostgreSQL 15

**Características:**
- Base de datos relacional avanzada
- Soporte completo para ACID
- Extensiones potentes (PostGIS, pgvector, etc.)
- JSON/JSONB nativo para datos semi-estructurados

**Ideal para:**
- Aplicaciones empresariales
- Sistemas financieros
- Aplicaciones geoespaciales (con PostGIS)
- Data warehouses

**Comando de conexión:**
```bash
psql -h 91.98.225.17 -p 5432 -U user_42 -d crudcloud_db_42
```

---

### MongoDB 6.0

**Características:**
- Base de datos NoSQL orientada a documentos
- Esquema flexible (schema-less)
- Alta escalabilidad horizontal
- Consultas potentes sobre documentos JSON

**Ideal para:**
- Aplicaciones modernas con datos no estructurados
- Catálogos de productos
- Sistemas de gestión de contenido dinámico
- APIs REST con datos JSON

**Comando de conexión:**
```bash
mongosh "mongodb://user_42:password@91.98.225.17:27017/crudcloud_db_42"
```

**Plan requerido:** Standard o superior

---

### Redis 7.0

**Características:**
- Almacenamiento en memoria (in-memory)
- Estructuras de datos avanzadas (strings, lists, sets, hashes)
- Persistencia opcional
- Pub/Sub messaging

**Ideal para:**
- Caché de aplicaciones
- Sesiones de usuario
- Colas de mensajes
- Leaderboards y contadores en tiempo real

**Comando de conexión:**
```bash
redis-cli -h 91.98.225.17 -p 6379 -a password
```

**Plan requerido:** Standard o superior

---

### SQL Server 2022

**Características:**
- Base de datos empresarial de Microsoft
- Integración nativa con ecosistema .NET
- Herramientas avanzadas de BI y análisis
- Seguridad de nivel empresarial

**Ideal para:**
- Aplicaciones empresariales .NET
- Business Intelligence
- Sistemas de reportes complejos
- Integración con Azure

**Comando de conexión:**
```bash
sqlcmd -S 91.98.225.17,1433 -U user_42 -P password -d crudcloud_db_42
```

**Plan requerido:** Standard o superior

---

### Cassandra 4.1

**Características:**
- Base de datos NoSQL distribuida
- Alta disponibilidad sin punto único de fallo
- Escalabilidad lineal
- Modelo de datos wide-column

**Ideal para:**
- Aplicaciones con datos masivos (Big Data)
- Sistemas de IoT
- Series temporales
- Aplicaciones que requieren alta disponibilidad

**Comando de conexión:**
```bash
cqlsh 91.98.225.17 9042 -u user_42 -p password
```

**Plan requerido:** Premium

---

## Ejemplos de Uso

### Listar todos los motores

```bash
curl -X GET http://localhost:8080/api/v1/engines
```

### Ver motor específico

```bash
curl -X GET http://localhost:8080/api/v1/engines/2
```

### Filtrar por categoría SQL

```bash
curl -X GET http://localhost:8080/api/v1/engines/category/SQL
```

### Buscar MongoDB

```bash
curl -X GET "http://localhost:8080/api/v1/engines/search?q=mongo"
```

### Comparar MySQL vs PostgreSQL

```bash
curl -X GET "http://localhost:8080/api/v1/engines/compare?engineIds=1,2"
```

---

## Integración con Frontend

### Ejemplo en JavaScript

```javascript
// Obtener todos los motores
async function getDatabaseEngines() {
  const response = await fetch('http://localhost:8080/api/v1/engines');
  const data = await response.json();
  return data.engines;
}

// Filtrar motores por plan
function filterByPlan(engines, userPlan) {
  const planHierarchy = { Free: 1, Standard: 2, Premium: 3 };
  return engines.filter(
    engine => planHierarchy[engine.minPlanRequired] <= planHierarchy[userPlan]
  );
}

// Uso
getDatabaseEngines().then(engines => {
  const availableEngines = filterByPlan(engines, 'Standard');
  console.log('Available engines:', availableEngines);
});
```

### Ejemplo en React

```jsx
import React, { useState, useEffect } from 'react';

function EngineSelector({ userPlan, onSelect }) {
  const [engines, setEngines] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    fetch('http://localhost:8080/api/v1/engines')
      .then(res => res.json())
      .then(data => setEngines(data.engines));
  }, []);

  const filteredEngines = selectedCategory === 'All'
    ? engines
    : engines.filter(e => e.category === selectedCategory);

  return (
    <div className="engine-selector">
      <div className="category-filter">
        <button onClick={() => setSelectedCategory('All')}>All</button>
        <button onClick={() => setSelectedCategory('SQL')}>SQL</button>
        <button onClick={() => setSelectedCategory('NoSQL')}>NoSQL</button>
      </div>

      <div className="engines-grid">
        {filteredEngines.map(engine => (
          <div key={engine.id} className="engine-card">
            <img src={engine.icon} alt={engine.name} />
            <h3>{engine.name} {engine.version}</h3>
            <p>{engine.description}</p>
            <span className="port">Port: {engine.defaultPort}</span>
            <span className="plan-badge">{engine.minPlanRequired}+</span>
            <button onClick={() => onSelect(engine)}>
              Select Engine
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

## Roadmap de Motores

Próximos motores en desarrollo:

- **MariaDB 10.11** - Fork de MySQL con características adicionales
- **Elasticsearch 8.x** - Motor de búsqueda y analítica
- **CockroachDB** - Base de datos SQL distribuida
- **TimescaleDB** - Base de datos optimizada para series temporales
- **Neo4j** - Base de datos de grafos

---

## Notas de Compatibilidad

- Todos los motores se ejecutan en contenedores Docker aislados
- Los puertos por defecto pueden ser personalizados al crear instancias
- Las versiones de motores se actualizan periódicamente
- Algunos motores requieren configuraciones específicas de recursos (ver plan Premium)
