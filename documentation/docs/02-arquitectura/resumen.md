---
sidebar_position: 1
title: Resumen de Arquitectura
---

# Resumen de Arquitectura

CrudCloud Backend sigue una **arquitectura en capas (Layered Architecture)** con integración de orquestación de contenedores Docker para la gestión automatizada de instancias de bases de datos.

## Principios de Diseño

### 1. Separación de Responsabilidades (SoC)

Cada capa tiene una responsabilidad única y bien definida:

- **Controller**: Manejo de HTTP requests/responses
- **Service**: Lógica de negocio y orquestación Docker
- **Repository**: Acceso a datos de metadata del sistema
- **Entity**: Representación del modelo de dominio (7 tablas principales)

### 2. Inversión de Dependencias (DI)

Uso de Spring Framework para inyección de dependencias:

```java
@Service
@RequiredArgsConstructor
public class DatabaseInstanceServiceImpl implements DatabaseInstanceService {
    private final DatabaseInstanceRepository instanceRepository;
    private final UserRepository userRepository;
    private final SubscriptionService subscriptionService;
    // Inyección por constructor via Lombok
}
```

### 3. Encriptación y Seguridad

- **JWT**: Autenticación stateless con jjwt 0.12.3
- **BCrypt**: Hash de contraseñas de usuarios (factor 10)
- **AES-256**: Encriptación de credenciales de bases de datos

## Arquitectura en Capas con Docker

```
┌──────────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                        │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐            │
│  │Controllers │  │   DTOs     │  │ Exception  │            │
│  │  (REST)    │  │Request/Resp│  │  Handlers  │            │
│  └────────────┘  └────────────┘  └────────────┘            │
│  /api/v1/auth | /instances | /subscriptions | /payments     │
└──────────────────────────────────────────────────────────────┘
                          ↓
┌──────────────────────────────────────────────────────────────┐
│                     BUSINESS LAYER                           │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐            │
│  │  Services  │  │ Validators │  │ Mappers    │            │
│  │  (6 impl)  │  │            │  │ModelMapper │            │
│  └────────────┘  └────────────┘  └────────────┘            │
│  UserService | AuthService | DatabaseInstanceService        │
│  SubscriptionService | PaymentService | JwtService          │
└──────────────────────────────────────────────────────────────┘
                          ↓
┌──────────────────────────────────────────────────────────────┐
│                   PERSISTENCE LAYER                          │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐            │
│  │Repositories│  │  Entities  │  │   Enums    │            │
│  │  (7 repos) │  │ (7 tables) │  │            │            │
│  └────────────┘  └────────────┘  └────────────┘            │
│  User | Plan | Subscription | DatabaseEngine               │
│  DatabaseInstance | Credential | Transaction                │
└──────────────────────────────────────────────────────────────┘
                          ↓
┌──────────────────────────────────────────────────────────────┐
│                   DATABASE LAYER (Metadata)                  │
│  PostgreSQL 15+ (CleverCloud Test / VPS Production)         │
│  Host: bsynuybdaaahq5cfinjv-postgresql.services...          │
└──────────────────────────────────────────────────────────────┘
                          ↓
┌──────────────────────────────────────────────────────────────┐
│               DOCKER ORCHESTRATION LAYER                     │
│  ┌────────────────────────────────────────────────┐         │
│  │          docker-java 3.3.4 Client              │         │
│  │  - Container creation (MySQL, PostgreSQL, etc) │         │
│  │  - Lifecycle management (start/stop/delete)    │         │
│  │  - Stats API (CPU/memory metrics)              │         │
│  └────────────────────────────────────────────────┘         │
│              Docker Daemon (/var/run/docker.sock)            │
└──────────────────────────────────────────────────────────────┘
                          ↓
    ┌──────────┬──────────┬──────────┬──────────┬──────────┐
    │ MySQL    │ Postgres │ MongoDB  │ Redis    │SQL Server│
    │ :3306    │ :5432    │ :27017   │ :6379    │ :1433    │
    │ [User1]  │ [User2]  │ [User3]  │ [User4]  │ [User5]  │
    └──────────┴──────────┴──────────┴──────────┴──────────┘
        Contenedores Docker de Bases de Datos de Clientes
```

## Modelo de Dominio (7 Entidades)

### Entidades Core

