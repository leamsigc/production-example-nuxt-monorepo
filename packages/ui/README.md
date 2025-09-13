# @local-monorepo/ui

UI Layer - Base UI components and design system for the application.

## Overview

This layer provides the foundational UI components and design system used across all other layers in the monorepo.

### Features

- **Nuxt UI Integration**: Built on top of Nuxt UI framework
- **Component Library**: Comprehensive set of reusable UI components
- **Base- Prefixed Components**: All components use Base- prefix (e.g., `BaseButton.vue`)
- **Proxy Components**: Components that proxy to Nuxt UI with consistent naming
- **Design System**: Consistent styling and theming across the application

### Architecture

- Uses Nuxt UI as the underlying component library
- Exposes components with `Base-` prefix for consistency
- Example: `BaseButton.vue` proxies to Nuxt UI's `Button.vue`
- Maintains consistent API and styling across all layers

## Setup

Make sure to install the dependencies:

```bash
pnpm install
```

## Development

Start the development server:

```bash
pnpm dev
```

## Scripts

- `pnpm dev` - Start development server with playground
- `pnpm build` - Build the layer
- `pnpm lint` - Run ESLint

## Modules

- `@nuxt/ui` - Core UI framework
- `@nuxt/image` - Image optimization
- `@nuxt/scripts` - Script management
- `@nuxt/test-utils` - Testing utilities
