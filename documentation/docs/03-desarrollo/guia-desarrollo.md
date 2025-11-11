---
sidebar_position: 1
title: Guia de Desarrollo
---

# Guia de Desarrollo

Esta guia proporciona las mejores practicas y flujos de trabajo para desarrollar en CrudCloud Backend.

## Flujo de Desarrollo

### 1. Preparacion del Entorno

```bash
# Actualizar rama main/develop
git checkout develop
git pull origin develop

# Crear nueva rama para feature
git checkout -b feature/nombre-del-feature

# Instalar/actualizar dependencias
./mvnw clean install
```

### 2. Desarrollo de un Nuevo Feature

#### Paso 1: Crear Entidad

```java
@Entity
@Table(name = "productos")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String description;

    @Column(nullable = false)
    private BigDecimal price;

    private Integer stock;

    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;
}
```

#### Paso 2: Crear Repository

```java
@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    List<Product> findByCategory(Category category);

    List<Product> findByNameContainingIgnoreCase(String name);

    @Query("SELECT p FROM Product p WHERE p.stock > 0")
    List<Product> findAvailableProducts();
}
```

#### Paso 3: Crear DTOs

```java
// Request DTO
@Data
public class ProductCreateDTO {

    @NotBlank(message = "Nombre es requerido")
    @Size(max = 100)
    private String name;

    @Size(max = 500)
    private String description;

    @NotNull(message = "Precio es requerido")
    @DecimalMin(value = "0.0", inclusive = false)
    private BigDecimal price;

    @Min(value = 0)
    private Integer stock;

    private Long categoryId;
}

// Response DTO
@Data
public class ProductDTO {
    private Long id;
    private String name;
    private String description;
    private BigDecimal price;
    private Integer stock;
    private CategoryDTO category;
}
```

#### Paso 4: Crear Service

```java
public interface ProductService {
    ProductDTO createProduct(ProductCreateDTO dto);
    ProductDTO updateProduct(Long id, ProductUpdateDTO dto);
    ProductDTO getProductById(Long id);
    List<ProductDTO> getAllProducts();
    void deleteProduct(Long id);
}

@Service
@RequiredArgsConstructor
@Transactional
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final ModelMapper modelMapper;

    @Override
    public ProductDTO createProduct(ProductCreateDTO dto) {
        // Validar categoria
        Category category = categoryRepository.findById(dto.getCategoryId())
            .orElseThrow(() -> new ResourceNotFoundException("Categoria no encontrada"));

        // Mapear y guardar
        Product product = modelMapper.map(dto, Product.class);
        product.setCategory(category);
        product = productRepository.save(product);

        return modelMapper.map(product, ProductDTO.class);
    }

    @Override
    @Transactional(readOnly = true)
    public ProductDTO getProductById(Long id) {
        Product product = productRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Producto no encontrado"));
        return modelMapper.map(product, ProductDTO.class);
    }
}
```

#### Paso 5: Crear Controller

```java
@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @GetMapping
    public ResponseEntity<List<ProductDTO>> getAllProducts() {
        List<ProductDTO> products = productService.getAllProducts();
        return ResponseEntity.ok(products);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductDTO> getProduct(@PathVariable Long id) {
        ProductDTO product = productService.getProductById(id);
        return ResponseEntity.ok(product);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ProductDTO> createProduct(
        @Valid @RequestBody ProductCreateDTO dto
    ) {
        ProductDTO created = productService.createProduct(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ProductDTO> updateProduct(
        @PathVariable Long id,
        @Valid @RequestBody ProductUpdateDTO dto
    ) {
        ProductDTO updated = productService.updateProduct(id, dto);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }
}
```

### 3. Testing

```bash
# Ejecutar todos los tests
./mvnw test

# Ejecutar tests especificos
./mvnw test -Dtest=ProductServiceTest

# Ejecutar con coverage
./mvnw test jacoco:report
```

#### Test de Servicio

```java
@SpringBootTest
@Transactional
class ProductServiceTest {

    @Autowired
    private ProductService productService;

    @Autowired
    private ProductRepository productRepository;

    @Test
    void testCreateProduct() {
        ProductCreateDTO dto = new ProductCreateDTO();
        dto.setName("Laptop");
        dto.setPrice(new BigDecimal("2500000"));
        dto.setStock(10);

        ProductDTO created = productService.createProduct(dto);

        assertNotNull(created.getId());
        assertEquals("Laptop", created.getName());
        assertEquals(new BigDecimal("2500000"), created.getPrice());
    }

    @Test
    void testGetProductById_NotFound() {
        assertThrows(
            ResourceNotFoundException.class,
            () -> productService.getProductById(999L)
        );
    }
}
```