```
User (usuarios y organizaciones)
 ├─ id: Long
 ├─ email: String (unique)
 ├─ password: String (BCrypt hash)
 ├─ name: String
 ├─ isOrganization: Boolean
 └─ Relaciones:
    ├─ 1:N → Subscription
    ├─ 1:N → DatabaseInstance
    └─ 1:N → Transaction

Plan (FREE, STANDARD, PREMIUM)
 ├─ id: Long
 ├─ name: String
 ├─ price: Double ($0, $9.99, $19.99)
 ├─ maxInstances: Integer (2, 5, 10)
 └─ Relaciones:
    └─ 1:N → Subscription

Subscription (relación User-Plan)
 ├─ id: Long
 ├─ user: User (ManyToOne)
 ├─ plan: Plan (ManyToOne)
 ├─ isActive: Boolean
 ├─ createdAt: LocalDateTime
 └─ Control de límites de instancias

DatabaseEngine (motores de BD soportados)
 ├─ id: Long
 ├─ name: String (MySQL, PostgreSQL, MongoDB, etc.)
 ├─ defaultPort: Integer (3306, 5432, 27017...)
 ├─ dockerImage: String (mysql:latest, postgres:15, etc.)
 └─ Relaciones:
    └─ 1:N → DatabaseInstance

DatabaseInstance (instancias de BD)
 ├─ id: Long
 ├─ user: User (ManyToOne)
 ├─ engine: DatabaseEngine (ManyToOne)
 ├─ instanceName: String
 ├─ containerName: String (único en Docker)
 ├─ port: Integer (puerto host)
 ├─ status: InstanceStatus (CREATING, RUNNING, SUSPENDED, DELETED)
 ├─ cpuUsage: Double (%)
 ├─ memoryUsage: Double (MB)
 ├─ createdAt: LocalDateTime
 └─ Relaciones:
    └─ 1:1 → Credential

Credential (credenciales de conexión)
 ├─ id: Long
 ├─ instance: DatabaseInstance (OneToOne)
 ├─ username: String (AES-256 encriptado)
 ├─ password: String (AES-256 encriptado)
 ├─ host: String (IP del servidor Docker)
 ├─ port: Integer
 ├─ databaseName: String
 └─ connectionUri: String (AES-256 encriptado)

Transaction (pagos con Mercado Pago)
 ├─ id: Long
 ├─ user: User (ManyToOne)
 ├─ mercadopagoPaymentId: String
 ├─ amount: Double
 ├─ status: TransactionStatus (PENDING, APPROVED, FAILED)
 ├─ createdAt: LocalDateTime
 └─ Relación con upgrades de plan
```

## Enums del Sistema

### InstanceStatus

```java
public enum InstanceStatus {
    CREATING,   // Contenedor Docker en creación
    RUNNING,    // Contenedor activo y funcional
    SUSPENDED,  // Contenedor detenido temporalmente
    DELETED     // Contenedor eliminado (soft delete)
}
```

### TransactionStatus

```java
public enum TransactionStatus {
    PENDING,    // Pago en proceso
    APPROVED,   // Pago aprobado por Mercado Pago
    FAILED      // Pago rechazado
}
```

## Flujo de Creación de Instancia de BD

```
1. Usuario autenticado → POST /api/v1/instances
   Body: { engineId: 1, instanceName: "mydb" }
                ↓
2. Controller → Validación JWT + DTOs
                ↓
3. DatabaseInstanceService:
   a. Verificar límite de instancias del plan
   b. Generar containerName único
   c. Asignar puerto disponible
   d. Crear entidad DatabaseInstance (status: CREATING)
                ↓
4. docker-java Client:
   a. Pull image si no existe (mysql:latest)
   b. Crear contenedor con config:
      - Nombre: containerName
      - Puerto: hostPort:3306
      - Variables: MYSQL_ROOT_PASSWORD=generated
   c. Iniciar contenedor
                ↓
5. Generar Credential:
   a. Encriptar username/password con AES-256
   b. Guardar host, port, databaseName
   c. Asociar a DatabaseInstance
                ↓
6. Actualizar DatabaseInstance (status: RUNNING)
                ↓
7. Retornar InstanceResponse al cliente:
   {
     "id": 123,
     "instanceName": "mydb",
     "engine": "MySQL",
     "status": "RUNNING",
     "port": 33061,
     "createdAt": "2025-11-10T10:30:00"
   }
```

