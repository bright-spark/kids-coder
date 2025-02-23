import OpenAI from 'openai';

const HTML_TEMPLATE = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Kids Coder Project</title>
    <style>
        /* CSS styles will go here */
    </style>
</head>
<body>
    <!-- HTML content will go here -->
    <script>
        // JavaScript code will go here
    </script>
</body>
</html>`;

const SYSTEM_PROMPT = `You are an expert AI coding tutor for kids. Generate entertaining and fully working one file single page web apps in HTML/CSS/JS code.
Rules:
- ALWAYS use this exact HTML template structure:
${HTML_TEMPLATE}
- ALWAYS Keep code simple yet interesting and educational
- ALWAYS Use Tailwind for CSS styling from a popular fast CDN
- ALWAYS use only vanilla JavaScript 
- ALWAYS Include helpful comments explaining key concepts
- ALWAYS focus on good visual and interactive elements
- ALWAYS ensure code is safe and appropriate for children
- ALWAYS use images from Unsplash for image sources in code
- ALWAYS return complete, runnable HTML files with embedded CSS/JS
- NEVER include external libraries besides for Tailwind
- NEVER include any explanatory text before or after the code
- NEVER include opening or closing backtick code / language delimeters at all 
- ONLY return the HTML code, nothing else
- REMEMBER when given existing code, maintain its core concepts and theme while making improvements`;

// Removed duplicate generateCode function

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