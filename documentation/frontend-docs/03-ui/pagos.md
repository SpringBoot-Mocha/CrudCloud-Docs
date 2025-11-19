---
id: pagos
title: Pagos y Checkout
--- 

# Pagos y Checkout

La vista de Pagos (o sección de facturación/checkout) se encarga de integrar el frontend de CrudCloud con el sistema de cobro definido en el backend (por ejemplo, Mercado Pago), permitiendo al usuario:

Iniciar el proceso de pago para un plan o suscripción.

Revisar información básica de facturación asociada a su cuenta.

Ver el estado de pagos recientes (si el backend lo expone).

Gestionar acciones relacionadas con la suscripción (renovaciones, upgrades, etc.).

La lógica de negocio y la integración directa con el proveedor de pagos (como Mercado Pago) se manejan desde el backend.
El frontend consume endpoints del backend para iniciar y visualizar el estado de los pagos.

## Objetivos de la sección de Pagos

Ofrecer una experiencia de pago clara y segura.

Minimizar la fricción al momento de hacer upgrade de plan o contratar servicios.

Mostrar información suficiente para que el usuario entienda qué está pagando y por qué.

Evitar exponer directamente credenciales o lógica sensible en el frontend.

## Flujo típico de pago

Aunque los detalles exactos dependen de la implementación del backend, un flujo común es:

1. El usuario selecciona un plan o acción que requiere pago (por ejemplo, “Mejorar a Pro”).

2. El frontend llama a un endpoint del backend, por ejemplo:

POST /api/payments/checkout
con información del plan seleccionado.

3. El backend:

Crea una preferencia de pago (por ejemplo, en Mercado Pago).

Devuelve al frontend:

Una URL de checkout (para redirección)
o

Un identificador/objeto para montar un widget/SDK de pago.

4. El frontend:

Redirige al usuario a la página de pago externa
o

Renderiza el widget de pago dentro de la aplicación.

5. Tras el pago:

El proveedor de pago notifica al backend (webhook).

El backend actualiza el estado del pago y el plan del usuario.

El frontend consulta el estado y muestra feedback al usuario.

## Componentes de la UI de Pagos

Dependiendo del diseño, la sección de Pagos puede incluir:

1. Resumen del cobro

Una tarjeta con la información del pago antes de confirmar:

Nombre del plan o servicio.

Precio.

Periodicidad (mensual/anual, si aplica).

Moneda.

Impuestos o cargos adicionales (si los hay).

Total a pagar.

Objetivo: dejar claro qué se va a pagar y cuánto.

2. Botón de iniciar pago

Un botón que desencadena la llamada al backend, por ejemplo:

Iniciar pago

Ir a checkout

Confirmar y pagar

Este botón debe:

Deshabilitarse mientras se procesa la petición.

Mostrar una indicación de carga si el backend está generando la preferencia de pago.

3. Integración con el proveedor de pago

El frontend se integra con el proveedor a través del backend, por ejemplo:

Redireccionando a la URL de checkout recibida del backend:

window.location.href = checkoutUrl;

O utilizando un componente/SDK si la lógica está embebida.

Es importante que:

El frontend no exponga credenciales secretas (public key sí, secret key nunca).

Las claves sensibles siempre se mantengan en el backend o en variables de entorno seguras.

4. Feedback de resultado

Tras completar (o cancelar) un pago, el usuario debería ver:

Éxito: mensaje claro y actualización de su plan o servicio.

Error: descripción del problema y opción para reintentar o contactar soporte.

Pendiente: si el pago se encuentra en verificación o espera.

Esto se puede manejar con:

Páginas de retorno dedicadas (por ejemplo, /payment/success, /payment/failure).

Modales o toasts de notificación.

Actualización de la vista de Planes para reflejar el nuevo estado.

## Estados de pago

Aunque los estados concretos dependen del backend y del proveedor de pago, algunos ejemplos comunes son:

pending – pago creado, a la espera de confirmación.

approved – pago confirmado con éxito.

rejected – pago rechazado.

cancelled – pago cancelado por el usuario o por el sistema.

refunded – pago devuelto.

El frontend:

Muestra mensajes y estilos distintos según el estado.

Puede usar badges de colores para indicar cada estado.

## Interacción con el backend

La sección de Pagos se soporta en uno o varios servicios del frontend, por ejemplo:

paymentService.startCheckout(planId)

paymentService.getPaymentStatus(paymentId)

paymentService.getInvoices() (si aplica)

Estos servicios usan el cliente HTTP configurado en src/api/ y encapsulan todas las llamadas a:

/api/payments/...

/api/billing/...

## Seguridad y buenas prácticas

Nunca exponer secret keys en el frontend.

Validar siempre del lado del backend el plan, el monto y la moneda.

No confiar únicamente en lo que llegue del frontend para registrar un pago como exitoso.

Usar HTTPS en producción para proteger la información de los usuarios.

Mostrar información clara y honesta al usuario sobre precios y condiciones.

## Responsividad

La sección de Pagos debe ser usable en:

Escritorio: tarjetas y resúmenes bien distribuidos.

Móvil: diseño apilado, botones grandes y textos claros.

