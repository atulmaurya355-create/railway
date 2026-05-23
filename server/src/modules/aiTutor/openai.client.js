import OpenAI from 'openai';
import { env } from '../../config/env.js';

export function createOpenAIClient() {
  if (!env.OPENAI_API_KEY) {
    return null;
  }

  return new OpenAI({
    apiKey: env.OPENAI_API_KEY,
  });
}
