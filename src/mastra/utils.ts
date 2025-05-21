export function getVercelDeployerOptions() {
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

export function getUpstashOptions() {
  if (!process.env.UPSTASH_URL || !process.env.UPSTASH_TOKEN) {
    throw new Error('UPSTASH_URL and UPSTASH_TOKEN are not set')
  }
  return {
    url: process.env.UPSTASH_URL,
    token: process.env.UPSTASH_TOKEN,
  }
}

export function getCorsAllowedOrigins() {
  return process.env.CORS_ALLOWED_ORIGINS || 'http://localhost:3000'
}
