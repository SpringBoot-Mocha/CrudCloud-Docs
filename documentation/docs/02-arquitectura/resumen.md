---
sidebar_position: 1
title: Resumen de Arquitectura
---

# Resumen de Arquitectura

CrudCloud Backend sigue una **arquitectura en capas (Layered Architecture)** con principios de diseño orientado a objetos y patrones empresariales probados.

## Principios de Diseño

### 1. Separacion de Responsabilidades (SoC)

Cada capa tiene una responsabilidad unica y bien definida:

- **Controller**: Manejo de HTTP requests/responses
- **Service**: Logica de negocio
- **Repository**: Acceso a datos
- **Entity**: Representacion del modelo de dominio

### 2. Inversion de Dependencias (DI)

Uso de Spring Framework para inyeccion de dependencias:

```java
@Service
public class UserService {
    private final UserRepository userRepository;

    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
}
```

### 3. Open/Closed Principle

Clases abiertas para extension pero cerradas para modificacion mediante interfaces y herencia.

## Arquitectura en Capas

```
┌─────────────────────────────────────────────────────────┐
│                   PRESENTATION LAYER                     │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────┐   │
│  │ Controllers │  │  DTOs/Forms  │  │  Exception   │   │
│  │             │  │              │  │   Handlers   │   │
│  └─────────────┘  └──────────────┘  └──────────────┘   │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│                    BUSINESS LAYER                        │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────┐   │
│  │  Services   │  │  Validators  │  │   Mappers    │   │
│  │             │  │              │  │              │   │
│  └─────────────┘  └──────────────┘  └──────────────┘   │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│                  PERSISTENCE LAYER                       │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────┐   │
│  │Repositories │  │   Entities   │  │  Migrations  │   │
│  │   (JPA)     │  │              │  │              │   │
│  └─────────────┘  └──────────────┘  └──────────────┘   │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│                    DATABASE LAYER                        │
│              PostgreSQL 15+ (Relational DB)              │
└─────────────────────────────────────────────────────────┘
```

## Capas Detalladas

### 1. Presentation Layer (Controller)

**Responsabilidad**: Manejar requests HTTP y responses

**Componentes**:
- `@RestController`: Endpoints REST
- `@RequestMapping`: Mapeo de rutas
- DTOs: Data Transfer Objects
- Exception Handlers: Manejo centralizado de errores

**Ejemplo**:
```java
@RestController
@RequestMapping("/api/users")
public class UserController {

    @GetMapping("/{id}")
    public ResponseEntity<UserDTO> getUser(@PathVariable Long id) {
        // ...
    }

    @PostMapping
    public ResponseEntity<UserDTO> createUser(@Valid @RequestBody UserCreateDTO dto) {
        // ...
    }
}
```

### 2. Business Layer (Service)

**Responsabilidad**: Implementar logica de negocio

**Componentes**:
- `@Service`: Servicios de negocio
- Business Logic: Reglas de negocio
- Validation: Validaciones complejas
- ModelMapper: Conversion entre DTOs y entidades

**Ejemplo**:
```java
@Service
@Transactional
public class UserService {

    private final UserRepository userRepository;
    private final ModelMapper modelMapper;

    public UserDTO createUser(UserCreateDTO dto) {
        // Validacion de negocio
        if (userRepository.existsByEmail(dto.getEmail())) {
            throw new BusinessException("Email ya existe");
        }

        // Mapeo y persistencia
        User user = modelMapper.map(dto, User.class);
        user = userRepository.save(user);

        return modelMapper.map(user, UserDTO.class);
    }
}
```

### 3. Persistence Layer (Repository)

**Responsabilidad**: Acceso y persistencia de datos

**Componentes**:
- `@Repository`: Repositorios JPA
- Spring Data JPA: Abstraccion de acceso a datos
- Custom Queries: Consultas personalizadas
- Specifications: Consultas dinamicas

**Ejemplo**:
```java
@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    @Query("SELECT u FROM User u WHERE u.active = true")
    List<User> findAllActiveUsers();
}
```

### 4. Domain Layer (Entity)

**Responsabilidad**: Modelar el dominio de negocio

**Componentes**:
- `@Entity`: Entidades JPA
- Relationships: Relaciones entre entidades
- Business Logic: Logica asociada al dominio
- Validations: Validaciones de nivel de campo

**Ejemplo**:
```java
@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    @Email
    private String email;

    @Column(nullable = false)
    private String password;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
        name = "user_roles",
        joinColumns = @JoinColumn(name = "user_id"),
        inverseJoinColumns = @JoinColumn(name = "role_id")
    )
    private Set<Role> roles;

    // Business methods
    public boolean hasRole(String roleName) {
        return roles.stream()
            .anyMatch(role -> role.getName().equals(roleName));
    }
}
```

## Componentes Transversales

### Security Layer

**JWT Authentication**:
```java
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(
        HttpServletRequest request,
        HttpServletResponse response,
        FilterChain filterChain
    ) throws ServletException, IOException {
        // Extract and validate JWT token
        String token = extractToken(request);

        if (token != null && jwtTokenProvider.validateToken(token)) {
            Authentication auth = jwtTokenProvider.getAuthentication(token);
            SecurityContextHolder.getContext().setAuthentication(auth);
        }

        filterChain.doFilter(request, response);
    }
}
```

