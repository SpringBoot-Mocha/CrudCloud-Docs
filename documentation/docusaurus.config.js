// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import {themes as prismThemes} from 'prism-react-renderer';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'CrudCloud',
  tagline: 'Documentacion oficial de CrudCloud',
  favicon: 'img/favicon.ico',

  future: {
    v4: true,
  },

  url: 'https://your-docusaurus-site.example.com',
  baseUrl: '/',

  organizationName: 'CrudCloud',
  projectName: 'crudcloud-backend',

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        // 👉 ESTE ES EL DOCS DEL BACKEND (YA EXISTENTE)
        docs: {
          sidebarPath: './sidebars.js',
          routeBasePath: 'docs',
          editUrl: undefined,
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  // 👉 NUEVO: plugin de docs para el FRONTEND
  plugins: [
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'frontend',
        path: 'frontend-docs',          // carpeta que vamos a crear
        routeBasePath: 'frontend',      // URL base: /frontend
        sidebarPath: './sidebarsFrontend.js',
        editUrl: undefined,
      },
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      image: 'img/crudcloud-social-card.jpg',
      colorMode: {
        defaultMode: 'light',
        disableSwitch: false,
        respectPrefersColorScheme: true,
      },
      navbar: {
        title: 'CrudCloud',
        logo: {
          alt: 'CrudCloud Logo',
          src: 'img/logo.svg',
        },
        items: [
          // 👉 BACKEND (lo que ya tenías)
          {
            type: 'docSidebar',
            sidebarId: 'documentationSidebar',
            position: 'left',
            label: 'Backend',
          },
          // 👉 NUEVO: enlace a la doc del FRONTEND
          {
            to: '/frontend/intro',
            label: 'Frontend',
            position: 'left',
          },
          {
            type: 'localeDropdown',
            position: 'right',
          },
          {
            href: 'https://github.com/CrudCloud/backend',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Documentacion',
            items: [
              {
                label: 'Introduccion',
                to: '/docs/intro',
              },
              {
                label: 'Guia de Inicio',
                to: '/docs/guia-inicio/requisitos',
              },
              {
                label: 'API Reference',
                to: '/docs/api/autenticacion',
              },
            ],
          },
          {
            title: 'Tecnologias',
            items: [
              {
                label: 'Java 21',
                href: 'https://www.oracle.com/java/technologies/downloads/#java21',
              },
              {
                label: 'Spring Boot',
                href: 'https://spring.io/projects/spring-boot',
              },
              {
                label: 'PostgreSQL',
                href: 'https://www.postgresql.org/',
              },
            ],
          },
          {
            title: 'Mas',
            items: [
              {
                label: 'GitHub',
                href: 'https://github.com/CrudCloud/backend',
              },
              {
                label: 'Mercado Pago Docs',
                href: 'https://www.mercadopago.com.co/developers',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} CrudCloud. Backend con Spring Boot 3.5.7 y Java 21.`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
        additionalLanguages: ['java', 'bash', 'json', 'yaml', 'sql', 'properties'],
      },
      docs: {
        sidebar: {
          hideable: true,
          autoCollapseCategories: true,
        },
      },
    }),
};

export default config;
