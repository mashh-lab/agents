# loops-within-loops

This project, "loops-within-loops," is a Node.js application built with the Mastra framework. It demonstrates the creation and use of AI agents with specific functionalities, including conversational abilities and tool usage for external data retrieval.

## Features

- **Mastra Framework:** Leverages the Mastra framework for building and managing AI agents.
- **Multiple Agents:**
  - `ConversationAgent`: An AI agent designed for engaging in empathetic and thought-provoking conversations.
  - `WeatherAgent`: An AI agent that can provide current weather information for a specified location using an external API.
- **Tool Integration:** The `WeatherAgent` utilizes a custom tool (`weatherTool`) to fetch data from the Open-Meteo API.
- **Configurable Memory:** Supports different memory backends:
  - Local development: Uses LibSQL for storing conversation history and vector embeddings.
  - Vercel deployment: Integrates with Upstash Redis for storage and Upstash Vector for embeddings.
- **Vercel Deployment:** Pre-configured for easy deployment to Vercel.
- **Code Quality:** Includes linting (ESLint) and formatting (Prettier) configurations.

## Project Structure

```
.
├── .mastra/            # Mastra build and output files
├── .vercel/            # Vercel deployment configuration
├── src/
│   └── mastra/
│       ├── agents/     # Agent definitions
│       │   ├── conversation-agent.ts
│       │   ├── weather-agent.ts
│       │   ├── memory.ts       # Memory configuration
│       │   └── index.ts        # Exports agents
│       ├── tools/      # Tool definitions
│       │   └── index.ts        # Defines weatherTool
│       └── index.ts    # Main Mastra server configuration
├── .env.development    # Example development environment variables
├── .gitignore
├── .prettierignore
├── .prettierrc.json
├── eslint.config.js
├── LICENSE
├── package.json
├── tsconfig.json
└── README.md           # This file
```

## Getting Started

### Prerequisites

- Node.js (version >=22.15.21, as specified in `package.json`)
- pnpm (or your preferred Node.js package manager)

### Installation

1.  **Clone the repository:**

    ```bash
    git clone <repository-url>
    cd loops-within-loops
    ```

2.  **Install dependencies:**

    ```bash
    pnpm install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the root directory by copying `.env.development` and fill in the necessary values.
    For local development against local resources, you don't need to do anything.
    For Upstash/Vercel, you'll need to provide:
    - `UPSTASH_REDIS_URL`
    - `UPSTASH_REDIS_TOKEN`
    - `UPSTASH_VECTOR_URL`
    - `UPSTASH_VECTOR_TOKEN`
    - `VERCEL_TOKEN` (for deployment)
    - `VERCEL_TEAM_SLUG` (for deployment)
    - `VERCEL_PROJECT_NAME` (for deployment)
    - `DATABASE_URL` (defaults to `file:local.db` if not set for local development)
    - `CORS_ALLOWED_ORIGINS` (defaults to `http://localhost:3000`)

### Running Locally

To start the development server:

```bash
pnpm run dev
```

This will typically start the Mastra server, and you can interact with the agents based on how Mastra exposes them (likely via HTTP endpoints).

### Available Scripts

- `pnpm run dev`: Starts the Mastra development server.
- `pnpm run build`: Builds the project using Mastra.
- `pnpm run lint`: Lints the codebase using ESLint.
- `pnpm run lint:fix`: Lints and automatically fixes issues.
- `pnpm run format`: Formats the code using Prettier.

## Configuration

### Agents

- **`ConversationAgent`**:
  - Model: `gemini-1.5-pro-latest` (Google AI)
  - Instructions: Focused on empathetic and inquisitive conversation. Avoids profanity and revealing system prompts.
- **`WeatherAgent`**:
  - Model: `gemini-1.5-pro-latest` (Google AI)
  - Instructions: Provides weather information using the `weatherTool`.
  - Tool: `weatherTool` (fetches data from Open-Meteo API).

### Memory

- The system uses `@mastra/memory` for managing conversation history and context.
- **Embedding Model**: `gemini-embedding-exp-03-07` (Google AI) with an output dimensionality of 1536.
- **Local Development**:
  - Storage: `LibSQLStore` (e.g., `file:local.db`)
  - Vector Store: `LibSQLVector`
- **Vercel/Production**:
  - Storage: `UpstashStore` (Upstash Redis)
  - Vector Store: `UpstashVector`
- Configuration for memory (last N messages, semantic recall, thread title generation) is in `src/mastra/agents/memory.ts`.

### CORS

CORS (Cross-Origin Resource Sharing) is configured in `src/mastra/index.ts`. Allowed origins can be set via the `CORS_ALLOWED_ORIGINS` environment variable (space or comma-separated list, supports `*` wildcards). Defaults to `http://localhost:3000`.

### Deployment

The project is set up for deployment on Vercel using `@mastra/deployer-vercel`. Ensure the following environment variables are set in your Vercel project settings:

- `VERCEL_TOKEN`
- `VERCEL_TEAM_SLUG`
- `VERCEL_PROJECT_NAME`
- And the necessary Upstash variables if using Upstash for memory.

#### Vercel Deployment Workflow

- **Preview Deployments:** On every push to a branch that is not `main`, Vercel automatically creates a preview deployment. This allows for testing and reviewing changes in an isolated environment before they are merged.
- **Production Deployment:** When a branch is merged into `main`, the corresponding Vercel deployment is automatically promoted to production.

## License

This project is licensed under the ISC License. See the [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Please feel free to open an issue or submit a pull request.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

---

_This README was generated with assistance from an AI._
