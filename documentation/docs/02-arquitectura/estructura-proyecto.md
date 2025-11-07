---
sidebar_position: 2
title: Estructura del Proyecto
---

# Estructura del Proyecto

Esta pagina documenta la organizacion de carpetas y archivos del proyecto CrudCloud Backend.

## Estructura General

```
crudcloud-backend/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/
│   │   │       └── crudcloud/
│   │   │           └── backend/
│   │   │               ├── config/
│   │   │               ├── controller/
│   │   │               ├── dto/
│   │   │               ├── entity/
│   │   │               ├── exception/
│   │   │               ├── repository/
│   │   │               ├── security/
│   │   │               ├── service/
│   │   │               ├── util/
│   │   │               └── CrudCloudBackendApplication.java
│   │   └── resources/
│   │       ├── application.properties
│   │       ├── application-dev.properties
│   │       ├── application-prod.properties
│   │       ├── application-test.properties
│   │       ├── data.sql
│   │       ├── schema.sql
│   │       └── static/
│   └── test/
│       └── java/
│           └── com/
│               └── crudcloud/
│                   └── backend/
│                       ├── controller/
│                       ├── service/
│                       ├── repository/
│                       └── integration/
├── target/
├── .gitignore
├── .env
├── docker-compose.yml
├── Dockerfile
├── mvnw
├── mvnw.cmd
├── pom.xml
└── README.md
```

## Paquetes Principales

### config/

**Proposito**: Clases de configuracion de Spring

```
config/
├── AppConfig.java              # Configuracion general
├── SecurityConfig.java         # Configuracion de seguridad
├── WebConfig.java              # Configuracion Web (CORS, etc.)
├── JpaConfig.java              # Configuracion JPA/Hibernate
├── SwaggerConfig.java          # Configuracion Swagger/OpenAPI
└── MercadoPagoConfig.java      # Configuracion Mercado Pago
```

**Ejemplo**:
```java
@Configuration
public class AppConfig {

    @Bean
    public ModelMapper modelMapper() {
        return new ModelMapper();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
```

### controller/

**Proposito**: Controladores REST (endpoints HTTP)

```
controller/
├── AuthController.java         # /api/auth/*
├── UserController.java         # /api/users/*
├── ProductController.java      # /api/products/*
├── OrderController.java        # /api/orders/*
├── PaymentController.java      # /api/payments/*
└── HealthController.java       # /api/health
```

**Estructura tipica**:
```java
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

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

### dto/

**Proposito**: Data Transfer Objects

```
dto/
├── request/
│   ├── UserCreateDTO.java
│   ├── UserUpdateDTO.java
│   ├── LoginRequestDTO.java
│   ├── RegisterRequestDTO.java
│   ├── ProductCreateDTO.java
│   └── OrderCreateDTO.java
├── response/
│   ├── UserDTO.java
│   ├── ProductDTO.java
│   ├── OrderDTO.java
│   ├── AuthResponseDTO.java
│   └── ApiResponseDTO.java
└── mapper/
    ├── UserMapper.java
    ├── ProductMapper.java
    └── OrderMapper.java
```

**Ejemplo**:
```java
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserCreateDTO {

    @NotBlank(message = "Email es requerido")
    @Email(message = "Email debe ser valido")
    private String email;

    @NotBlank(message = "Password es requerido")
    @Size(min = 8, max = 100)
    private String password;

    @NotBlank
    private String firstName;

    @NotBlank
    private String lastName;
}
```

### entity/

**Proposito**: Entidades JPA (modelos de dominio)

```
entity/
├── User.java
├── Role.java
├── Product.java
├── Category.java
├── Order.java
├── OrderItem.java
├── Payment.java
└── BaseEntity.java             # Clase base con campos comunes
```

**Ejemplo**:
```java
@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class User extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    private String firstName;
    private String lastName;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
        name = "user_roles",
        joinColumns = @JoinColumn(name = "user_id"),
        inverseJoinColumns = @JoinColumn(name = "role_id")
    )
    private Set<Role> roles = new HashSet<>();

    @Column(nullable = false)
    private Boolean active = true;
}
```

### exception/

**Proposito**: Excepciones personalizadas y manejo global

```
exception/
├── GlobalExceptionHandler.java  # @RestControllerAdvice
├── ResourceNotFoundException.java
├── BusinessException.java
├── UnauthorizedException.java
├── BadRequestException.java
└── ErrorResponse.java           # Estructura de error estandar
```

**Ejemplo**:
```java
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleNotFound(
        ResourceNotFoundException ex
    ) {
        ErrorResponse error = new ErrorResponse(
            HttpStatus.NOT_FOUND.value(),
            ex.getMessage(),
            LocalDateTime.now()
        );
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidation(
        MethodArgumentNotValidException ex
    ) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getFieldErrors()
            .forEach(error -> errors.put(error.getField(), error.getDefaultMessage()));

        ErrorResponse response = new ErrorResponse(
            HttpStatus.BAD_REQUEST.value(),
            "Errores de validacion",
            errors,
            LocalDateTime.now()
        );
        return ResponseEntity.badRequest().body(response);
    }
}
```

### repository/

**Proposito**: Repositorios JPA para acceso a datos

```
repository/
├── UserRepository.java
├── RoleRepository.java
├── ProductRepository.java
├── CategoryRepository.java
├── OrderRepository.java
├── OrderItemRepository.java
└── PaymentRepository.java
```

**Ejemplo**:
```java
@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    List<User> findByActiveTrue();

    @Query("SELECT u FROM User u JOIN u.roles r WHERE r.name = :roleName")
    List<User> findByRoleName(@Param("roleName") String roleName);
}
```

### security/

**Proposito**: Componentes de seguridad y JWT

```
security/
├── JwtAuthenticationFilter.java    # Filtro JWT
├── JwtTokenProvider.java           # Generacion/validacion de tokens
├── JwtAuthenticationEntryPoint.java
├── CustomUserDetailsService.java   # Carga de usuarios
└── SecurityUtils.java              # Utilidades de seguridad
```

**Ejemplo**:
```java
@Component
public class JwtTokenProvider {

