---
sidebar_position: 3
title: Configuracion
---

# Configuracion del Proyecto

Esta guia explica como configurar CrudCloud Backend para diferentes entornos y como personalizar la configuracion segun tus necesidades.

## Perfiles de Spring Boot

CrudCloud Backend utiliza perfiles de Spring Boot para gestionar configuraciones especificas de cada entorno:

- **default**: Configuracion basica
- **dev**: Desarrollo local
- **test**: Pruebas automatizadas
- **prod**: Produccion

### Activar un Perfil

```bash
# Via linea de comandos
./mvnw spring-boot:run -Dspring-boot.run.profiles=dev

# Via variable de entorno
export SPRING_PROFILES_ACTIVE=dev
./mvnw spring-boot:run

# Via application.properties
# spring.profiles.active=dev
```

## Configuracion de Base de Datos

### Desarrollo (application-dev.properties)

```properties
# PostgreSQL Connection
spring.datasource.url=jdbc:postgresql://localhost:5432/crudcloud_db
spring.datasource.username=crudcloud_user
spring.datasource.password=dev_password_123

# Hibernate Configuration
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect

# Connection Pool (HikariCP)
spring.datasource.hikari.maximum-pool-size=10
spring.datasource.hikari.minimum-idle=5
spring.datasource.hikari.connection-timeout=30000
```

### Produccion (application-prod.properties)

```properties
# PostgreSQL Connection (usar variables de entorno)
spring.datasource.url=${DATABASE_URL}
spring.datasource.username=${DATABASE_USERNAME}
spring.datasource.password=${DATABASE_PASSWORD}

# Hibernate Configuration
spring.jpa.hibernate.ddl-auto=validate
spring.jpa.show-sql=false
spring.jpa.properties.hibernate.format_sql=false

# Connection Pool
spring.datasource.hikari.maximum-pool-size=20
spring.datasource.hikari.minimum-idle=10
spring.datasource.hikari.connection-timeout=30000
spring.datasource.hikari.idle-timeout=600000
spring.datasource.hikari.max-lifetime=1800000
```

## Configuracion de JWT

### Propiedades JWT

```properties
# JWT Secret Key (256 bits minimo)
jwt.secret=${JWT_SECRET:clave_por_defecto_solo_desarrollo_cambiar_en_produccion}

# Token Expiration (en milisegundos)
jwt.expiration=86400000
# 86400000ms = 24 horas
# 3600000ms = 1 hora

# Refresh Token Expiration
jwt.refresh.expiration=604800000
# 604800000ms = 7 dias
```

### Generar Clave Secreta Segura

```bash
# Generar clave aleatoria de 256 bits
openssl rand -base64 32

# O usando Java
# java -cp . -c "System.out.println(java.util.Base64.getEncoder().encodeToString(new byte[32]));"
```

**IMPORTANTE**: Nunca subas la clave secreta al repositorio. Usa variables de entorno en produccion.

## Configuracion de Mercado Pago

### Credenciales de Prueba (Desarrollo)

```properties
# Mercado Pago Test Credentials
mercadopago.access.token=${MERCADOPAGO_ACCESS_TOKEN:TEST-1234567890-012345-abcdef1234567890abcdef1234567890-123456789}
mercadopago.public.key=${MERCADOPAGO_PUBLIC_KEY:TEST-abcd1234-ef56-7890-abcd-ef1234567890}

# Modo de operacion
mercadopago.mode=sandbox
```

### Obtener Credenciales de Prueba

