---
sidebar_position: 3
title: Dependencias
---

# Dependencias del Proyecto

Esta página documenta todas las dependencias de Maven utilizadas en CrudCloud Backend y su propósito específico en el sistema de gestión de instancias de bases de datos.

## pom.xml Overview

```xml
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
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
    </properties>
</project>
```

## Dependencias Core

### Spring Boot Starters

#### spring-boot-starter-web
```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>
```
- **Versión**: 3.5.7 (heredada del parent)
- **Propósito**: Desarrollo de REST APIs
- **Incluye**: Spring MVC, Tomcat embebido, Jackson JSON
- **Uso en CrudCloud**:
  - Controllers REST para gestión de instancias
  - Endpoints: `/api/v1/auth`, `/instances`, `/subscriptions`, `/payments`
  - Serialización JSON de DTOs Request/Response

#### spring-boot-starter-data-jpa
```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-jpa</artifactId>
</dependency>
```
- **Versión**: 3.5.7
- **Propósito**: Persistencia de metadata del sistema
- **Incluye**: Hibernate ORM, Spring Data JPA, Transaction Manager
- **Uso en CrudCloud**:
  - 7 Repositories (User, Plan, Subscription, DatabaseEngine, DatabaseInstance, Credential, Transaction)
  - Mapeo de 7 entidades JPA a tablas PostgreSQL
  - Consultas JPQL y derived queries

**Ejemplo de uso**:
```java
@Repository
public interface DatabaseInstanceRepository extends JpaRepository<DatabaseInstance, Long> {
    @Query("SELECT COUNT(di) FROM DatabaseInstance di " +
           "WHERE di.user.id = :userId AND di.status != 'DELETED'")
    long countActiveInstancesByUserId(@Param("userId") Long userId);
}
```

#### spring-boot-starter-validation
```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-validation</artifactId>
</dependency>
```
- **Versión**: 3.5.7
- **Propósito**: Validación de datos en DTOs
- **Incluye**: Hibernate Validator, Bean Validation API (Jakarta Validation)
- **Uso en CrudCloud**:
  - Validación en 7 Request DTOs
  - Anotaciones: `@NotBlank`, `@Email`, `@Size`, `@NotNull`, `@Pattern`

**Ejemplo de uso**:
```java
@Data
public class CreateInstanceRequest {
    @NotNull(message = "Engine ID is required")
    private Long engineId;

    @NotBlank(message = "Instance name is required")
    @Size(min = 3, max = 50)
    @Pattern(regexp = "^[a-zA-Z0-9_-]+$")
    private String instanceName;
}
```

## Base de Datos

### PostgreSQL Driver
```xml
<dependency>
    <groupId>org.postgresql</groupId>
    <artifactId>postgresql</artifactId>
    <scope>runtime</scope>
</dependency>
```
- **Versión**: 42.x (compatible con PostgreSQL 15+)
- **Propósito**: Driver JDBC para conexión a PostgreSQL
- **Uso en CrudCloud**:
  - Conexión a CleverCloud PostgreSQL (entorno de pruebas)
  - Conexión a VPS PostgreSQL (entorno de producción)
  - Almacenamiento de metadata: Users, Plans, Subscriptions, Instances

**Configuración en application-prod.properties**:
```properties
spring.datasource.url=${POSTGRESQL_ADDON_URI}
spring.datasource.username=${POSTGRESQL_ADDON_USER}
spring.datasource.password=${POSTGRESQL_ADDON_PASSWORD}
spring.datasource.driver-class-name=org.postgresql.Driver
```

### HikariCP (Incluido automáticamente)
- **Propósito**: Connection pooling de alto rendimiento
- **Incluido en**: `spring-boot-starter-data-jpa`
- **Configuración**:
```properties
spring.datasource.hikari.maximum-pool-size=10
spring.datasource.hikari.minimum-idle=5
spring.datasource.hikari.connection-timeout=30000
```

## Orquestación de Docker

### docker-java (Clave para CrudCloud)
```xml
<dependency>
    <groupId>com.github.docker-java</groupId>
    <artifactId>docker-java</artifactId>
    <version>3.3.4</version>
</dependency>
```
- **Versión**: 3.3.4
- **Propósito**: **Cliente Java para Docker Daemon** - Core de CrudCloud
- **Funcionalidades**:
  - Crear contenedores de MySQL, PostgreSQL, MongoDB, Redis, etc.
  - Gestión de lifecycle: start, stop, remove containers
  - Monitoreo de métricas: CPU usage, memory usage (Docker Stats API)
  - Pull de imágenes desde DockerHub

