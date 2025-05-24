import { BaseAPIClient } from './BaseAPIClient';
import { API_CONFIG } from '../config';
import { API_KEYS } from '../../../utils/env';

export class OpenAIClient extends BaseAPIClient {
  constructor() {
    super(API_CONFIG.openai, API_KEYS.OPENAI, 'openai');
  }

  public async createCompletion(prompt: string): Promise<string> {
    const response = await this.post(this.getEndpoint('completions'), {
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }]
    });

    if (response.error) {
      throw new Error(response.error);
    }

    return response.data?.choices?.[0]?.message?.content || '';
  }
}