# AutoParts Pro

AutoParts Pro is a Next.js automotive spare parts catalog and admin dashboard for managing brands, categories, car models, and parts inventory. The public storefront helps customers search by manufacturer, model, category, and OEM/reference number, while the admin area supports catalog maintenance and media uploads.

## Features

- Public storefront for browsing brands, models, and spare parts
- Advanced search and filtering for automotive parts
- Category, brand, and model-based navigation
- Detailed part pages with image galleries and compatibility info
- Admin dashboard for managing categories, companies, models, and parts
- Supabase-powered data layer and authentication
- Cloudinary image upload support for part and brand assets
- PWA support with install prompt and offline manifest

## Tech Stack

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS
- Supabase
- Cloudinary
- Radix UI components
- PWA support via @ducanh2912/next-pwa

## Project Structure

```text
.
├── src/
│   ├── app/                # App Router pages and server actions
│   ├── components/         # UI and feature components
│   ├── lib/                # Supabase, auth, services, validation helpers
│   ├── types/              # Database types
│   └── ...
├── public/                 # Static assets, manifest, service worker
├── supabase/
│   └── migrations/         # Database migrations
├── scripts/                # Maintenance and scraping utilities
├── .env.example            # Environment variables template
├── package.json            # Project scripts and dependencies
├── next.config.ts          # Next.js config
├── tsconfig.json           # TypeScript config
└── README.md
```

## Prerequisites

- Node.js 20+
- pnpm 10+
- Supabase project
- Cloudinary account

## Installation

1. Clone the repository.
2. Install dependencies:

```bash
pnpm install
```

3. Create your environment file:

```bash
cp .env.example .env.local
```

4. Fill in your values in `.env.local`:

```env
# Supabase Config
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key

# Cloudinary Config
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## Database Setup

This project uses Supabase for its database and authentication layer. Apply the SQL migrations in the `supabase/migrations` folder to your Supabase project.

```bash
pnpm db:push
```

If needed, you can also create a new migration:

```bash
pnpm db:new "your_migration_name"
```

## Running the App

Run the development server:

```bash
pnpm dev
```

Then open:

- http://localhost:3000

The project includes an admin area at `/admin` and a login screen at `/login`.

## Available Scripts

```bash
pnpm dev                # Start the Next.js dev server
pnpm build              # Create a production build
pnpm start              # Start the production server
pnpm lint               # Run ESLint
pnpm scrape             # Run the scraping utility
pnpm migrate:images     # Migrate uploaded images to Cloudinary
pnpm cleanup            # Run cleanup utilities
pnpm db:push            # Push Supabase migrations
pnpm db:status          # Check migration status
pnpm db:new             # Create a new migration
```

## Deployment

This project is designed for deployment on platforms such as Vercel, with environment variables configured in the hosting environment.

Recommended deployment checklist:

- Set all required environment variables in production
- Configure your Supabase URL and keys
- Configure Cloudinary credentials
- Set your site URL for metadata and canonical links
- Ensure the database migrations are applied in the target Supabase project

## Notes

- The app uses server-side Supabase clients for admin and protected routes.
- Public catalog data uses a separate public client configuration.
- Product images are uploaded and managed through Cloudinary for efficient storage and delivery.
- The app includes PWA assets for installability and offline support.

## License

This project is currently unlicensed unless otherwise specified by the repository owner.
