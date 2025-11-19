// @ts-check
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
        'arquitectura/seguridad',
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

    // 04. API Reference
    {
      type: 'category',
      label: '04. API Reference',
      collapsed: false,
      items: [
        'apis/autenticacion',
        'apis/usuarios',
        'apis/database-engines',
        'apis/database-instances',
        'apis/plans',
        'apis/subscriptions',
        'apis/pagos',
      ],
    },

    // 05. Backend
    {
      type: 'category',
      label: '05. Backend',
      collapsed: false,
      items: [
        'backend/configuracion',
        'backend/dockerfile',
      ],
    },

    // 06. Frontend
    {
      type: 'category',
      label: '06. Frontend',
      collapsed: false,
      items: [
        'frontend/dockerfile',
      ],
    },

    // 07. Pagos (Sandbox)
    {
      type: 'category',
      label: '07. Pagos (Sandbox)',
      collapsed: false,
      items: [
        'pagos/flujo',
      ],
    },

    // 08. Notificaciones
    {
      type: 'category',
      label: '08. Notificaciones',
      collapsed: false,
      items: [
        'notificaciones/credenciales',
      ],
    },

    // 09. Despliegue
    {
      type: 'category',
      label: '09. Despliegue',
      collapsed: false,
      items: [
        'despliegue/compose-local',
      ],
    },
  ],
};

export default sidebars;
