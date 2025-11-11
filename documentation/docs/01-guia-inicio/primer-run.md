---
sidebar_position: 4
title: Primer Run
---

# Primer Run de la Aplicacion

Esta guia te llevara a traves de tu primera ejecucion de CrudCloud Backend, verificando que todo funcione correctamente.

## Checklist Pre-Run

Antes de ejecutar la aplicacion, verifica:

- [ ] PostgreSQL esta corriendo y accesible
- [ ] Base de datos `crudcloud_db` esta creada
- [ ] Archivo `application-dev.properties` esta configurado
- [ ] Variables de entorno estan definidas (si aplica)
- [ ] Puerto 8080 esta disponible
- [ ] Dependencias Maven estan instaladas

## Iniciar la Aplicacion

### Metodo 1: Maven (Recomendado)

```bash
# Desde la raiz del proyecto
./mvnw spring-boot:run -Dspring-boot.run.profiles=dev
```

### Metodo 2: IDE

#### IntelliJ IDEA
1. Abre la clase principal (`CrudCloudBackendApplication.java`)
2. Click derecho > "Run"

#### Eclipse/STS
1. Click derecho en el proyecto
2. "Run As" > "Spring Boot App"

### Metodo 3: JAR

```bash
# Compilar
./mvnw clean package -DskipTests

# Ejecutar
java -jar target/crudcloud-backend-0.0.1-SNAPSHOT.jar --spring.profiles.active=dev
```

## Verificar Inicio Exitoso

### 1. Revisar Logs de Consola

Deberas ver algo similar a:

```
  .   ____          _            __ _ _
 /\\ / ___'_ __ _ _(_)_ __  __ _ \ \ \ \
( ( )\___ | '_ | '_| | '_ \/ _` | \ \ \ \
 \\/  ___)| |_)| | | | | || (_| |  ) ) ) )
  '  |____| .__|_| |_|_| |_\__, | / / / /
 =========|_|==============|___/=/_/_/_/
 :: Spring Boot ::             (v3.5.7)

2025-01-07 10:00:00.000  INFO --- [main] c.c.b.CrudCloudBackendApplication : Starting CrudCloudBackendApplication
2025-01-07 10:00:01.000  INFO --- [main] o.s.b.w.embedded.tomcat.TomcatWebServer  : Tomcat initialized with port(s): 8080 (http)
2025-01-07 10:00:02.000  INFO --- [main] o.hibernate.jpa.internal.util.LogHelper  : HHH000204: Processing PersistenceUnitInfo
2025-01-07 10:00:03.000  INFO --- [main] org.hibernate.Version                    : HHH000412: Hibernate ORM core version 6.x.x
2025-01-07 10:00:04.000  INFO --- [main] o.h.e.t.j.p.i.JtaPlatformInitiator       : HHH000490: Using JtaPlatform implementation
2025-01-07 10:00:05.000  INFO --- [main] c.c.b.CrudCloudBackendApplication        : Started CrudCloudBackendApplication in 5.123 seconds
```

**Indicadores clave de exito**:
- ✓ "Started CrudCloudBackendApplication in X seconds"
- ✓ "Tomcat started on port(s): 8080"
- ✓ Sin errores de "Connection refused" o "SQLException"

### 2. Verificar Health Endpoint

```bash
# Usando curl
curl http://localhost:8080/api/actuator/health

# Respuesta esperada:
{
  "status": "UP",
  "components": {
    "db": {
      "status": "UP",
      "details": {
        "database": "PostgreSQL",
        "validationQuery": "isValid()"
      }
    },
    "diskSpace": {
      "status": "UP"
    },
    "ping": {
      "status": "UP"
    }
  }
}
```

### 3. Verificar Swagger UI

Abre en tu navegador:
- http://localhost:8080/api/swagger-ui/index.html

Deberas ver la interfaz de Swagger con todos los endpoints documentados.

### 4. Verificar Tablas en Base de Datos

```bash
# Conectarse a PostgreSQL
psql -h localhost -U crudcloud_user -d crudcloud_db

# Listar tablas
\dt

# Deberas ver tablas como:
# public | users           | table | crudcloud_user
# public | products        | table | crudcloud_user
# public | orders          | table | crudcloud_user
# public | order_items     | table | crudcloud_user
# public | payments        | table | crudcloud_user
# public | roles           | table | crudcloud_user
```

## Probar Endpoints Basicos

### 1. Endpoint de Health

```bash
curl -X GET http://localhost:8080/api/actuator/health
```

### 2. Crear un Usuario (Registro)

```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "email": "admin@crudcloud.com",
    "password": "Admin123!",
    "firstName": "Admin",
    "lastName": "User"
  }'
```

Respuesta esperada:
```json
{
  "message": "Usuario registrado exitosamente",
  "userId": 1,
  "username": "admin"
}
```

### 3. Iniciar Sesion (Login)

```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "Admin123!"
  }'
```

Respuesta esperada:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "type": "Bearer",
  "expiresIn": 86400000,
  "username": "admin",
  "email": "admin@crudcloud.com"
}
```

### 4. Acceder a Endpoint Protegido

```bash
# Guardar el token
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# Hacer request autenticado
curl -X GET http://localhost:8080/api/users/me \
  -H "Authorization: Bearer $TOKEN"
```

## Datos de Prueba Iniciales

### Opcion A: Script SQL

Crea `src/main/resources/data.sql`:

