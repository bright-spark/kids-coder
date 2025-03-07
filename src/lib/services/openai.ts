export interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export class AzureGPTService {
  private apiKey: string;
  private endpoint: string;
  private deploymentName: string;
  private apiVersion: string;

  constructor(
    apiKey: string,
    endpoint: string,
    deploymentName: string,
    apiVersion: string = "2023-05-15"
  ) {
    if (!apiKey || !endpoint) {
      throw new Error('Azure OpenAI API key and endpoint are required');
    }

    this.apiKey = apiKey;
    this.endpoint = endpoint;
    this.deploymentName = deploymentName;
    this.apiVersion = apiVersion;
  }

  async chat(
    messages: Message[],
    systemPrompt: string = "You are a helpful assistant."
  ): Promise<string> {
    try {
      const response = await fetch(
        `${this.endpoint}/openai/deployments/${this.deploymentName}/chat/completions?api-version=${this.apiVersion}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'api-key': this.apiKey,
          },
          body: JSON.stringify({
            messages: [
              { role: 'system', content: systemPrompt },
              ...messages
            ],
            max_tokens: 2048,
            temperature: 0.7,
            n: 1,
            stream: false
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Azure OpenAI API Error: ${response.status} - ${JSON.stringify(errorData)}`);
      }

      const data = await response.json();
      return data.choices[0].message?.content || '';
    } catch (error) {
      console.error('API Error:', error);
      throw new Error('Failed to generate a response. Please try again.');
    }
  }
}

// Initialize the Azure OpenAI client
const apiKey = process.env.AZURE_OPENAI_API_KEY || '';
const endpoint = process.env.AZURE_OPENAI_ENDPOINT || '';
const deploymentName = process.env.AZURE_OPENAI_DEPLOYMENT_NAME || '';
const service = new AzureGPTService(apiKey, endpoint, deploymentName);

export async function generateCode(prompt: string, existingCode?: string): Promise<string> {
  try {
    const messages: Message[] = [];

    if (existingCode) {
      messages.push({
        role: 'assistant',
        content: "Here's the current code we're working with:\n\n" + existingCode
      });
      messages.push({
        role: 'user',
        content: `Based on this existing code, ${prompt}`
      });
    } else {
      messages.push({
        role: 'user',
        content: prompt
      });
    }

    return await service.chat(messages, "You are a helpful coding assistant.");
  } catch (error) {
    console.error('API Error:', error);
    throw new Error('Failed to generate code. Please try again.');
  }
}

export async function improveCode(code: string): Promise<string> {
  try {
    const messages: Message[] = [
      { role: 'user', content: `Improve this code while maintaining its core functionality: ${code}` }
    ];

    return await service.chat(messages, "You are a helpful coding assistant.");
  } catch (error) {
    console.error('API Error:', error);
    throw new Error('Failed to improve code. Please try again.');
  }
}

export async function debugCode(code: string): Promise<string> {
  try {
    const messages: Message[] = [
      { role: 'user', content: `Debug and optimize this code while maintaining its core functionality: ${code}` }
    ];

    return await service.chat(messages, "You are a helpful coding assistant.");
  } catch (error) {
    console.error('API Error:', error);
    throw new Error('Failed to debug code. Please try again.');
  }
}