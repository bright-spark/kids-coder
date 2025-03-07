import { AzureKeyCredential, OpenAIClient } from "@azure/openai";

// Create Azure OpenAI client
const endpoint = process.env.AZURE_OPENAI_ENDPOINT || '';
const apiKey = process.env.AZURE_OPENAI_API_KEY || '';
const deploymentName = process.env.AZURE_OPENAI_DEPLOYMENT_NAME || '';

// Initialize the Azure OpenAI client
const client = new OpenAIClient(endpoint, new AzureKeyCredential(apiKey));


export async function generateCode(prompt: string, existingCode?: string): Promise<string> {
  try {
    const messages = [
      { role: "system", content: "You are a helpful coding assistant." },
      { role: "user", content: `Generate code based on the following prompt: ${prompt}  Existing code: ${existingCode || ""}` },
    ];

    const result = await client.getChatCompletions(
      deploymentName,
      messages,
      {
        temperature: 0.7,
        maxTokens: 2048,
        n: 1
      }
    );

    return result.choices[0].message?.content || '';
  } catch (error) {
    console.error('API Error:', error);
    throw new Error('Failed to generate code. Please try again.');
  }
}

export async function improveCode(code: string): Promise<string> {
  try {
    const messages = [
      { role: "system", content: "You are a helpful coding assistant." },
      { role: "user", content: `Improve this code while maintaining its core functionality: ${code}` },
    ];

    const result = await client.getChatCompletions(
      deploymentName,
      messages,
      {
        temperature: 0.7,
        maxTokens: 2048,
        n: 1
      }
    );

    return result.choices[0].message?.content || '';
  } catch (error) {
    console.error('API Error:', error);
    throw new Error('Failed to improve code. Please try again.');
  }
}

export async function debugCode(code: string): Promise<string> {
  try {
    const messages = [
      { role: "system", content: "You are a helpful coding assistant." },
      { role: "user", content: `Debug and optimize this code while maintaining its core functionality: ${code}` },
    ];

    const result = await client.getChatCompletions(
      deploymentName,
      messages,
      {
        temperature: 0.7,
        maxTokens: 2048,
        n: 1
      }
    );

    return result.choices[0].message?.content || '';
  } catch (error) {
    console.error('API Error:', error);
    throw new Error('Failed to debug code. Please try again.');
  }
}