# CloudVault

A clean, modern cloud notes application built with vanilla HTML, CSS, and JavaScript. Store and manage your notes securely using Supabase as your cloud database.

**[▶ Open the live demo](https://dominicnkutha1-netize.github.io/cloudvault/)** — it will ask for a
Supabase URL and anon key on first load. Bring your own project, or read the
[known limitations](#known-limitations) first: the demo's row-level policies are deliberately
permissive.

![CloudVault Preview](https://img.shields.io/badge/Status-Ready-success?style=for-the-badge)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)

## Features

- 📝 **Create, Edit & Delete** - Full CRUD functionality for your notes
- 🔍 **Search** - Quickly find notes by title or content
- 💾 **Cloud Storage** - Powered by Supabase PostgreSQL database
- 🎨 **Modern UI** - Clean dark theme with smooth animations
- 📱 **Responsive** - Works perfectly on desktop and mobile
- ⚡ **Fast & Lightweight** - No frameworks, just vanilla JS
- 🔌 **Bring your own backend** - the Supabase credentials live in the browser's local
  storage, not in this repository

## Getting Started

### Prerequisites

- A [Supabase](https://supabase.com/) account (free tier is enough)
- A web browser

### Setup Instructions

1. **Create a Supabase Project**
   - Go to [supabase.com/dashboard](https://supabase.com/dashboard)
   - Create a new project
   - Wait for it to finish setting up

2. **Create the Database Table**
   - Go to the SQL Editor in your Supabase dashboard
   - Run this SQL query:

```sql
CREATE TABLE notes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (for demo purposes)
CREATE POLICY "Allow all operations" ON notes
  FOR ALL USING (true) WITH CHECK (true);
```

3. **Get Your Credentials**
   - Go to Project Settings → API
   - Copy your `Project URL` and `anon/public` key

4. **Run CloudVault**
   - Open `index.html` in your browser
   - Enter your Supabase URL and anon key when prompted
   - Start creating notes!

## Deployment

This repository is a static site with no build step, so it is served directly by
GitHub Pages from the `main` branch:

- **Live:** <https://dominicnkutha1-netize.github.io/cloudvault/>
- **Settings:** repository → Settings → Pages → Deploy from a branch → `main` / `/`

To run your own copy, fork the repository, enable Pages the same way, and point it
at your own Supabase project. Any static host (Netlify, Vercel, S3, nginx) works
too — it is three files.

## Known limitations

- **Row-level security is enabled but the policy is wide open.** The SQL above
  creates `FOR ALL USING (true)`, so anyone holding the anon key can read and
  write every note. That is fine for a demo of CRUD, and wrong for a private
  notebook. The fix is Supabase Auth plus a `user_id` column and policies that
  compare against `auth.uid()`.
- **Credentials are stored in `localStorage`.** They never leave the browser
  except in requests to your own Supabase project, but any injected script could
  read them.
- **No offline support and no sync conflict handling.** Two tabs editing the same
  note will overwrite each other.
- **No tests.** The app logic is small enough to be worth a few, but there are
  none.

## Tech Stack

- **Frontend:** HTML5, CSS3, Vanilla JavaScript
- **Database:** Supabase (PostgreSQL)
- **Icons:** Tabler Icons
- **Fonts:** Inter

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Author

Built with ❤️ by [Dr Dominic Nkutha](https://github.com/dominicnkutha1-netize)
