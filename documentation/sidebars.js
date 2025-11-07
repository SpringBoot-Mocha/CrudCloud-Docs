// @ts-check

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.

 @type {import('@docusaurus/plugin-content-docs').SidebarsConfig}
 */
const sidebars = {
  documentationSidebar: [
    'intro',
    {
      type: 'category',
      label: '01. Guia de Inicio',
      collapsed: false,
      items: [
        '01-guia-inicio/requisitos',
        '01-guia-inicio/instalacion',
        '01-guia-inicio/configuracion',
        '01-guia-inicio/primer-run',
      ],
    },
    {
      type: 'category',
      label: '02. Arquitectura',
      collapsed: false,
      items: [
        '02-arquitectura/resumen',
        '02-arquitectura/estructura-proyecto',
        '02-arquitectura/dependencias',
      ],
    },
    {
      type: 'category',
      label: '03. Desarrollo',
      collapsed: false,
      items: [
        '03-desarrollo/guia-desarrollo',
        '03-desarrollo/convenciones',
        '03-desarrollo/testing',
      ],
    },
    {
      type: 'category',
      label: '04. API Reference',
      collapsed: false,
      items: [
        '04-api/autenticacion',
        '04-api/usuarios',
        '04-api/productos',
        '04-api/ordenes',
        '04-api/pagos',
      ],
    },
    {
      type: 'category',
      label: '05. Deployment',
      collapsed: false,
      items: [
        '05-deployment/produccion',
        '05-deployment/docker',
        '05-deployment/variables-entorno',
      ],
    },
  ],
};

export default sidebars;
