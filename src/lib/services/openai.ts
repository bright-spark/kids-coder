export async function generateCode(prompt: string, existingCode?: string): Promise<string> {
  try {
    if (!prompt || prompt.trim() === '') {
      throw new Error('Prompt cannot be empty');
    }
    
    console.log('Generating code with prompt:', prompt.substring(0, 50) + '...');
    
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt, existingCode }),
    });

    let data;
    try {
      // Get the raw text first to see what's being returned
      const responseText = await response.text();
      console.log('Raw response:', responseText.substring(0, 200) + (responseText.length > 200 ? '...' : ''));
      
      // Try to parse as JSON
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Failed to parse response as JSON:', parseError);
        throw new Error(`Server returned invalid JSON. Received HTML or text instead: ${responseText.substring(0, 100)}...`);
      }
    } catch (jsonError) {
      console.error('Failed to parse response as JSON:', jsonError);
      console.log('Response status:', response.status);
      throw new Error(`Invalid response from server (${response.status}). The server might be down or returning HTML instead of JSON.`);
    }

    if (!response.ok) {
      const errorMessage = data?.error || 'Failed to generate code';
      console.error('API Error Response:', errorMessage);
      throw new Error(errorMessage);
    }

    if (!data.code) {
      throw new Error('No code was generated. Try a different prompt.');
    }

    return data.code;
  } catch (error) {
    console.error('API Error:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to generate code. Please try again.');
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
