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
      throw new Error('Failed to generate code');
    }

    const data = await response.json();
    return data.code;
  } catch (error) {
    console.error('API Error:', error);
    throw new Error('Failed to generate code. Please try again.');
  }
}

export async function improveCode(code: string): Promise<string> {
  try {
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: 'Improve this code while maintaining its core functionality',
        existingCode: code
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to improve code');
    }

    const data = await response.json();
    return data.code;
  } catch (error) {
    console.error('API Error:', error);
    throw new Error('Failed to improve code. Please try again.');
  }
}

export async function debugCode(code: string): Promise<string> {
  try {
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: 'Debug and optimize this code while maintaining its core functionality',
        existingCode: code
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to debug code');
    }

    const data = await response.json();
    return data.code;
  } catch (error) {
    console.error('API Error:', error);
    throw new Error('Failed to debug code. Please try again.');
  }
}