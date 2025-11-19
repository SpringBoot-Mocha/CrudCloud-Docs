---
sidebar_position: 1
title: Introducción
slug: /intro
---

# Bienvenido a CrudCloud

**CrudCloud** es una plataforma empresarial robusta y escalable para la **creación y gestión automatizada de instancias de bases de datos reales** en contenedores Docker. Desarrollado con las últimas tecnologías de Java y Spring Boot, CrudCloud permite a usuarios y organizaciones desplegar, monitorear y administrar múltiples motores de bases de datos desde una única API RESTful.

## Visión General del Proyecto

CrudCloud Backend es una solución moderna de **Database-as-a-Service (DBaaS)** diseñada para simplificar el aprovisionamiento y gestión de bases de datos mediante orquestación de contenedores Docker. El proyecto implementa las mejores prácticas de desarrollo, arquitectura limpia y patrones de diseño probados en la industria.

### ¿Qué Problema Resuelve?

- **Eliminación de configuración manual**: Crea instancias de MySQL, PostgreSQL, MongoDB y más con un solo clic
- **Gestión centralizada**: Administra todas tus bases de datos desde una única interfaz
- **Escalabilidad controlada**: Sistema de planes con límites de instancias (FREE: 2, STANDARD: 5, PREMIUM: 10)
- **Automatización completa**: Desde la creación del contenedor Docker hasta la entrega de credenciales encriptadas
- **Métricas en tiempo real**: Monitoreo de CPU, memoria y estado de cada instancia vía Docker Stats API

### Características Principales

#### 🚀 Gestión de Instancias de Bases de Datos
- **6 Motores Soportados**: MySQL, PostgreSQL, MongoDB, Redis, SQL Server, Cassandra
- **Creación Automatizada**: Orquestación de contenedores Docker con docker-java 3.3.4
- **Gestión de Ciclo de Vida**: Estados CREATING → RUNNING → SUSPENDED → DELETED
- **Credenciales Seguras**: Encriptación AES-256 para contraseñas y URIs de conexión
- **Métricas Dockerizadas**: Consumo de CPU/memoria en tiempo real desde Docker Stats API

#### 🔐 Autenticación y Seguridad
- **JWT Tokens**: Autenticación segura con jjwt 0.12.3
- **BCrypt Hashing**: Contraseñas hasheadas con factor de coste 10
- **Encriptación AES-256**: Credenciales de bases de datos protegidas
- **Validación Robusta**: Jakarta Validation en todos los DTOs

#### 💳 Sistema de Planes y Suscripciones
- **Plan FREE**: 2 instancias, funcionalidad básica
- **Plan STANDARD**: 5 instancias, monitoreo avanzado ($9.99/mes)
- **Plan PREMIUM**: 10 instancias, soporte prioritario ($19.99/mes)
- **Integración Mercado Pago**: Procesamiento de pagos con SDK 2.1.26
- **Control de Límites**: Validación automática de cuotas por suscripción

#### 📊 Arquitectura Docker
- **Orquestación Nativa**: Control directo del Docker Daemon vía socket Unix
- **Contenedores Aislados**: Cada instancia en su propio contenedor con puerto único
- **Despliegue Automatizado**: Imágenes oficiales de DockerHub (mysql:latest, postgres:15, etc.)
- **Gestión de Recursos**: Monitoreo y limitación de CPU/memoria por contenedor

## Stack Tecnológico

### Core

| Tecnología | Versión | Propósito |
|-----------|---------|-----------|
| **Java** | 21 LTS | Lenguaje de programación |
| **Spring Boot** | 3.5.7 | Framework principal |
| **Maven** | 3.x | Gestión de dependencias |
| **PostgreSQL** | 15+ | Base de datos relacional (metadata) |
| **Docker** | 20.10+ | Orquestación de contenedores |

### Dependencias Principales

| Dependencia | Versión | Uso en CrudCloud |
|------------|---------|------------------|
| **docker-java** | 3.3.4 | Orquestación de contenedores Docker |
| **jjwt** | 0.12.3 | Generación y validación de tokens JWT |
| **spring-security** | 3.5.7 | Autenticación y autorización |
| **spring-data-jpa** | 3.5.7 | Persistencia con Hibernate |
| **mercadopago-sdk** | 2.1.26 | Procesamiento de pagos |
| **modelmapper** | 3.2.5 | Mapeo entre DTOs y entidades |
| **bcrypt** | (incluido en Spring Security) | Hash de contraseñas |
| **lombok** | 1.18.30 | Reducción de código boilerplate |

## Arquitectura

CrudCloud sigue una arquitectura en capas (Layered Architecture) con orquestación de Docker:

