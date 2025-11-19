---
id: estilos
title: Estilos y Sistema de Diseño
---

# Estilos y Sistema de Diseño

El frontend de CrudCloud utiliza Tailwind CSS y un conjunto de componentes reutilizables para construir una interfaz moderna, consistente y fácil de mantener.

## Base de estilos

La configuración de estilos se organiza principalmente en:

src/styles/global.css

src/styles/variables.css (si aplica)

Configuración de Tailwind en tailwind.config.js

## Tailwind CSS como framework de utilidades

Tailwind se usa como framework de utilidades, lo que significa:

Estilos declarados mediante clases (p. ej. flex, gap-4, rounded-xl, bg-indigo-500).

Menos CSS a mano y más composición desde los componentes.

Diseño responsive mediante prefijos (sm:, md:, lg:, xl:, etc.).

## Componentes UI reutilizables

En src/components/ui/ se concentran los componentes base de la interfaz:

Botones (Button)

Inputs (Input, Textarea)

Contenedores (Card, Panel, Sheet)

Feedback (Alert, Badge, Toast, Skeleton)

Navegación (Tabs, Breadcrumbs, Pagination)

Ventajas:

Se evita repetir clases Tailwind en todas partes.

Se mantiene un look & feel consistente.

Es más fácil aplicar cambios globales de diseño.

## Animaciones y efectos

Para efectos visuales más avanzados, se pueden utilizar:

Librerías de animación (por ejemplo, Framer Motion).

Componentes personalizados como:

AnimatedGradient

GlassCard

ParticleBackground

ScrollProgress

Estos componentes encapsulan:

Lógica de animación.

Combinaciones complejas de clases Tailwind.

Efectos que pueden reutilizarse en distintas páginas (landing, dashboard, etc.).

## Temas y modo oscuro

El sistema de diseño contempla el soporte para modo oscuro y otras preferencias de UI.

Elementos típicos:

ThemeContext o hook useTheme para gestionar el tema actual.

Clases condicionales en el árbol principal de la app (html, body o un div raíz).

Uso de clases de Tailwind orientadas a tema (por ejemplo, dark:bg-slate-900 si está configurado).

## Diseño responsive

Gracias a los breakpoints de Tailwind, el diseño se adapta fácilmente a diferentes tamaños de pantalla.

Esto permite:

Una columna en móviles.

Dos columnas en pantallas medianas.

Tres columnas en pantallas grandes.

## Buenas prácticas

Para mantener los estilos del proyecto limpios y consistentes:

Reutilizar componentes de components/ui siempre que sea posible.

Definir tokens de diseño (colores, radios, sombras) en la configuración de Tailwind o archivos de variables.

Evitar estilos inline CSS cuando pueden representarse con clases Tailwind.

Mantener el CSS global al mínimo; la mayoría de estilos deben vivir en los componentes.