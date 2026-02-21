# 🚀 Modern Developer Portfolio

A full-featured developer portfolio built with Next.js 15, Tailwind CSS, Prisma, and NextAuth.

## ✨ Features

- 🎨 Modern dark UI with Framer Motion animations
- 🌓 Dark/Light mode with Jotai persistence
- 🔐 Admin panel with NextAuth credentials
- 🐙 GitHub integration — sync public repos automatically
- 📦 Vercel Blob for image uploads
- 🗄 Prisma ORM with SQLite
- 🏗 Clean Architecture (domain/application/infrastructure)
- 📱 Fully responsive

## 🛠 Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Styling:** Tailwind CSS
- **Animation:** Framer Motion
- **Auth:** NextAuth v4 (Credentials)
- **ORM:** Prisma + SQLite
- **State:** Jotai
- **Upload:** Vercel Blob
- **Deploy:** Vercel

## 🚀 Quick Start

### 1. Clone and install

```bash
git clone <your-repo>
cd portfolio
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

Edit `.env` with your values:

```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="your-super-secret-key"
NEXTAUTH_URL="http://localhost:3000"
ADMIN_EMAIL="admin@portfolio.dev"
ADMIN_PASSWORD="yourpassword"
GITHUB_TOKEN="ghp_your_token"
GITHUB_USERNAME="your-github-username"
BLOB_READ_WRITE_TOKEN="vercel_blob_token"
```

### 3. Setup database

```bash
npm run db:generate
npm run db:push
npm run db:seed
```

### 4. Run development server

```bash
npm run dev
```

Visit:

- **Portfolio:** http://localhost:3000
- **Admin:** http://localhost:3000/admin/login

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (public)/           # Public pages
│   ├── admin/              # Admin dashboard
│   └── api/                # API routes
├── components/
│   ├── admin/              # Admin UI components
│   ├── public/             # Public portfolio sections
│   └── shared/             # Shared components
├── domain/                 # Domain entities & repo interfaces
├── application/            # Use cases / business logic
├── infrastructure/         # Prisma repository implementations
└── lib/                    # Auth, DB, GitHub, utils
```

## 🌐 Deploy to Vercel

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy!

**Important:** Set `DATABASE_URL` to a production DB (PlanetScale, Turso, etc.) or use SQLite with a persistent volume.

## 🐙 GitHub Sync

In the admin dashboard, click **"Sync GitHub"** to pull all your public repositories. Then go to **Projects** to set categories, publish, and add images.

## 🎨 Admin Panel

Login at `/login` with your credentials.

- **Dashboard:** Overview + GitHub sync
- **Projects:** Manage visibility, categories, images
- **Settings > Profile:** Name, bio, avatar
- **Settings > Skills:** Tech stack with levels (0-10)
- **Settings > Services:** What you offer
- **Settings > Certificates:** Qualifications
- **Settings > Contacts:** Social links

---

Built with ❤️ using Next.js & Tailwind CSS
