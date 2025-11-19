---
id: instancias
title: Gestión de Instancias
---

# Gestión de Instancias

La vista de Instancias permite al usuario crear, listar, filtrar y administrar sus instancias de bases de datos en CrudCloud.

Desde esta pantalla el usuario puede:

Ver todas sus instancias de bases de datos.

Crear nuevas instancias para diferentes motores (MySQL, PostgreSQL, Redis, etc.).

Consultar el estado actual de cada instancia.

Ejecutar acciones rápidas como iniciar, detener, reiniciar o eliminar.

## Objetivos de la vista de Instancias

Proporcionar una visión clara del estado de todos los recursos del usuario.

Permitir acciones frecuentes con la menor cantidad de clics posible.

Ofrecer filtros y búsquedas que faciliten encontrar instancias específicas.

Mantener la coherencia visual con el resto del dashboard.

## Estructura general de la pantalla

Aunque el diseño concreto puede variar, típicamente la pantalla se divide en:

Barra superior de acciones

Filtros y búsqueda

Listado de instancias (tabla o tarjetas)

Paginación o carga incremental (si aplica)

1. Barra superior de acciones

En la parte superior se suele mostrar:

Título: Instancias o Database Instances.

Botón principal: Crear instancia.

Opcionalmente, un resumen rápido:

Número total de instancias.

Instancias activas vs detenidas.

Ejemplo de acciones:

Crear instancia

Refrescar listado

2. Filtros y búsqueda

Para facilitar el trabajo con muchos registros, la vista de instancias puede incluir:

Campo de búsqueda por nombre de instancia.

### Filtro por motor:

MySQL

PostgreSQL

SQL Server

Redis

Cassandra

MongoDB

### Filtro por estado:

running

stopped

error

pending

Esto permite búsquedas como:

“Ver solo instancias MySQL activas”.

“Ver instancias en error para revisar problemas”.

3. Listado de instancias

El listado puede implementarse como:

Tabla con columnas (más clásico).

Tarjetas (cards) en una grilla (enfoque más visual).

O una combinación adaptable según el tamaño de pantalla.

Información típica mostrada por instancia:

Nombre de la instancia.

Motor (MySQL, PostgreSQL, etc.).

Plan asociado o tipo de recurso.

Estado actual (running, stopped, error).

Fecha de creación.

Última actualización.

Acciones disponibles.

Ejemplo conceptual de tarjeta:

Título: prod-mysql-01

Subtítulo: MySQL • Plan Pro

Estado: Running (con un pill verde)

Botones:

Ver detalles

Detener

Reiniciar

Menú de más acciones (...)

4. Acciones sobre una instancia

Las acciones más comunes sobre cada instancia suelen incluir:

Ver detalles:

Abre una vista con más información (credenciales, endpoints, logs básicos, etc.).

Iniciar / Detener:

Cambia el estado de la instancia vía backend (y, por detrás, vía Docker).

Reiniciar:

Combinación de detener e iniciar.

Eliminar:

Borra la instancia (normalmente tras una confirmación explícita).

Copiar credenciales:

Host, puerto, nombre de base de datos, usuario, etc. (según lo que exponga el backend).

Estas acciones se conectan con el backend a través de los servicios de API:

instanceService.createInstance

instanceService.startInstance

instanceService.stopInstance

instanceService.deleteInstance

etc.

## Componentes típicos de la vista de Instancias

La implementación suele usar una combinación de componentes reutilizables:

### Componentes UI genéricos

Button

Input

Select

Badge

Modal

Table o equivalente

### Componentes específicos de dominio

InstanceList o InstanceTable

InstanceCard

InstanceStatusBadge

InstanceActionsMenu

## Interacción con el estado global

La vista de instancias se apoya en:

InstanceContext o hook useInstances para:

Cargar la lista desde el backend.

Guardar estado de filtros, búsqueda y paginación.

Manejar estados de carga (loading), error (error) y datos (instances).

AuthContext para:

Obtener el usuario actual y sus permisos (si existen restricciones por plan).

Flujo típico:

Al montar la pantalla, se dispara una carga inicial (fetchInstances).

Los filtros y búsqueda actualizan el estado y disparan nuevas cargas si es necesario.

Las acciones (crear, iniciar, detener, eliminar) actualizan el backend y luego refrescan el listado.

## Responsividad

La vista de Instancias debe adaptarse a diferentes tamaños de pantalla:

En móvil:

Las instancias pueden mostrarse como tarjetas apiladas.

Las acciones principales se muestran en un menú compacto.

En escritorio:

Tablas o grillas con más columnas.

Acciones visibles directamente en cada fila/tarjeta.

## Buenas prácticas

Mostrar siempre el estado de forma clara (color + texto).

Evitar acciones destructivas sin confirmación (por ejemplo, Eliminar).

Proveer feedback al usuario:

Spinners o skeletons mientras cargan las instancias.

Mensajes de éxito o error tras las acciones.

Mantener las acciones más usadas fácilmente accesibles (por ejemplo, “Crear instancia” y “Detener/Arrancar”).