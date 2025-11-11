---
sidebar_position: 2
title: Estructura del Proyecto
---

# Estructura del Proyecto

Esta página documenta la organización de carpetas y archivos del proyecto CrudCloud Backend.

## Estructura General

```
Crudcloud_Backend/
├── CrudCloud/                          # Proyecto Spring Boot principal
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   │   └── com/
│   │   │   │       └── crudzaso/
│   │   │   │           └── CrudCloud/
│   │   │   │               ├── domain/
│   │   │   │               │   ├── entity/      # 7 entidades JPA
│   │   │   │               │   └── enums/       # 2 enums
│   │   │   │               ├── repository/      # 7 repositorios
│   │   │   │               ├── service/         # Interfaces + impl
│   │   │   │               │   └── impl/        # 6 servicios
│   │   │   │               ├── dto/
│   │   │   │               │   ├── request/     # 7 request DTOs
│   │   │   │               │   └── response/    # 7 response DTOs
│   │   │   │               ├── exception/       # Excepciones custom
│   │   │   │               ├── controller/      # (Pendiente Fase 4)
│   │   │   │               ├── config/          # (Pendiente Fase 4)
│   │   │   │               └── CrudCloudApplication.java
│   │   │   └── resources/
│   │   │       ├── application.properties
│   │   │       └── application-prod.properties
│   │   └── test/
│   │       └── java/
│   ├── pom.xml                         # Maven dependencies
│   └── target/
├── md/                                  # Documentación markdown
│   ├── GUIA_PROYECTO.md
│   ├── REFERENCIA_RAPIDA.md
│   ├── MODELO_BASE_DATOS.md
│   ├── ROADMAP.md
│   ├── SCHEMA_CRUDCLOUD_POSTGRESQL.sql
│   └── SCHEMA_CRUDCLOUD_MYSQL.sql
├── CrudCloud-Docs/                     # Docusaurus (esta documentación)
│   └── documentation/
│       ├── docs/
│       ├── src/
│       └── docusaurus.config.js
└── README.md
```

## Paquetes Principales

### domain/entity/ (7 Entidades JPA)

**Propósito**: Modelos de dominio con anotaciones JPA

```
entity/
├── User.java                    # Usuarios y organizaciones
├── Plan.java                    # FREE, STANDARD, PREMIUM
├── Subscription.java            # Relación User-Plan
├── DatabaseEngine.java          # MySQL, PostgreSQL, MongoDB, etc.
├── DatabaseInstance.java        # Instancias de BD en Docker
├── Credential.java              # Credenciales encriptadas
└── Transaction.java             # Pagos con Mercado Pago
```

**Ejemplo - User.java**:
```java
package com.crudzaso.CrudCloud.domain.entity;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;  // BCrypt hash

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private Boolean isOrganization = false;

    @Column(updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    // Relaciones
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<Subscription> subscriptions = new ArrayList<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<DatabaseInstance> instances = new ArrayList<>();
}
```

**Ejemplo - DatabaseInstance.java**:
```java
package com.crudzaso.CrudCloud.domain.entity;

@Entity
@Table(name = "database_instances")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DatabaseInstance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "engine_id", nullable = false)
    private DatabaseEngine engine;

    @Column(nullable = false)
    private String instanceName;

    @Column(unique = true, nullable = false)
    private String containerName;  // crudcloud_mysql_uuid

    @Column(nullable = false)
    private Integer port;  // Puerto host asignado

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private InstanceStatus status;

    private Double cpuUsage;     // % CPU (Docker Stats API)
    private Double memoryUsage;  // MB memoria (Docker Stats API)

    @Column(updatable = false)
    private LocalDateTime createdAt;

    // Relación 1:1 con Credential
    @OneToOne(mappedBy = "instance", cascade = CascadeType.ALL)
    private Credential credential;
}
```

### domain/enums/ (2 Enums)

**Propósito**: Enumeraciones del sistema

```
enums/
├── InstanceStatus.java         # CREATING, RUNNING, SUSPENDED, DELETED
└── TransactionStatus.java      # PENDING, APPROVED, FAILED
```

**Ejemplo - InstanceStatus.java**:
```java
package com.crudzaso.CrudCloud.domain.enums;

public enum InstanceStatus {
    CREATING,   // Contenedor Docker en proceso de creación
    RUNNING,    // Contenedor activo y funcional
    SUSPENDED,  // Contenedor detenido temporalmente
    DELETED     // Contenedor eliminado (soft delete)
}
```

### repository/ (7 Repositorios)

**Propósito**: Acceso a datos con Spring Data JPA

