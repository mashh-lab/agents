import { google } from '@ai-sdk/google'

export const DEFAULT_MODEL_ID = 'gemini-2.5-flash-preview-05-20'
export const ADVANCED_MODEL_ID = 'gemini-2.5-pro-preview-05-06'

export const DEFAULT_EMBEDDING_MODEL_ID = 'gemini-embedding-exp-03-07'
export const DEFAULT_EMBEDDING_MODEL_DIMENSIONS = 1536
export const DEFAULT_EMBEDDING_MODEL_TASK_TYPE = 'SEMANTIC_SIMILARITY'

export const defaultModel = google(DEFAULT_MODEL_ID)
export const advancedModel = google(ADVANCED_MODEL_ID)

export const defaultEmbeddingModel = google.textEmbeddingModel(
  DEFAULT_EMBEDDING_MODEL_ID,
  {
    outputDimensionality: DEFAULT_EMBEDDING_MODEL_DIMENSIONS,
    taskType: DEFAULT_EMBEDDING_MODEL_TASK_TYPE,
  },
)
