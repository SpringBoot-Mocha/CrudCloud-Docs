---
sidebar_position: 2
title: Instalacion
---

# Instalacion de CrudCloud Backend

Esta guia te llevara paso a paso por el proceso de instalacion y configuracion inicial de CrudCloud Backend en tu entorno de desarrollo local.

## Paso 1: Clonar el Repositorio

```bash
# Clonar el repositorio desde GitHub
git clone https://github.com/CrudCloud/backend.git

# Navegar al directorio del proyecto
cd backend

# Verificar que estas en la rama correcta
git branch
# Deberia mostrar: * main o * develop
```

### Estructura del Proyecto

Despues de clonar, deberas ver la siguiente estructura:

```
backend/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/crudcloud/backend/
│   │   └── resources/
│   │       ├── application.properties
│   │       └── application-dev.properties
│   └── test/
├── pom.xml
├── mvnw
├── mvnw.cmd
├── .gitignore
└── README.md
```

## Paso 2: Configurar PostgreSQL

### Opcion A: Instalacion Local

#### 1. Crear Base de Datos

```sql
-- Conectarse a PostgreSQL
psql -U postgres

-- Crear la base de datos
CREATE DATABASE crudcloud_db
    WITH
    ENCODING = 'UTF8'
    LC_COLLATE = 'es_ES.UTF-8'
    LC_CTYPE = 'es_ES.UTF-8'
    TEMPLATE = template0;

-- Crear usuario (opcional para desarrollo)
CREATE USER crudcloud_user WITH ENCRYPTED PASSWORD 'dev_password_123';
GRANT ALL PRIVILEGES ON DATABASE crudcloud_db TO crudcloud_user;

-- Salir de psql
\q
```

#### 2. Verificar Conexion

```bash
# Probar conexion
psql -U crudcloud_user -d crudcloud_db -h localhost
# Si se conecta exitosamente, presiona \q para salir
```

### Opcion B: Docker (Recomendado para Desarrollo)

#### 1. Crear archivo `docker-compose.yml`

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:16-alpine
    container_name: crudcloud-postgres
    environment:
      POSTGRES_DB: crudcloud_db
      POSTGRES_USER: crudcloud_user
      POSTGRES_PASSWORD: dev_password_123
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - crudcloud-network

volumes:
  postgres_data:

networks:
  crudcloud-network:
    driver: bridge
```

#### 2. Iniciar PostgreSQL con Docker

```bash
# Iniciar contenedor en segundo plano
docker-compose up -d

# Verificar que esta corriendo
docker ps

# Ver logs
docker-compose logs -f postgres
```

#### 3. Verificar Conexion

```bash
# Conectarse al contenedor
docker exec -it crudcloud-postgres psql -U crudcloud_user -d crudcloud_db

# O desde tu maquina host
psql -h localhost -U crudcloud_user -d crudcloud_db
```

## Paso 3: Configurar Variables de Entorno

### Opcion A: Archivo application-dev.properties

Crea o edita el archivo `src/main/resources/application-dev.properties`:

```properties
# ============================================
# DATABASE CONFIGURATION
# ============================================
spring.datasource.url=jdbc:postgresql://localhost:5432/crudcloud_db
spring.datasource.username=crudcloud_user
spring.datasource.password=dev_password_123
spring.datasource.driver-class-name=org.postgresql.Driver

# JPA / Hibernate
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect

# ============================================
# JWT CONFIGURATION
# ============================================
jwt.secret=tu_clave_secreta_super_segura_de_al_menos_256_bits_para_desarrollo
jwt.expiration=86400000

# ============================================
# MERCADO PAGO CONFIGURATION
# ============================================
mercadopago.access.token=TEST-1234567890-012345-abcdef1234567890abcdef1234567890-123456789
mercadopago.public.key=TEST-abcd1234-ef56-7890-abcd-ef1234567890

# ============================================
# SERVER CONFIGURATION
# ============================================
server.port=8080
server.servlet.context-path=/api