### Exception Handling

**Global Exception Handler**:
```java
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleResourceNotFound(
        ResourceNotFoundException ex
    ) {
        ErrorResponse error = new ErrorResponse(
            HttpStatus.NOT_FOUND.value(),
            ex.getMessage(),
            LocalDateTime.now()
        );
        return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
    }
}
```

### Validation Layer

**Bean Validation**:
```java
@Data
public class UserCreateDTO {

    @NotBlank(message = "Email es requerido")
    @Email(message = "Email debe ser valido")
    private String email;

    @NotBlank(message = "Password es requerido")
    @Size(min = 8, message = "Password debe tener al menos 8 caracteres")
    @Pattern(
        regexp = "^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d).*$",
        message = "Password debe contener mayusculas, minusculas y numeros"
    )
    private String password;
}
```

## Patrones de Diseño Implementados

### 1. Repository Pattern

Abstraccion del acceso a datos:
```java
public interface GenericRepository<T, ID> {
    T save(T entity);
    Optional<T> findById(ID id);
    List<T> findAll();
    void deleteById(ID id);
}
```

### 2. DTO Pattern

Transferencia de datos entre capas:
```java
// Request DTO
public class UserCreateDTO {
    private String email;
    private String password;
}

// Response DTO
public class UserDTO {
    private Long id;
    private String email;
    private String fullName;
}
```

### 3. Builder Pattern

Construccion de objetos complejos (via Lombok):
```java
@Builder
public class User {
    private Long id;
    private String email;
    private String password;
}

// Uso
User user = User.builder()
    .email("user@example.com")
    .password("encrypted")
    .build();
```

### 4. Strategy Pattern

Para procesamiento de pagos:
```java
public interface PaymentStrategy {
    PaymentResult process(PaymentRequest request);
}

public class MercadoPagoStrategy implements PaymentStrategy {
    @Override
    public PaymentResult process(PaymentRequest request) {
        // Implementacion Mercado Pago
    }
}
```

### 5. Factory Pattern

Para creacion de objetos:
```java
@Component
public class NotificationFactory {

    public Notification createNotification(NotificationType type) {
        return switch(type) {
            case EMAIL -> new EmailNotification();
            case SMS -> new SmsNotification();
            case PUSH -> new PushNotification();
        };
    }
}
```

## Flujo de una Request Tipica

```
1. Cliente → HTTP Request → Controller
                              ↓
2. Controller → Validacion → DTO
                              ↓
3. DTO → ModelMapper → Entity
                              ↓
4. Entity → Service → Business Logic
                              ↓
5. Service → Repository → Database
                              ↓
6. Database → Result → Repository
                              ↓
7. Repository → Entity → Service
                              ↓
8. Service → ModelMapper → DTO
                              ↓
9. DTO → Controller → HTTP Response → Cliente
```

### Ejemplo Completo

```java
// 1. Request llega al controller
@PostMapping
public ResponseEntity<UserDTO> createUser(@Valid @RequestBody UserCreateDTO dto) {
    // 2. Controller delega al service
    UserDTO created = userService.createUser(dto);
    // 9. Controller retorna response
    return ResponseEntity.status(HttpStatus.CREATED).body(created);
}

// 3-8. Service maneja la logica
@Service
public class UserService {
    public UserDTO createUser(UserCreateDTO dto) {
        // 3. Mapear DTO a Entity
        User user = modelMapper.map(dto, User.class);

        // 4. Aplicar logica de negocio
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        // 5-6. Persistir en base de datos
        user = userRepository.save(user);

        // 7-8. Mapear Entity a DTO
        return modelMapper.map(user, UserDTO.class);
    }
}
```

## Decisiones de Arquitectura

### ¿Por que Arquitectura en Capas?

- **Separacion clara de responsabilidades**
- **Facil de entender y mantener**
- **Testeable**: Cada capa se puede testear independientemente
- **Escalable**: Se pueden optimizar capas individuales
- **Framework-friendly**: Encaja bien con Spring Boot

### ¿Por que Spring Boot?

- **Ecosistema maduro**: Amplio soporte y comunidad
- **Convencion sobre configuracion**: Menos codigo boilerplate
- **Integracion facil**: Con JPA, Security, etc.
- **Produccion-ready**: Actuator, monitoring, metrics

### ¿Por que PostgreSQL?

- **ACID compliant**: Transacciones confiables
- **Performance**: Excelente para cargas pesadas
- **Extensible**: Tipos de datos avanzados (JSON, arrays)
- **Open Source**: Sin costos de licencia

## Proximos Pasos

- Explora la [Estructura del Proyecto](/docs/02-arquitectura/estructura-proyecto)
- Revisa las [Dependencias](/docs/02-arquitectura/dependencias)
- Aprende sobre [Convenciones de Desarrollo](/docs/03-desarrollo/convenciones)
