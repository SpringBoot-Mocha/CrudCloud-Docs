---
sidebar_position: 3
title: Dependencias
---

# Dependencias del Proyecto

Esta pagina documenta todas las dependencias de Maven utilizadas en CrudCloud Backend.

## pom.xml Overview

```xml
<project>
    <groupId>com.crudcloud</groupId>
    <artifactId>backend</artifactId>
    <version>1.0.0</version>
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
- **Proposito**: Desarrollo de aplicaciones web y REST APIs
- **Incluye**: Spring MVC, Tomcat embebido, Jackson
- **Uso**: Controladores REST, manejo de requests HTTP

#### spring-boot-starter-data-jpa
```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-jpa</artifactId>
</dependency>
```
- **Proposito**: Persistencia de datos con JPA/Hibernate
- **Incluye**: Hibernate, Spring Data JPA, Transaction Manager
- **Uso**: Repositorios, entidades, consultas a base de datos

#### spring-boot-starter-security
```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-security</artifactId>
</dependency>
```
- **Proposito**: Autenticacion y autorizacion
- **Incluye**: Spring Security Core, Web, Config
- **Uso**: Proteccion de endpoints, JWT, roles

#### spring-boot-starter-validation
```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-validation</artifactId>
</dependency>
```
- **Proposito**: Validacion de datos
- **Incluye**: Hibernate Validator, Bean Validation API
- **Uso**: Validaciones en DTOs (@NotNull, @Email, etc.)

#### spring-boot-starter-actuator
```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-actuator</artifactId>
</dependency>
```
- **Proposito**: Monitoring y metricas
- **Incluye**: Health checks, metrics, endpoints de gestion
- **Uso**: Monitoreo de aplicacion en produccion

## Base de Datos

### PostgreSQL Driver
```xml
<dependency>
    <groupId>org.postgresql</groupId>
    <artifactId>postgresql</artifactId>
    <scope>runtime</scope>
</dependency>
```
- **Version**: Compatible con PostgreSQL 15+
- **Proposito**: Driver JDBC para PostgreSQL
- **Uso**: Conexion a base de datos PostgreSQL

### HikariCP (Incluido en spring-boot-starter-jdbc)
- **Proposito**: Connection pooling
- **Ventajas**: Rapido, ligero, confiable
- **Configuracion**: En application.properties

## Seguridad y JWT

### jjwt-api, jjwt-impl, jjwt-jackson
```xml
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
```
- **Proposito**: Generacion y validacion de tokens JWT
- **Uso**: Autenticacion stateless, tokens de acceso

## Utilidades

### Lombok
```xml
<dependency>
    <groupId>org.projectlombok</groupId>
    <artifactId>lombok</artifactId>
    <optional>true</optional>
</dependency>
```
- **Proposito**: Reducir boilerplate code
- **Caracteristicas**:
  - `@Data`: Getters, setters, equals, hashCode, toString
  - `@Builder`: Patron builder
  - `@NoArgsConstructor`, `@AllArgsConstructor`
  - `@Slf4j`: Logger automatico

**Ejemplo**:
```java
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User {
    private Long id;
    private String email;
    private String password;
}
```

### ModelMapper
```xml
<dependency>
    <groupId>org.modelmapper</groupId>
    <artifactId>modelmapper</artifactId>
    <version>3.2.0</version>
</dependency>
```
- **Proposito**: Mapeo entre DTOs y entidades
- **Ventajas**: Reduce codigo de mapeo manual

**Ejemplo**:
```java
UserDTO dto = modelMapper.map(user, UserDTO.class);
```

## Integracion de Pagos

### Mercado Pago SDK
```xml
<dependency>
    <groupId>com.mercadopago</groupId>
    <artifactId>sdk-java</artifactId>
    <version>2.1.27</version>
</dependency>
```
- **Proposito**: Integracion con Mercado Pago
- **Funcionalidades**:
  - Crear preferencias de pago
  - Procesar pagos
  - Webhooks de notificaciones

**Ejemplo**:
```java
MercadoPago.SDK.setAccessToken(accessToken);
Payment payment = new Payment();
payment.save();
```

## Documentacion API

### SpringDoc OpenAPI (Swagger)
```xml
<dependency>
    <groupId>org.springdoc</groupId>
    <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
    <version>2.3.0</version>
