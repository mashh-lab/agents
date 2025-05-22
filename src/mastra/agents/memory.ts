import { LibSQLStore, LibSQLVector } from '@mastra/libsql'
import { Memory } from '@mastra/memory'
import { UpstashStore, UpstashVector } from '@mastra/upstash'
import { defaultEmbeddingModel } from './models'

const LAST_MESSAGES = 42

/**
 * Get the memory instance based on the environment.
 *
 * If the environment is VERCEL, use Upstash for storage and vector.
 * Otherwise, use LibSQL for local storage and vector.
 * @returns The memory instance.
 */
export function getMemory(): Memory {
  return process.env.VERCEL ? getUpstashMemory() : getLocalMemory()
}

function getLocalMemory(): Memory {
  return new Memory({
    storage: new LibSQLStore({
      url: process.env.DATABASE_URL || 'file:local.db',
    }),
    vector: new LibSQLVector({
      connectionUrl: process.env.DATABASE_URL || 'file:local.db',
    }),
    embedder: defaultEmbeddingModel,
    options: {
      lastMessages: LAST_MESSAGES,
      semanticRecall: true,
      threads: {
        generateTitle: false,
      },
    },
  })
}

function getUpstashMemory(): Memory {
  const upstashStorageOptions = getUpstashStorageOptions()
  const upstashVectorOptions = getUpstashVectorOptions()

  return new Memory({
    storage: new UpstashStore(upstashStorageOptions),
    vector: new UpstashVector(upstashVectorOptions),
    embedder: defaultEmbeddingModel,
    options: {
      lastMessages: LAST_MESSAGES,
      semanticRecall: true,
      threads: {
        generateTitle: false,
      },
    },
  })
}

function getUpstashStorageOptions() {
  if (!process.env.UPSTASH_REDIS_URL || !process.env.UPSTASH_REDIS_TOKEN) {
    throw new Error('UPSTASH_REDIS_URL and UPSTASH_REDIS_TOKEN are not set')
  }
  return {
    url: process.env.UPSTASH_REDIS_URL,
    token: process.env.UPSTASH_REDIS_TOKEN,
  }
}

function getUpstashVectorOptions() {
  if (!process.env.UPSTASH_VECTOR_URL || !process.env.UPSTASH_VECTOR_TOKEN) {
    throw new Error('UPSTASH_VECTOR_URL and UPSTASH_VECTOR_TOKEN are not set')
  }
  return {
    url: process.env.UPSTASH_VECTOR_URL,
    token: process.env.UPSTASH_VECTOR_TOKEN,
  }
}
