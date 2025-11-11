<div align="center">

# CrudCloud Documentation

### Official Documentation for CrudCloud Backend API

[![Docusaurus](https://img.shields.io/badge/Docusaurus-3.9.2-green.svg)](https://docusaurus.io/)
[![Node](https://img.shields.io/badge/Node-18+-brightgreen.svg)](https://nodejs.org/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Build Status](https://img.shields.io/badge/Build-Passing-success.svg)](https://github.com)

[View Documentation](#documentation-structure) • [Quick Start](#quick-start) • [Contributing](#contributing) • [Deployment](#deployment)

</div>

---

## Overview

This repository contains the **official comprehensive documentation** for **CrudCloud Backend** - a secure, production-ready SaaS platform for automated database provisioning in Docker containers built with Spring Boot 3.5.7 and Java 21.

### What is CrudCloud?

CrudCloud is a Database-as-a-Service (DBaaS) platform that enables automated provisioning and management of database instances through Docker containerization. It provides:

- **Multi-Engine Support**: MySQL, PostgreSQL, MongoDB, Redis, SQL Server, Cassandra
- **Subscription Management**: Tiered plans (Free, Standard, Premium) with usage-based limits
- **Secure Authentication**: JWT-based authentication with Spring Security
- **Payment Processing**: Integrated Mercado Pago for subscription billing
- **Docker Orchestration**: Automated container lifecycle management
- **RESTful API**: Complete OpenAPI/Swagger documented endpoints

---

## Documentation Structure

This documentation site is built with [Docusaurus 3.9.2](https://docusaurus.io/) and organized into the following sections:

```
docs/
├── intro.md                           # Introduction to CrudCloud
├── 01-guia-inicio/                    # Getting Started Guide
│   ├── requisitos.md                  # Prerequisites & system requirements
│   ├── instalacion.md                 # Installation & setup
│   ├── configuracion.md               # Environment configuration
│   └── primer-run.md                  # First run verification
├── 02-arquitectura/                   # Architecture & Design
│   ├── resumen.md                     # Architecture overview
│   ├── estructura-proyecto.md         # Project structure
│   └── dependencias.md                # Maven dependencies
├── 03-desarrollo/                     # Development Workflow
│   ├── guia-desarrollo.md             # Development guide
│   ├── convenciones.md                # Code conventions
│   └── testing.md                     # Testing strategies
└── 04-api/                            # API Reference
    ├── autenticacion.md               # Authentication endpoints
    ├── usuarios.md                    # User management
    ├── database-instances.md          # Database instance operations
    ├── subscriptions.md               # Subscription management
    ├── plans.md                       # Plan information
    ├── database-engines.md            # Database engine catalog
    └── pagos.md                       # Payment processing
```

### Content Overview

- **14+ Markdown files** with comprehensive API documentation
- **4 main sections** covering installation to API reference
- **Spanish (default) + English (i18n)** multilingual support
- **Code examples** in Java, Bash, JSON, YAML, SQL
- **Interactive navigation** with Docusaurus sidebar

---

## Prerequisites

Before running the documentation site, ensure you have:

- **Node.js** 18.0 or higher ([Download](https://nodejs.org/))
- **npm** 9.0+ or **Yarn** 1.22+ (package managers)
- **Git** (for cloning the repository)

### Optional Tools

- **VS Code** with [Docusaurus Extension](https://marketplace.visualstudio.com/items?itemName=Docusaurus.docusaurus-vscode)
- **Browser** with React DevTools for debugging

---

## Quick Start

### Installation

```bash
# Clone the repository
git clone <your-repository-url>
cd CrudCloud-Docs/documentation

# Install dependencies
npm install
# or
yarn install
```

### Local Development

```bash
# Start development server
npm start
# or
yarn start
```

This command starts a local development server at `http://localhost:3000` and opens your browser. Most changes are reflected live without having to restart the server.

### Build for Production

```bash
# Generate static files
npm run build
# or
yarn build
```

This command generates static content into the `build` directory, which can be served using any static hosting service.

### Testing the Build Locally

```bash
# Serve the build locally
npm run serve
# or
yarn serve
```

Serves the production build at `http://localhost:3000` for testing before deployment.

---

## Development Workflow

### Project Structure

```
documentation/
├── docs/                    # Documentation markdown files
├── src/                     # Custom React components
│   ├── components/          # Reusable components
│   ├── css/                 # Custom stylesheets
│   └── pages/               # Custom pages
├── static/                  # Static assets (images, files)
│   ├── img/                 # Images and icons
│   └── files/               # Downloadable resources
├── blog/                    # Blog posts (optional)
├── docusaurus.config.js     # Docusaurus configuration
├── sidebars.js              # Sidebar navigation structure
├── package.json             # Node.js dependencies
└── README.md                # This file
```

### Adding New Documentation

1. **Create a new Markdown file** in the appropriate `docs/` subdirectory:

```bash
touch docs/04-api/new-endpoint.md
```

2. **Add frontmatter** at the top of the file:

```markdown
---
sidebar_position: 5
title: New Endpoint Documentation
description: Description of the new endpoint
---

# New Endpoint

Your content here...
```

3. **Update `sidebars.js`** if manual configuration is needed:

```javascript
module.exports = {
  documentationSidebar: [
    'intro',
    {
      type: 'category',
      label: 'API Reference',
      items: ['api/autenticacion', 'api/new-endpoint'],
    },
  ],
};
```

4. **Test locally** with `npm start`

### Markdown Features

Docusaurus supports enhanced Markdown features:

#### Code Blocks with Syntax Highlighting

````markdown
```java
@RestController
@RequestMapping("/api/v1")
public class UserController {
    // Controller code
}
```
````

Supported languages: `java`, `javascript`, `typescript`, `bash`, `json`, `yaml`, `sql`, `xml`, `properties`

#### Admonitions

```markdown
:::note
This is a note
:::

:::tip
This is a helpful tip
:::

:::warning
This is a warning
:::

:::danger
This is a danger alert
:::
```

#### Code Tabs

````markdown
```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="npm" label="npm">
    npm install
  </TabItem>
  <TabItem value="yarn" label="Yarn">
    yarn install
  </TabItem>
</Tabs>
```
````

---

## Configuration

### Docusaurus Configuration

The main configuration is in `docusaurus.config.js`:

```javascript
const config = {
  title: 'CrudCloud Backend',
  tagline: 'Official Backend Documentation',
  url: 'https://your-docs-site.com',
  baseUrl: '/',
  organizationName: 'CrudCloud',
  projectName: 'crudcloud-backend',
  // ... more config
};
```

### Sidebar Configuration

Sidebar navigation is defined in `sidebars.js`:

```javascript
module.exports = {
  documentationSidebar: [
    'intro',
    {
      type: 'category',
      label: 'Getting Started',
      items: ['guia-inicio/requisitos', 'guia-inicio/instalacion'],
    },
  ],
};
```

### Internationalization (i18n)

This site supports multiple languages. Current locales:

- **Spanish (es)** - Default
- **English (en)** - Available

To add translations:

```bash
# Copy docs to i18n folder
npm run write-translations -- --locale en

# Translate files in i18n/en/docusaurus-plugin-content-docs/current/
```

---

## Deployment

### Deploy to GitHub Pages

#### Option 1: Using SSH

```bash
USE_SSH=true npm run deploy
```

#### Option 2: Using HTTPS

```bash
GIT_USER=<your-github-username> npm run deploy
```

### Deploy to Custom Hosting

The `build` directory contains production-ready static files:

```bash
# Build the site
npm run build

# Upload 'build' directory to your hosting provider
# Examples: Netlify, Vercel, AWS S3, Azure Static Web Apps
```

### Continuous Deployment

Example GitHub Actions workflow (`.github/workflows/deploy.yml`):

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm ci
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./build
```

---

## Tech Stack

### Core Technologies

| Technology      | Version | Purpose                    |
| --------------- | ------- | -------------------------- |
| **Docusaurus**  | 3.9.2   | Documentation framework    |
| **React**       | 19.0.0  | UI library                 |
| **Node.js**     | 18+     | JavaScript runtime         |
| **MDX**         | 3.x     | Enhanced Markdown          |
| **Prism**       | -       | Code syntax highlighting   |

### Backend (Documented System)

| Technology         | Version | Purpose                  |
| ------------------ | ------- | ------------------------ |
| **Spring Boot**    | 3.5.7   | Backend framework        |
| **Java**           | 21      | Programming language     |
| **PostgreSQL**     | 15+     | Database                 |
| **Docker**         | 20.10+  | Container orchestration  |
| **JWT**            | 0.12.3  | Authentication           |
| **Mercado Pago**   | 2.1.26  | Payment processing       |

---

## Contributing

We welcome contributions to improve the documentation! Here's how you can help:

### Reporting Issues

1. **Check existing issues** to avoid duplicates
2. **Create a new issue** with a descriptive title
3. **Include details**: screenshots, steps to reproduce, expected vs actual behavior

### Submitting Changes

1. **Fork the repository**

```bash
git clone https://github.com/your-username/CrudCloud-Docs.git
cd CrudCloud-Docs/documentation
```

2. **Create a feature branch**

```bash
git checkout -b docs/improve-api-section
```

3. **Make your changes**
   - Follow existing markdown style
   - Test locally with `npm start`
   - Check for broken links

4. **Commit with clear messages**

```bash
git commit -m "docs: improve API authentication examples"
```

5. **Push and create Pull Request**

```bash
git push origin docs/improve-api-section
```

### Contribution Guidelines

- **Follow Markdown best practices**: Use proper heading hierarchy, code formatting
- **Test all examples**: Ensure code snippets are accurate and tested
- **Keep content concise**: Focus on clarity and precision
- **Add screenshots** when helpful for UI/UX explanations
- **Update table of contents** if adding new sections
- **Maintain consistent style**: Follow existing documentation patterns

---

## Scripts Reference

Common npm/yarn commands:

```bash
# Development
npm start              # Start dev server
npm run build          # Build for production
npm run serve          # Serve production build locally

# Deployment
npm run deploy         # Deploy to GitHub Pages

# Utilities
npm run clear          # Clear Docusaurus cache
npm run write-translations  # Generate translation files
npm run write-heading-ids   # Auto-generate heading IDs

# Linting & Formatting
npm run lint           # Lint markdown files
npm run format         # Format with Prettier
```

---

## Troubleshooting

### Common Issues

#### Port 3000 Already in Use

```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use a different port
npm start -- --port 3001
```

#### Build Errors

```bash
# Clear cache and rebuild
npm run clear
rm -rf node_modules package-lock.json
npm install
npm run build
```

#### Broken Links

```bash
# Enable link checking
npm run build -- --check-links
```

---

## Related Resources

### Official Documentation

- **CrudCloud Backend Repository**: [GitHub](https://github.com/crudzaso/CrudCloud-Backend)
- **Spring Boot Documentation**: [https://spring.io/projects/spring-boot](https://spring.io/projects/spring-boot)
- **Docusaurus Documentation**: [https://docusaurus.io/docs](https://docusaurus.io/docs)

### Tools & Libraries

- **Mercado Pago Developers**: [https://www.mercadopago.com/developers](https://www.mercadopago.com/developers)
- **Docker Documentation**: [https://docs.docker.com/](https://docs.docker.com/)
- **JWT.io**: [https://jwt.io/](https://jwt.io/)

---

## Performance & SEO

### Optimization Tips

- **Image optimization**: Use WebP format for images
- **Code splitting**: Automatically handled by Docusaurus
- **Lazy loading**: Components load on demand
- **Static generation**: All pages pre-rendered for fast load times

### SEO Configuration

Update `docusaurus.config.js` for better SEO:

```javascript
module.exports = {
  title: 'CrudCloud Documentation',
  tagline: 'Your tagline here',
  url: 'https://your-site.com',
  favicon: 'img/favicon.ico',
  // OpenGraph metadata
  metadata: [
    {name: 'keywords', content: 'crudcloud, database, saas, spring boot'},
    {name: 'description', content: 'Official CrudCloud documentation'},
  ],
};
```

---

## Support & Community

### Getting Help

- **GitHub Issues**: [Report bugs or request features](https://github.com/crudzaso/CrudCloud-Docs/issues)
- **Documentation Questions**: Create an issue with the `question` label
- **Backend Issues**: Report to the [backend repository](https://github.com/crudzaso/CrudCloud-Backend/issues)

### Contact

- **Email**: support@crudcloud.com (if applicable)
- **Documentation Team**: docs@crudcloud.com (if applicable)

---

## License

This documentation is part of the CrudCloud project and is licensed under the MIT License. See the [LICENSE](../LICENSE) file for details.

---

## Changelog

### Version 1.1.0 (2025-11-10)

- Updated documentation to reflect current backend implementation
- Added comprehensive API reference for Database Instances, Subscriptions, Plans
- Improved README with industry-standard structure
- Enhanced Getting Started guides
- Added deployment documentation

### Version 1.0.0 (2025-11-07)

- Initial documentation release
- Basic API documentation
- Architecture overview
- Installation guides

---

<div align="center">

**Built with Docusaurus • Maintained by CrudCloud Team**

[Report Issue](https://github.com/crudzaso/CrudCloud-Docs/issues) • [Request Feature](https://github.com/crudzaso/CrudCloud-Docs/issues/new) • [View Backend](https://github.com/crudzaso/CrudCloud-Backend)

</div>
