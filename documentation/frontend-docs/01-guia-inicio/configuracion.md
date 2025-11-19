---
id: configuracion
title: Configuración
---

# Configuración del Frontend

Antes de ejecutar el frontend de CrudCloud, necesitas configurar las variables de entorno.

## Archivo de variables de entorno

Copia el archivo de ejemplo:


cp .env.example .env.local

Luego edita .env.local con los valores correctos para tu entorno.
Un ejemplo básico puede ser:

VITE_API_BASE_URL=http://localhost:8080/api
VITE_APP_NAME=CrudCloud
VITE_APP_ENV=local
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_PAYMENTS=false

    Ajusta VITE_API_BASE_URL a la URL donde esté corriendo el backend de CrudCloud (local o en servidor).

Consideraciones

    En entornos de desarrollo, normalmente usarás http://localhost:8080/api.

    En entornos de pruebas o producción, debes apuntar a la URL pública del backend.

    No subas el archivo .env.local al repositorio.