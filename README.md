# portfolio-radhiyyaV2

Personal Portfolio & Admin Panel built with Next.js 16 (App Router), TypeScript, Tailwind CSS, and Neon PostgreSQL.

## Features
- **Modern Responsive Landing Page**: Showcasing projects, work experience, education, achievements, and testimonials.
- **Dedicated Project Detail Page (`/projects/[id]`)**: Full gallery lightbox (up to 5 images), formatted rich text description, interactive emoji reactions, and comment system.
- **Collaborator Integration**: Clickable portfolio links for collaborators.
- **Admin Dashboard**: Full CRUD management for projects, certificates, and collaborators.

## Deployment on Netlify
1. Connect repository to Netlify.
2. Set Environment Variables in Netlify Dashboard:
   - `DATABASE_URL` = your Neon PostgreSQL URL
   - `NEXT_PUBLIC_IMGBB_API_KEY` = your ImgBB API key
   - `JWT_SECRET` = your JWT secret key
3. Build command: `npm run build`
4. Publish directory: `.next`
