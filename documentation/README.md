# CrudCloud Backend Documentation

Official comprehensive documentation for the **CrudCloud Backend** - A secure, scalable REST API built with Spring Boot 3.5.7, PostgreSQL, and JWT authentication.

## 📚 Documentation Overview

This documentation site is built using [Docusaurus 3.9.2](https://docusaurus.io/), providing clear guides for setup, architecture understanding, development workflow, and API reference.

### What's Included

- **Getting Started** - Installation, configuration, and first run
- **Architecture** - Layered design patterns and project structure
- **Development Guide** - Workflow, conventions, and testing strategies
- **API Reference** - Complete endpoint documentation (Auth, Users, Products, Orders, Payments)
- **ROADMAP Integration** - 7-phase development guide with code examples

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ or Yarn 1.22+
- Git

### Installation

```bash
# Install dependencies
yarn install
# or
npm install
```

### Local Development

```bash
yarn start
# or
npm start
```

Starts a local development server at `http://localhost:3000` with live reload for most changes.

### Build for Production

```bash
yarn build
# or
npm build
```

Generates optimized static content into the `build` directory for deployment.

## 📁 Documentation Structure

```
docs/
├── intro.md                           # Introduction to CrudCloud
├── 01-guia-inicio/                    # Getting Started Guide
│   ├── requisitos.md                  # Requirements & troubleshooting
│   ├── instalacion.md                 # Setup & configuration
│   ├── configuracion.md               # Environment variables
│   └── primer-run.md                  # First run verification
├── 02-arquitectura/                   # Architecture & Design
│   ├── resumen.md                     # Architecture overview
│   ├── estructura-proyecto.md          # Project structure
│   └── dependencias.md                # Maven dependencies
├── 03-desarrollo/                     # Development Workflow
│   ├── guia-desarrollo.md             # Development guide
│   ├── convenciones.md                # Code conventions
│   └── testing.md                     # Testing strategies
└── 04-api/                            # API Reference
    ├── autenticacion.md               # Authentication endpoints
    ├── usuarios.md                    # User management
    ├── productos.md                   # Product operations
    ├── ordenes.md                     # Order management
    └── pagos.md                       # Payment processing
```

## 🛠️ Tech Stack

- **Frontend**: React 19.0.0, Docusaurus 3.9.2
- **Backend**: Spring Boot 3.5.7, PostgreSQL 14+
- **Authentication**: JWT (jjwt 0.12.3)
- **Payments**: Mercado Pago SDK 2.1.26
- **Build**: Maven, Yarn
- **Containerization**: Docker, Jib

## 📖 Content Statistics

- **16 Markdown files** with 3,997 total lines
- **5 main sections** covering setup to API reference
- **Phases 1-5** of development roadmap documented
- **Spanish (default) + English (i18n)** support

## 🔄 Deployment

### Deploy to GitHub Pages (SSH)

```bash
USE_SSH=true yarn deploy
```

### Deploy to GitHub Pages (HTTPS)

```bash
GIT_USER=<your_github_username> yarn deploy
```

### Custom Deployment

The `build` directory contains static HTML/CSS/JS ready for any hosting service:

```bash
yarn build
# Upload 'build' directory to your hosting
```

## 📝 Writing Documentation

### Adding New Pages

1. Create a new `.md` file in the appropriate `docs/` subdirectory
2. Add frontmatter:
   ```md
   ---
   sidebar_position: 1
   title: Your Page Title
   description: Brief description
   ---

   # Your Content Here
   ```

3. Update `sidebars.js` if needed

### Using Code Blocks

Supported languages: Java, Bash, JSON, YAML, SQL, Properties, JavaScript

````md
```java
@Service
public class UserService {
    // Your code here
}
```
````

## 🔗 Related Resources

- **ROADMAP.md** - Comprehensive 7-phase development guide with complete code examples
- **Backend Repository** - [Crudcloud_Backend](../Crudcloud_Backend/)
- **Spring Boot Docs** - https://docs.spring.io/spring-boot/
- **Docusaurus Guide** - https://docusaurus.io/docs/category/guides

## 📞 Support & Contributions

For documentation improvements or corrections:

1. Create a branch for your changes
2. Update relevant `.md` files
3. Test locally with `yarn start`
4. Submit a pull request with clear descriptions

## 📋 Future Enhancements

Planned documentation sections:
- Deployment & Docker containerization
- Security best practices & advanced JWT
- Troubleshooting & FAQ
- Advanced testing strategies
- CI/CD configuration

## 📄 License

Documentation is part of the CrudCloud Backend project.

## 👨‍💻 Development Info

- **Package Manager**: Yarn (recommended) or npm
- **Node Version**: 18+ (check `.nvmrc` or `package.json`)
- **Node Modules**: Listed in `package.json`
- **Configuration**: `docusaurus.config.js`, `sidebars.js`

---

**Last Updated**: 2025-11-07
**Maintained by**: CrudCloud Development Team
