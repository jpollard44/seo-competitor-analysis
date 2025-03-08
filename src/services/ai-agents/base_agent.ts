import { generateAnalysis } from '../api/openai';

export abstract class BaseAgent {
  protected apiKey: string;
  protected systemPrompt: string = '';

  constructor(apiKey: string) {
    if (!apiKey) {
      throw new Error('API key is required for agent initialization');
    }
    this.apiKey = apiKey;
  }

  protected async analyzeWithAI(prompt: string): Promise<string> {
    try {
      console.log(`${this.constructor.name}: Analyzing with AI`);
      console.log('System prompt length:', this.systemPrompt.length);
      console.log('User prompt length:', prompt.length);
      
      if (!this.apiKey) {
        throw new Error('API key is required for AI analysis');
      }
      
      const result = await generateAnalysis(this.apiKey, this.systemPrompt, prompt);
      console.log(`${this.constructor.name}: AI analysis completed, result length:`, result.length);
      return result;
    } catch (error) {
      console.error(`${this.constructor.name}: AI analysis failed:`, error);
      
      // Propagate API key errors
      if (error instanceof Error && 
          (error.message.includes('API key') || 
           error.message.includes('authentication') || 
           error.message.includes('unauthorized'))) {
        throw error;
      }
      
      throw new Error(`AI analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  abstract analyze(input: string, html?: string): Promise<any>;
} 