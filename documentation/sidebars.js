// @ts-check

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/**
 * @type {import('@docusaurus/plugin-content-docs').SidebarsConfig}
 */
const sidebars = {
  documentationSidebar: [
    'intro',

    // 01. Guía de Inicio
    {
      type: 'category',
      label: '01. Guia de Inicio',
      collapsed: false,
      items: [
        'guia-inicio/requisitos',
        'guia-inicio/instalacion',
        'guia-inicio/configuracion',
        'guia-inicio/primer-run',
        // NUEVO: Variables de entorno (backend / frontend)
        'guia-inicio/variables-entorno',
      ],
    },

    // 02. Arquitectura
    {
      type: 'category',
      label: '02. Arquitectura',
      collapsed: false,
      items: [
        'arquitectura/resumen',
        'arquitectura/estructura-proyecto',
        'arquitectura/dependencias',
        // NUEVO: Seguridad (JWT, CORS, roles futuros)
        'arquitectura/seguridad',
        // NUEVO: Modelo de datos (entidades/relaciones)
        'arquitectura/modelo-datos',
      ],
    },

    // 03. Desarrollo
    {
      type: 'category',
      label: '03. Desarrollo',
      collapsed: false,
      items: [
        'desarrollo/guia-desarrollo',
        'desarrollo/convenciones',
        'desarrollo/testing',
      ],
    },

    // 04. API Reference (lo que ya tenías)
    {
      type: 'category',
      label: '04. API Reference',
      collapsed: false,
      items: [
        'api/autenticacion',
        'api/usuarios',
        'api/database-instances',
        'api/subscriptions',
        'api/plans',
        'api/database-engines',
        'api/pagos',
      ],
    },

    // NUEVO: Backend
    {
      type: 'category',
      label: '05. Backend',
      collapsed: false,
      items: [
        'backend/configuracion',          // perfiles, properties, env
        'backend/dockerfile',             // Dockerfile prod + run
        'backend/openapi-swagger',        // cómo acceder a swagger-ui / v3 docs
        'backend/orquestacion-instancias',// estados, acciones, contrato
        'backend/errores-excepciones',    // ControllerAdvice, manejo de errores
      ],
    },

    // NUEVO: Frontend
    {
      type: 'category',
      label: '06. Frontend',
      collapsed: false,
      items: [
        'frontend/rutas',                 // router, rutas protegidas
        'frontend/auth-jwt',              // almacenamiento token, expiración
        'frontend/servicios-api',         // axios, VITE_API_BASE_URL
        'frontend/dockerfile',            // Dockerfile nginx
        'frontend/build-deploy',          // build, envs y despliegue
      ],
    },

    // NUEVO: Pagos (Sandbox)
    {
      type: 'category',
      label: '07. Pagos (Sandbox)',
      collapsed: false,
      items: [
        'pagos-sandbox/flujo',            // preferencia -> retorno -> webhook -> plan
        'pagos-sandbox/pruebas',          // tarjetas de prueba, callbacks locales
        'pagos-sandbox/webhooks',         // idempotencia, payloads de ejemplo
      ],
    },

    // NUEVO: Notificaciones & PDF
    {
      type: 'category',
      label: '08. Notificaciones',
      collapsed: false,
      items: [
        'notificaciones/correos',         // creación instancia, rotación, cambio plan
        'notificaciones/credenciales-pdf',// contraseña visible una vez
        'notificaciones/plantillas',      // estilos/branding y reutilización
      ],
    },

    // NUEVO: Despliegue
    {
      type: 'category',
      label: '09. Despliegue',
      collapsed: false,
      items: [
        'despliegue/compose-local',       // docker-compose local
        'despliegue/reverse-proxy',       // nginx/traefik, rutas y puertos
        'despliegue/https',               // certificados, renovación
        'despliegue/variables-entorno-prod', // .env en VPS, secretos
        'despliegue/proceso-despliegue',  // guía paso a paso + rollback
        'despliegue/verificacion-final',  // checklist de subdominios/health
      ],
    },

    // NUEVO: Troubleshooting
    {
      type: 'category',
      label: '10. Troubleshooting',
      collapsed: false,
      items: [
        'troubleshooting/db-containers',   // SQL Server 255, Cassandra 143, puertos
        'troubleshooting/cors-auth',       // 401/403, CORS
        'troubleshooting/timeouts',        // axios, backend
        'troubleshooting/puertos',         // conflictos de puertos
      ],
    },

    // NUEVO: Contribución / Estándares
    {
      type: 'category',
      label: '11. Contribución',
      collapsed: false,
      items: [
        'contribucion/git-flow',
        'contribucion/commits',
        'contribucion/prs-ci',
      ],
    },
  ],
};

export default sidebars;
