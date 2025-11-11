---
sidebar_position: 3
title: Configuración
---

# Configuración del Proyecto

Esta guía explica cómo configurar CrudCloud Backend para diferentes entornos, incluyendo la configuración de bases de datos en CleverCloud (pruebas) y VPS (producción).

## Perfiles de Spring Boot

CrudCloud Backend utiliza perfiles de Spring Boot para gestionar configuraciones específicas de cada entorno:

- **default**: Configuración básica local
- **dev**: Desarrollo local con PostgreSQL local
- **test**: Pruebas automatizadas con base de datos CleverCloud
- **prod**: Producción en VPS con SSH

### Activar un Perfil

```bash
# Vía línea de comandos
./mvnw spring-boot:run -Dspring-boot.run.profiles=prod

# Vía variable de entorno
export SPRING_PROFILES_ACTIVE=prod
./mvnw spring-boot:run

# Vía application.properties
# spring.profiles.active=prod
```

## Configuración de Base de Datos

CrudCloud utiliza PostgreSQL para almacenar la **metadata del sistema** (usuarios, planes, suscripciones, instancias). Las bases de datos de los clientes se gestionan en contenedores Docker separados.

### Entorno de Pruebas - CleverCloud (PostgreSQL 15)

**Base de datos de metadata alojada en CleverCloud**

Configuración en `application-test.properties`:

```properties
# PostgreSQL CleverCloud Connection
spring.datasource.url=jdbc:postgresql://bsynuybdaaahq5cfinjv-postgresql.services.clever-cloud.com:5432/bsynuybdaaahq5cfinjv
spring.datasource.username=usok8mpbqivjrvbagktt
spring.datasource.password=RCINBL4b2b8L9s7lAqMGiBCTOezpHT
spring.datasource.driver-class-name=org.postgresql.Driver

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

**Variables de entorno CleverCloud**:

```bash
# Completas (proporcionadas por CleverCloud)
POSTGRESQL_ADDON_DB=bsynuybdaaahq5cfinjv
POSTGRESQL_ADDON_HOST=bsynuybdaaahq5cfinjv-postgresql.services.clever-cloud.com
POSTGRESQL_ADDON_PASSWORD=RCINBL4b2b8L9s7lAqMGiBCTOezpHT
POSTGRESQL_ADDON_PORT=5432
POSTGRESQL_ADDON_URI=postgresql://usok8mpbqivjrvbagktt:RCINBL4b2b8L9s7lAqMGiBCTOezpHT@bsynuybdaaahq5cfinjv-postgresql.services.clever-cloud.com:5432/bsynuybdaaahq5cfinjv
POSTGRESQL_ADDON_USER=usok8mpbqivjrvbagktt
POSTGRESQL_ADDON_VERSION=15
```

**Conectarse manualmente a CleverCloud**:

```bash
# Usando psql
psql postgresql://usok8mpbqivjrvbagktt:RCINBL4b2b8L9s7lAqMGiBCTOezpHT@bsynuybdaaahq5cfinjv-postgresql.services.clever-cloud.com:5432/bsynuybdaaahq5cfinjv