## Patrones de Diseño Implementados

### 1. Repository Pattern

Abstracción del acceso a datos con Spring Data JPA:

```java
@Repository
public interface DatabaseInstanceRepository extends JpaRepository<DatabaseInstance, Long> {
    List<DatabaseInstance> findByUserIdAndStatus(Long userId, InstanceStatus status);

    boolean existsByContainerName(String containerName);

    @Query("SELECT COUNT(di) FROM DatabaseInstance di " +
           "WHERE di.user.id = :userId AND di.status != 'DELETED'")
    long countActiveInstancesByUserId(@Param("userId") Long userId);
}
```

### 2. DTO Pattern

Separación entre entidades de dominio y objetos de transferencia:

```java
// Request DTO
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateInstanceRequest {
    @NotNull(message = "Engine ID is required")
    private Long engineId;

    @NotBlank(message = "Instance name is required")
    @Size(min = 3, max = 50)
    private String instanceName;
}

// Response DTO
@Data
public class InstanceResponse {
    private Long id;
    private String instanceName;
    private String engineName;
    private InstanceStatus status;
    private Integer port;
    private Double cpuUsage;
    private Double memoryUsage;
    private LocalDateTime createdAt;
}
```

### 3. Builder Pattern

Construcción de entidades complejas (via Lombok):

```java
@Entity
@Builder
@Data
public class DatabaseInstance {
    private Long id;
    private User user;
    private DatabaseEngine engine;
    private String instanceName;
    private String containerName;
    private InstanceStatus status;
    // ... más campos
}

// Uso
DatabaseInstance instance = DatabaseInstance.builder()
    .user(user)
    .engine(engine)
    .instanceName("mydb")
    .containerName("crudcloud_mysql_" + UUID.randomUUID())
    .status(InstanceStatus.CREATING)
    .build();
```

### 4. Service Layer Pattern

Encapsulación de lógica de negocio compleja:

```java
@Service
@RequiredArgsConstructor
@Slf4j
public class DatabaseInstanceServiceImpl implements DatabaseInstanceService {

    private final DatabaseInstanceRepository instanceRepository;
    private final SubscriptionService subscriptionService;
    private final UserRepository userRepository;
    // TODO: private final DockerClient dockerClient;

    @Override
    public InstanceResponse createInstance(Long userId, CreateInstanceRequest request) {
        // 1. Validar límite de instancias
        Subscription subscription = subscriptionService.getActiveSubscription(userId);
        long currentCount = instanceRepository.countActiveInstancesByUserId(userId);

        if (currentCount >= subscription.getPlan().getMaxInstances()) {
            throw new AppException("Instance limit reached", "LIMIT_EXCEEDED");
        }

        // 2. Crear instancia (lógica de orquestación Docker)
        // ...
    }
}
```

### 5. Strategy Pattern

Para selección dinámica de motor de BD:

```java
public interface DatabaseEngineStrategy {
    DockerContainerConfig createContainerConfig(String instanceName);
    Credential generateCredentials(String host, int port);
}

public class MySQLEngineStrategy implements DatabaseEngineStrategy {
    @Override
    public DockerContainerConfig createContainerConfig(String instanceName) {
        return DockerContainerConfig.builder()
            .image("mysql:latest")
            .envVars(Map.of(
                "MYSQL_ROOT_PASSWORD", generatePassword(),
                "MYSQL_DATABASE", instanceName
            ))
            .ports(Map.of(3306, findAvailablePort()))
            .build();
    }
}
```

## Componentes Transversales

### Security Layer (JWT)

**JwtServiceImpl**: Generación y validación de tokens

```java
@Service
@Slf4j
public class JwtServiceImpl implements JwtService {

    @Value("${jwt.secret}")
    private String jwtSecret;

    @Value("${jwt.expiration:86400000}") // 24 hours
    private long jwtExpirationMs;

    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(jwtSecret.getBytes());
    }

    @Override
    public String generateToken(String username) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtExpirationMs);

        return Jwts.builder()
            .subject(username)              // Nueva API jjwt 0.12.3
            .issuedAt(now)                  // Nueva API
            .expiration(expiryDate)         // Nueva API
            .signWith(getSigningKey(), SignatureAlgorithm.HS512)
            .compact();
    }

    @Override
    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder()
                .verifyingKey(getSigningKey())
                .build()
                .parseSignedClaims(token);
            return true;
        } catch (Exception e) {
            log.error("Invalid JWT token: {}", e.getMessage());
            return false;
        }
    }
}
```

