# Admin Portal DSD

Administration portal built with Next.js 14, TypeScript, Supabase, and Clean Architecture.

## 🏗️ Architecture

This project follows **Clean Architecture** principles, organizing code into well-defined layers:

- **Domain**: Entities, use cases, and repository interfaces
- **Application**: Services, DTOs, and mappers
- **Infrastructure**: Repository implementations and external adapters (Supabase)
- **Presentation**: React components, hooks, and providers

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account

### Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` and add your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. Set up the database:
   - Run the SQL schema from `src/infrastructure/supabase/database-schema.sql` in your Supabase SQL editor
   - This will create the necessary tables (`tenants`, `tenant_users`) and RLS policies

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📁 Project Structure

```
admin_portal_dsd/
├── app/                    # Next.js App Router
│   ├── [locale]/          # Internationalized routes
│   │   ├── (auth)/        # Authentication routes
│   │   ├── (admin)/       # Admin routes
│   │   └── (tenant)/      # Tenant routes
│   └── api/               # API Routes
├── src/
│   ├── domain/            # Domain Layer
│   │   ├── entities/      # Domain entities
│   │   ├── repositories/ # Repository interfaces
│   │   └── use-cases/     # Business logic use cases
│   ├── application/       # Application Layer
│   │   ├── services/      # Application services
│   │   ├── dtos/          # Data Transfer Objects
│   │   └── mappers/       # Entity/DTO mappers
│   ├── infrastructure/    # Infrastructure Layer
│   │   ├── repositories/  # Repository implementations
│   │   ├── supabase/      # Supabase configuration
│   │   └── config/        # Configuration files
│   ├── presentation/      # Presentation Layer
│   │   ├── components/    # React components
│   │   ├── hooks/         # Custom hooks
│   │   └── providers/     # Context providers
│   └── shared/            # Shared code
│       ├── constants/      # Constants
│       ├── lib/           # Utility libraries
│       └── utils/         # Utility functions
├── messages/              # Internationalization files
│   ├── en.json           # English translations
│   └── es.json           # Spanish translations
└── public/               # Static files
```

## 🛠️ Technologies

- **Next.js 14**: React framework with App Router
- **TypeScript**: Static typing
- **Supabase**: Backend as a service (Auth, Database)
- **Tailwind CSS**: Styling
- **React Hook Form**: Form handling
- **Zod**: Schema validation
- **next-intl**: Internationalization

## 📝 Available Scripts

- `npm run dev`: Start development server
- `npm run build`: Build the application for production
- `npm run start`: Start production server
- `npm run lint`: Run the linter
- `npm run type-check`: Verify TypeScript types
- `npm test`: Run tests
- `npm run create-user`: Create a test user (requires Supabase credentials)

## 🔐 Authentication

The project uses Supabase Auth for authentication. The implementation follows Clean Architecture:

- **Domain**: Defines interfaces and use cases
- **Infrastructure**: Implements Supabase connection
- **Presentation**: Provides components and hooks for the UI

### Features

- Email/password authentication
- Tenant-based access control
- Super admin and tenant user roles
- Row Level Security (RLS) policies
- Session management with refresh tokens

## 🏢 Tenant Management

The application supports multi-tenant architecture:

- **Tenants**: Organizations that can be managed by super admins
- **Tenant Users**: Users associated with specific tenants
- **Super Admins**: Users with system-wide access

Super admins can:
- View and manage all tenants
- Access the admin dashboard
- Create and edit tenant information

Tenant users can:
- Access their tenant-specific dashboard
- View tenant-specific data

## 🌐 Internationalization

The project supports multiple languages using `next-intl`:

- English (en) - Default
- Spanish (es)

Routes are automatically prefixed with the locale (e.g., `/en/admin`, `/es/admin`).

## 🚀 Deployment

### Vercel Deployment

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)
2. Import your project in [Vercel](https://vercel.com)
3. Configure environment variables in Vercel Dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NEXT_PUBLIC_APP_URL` (your Vercel deployment URL)
4. Deploy automatically on push to main branch

### Environment Variables

Required environment variables:

- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase anonymous key (public)
- `SUPABASE_SERVICE_ROLE_KEY`: Supabase service role key (server-only)
- `NEXT_PUBLIC_APP_URL`: Application URL (default: `http://localhost:3000`)

## 🧪 Testing

The project uses Vitest for testing:

```bash
npm test              # Run tests
npm run test:ui       # Run tests with UI
npm run test:coverage # Run tests with coverage
```

## 📋 Features

- ✅ User authentication with Supabase
- ✅ Multi-tenant architecture
- ✅ Role-based access control (Super Admin / Tenant User)
- ✅ Tenant management (CRUD operations)
- ✅ Internationalization (i18n)
- ✅ Responsive design
- ✅ Clean Architecture pattern
- ✅ TypeScript for type safety
- ✅ Row Level Security (RLS) policies

## 🎯 Roadmap

- [ ] Implement tenant creation/editing forms
- [ ] Add user management within tenants
- [ ] Implement refresh token automatic renewal
- [ ] Add comprehensive unit and integration tests
- [ ] Configure CI/CD pipeline
- [ ] Add API documentation
- [ ] Implement audit logging

## 📄 License

This project is private.

## 🤝 Contributing

This is a private project. For questions or issues, please contact the project maintainers.