</dependency>
```
- **Proposito**: Documentacion automatica de API
- **UI**: Swagger UI integrado
- **URL**: `/swagger-ui/index.html`

**Anotaciones**:
```java
@Operation(summary = "Obtener usuario por ID")
@ApiResponse(responseCode = "200", description = "Usuario encontrado")
@ApiResponse(responseCode = "404", description = "Usuario no encontrado")
@GetMapping("/{id}")
public ResponseEntity<UserDTO> getUser(@PathVariable Long id) {
    // ...
}
```

## Testing

### spring-boot-starter-test
```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-test</artifactId>
    <scope>test</scope>
</dependency>
```
- **Incluye**:
  - JUnit 5
  - Mockito
  - AssertJ
  - Spring Test
  - Hamcrest

**Ejemplo**:
```java
@SpringBootTest
class UserServiceTest {

    @Autowired
    private UserService userService;

    @Test
    void testCreateUser() {
        UserCreateDTO dto = new UserCreateDTO();
        dto.setEmail("test@example.com");

        UserDTO created = userService.createUser(dto);

        assertNotNull(created.getId());
        assertEquals("test@example.com", created.getEmail());
    }
}
```

### H2 Database (Test)
```xml
<dependency>
    <groupId>com.h2database</groupId>
    <artifactId>h2</artifactId>
    <scope>test</scope>
</dependency>
```
- **Proposito**: Base de datos en memoria para tests
- **Ventajas**: Rapido, no requiere instalacion

## Dependencias Adicionales Opcionales

### Jackson Datatype
```xml
<dependency>
    <groupId>com.fasterxml.jackson.datatype</groupId>
    <artifactId>jackson-datatype-jsr310</artifactId>
</dependency>
```
- **Proposito**: Soporte para Java 8 Date/Time API
- **Uso**: Serializacion de LocalDate, LocalDateTime

### Apache Commons Lang
```xml
<dependency>
    <groupId>org.apache.commons</groupId>
    <artifactId>commons-lang3</artifactId>
    <version>3.14.0</version>
</dependency>
```
- **Proposito**: Utilidades para String, Arrays, etc.
- **Funciones**: StringUtils, ArrayUtils, RandomStringUtils

## Arbol de Dependencias

```
crudcloud-backend
├── spring-boot-starter-web
│   ├── spring-webmvc
│   ├── spring-web
│   ├── tomcat-embed-core
│   └── jackson-databind
├── spring-boot-starter-data-jpa
│   ├── hibernate-core
│   ├── spring-data-jpa
│   └── spring-orm
├── spring-boot-starter-security
│   ├── spring-security-web
│   ├── spring-security-config
│   └── spring-security-core
├── postgresql
├── lombok
├── modelmapper
├── jjwt-api
├── mercadopago-sdk
└── springdoc-openapi
```

## Comando para Ver Dependencias

```bash
# Ver todas las dependencias
./mvnw dependency:tree

# Ver solo dependencias de compile
./mvnw dependency:tree -Dscope=compile

# Ver dependencias con conflictos
./mvnw dependency:tree -Dverbose

# Analizar dependencias
./mvnw dependency:analyze
```

## Actualizacion de Dependencias

```bash
# Ver actualizaciones disponibles
./mvnw versions:display-dependency-updates

# Ver plugins desactualizados
./mvnw versions:display-plugin-updates

# Actualizar version de parent
./mvnw versions:update-parent
```

## Gestion de Versiones

### Properties en pom.xml
```xml
<properties>
    <java.version>21</java.version>
    <lombok.version>1.18.30</lombok.version>
    <modelmapper.version>3.2.0</modelmapper.version>
    <jjwt.version>0.12.3</jjwt.version>
    <mercadopago.version>2.1.27</mercadopago.version>
    <springdoc.version>2.3.0</springdoc.version>
</properties>
```

### Dependencia Management
```xml
<dependencyManagement>
    <dependencies>
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-api</artifactId>
            <version>${jjwt.version}</version>
        </dependency>
    </dependencies>
</dependencyManagement>
```

## Seguridad de Dependencias

### Escanear Vulnerabilidades

```bash
# Usar OWASP Dependency Check
./mvnw dependency-check:check

# Ver reporte
open target/dependency-check-report.html
```

### Actualizar Dependencias Vulnerables

```bash
# Actualizar todas las dependencias
./mvnw versions:use-latest-versions
```

## Proximos Pasos

- Lee sobre [Guia de Desarrollo](/docs/03-desarrollo/guia-desarrollo)
- Aprende las [Convenciones del Proyecto](/docs/03-desarrollo/convenciones)
- Revisa la [API Reference](/docs/04-api/autenticacion)
