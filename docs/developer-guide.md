# Developer Guide

Welcome to the Project Plan App developer documentation. This guide will help you set up your development environment, understand the project structure, follow coding standards, and contribute effectively.

## Table of Contents

- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Coding Standards](#coding-standards)
- [Contribution Workflow](#contribution-workflow)
- [Testing](#testing)
- [Support](#support)

---

## Getting Started

1. **Clone the repository:**
    ```bash
    git clone https://github.com/saint1415/project-plan-app.git
    cd project-plan-app
    ```
2. **Install dependencies:**
    ```bash
    npm install
    ```
3. **Start the development server:**
    ```bash
    npm start
    ```
    The app will be available at [http://localhost:3000](http://localhost:3000).

---

## Project Structure

- `/public` — Static files and `index.html`
- `/src` — Main application code
    - `/components` — Reusable UI components
    - `/contexts` — React context providers
    - `/hooks` — Custom React hooks
    - `/utils` — Utility functions
    - `/services` — External integrations (AI, cloud, analytics)
    - `/assets` — Images, icons, fonts
    - `/i18n` — Localization files
- `/docs` — Documentation
- `/tests` — Automated tests

---

## Coding Standards

- Use [Prettier](https://prettier.io/) for code formatting.
- Follow [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript) for JavaScript/React.
- Use descriptive variable and function names.
- Write clear, concise comments where necessary.
- Keep components small and focused.

---

## Contribution Workflow

1. **Fork the repository** and create a new branch for your feature or bugfix.
2. **Write clear, descriptive commit messages.**
3. **Test your changes** locally before submitting.
4. **Submit a pull request** with a detailed description of your changes.
5. **Participate in code reviews** and address feedback promptly.

---

## Testing

- Place unit tests in `/tests/unit/`
- Place integration tests in `/tests/integration/`
- Place end-to-end tests in `/tests/e2e/`
- Run all tests with:
    ```bash
    npm test
    ```
- Aim for high coverage, especially for critical features.

---

## Support

For questions or support, open an issue on GitHub or contact the maintainers.
