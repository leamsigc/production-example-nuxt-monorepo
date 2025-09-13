# @local-monorepo/auth

Auth Layer - User authentication and authorization using Better Auth.

## Overview

This layer handles all user authentication and authorization functionality using the Better Auth package. It provides comprehensive user management and role-based access control.

### Features

- **Better Auth Integration**: Uses Better Auth for secure authentication
- **User Registration**: Complete user registration flow
- **Login/Logout**: Secure login and logout functionality
- **Password Management**: Password change and reset capabilities
- **Email Verification**: Email verification system
- **Admin Panel**: Administrative user management
- **Role Management**: User role and permission management

### User Capabilities

- User can register for an account
- User can login to their account
- User can logout from their account
- User can change their password
- User can change their email address
- User can verify their email address
- Admin users can manage other users
- Admin users can ban/unban users

### API Endpoints

- User registration API
- Authentication APIs (login/logout)
- Password management APIs
- Email verification APIs
- User management APIs (admin only)
- Role and permission APIs

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
