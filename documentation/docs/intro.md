---
sidebar_position: 1
title: Introduccion
slug: /intro
---

# Bienvenido a CrudCloud Backend

**CrudCloud Backend** es una aplicacion empresarial robusta y escalable desarrollada con las ultimas tecnologias de Java y Spring Boot. Este sistema proporciona una API RESTful completa para la gestion de operaciones CRUD, autenticacion segura, y procesamiento de pagos.

## Vision General del Proyecto

CrudCloud Backend es una solucion backend moderna diseñada para soportar aplicaciones de comercio electronico y sistemas de gestion empresarial. El proyecto implementa las mejores practicas de desarrollo, arquitectura limpia y patrones de diseño probados en la industria.

### Caracteristicas Principales

- **API RESTful Completa**: Endpoints bien documentados y versionados
- **Autenticacion JWT**: Sistema de autenticacion seguro basado en tokens
- **Gestion de Usuarios**: Control de acceso basado en roles (RBAC)
- **Catalogo de Productos**: CRUD completo para productos con categorias
- **Sistema de Ordenes**: Procesamiento de ordenes con estados transaccionales
- **Integracion de Pagos**: Integracion completa con Mercado Pago
- **Base de Datos PostgreSQL**: Persistencia de datos confiable y escalable
- **Validacion Robusta**: Validacion de datos en todos los niveles
- **Manejo de Errores**: Sistema centralizado de manejo de excepciones
- **Documentacion API**: Swagger/OpenAPI integrado

## Stack Tecnologico

### Core

| Tecnologia | Version | Proposito |
|-----------|---------|-----------|
| Java | 21 LTS | Lenguaje de programacion |
| Spring Boot | 3.5.7 | Framework principal |
| Maven | 3.x | Gestion de dependencias |
| PostgreSQL | 15+ | Base de datos relacional |

### Dependencias Principales

- **Spring Security**: Autenticacion y autorizacion
- **Spring Data JPA**: Capa de persistencia
- **JWT (jjwt)**: Tokens de autenticacion
- **Lombok**: Reduccion de codigo boilerplate
- **ModelMapper**: Mapeo de DTOs y entidades
- **Validation API**: Validacion de beans
- **Mercado Pago SDK**: Integracion de pagos

## Arquitectura

El proyecto sigue una arquitectura en capas (Layered Architecture) con separacion clara de responsabilidades:

```
┌─────────────────────────────────┐
│     Controller Layer            │  ← API REST Endpoints
├─────────────────────────────────┤
│     Service Layer               │  ← Logica de negocio
├─────────────────────────────────┤
│     Repository Layer            │  ← Acceso a datos
├─────────────────────────────────┤
│     Entity/Model Layer          │  ← Modelos de dominio
└─────────────────────────────────┘
```

### Patrones de Diseño Implementados

- **DTO Pattern**: Transferencia de datos entre capas
- **Repository Pattern**: Abstraccion de acceso a datos
- **Service Layer Pattern**: Encapsulacion de logica de negocio
- **Dependency Injection**: Inversion de control con Spring
- **Builder Pattern**: Construccion de objetos complejos (via Lombok)

## Casos de Uso

CrudCloud Backend es ideal para:

- Aplicaciones de comercio electronico
- Sistemas de gestion de inventario
- Plataformas de marketplace
- Aplicaciones empresariales con flujos de pago
- APIs backend para aplicaciones moviles o web

## Prerequisitos

Antes de comenzar, asegurate de tener instalado:

- Java 21 o superior
- Maven 3.8+
- PostgreSQL 15+
- Git
- IDE (IntelliJ IDEA, Eclipse, o VS Code)

## Inicio Rapido

```bash
# Clonar el repositorio
git clone https://github.com/CrudCloud/backend.git

# Navegar al directorio
cd backend

# Instalar dependencias
mvn clean install

# Ejecutar la aplicacion
mvn spring-boot:run
```

La aplicacion estara disponible en `http://localhost:8080`

## Estructura de la Documentacion

Esta documentacion esta organizada en las siguientes secciones:

1. **Guia de Inicio**: Instalacion, configuracion y primer run
2. **Arquitectura**: Estructura del proyecto y dependencias
3. **Desarrollo**: Guias de desarrollo, convenciones y testing
4. **API Reference**: Documentacion detallada de endpoints
5. **Deployment**: Guias de despliegue y configuracion de produccion

## Soporte y Contribuciones

- **Repositorio**: [GitHub - CrudCloud Backend](https://github.com/CrudCloud/backend)
- **Issues**: Reporta bugs o solicita features en GitHub Issues
- **Contribuciones**: Pull requests son bienvenidos

## Licencia

Este proyecto es propiedad de CrudCloud. Todos los derechos reservados.

---

**¿Listo para comenzar?** Dirígete a la [Guia de Inicio](/docs/01-guia-inicio/requisitos) para configurar tu entorno de desarrollo.
