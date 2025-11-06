# Contributing to Freely

Thank you for your interest in contributing to Freely! This document provides guidelines and instructions for contributing.

## Code of Conduct

- Be respectful and inclusive
- Welcome newcomers and help them learn
- Focus on constructive feedback
- Respect different viewpoints and experiences

## How to Contribute

### Reporting Bugs

1. Check if the bug has already been reported in the Issues
2. Create a new issue with:
   - Clear title and description
   - Steps to reproduce
   - Expected vs actual behavior
   - Environment details (OS, Node version, etc.)
   - Screenshots if applicable

### Suggesting Features

1. Check if the feature has already been suggested
2. Create a new issue with:
   - Clear description of the feature
   - Use cases and benefits
   - Potential implementation approach (if you have ideas)

### Pull Requests

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes**
   - Follow the code style guidelines
   - Write or update tests if applicable
   - Update documentation as needed
4. **Test your changes**
   ```bash
   npm run type-check
   npm run lint
   npm run build
   ```
5. **Commit your changes**
   ```bash
   git commit -m "feat: add your feature description"
   ```
   Use conventional commits:
   - `feat:` for new features
   - `fix:` for bug fixes
   - `docs:` for documentation
   - `style:` for formatting
   - `refactor:` for code refactoring
   - `test:` for tests
   - `chore:` for maintenance
6. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```
7. **Create a Pull Request**
   - Provide a clear description
   - Reference related issues
   - Request review from maintainers

## Development Setup

1. Fork and clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables (see SETUP.md)
4. Run migrations: `supabase db push`
5. Start development server: `npm run dev`

## Code Style

- Use TypeScript for all new code
- Follow ESLint rules (run `npm run lint`)
- Use Prettier for formatting
- Write meaningful variable and function names
- Add comments for complex logic
- Keep functions small and focused

## Project Structure

- `app/` - Next.js app directory (pages and API routes)
- `components/` - React components
- `lib/` - Utility libraries and business logic
- `supabase/` - Database migrations and edge functions
- `public/` - Static assets

## Testing

- Write tests for new features
- Ensure all tests pass before submitting PR
- Add integration tests for API routes
- Test with different AI providers when applicable

## Documentation

- Update README.md for user-facing changes
- Update SETUP.md for setup/configuration changes
- Add JSDoc comments for public APIs
- Update inline code comments as needed

## Questions?

Feel free to open an issue with the `question` label if you need help or clarification.

Thank you for contributing to Freely! 🎉

