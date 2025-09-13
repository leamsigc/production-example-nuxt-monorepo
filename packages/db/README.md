# @local-monorepo/db

Database Layer - Database connections, schemas, and query operations.

## Overview

This layer contains all database-related functionality including connection configurations, schema definitions, and database operations for the entire application.

### Features

- **Database Connections**: Centralized database connection management
- **Schema Definitions**: Complete database schema for all entities
- **Query Operations**: Database queries for all application data
- **Data Models**: Structured data models and relationships

### Database Schemas

The layer manages schemas for:

- **User**: User account information and profiles
- **Post**: Social media posts and content
- **Connection**: Social media platform connections
- **Tool**: Available tools and configurations
- **Template**: Content templates and formats
- **Prompt**: AI prompts and responses
- **Email**: Email communications and templates
- **Settings**: Application and user settings
- **Log**: System logs and audit trails
- **Assets**: Media assets and files
- **Business**: Business information and configurations

### Capabilities

- Database connection configuration and management
- CRUD operations for all entities
- Query optimization and performance
- Data validation and constraints
- Migration management
- Backup and recovery operations

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
