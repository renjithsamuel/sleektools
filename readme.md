# 🛠️ SleekTools

**Professional developer tools for formatting, validation, conversion, and more**

[![Build Status](https://github.com/yourusername/sleektools/workflows/CI/badge.svg)](https://github.com/yourusername/sleektools/actions)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://typescript.dev/)
[![Next.js](https://img.shields.io/badge/Next.js-15.1.6-black.svg)](https://nextjs.org/)
[![Material-UI](https://img.shields.io/badge/Material--UI-6.4.2-blue.svg)](https://mui.com/)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

> A modern, web-based collection of developer tools built with Next.js, TypeScript, and Material-UI. Format code, validate data, convert timestamps, generate UUIDs, and much more - all in one sleek interface.

## ✨ Features

### 🎨 **Formatters**

- **JSON Formatter** - Format, validate, and minify JSON with syntax highlighting
- **CSS Formatter** - Clean and organize CSS code with proper indentation
- **XML Formatter** - Format and validate XML documents
- **SQL Formatter** - Beautify SQL queries with proper formatting

### 🔍 **Validators**

- **JWT Decoder** - Decode and validate JSON Web Tokens
- **SQL Validator** - Validate SQL syntax and structure
- **YAML Validator** - Validate YAML syntax and format
- **Swagger Validator** - Validate OpenAPI/Swagger specifications

### 🔄 **Converters**

- **Base64 Converter** - Encode/decode Base64 strings
- **Timestamp Converter** - Convert Unix timestamps to human-readable dates
- **Image Converter** - Convert between different image formats

### 🎲 **Generators**

- **UUID Generator** - Generate UUID v1, v4, and custom formats
- **Password Generator** - Create secure passwords with custom criteria
- **Hash Generator** - Generate MD5, SHA1, SHA256, and other hashes
- **Lorem Ipsum Generator** - Generate placeholder text

### 🔧 **Utilities**

- **Code Editor** - Monaco-based code editor with syntax highlighting
- **Text Compare** - Side-by-side text comparison tool
- **Image Compressor** - Optimize and compress images

### 📊 **Additional Features**

- **History Management** - Keep track of your conversions and operations
- **Dark/Light Theme** - Toggle between themes for comfortable viewing
- **Responsive Design** - Works perfectly on desktop, tablet, and mobile
- **Offline Support** - Most tools work without internet connection

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18.0 or higher
- **Yarn** package manager
- **Git** for version control

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/sleektools.git
   cd sleektools
   ```

2. **Install dependencies**

   ```bash
   yarn install
   ```

3. **Start development server**

   ```bash
   yarn dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📖 Usage

### Development Workflows

```bash
yarn dev                # Start development server with Turbopack
yarn type-check         # Check TypeScript types
yarn lint               # Auto-fix linting issues
yarn format             # Auto-format all files
```

### CI/Validation Workflows

```bash
yarn lint:check         # Check linting (no auto-fix)
yarn format:check       # Check formatting (no auto-fix)
yarn validate           # Run all checks together
```

### Build Workflows

```bash
yarn clean              # Clean build artifacts
yarn build              # Type-check + build + post-build message
yarn start              # Start production server
```

## 🏗️ Architecture

### Tech Stack

- **Framework**: Next.js 15.1.6 with App Router
- **Language**: TypeScript 5.x
- **UI Library**: Material-UI 6.4.2
- **Styling**: Emotion CSS-in-JS
- **Code Editor**: Monaco Editor
- **Icons**: React Icons
- **Build Tool**: Turbopack (development)

### Project Structure

```
sleektools/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── (tools)/           # Tool category pages
│   │   ├── admin/             # Admin dashboard
│   │   └── globals.css        # Global styles
│   ├── components/            # Reusable React components
│   │   ├── Tools/             # Individual tool components
│   │   ├── common/            # Shared UI components
│   │   └── ThemeWrapper/      # Theme management
│   ├── constants/             # Application constants
│   ├── context/               # React context providers
│   ├── hooks/                 # Custom React hooks
│   ├── types/                 # TypeScript type definitions
│   ├── utils/                 # Utility functions
│   └── styles/                # Theme and styling
├── public/                    # Static assets
├── .github/                   # GitHub workflows and configs
└── package.json              # Dependencies and scripts
```

## 🔧 Development

### Code Quality

This project maintains high code quality standards:

- **TypeScript** for type safety
- **ESLint** for code linting
- **Prettier** for code formatting
- **Automated CI/CD** for quality checks

### Adding New Tools

1. Create component in `src/components/Tools/YourTool/`
2. Add route in `src/app/(tools)/category/your-tool/page.tsx`
3. Register tool in `src/constants/tools.ts`
4. Add tool types in `src/types/tools.ts`

### Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-tool`
3. Make your changes and add tests
4. Run quality checks: `yarn validate`
5. Commit your changes: `git commit -m 'Add amazing tool'`
6. Push to the branch: `git push origin feature/amazing-tool`
7. Submit a pull request

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Vercel will automatically deploy on every push to main
3. Environment variables can be set in Vercel dashboard

**For automatic GitHub → Vercel deployment:**
- See [GitHub Workflows Setup Guide](.github/WORKFLOWS_SETUP.md)
- Configure Vercel secrets in GitHub repository settings

### Manual Deployment

```bash
yarn build
yarn start
```

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN yarn install --frozen-lockfile
COPY . .
RUN yarn build
EXPOSE 3000
CMD ["yarn", "start"]
```

### Other Platforms

- **Netlify**: Auto-deploys from GitHub
- **Railway**: Connects directly to GitHub
- **GitHub Pages**: Use `next export` for static hosting
- **Self-hosted**: Use built files from `.next/` directory

## 📊 Performance

- **Lighthouse Score**: 95+ Performance
- **Bundle Size**: Optimized with Next.js code splitting
- **SSG**: Static generation for better performance
- **Tree Shaking**: Unused code elimination

## 🐛 Troubleshooting

### Common Issues

**Build fails with TypeScript errors**

```bash
yarn type-check  # Check for type errors
```

**Formatting issues**

```bash
yarn format      # Auto-fix formatting
```

**Development server won't start**

```bash
rm -rf .next node_modules
yarn install
yarn dev
```

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Support

- **Documentation**: [Wiki](https://github.com/yourusername/sleektools/wiki)
- **Issues**: [GitHub Issues](https://github.com/yourusername/sleektools/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/sleektools/discussions)

## 🎯 Roadmap

- [ ] **API Integration** - Connect with external APIs for enhanced functionality
- [ ] **Plugin System** - Allow custom tool development
- [ ] **Team Collaboration** - Share tools and results with team members
- [ ] **Mobile App** - Native mobile application
- [ ] **Advanced Analytics** - Usage statistics and insights
- [ ] **Cloud Storage** - Sync history across devices

---

<div align="center">
  <strong>Made with ❤️ by developers, for developers</strong>
  <br>
  <a href="https://github.com/yourusername/sleektools">⭐ Star this project</a>
</div>