```
repository/
├── UserRepository.java
├── PlanRepository.java
├── SubscriptionRepository.java
├── DatabaseEngineRepository.java
├── DatabaseInstanceRepository.java
├── CredentialRepository.java
└── TransactionRepository.java
```

**Ejemplo - DatabaseInstanceRepository.java**:
```java
package com.crudzaso.CrudCloud.repository;

@Repository
public interface DatabaseInstanceRepository extends JpaRepository<DatabaseInstance, Long> {

    List<DatabaseInstance> findByUserId(Long userId);

    List<DatabaseInstance> findByUserIdAndStatus(Long userId, InstanceStatus status);

    Optional<DatabaseInstance> findByContainerName(String containerName);

    boolean existsByContainerName(String containerName);

    @Query("SELECT COUNT(di) FROM DatabaseInstance di " +
           "WHERE di.user.id = :userId AND di.status != 'DELETED'")
    long countActiveInstancesByUserId(@Param("userId") Long userId);

    @Query("SELECT di FROM DatabaseInstance di " +
           "WHERE di.status = 'RUNNING' ORDER BY di.createdAt DESC")
    List<DatabaseInstance> findAllRunningInstances();
}
```

**Ejemplo - SubscriptionRepository.java**:
```java
package com.crudzaso.CrudCloud.repository;

@Repository
public interface SubscriptionRepository extends JpaRepository<Subscription, Long> {

    Optional<Subscription> findByUserIdAndIsActive(Long userId, Boolean isActive);

    List<Subscription> findByUserId(Long userId);

    @Query("SELECT s FROM Subscription s WHERE s.user.id = :userId AND s.isActive = true")
    Optional<Subscription> findActiveSubscriptionByUserId(@Param("userId") Long userId);
}
```

### service/ + service/impl/ (6 Servicios)

**Propósito**: Lógica de negocio

```
service/
├── UserService.java                    # Interface
├── AuthenticationService.java          # Interface
├── SubscriptionService.java            # Interface
├── DatabaseInstanceService.java        # Interface
├── PaymentService.java                 # Interface
├── JwtService.java                     # Interface
└── impl/
    ├── UserServiceImpl.java            # CRUD usuarios
    ├── AuthenticationServiceImpl.java  # Login con JWT + BCrypt
    ├── SubscriptionServiceImpl.java    # Gestión planes y límites
    ├── DatabaseInstanceServiceImpl.java # CRUD instancias (sin Docker aún)
    ├── PaymentServiceImpl.java         # Mercado Pago integration
    └── JwtServiceImpl.java             # Generación/validación tokens
```

**Ejemplo - UserServiceImpl.java**:
```java
package com.crudzaso.CrudCloud.service.impl;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final ModelMapper modelMapper;
    private final PasswordEncoder passwordEncoder;

    @Override
    public UserResponse createUser(CreateUserRequest request) {
        log.info("Creating user with email: {}", request.getEmail());

        // Validar email único
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new AppException("Email already exists", "EMAIL_EXISTS");
        }

        // Mapear DTO a entidad
        User user = modelMapper.map(request, User.class);

        // Hash password con BCrypt
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        // Guardar
        User savedUser = userRepository.save(user);
        log.info("User created successfully with ID: {}", savedUser.getId());

        // Mapear entidad a DTO response
        return modelMapper.map(savedUser, UserResponse.class);
    }

    @Override
    public UserResponse getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", id));
        return modelMapper.map(user, UserResponse.class);
    }

    // ... más métodos CRUD
}
```

**Ejemplo - JwtServiceImpl.java** (código real del proyecto):
```java
package com.crudzaso.CrudCloud.service.impl;

@Service
@Slf4j
public class JwtServiceImpl implements JwtService {

    @Value("${jwt.secret}")
    private String jwtSecret;

    @Value("${jwt.expiration:86400000}")  // Default 24 hours
    private long jwtExpirationMs;

    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(jwtSecret.getBytes());
    }

    @Override
    public String generateToken(String username) {
        log.debug("Generating JWT token for username: {}", username);

        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtExpirationMs);

        // Nueva API de jjwt 0.12.3
        String token = Jwts.builder()
            .subject(username)
            .issuedAt(now)
            .expiration(expiryDate)
            .signWith(getSigningKey(), SignatureAlgorithm.HS512)
            .compact();

        log.debug("JWT token generated successfully");
        return token;
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

    @Override
    public String getUsernameFromToken(String token) {
        try {
            Claims claims = Jwts.parserBuilder()
                .verifyingKey(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();

            return claims.getSubject();
        } catch (Exception e) {
            log.error("Error extracting username: {}", e.getMessage());
            return null;
        }
    }
}
```

### dto/request/ (7 Request DTOs)

**Propósito**: Validación de datos de entrada

