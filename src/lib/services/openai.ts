import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

if (!process.env.OPENAI_API_KEY) {
  console.warn('Warning: OPENAI_API_KEY environment variable is not set');
}

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

export async function generateCode(prompt: string, existingCode?: string): Promise<string> {
  try {
    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      { role: "system", content: SYSTEM_PROMPT },
    ];

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

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
      temperature: 0.9,
      max_tokens: 2000,
    });

    return completion.choices[0].message.content || '';
  } catch (error) {
    console.error('OpenAI API Error:', error);
    throw new Error('Failed to generate code. Please try again.');
  }
}

export async function improveCode(code: string): Promise<string> {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { 
          role: "system", 
          content: `${SYSTEM_PROMPT}\n\nImprove the following code while maintaining its core functionality, theme, and educational value. Return ONLY the improved code, no explanations.` 
        },
        { role: "user", content: code }
      ],
      temperature: 1,
      max_tokens: 2000,
    });

    return completion.choices[0].message.content || '';
  } catch (error) {
    console.error('OpenAI API Error:', error);
    throw new Error('Failed to improve code. Please try again.');
  }
}

export async function debugCode(code: string): Promise<string> {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { 
          role: "system", 
          content: `${SYSTEM_PROMPT}\n\nDebug and optimize the following code while maintaining its core functionality, theme, and educational value. Return ONLY the debugged code, no explanations.` 
        },
        { role: "user", content: code }
      ],
      temperature: 0.7,
      max_tokens: 4096,
    });

    return completion.choices[0].message.content || '';
  } catch (error) {
    console.error('OpenAI API Error:', error);
    throw new Error('Failed to debug code. Please try again.');
  }
}
