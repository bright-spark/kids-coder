export async function generateCode(prompt: string, existingCode?: string): Promise<string> {
  try {
    if (!prompt || prompt.trim() === '') {
      throw new Error('Prompt cannot be empty');
    }

    console.log('Generating code with prompt:', prompt.substring(0, 50) + '...');

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt, existingCode }),
      });

      // Check if the response is OK before trying to parse it
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();

      if (!data.code) {
        throw new Error('No code was generated. Try a different prompt.');
      }

      return data.code;

    } catch (primaryError) {
      console.error('Primary API call failed, trying fallback:', primaryError);

      // Try fallback endpoint if primary fails
      const fallbackResponse = await fetch('/api/fallback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt, existingCode }),
      });

      if (!fallbackResponse.ok) {
        throw new Error('Both primary and fallback API calls failed');
      }

      const fallbackData = await fallbackResponse.json();
      return fallbackData.code;
    }
  } catch (error) {
    console.error('API Error:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to generate code. Please try again.');
  }
}

export async function improveCode(code: string): Promise<string> {
  try {
    console.log('Improving code with length:', code.length);

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

      // Check if the response is OK before trying to parse it
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.code) {
        throw new Error('No code was returned from the API');
      }
      
      return data.code;
    } catch (primaryError) {
      console.error('Primary API call failed for code improvement, trying fallback:', primaryError);

      // Try fallback endpoint if primary fails
      const fallbackResponse = await fetch('/api/fallback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: 'Improve this code while maintaining its core functionality',
          existingCode: code
        }),
      });

      if (!fallbackResponse.ok) {
        throw new Error(`Fallback API failed with status ${fallbackResponse.status}`);
      }

      const fallbackData = await fallbackResponse.json();
      return fallbackData.code;
    }
  } catch (error) {
    console.error('Code improvement error:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to improve code. Please try again.');
  }
}

export async function debugCode(code: string): Promise<string> {
  try {
    console.log('Debugging code with length:', code.length);

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

      // Check if the response is OK before trying to parse it
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.code) {
        throw new Error('No code was returned from the API');
      }
      
      return data.code;
    } catch (primaryError) {
      console.error('Primary API call failed for code debugging, trying fallback:', primaryError);

      // Try fallback endpoint if primary fails
      const fallbackResponse = await fetch('/api/fallback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: 'Debug and optimize this code while maintaining its core functionality',
          existingCode: code
        }),
      });

      if (!fallbackResponse.ok) {
        throw new Error(`Fallback API failed with status ${fallbackResponse.status}`);
      }

      const fallbackData = await fallbackResponse.json();
      return fallbackData.code;
    }
  } catch (error) {
    console.error('Code debugging error:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to debug code. Please try again.');
  }
}