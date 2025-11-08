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
        'guia-inicio/requisitos',
        'guia-inicio/instalacion',
        'guia-inicio/configuracion',
        'guia-inicio/primer-run',
      ],
    },
    {
      type: 'category',
      label: '02. Arquitectura',
      collapsed: false,
      items: [
        'arquitectura/resumen',
        'arquitectura/estructura-proyecto',
        'arquitectura/dependencias',
      ],
    },
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
    {
      type: 'category',
      label: '04. API Reference',
      collapsed: false,
      items: [
        'api/autenticacion',
        'api/usuarios',
        'api/productos',
        'api/ordenes',
        'api/pagos',
      ],
    },
  ],
};

export default sidebars;
