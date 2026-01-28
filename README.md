# Shield AI Landing Page

A modern, animated landing page for Shield AI built with Astro, React, and Tailwind CSS. Features smooth GSAP animations and a responsive design.

## 🚀 Features

- **Modern Design**: Clean, professional landing page with animated elements
- **Smooth Animations**: GSAP-powered animations for enhanced user experience
- **Fast Performance**: Built with Astro for optimal loading speeds
- **Responsive**: Mobile-first design that works on all devices
- **React Components**: Interactive components built with React
- **Tailwind CSS**: Utility-first CSS for rapid styling

## 🛠️ Tech Stack

- **[Astro](https://astro.build)** - Static site framework
- **[React](https://react.dev)** - UI components
- **[Tailwind CSS](https://tailwindcss.com)** - Styling
- **[GSAP](https://greensock.com/gsap/)** - Animations
- **[TypeScript](https://www.typescriptlang.org/)** - Type safety

## 📦 Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🌐 Deployment

This project is configured for deployment on Cloudflare Pages:

1. Build command: `npm run build`
2. Build output directory: `dist`
3. Framework preset: Astro

The project includes `wrangler.jsonc` for Cloudflare Workers/Pages configuration.

## 📁 Project Structure

```
SHEILDAI-LANDING/
├── src/
│   ├── components/     # React components
│   ├── layouts/        # Astro layouts
│   ├── pages/          # Astro pages/routes
│   ├── hooks/          # React hooks
│   └── globals.css     # Global styles
├── public/             # Static assets
├── astro.config.mjs    # Astro configuration
├── tailwind.config.mjs # Tailwind configuration
└── package.json
```

## 🎨 Customization

### Styling

Tailwind CSS is configured in `tailwind.config.mjs`. Add custom colors, fonts, and utilities here.

### Animations

GSAP animations are implemented throughout the components. Modify animation timings and effects in the respective component files.

### Content

Page content can be edited in:
- `src/pages/index.astro` - Main landing page
- `src/components/` - Individual component content

## 🚢 Development

```bash
# Run development server
npm run dev
# Opens at http://localhost:4321

# Type checking
npm run astro check

# Format code
npm run format (if configured)
```

## 📄 License

Private project - All rights reserved