# Verificar conexión
SELECT version();
```

### Entorno de Producción - VPS (91.98.225.17)

**Servidor VPS con Docker instalado**

Configuración en `application-prod.properties`:

```properties
# PostgreSQL VPS Connection (usar variables de entorno)
spring.datasource.url=${DATABASE_URL:jdbc:postgresql://localhost:5432/crudcloud_prod}
spring.datasource.username=${DATABASE_USERNAME:crudcloud_user}
spring.datasource.password=${DATABASE_PASSWORD}
spring.datasource.driver-class-name=org.postgresql.Driver

# Hibernate Configuration
spring.jpa.hibernate.ddl-auto=validate
spring.jpa.show-sql=false
spring.jpa.properties.hibernate.format_sql=false
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect

# Connection Pool
spring.datasource.hikari.maximum-pool-size=20
spring.datasource.hikari.minimum-idle=10
spring.datasource.hikari.connection-timeout=30000
spring.datasource.hikari.idle-timeout=600000
spring.datasource.hikari.max-lifetime=1800000

# Docker Configuration
docker.host=unix:///var/run/docker.sock
docker.tls.verify=false
```

**Acceso SSH al VPS**:

```bash
# Conectarse al servidor
ssh root@91.98.225.17
# Password: javamochapm-3306

# Verificar Docker instalado
docker --version
docker ps

# Verificar PostgreSQL metadata
sudo -u postgres psql -d crudcloud_prod -c "SELECT COUNT(*) FROM users;"
```

**Configurar PostgreSQL en el VPS**:

```bash
# 1. Instalar PostgreSQL (si no está instalado)
sudo apt update
sudo apt install postgresql postgresql-contrib -y

# 2. Crear base de datos de metadata
sudo -u postgres psql
CREATE DATABASE crudcloud_prod;
CREATE USER crudcloud_user WITH ENCRYPTED PASSWORD 'CHANGE_THIS_PASSWORD';
GRANT ALL PRIVILEGES ON DATABASE crudcloud_prod TO crudcloud_user;
\q

# 3. Configurar acceso remoto (opcional)
sudo nano /etc/postgresql/15/main/postgresql.conf
# Descomentar: listen_addresses = '*'

sudo nano /etc/postgresql/15/main/pg_hba.conf
# Agregar: host all all 0.0.0.0/0 md5

sudo systemctl restart postgresql
```

### Desarrollo Local (application-dev.properties)

```properties
# PostgreSQL Local Connection
spring.datasource.url=jdbc:postgresql://localhost:5432/crudcloud_dev
spring.datasource.username=crudcloud_user
spring.datasource.password=dev_password_123
spring.datasource.driver-class-name=org.postgresql.Driver

# Hibernate Configuration
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect

# Connection Pool (HikariCP)
spring.datasource.hikari.maximum-pool-size=10
spring.datasource.hikari.minimum-idle=5
spring.datasource.hikari.connection-timeout=30000

# Docker Local
docker.host=unix:///var/run/docker.sock
```

**Configurar PostgreSQL local**:

```bash
# 1. Instalar PostgreSQL 15+
# Ubuntu/Debian
sudo apt install postgresql postgresql-contrib

# macOS
brew install postgresql@15
brew services start postgresql@15

# 2. Crear base de datos
sudo -u postgres psql
CREATE DATABASE crudcloud_dev;
CREATE USER crudcloud_user WITH ENCRYPTED PASSWORD 'dev_password_123';
GRANT ALL PRIVILEGES ON DATABASE crudcloud_dev TO crudcloud_user;
\q

# 3. Ejecutar schema SQL
psql -U crudcloud_user -d crudcloud_dev -f md/SCHEMA_CRUDCLOUD_POSTGRESQL.sql
```

## Configuración de Docker

CrudCloud utiliza docker-java para crear y gestionar contenedores de bases de datos de clientes.

### Configuración Docker Local

```properties
# Docker Configuration
docker.host=unix:///var/run/docker.sock
docker.tls.verify=false
docker.cert.path=

# Docker Image Registry
docker.registry.url=https://registry-1.docker.io
```

### Verificar Docker

```bash
# Verificar Docker daemon
docker info

# Verificar socket accesible
ls -la /var/run/docker.sock

# Probar creación de contenedor
docker run --rm -d --name test-mysql \
  -e MYSQL_ROOT_PASSWORD=test123 \
  -p 3307:3306 \
  mysql:latest

# Verificar
docker ps | grep test-mysql

# Eliminar
docker stop test-mysql
```

## Configuración de JWT

### Propiedades JWT

```properties
# JWT Secret Key (256 bits mínimo - 32 caracteres base64)
jwt.secret=${JWT_SECRET:CHANGE_THIS_SECRET_KEY_MINIMUM_256_BITS_FOR_PRODUCTION}

# Token Expiration (en milisegundos)
jwt.expiration=${JWT_EXPIRATION:86400000}
# 86400000ms = 24 horas (default)
# 3600000ms = 1 hora
# 604800000ms = 7 días
```

### Generar Clave Secreta Segura

```bash
# Generar clave aleatoria de 256 bits (32 bytes)
openssl rand -base64 32

# Ejemplo de salida:
# K7pQ5mX9nV2bR8tA6wD3fG1hJ4kL7oP0

# Para producción, guarda esto en variables de entorno
export JWT_SECRET="K7pQ5mX9nV2bR8tA6wD3fG1hJ4kL7oP0"
```

**IMPORTANTE**:
- ⚠️ **Nunca subas la clave secreta al repositorio**
- ✅ Usa variables de entorno en producción
- ✅ Rotación de claves cada 90 días recomendada

## Configuración de Mercado Pago

### Credenciales de Prueba (Desarrollo)

```properties
# Mercado Pago Test Credentials
mercadopago.access.token=${MERCADOPAGO_ACCESS_TOKEN:TEST-1234567890-012345-abcdef1234567890abcdef1234567890-123456789}
mercadopago.public.key=${MERCADOPAGO_PUBLIC_KEY:TEST-abcd1234-ef56-7890-abcd-ef1234567890}

# Modo de operación
mercadopago.mode=sandbox
```

### Obtener Credenciales de Prueba

1. Inicia sesión en [Mercado Pago Developers](https://www.mercadopago.com.co/developers)
2. Ve a **"Tus integraciones"** > **"Credenciales de prueba"**
3. Copia el `Access Token` y `Public Key`
4. Guarda en variables de entorno

### Credenciales de Producción

```properties
# Mercado Pago Production Credentials
mercadopago.access.token=${MERCADOPAGO_ACCESS_TOKEN}
mercadopago.public.key=${MERCADOPAGO_PUBLIC_KEY}
mercadopago.mode=production
```

## Configuración del Servidor

### Puertos y Context Path

```properties
# Server Port
server.port=${PORT:8080}

# Context Path (opcional)
# server.servlet.context-path=/api

# Session Timeout
server.servlet.session.timeout=30m

# Compression
server.compression.enabled=true
server.compression.mime-types=application/json,application/xml,text/html,text/xml,text/plain
server.compression.min-response-size=1024
```

### CORS Configuration

Configuración para permitir requests desde el frontend:

```properties
# CORS Allowed Origins
cors.allowed.origins=http://localhost:3000,http://localhost:5173,https://crudcloud.app
cors.allowed.methods=GET,POST,PUT,DELETE,PATCH,OPTIONS
cors.allowed.headers=*
cors.allow.credentials=true
cors.max.age=3600
```

O configurar mediante código en `config/CorsConfig.java`:

```java
@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Value("${cors.allowed.origins}")
    private String[] allowedOrigins;

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins(allowedOrigins)
                .allowedMethods("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true)
                .maxAge(3600);
    }
}
```

## Configuración de Logging

### Niveles de Log por Entorno

**Desarrollo** (`application-dev.properties`):
```properties
# Root Logger
logging.level.root=INFO