1. Inicia sesion en [Mercado Pago Developers](https://www.mercadopago.com.co/developers)
2. Ve a "Tus integraciones" > "Credenciales de prueba"
3. Copia el `Access Token` y `Public Key`

### Credenciales de Produccion

```properties
# Mercado Pago Production Credentials
mercadopago.access.token=${MERCADOPAGO_ACCESS_TOKEN}
mercadopago.public.key=${MERCADOPAGO_PUBLIC_KEY}
mercadopago.mode=production
```

## Configuracion del Servidor

### Puertos y Context Path

```properties
# Server Port
server.port=${PORT:8080}

# Context Path
server.servlet.context-path=/api

# Session Timeout
server.servlet.session.timeout=30m

# Compression
server.compression.enabled=true
server.compression.mime-types=application/json,application/xml,text/html,text/xml,text/plain
```

### CORS Configuration

Edita `WebConfig.java` o crea un archivo de configuracion:

```java
@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("http://localhost:3000", "https://yourdomain.com")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true)
                .maxAge(3600);
    }
}
```

## Configuracion de Logging

### Niveles de Log

```properties
# Root Logger
logging.level.root=INFO

# Application Logs
logging.level.com.crudcloud.backend=DEBUG

# Spring Framework
logging.level.org.springframework.web=INFO
logging.level.org.springframework.security=DEBUG

# Hibernate/JPA
logging.level.org.hibernate.SQL=DEBUG
logging.level.org.hibernate.type.descriptor.sql.BasicBinder=TRACE

# Log File
logging.file.name=logs/crudcloud-backend.log
logging.file.max-size=10MB
logging.file.max-history=30

# Log Pattern
logging.pattern.console=%d{yyyy-MM-dd HH:mm:ss} - %logger{36} - %msg%n
logging.pattern.file=%d{yyyy-MM-dd HH:mm:ss} [%thread] %-5level %logger{36} - %msg%n
```

### Configuracion Avanzada con Logback

Crea `src/main/resources/logback-spring.xml`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
    <include resource="org/springframework/boot/logging/logback/defaults.xml"/>

    <appender name="CONSOLE" class="ch.qos.logback.core.ConsoleAppender">
        <encoder>
            <pattern>%d{yyyy-MM-dd HH:mm:ss} [%thread] %-5level %logger{36} - %msg%n</pattern>
        </encoder>
    </appender>

    <appender name="FILE" class="ch.qos.logback.core.rolling.RollingFileAppender">
        <file>logs/crudcloud-backend.log</file>
        <encoder>
            <pattern>%d{yyyy-MM-dd HH:mm:ss} [%thread] %-5level %logger{36} - %msg%n</pattern>
        </encoder>
        <rollingPolicy class="ch.qos.logback.core.rolling.TimeBasedRollingPolicy">
            <fileNamePattern>logs/crudcloud-backend.%d{yyyy-MM-dd}.log</fileNamePattern>
            <maxHistory>30</maxHistory>
        </rollingPolicy>
    </appender>

    <root level="INFO">
        <appender-ref ref="CONSOLE"/>
        <appender-ref ref="FILE"/>
    </root>

    <logger name="com.crudcloud.backend" level="DEBUG"/>
</configuration>
```

## Configuracion de Validacion

```properties
# Validation Messages (i18n)
spring.messages.basename=messages
spring.messages.encoding=UTF-8

# Bean Validation
spring.validation.enabled=true
```

## Configuracion de Actuator (Monitoring)

```properties
# Actuator Endpoints
management.endpoints.web.exposure.include=health,info,metrics,prometheus
management.endpoints.web.base-path=/actuator
management.endpoint.health.show-details=when-authorized

# Health Check
management.health.db.enabled=true
management.health.diskspace.enabled=true

# Info Endpoint
info.app.name=CrudCloud Backend
info.app.version=@project.version@
info.app.description=@project.description@
```

## Configuracion de Swagger/OpenAPI

```properties
# Swagger Configuration
springdoc.api-docs.path=/api-docs
springdoc.swagger-ui.path=/swagger-ui.html
springdoc.swagger-ui.enabled=true
springdoc.swagger-ui.operations-sorter=method
springdoc.swagger-ui.tags-sorter=alpha

# API Info
springdoc.info.title=CrudCloud Backend API
springdoc.info.version=1.0.0
springdoc.info.description=API RESTful para CrudCloud Backend
```

## Variables de Entorno (Resumen)

### Obligatorias

```bash
# Base de Datos
DATABASE_URL=jdbc:postgresql://localhost:5432/crudcloud_db
DATABASE_USERNAME=crudcloud_user
DATABASE_PASSWORD=secure_password

# JWT
JWT_SECRET=clave_secreta_256_bits_minimo

# Mercado Pago
MERCADOPAGO_ACCESS_TOKEN=tu_access_token
MERCADOPAGO_PUBLIC_KEY=tu_public_key
```

### Opcionales

```bash
# Server
PORT=8080
SPRING_PROFILES_ACTIVE=dev

# Logging
LOGGING_LEVEL_ROOT=INFO
LOGGING_LEVEL_APP=DEBUG
```

## Archivo .env de Ejemplo

Crea `.env` en la raiz del proyecto:

```bash
# ===========================================
# DATABASE CONFIGURATION
# ===========================================
DATABASE_URL=jdbc:postgresql://localhost:5432/crudcloud_db
DATABASE_USERNAME=crudcloud_user
DATABASE_PASSWORD=dev_password_123

# ===========================================
# JWT CONFIGURATION
# ===========================================
JWT_SECRET=clave_super_secreta_para_desarrollo_cambiar_en_produccion
JWT_EXPIRATION=86400000

# ===========================================
# MERCADO PAGO CONFIGURATION
# ===========================================
MERCADOPAGO_ACCESS_TOKEN=TEST-1234567890-012345-abcdef1234567890abcdef1234567890-123456789
MERCADOPAGO_PUBLIC_KEY=TEST-abcd1234-ef56-7890-abcd-ef1234567890

# ===========================================
# SERVER CONFIGURATION
# ===========================================
PORT=8080
SPRING_PROFILES_ACTIVE=dev

# ===========================================
# LOGGING
# ===========================================
LOGGING_LEVEL_ROOT=INFO
LOGGING_LEVEL_APP=DEBUG
```

**IMPORTANTE**: Añade `.env` al `.gitignore`:

```bash
echo ".env" >> .gitignore
```

## Verificar Configuracion

### Script de Validacion

```bash
#!/bin/bash
echo "=== Verificando Configuracion ==="

# Verificar variables de entorno
echo "DATABASE_URL: ${DATABASE_URL:-NOT SET}"
echo "JWT_SECRET: ${JWT_SECRET:-NOT SET}"
echo "MERCADOPAGO_ACCESS_TOKEN: ${MERCADOPAGO_ACCESS_TOKEN:-NOT SET}"

# Verificar archivos de configuracion
if [ -f "src/main/resources/application-dev.properties" ]; then
    echo "✓ application-dev.properties existe"
else
    echo "✗ application-dev.properties NO existe"
fi

# Verificar conexion a base de datos
psql -h localhost -U crudcloud_user -d crudcloud_db -c "SELECT 1;" > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "✓ Conexion a base de datos exitosa"
else
    echo "✗ No se puede conectar a la base de datos"
fi
```

## Troubleshooting de Configuracion

### Error: No se encuentra application.properties

**Solucion**: Verifica que el archivo este en `src/main/resources/application.properties`

### Error: Variables de entorno no reconocidas

**Solucion**:
- Reinicia el IDE
- Verifica la sintaxis: `${VARIABLE:valor_por_defecto}`
- Usa `mvn spring-boot:run` en lugar del IDE

### Error: JWT Secret muy corto

**Solucion**: La clave JWT debe tener al menos 256 bits (32 caracteres en base64)

## Proximos Pasos

Con la configuracion completada, estas listo para tu [Primer Run](/docs/01-guia-inicio/primer-run) de la aplicacion.
