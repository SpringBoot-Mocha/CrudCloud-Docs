---
sidebar_position: 3
title: Testing
---

# Testing

Guia completa de testing para CrudCloud Backend.

## Tipos de Tests

### 1. Unit Tests
- Testean una unidad de codigo aislada
- Usan mocks para dependencias
- Rapidos y especificos

### 2. Integration Tests
- Testean multiples componentes juntos
- Usan base de datos real o en memoria
- Mas lentos pero mas confiables

### 3. End-to-End Tests
- Testean flujos completos de usuario
- Incluyen todos los componentes
- Los mas lentos pero mas cercanos a produccion

## Configuracion de Tests

### application-test.properties

```properties
spring.datasource.url=jdbc:h2:mem:testdb
spring.datasource.driver-class-name=org.h2.Driver
spring.jpa.hibernate.ddl-auto=create-drop
spring.jpa.show-sql=true

jwt.secret=test-secret-key-for-testing-purposes-only
jwt.expiration=3600000
```

## Unit Tests - Service

```java
@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private ModelMapper modelMapper;

    @InjectMocks
    private UserServiceImpl userService;

    @Test
    void testCreateUser_Success() {
        // Given
        UserCreateDTO dto = new UserCreateDTO();
        dto.setEmail("test@example.com");
        dto.setPassword("Password123!");

        User user = new User();
        user.setId(1L);
        user.setEmail("test@example.com");

        when(userRepository.existsByEmail(anyString())).thenReturn(false);
        when(passwordEncoder.encode(anyString())).thenReturn("encoded");
        when(modelMapper.map(dto, User.class)).thenReturn(user);
        when(userRepository.save(any(User.class))).thenReturn(user);
        when(modelMapper.map(user, UserDTO.class)).thenReturn(new UserDTO());

        // When
        UserDTO result = userService.createUser(dto);

        // Then
        assertNotNull(result);
        verify(userRepository).save(any(User.class));
    }

    @Test
    void testCreateUser_EmailExists_ThrowsException() {
        // Given
        UserCreateDTO dto = new UserCreateDTO();
        dto.setEmail("existing@example.com");

        when(userRepository.existsByEmail(anyString())).thenReturn(true);

        // When & Then
        assertThrows(BusinessException.class, () -> {
            userService.createUser(dto);
        });

        verify(userRepository, never()).save(any(User.class));
    }
}
```

## Integration Tests

```java
@SpringBootTest
@Transactional
@TestPropertySource(locations = "classpath:application-test.properties")
class UserServiceIntegrationTest {

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    @Test
    void testCreateUser_Integration() {
        // Given
        UserCreateDTO dto = new UserCreateDTO();
        dto.setEmail("integration@example.com");
        dto.setPassword("Password123!");
        dto.setFirstName("Test");
        dto.setLastName("User");

        // When
        UserDTO result = userService.createUser(dto);

        // Then
        assertNotNull(result.getId());
        assertEquals("integration@example.com", result.getEmail());

        // Verify in database
        Optional<User> savedUser = userRepository.findByEmail("integration@example.com");
        assertTrue(savedUser.isPresent());
    }
}
```

## Controller Tests

```java
@WebMvcTest(UserController.class)
class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UserService userService;

    @MockBean
    private JwtTokenProvider jwtTokenProvider;

    @Test
    void testGetUser_Success() throws Exception {
        // Given
        UserDTO user = new UserDTO();
        user.setId(1L);
        user.setEmail("test@example.com");

        when(userService.getUserById(1L)).thenReturn(user);

        // When & Then
        mockMvc.perform(get("/api/users/1"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.id").value(1))
            .andExpect(jsonPath("$.email").value("test@example.com"));
    }

    @Test
    void testCreateUser_ValidationError() throws Exception {
        // Given
        String invalidJson = "{\"email\":\"invalid\",\"password\":\"short\"}";

        // When & Then
        mockMvc.perform(post("/api/users")
                .contentType(MediaType.APPLICATION_JSON)
                .content(invalidJson))
            .andExpect(status().isBadRequest());
    }
}
```

## Repository Tests

```java
@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
class UserRepositoryTest {

    @Autowired
    private UserRepository userRepository;

    @Test
    void testFindByEmail_Success() {
        // Given
        User user = new User();
        user.setEmail("repo@example.com");
        user.setPassword("encoded");
        userRepository.save(user);

        // When
        Optional<User> found = userRepository.findByEmail("repo@example.com");

        // Then
        assertTrue(found.isPresent());
        assertEquals("repo@example.com", found.get().getEmail());
    }

    @Test
    void testExistsByEmail_True() {
        // Given
        User user = new User();
        user.setEmail("exists@example.com");
        user.setPassword("encoded");
        userRepository.save(user);

        // When
        boolean exists = userRepository.existsByEmail("exists@example.com");

        // Then
        assertTrue(exists);
    }
}
```

## Ejecutar Tests

```bash
# Todos los tests
./mvnw test

# Test especifico
./mvnw test -Dtest=UserServiceTest

# Tests de una clase
./mvnw test -Dtest=UserServiceTest#testCreateUser_Success

# Con coverage
./mvnw test jacoco:report

# Ver reporte
open target/site/jacoco/index.html
```

## Best Practices

### AAA Pattern
```java
@Test
void testExample() {
    // Arrange (Given)
    // Preparar datos y mocks

    // Act (When)
    // Ejecutar el metodo a testear

    // Assert (Then)
    // Verificar resultados
}
```

### Nombres Descriptivos
- `test<Method>_<Scenario>_<ExpectedResult>`
- `testCreateUser_EmailExists_ThrowsException`

### Un Assert por Test (preferible)
```java
@Test
void testGetUserEmail() {
    User user = new User("test@example.com");
    assertEquals("test@example.com", user.getEmail());
}
```

## Proximos Pasos

- Consulta la [API Reference](/docs/04-api/autenticacion)
- Revisa [Deployment](/docs/05-deployment/produccion)