# ============================================
# LOGGING
# ============================================
logging.level.com.crudcloud.backend=DEBUG
logging.level.org.springframework.web=INFO
logging.level.org.hibernate=INFO
```

### Opcion B: Variables de Entorno del Sistema

```bash
# Linux/macOS
export DATABASE_URL=jdbc:postgresql://localhost:5432/crudcloud_db
export DATABASE_USERNAME=crudcloud_user
export DATABASE_PASSWORD=dev_password_123
export JWT_SECRET=tu_clave_secreta_super_segura_de_al_menos_256_bits_para_desarrollo
export MERCADOPAGO_ACCESS_TOKEN=TEST-1234567890-012345-abcdef1234567890abcdef1234567890-123456789
export MERCADOPAGO_PUBLIC_KEY=TEST-abcd1234-ef56-7890-abcd-ef1234567890

# Windows (PowerShell)
$env:DATABASE_URL="jdbc:postgresql://localhost:5432/crudcloud_db"
$env:DATABASE_USERNAME="crudcloud_user"
$env:DATABASE_PASSWORD="dev_password_123"
# ... resto de variables
```

### Opcion C: Archivo .env (con Spring Boot 3.x)

Crea un archivo `.env` en la raiz del proyecto:

```bash
# .env file
DATABASE_URL=jdbc:postgresql://localhost:5432/crudcloud_db
DATABASE_USERNAME=crudcloud_user
DATABASE_PASSWORD=dev_password_123
JWT_SECRET=tu_clave_secreta_super_segura_de_al_menos_256_bits_para_desarrollo
MERCADOPAGO_ACCESS_TOKEN=TEST-1234567890-012345-abcdef1234567890abcdef1234567890-123456789
MERCADOPAGO_PUBLIC_KEY=TEST-abcd1234-ef56-7890-abcd-ef1234567890
```

**IMPORTANTE**: Añade `.env` a tu `.gitignore` para no subir credenciales al repositorio.

## Paso 4: Instalar Dependencias

```bash
# Usando Maven wrapper (recomendado)
./mvnw clean install

# O si tienes Maven instalado globalmente
mvn clean install

# Saltar tests durante instalacion inicial (opcional)
./mvnw clean install -DskipTests
```

Este comando:
- Descargara todas las dependencias definidas en `pom.xml`
- Compilara el codigo fuente
- Ejecutara los tests (si no usaste `-DskipTests`)
- Generara el archivo JAR en `target/`

### Solucion de Problemas Comunes

#### Error: "No se puede descargar dependencias"

```bash
# Limpiar cache de Maven
./mvnw dependency:purge-local-repository

# Forzar actualizacion
./mvnw clean install -U
```

#### Error: "Lombok no funciona"

- En IntelliJ IDEA: Instala el plugin "Lombok"
- En Eclipse: Instala Lombok desde [projectlombok.org](https://projectlombok.org/)
- En VS Code: Instala la extension "Lombok Annotations Support"

## Paso 5: Ejecutar la Aplicacion

### Opcion A: Usando Maven

```bash
# Ejecutar con perfil dev
./mvnw spring-boot:run -Dspring-boot.run.profiles=dev

# O simplemente
./mvnw spring-boot:run
```

### Opcion B: Usando el IDE

#### IntelliJ IDEA

1. Abre el proyecto en IntelliJ IDEA
2. Espera a que el IDE indexe el proyecto
3. Busca la clase principal (anotada con `@SpringBootApplication`)
4. Click derecho > "Run 'Application'"
5. O usa el boton verde de "Play" en la barra superior

#### Eclipse/STS

1. Abre el proyecto en Eclipse
2. Click derecho en el proyecto > "Run As" > "Spring Boot App"

#### VS Code

1. Abre el proyecto en VS Code
2. Abre la clase principal
3. Click en "Run" sobre el metodo `main()`

### Opcion C: Ejecutar JAR directamente

```bash
# Primero construir el JAR
./mvnw clean package -DskipTests

