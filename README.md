# Nexus

A comprehensive, production-ready Nuxt 3 template with authentication, database integration, PWA support, and modern development tools.

## ✨ Features

### 🚀 Core Technologies

- **Nuxt 3** - Full-stack Vue.js framework
- **TypeScript** - Type-safe development
- **Vue 3** - Progressive JavaScript framework
- **Pinia** - State management with Colada for server state
- **Nuxt UI** - Beautiful UI components
- **Tailwind CSS** - Utility-first CSS framework

### 🔐 Authentication & Security

- **Better Auth** - Modern authentication system
- **Email OTP** - Passwordless authentication
- **Session management** - Secure session handling
- **Role-based access control** - User roles and permissions
- **Global auth middleware** - Automatic route protection

### 🗄️ Database & Backend

- **Drizzle ORM** - Type-safe database queries
- **SQLite** - Lightweight database (easily switchable)
- **Database migrations** - Version-controlled schema changes
- **Drizzle Studio** - Database management interface

### 🌐 NuxtHub Integration

- **Workers** - Serverless functions
- **Analytics** - Application insights
- **Blob storage** - File uploads and storage
- **Cache** - Performance optimization
- **Database** - Managed database
- **KV storage** - Key-value storage

### 📱 Progressive Web App (PWA)

- **Service Worker** - Offline functionality
- **App manifest** - Native app experience
- **Auto-updates** - Seamless updates
- **Offline caching** - Smart caching strategies
- **App shortcuts** - Quick access to key features

### 🌍 Internationalization

- **i18n support** - Multi-language support
- **Browser language detection** - Automatic locale detection
- **Cookie-based persistence** - Language preference storage

### 🛠️ Development Tools

- **ESLint** - Code quality and consistency
- **Nuxt DevTools** - Development debugging
- **Hot reload** - Fast development experience
- **TypeScript** - Full type safety

### 📧 Email Integration

- **Resend** - Modern email API
- **Email templates** - Professional email communication

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm
- Git

### Installation

1. **Clone the template**

   ```bash
   npx degit shaoula/nexus <your-project-name>
   cd <your-project-name>
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env
   ```

   Configure your environment variables:

   ```env
   BETTER_AUTH_SECRET=your-auth-secret
   NUXT_RESEND_API_KEY=your-resend-api-key
   ```

4. **Set up the database**

   ```bash
   # Generate database migrations
   pnpm db:generate
   
   # Run migrations
   pnpm db:migrate
   
   # Open Drizzle Studio (optional)
   pnpm db:studio
   ```

5. **Start development server**

   ```bash
   pnpm dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```bash
nexus/
├── app/                    # Application source
│   ├── assets/            # Static assets
│   ├── composables/       # Reusable composables
│   ├── config/            # App configuration
│   ├── constants/         # App constants
│   ├── layouts/           # Layout components
│   ├── middleware/        # Route middleware
│   ├── pages/             # Application pages
│   └── plugins/           # Nuxt plugins
├── server/                # Server-side code
│   ├── api/               # API routes
│   ├── database/          # Database configuration
│   ├── plugins/           # Server plugins
│   └── utils/             # Server utilities
├── i18n/                  # Internationalization
├── public/                # Public assets
└── drizzle.config.ts      # Database configuration
```

## 🔧 Available Scripts

```bash
# Development
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm preview      # Preview production build

# Database
pnpm db:generate  # Generate database migrations
pnpm db:migrate   # Run database migrations
pnpm db:studio    # Open Drizzle Studio

# Other
pnpm generate     # Generate static site
```

## 🎨 Customization

### Theme Configuration

Edit `app/app.config.ts` to customize the UI theme:

```typescript
export default defineAppConfig({
  ui: {
    colors: {
      primary: 'sky',    // Change primary color
      neutral: 'neutral',
    },
  },
})
```

### Navigation

Update `app/constants/nav.ts` to customize navigation items:

```typescript
export const NAV_ITEMS = [
  {
    label: 'Home',
    icon: 'i-lucide-home',
    to: '/',
  },
  // Add your navigation items
]
```

### Authentication

The template uses Better Auth with email OTP. Configure authentication in:

- `app/composables/auth.ts` - Client-side auth logic
- `server/plugins/auth.ts` - Server-side auth configuration
- `server/api/auth/[...].ts` - Auth API routes

## 🗄️ Database

### Schema

The database schema is defined in `server/database/schema.ts`:

```typescript
export const users = sqliteTable('user', {
  id: text('id').primaryKey().unique().notNull(),
  name: text().notNull(),
  email: text().notNull(),
  emailVerified: integer({ mode: 'boolean' }).default(true),
  image: text(),
  createdAt: integer('createdAt', { mode: 'timestamp_ms' }).notNull(),
  updatedAt: integer('updatedAt', { mode: 'timestamp_ms' }).notNull(),
  role: text(),
  banned: integer({ mode: 'boolean' }),
  banReason: text(),
  banExpires: integer('banExpires', { mode: 'timestamp_ms' }),
})
```

### Migrations

- Generate migrations: `pnpm db:generate`
- Run migrations: `pnpm db:migrate`
- View database: `pnpm db:studio`

## 🔐 Authentication Flow

1. **Email OTP**: Users receive a one-time password via email
2. **Session Management**: Secure session handling with Better Auth
3. **Route Protection**: Automatic route protection with middleware
4. **Role-based Access**: User roles and permissions system

## 📱 PWA Features

- **Offline Support**: Service worker caches essential resources
- **App-like Experience**: Full-screen mode and native feel
- **Auto-updates**: Seamless application updates
- **App Shortcuts**: Quick access to key features
- **Smart Caching**: Optimized caching strategies

## 🌍 Internationalization (i18n)

This template provides robust internationalization powered by [@nuxtjs/i18n](https://i18n.nuxtjs.org/):

- **Automatic browser language detection** with fallback to English
- **Cookie-based language persistence** (`nexus-lang` cookie)
- **Simple locale management** via the Nuxt i18n module
- **Translation files** organized in `i18n/locales/` (default: `en.json`)
- **No URL prefix** for the default locale for clean routing

You can easily add new languages by creating additional JSON files in `i18n/locales/` and updating the `locales` array in `nuxt.config.ts`.

## 🚀 Deployment

### Cloudflare (Recommended)

1. Just run `npx nuxthub deploy`

### Other Platforms

The template is compatible with any platform that supports Node.js:

- Vercel
- Netlify
- Railway
- DigitalOcean App Platform (Coming soon)
- AWS Amplify (Coming soon)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This template is licensed under the MIT License.

## 🙏 Acknowledgments

- [Nuxt Team](https://nuxt.com/) for the amazing framework
- [Better Auth](https://better-auth.com/) for authentication
- [Drizzle](https://orm.drizzle.team/) for the ORM
- [Nuxt UI](https://ui.nuxt.com/) for the UI components
- [VueUse](https://vueuse.org/) for the composables

---

**Created with ❤️ by [Shaoula](https://shaoula.com)**

Built with [Nuxt 3](https://nuxt.com/)
