---
id: dashboard
title: Dashboard
---

# Dashboard del Frontend

El Dashboard de CrudCloud es la vista principal después de que el usuario inicia sesión.
Desde aquí el usuario puede:

Ver un resumen del estado de sus instancias de bases de datos.

Consultar información del plan actual y límites.

Acceder rápidamente a acciones frecuentes (crear instancia, hacer upgrade de plan, ir al perfil, etc.).

## Objetivos del Dashboard

El diseño del dashboard busca:

Mostrar la información más importante de un vistazo.

Permitir acciones rápidas sin navegar por demasiadas pantallas.

Mantener una experiencia visual consistente con el resto de la aplicación (componentes UI, colores, tipografías).

## Secciones principales

Aunque el diseño puede evolucionar, típicamente el dashboard incluye:

1. Encabezado del Dashboard

En la parte superior se suele mostrar:

Título (por ejemplo: Dashboard o Welcome back, nombre).

Información del usuario (nombre, correo, avatar).

Accesos rápidos:

Ir al perfil.

Cerrar sesión.

Cambiar tema (modo claro/oscuro), si aplica.

2. Tarjetas de resumen (KPI)

Un conjunto de tarjetas/resúmenes con métricas clave, por ejemplo:

Instancias activas: cantidad de instancias de bases de datos en estado running.

Instancias detenidas: cantidad de instancias en estado stopped.

Uso del plan: porcentaje de uso del límite permitido por el plan (número de instancias, almacenamiento, etc.).

Última actividad: fecha/hora de la última acción relevante del usuario.

Estas tarjetas suelen usar componentes como:

Card

Badge

ProgressBar

Iconos que representan cada métrica

3. Listado de instancias recientes

Una tabla o lista con las últimas instancias creadas o modificadas, mostrando, por ejemplo:

Nombre de la instancia.

Tipo de motor (MySQL, PostgreSQL, Redis, etc.).

Estado (running, stopped, error).

Fecha de creación.

Acciones rápidas (Ver detalle, Iniciar, Detener, etc.).

El objetivo es que el usuario pueda gestionar rápidamente sus bases de datos sin tener que ir primero a la vista completa de “Instancias”.

4. Información del plan y suscripción

Un bloque dedicado a mostrar:

Plan actual (por ejemplo, Starter, Pro, Enterprise).

Límite de instancias y uso actual.

Botón para ver detalles del plan o cambiar de plan.

Posibles alertas si el usuario está cerca del límite o si la suscripción está próxima a vencer.

5. Acciones rápidas

Se pueden incluir botones o shortcuts para:

Crear nueva instancia de base de datos.

Ver todas las instancias.

Ver todos los planes disponibles.

Ir a la sección de facturación/pagos.

Ejemplos:

Botón principal: Crear instancia

Botón secundario: Ver todas las instancias

## Componentes reutilizados

El Dashboard suele utilizar varios componentes reutilizables del sistema de diseño:

# Componentes UI básicos

Button

Card

Badge

Tooltip

# Componentes de layout

Grillas responsivas (grid, flex) con clases de Tailwind.

# Componentes específicos de dominio

Tarjetas de instancia (InstanceCard).

Tarjeta de plan (CurrentPlanCard).

Widgets de métrica (MetricCard, StatWidget).

## Responsividad

El Dashboard está pensado para adaptarse a diferentes tamaños de pantalla:

En móviles, las tarjetas se muestran en una sola columna.

En pantallas medianas y grandes, se utilizan grillas de 2 o 3 columnas.

Las tablas o listas largas se adaptan con scroll horizontal o tarjetas apiladas.

## Buenas prácticas de diseño en el Dashboard

Mostrar primero la información más relevante (estado de instancias, uso del plan).

No sobrecargar la vista con demasiados detalles; para eso existen pantallas específicas (Instancias, Planes, Pagos).

Usar colores y estados de forma coherente (por ejemplo, verde para instancias running, amarillo para pending, rojo para errores).

Mantener acciones clave siempre visibles (botón de “Crear instancia”, enlace al plan).