```
dto/request/
├── CreateUserRequest.java
├── LoginRequest.java
├── CreateSubscriptionRequest.java
├── CreateInstanceRequest.java
├── CreateEngineRequest.java
├── CreatePaymentRequest.java
└── UpdateInstanceRequest.java
```

**Ejemplo - CreateUserRequest.java** (código real):
```java
package com.crudzaso.CrudCloud.dto.request;

@Data
@NoArgsConstructor
@AllArgsConstructor
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

**Ejemplo - CreateInstanceRequest.java**:
```java
package com.crudzaso.CrudCloud.dto.request;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateInstanceRequest {

    @NotNull(message = "Engine ID is required")
    private Long engineId;

    @NotBlank(message = "Instance name is required")
    @Size(min = 3, max = 50, message = "Instance name must be between 3-50 characters")
    @Pattern(regexp = "^[a-zA-Z0-9_-]+$", message = "Only alphanumeric, underscore and hyphen allowed")
    private String instanceName;

    private Map<String, String> customConfig;  // Configuración opcional
}
```

### dto/response/ (7 Response DTOs)

**Propósito**: Formato de respuestas HTTP

```
dto/response/
├── UserResponse.java
├── LoginResponse.java
├── SubscriptionResponse.java
├── InstanceResponse.java
├── EngineResponse.java
├── TransactionResponse.java
└── CredentialResponse.java
```

**Ejemplo - InstanceResponse.java**:
```java
package com.crudzaso.CrudCloud.dto.response;

@Data
@Builder
public class InstanceResponse {
    private Long id;
    private String instanceName;
    private String engineName;
    private String engineVersion;
    private InstanceStatus status;
    private Integer port;
    private String host;
    private Double cpuUsage;
    private Double memoryUsage;
    private LocalDateTime createdAt;
}
```

### exception/ (Excepciones Personalizadas)

**Propósito**: Manejo de errores

```
exception/
├── AppException.java                # Excepción genérica con código
├── ResourceNotFoundException.java   # Recurso no encontrado (404)
└── (Pendiente: GlobalExceptionHandler en Fase 4)
```

**Ejemplo - AppException.java** (código real):
```java
package com.crudzaso.CrudCloud.exception;

@Getter
public class AppException extends RuntimeException {
    private final String errorCode;

    public AppException(String message, String errorCode) {
        super(message);
        this.errorCode = errorCode;
    }
}
```

**Ejemplo - ResourceNotFoundException.java** (código real):
```java
package com.crudzaso.CrudCloud.exception;

public class ResourceNotFoundException extends RuntimeException {

    public ResourceNotFoundException(String resourceName, Object resourceId) {
        super(String.format("%s not found with id: %s", resourceName, resourceId));
    }

    public ResourceNotFoundException(String message) {
        super(message);
    }
}
```

### controller/ (Pendiente - Fase 4)

**Propósito**: Endpoints REST API

```
controller/
├── AuthController.java              # POST /api/v1/auth/register, /login
├── UserController.java              # CRUD /api/v1/users
├── InstanceController.java          # CRUD /api/v1/instances
├── SubscriptionController.java      # GET /api/v1/subscriptions
├── PaymentController.java           # POST /api/v1/payments
└── HealthController.java            # GET /api/v1/health
```

**Ejemplo anticipado - InstanceController.java**:
```java
@RestController
@RequestMapping("/api/v1/instances")
@RequiredArgsConstructor
public class InstanceController {

    private final DatabaseInstanceService instanceService;

