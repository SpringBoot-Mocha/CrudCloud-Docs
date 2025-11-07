---
sidebar_position: 2
title: Convenciones de Codigo
---

# Convenciones de Codigo

Convenciones y estandares de codificacion para CrudCloud Backend.

## Nomenclatura

### Clases
- **PascalCase**: `UserService`, `ProductController`
- **Descriptivo y claro**: Evitar abreviaciones

### Metodos
- **camelCase**: `createUser()`, `findByEmail()`
- **Verbos para acciones**: `get`, `create`, `update`, `delete`, `find`

### Variables
- **camelCase**: `userName`, `productList`
- **Constantes**: `UPPER_SNAKE_CASE` - `MAX_RETRY_COUNT`

### Paquetes
- **Minusculas**: `com.crudcloud.backend.service`

## Estructura de Codigo

### Orden en Clases

```java
@Entity
public class User {
    // 1. Constantes
    private static final int MAX_LOGIN_ATTEMPTS = 3;

    // 2. Campos
    @Id
    private Long id;
    private String email;

    // 3. Constructores
    public User() {}
    public User(String email) { this.email = email; }

    // 4. Getters y Setters
    public String getEmail() { return email; }

    // 5. Metodos de negocio
    public void resetPassword() { /* ... */ }

    // 6. Metodos Override
    @Override
    public String toString() { return "User..."; }
}
```

## Anotaciones de Spring

### Orden de Anotaciones

```java
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Slf4j
public class UserController {
    // ...
}
```

### Preferencias
- Usar `@RequiredArgsConstructor` de Lombok en lugar de `@Autowired`
- Usar `@Slf4j` para logging
- Usar `@Transactional` a nivel de servicio

## DTOs y Validaciones

```java
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserCreateDTO {

    @NotBlank(message = "Email es requerido")
    @Email(message = "Email debe ser valido")
    private String email;

    @NotBlank(message = "Password es requerido")
    @Size(min = 8, max = 100, message = "Password debe tener entre 8 y 100 caracteres")
    @Pattern(
        regexp = "^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d).*$",
        message = "Password debe contener mayusculas, minusculas y numeros"
    )
    private String password;
}
```

## Manejo de Excepciones

### Excepciones Personalizadas

```java
@ResponseStatus(HttpStatus.NOT_FOUND)
public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String message) {
        super(message);
    }
}
```

### Handler Global

```java
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleNotFound(ResourceNotFoundException ex) {
        ErrorResponse error = new ErrorResponse(
            HttpStatus.NOT_FOUND.value(),
            ex.getMessage(),
            LocalDateTime.now()
        );
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
    }
}
```

## Logging

```java
@Slf4j
@Service
public class UserService {

    public UserDTO createUser(UserCreateDTO dto) {
        log.debug("Creating user with email: {}", dto.getEmail());

        try {
            User user = userRepository.save(user);
            log.info("User created successfully: {}", user.getId());
            return modelMapper.map(user, UserDTO.class);
        } catch (Exception e) {
            log.error("Error creating user: {}", e.getMessage(), e);
            throw new BusinessException("Error al crear usuario");
        }
    }
}
```

### Niveles de Log

- **ERROR**: Errores criticos que requieren atencion
- **WARN**: Situaciones inusuales que no son errores
- **INFO**: Eventos importantes del flujo de la aplicacion
- **DEBUG**: Informacion detallada para debugging
- **TRACE**: Informacion muy detallada

## Queries y JPA

### Naming Queries

```java
@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // Query methods (preferido para consultas simples)
    Optional<User> findByEmail(String email);
    List<User> findByActiveTrue();
    boolean existsByEmail(String email);

    // @Query (para consultas complejas)
    @Query("SELECT u FROM User u JOIN u.roles r WHERE r.name = :roleName")
    List<User> findByRoleName(@Param("roleName") String roleName);

    // Native queries (solo cuando sea necesario)
    @Query(value = "SELECT * FROM users WHERE email ILIKE %:search%", nativeQuery = true)
    List<User> searchByEmail(@Param("search") String search);
}
```

## Comentarios y Documentacion

### JavaDoc

```java
/**
 * Crea un nuevo usuario en el sistema.
 *
 * @param dto Datos del usuario a crear
 * @return Usuario creado con ID asignado
 * @throws BusinessException si el email ya existe
 */
public UserDTO createUser(UserCreateDTO dto) {
    // ...
}
```

### Comentarios en Codigo

```java
// Evitar comentarios obvios
// BAD
int x = 5; // asignar 5 a x

// GOOD
// Calcular timeout basado en intentos de reintento exponenciales
int timeout = baseTimeout * Math.pow(2, retryAttempts);
```

## Seguridad

### Nunca hardcodear credenciales

```java
// MAL
String password = "admin123";

// BIEN
@Value("${admin.password}")
private String password;
```

### Validar entrada de usuario

```java
public UserDTO updateUser(Long id, UserUpdateDTO dto) {
    // Validar que el ID es valido
    if (id == null || id <= 0) {
        throw new BadRequestException("ID invalido");
    }

    // Validar DTO
    if (dto.getEmail() != null && !isValidEmail(dto.getEmail())) {
        throw new BadRequestException("Email invalido");
    }

    // ...
}
```

## Performance

### Usar Transacciones Correctamente

```java
// Read-only para consultas
@Transactional(readOnly = true)
public UserDTO getUser(Long id) {
    // ...
}

// Transaccional para operaciones de escritura
@Transactional
public UserDTO createUser(UserCreateDTO dto) {
    // ...
}
```

### Evitar N+1 Queries

```java
// MAL: N+1 queries
List<Order> orders = orderRepository.findAll();
orders.forEach(order -> {
    // Esto genera una query por cada orden
    order.getItems().size();
});

// BIEN: Join Fetch
@Query("SELECT o FROM Order o JOIN FETCH o.items")
List<Order> findAllWithItems();
```

## Testing

### Nombres de Tests

```java
@Test
void testCreateUser_Success() { /* ... */ }

@Test
void testCreateUser_EmailAlreadyExists_ThrowsException() { /* ... */ }

@Test
void testGetUserById_NotFound_ThrowsException() { /* ... */ }
```

## Formateo de Codigo

### Configuracion IntelliJ IDEA

Usa Google Java Style Guide o similar.

### Editorconfig

```ini
[*.java]
indent_style = space
indent_size = 4
continuation_indent_size = 8
max_line_length = 120
```

## Proximos Pasos

- Aprende sobre [Testing](/docs/03-desarrollo/testing)
- Consulta la [API Reference](/docs/04-api/autenticacion)
