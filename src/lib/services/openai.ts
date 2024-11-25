import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY || process.env.OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

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

const SYSTEM_PROMPT = `You are an AI coding tutor for kids. Generate simple, fun HTML/CSS/JS code examples.
Rules:
- ALWAYS use this exact HTML template structure:
${HTML_TEMPLATE}
- Keep code simple and educational
- Use only vanilla JavaScript (no external libraries)
- Include helpful comments explaining key concepts
- Focus on visual and interactive elements
- Ensure code is safe and appropriate for children
- ALWAYS return complete, runnable HTML files with embedded CSS/JS
- NEVER include any explanatory text before or after the code
- ONLY return the HTML code, nothing else
- When given existing code, maintain its core concepts and theme while making improvements`;

export async function generateCode(prompt: string, existingCode?: string): Promise<string> {
  try {
    const messages = [
      { role: "system" as const, content: SYSTEM_PROMPT },
    ];

    if (existingCode) {
      messages.push({
        role: "assistant" as const,
        content: "Here's the current code we're working with:\n\n" + existingCode
      });
      messages.push({
        role: "user" as const,
        content: `Based on this existing code, ${prompt}`
      });
    } else {
      messages.push({
        role: "user" as const,
        content: prompt
      });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
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
      model: "gpt-3.5-turbo",
      messages: [
        { 
          role: "system", 
          content: `${SYSTEM_PROMPT}\n\nImprove the following code while maintaining its core functionality, theme, and educational value. Return ONLY the improved code, no explanations.` 
        },
        { role: "user", content: code }
      ],
      temperature: 0.8,
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
      model: "gpt-3.5-turbo",
      messages: [
        { 
          role: "system", 
          content: `${SYSTEM_PROMPT}\n\nDebug and optimize the following code while maintaining its core functionality, theme, and educational value. Return ONLY the debugged code, no explanations.` 
        },
        { role: "user", content: code }
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    return completion.choices[0].message.content || '';
  } catch (error) {
    console.error('OpenAI API Error:', error);
    throw new Error('Failed to debug code. Please try again.');
  }
}
