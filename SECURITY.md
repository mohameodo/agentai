# Security Policy

## Supported Versions

We actively support the following versions with security updates:

| Version | Supported          |
| ------- | ------------------ |
| 0.1.x   | :white_check_mark: |

## Reporting a Vulnerability

We take security vulnerabilities seriously. If you discover a security vulnerability, please report it to us privately.

### How to Report

**Please do NOT report security vulnerabilities through public GitHub issues.**

Instead, please email us at: **security@nexiloop.ai** (if available) or create a private security advisory.

### What to Include

Please include the following information in your report:

- Description of the vulnerability
- Steps to reproduce the issue
- Potential impact
- Suggested fix (if any)
- Your contact information

### Response Timeline

- **Initial Response**: Within 48 hours
- **Status Update**: Within 1 week
- **Resolution**: We aim to resolve critical vulnerabilities within 30 days

### Safe Harbor

We support safe harbor for security researchers who:

- Make a good faith effort to avoid privacy violations and disruptions
- Only interact with accounts you own or have explicit permission from the account holder
- Do not access or modify others' data
- Report vulnerabilities promptly
- Do not exploit vulnerabilities beyond what is necessary to demonstrate the issue

### Disclosure Policy

- Report security bugs privately to allow us to assess and fix them
- We will acknowledge your report within 48 hours
- We will provide regular updates on our progress
- Once the issue is resolved, we may publicly disclose the vulnerability
- We may credit you in the disclosure (with your permission)

## Security Best Practices

When using this template:

### Environment Variables
- Never commit `.env` files to version control
- Use strong, unique API keys
- Rotate keys regularly
- Use environment-specific configurations

### Database Security
- Use Row Level Security (RLS) in Supabase
- Implement proper authentication checks
- Validate all user inputs
- Use parameterized queries

### API Security
- Implement rate limiting
- Validate and sanitize inputs
- Use HTTPS in production
- Implement proper error handling (don't expose sensitive info)

### Authentication
- Use secure session management
- Implement proper logout functionality
- Use strong password policies (if using email/password)
- Enable MFA when possible

Thank you for helping keep Nexiloop AI and our users safe!