    @Value("${jwt.secret}")
    private String jwtSecret;

    @Value("${jwt.expiration}")
    private Long jwtExpiration;

    public String generateToken(Authentication authentication) {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();

        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtExpiration);

        return Jwts.builder()
            .setSubject(Long.toString(userPrincipal.getId()))
            .setIssuedAt(now)
            .setExpiration(expiryDate)
            .signWith(SignatureAlgorithm.HS512, jwtSecret)
            .compact();
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parser().setSigningKey(jwtSecret).parseClaimsJws(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }
}
```

### service/

**Proposito**: Logica de negocio

```
service/
├── UserService.java
├── AuthService.java
├── ProductService.java
├── OrderService.java
├── PaymentService.java
├── EmailService.java
└── impl/
    ├── UserServiceImpl.java
    ├── AuthServiceImpl.java
    ├── ProductServiceImpl.java
    ├── OrderServiceImpl.java
    └── PaymentServiceImpl.java
```

**Ejemplo**:
```java
public interface UserService {
    UserDTO createUser(UserCreateDTO dto);
    UserDTO updateUser(Long id, UserUpdateDTO dto);
    UserDTO getUserById(Long id);
    void deleteUser(Long id);
    List<UserDTO> getAllUsers();
}

@Service
@RequiredArgsConstructor
@Transactional
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final ModelMapper modelMapper;
    private final PasswordEncoder passwordEncoder;

    @Override
    public UserDTO createUser(UserCreateDTO dto) {
        if (userRepository.existsByEmail(dto.getEmail())) {
            throw new BusinessException("Email ya existe");
        }

        User user = modelMapper.map(dto, User.class);
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        user = userRepository.save(user);

        return modelMapper.map(user, UserDTO.class);
    }
}
```

### util/

**Proposito**: Utilidades y helpers

```
util/
├── DateUtils.java
├── StringUtils.java
├── ValidationUtils.java
└── Constants.java
```

## Archivos de Recursos

### application.properties

Configuracion principal:
```properties
# Application
spring.application.name=CrudCloud Backend
server.port=8080

# Profile
spring.profiles.active=dev

# Logging
logging.level.root=INFO
logging.level.com.crudcloud.backend=DEBUG
```

### application-dev.properties

Configuracion de desarrollo (ver seccion [Configuracion](/docs/01-guia-inicio/configuracion))

### data.sql

Datos iniciales para desarrollo:
```sql
INSERT INTO roles (name, description) VALUES
('ROLE_ADMIN', 'Administrador'),
('ROLE_USER', 'Usuario regular');
```

## Archivos de Test

```
test/
└── java/
    └── com/crudcloud/backend/
        ├── controller/
        │   ├── UserControllerTest.java
        │   └── ProductControllerTest.java
        ├── service/
        │   ├── UserServiceTest.java
        │   └── ProductServiceTest.java
        ├── repository/
        │   └── UserRepositoryTest.java
        └── integration/
            └── UserIntegrationTest.java
```

## Convenciones de Nomenclatura

### Paquetes
- Usar minusculas
- Separar palabras con punto (no guion bajo)
- Singular para nombres de paquetes

### Clases
- **Controllers**: `*Controller.java`
- **Services**: `*Service.java`, `*ServiceImpl.java`
- **Repositories**: `*Repository.java`
- **Entities**: Nombre del modelo (singular)
- **DTOs**: `*DTO.java`, `*Request.java`, `*Response.java`
- **Exceptions**: `*Exception.java`
- **Config**: `*Config.java`

### Metodos
- camelCase
- Verbos para acciones: `createUser`, `updateProduct`
- Getters/Setters: Generados por Lombok

## Proximos Pasos

- Revisa las [Dependencias del Proyecto](/docs/02-arquitectura/dependencias)
- Aprende sobre [Convenciones de Desarrollo](/docs/03-desarrollo/convenciones)