# Application Logs
logging.level.com.crudzaso.CrudCloud=DEBUG

# Spring Framework
logging.level.org.springframework.web=DEBUG
logging.level.org.springframework.security=DEBUG

# Hibernate/JPA
logging.level.org.hibernate.SQL=DEBUG
logging.level.org.hibernate.type.descriptor.sql.BasicBinder=TRACE

# Docker Java
logging.level.com.github.dockerjava=DEBUG

# Log to Console
logging.pattern.console=%d{yyyy-MM-dd HH:mm:ss} - %logger{36} - %msg%n
```

**Producción** (`application-prod.properties`):
```properties
# Root Logger
logging.level.root=WARN

# Application Logs
logging.level.com.crudzaso.CrudCloud=INFO

# Spring Framework
logging.level.org.springframework.web=INFO
logging.level.org.springframework.security=INFO

# Hibernate/JPA
logging.level.org.hibernate.SQL=WARN

# Log File
logging.file.name=/var/log/crudcloud/crudcloud-backend.log
logging.file.max-size=10MB
logging.file.max-history=30
logging.file.total-size-cap=1GB

# Log Pattern
logging.pattern.file=%d{yyyy-MM-dd HH:mm:ss} [%thread] %-5level %logger{36} - %msg%n
```

## Variables de Entorno (Resumen)

### Obligatorias para Producción

```bash
# ===================================
# BASE DE DATOS (Metadata PostgreSQL)
# ===================================
DATABASE_URL=jdbc:postgresql://localhost:5432/crudcloud_prod
DATABASE_USERNAME=crudcloud_user
DATABASE_PASSWORD=SECURE_PASSWORD_CHANGE_THIS

