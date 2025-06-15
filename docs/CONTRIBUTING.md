# Contributing to Nexiloop AI

We love your input! We want to make contributing to Nexiloop AI as easy and transparent as possible, whether it's:

- Reporting a bug
- Discussing the current state of the code
- Submitting a fix
- Proposing new features
- Becoming a maintainer

## Development Process

We use GitHub to host code, to track issues and feature requests, as well as accept pull requests.

### Pull Requests

1. Fork the repo and create your branch from `main`
2. If you've added code that should be tested, add tests
3. If you've changed APIs, update the documentation
4. Ensure the test suite passes
5. Make sure your code lints
6. Issue that pull request!

### Coding Style

- Use TypeScript for all new code
- Follow the existing code style
- Run `npm run lint:fix` before committing
- Use meaningful commit messages

### Development Setup

1. Clone your fork
2. Install dependencies: `npm install`
3. Copy environment variables: `cp .env.example .env.local`
4. Set up database: `npm run db:setup`
5. Start development: `npm run dev`

### Testing

- Run linting: `npm run lint`
- Run type checking: `npm run type-check`
- Test build: `npm run build`

## Any Contributions You Make Will Be Under the MIT License

When you submit code changes, your submissions are understood to be under the same [MIT License](LICENSE) that covers the project.

## Report Bugs Using GitHub Issues

We use GitHub issues to track public bugs. Report a bug by [opening a new issue](https://github.com/mohameodo/nexiloop-ai-template/issues/new/choose).

**Great Bug Reports** tend to have:

- A quick summary and/or background
- Steps to reproduce
- What you expected would happen
- What actually happens
- Notes (possibly including why you think this might be happening)

## Feature Requests

We welcome feature requests! Please use the [feature request template](https://github.com/mohameodo/nexiloop-ai-template/issues/new/choose) to help us understand what you'd like to see.

## License

By contributing, you agree that your contributions will be licensed under its MIT License.

## References

This document was adapted from the open-source contribution guidelines for [Facebook's Draft](https://github.com/facebook/draft-js/blob/main/CONTRIBUTING.md)
