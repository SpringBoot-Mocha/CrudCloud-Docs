---
id: planes
title: Planes y Suscripciones
---

# Planes y Suscripciones

La vista de Planes permite al usuario revisar su plan actual, comparar opciones disponibles y realizar cambios de suscripción (upgrade o downgrade) dentro de CrudCloud.

Desde esta pantalla el usuario puede:

Ver información detallada de su plan vigente.

Comparar características entre distintos planes (límite de instancias, recursos, soporte, etc.).

Iniciar el flujo de cambio de plan (por ejemplo, de Free a Pro, o de Pro a Enterprise).

Ver información básica de facturación (según lo que exponga el backend).

## Objetivos de la vista de Planes

Dar claridad sobre qué incluye cada plan.

Hacer sencillo el proceso de upgrade cuando el usuario necesita más recursos.

Mostrar de forma visible el estado actual del usuario (qué plan tiene y cuánto está usando).

Integrarse de forma coherente con el sistema de pagos (por ejemplo, Mercado Pago a través del backend).

## Estructura general de la pantalla

Típicamente la pantalla de Planes se organiza en:

Resumen del plan actual

Grilla de planes disponibles

Detalle de características

Acciones de cambio de plan

1. Resumen del plan actual

En la parte superior suele mostrarse una tarjeta con:

Nombre del plan actual (por ejemplo, Starter, Pro, Business, Enterprise).

Precio asociado (mensual/anual), si aplica.

Recursos clave:

Límite de instancias.

Límite de almacenamiento o conexiones (si aplica).

Estado de uso:

Instancias usadas vs instancias totales permitidas.

Barras de progreso o indicadores visuales.

Ejemplo de información:

Plan actual: Pro

Instancias: 4 / 10

Próxima fecha de renovación: 15 de cada mes

2. Grilla de planes disponibles

Debajo del resumen del plan actual se puede mostrar una grilla comparativa de planes:

Cada plan en una Card:

Nombre del plan.

Precio.

Lista de características principales.

Botón de acción (por ejemplo, Seleccionar, Mejorar, Cambiar a este plan).

Ejemplos de columnas:

Starter (orientado a pruebas o proyectos pequeños).

Pro (para uso profesional o equipos pequeños).

Business / Enterprise (proyectos grandes o clientes corporativos).

Estas tarjetas suelen utilizar:

Componentes Card, Badge, Button.

Estilos diferenciados para resaltar el plan recomendado (por ejemplo, borde resaltado, etiqueta “Recomendado”).

3. Detalle de características

Opcionalmente se puede incluir una sección de tabla comparativa:

Filas de características:

Límite de instancias.

Motores soportados.

Soporte prioritario.

Logs / métricas avanzadas.

Columnas por plan.

Esto ayuda al usuario a entender qué gana o pierde al cambiar de plan.

4. Acciones de cambio de plan

Cada tarjeta de plan suele incluir un botón que inicia el flujo de cambio:

Para planes superiores:

Upgrade: puede iniciar un flujo de pago (por ejemplo, Mercado Pago) o confirmación de cambio inmediato según la lógica de negocio.

Para planes inferiores:

Downgrade: puede requerir confirmación adicional, especialmente si el usuario está usando más recursos de los permitidos por el plan inferior.

Las acciones típicas incluyen:

Cambiar a este plan

Mejorar plan

Más detalles

Estas acciones se conectan con los servicios del frontend:

planService.getPlans()

planService.changePlan(planId)

paymentService.startCheckout(planId) (si el cambio requiere pago inmediato)

## Componentes típicos en la vista de Planes

La implementación suele utilizar:

### Componentes UI genéricos

Card

Button

Badge

Tooltip

ProgressBar (para uso del plan)

### Componentes de dominio

CurrentPlanCard

PlanGrid

PlanCard

PlanFeatureList

PlanUsageIndicator

## Integración con pagos

Si el cambio de plan implica un cobro, la vista de planes se integra con la lógica de pagos:

Al hacer clic en “Mejorar plan”:

El frontend llama a un endpoint del backend que:

Crea la preferencia de pago (por ejemplo, en Mercado Pago).

Devuelve la URL o el identificador necesario para completar el pago.

El frontend redirige al usuario al flujo de pago o abre un widget embebido, según el diseño.

Tras completar el pago:

El backend actualiza el plan del usuario.

El frontend puede:

Escuchar el resultado de la operación (webhook + polling, callback, etc.).

Mostrar una notificación de éxito o error.

Refrescar los datos del plan actual.

## Interacción con el estado global

La vista de Planes se apoya en:

PlanContext o hook usePlans para:

Cargar todos los planes disponibles.

Cargar el plan actual del usuario.

Ejecutar acciones de cambio de plan.

AuthContext para:

Obtener información del usuario actual si se requiere para la lógica de planes.

Flujo típico:

Al montar la pantalla, se cargan:

Plan actual.

Lista de planes disponibles.

El usuario revisa opciones y selecciona un plan.

Se ejecuta una acción:

Cambio directo de plan o

Inicio de flujo de pago.

Al finalizar, se actualiza el estado global y se muestra feedback al usuario.

## Responsividad

La vista de Planes debe funcionar bien en distintos dispositivos:

En móvil:

Las tarjetas de planes se muestran apiladas en una sola columna.

En tablets o pantallas medianas:

2 tarjetas por fila.

En pantallas grandes:

3 o más tarjetas por fila para una vista comparativa más amplia.

## Buenas prácticas

Resaltar claramente el plan actual del usuario.

Mostrar de forma transparente los límites del plan.

Indicar si el cambio de plan implica un cobro inmediato o se aplicará en la siguiente facturación.

Evitar sorpresas: mostrar siempre información clara de precio y condiciones antes de confirmar.