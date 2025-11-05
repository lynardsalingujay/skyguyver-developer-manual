# SkyGuyver Documentation Website

## Development Setup

### Prerequisites

- Node.js 18+
- npm or yarn

### Local Development

1. **Install dependencies:**

   ```bash
   cd docs-website
   npm install
   ```

2. **Start development server:**

   ```bash
   npm run docs:dev
   ```

3. **Open in browser:**
   ```
   http://localhost:5173
   ```

### Build for Production

```bash
npm run docs:build
```

### Preview Production Build

```bash
npm run docs:preview
```

## Deployment to Netlify

### Option 1: GitHub Integration (Recommended)

1. **Push to GitHub:**

   ```bash
   git add .
   git commit -m "Add documentation website"
   git push origin main
   ```

2. **Connect to Netlify:**

   - Go to [netlify.com](https://netlify.com)
   - Click "New site from Git"
   - Connect your GitHub repository
   - Build command: `npm run docs:build`
   - Publish directory: `docs/.vitepress/dist`

3. **Auto-deploy:**
   - Every push to main branch automatically deploys
   - Preview deployments for pull requests

### Option 2: Manual Deploy

1. **Build locally:**

   ```bash
   npm run docs:build
   ```

2. **Deploy to Netlify:**
   - Drag and drop the `docs/.vitepress/dist` folder to Netlify

### Environment Variables

No environment variables required for static documentation.

### Custom Domain (Optional)

1. In Netlify dashboard, go to "Domain settings"
2. Add your custom domain
3. Follow DNS configuration instructions

## Project Structure

```
docs-website/
├── docs/
│   ├── .vitepress/
│   │   └── config.js          # VitePress configuration
│   ├── index.md              # Homepage
│   ├── architecture/         # System architecture docs
│   ├── supabase/            # Database documentation
│   ├── workflows/           # n8n and automation docs
│   ├── new-ideas/          # Business opportunities
│   └── operations/         # Business operations
├── package.json
├── netlify.toml            # Netlify configuration
└── README.md
```

## Features

- **📱 Mobile Responsive** - Works on all devices
- **🔍 Full-text Search** - Search across all documentation
- **🎨 Modern Design** - Clean, professional appearance
- **⚡ Fast Loading** - Optimized static site generation
- **🔗 Auto Navigation** - Sidebar generated from file structure
- **📝 Markdown Support** - Rich markdown formatting
- **🌙 Dark Mode** - Automatic dark/light theme
- **📊 Code Highlighting** - Syntax highlighting for code blocks

## Contributing

1. Edit markdown files in the `docs/` directory
2. Run `npm run docs:dev` to preview changes
3. Commit and push to trigger auto-deployment

## Support

For issues or questions, please refer to the [VitePress documentation](https://vitepress.dev/).
