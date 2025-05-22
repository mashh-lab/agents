import { ConsoleLogger } from '@mastra/core/logger'
import { Mastra } from '@mastra/core/mastra'

import { VercelDeployer } from '@mastra/deployer-vercel'
import { conversationAgent, weatherAgent } from './agents'

// Create a Mastra server.
export const mastra = new Mastra({
  agents: { weatherAgent, conversationAgent },
  deployer: getDeployer(),
  logger: new ConsoleLogger({
    name: 'Mastra',
    level: 'info',
  }),
  server: {
    cors: {
      origin: processCorsRequest,
      allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowHeaders: ['Content-Type', 'Authorization', 'x-mastra-client-type'],
      exposeHeaders: ['Content-Length', 'X-Requested-With'],
      credentials: false,
    },
  },
  telemetry: {
    serviceName: 'loops-within-loops',
    enabled: false,
    sampling: {
      type: 'always_on',
    },
  },
})

/**
 * Processes a CORS request by checking if the origin is allowed.
 *
 * @param requestOrigin The origin of the request.
 * @returns The request origin if allowed, otherwise null.
 */
function processCorsRequest(requestOrigin?: string) {
  if (!requestOrigin) {
    return null // Disallow if no origin header
  }
  const corsAllowedOriginsString = getCorsAllowedOrigins()
  const allowedOriginRegexes: RegExp[] = []

  // Split the CORS_ALLOWED_ORIGINS by commas or spaces
  const patterns = corsAllowedOriginsString
    .split(/[ \s,]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0)

  for (const pattern of patterns) {
    try {
      // Convert wildcard pattern to regex
      // 1. Escape special regex characters in the pattern itself
      let regexString = pattern.replace(/[.\+?\^\[\]\(\)\{\}\$\|]/g, '\\$&')
      // 2. Replace wildcard * with .* (match any characters)
      regexString = regexString.replace(/\*/g, '.*')
      // 3. Anchor the regex to match the entire string
      const regex = new RegExp(`^${regexString}$`)
      allowedOriginRegexes.push(regex)
    } catch (e) {
      console.warn(
        'Failed to parse CORS_ALLOWED_ORIGINS pattern as regex:',
        pattern,
        e,
      )
      // If a pattern fails to compile (e.g. bad manual regex attempt), it will be skipped.
      // We could add it as a literal string match if desired, but for wildcard patterns, failure usually means an invalid pattern.
    }
  }

  if (allowedOriginRegexes.some((regex) => regex.test(requestOrigin))) {
    return requestOrigin // Allow the origin by returning it
  }
}

/**
 * Gets the deployer based on the environment.
 *
 * @returns The VercelDeployer if in a Vercel environment, otherwise undefined.
 */
function getDeployer() {
  return process.env.VERCEL
    ? new VercelDeployer(getVercelDeployerOptions())
    : undefined
}

/**
 * Gets the Vercel deployer options from environment variables.
 *
 * @returns The Vercel deployer options.
 * @throws Error if VERCEL_TOKEN, VERCEL_TEAM_SLUG, or VERCEL_PROJECT_NAME are not set.
 */
function getVercelDeployerOptions() {
  if (
    !process.env.VERCEL_TOKEN ||
    !process.env.VERCEL_TEAM_SLUG ||
    !process.env.VERCEL_PROJECT_NAME
  ) {
    throw new Error(
      'One of VERCEL_TOKEN, VERCEL_TEAM_SLUG and VERCEL_PROJECT_NAME are not set',
    )
  }
  return {
    token: process.env.VERCEL_TOKEN,
    teamSlug: process.env.VERCEL_TEAM_SLUG,
    projectName: process.env.VERCEL_PROJECT_NAME,
  }
}

/**
 * Gets the allowed CORS origins from environment variables.
 *
 * @returns A string of allowed CORS origins, defaulting to 'http://localhost:3000'.
 */
function getCorsAllowedOrigins() {
  return process.env.CORS_ALLOWED_ORIGINS || 'http://localhost:3000'
}