#### Test de Controller

```java
@WebMvcTest(ProductController.class)
class ProductControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ProductService productService;

    @Test
    void testGetAllProducts() throws Exception {
        List<ProductDTO> products = Arrays.asList(
            new ProductDTO(1L, "Product 1", "Desc 1", new BigDecimal("100"), 10, null),
            new ProductDTO(2L, "Product 2", "Desc 2", new BigDecimal("200"), 20, null)
        );

        when(productService.getAllProducts()).thenReturn(products);

        mockMvc.perform(get("/api/products"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$", hasSize(2)))
            .andExpect(jsonPath("$[0].name").value("Product 1"));
    }
}
```

### 4. Commit y Push

```bash
# Ver cambios
git status
git diff

# Añadir archivos
git add .

# Commit con mensaje descriptivo
git commit -m "feat: Add product CRUD endpoints

- Create Product entity and repository
- Implement ProductService with CRUD operations
- Add ProductController with REST endpoints
- Add validation and error handling
- Include unit and integration tests"

# Push a rama remota
git push origin feature/nombre-del-feature
```

### 5. Pull Request

1. Ir a GitHub/GitLab
2. Crear Pull Request de `feature/nombre-del-feature` a `develop`
3. Completar template de PR:
   - Descripcion del cambio
   - Tests realizados
   - Screenshots (si aplica)
4. Asignar reviewers
5. Esperar aprobacion y merge

## Convenciones de Commits

### Formato

```
<tipo>(<scope>): <mensaje corto>

<descripcion detallada (opcional)>

<footer (opcional)>
```

### Tipos de Commits

- `feat`: Nueva funcionalidad
- `fix`: Correccion de bug
- `docs`: Cambios en documentacion
- `style`: Formato, puntos y comas, etc (sin cambio de codigo)
- `refactor`: Refactorizacion de codigo
- `perf`: Mejora de performance
- `test`: Añadir o corregir tests
- `chore`: Mantenimiento, actualizacion de dependencias

### Ejemplos

```bash
feat(products): Add search endpoint with filters

fix(auth): Resolve JWT token expiration issue

docs(api): Update authentication documentation

refactor(services): Extract payment logic to separate service

test(users): Add integration tests for user registration
```

## Debugging

### IntelliJ IDEA

1. Colocar breakpoints (click en gutter izquierdo)
2. Click en icono "Debug" (bug)
3. Ejecutar request que activa el breakpoint
4. Usar controles de debug:
   - F8: Step over
   - F7: Step into
   - Shift+F8: Step out
   - F9: Resume

### Logs

```java
@Slf4j
@Service
public class ProductService {

    public ProductDTO createProduct(ProductCreateDTO dto) {
        log.debug("Creating product: {}", dto);

        Product product = productRepository.save(product);

        log.info("Product created successfully with ID: {}", product.getId());

        return modelMapper.map(product, ProductDTO.class);
    }
}
```

### Remote Debugging

```bash
# Ejecutar con debug habilitado
java -agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=*:5005 -jar app.jar

# En IntelliJ: Run > Edit Configurations > Add Remote JVM Debug
# Host: localhost, Port: 5005
```

## Hot Reload (DevTools)

Añadir dependencia:

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-devtools</artifactId>
    <scope>runtime</scope>
    <optional>true</optional>
</dependency>
```

Configuracion:

```properties
# application-dev.properties
spring.devtools.restart.enabled=true
spring.devtools.livereload.enabled=true
```

## Perfilado y Optimizacion

### Ver Queries SQL

```properties
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
logging.level.org.hibernate.type.descriptor.sql.BasicBinder=TRACE
```

### Metricas de Performance

```bash
# Ver metricas
curl http://localhost:8080/api/actuator/metrics

# Metrica especifica
curl http://localhost:8080/api/actuator/metrics/jvm.memory.used
curl http://localhost:8080/api/actuator/metrics/http.server.requests
```

## Troubleshooting Comun

### Error: Port already in use

```bash
# Linux/macOS
lsof -ti:8080 | xargs kill -9

# Windows
netstat -ano | findstr :8080
taskkill /PID <PID> /F
```

### Error: No se pueden cargar dependencias

```bash
./mvnw dependency:purge-local-repository
./mvnw clean install -U
```

### Error: Tests fallan en CI/CD pero pasan localmente

- Verificar perfiles de Spring
- Revisar base de datos de test (H2 vs PostgreSQL)
- Verificar timezone y configuraciones de entorno

## Proximos Pasos

- Lee las [Convenciones de Codigo](/docs/desarrollo/convenciones)
- Aprende sobre [Testing](/docs/desarrollo/testing)
- Consulta la [API Reference](/docs/api/autenticacion)
