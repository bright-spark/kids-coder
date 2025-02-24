
import { extractCodeAndExplanation } from '../utils/message-formatter';

export async function generateCode(prompt: string, existingCode?: string): Promise<string> {
  try {
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt, existingCode }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to generate code');
    }

    const data = await response.json();
    return data.code;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Failed to generate code');
  }
}

export async function improveCode(code: string): Promise<string> {
  try {
    const prompt = "Improve this code by adding new features, optimizing performance, and enhancing the user experience while maintaining its core functionality.";
    return await generateCode(prompt, code);
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Failed to improve code');
  }
}

export async function debugCode(code: string): Promise<string> {
  try {
    const prompt = "Debug this code, fix any errors, and add error handling where necessary while maintaining its core functionality.";
    return await generateCode(prompt, code);
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Failed to debug code');
  }
}
