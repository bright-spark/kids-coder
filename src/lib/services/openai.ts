export async function generateCode(prompt: string, _existingCode?: string): Promise<string> {
  try {
    if (!prompt || prompt.trim() === '') {
      throw new Error('Prompt cannot be empty');
    }

    console.log('Generating code with prompt:', prompt.substring(0, 50) + '...');

    try {
      console.log('Sending request to API with prompt:', prompt.substring(0, 50) + '...');

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt, _existingCode }),
      });

      // Check if the response is OK before trying to parse it
      if (!response.ok) {
        console.error('Response status:', response.status);
        let errorMessage = `Error status code: ${response.status}`;

        try {
          const errorText = await response.text();
          console.error('Error response:', errorText);

          // Try to parse as JSON for structured error
          try {
            const errorJson = JSON.parse(errorText);
            errorMessage = errorJson.error || `API request failed with status ${response.status}`;
          } catch (error) {
            // Not JSON, use text directly
            const _jsonError = error; // Fixed: Added underscore
            errorMessage = `API request failed: ${errorText.substring(0, 100)}`;
          }
        } catch (textError) {
          console.error('Failed to get error text:', textError);
        }

        throw new Error(errorMessage);
      }

      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        console.error('Failed to parse response as JSON:', parseError);
        throw new Error('Invalid JSON response from API');
      }

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
        body: JSON.stringify({ prompt, _existingCode }),
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

/**
 * Helper function to process code with OpenAI API
 * @param code The code to process
 * @param promptType The type of processing to perform
 * @param operationName Name of the operation for logging
 * @returns The processed code
 */
async function processCodeWithAI(
  code: string, 
  promptType: 'improve' | 'debug',
  operationName: string
): Promise<string> {
  if (!code || code.trim() === '') {
    throw new Error('No code provided to process');
  }

  const prompts = {
    improve: 'Improve this code while maintaining its core functionality',
    debug: 'Debug and optimize this code while maintaining its core functionality'
  };

  const prompt = prompts[promptType];
  console.log(`${operationName} code with length:`, code.length);

  try {
    // First attempt with primary API
    console.log(`Sending ${operationName.toLowerCase()} request to primary API`);
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        _existingCode: code
      }),
    });

    // Check if the response is OK before trying to parse it
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Primary API error response (${response.status}):`, errorText);
      throw new Error(`API request failed with status ${response.status}: ${errorText.substring(0, 100)}`);
    }

    const data = await response.json();

    if (!data.code) {
      throw new Error(`No code was returned from the API for ${operationName.toLowerCase()} operation`);
    }

    return data.code;
  } catch (primaryError) {
    console.error(`Primary API call failed for ${operationName.toLowerCase()}, trying fallback:`, primaryError);

    // Try fallback endpoint if primary fails
    try {
      console.log(`Sending ${operationName.toLowerCase()} request to fallback API`);
      const fallbackResponse = await fetch('/api/fallback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          _existingCode: code
        }),
      });

      if (!fallbackResponse.ok) {
        const errorText = await fallbackResponse.text();
        console.error(`Fallback API error response (${fallbackResponse.status}):`, errorText);
        throw new Error(`Fallback API failed with status ${fallbackResponse.status}: ${errorText.substring(0, 100)}`);
      }

      const fallbackData = await fallbackResponse.json();
      
      if (!fallbackData.code) {
        throw new Error(`No code was returned from the fallback API for ${operationName.toLowerCase()} operation`);
      }
      
      return fallbackData.code;
    } catch (fallbackError) {
      console.error(`Fallback API call failed for ${operationName.toLowerCase()}:`, fallbackError);
      throw new Error(
        `Both primary and fallback APIs failed. Primary error: ${primaryError instanceof Error ? primaryError.message : 'Unknown error'}. ` +
        `Fallback error: ${fallbackError instanceof Error ? fallbackError.message : 'Unknown error'}`
      );
    }
  }
}

export async function improveCode(code: string): Promise<string> {
  try {
    return await processCodeWithAI(code, 'improve', 'Improving');
  } catch (error) {
    console.error('Code improvement error:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to improve code. Please try again.');
  }
}

export async function debugCode(code: string): Promise<string> {
  try {
    return await processCodeWithAI(code, 'debug', 'Debugging');
  } catch (error) {
    console.error('Code debugging error:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to debug code. Please try again.');
  }
}