**Uso en CrudCloud** (a implementar en Fase 5):
```java
@Configuration
public class DockerConfig {

    @Bean
    public DockerClient dockerClient() {
        return DockerClientBuilder.getInstance("unix:///var/run/docker.sock")
            .build();
    }
}

@Service
public class DatabaseInstanceServiceImpl {

    private final DockerClient dockerClient;

    public void createDockerContainer(DatabaseEngine engine, String instanceName) {
        // 1. Pull image
        dockerClient.pullImageCmd(engine.getDockerImage())
            .exec(new PullImageResultCallback())
            .awaitCompletion();

        // 2. Create container
        CreateContainerResponse container = dockerClient.createContainerCmd(engine.getDockerImage())
            .withName("crudcloud_" + instanceName + "_" + UUID.randomUUID())
            .withEnv("MYSQL_ROOT_PASSWORD=" + generatePassword())
            .withExposedPorts(ExposedPort.tcp(3306))
            .withPortBindings(new PortBinding(Ports.Binding.bindPort(findAvailablePort()), ExposedPort.tcp(3306)))
            .exec();

        // 3. Start container
        dockerClient.startContainerCmd(container.getId()).exec();
    }

    public ContainerStats getContainerMetrics(String containerName) {
        return dockerClient.statsCmd(containerName).exec(new StatsCallback()).awaitStats();
    }
}
```

## Seguridad y JWT

### jjwt-api, jjwt-impl, jjwt-jackson
```xml
<!-- API -->
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-api</artifactId>
    <version>0.12.3</version>
</dependency>

<!-- Implementación -->
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-impl</artifactId>
    <version>0.12.3</version>
    <scope>runtime</scope>
</dependency>

<!-- Soporte Jackson -->
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-jackson</artifactId>
    <version>0.12.3</version>
    <scope>runtime</scope>
</dependency>
```
- **Versión**: 0.12.3 (API nueva - incompatible con 0.11.x)
- **Propósito**: Generación y validación de tokens JWT
- **Uso en CrudCloud**:
  - `JwtServiceImpl`: Generación de tokens al login
  - Validación de tokens en cada request autenticado
  - Algoritmo: HS512 (HMAC-SHA512)

**Cambios importantes en API 0.12.3**:
```java
// ❌ API antigua (0.11.x) - NO USAR
Jwts.builder()
    .setSubject("user@example.com")
    .setIssuedAt(new Date())
    .setExpiration(expiryDate)

// ✅ API nueva (0.12.3) - USAR
Jwts.builder()
    .subject("user@example.com")       // Nuevo método
    .issuedAt(new Date())               // Nuevo método
    .expiration(expiryDate)             // Nuevo método
```

**Implementación en CrudCloud** (`JwtServiceImpl.java:38-52`):
```java
@Override
public String generateToken(String username) {
    Date now = new Date();
    Date expiryDate = new Date(now.getTime() + jwtExpirationMs);

    return Jwts.builder()
        .subject(username)              // Nueva API
        .issuedAt(now)                  // Nueva API
        .expiration(expiryDate)         // Nueva API
        .signWith(getSigningKey(), SignatureAlgorithm.HS512)
        .compact();
}

private SecretKey getSigningKey() {
    return Keys.hmacShaKeyFor(jwtSecret.getBytes());
}
```

### Spring Security (Pendiente Fase 4)
```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-security</artifactId>
</dependency>
```
- **Status**: No incluido aún (Fase 4)
- **Propósito**: Autenticación y autorización
- **Uso futuro**:
  - `JwtAuthenticationFilter`: Validar token en cada request
  - `SecurityConfig`: Configurar endpoints públicos vs protegidos
  - Password encoding con BCrypt (factor 10)

## Procesamiento de Pagos

### Mercado Pago SDK
```xml
<dependency>
    <groupId>com.mercadopago</groupId>
    <artifactId>sdk-java</artifactId>
    <version>2.1.26</version>
</dependency>
```
- **Versión**: 2.1.26
- **Propósito**: Integración con Mercado Pago para pagos de suscripciones
- **Uso en CrudCloud**:
  - `PaymentServiceImpl`: Crear pagos al actualizar de plan
  - Procesamiento de webhooks de Mercado Pago
  - Actualización de `Transaction` con estado del pago

