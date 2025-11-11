// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import {themes as prismThemes} from 'prism-react-renderer';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'CrudCloud Backend',
  tagline: 'Documentacion oficial del backend de CrudCloud',
  favicon: 'img/favicon.ico',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: 'https://your-docusaurus-site.example.com',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'CrudCloud', // Usually your GitHub org/user name.
  projectName: 'crudcloud-backend', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: './sidebars.js',
          routeBasePath: 'docs',
          // Remove edit URL for now
          editUrl: undefined,
        },
        blog: false, // Disable blog
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: 'img/crudcloud-social-card.jpg',
      colorMode: {
        defaultMode: 'light',
        disableSwitch: false,
        respectPrefersColorScheme: true,
      },
      navbar: {
        title: 'CrudCloud Backend',
        logo: {
          alt: 'CrudCloud Logo',
          src: 'img/logo.svg',
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'documentationSidebar',
            position: 'left',
            label: 'Documentacion',
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