# Ejecutar el JAR
java -jar target/crudcloud-backend-0.0.1-SNAPSHOT.jar

# Con perfil especifico
java -jar -Dspring.profiles.active=dev target/crudcloud-backend-0.0.1-SNAPSHOT.jar
```

## Paso 6: Verificar la Instalacion

### 1. Verificar que la aplicacion esta corriendo

```bash
# Verificar logs
# Deberas ver algo como:
# Started CrudCloudBackendApplication in X.XXX seconds
```

### 2. Verificar endpoint de salud

```bash
# Usando curl
curl http://localhost:8080/api/actuator/health

# Usando HTTPie (si esta instalado)
http localhost:8080/api/actuator/health
```

Respuesta esperada:
```json
{
  "status": "UP"
}
```

### 3. Verificar Swagger UI (si esta habilitado)

Abre en tu navegador:
- http://localhost:8080/api/swagger-ui.html
- O http://localhost:8080/api/swagger-ui/index.html

### 4. Verificar base de datos

```bash
# Conectarse a PostgreSQL
psql -h localhost -U crudcloud_user -d crudcloud_db

# Listar tablas creadas automaticamente por Hibernate
\dt

# Deberas ver tablas como: users, products, orders, etc.
```

## Paso 7: Configuracion del IDE (Opcional pero Recomendado)

### IntelliJ IDEA

#### 1. Habilitar Annotation Processing (para Lombok)

1. `File` > `Settings` > `Build, Execution, Deployment` > `Compiler` > `Annotation Processors`
2. Marcar "Enable annotation processing"

#### 2. Instalar Plugins Recomendados

- Spring Boot
- Lombok
- Maven Helper
- Database Navigator
- GitToolBox

#### 3. Configurar Formateador de Codigo

1. `File` > `Settings` > `Editor` > `Code Style` > `Java`
2. Importa el esquema de Google Java Style (opcional)

### Eclipse/STS

#### 1. Instalar Lombok

```bash
# Descargar e instalar Lombok
java -jar lombok.jar
# Selecciona tu instalacion de Eclipse
```

#### 2. Instalar Spring Tools

`Help` > `Eclipse Marketplace` > Buscar "Spring Tools" > Instalar

### VS Code

#### Extensiones Requeridas

```bash
# Instalar extensiones via CLI
code --install-extension vscjava.vscode-java-pack
code --install-extension vmware.vscode-spring-boot
code --install-extension gabrielbb.vscode-lombok
```

## Resumen de Comandos Rapidos

```bash
# Clonar proyecto
git clone https://github.com/CrudCloud/backend.git && cd backend

# Iniciar PostgreSQL (Docker)
docker-compose up -d

# Instalar dependencias
./mvnw clean install

# Ejecutar aplicacion
./mvnw spring-boot:run

# Verificar salud
curl http://localhost:8080/api/actuator/health

# Ver logs
./mvnw spring-boot:run | grep "Started"
```

## Proximos Pasos

Ahora que has instalado la aplicacion, continua con la [Configuracion](/docs/01-guia-inicio/configuracion) para personalizar el proyecto segun tus necesidades.

## Troubleshooting

### La aplicacion no inicia

1. Verifica que PostgreSQL este corriendo
2. Verifica las credenciales en `application-dev.properties`
3. Verifica que el puerto 8080 este libre
4. Revisa los logs completos para identificar el error

### Error de conexion a base de datos

```bash
# Verificar que PostgreSQL este corriendo
sudo systemctl status postgresql  # Linux
brew services list               # macOS
docker ps                        # Docker

# Verificar puerto
netstat -an | grep 5432          # Linux/macOS
netstat -an | findstr 5432       # Windows
```

### Errores de compilacion

```bash
# Limpiar proyecto completamente
./mvnw clean
rm -rf target/

# Reinstalar dependencias
./mvnw clean install -U
```

Si sigues teniendo problemas, consulta la seccion de [Troubleshooting](/docs/03-desarrollo/troubleshooting) o abre un issue en GitHub.