### Exception Handling

**GlobalExceptionHandler**: Manejo centralizado de errores

```java
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleResourceNotFound(
        ResourceNotFoundException ex
    ) {
        ErrorResponse error = ErrorResponse.builder()
            .status(HttpStatus.NOT_FOUND.value())
            .message(ex.getMessage())
            .timestamp(LocalDateTime.now())
            .build();

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
    }

    @ExceptionHandler(AppException.class)
    public ResponseEntity<ErrorResponse> handleAppException(AppException ex) {
        ErrorResponse error = ErrorResponse.builder()
            .status(HttpStatus.BAD_REQUEST.value())
            .message(ex.getMessage())
            .errorCode(ex.getErrorCode())
            .timestamp(LocalDateTime.now())
            .build();

        return ResponseEntity.badRequest().body(error);
    }
}
```

### Validation Layer

**Bean Validation en DTOs**:

```java
@Data
public class CreateUserRequest {

    @NotBlank(message = "Email is required")
    @Email(message = "Email must be valid")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;

    @NotBlank(message = "Name is required")
    private String name;

    @NotNull(message = "isOrganization must be provided")
    private Boolean isOrganization = false;
}
```

## Decisiones de Arquitectura

### ¿Por qué Arquitectura en Capas?

- **Separación clara**: Cada capa tiene responsabilidades bien definidas
- **Testeable**: Se pueden testear capas independientemente
- **Mantenible**: Fácil localizar y modificar funcionalidad
- **Escalable**: Se pueden optimizar capas individuales
- **Framework-friendly**: Encaja perfectamente con Spring Boot

### ¿Por qué Docker para Bases de Datos?

- **Aislamiento**: Cada instancia en su propio contenedor
- **Portabilidad**: Imágenes oficiales de DockerHub
- **Escalabilidad**: Fácil crear/destruir instancias
- **Seguridad**: Contenedores aislados con networking controlado
- **Multi-motor**: Soporte para 6+ motores de BD desde una única API

### ¿Por qué PostgreSQL para Metadata?

- **ACID compliant**: Transacciones confiables para operaciones críticas
- **Performance**: Excelente para consultas complejas (joins, aggregations)
- **Relacional**: Modelo perfecto para relaciones User-Plan-Subscription-Instance
- **JSON support**: Almacenamiento flexible si se necesita
- **Open Source**: Sin costos de licencia

### ¿Por qué JWT sobre Sesiones?

- **Stateless**: No requiere almacenamiento de sesiones en servidor
- **Escalable**: Funciona en arquitecturas distribuidas
- **Mobile-friendly**: Fácil integración con apps móviles
- **Cross-domain**: Autenticación entre múltiples dominios
- **Payload**: Incluye información del usuario (username, roles)

## Estado de Implementación

### ✅ Completado (60%)

- **Fase 1**: Configuración inicial de Spring Boot 3.5.7 con Java 21
- **Fase 2**:
  - 7 Entidades JPA con relaciones bidireccionales
  - 2 Enums (InstanceStatus, TransactionStatus)
  - 7 Repositories con Spring Data JPA
- **Fase 3**:
  - 6 Servicios implementados (User, Auth, Subscription, DatabaseInstance, Payment, Jwt)
  - 14 DTOs (7 Request + 7 Response)
  - Validaciones con Jakarta Validation
  - ModelMapper para mapeo automático

### ⏳ Pendiente (40%)

- **Fase 4** (Controllers + Security):
  - 6 Controllers REST
  - Configuración Spring Security
  - JwtAuthenticationFilter
  - CORS y CSRF configuration

- **Fase 5** (Docker Integration):
  - Configuración docker-java client
  - Lógica de creación de contenedores
  - Monitoreo de métricas (Docker Stats API)
  - Gestión de lifecycle de contenedores

- **Fase 6** (Frontend):
  - Dashboard web con React/Vue
  - Gestión visual de instancias
  - Monitoreo en tiempo real

## Próximos Pasos

- Explora la [Estructura del Proyecto](/docs/arquitectura/estructura-proyecto)
- Revisa las [Dependencias](/docs/arquitectura/dependencias)
- Aprende sobre [Desarrollo](/docs/desarrollo/guia-desarrollo)