**Implementación actual** (`PaymentServiceImpl.java:34-62`):
```java
@Override
public TransactionResponse createPayment(CreatePaymentRequest request) {
    // Validar usuario
    User user = userRepository.findById(request.getUserId())
            .orElseThrow(() -> new ResourceNotFoundException("User", request.getUserId()));

    try {
        // TODO: Integrar con Mercado Pago SDK
        // Por ahora, crear transacción con PENDING status
        String mercadopagoPaymentId = generatePaymentId();

        Transaction transaction = Transaction.builder()
                .user(user)
                .mercadopagoPaymentId(mercadopagoPaymentId)
                .amount(request.getAmount())
                .status(TransactionStatus.PENDING)
                .build();

        Transaction savedTransaction = transactionRepository.save(transaction);
        return modelMapper.map(savedTransaction, TransactionResponse.class);

    } catch (Exception e) {
        throw new AppException("Payment processing failed", "PAYMENT_ERROR");
    }
}
```

**Uso futuro (Fase 4)**:
```java
MercadoPagoConfig.setAccessToken(mercadopagoAccessToken);

PreferenceClient preferenceClient = new PreferenceClient();
PreferenceRequest preferenceRequest = PreferenceRequest.builder()
    .items(List.of(
        PreferenceItemRequest.builder()
            .title("Upgrade to " + planName)
            .quantity(1)
            .unitPrice(new BigDecimal(planPrice))
            .build()
    ))
    .build();

Preference preference = preferenceClient.create(preferenceRequest);
return preference.getInitPoint(); // URL de pago
```

## Utilidades

### Lombok
```xml
<dependency>
    <groupId>org.projectlombok</groupId>
    <artifactId>lombok</artifactId>
    <optional>true</optional>
</dependency>
```
- **Versión**: 1.18.30 (heredada del parent)
- **Propósito**: Reducir boilerplate code
- **Anotaciones usadas en CrudCloud**:
  - `@Data`: Getters, setters, equals, hashCode, toString (en entidades y DTOs)
  - `@Builder`: Construcción fluida de entidades (DatabaseInstance, Transaction)
  - `@NoArgsConstructor`, `@AllArgsConstructor`: Constructores (DTOs)
  - `@Slf4j`: Logger automático (en Services)
  - `@RequiredArgsConstructor`: Inyección de dependencias final

**Ejemplo en entidad**:
```java
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

    private String instanceName;
    private String containerName;
    private InstanceStatus status;
    // ... más campos
}
```

**Ejemplo en servicio**:
```java
@Service
@RequiredArgsConstructor
@Slf4j
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final ModelMapper modelMapper;

    @Override
    public UserResponse createUser(CreateUserRequest request) {
        log.info("Creating user: {}", request.getEmail());
        // ...
    }
}
```

### ModelMapper
```xml
<dependency>
    <groupId>org.modelmapper</groupId>
    <artifactId>modelmapper</artifactId>
    <version>3.2.5</version>
</dependency>
```
- **Versión**: 3.2.5
- **Propósito**: Mapeo automático entre DTOs y entidades
- **Uso en CrudCloud**:
  - Request DTO → Entity: `modelMapper.map(createUserRequest, User.class)`
  - Entity → Response DTO: `modelMapper.map(user, UserResponse.class)`
  - Evita código boilerplate de mapeo manual

**Configuración como Bean**:
```java
@Configuration
public class ModelMapperConfig {

    @Bean
    public ModelMapper modelMapper() {
        return new ModelMapper();
    }
}
```

**Ejemplo de uso en `UserServiceImpl.java:39-48`**:
```java
@Override
public UserResponse createUser(CreateUserRequest request) {
    // Mapear DTO a entidad
    User user = modelMapper.map(request, User.class);

    // Hash password
    user.setPassword(passwordEncoder.encode(request.getPassword()));

    // Guardar
    User savedUser = userRepository.save(user);

    // Mapear entidad a DTO response
    return modelMapper.map(savedUser, UserResponse.class);
}
```

## Testing (Pendiente)

### spring-boot-starter-test
```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-test</artifactId>
    <scope>test</scope>
</dependency>
```
- **Versión**: 3.5.7
- **Status**: Incluido pero tests no implementados aún
- **Incluye**:
  - JUnit 5 (Jupiter)
  - Mockito para mocking
  - AssertJ para assertions fluidas
  - Spring Test & Spring Boot Test
  - Hamcrest matchers

**Ejemplo de test futuro**:
```java
@SpringBootTest
class DatabaseInstanceServiceTest {

    @Autowired
    private DatabaseInstanceService instanceService;

    @MockBean
    private DockerClient dockerClient;

    @Test
    void createInstance_shouldCreateDockerContainer() {
        // Arrange
        CreateInstanceRequest request = new CreateInstanceRequest(1L, "mydb");
        when(dockerClient.createContainerCmd(any())).thenReturn(mockContainer);

        // Act
        InstanceResponse response = instanceService.createInstance(1L, request);

        // Assert
        assertThat(response.getStatus()).isEqualTo(InstanceStatus.RUNNING);
        verify(dockerClient, times(1)).createContainerCmd(any());
    }
}
```