```sql
-- Insertar roles
INSERT INTO roles (id, name, description) VALUES
(1, 'ROLE_ADMIN', 'Administrador del sistema'),
(2, 'ROLE_USER', 'Usuario regular'),
(3, 'ROLE_SELLER', 'Vendedor')
ON CONFLICT (id) DO NOTHING;

-- Insertar categorias de productos
INSERT INTO categories (id, name, description) VALUES
(1, 'Electronica', 'Productos electronicos'),
(2, 'Ropa', 'Ropa y accesorios'),
(3, 'Hogar', 'Articulos para el hogar')
ON CONFLICT (id) DO NOTHING;

-- Insertar productos de ejemplo
INSERT INTO products (id, name, description, price, stock, category_id) VALUES
(1, 'Laptop HP 15', 'Laptop con procesador Intel i5', 2500000, 10, 1),
(2, 'Mouse Logitech', 'Mouse inalambrico', 80000, 50, 1),
(3, 'Camiseta Nike', 'Camiseta deportiva', 120000, 30, 2)
ON CONFLICT (id) DO NOTHING;
```

### Opcion B: Servicio de Inicializacion

Crea `DataInitializer.java`:

```java
@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private RoleRepository roleRepository;

    @Override
    public void run(String... args) throws Exception {
        if (roleRepository.count() == 0) {
            Role adminRole = new Role();
            adminRole.setName("ROLE_ADMIN");
            adminRole.setDescription("Administrador del sistema");
            roleRepository.save(adminRole);

            Role userRole = new Role();
            userRole.setName("ROLE_USER");
            userRole.setDescription("Usuario regular");
            roleRepository.save(userRole);

            System.out.println("✓ Datos iniciales cargados");
        }
    }
}
```

## Uso de Postman

### Importar Coleccion

1. Descarga la coleccion de Postman desde el repositorio
2. En Postman: File > Import > Selecciona el archivo `.json`
3. Configura el environment con:
   - `BASE_URL`: http://localhost:8080/api
   - `TOKEN`: (se llenara automaticamente al hacer login)

### Coleccion de Endpoints

La coleccion incluye:

- **Auth**: Register, Login, Refresh Token
- **Users**: Get Profile, Update Profile, Delete User
- **Products**: CRUD completo
- **Orders**: Create Order, Get Orders, Update Status
- **Payments**: Create Payment, Verify Payment

## Troubleshooting Comun

### Error: "Port 8080 is already in use"

```bash
# Opcion 1: Cambiar puerto en application.properties
server.port=8081

# Opcion 2: Matar proceso en puerto 8080
# Linux/macOS
lsof -ti:8080 | xargs kill -9

# Windows
netstat -ano | findstr :8080
taskkill /PID <PID> /F
```

### Error: "Connection refused" a PostgreSQL

```bash
# Verificar que PostgreSQL esta corriendo
sudo systemctl status postgresql  # Linux
brew services list                # macOS
docker ps                         # Docker

# Iniciar PostgreSQL si es necesario
sudo systemctl start postgresql   # Linux
brew services start postgresql    # macOS
docker-compose up -d             # Docker
```

### Error: "Invalid JWT signature"

**Causas comunes**:
- Token expirado
- JWT_SECRET incorrecto
- Token malformado

**Solucion**:
1. Generar un nuevo token haciendo login nuevamente
2. Verificar que JWT_SECRET sea consistente

### Error: "Table [tablename] doesn't exist"

**Solucion**:
1. Verifica que `spring.jpa.hibernate.ddl-auto=update` en dev
2. Elimina las tablas y deja que Hibernate las recree
3. O ejecuta los scripts SQL manualmente

### Error: Dependencias no encontradas

```bash
# Limpiar cache de Maven
./mvnw clean

# Reinstalar dependencias
./mvnw clean install -U

# Si persiste, eliminar .m2/repository
rm -rf ~/.m2/repository
./mvnw clean install
```

## Logs y Debugging

### Ver Logs Detallados

```properties
# En application-dev.properties
logging.level.com.crudcloud.backend=DEBUG
logging.level.org.springframework.web=DEBUG
logging.level.org.hibernate.SQL=DEBUG
```

### Modo Debug en IDE

#### IntelliJ IDEA
1. Click en el icono de "bug" en lugar de "run"
2. Coloca breakpoints en el codigo
3. El debugger se detendra en esos puntos

#### VS Code
1. Agrega configuracion en `.vscode/launch.json`
2. F5 para iniciar debugging

## Monitoreo en Tiempo Real

### Ver Metricas

```bash
# Metricas generales
curl http://localhost:8080/api/actuator/metrics

# Metrica especifica
curl http://localhost:8080/api/actuator/metrics/jvm.memory.used

# Todas las metricas disponibles
curl http://localhost:8080/api/actuator/metrics | jq .
```

### Ver Logs en Tiempo Real

```bash
# Si configuraste logging a archivo
tail -f logs/crudcloud-backend.log

# Con filtro
tail -f logs/crudcloud-backend.log | grep ERROR
```

## Proximos Pasos

Ahora que la aplicacion esta corriendo exitosamente:

1. Explora la [Arquitectura del Proyecto](/docs/arquitectura/resumen)
2. Lee las [Convenciones de Desarrollo](/docs/desarrollo/convenciones)
3. Consulta el [API Reference](/docs/api/autenticacion)

## Checklist Post-Run

- [ ] Aplicacion inicia sin errores
- [ ] Health endpoint responde con "UP"
- [ ] Swagger UI es accesible
- [ ] Tablas creadas en PostgreSQL
- [ ] Puedes registrar un usuario
- [ ] Puedes hacer login y obtener JWT
- [ ] Endpoints protegidos funcionan con token

**¡Felicidades!** Has completado exitosamente el primer run de CrudCloud Backend.
