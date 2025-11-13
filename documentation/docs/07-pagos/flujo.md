
## 6) `docs/06-pagos-sandbox/flujo.md`

```md
---
sidebar_position: 1
title: Flujo de Pagos (Sandbox)
---

> **IMPORTANTE**: Todos los pagos son **ficticios** (Sandbox). **Nunca** se cobra dinero real.

1. Usuario elige plan → se crea preferencia (monto ficticio).
2. Mercado Pago Sandbox redirige a `success/failure`.
3. Webhook (Sandbox) notifica estado.
4. Si `approved` → se actualiza plan.
5. Historial de transacciones de prueba.

Incluye ejemplos de payload del webhook y cómo probarlo en local/túnel.
