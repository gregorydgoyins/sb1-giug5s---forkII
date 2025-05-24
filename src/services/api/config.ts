import type { APIConfig } from './types';

export const API_CONFIG: APIConfig = {
  openai: {
    baseUrl: 'https://api.openai.com/v1',
    version: 'v1',
    timeout: 30000,
    retries: 3,
    endpoints: {
      completions: '/completions',
      embeddings: '/embeddings',
      chat: '/chat/completions'
    }
  },
  runwayml: {
    baseUrl: 'https://api.runwayml.com',
    version: 'v1',
    timeout: 60000,
    retries: 2,
    endpoints: {
      generate: '/generate',
      inference: '/inference'
    }
  },
  anthropic: {
    baseUrl: 'https://api.anthropic.com',
    version: 'v1',
    timeout: 30000,
    retries: 3,
    endpoints: {
      messages: '/messages',
      completions: '/completions'
    }
  },
  google: {
    baseUrl: 'https://www.googleapis.com',
    timeout: 10000,
    retries: 2,
    endpoints: {
      search: '/customsearch/v1',
      trends: '/trends/api/v1'
    }
  },
  supabase: {
    timeout: 10000,
    retries: 3,
    endpoints: {
      data: '/rest/v1',
      auth: '/auth/v1',
      storage: '/storage/v1'
    }
  },
  pinecone: {
    baseUrl: 'https://api.pinecone.io',
    version: 'v1',
    timeout: 20000,
    retries: 2,
    endpoints: {
      vectors: '/vectors',
      indexes: '/indexes'
    }
  },
  elevenlabs: {
    baseUrl: 'https://api.elevenlabs.io',
    version: 'v1',
    timeout: 30000,
    retries: 2,
    endpoints: {
      tts: '/text-to-speech',
      voices: '/voices'
    }
  }
};