---
sidebar_position: 1
title: Requisitos del Sistema
---

# Requisitos del Sistema

Esta pagina describe los requisitos necesarios para desarrollar, ejecutar y desplegar CrudCloud Backend.

## Requisitos de Software

### Obligatorios

#### Java Development Kit (JDK)

- **Version**: Java 21 LTS o superior
- **Recomendado**: OpenJDK 21 u Oracle JDK 21
- **Descarga**: [Oracle JDK](https://www.oracle.com/java/technologies/downloads/#java21) | [OpenJDK](https://adoptium.net/)

```bash
# Verificar instalacion
java -version
# Debe mostrar: openjdk version "21" o superior
```

#### Apache Maven

- **Version**: 3.8.0 o superior
- **Descarga**: [Apache Maven](https://maven.apache.org/download.cgi)

```bash
# Verificar instalacion
mvn -version
# Debe mostrar: Apache Maven 3.8.x o superior
```

#### PostgreSQL

- **Version**: 15.0 o superior
- **Recomendado**: PostgreSQL 16
- **Descarga**: [PostgreSQL](https://www.postgresql.org/download/)

```bash
# Verificar instalacion
psql --version
# Debe mostrar: psql (PostgreSQL) 15.x o superior
```

#### Git

- **Version**: 2.30 o superior
- **Descarga**: [Git SCM](https://git-scm.com/downloads)

```bash
# Verificar instalacion
git --version
# Debe mostrar: git version 2.30.x o superior
```

### Opcionales (Recomendados)

#### IDE (Entorno de Desarrollo Integrado)

Elige uno de los siguientes:

- **IntelliJ IDEA** (Recomendado)
  - Version: Community o Ultimate
  - Plugins sugeridos: Spring Boot, Lombok, Maven Helper
  - [Descargar](https://www.jetbrains.com/idea/download/)

- **Eclipse IDE**
  - Version: Eclipse IDE for Enterprise Java Developers
  - Plugins sugeridos: Spring Tools Suite (STS)
  - [Descargar](https://www.eclipse.org/downloads/)

- **Visual Studio Code**
  - Extensiones requeridas:
    - Extension Pack for Java
    - Spring Boot Extension Pack
    - Lombok Annotations Support
  - [Descargar](https://code.visualstudio.com/)

#### Docker & Docker Compose

Para ejecutar PostgreSQL en contenedores o deployment:

- **Docker**: 20.10 o superior
- **Docker Compose**: 2.0 o superior
- [Descargar Docker](https://www.docker.com/products/docker-desktop/)

```bash
# Verificar instalacion
docker --version
docker-compose --version
```

#### Postman o Insomnia

Para pruebas de API:

- [Postman](https://www.postman.com/downloads/)
- [Insomnia](https://insomnia.rest/download)

## Requisitos de Hardware

### Minimos (Desarrollo)

- **CPU**: 2 cores
- **RAM**: 8 GB
- **Disco**: 10 GB libres
- **SO**: Windows 10/11, macOS 11+, Linux (Ubuntu 20.04+)

### Recomendados (Desarrollo)

- **CPU**: 4+ cores
- **RAM**: 16 GB
- **Disco**: 20 GB libres (SSD recomendado)
- **SO**: Windows 11, macOS 13+, Linux (Ubuntu 22.04+)

### Produccion

- **CPU**: 4+ cores
- **RAM**: 8 GB minimo (16 GB recomendado)
- **Disco**: 50 GB+ (SSD recomendado)
- **Red**: Conexion estable a internet para integraciones externas

## Configuracion de Base de Datos

### PostgreSQL

El proyecto requiere una base de datos PostgreSQL con las siguientes caracteristicas:

- **Version**: PostgreSQL 15+
- **Encoding**: UTF8
- **Collation**: es_ES.UTF-8 o en_US.UTF-8
- **Usuario**: Cuenta con privilegios de CREATE, DROP, ALTER

### Configuracion Recomendada

```sql
-- Crear base de datos
CREATE DATABASE crudcloud_db
    WITH
    ENCODING = 'UTF8'
    LC_COLLATE = 'es_ES.UTF-8'
    LC_CTYPE = 'es_ES.UTF-8'
    TEMPLATE = template0;

-- Crear usuario (opcional, para desarrollo)
CREATE USER crudcloud_user WITH ENCRYPTED PASSWORD 'tu_password_seguro';
GRANT ALL PRIVILEGES ON DATABASE crudcloud_db TO crudcloud_user;
```

## Servicios Externos

### Mercado Pago

Para utilizar la funcionalidad de pagos:

- Cuenta de desarrollador en [Mercado Pago](https://www.mercadopago.com.co/developers)
- Credenciales de prueba (Sandbox):
  - Public Key
  - Access Token
- Para produccion: Credenciales de produccion aprobadas

## Puertos Requeridos

Asegurate de que los siguientes puertos esten disponibles:

| Puerto | Servicio | Descripcion |
|--------|----------|-------------|
| 8080 | Spring Boot | Aplicacion principal |
| 5432 | PostgreSQL | Base de datos |
| 5005 | Debug (opcional) | Puerto de depuracion remota |

## Variables de Entorno

El sistema requiere las siguientes variables de entorno (se configuran en `application.properties` o `.env`):

- `DATABASE_URL`: URL de conexion a PostgreSQL
- `DATABASE_USERNAME`: Usuario de base de datos
- `DATABASE_PASSWORD`: Contraseña de base de datos
- `JWT_SECRET`: Clave secreta para tokens JWT
- `MERCADOPAGO_ACCESS_TOKEN`: Token de acceso de Mercado Pago
- `MERCADOPAGO_PUBLIC_KEY`: Clave publica de Mercado Pago

## Permisos del Sistema

### Linux/macOS

```bash
# Dar permisos de ejecucion al wrapper de Maven
chmod +x mvnw
```

### Windows

No se requieren permisos especiales, pero ejecuta el IDE como administrador si encuentras problemas de permisos.

## Validacion de Requisitos

Antes de continuar con la instalacion, ejecuta este script de validacion:

```bash
#!/bin/bash
echo "=== Validacion de Requisitos CrudCloud Backend ==="
echo ""

# Java
echo "1. Verificando Java..."
java -version 2>&1 | head -1

# Maven
echo "2. Verificando Maven..."
mvn -version 2>&1 | head -1

# PostgreSQL
echo "3. Verificando PostgreSQL..."
psql --version

# Git
echo "4. Verificando Git..."
git --version

# Docker (opcional)
echo "5. Verificando Docker (opcional)..."
docker --version 2>&1 || echo "Docker no instalado (opcional)"

echo ""
echo "=== Validacion completada ==="
```

## Troubleshooting Comun

### Java no reconocido

**Problema**: `java: command not found`

**Solucion**:
- Verifica que Java este instalado
- Añade Java al PATH del sistema
- En Windows: Variables de entorno > JAVA_HOME
- En Linux/macOS: Añadir a `.bashrc` o `.zshrc`

### Maven no reconocido

**Problema**: `mvn: command not found`

**Solucion**:
- Usa el wrapper incluido: `./mvnw` en lugar de `mvn`
- O instala Maven globalmente y añadelo al PATH

### Puerto 8080 ocupado

**Problema**: `Port 8080 is already in use`

**Solucion**:
- Cambia el puerto en `application.properties`: `server.port=8081`
- O detén el proceso que usa el puerto 8080

### Conexion a PostgreSQL rechazada

**Problema**: `Connection refused` o `Connection error`

**Solucion**:
- Verifica que PostgreSQL este ejecutandose
- Verifica las credenciales en `application.properties`
- Verifica que el puerto 5432 este abierto
- En Linux: `sudo systemctl start postgresql`
- En macOS: `brew services start postgresql`

## Proximos Pasos

Una vez que hayas verificado todos los requisitos, procede a la [Instalacion](/docs/guia-inicio/instalacion).