```
┌─────────────────────────────────────────────────────┐
│           Controller Layer (REST API)               │
│  /api/v1/auth | /instances | /subscriptions | /pay  │
├─────────────────────────────────────────────────────┤
│              Service Layer                          │
│  UserService | DatabaseInstanceService | JwtService │
│  SubscriptionService | PaymentService               │
├─────────────────────────────────────────────────────┤
│           Repository Layer (Spring Data JPA)        │
│  UserRepo | InstanceRepo | CredentialRepo           │
├─────────────────────────────────────────────────────┤
│          Entity/Model Layer (7 tablas)              │
│  User | Plan | Subscription | DatabaseEngine        │
│  DatabaseInstance | Credential | Transaction        │
└─────────────────────────────────────────────────────┘
                          ↓
         ┌────────────────────────────────┐
         │       Docker Daemon            │
         │  /var/run/docker.sock          │
         └────────────────────────────────┘
                          ↓
    ┌──────────┬──────────┬──────────┬──────────┐
    │ MySQL    │ Postgres │ MongoDB  │ Redis    │
    │ :3306    │ :5432    │ :27017   │ :6379    │
    └──────────┴──────────┴──────────┴──────────┘
        Contenedores Docker Aislados
```

### Patrones de Diseño Implementados

- **DTO Pattern**: Transferencia de datos entre capas (Request/Response DTOs)
- **Repository Pattern**: Abstracción de acceso a datos con Spring Data JPA
- **Service Layer Pattern**: Encapsulación de lógica de negocio (6 servicios)
- **Dependency Injection**: Inversión de control con Spring Boot
- **Builder Pattern**: Construcción de entidades complejas (via Lombok @Builder)
- **Strategy Pattern**: Selección dinámica de motor de base de datos

## Modelo de Datos (7 Tablas Principales)

### Entidades Core

1. **User**: Usuarios y organizaciones del sistema
   - `isOrganization`: Distingue cuentas individuales vs empresariales
   - Relación 1:N con `Subscription`

2. **Plan**: Planes de suscripción (FREE, STANDARD, PREMIUM)
   - `maxInstances`: Límite de instancias por plan (2/5/10)
   - `price`: Precio mensual ($0, $9.99, $19.99)

3. **Subscription**: Relación Usuario-Plan
   - `isActive`: Control de estado de suscripción
   - Validación de límites de instancias

4. **DatabaseEngine**: Motores de bases de datos soportados
   - Tipos: MySQL, PostgreSQL, MongoDB, Redis, SQL Server, Cassandra
   - `defaultPort`: Puerto estándar de cada motor
   - `dockerImage`: Imagen de DockerHub (ej: `postgres:15`)

5. **DatabaseInstance**: Instancias de bases de datos reales
   - `containerName`: Nombre único del contenedor Docker
   - `status`: CREATING, RUNNING, SUSPENDED, DELETED
   - `cpuUsage`, `memoryUsage`: Métricas en tiempo real

6. **Credential**: Credenciales de conexión encriptadas
   - `username`, `password`: Encriptados con AES-256
   - `host`, `port`, `databaseName`: Datos de conexión
   - Relación 1:1 con `DatabaseInstance`

7. **Transaction**: Transacciones de Mercado Pago
   - `mercadopagoPaymentId`: ID del pago en MP
   - `status`: PENDING, APPROVED, FAILED
   - Relación con `User` para upgrades de plan

### Diagrama ER Simplificado

```
User (1) ──→ (N) Subscription (N) ──→ (1) Plan
  │
  ├──→ (N) DatabaseInstance (N) ──→ (1) DatabaseEngine
  │           │
  │           └──→ (1) Credential
  │
  └──→ (N) Transaction
```

## Casos de Uso Reales

CrudCloud Backend es ideal para:

- **Desarrollo de software**: Equipos que necesitan bases de datos temporales para testing
- **Educación**: Profesores que proveen instancias de BD a estudiantes
- **Empresas SaaS**: Asignación de bases de datos dedicadas por cliente (multi-tenancy)
- **Prototipos rápidos**: Startups que necesitan infraestructura de BD sin DevOps
- **Agencias digitales**: Gestión centralizada de BDs de múltiples proyectos

## Infraestructura de Despliegue

### Entorno de Pruebas (CleverCloud)

**Base de Datos de Metadata (PostgreSQL 15)**:
- **Host**: `bsynuybdaaahq5cfinjv-postgresql.services.clever-cloud.com`
- **Puerto**: `5432`
- **Database**: `bsynuybdaaahq5cfinjv`
- **Usuario**: `usok8mpbqivjrvbagktt`
- **Propósito**: Almacenar metadata del sistema (usuarios, planes, instancias)

### Entorno de Producción (VPS)

