# Renaissance Life OS

An immersive personal operating system for seven integrated life pillars. Built with React, Vite, Supabase and deployed on Vercel.

## Local setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Add the Supabase project URL and publishable key to `.env.local`. The interface works in local-first mode when these variables are absent.

## Database

Apply `supabase/migrations/20260716000000_create_check_ins.sql` to create the check-in table and its restricted insert-only RLS policy.

## Build

```bash
npm run build
```
