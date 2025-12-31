# 🚗 Shift - Website

<div align="center">

Marketing website for the **Shift** vehicle maintenance app.

[Live Website](https://shift-vehicle-maintenance.vercel.app/) • [Main Project](../README.md)

</div>

---

## 🛠️ Tech Stack

- **Vite** - Next-generation frontend build tool
- **React 19** - UI library
- **TypeScript** - Type safety
- **TailwindCSS 4** - Utility-first CSS framework
- **Framer Motion** - Animations
- **Lucide React** - Icons

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ or Bun

### Development

```bash
# Navigate to website directory
cd website

# Install dependencies
npm install
# or
bun install

# Start development server
npm run dev
# or
bun dev
```

The website will be available at `http://localhost:5173`.

### Build for Production

```bash
npm run build
# or
bun run build
```

The production build will be output to the `dist` folder.

---

## 📁 Project Structure

```
website/
├── public/                 # Static assets (images, favicon)
│   ├── mockups/           # App screenshots and mockups
│   └── favicon.png        # Site favicon
├── src/
│   ├── components/        # React components
│   │   ├── mvpblocks/    # Premium UI blocks
│   │   └── ...           # Feature sections
│   ├── assets/           # Component assets
│   ├── App.tsx           # Main app component
│   ├── index.css         # Global styles
│   └── main.tsx          # Entry point
├── index.html            # HTML template
├── tailwind.config.js    # Tailwind configuration
├── vite.config.ts        # Vite configuration
└── package.json          # Dependencies
```

---

## 🎨 Features

- **Responsive Design**: Optimized for all screen sizes
- **Dark Mode**: Elegant dark theme
- **Smooth Animations**: Framer Motion powered transitions
- **SEO Optimized**: Meta tags and semantic HTML
- **Fast Loading**: Vite's optimized build

---

## 📄 License

This project is part of the Shift app ecosystem.

See the main [LICENSE](../LICENSE) file for details.

**All Rights Reserved** © 2025-2026 Gonçalo Azevedo
