
import { OpenAI } from "openai";

interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export class AzureGPTService {
  private client: OpenAI;
  private apiKey: string;
  private endpoint: string;
  private deploymentName: string;
  private apiVersion: string;

  constructor(
    apiKey?: string,
    endpoint?: string,
    deploymentName?: string,
    apiVersion?: string
  ) {
    // Get from environment or passed in
    this.apiKey = apiKey || process.env.AZURE_OPENAI_API_KEY || '';
    this.endpoint = endpoint || process.env.AZURE_OPENAI_ENDPOINT || '';
    this.deploymentName = deploymentName || process.env.AZURE_OPENAI_DEPLOYMENT_NAME || '';
    this.apiVersion = apiVersion || process.env.AZURE_OPENAI_VERSION || "2023-05-15";

    // Enhanced logging to help diagnose the issue
    console.log("Environment variables check:", {
      AZURE_OPENAI_API_KEY_exists: !!process.env.AZURE_OPENAI_API_KEY,
      AZURE_OPENAI_ENDPOINT_exists: !!process.env.AZURE_OPENAI_ENDPOINT,
      AZURE_OPENAI_DEPLOYMENT_NAME_exists: !!process.env.AZURE_OPENAI_DEPLOYMENT_NAME,
      AZURE_OPENAI_VERSION_exists: !!process.env.AZURE_OPENAI_VERSION
    });

    if (!this.apiKey || !this.endpoint) {
      throw new Error('Azure OpenAI API key and endpoint are required');
    }

    // Create OpenAI client configured for Azure
    this.client = new OpenAI({
      apiKey: this.apiKey,
      baseURL: `${this.endpoint}/openai/deployments/${this.deploymentName}`,
      defaultQuery: { 'api-version': this.apiVersion },
    });
  }

  async chat(messages: Message[], systemPrompt?: string): Promise<string> {
    try {
      // Add system prompt if provided and not already in messages
      if (systemPrompt && !messages.some(m => m.role === 'system')) {
        messages.unshift({ role: 'system', content: systemPrompt });
      }

      const response = await this.client.chat.completions.create({
        model: this.deploymentName,
        messages: messages as any,
        temperature: 0.7,
        max_tokens: 4000
      });

      return response.choices[0]?.message?.content || '';
    } catch (error) {
      console.error('Error in Azure OpenAI chat:', error);
      throw error;
    }
  }
}
