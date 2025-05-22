import { createLogger } from '@mastra/core/logger'
import { Mastra } from '@mastra/core/mastra'

import { VercelDeployer } from '@mastra/deployer-vercel'
import { UpstashStore } from '@mastra/upstash'
import { conversationAgent, weatherAgent } from './agents'
import {
  getUpstashOptions,
  getCorsAllowedOrigins,
  getVercelDeployerOptions,
} from './utils'

export const mastra = new Mastra({
  agents: { weatherAgent, conversationAgent },
  deployer: new VercelDeployer(getVercelDeployerOptions()),
  storage: new UpstashStore(getUpstashOptions()),
  logger: createLogger({
    name: 'Mastra',
    level: 'info',
  }),
  server: {
    cors: {
      origin: (requestOrigin?: string) => {
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
            let regexString = pattern.replace(
              /[.\+?\^\[\]\(\)\{\}\$\|]/g,
              '\\$&',
            )
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

        // Important: If the requestOrigin is the same as the backend's own URL (for server-to-server or same-site scenarios not going through typical browser CORS)
        // you might want to allow it. This depends on how Vercel handles the Origin header for rewrites internally if it's considered same-site.
        // For now, we are strict to the frontend URLs.

        return null // Disallow other origins
      },
      allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowHeaders: ['Content-Type', 'Authorization', 'x-mastra-client-type'],
      exposeHeaders: ['Content-Length', 'X-Requested-With'],
      credentials: false,
    },
  },
})
