// @ts-check
/**
 * @type {import('@docusaurus/plugin-content-docs').SidebarsConfig}
 */
const sidebars = {
  frontendSidebar: [
    'intro',

    // 01. Guía de Inicio (Frontend)
    {
      type: 'category',
      label: '01. Guia de Inicio (Frontend)',
      collapsed: false,
      items: [
        'guia-inicio/requisitos',
        'guia-inicio/instalacion',
        'guia-inicio/configuracion',
        'guia-inicio/ejecucion',
      ],
    },

    // 02. Arquitectura (Frontend)
    {
      type: 'category',
      label: '02. Arquitectura (Frontend)',
      collapsed: false,
      items: [
        'arquitectura/resumen',
        'arquitectura/estructura-proyecto',
        'arquitectura/ruteo',
        'arquitectura/estilos',
      ],
    },

    // 03. UI & Features
    {
      type: 'category',
      label: '03. UI & Features',
      collapsed: false,
      items: [
        'ui/dashboard',
        'ui/instancias',
        'ui/planes',
        'ui/pagos',
      ],
    },

    // 04. Autenticación
    {
      type: 'category',
      label: '04. Autenticacion',
      collapsed: false,
      items: [
        'autenticacion/overview',
        'autenticacion/login',
        'autenticacion/auth-context',
      ],
    },
  ],
};

export default sidebars;
