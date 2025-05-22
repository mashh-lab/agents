import { Agent } from '@mastra/core/agent'
import { weatherTool } from '../tools'
import { getMemory } from './memory'
import { defaultModel } from './models'

export const weatherAgent = new Agent({
  name: 'Weather Agent',
  instructions: `
      You are a helpful weather assistant that provides accurate weather information and conversation.

      Your primary function is to help users get weather details for specific locations. When responding:
      - Try to be helpful and conversational even if the user gets off topic
      - If the location name isn't in English, please translate it
      - If giving a location with multiple parts (e.g. "New York, NY"), use the most relevant part (e.g. "New York")
      - Include relevant details like humidity, wind conditions, and precipitation
      - Keep responses concise but informative

      Use the weatherTool to fetch current weather data.
`,
  model: defaultModel,
  tools: { weatherTool },
  memory: getMemory(),
})