    @PostMapping
    public ResponseEntity<InstanceResponse> createInstance(
        @RequestBody @Valid CreateInstanceRequest request,
        @AuthenticationPrincipal UserDetails userDetails
    ) {
        InstanceResponse response = instanceService.createInstance(
            getUserId(userDetails),
            request
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<List<InstanceResponse>> listInstances(
        @AuthenticationPrincipal UserDetails userDetails
    ) {
        List<InstanceResponse> instances = instanceService.getUserInstances(
            getUserId(userDetails)
        );
        return ResponseEntity.ok(instances);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteInstance(@PathVariable Long id) {
        instanceService.deleteInstance(id);
        return ResponseEntity.noContent().build();
    }
}
```

### config/ (Pendiente - Fase 4)

**Propósito**: Configuración de Spring

```
config/
├── SecurityConfig.java              # Spring Security + JWT
├── ModelMapperConfig.java           # Bean ModelMapper
├── PasswordEncoderConfig.java       # Bean BCryptPasswordEncoder
├── CorsConfig.java                  # Configuración CORS
└── DockerConfig.java                # Bean DockerClient (Fase 5)
```

## Archivos de Recursos

### application.properties

Configuración principal (sin credenciales sensibles):

```properties
# Application
spring.application.name=CrudCloud Backend
server.port=8080

# Profile
spring.profiles.active=dev

# JPA/Hibernate
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect

# JWT (valores de ejemplo - sobrescritos por variables de entorno)
jwt.secret=CHANGE_THIS_SECRET_KEY_MINIMUM_256_BITS
jwt.expiration=86400000

# Logging
logging.level.root=INFO
logging.level.com.crudzaso.CrudCloud=DEBUG
```

### application-prod.properties

Configuración de producción (usa variables de entorno):

```properties
# Database (CleverCloud PostgreSQL)
spring.datasource.url=${POSTGRESQL_ADDON_URI}
spring.datasource.username=${POSTGRESQL_ADDON_USER}
spring.datasource.password=${POSTGRESQL_ADDON_PASSWORD}

# JPA
spring.jpa.hibernate.ddl-auto=validate
spring.jpa.show-sql=false

# JWT (desde variables de entorno)
jwt.secret=${JWT_SECRET}
jwt.expiration=${JWT_EXPIRATION:86400000}

# Mercado Pago
mercadopago.access.token=${MERCADOPAGO_ACCESS_TOKEN}

# Docker
docker.host=unix:///var/run/docker.sock
docker.tls.verify=false
```

## pom.xml (Dependencias Maven)

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project>
    <groupId>com.crudzaso</groupId>
    <artifactId>CrudCloud</artifactId>
    <version>1.0.0-SNAPSHOT</version>
    <packaging>jar</packaging>

    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.5.7</version>
    </parent>

    <properties>
        <java.version>21</java.version>
        <maven.compiler.source>21</maven.compiler.source>
        <maven.compiler.target>21</maven.compiler.target>
    </properties>

    <dependencies>
        <!-- Spring Boot Starters -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-jpa</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-validation</artifactId>
        </dependency>

        <!-- PostgreSQL Driver -->
        <dependency>
            <groupId>org.postgresql</groupId>
            <artifactId>postgresql</artifactId>
            <scope>runtime</scope>
        </dependency>

        <!-- Docker Java Client -->
        <dependency>
            <groupId>com.github.docker-java</groupId>
            <artifactId>docker-java</artifactId>
            <version>3.3.4</version>
        </dependency>

        <!-- JWT -->
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-api</artifactId>
            <version>0.12.3</version>
        </dependency>
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-impl</artifactId>
            <version>0.12.3</version>
            <scope>runtime</scope>
        </dependency>
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-jackson</artifactId>
            <version>0.12.3</version>
            <scope>runtime</scope>
        </dependency>

        <!-- Mercado Pago SDK -->
        <dependency>
            <groupId>com.mercadopago</groupId>
            <artifactId>sdk-java</artifactId>
            <version>2.1.26</version>
        </dependency>

        <!-- ModelMapper -->
        <dependency>
            <groupId>org.modelmapper</groupId>
            <artifactId>modelmapper</artifactId>
            <version>3.2.5</version>
        </dependency>

        <!-- Lombok -->
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <optional>true</optional>
        </dependency>

        <!-- Spring Boot Test -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>
</project>
```

## Convenciones de Nomenclatura

### Paquetes
- Minúsculas sin guiones bajos: `com.crudzaso.CrudCloud.service.impl`
- Singular para nombres de paquetes: `entity` (no `entities`)

### Clases
- **Entidades**: `User`, `DatabaseInstance`, `Plan`
- **Repositories**: `UserRepository`, `DatabaseInstanceRepository`
- **Services**: `UserService` (interface), `UserServiceImpl` (implementación)
- **DTOs Request**: `CreateUserRequest`, `UpdateInstanceRequest`
- **DTOs Response**: `UserResponse`, `InstanceResponse`
- **Exceptions**: `AppException`, `ResourceNotFoundException`
- **Enums**: `InstanceStatus`, `TransactionStatus`

### Métodos
- camelCase: `createUser`, `getUserById`, `deleteInstance`
- CRUD estándar: `create`, `getById`, `getAll`, `update`, `delete`
- Repositories: `findByEmail`, `existsByContainerName`, `countActiveInstancesByUserId`

### Variables
- camelCase: `userId`, `instanceName`, `containerName`
- Constantes: `UPPERCASE_WITH_UNDERSCORES` (ej: `DEFAULT_PORT`)

## Próximos Pasos

- Revisa las [Dependencias del Proyecto](/docs/arquitectura/dependencias)
- Aprende sobre [Desarrollo](/docs/desarrollo/guia-desarrollo)
- Consulta la [API Reference](/docs/api/autenticacion)
