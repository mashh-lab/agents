import { UpstashStore, UpstashVector } from '@mastra/upstash'
import { Memory } from '@mastra/memory'
import { LibSQLStore, LibSQLVector } from '@mastra/libsql'
import { google } from '@ai-sdk/google'

const LAST_MESSAGES = 42
const EMBEDDING_MODEL = 'text-embedding-004'

export function getMemory() {
  return process.env.VERCEL ? getUpstashMemory() : getLocalMemory()
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


function getUpstashMemory() {
  const upstashStorageOptions = getUpstashStorageOptions()
  const upstashVectorOptions = getUpstashVectorOptions()

  return new Memory({
    storage: new UpstashStore(upstashStorageOptions),
    vector: new UpstashVector(upstashVectorOptions),
    embedder: google.textEmbeddingModel(EMBEDDING_MODEL, {
      outputDimensionality: 1536,
      taskType: 'SEMANTIC_SIMILARITY',
    }),
    options: {
      lastMessages: LAST_MESSAGES,
      semanticRecall: true,
      threads: {
        generateTitle: false,
      },
    },
  })
}

function getLocalMemory() {
  return new Memory({
    storage: new LibSQLStore({
      url: process.env.DATABASE_URL || "file:local.db",
    }),
    vector: new LibSQLVector({
      connectionUrl: process.env.DATABASE_URL || "file:local.db",
    }),
    embedder: google.textEmbeddingModel(EMBEDDING_MODEL),
    options: {
      lastMessages: LAST_MESSAGES,
      semanticRecall: true,
      threads: {
        generateTitle: false,
      },
    },
  });
}