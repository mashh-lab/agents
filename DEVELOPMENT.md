# Development Guide

This document provides guidance for developers contributing to this project. It complements the general contribution guidelines in `CONTRIBUTING.md`.

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (version >=22.15.21, as specified in `package.json`)
- pnpm (or your preferred Node.js package manager, though `pnpm` is used in project scripts)

## Setting up the Development Environment

1.  **Clone the repository:**

    ```bash
    git clone <repository-url> # Replace with your repository URL
    cd agents # Or your repository directory name
    ```

2.  **Install dependencies:**

    ```bash
    pnpm install
    ```

3.  **Environment Variables:**
    For local development against local resources, you generally do not need to set up a `.env` file, as the application defaults to using a local SQLite database (`file:local.db`).

    If you plan to work with or test features requiring remote services (like Upstash for Vercel deployments), follow these steps:

    - Copy the `.env.development` file to a new file named `.env` in the project root:
      ```bash
      cp .env.development .env
      ```
    - Edit the `.env` file and fill in the necessary values for services such as Upstash Redis, Upstash Vector, and Vercel. Refer to the "Set up environment variables for remote resources" section in `README.md` for a list of variables like:
      - `UPSTASH_REDIS_URL`
      - `UPSTASH_REDIS_TOKEN`
      - `UPSTASH_VECTOR_URL`
      - `UPSTASH_VECTOR_TOKEN`
      - `DATABASE_URL` (if overriding the default `file:local.db`)
      - `CORS_ALLOWED_ORIGINS` (defaults to `http://localhost:3000`)

## Running the Project Locally

To start the development server:

```bash
pnpm run dev
```

This will start the local Mastra server. The Mastra Playground will be accessible at `http://localhost:4111/agents`.

## Building the Project

To create a production build of the project:

```bash
pnpm run build
```

Build artifacts will be located in the `.mastra/` directory.

## Code Quality: Linting and Formatting

This project uses ESLint for identifying and reporting on patterns in JavaScript/TypeScript and Prettier for code formatting to ensure consistency.

- **Lint the codebase:**
  ```bash
  pnpm run lint
  ```
- **Lint and automatically fix issues:**
  ```bash
  pnpm run lint:fix
  ```
- **Format the code:**
  ```bash
  pnpm run format
  ```

Please run these tools before committing your changes to maintain code quality.

## Testing

_(This section is a placeholder. Please update it with details about the testing strategy, frameworks used, and commands to run tests as they are developed.)_

For example:

```bash
# pnpm run test
# pnpm run test:watch
# pnpm run test:coverage
```

## Debugging

_(This section is a placeholder. Add tips for debugging the application, including any specific tools, configurations, or common issues and their resolutions.)_

## Coding Conventions

In addition to the automated checks performed by ESLint and Prettier:

- **Branching:** Follow the branch naming conventions described in `CONTRIBUTING.md` (e.g., `fix/my-issue-fix`, `feat/new-cool-feature`).
- **Commit Messages:** Write clear, concise, and descriptive commit messages. Consider adhering to a convention like Conventional Commits if the team decides.
- **Documentation:** Add comments to your code where logic is complex or non-obvious. Update relevant documentation (like this `DEVELOPMENT.md` or the `README.md`) if your changes affect setup, build, or usage.

## Submitting Changes

For the process of submitting changes, including forking the repository, creating pull requests, and the review process, please refer to the `CONTRIBUTING.md` file.

## Project Structure Overview

A general overview of the project structure is available in the main `README.md`. Key directories for development include:

- `src/mastra/agents/`: Contains the definitions for different AI agents.
- `src/mastra/tools/`: Contains definitions for tools that agents can use.
- `src/mastra/index.ts`: The main Mastra server configuration file.
- `src/mastra/agents/memory.ts`: Configuration for memory backends (LibSQL, Upstash).

Please review and customize this `DEVELOPMENT.md` file further to best suit your project's specific needs, especially the "Testing" and "Debugging" sections.