**Servidor Principal**:
- **IP**: `91.98.225.17`
- **Acceso SSH**: `root@91.98.225.17`
- **Docker**: Instalado para orquestación de contenedores
- **Propósito**: Hosting del backend + contenedores de bases de datos de clientes

## Prerequisitos

Antes de comenzar, asegúrate de tener instalado:

- **Java 21** o superior (LTS)
- **Maven 3.8+**
- **PostgreSQL 15+** (para metadata del sistema)
- **Docker 20.10+** (para creación de instancias)
- **Git**
- **IDE** (IntelliJ IDEA, Eclipse, o VS Code con Java Extension Pack)

## Inicio Rápido

```bash
# Clonar el repositorio
git clone https://github.com/crudzaso/CrudCloud-Backend.git

# Navegar al directorio
cd CrudCloud-Backend/CrudCloud

# Configurar variables de entorno
cp src/main/resources/application.properties.example \
   src/main/resources/application.properties

# Editar application.properties con tus credenciales
nano src/main/resources/application.properties

# Instalar dependencias
mvn clean install -DskipTests

# Ejecutar la aplicación
mvn spring-boot:run
```

La aplicación estará disponible en `http://localhost:8080`

### Verificar Instalación

```bash
# Health check
curl http://localhost:8080/actuator/health

# Respuesta esperada:
# {"status":"UP"}
```

## Estado de Implementación

**📊 Progreso General: 60% Completado**

| Componente | Estado | Fase |
|-----------|--------|------|
| **Entidades JPA** (7 tablas) | ✅ Completo | Fase 2 |
| **Repositories** (7 interfaces) | ✅ Completo | Fase 2 |
| **Services** (6 implementaciones) | ✅ Completo | Fase 3 |
| **DTOs** (Request/Response) | ✅ Completo | Fase 3 |
| **Controllers REST** | ⏳ Pendiente | Fase 4 |
| **Security + JWT** | ⏳ Pendiente | Fase 4 |
| **Docker Integration** | ⏳ Pendiente | Fase 5 |
| **Frontend Web** | ⏳ Pendiente | Fase 6 |

### Servicios Implementados

- ✅ **UserServiceImpl**: CRUD de usuarios con validaciones
- ✅ **AuthenticationServiceImpl**: Login con JWT + BCrypt
- ✅ **SubscriptionServiceImpl**: Gestión de planes y límites
- ✅ **DatabaseInstanceServiceImpl**: CRUD de instancias (sin Docker aún)
- ✅ **PaymentServiceImpl**: Integración con Mercado Pago (preparado)
- ✅ **JwtServiceImpl**: Generación/validación de tokens con jjwt 0.12.3

### Próximos Pasos

1. **Fase 4**: Implementar Controllers REST y configurar Spring Security
2. **Fase 5**: Integrar docker-java para creación real de contenedores
3. **Fase 6**: Desarrollar frontend con React/Vue para gestión visual

## Estructura de la Documentación

Esta documentación está organizada en las siguientes secciones:

1. **[Guía de Inicio](/docs/guia-inicio/requisitos)**: Instalación, configuración y primer run
2. **[Arquitectura](/docs/arquitectura/resumen)**: Estructura del proyecto, dependencias y modelo de datos
3. **[Desarrollo](/docs/desarrollo/guia-desarrollo)**: Guías de desarrollo, convenciones y testing
4. **[API Reference](/docs/api/autenticacion)**: Documentación detallada de endpoints REST
5. **Deployment**: Guías de despliegue con Docker y configuración de producción

## Endpoints Principales (Próximos)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/v1/auth/register` | Registro de usuarios |
| POST | `/api/v1/auth/login` | Autenticación con JWT |
| POST | `/api/v1/instances` | Crear instancia de base de datos |
| GET | `/api/v1/instances` | Listar instancias del usuario |
| GET | `/api/v1/instances/{id}/credentials` | Obtener credenciales de conexión |
| DELETE | `/api/v1/instances/{id}` | Eliminar instancia |
| POST | `/api/v1/subscriptions/upgrade` | Cambiar plan de suscripción |
| POST | `/api/v1/payments` | Procesar pago con Mercado Pago |

## Soporte y Contribuciones

- **Repositorio**: [GitHub - CrudCloud Backend](https://github.com/crudzaso/CrudCloud-Backend)
- **Issues**: Reporta bugs o solicita features en GitHub Issues
- **Contribuciones**: Pull requests son bienvenidos siguiendo las convenciones de código
- **Documentación**: Mantén esta documentación actualizada con cada cambio

## Licencia

Este proyecto es propiedad de CrudCloud. Todos los derechos reservados.

---

**¿Listo para comenzar?** Dirígete a la [Guía de Inicio](/docs/guia-inicio/requisitos) para configurar tu entorno de desarrollo.