# ===================================
# JWT (Autenticación)
# ===================================
JWT_SECRET=GENERATE_WITH_openssl_rand_base64_32
JWT_EXPIRATION=86400000

# ===================================
# MERCADO PAGO (Pagos)
# ===================================
MERCADOPAGO_ACCESS_TOKEN=APP_USR-1234567890123456-012345-abcdef1234567890abcdef1234567890-123456789
MERCADOPAGO_PUBLIC_KEY=APP_USR-abcd1234-ef56-7890-abcd-ef1234567890

# ===================================
# DOCKER (Orquestación)
# ===================================
DOCKER_HOST=unix:///var/run/docker.sock
DOCKER_TLS_VERIFY=false
```

### Opcionales

```bash
# Server
PORT=8080
SPRING_PROFILES_ACTIVE=prod

# Logging
LOGGING_LEVEL_ROOT=INFO
LOGGING_LEVEL_APP=DEBUG
```

## Archivo .env de Ejemplo

Crea `.env` en la raíz del proyecto `Crudcloud_Backend/CrudCloud/`:

```bash
# ===========================================
# CRUDCLOUD BACKEND - ENVIRONMENT VARIABLES
# ===========================================

# -------------------------------------------
# DATABASE CONFIGURATION (Metadata)
# -------------------------------------------
# Local Development
DATABASE_URL=jdbc:postgresql://localhost:5432/crudcloud_dev
DATABASE_USERNAME=crudcloud_user
DATABASE_PASSWORD=dev_password_123

# CleverCloud Test (comentar si usas local)
# DATABASE_URL=jdbc:postgresql://bsynuybdaaahq5cfinjv-postgresql.services.clever-cloud.com:5432/bsynuybdaaahq5cfinjv
# DATABASE_USERNAME=usok8mpbqivjrvbagktt
# DATABASE_PASSWORD=RCINBL4b2b8L9s7lAqMGiBCTOezpHT

# -------------------------------------------
# JWT CONFIGURATION
# -------------------------------------------
JWT_SECRET=dev_secret_key_only_for_local_development_change_in_production
JWT_EXPIRATION=86400000

# -------------------------------------------
# MERCADO PAGO CONFIGURATION
# -------------------------------------------
MERCADOPAGO_ACCESS_TOKEN=TEST-1234567890-012345-abcdef1234567890abcdef1234567890-123456789
MERCADOPAGO_PUBLIC_KEY=TEST-abcd1234-ef56-7890-abcd-ef1234567890

# -------------------------------------------
# DOCKER CONFIGURATION
# -------------------------------------------
DOCKER_HOST=unix:///var/run/docker.sock
DOCKER_TLS_VERIFY=false

# -------------------------------------------
# SERVER CONFIGURATION
# -------------------------------------------
PORT=8080
SPRING_PROFILES_ACTIVE=dev

# -------------------------------------------
# LOGGING
# -------------------------------------------
LOGGING_LEVEL_ROOT=INFO
LOGGING_LEVEL_APP=DEBUG
```

**IMPORTANTE**: Añade `.env` al `.gitignore`:

```bash
echo ".env" >> .gitignore
git add .gitignore
git commit -m "Add .env to gitignore"
```

## Despliegue en VPS (Producción)

### 1. Conectarse al VPS

```bash
# SSH al servidor de producción
ssh root@91.98.225.17
# Password: javamochapm-3306
```

### 2. Configurar Variables de Entorno en el VPS

```bash
# Crear archivo de configuración
sudo nano /etc/environment

# Agregar variables (ejemplo):
DATABASE_URL=jdbc:postgresql://localhost:5432/crudcloud_prod
DATABASE_USERNAME=crudcloud_user
DATABASE_PASSWORD=STRONG_PASSWORD_HERE
JWT_SECRET=GENERATED_SECRET_KEY_32_CHARS
MERCADOPAGO_ACCESS_TOKEN=PROD_ACCESS_TOKEN
DOCKER_HOST=unix:///var/run/docker.sock
SPRING_PROFILES_ACTIVE=prod

