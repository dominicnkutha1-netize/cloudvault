# CloudVault

A clean, modern cloud notes application built with vanilla HTML, CSS, and JavaScript. Store and manage your notes securely using Supabase as your cloud database.

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
- 🔒 **Secure** - Your data is stored in your own Supabase project

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

### GitHub Pages
1. Create a new repository on GitHub
2. Push all files to the repository
3. Go to Settings → Pages
4. Set source to "Deploy from a branch" and select `main`
5. Your app will be live at `https://yourusername.github.io/repo-name/`

### Other Platforms
CloudVault works great on Netlify, Vercel, or any static hosting platform.

## Tech Stack

- **Frontend:** HTML5, CSS3, Vanilla JavaScript
- **Database:** Supabase (PostgreSQL)
- **Icons:** Tabler Icons
- **Fonts:** Inter

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Author

Built with ❤️ by [Dr Dominic Nkutha](https://github.com/dominicnkutha1-netize)
