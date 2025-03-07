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
    apiKey?: string,
    endpoint?: string,
    deploymentName?: string,
    apiVersion?: string
  ) {
    // These will only be accessible server-side
    this.apiKey = apiKey || process.env.AZURE_OPENAI_KEY || '';
    this.endpoint = endpoint || process.env.AZURE_OPENAI_ENDPOINT || '';
    this.deploymentName = deploymentName || process.env.AZURE_OPENAI_DEPLOYMENT_NAME || '';
    this.apiVersion = apiVersion || process.env.AZURE_OPENAI_VERSION || "2023-05-15";

    if (!this.apiKey || !this.endpoint) {
      throw new Error('Azure OpenAI API key and endpoint are required');
    }

    console.log("AzureGPTService initialized with:", {
      endpointProvided: !!this.endpoint,
      apiKeyProvided: !!this.apiKey,
      deploymentNameProvided: !!this.deploymentName,
      apiVersionProvided: !!this.apiVersion
    });
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
            max_tokens: 800,  
            temperature: 0.7,  
            top_p: 0.9,  
            frequency_penalty: 0.1,  
            presence_penalty: 0.1,
            stop: null,  
            stream: false
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Azure API Error: ${response.status} - ${JSON.stringify(errorData)}`);
      }

      const data = await response.json();
      return data.choices[0].message?.content || '';
    } catch (error) {
      console.error('Azure OpenAI API Error:', error);
      throw error;
    }
  }
}

// Don't create a singleton instance that would be included in client-side code
// Each API route should create its own instance

export async function generateCode(prompt: string, existingCode?: string): Promise<string> {
  try {
    const messages: Message[] = [];

    if (existingCode) {
      messages.push({
        role: "assistant",
        content: "Here's the current code we're working with:\n\n" + existingCode
      });
      messages.push({
        role: "user",
        content: `Based on this existing code, ${prompt}`
      });
    } else {
      messages.push({
        role: "user",
        content: prompt
      });
    }

    const systemPrompt = "You are an expert in HTML, CSS, and JavaScript. Generate complete, working code based on the user's request.";

    // Create a new instance for this function call
    const service = new AzureGPTService();
    return await service.chat(messages, systemPrompt);
  } catch (error) {
    console.error('Error in code generation:', error);
    throw error;
  }
}

export async function improveCode(code: string): Promise<string> {
  try {
    const messages: Message[] = [
      { role: 'user', content: `Improve this code while maintaining its core functionality: ${code}` }
    ];

    // Create a new instance for this function call
    const service = new AzureGPTService();
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

    // Create a new instance for this function call
    const service = new AzureGPTService();
    return await service.chat(messages, "You are a helpful coding assistant.");
  } catch (error) {
    console.error('API Error:', error);
    throw new Error('Failed to debug code. Please try again.');
  }
}