# Recargar
source /etc/environment
```

### 3. Desplegar Aplicación

```bash
# Copiar JAR al servidor
scp target/CrudCloud-1.0.0-SNAPSHOT.jar root@91.98.225.17:/opt/crudcloud/

# En el servidor, ejecutar
cd /opt/crudcloud
java -jar CrudCloud-1.0.0-SNAPSHOT.jar --spring.profiles.active=prod
```

### 4. Crear Servicio Systemd (Opcional)

```bash
# Crear servicio
sudo nano /etc/systemd/system/crudcloud.service

# Contenido:
[Unit]
Description=CrudCloud Backend
After=syslog.target network.target postgresql.service docker.service

[Service]
User=root
ExecStart=/usr/bin/java -jar /opt/crudcloud/CrudCloud-1.0.0-SNAPSHOT.jar --spring.profiles.active=prod
SuccessExitStatus=143
EnvironmentFile=/etc/environment
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target

# Habilitar y ejecutar
sudo systemctl daemon-reload
sudo systemctl enable crudcloud
sudo systemctl start crudcloud
sudo systemctl status crudcloud
```

## Verificar Configuración

### Script de Validación

```bash
#!/bin/bash
echo "=== Verificando Configuración CrudCloud ==="

# Verificar variables de entorno obligatorias
required_vars=("DATABASE_URL" "DATABASE_USERNAME" "DATABASE_PASSWORD" "JWT_SECRET")

for var in "${required_vars[@]}"; do
    if [ -z "${!var}" ]; then
        echo "✗ $var: NO CONFIGURADA"
    else
        echo "✓ $var: CONFIGURADA"
    fi
done

# Verificar archivos de configuración
if [ -f "src/main/resources/application.properties" ]; then
    echo "✓ application.properties existe"
else
    echo "✗ application.properties NO existe"
fi

# Verificar Docker
if command -v docker &> /dev/null; then
    echo "✓ Docker instalado: $(docker --version)"
    docker ps &> /dev/null && echo "✓ Docker daemon running" || echo "✗ Docker daemon NO running"
else
    echo "✗ Docker NO instalado"
fi

# Verificar PostgreSQL
if command -v psql &> /dev/null; then
    echo "✓ PostgreSQL CLI instalado"
else
    echo "✗ PostgreSQL CLI NO instalado"
fi
```

## Troubleshooting Común

### Error: No se puede conectar a CleverCloud PostgreSQL

**Síntomas**: `Connection refused` o `Could not connect to server`

**Solución**:
1. Verificar credenciales en CleverCloud dashboard
2. Verificar firewall local permite conexiones salientes al puerto 5432
3. Probar conexión manual:
   ```bash
   psql postgresql://usok8mpbqivjrvbagktt:RCINBL4b2b8L9s7lAqMGiBCTOezpHT@bsynuybdaaahq5cfinjv-postgresql.services.clever-cloud.com:5432/bsynuybdaaahq5cfinjv
   ```

### Error: Docker socket permission denied

**Síntomas**: `Permission denied while trying to connect to the Docker daemon socket`

**Solución**:
```bash
# Agregar usuario al grupo docker
sudo usermod -aG docker $USER

# Recargar grupos
newgrp docker

# O dar permisos al socket (temporal)
sudo chmod 666 /var/run/docker.sock
```

### Error: JWT Secret muy corto

**Síntomas**: `Weak key exception` o `Key length must be at least 256 bits`

**Solución**:
```bash
# Generar clave de 256 bits (32 bytes)
openssl rand -base64 32

# Configurar en variables de entorno
export JWT_SECRET="resultado_del_comando_anterior"
```

### Error: Variables de entorno no reconocidas

**Síntomas**: Spring usa valores default en lugar de variables

**Solución**:
- Verificar sintaxis: `${VARIABLE:default_value}`
- Reiniciar IDE/terminal
- Ejecutar con: `mvn spring-boot:run` en lugar del IDE
- Verificar: `echo $JWT_SECRET` para confirmar que está configurada

## Próximos Pasos

Con la configuración completada, estás listo para tu [Primer Run](/docs/guia-inicio/primer-run) de la aplicación.