## Árbol de Dependencias

```
CrudCloud
├── spring-boot-starter-web (3.5.7)
│   ├── spring-webmvc
│   ├── spring-web
│   ├── tomcat-embed-core
│   ├── jackson-databind
│   └── jackson-datatype-jsr310
├── spring-boot-starter-data-jpa (3.5.7)
│   ├── hibernate-core (6.5.x)
│   ├── spring-data-jpa
│   ├── spring-orm
│   └── jakarta.persistence-api
├── spring-boot-starter-validation (3.5.7)
│   ├── hibernate-validator
│   └── jakarta.validation-api
├── postgresql (42.x)
├── docker-java (3.3.4)
│   ├── docker-java-core
│   ├── docker-java-transport
│   └── jackson-annotations
├── jjwt-api (0.12.3)
├── jjwt-impl (0.12.3)
├── jjwt-jackson (0.12.3)
├── mercadopago-sdk (2.1.26)
├── modelmapper (3.2.5)
├── lombok (1.18.30)
└── spring-boot-starter-test (3.5.7)
    ├── junit-jupiter
    ├── mockito-core
    ├── assertj-core
    └── spring-test
```

## Comandos Maven

### Ver Dependencias

```bash
# Ver árbol completo
mvn dependency:tree

# Ver solo compile scope
mvn dependency:tree -Dscope=compile

# Ver dependencias con conflictos
mvn dependency:tree -Dverbose

# Analizar dependencias no utilizadas
mvn dependency:analyze
```

### Actualizar Dependencias

```bash
# Ver actualizaciones disponibles
mvn versions:display-dependency-updates

# Ver plugins desactualizados
mvn versions:display-plugin-updates

# Actualizar Spring Boot parent
mvn versions:update-parent
```

### Seguridad

```bash
# Escanear vulnerabilidades (requiere plugin)
mvn org.owasp:dependency-check-maven:check

# Ver reporte
open target/dependency-check-report.html
```

## Gestión de Versiones en pom.xml

```xml
<properties>
    <java.version>21</java.version>
    <maven.compiler.source>21</maven.compiler.source>
    <maven.compiler.target>21</maven.compiler.target>

    <!-- Versiones explícitas -->
    <docker-java.version>3.3.4</docker-java.version>
    <jjwt.version>0.12.3</jjwt.version>
    <mercadopago.version>2.1.26</mercadopago.version>
    <modelmapper.version>3.2.5</modelmapper.version>
</properties>

<dependencies>
    <dependency>
        <groupId>com.github.docker-java</groupId>
        <artifactId>docker-java</artifactId>
        <version>${docker-java.version}</version>
    </dependency>
    <!-- ... -->
</dependencies>
```

## Comparación de Versiones

| Dependencia | Versión CrudCloud | Última Versión | Estado |
|------------|-------------------|----------------|--------|
| Spring Boot | 3.5.7 | 3.5.7 | ✅ Actualizada |
| Java | 21 LTS | 21 LTS | ✅ Actualizada |
| docker-java | 3.3.4 | 3.4.1 | ⚠️ Actualización disponible |
| jjwt | 0.12.3 | 0.12.6 | ⚠️ Actualización disponible |
| mercadopago-sdk | 2.1.26 | 2.1.33 | ⚠️ Actualización disponible |
| modelmapper | 3.2.5 | 3.2.7 | ⚠️ Actualización menor |
| PostgreSQL driver | 42.x | 42.7.6 | ✅ Gestión automática |

## Notas de Compatibilidad

### Java 21 LTS
- Spring Boot 3.5.7 requiere Java 17+
- CrudCloud usa Java 21 (última LTS)
- Aprovecha: Virtual Threads, Pattern Matching, Record classes

### jjwt 0.12.3
- **Breaking changes** desde 0.11.x
- Nueva API: `.subject()` en lugar de `.setSubject()`
- Verificado en: `JwtServiceImpl.java:38-52`

### docker-java 3.3.4
- Compatible con Docker 20.10+
- Requiere socket Unix en producción: `/var/run/docker.sock`
- Alternative: Docker TCP (no recomendado en producción)

## Próximos Pasos

- Lee sobre [Guía de Desarrollo](/docs/desarrollo/guia-desarrollo)
- Aprende las [Convenciones del Proyecto](/docs/desarrollo/convenciones)
- Revisa la [API Reference](/docs/api/autenticacion)
