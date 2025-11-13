import { Injectable } from '@nestjs/common';
import Groq from "groq-sdk";

@Injectable()
export class OpenAIService {
  private client = new Groq({
    apiKey: process.env.GROQ_API_KEY,
  });

  async generateSummary(prompt: string): Promise<string> {
    const response = await this.client.chat.completions.create({
      model: 'openai/gpt-oss-20b',
      messages: [
        { role: 'system', content: 'You are a financial analyst summarizing market data clearly and briefly.' },
        { role: 'user', content: prompt },
      ],
      max_tokens: 8192,
      temperature: 0.7,
    });

    return response.choices[0]?.message?.content?.trim() ?? 'No summary generated.';
  }
}