# LifeOS

Your personal AI-powered life operating system — track decisions, mood, savings goals, and more.

## 🚀 Deployment — Vercel Environment Variables

This app requires the following environment variables. Add them in your Vercel project dashboard under **Settings → Environment Variables**, then go to **Deployments → Redeploy**.

| Variable | Where to get it |
|---|---|
| `VITE_GROQ_API_KEY` | [console.groq.com](https://console.groq.com) |
| `VITE_GEMINI_API_KEY` | [aistudio.google.com](https://aistudio.google.com) |
| `VITE_SUPABASE_URL` | [supabase.com](https://supabase.com) → Project Settings → API |
| `VITE_SUPABASE_ANON_KEY` | [supabase.com](https://supabase.com) → Project Settings → API |

> **Important:** `.env` is in `.gitignore` and is never pushed to GitHub. You must add each variable manually in Vercel.

## 🛠️ Local Development

Copy the example file and fill in your keys:

```bash
cp .env.example .env
```

Then run:

```bash
npm install
npm run dev
```

---

<!-- Original Vite template notes below -->

## React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

## Supabase Auth Setup

Create a `.env` file in the project root:

```bash
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_GEMINI_API_KEY=your_gemini_key
```

### SQL: `profiles` table + policies

Run this in the Supabase SQL editor:

```sql
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  is_onboarded boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Users can read own profile"
  on public.profiles
  for select
  to authenticated
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles
  for insert
  to authenticated
  with check (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles
  for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);
```

### Auth provider URLs

In Supabase Auth settings:

- Set site URL to your app origin, for example: `http://localhost:3000`
- Add redirect URLs:
  - `http://localhost:3000/auth/callback` (Google OAuth callback)
  - `http://localhost:3000/login` (password reset redirect target)
