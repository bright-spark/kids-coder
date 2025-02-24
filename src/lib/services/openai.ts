
import { extractCodeAndExplanation } from '../utils/message-formatter';

interface GenerateResponse {
  code: string;
  error?: string;
}

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

export async function generateCode(prompt: string, existingCode?: string): Promise<string> {
  let attempts = 0;
  while (attempts < MAX_RETRIES) {
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
      attempts++;
      if (attempts === MAX_RETRIES) {
        throw new Error(error instanceof Error ? error.message : 'Failed to generate code');
      }
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
    }
  }
  throw new Error('Failed to generate code after retries');
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
