
import { extractCodeAndExplanation } from '../utils/message-formatter';

interface GenerateResponse {
  code: string;
  error?: string;
}

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

async function retryWithDelay<T>(fn: () => Promise<T>, retries: number = MAX_RETRIES): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (retries === 0) throw error;
    await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
    return retryWithDelay(fn, retries - 1);
  }
}

export async function generateCode(prompt: string, existingCode?: string): Promise<string> {
  return retryWithDelay(async () => {
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
  });
}

export async function improveCode(code: string): Promise<string> {
  const prompt = "Improve this code by adding new features, optimizing performance, and enhancing the user experience while maintaining its core functionality.";
  return generateCode(prompt, code);
}

export async function debugCode(code: string): Promise<string> {
  const prompt = "Debug this code, fix any errors, and add error handling where necessary while maintaining its core functionality.";
  return generateCode(prompt, code);
}
