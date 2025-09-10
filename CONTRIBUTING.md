# Contributing to SleekTools

Thank you for your interest in contributing to SleekTools! We welcome contributions from the community.

## 🚀 Getting Started

### Prerequisites

- Node.js 18.0 or higher
- Yarn package manager
- Git

### Setup Development Environment

1. **Fork the repository**

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

4. **Run quality checks**
   ```bash
   yarn validate
   ```

## 📋 Development Workflow

### Code Quality Standards

Before submitting any pull request, ensure your code passes all quality checks:

```bash
yarn type-check         # TypeScript type checking
yarn lint              # ESLint with auto-fix
yarn format            # Prettier formatting
yarn validate          # All checks combined
```

### Project Structure

```
src/
├── app/                    # Next.js App Router pages
├── components/             # Reusable React components
│   ├── Tools/             # Individual tool components
│   └── common/            # Shared UI components
├── constants/             # Application constants
├── hooks/                 # Custom React hooks
├── types/                 # TypeScript type definitions
├── utils/                 # Utility functions
└── styles/               # Theme and styling
```

### Adding New Tools

1. **Create tool component**

   ```bash
   mkdir src/components/Tools/YourTool
   touch src/components/Tools/YourTool/YourTool.tsx
   ```

2. **Add route page**

   ```bash
   mkdir -p src/app/(tools)/category/your-tool
   touch src/app/(tools)/category/your-tool/page.tsx
   ```

3. **Register in constants**
   Update `src/constants/tools.ts` with your tool definition

4. **Add types**
   Add any new types to `src/types/tools.ts`

### Component Guidelines

- Use TypeScript for all components
- Follow React function component pattern
- Use Material-UI components for consistency
- Include proper error handling
- Add loading states for async operations
- Ensure responsive design

### Code Style

- **TypeScript**: Strict mode enabled
- **ESLint**: Next.js + TypeScript rules
- **Prettier**: Consistent formatting
- **Imports**: Use absolute imports where possible
- **Naming**: Use PascalCase for components, camelCase for functions

## 🧪 Testing

### Running Tests

```bash
yarn test              # Run all tests
yarn test:watch        # Run tests in watch mode
yarn test:coverage     # Run tests with coverage
```

### Writing Tests

- Write unit tests for utility functions
- Write integration tests for complex components
- Use React Testing Library for component tests
- Mock external dependencies

## 📝 Documentation

### Code Documentation

- Add JSDoc comments for complex functions
- Document component props with TypeScript interfaces
- Include usage examples in component documentation

### README Updates

- Update README.md if adding new features
- Include screenshots for UI changes
- Update the feature list for new tools

## 🐛 Bug Reports

When reporting bugs, please include:

- Clear description of the issue
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable
- Environment details (OS, browser, version)

## ✨ Feature Requests

For new features, please provide:

- Clear description of the feature
- Use cases and benefits
- Proposed implementation approach
- Mockups or wireframes if applicable

## 🔄 Pull Request Process

1. **Create a feature branch**

   ```bash
   git checkout -b feature/amazing-feature
   ```

2. **Make your changes**
   - Follow the code style guidelines
   - Add tests for new functionality
   - Update documentation as needed

3. **Run quality checks**

   ```bash
   yarn validate
   ```

4. **Commit your changes**

   ```bash
   git commit -m "feat: add amazing feature"
   ```

5. **Push to your fork**

   ```bash
   git push origin feature/amazing-feature
   ```

6. **Create a Pull Request**
   - Use the PR template
   - Provide clear description
   - Link related issues
   - Add screenshots for UI changes

### Commit Message Convention

Follow conventional commits:

- `feat:` new feature
- `fix:` bug fix
- `docs:` documentation changes
- `style:` formatting changes
- `refactor:` code refactoring
- `test:` adding tests
- `chore:` maintenance tasks

## 🎯 Code Review Process

All submissions require code review:

- Maintainers will review within 48 hours
- Address feedback promptly
- Squash commits before merging
- Ensure CI passes

## 📜 License

By contributing, you agree that your contributions will be licensed under the MIT License.

## 🤝 Community

- Be respectful and inclusive
- Help others learn and grow
- Share knowledge and best practices
- Follow the code of conduct

## 📞 Getting Help

- Check existing issues and documentation
- Ask questions in GitHub Discussions
- Join our community Discord (if applicable)
- Reach out to maintainers

Thank you for contributing to SleekTools! 🎉
