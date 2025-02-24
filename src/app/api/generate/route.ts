import { NextResponse } from 'next/server';
import Cerebras from '@cerebras/cerebras_cloud_sdk';

const cerebras = new Cerebras({
  apiKey: process.env.CEREBRAS_API_KEY
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

const SYSTEM_PROMPT = `You are an expert AI coding tutor for kids. Generate entertaining and fully working one file single page web apps in HTML/CSS/JS code.
Rules:
- ALWAYS use this exact HTML template structure:
${HTML_TEMPLATE}
- ALWAYS Keep code simple yet interesting and educational.
- ALWAYS Use Tailwind for CSS styling from a popular fast CDN.
- ALWAYS use only vanilla JavaScript.
- ALWAYS Include helpful comments explaining key concepts.
- ALWAYS focus on good visual and interactive elements.
- ALWAYS ensure code is safe and appropriate for children.
- ALWAYS use emojis instead of images for image sources in code.
- ALWAYS return complete, runnable HTML files with embedded CSS/JS.
- NEVER include external libraries besides for Tailwind.
- NEVER use any external CSS/JS libraries.
- NEVER use any external images.
- NEVER use any external fonts.
- NEVER add project dependencies.
- NEVER use any external APIs.
- NEVER use any external services.
- NEVER use any external libraries.
- NEVER include any explanatory text or project comments before or after the code.
- NEVER include opening or closing backtick code or any other language delimeters at all.
- NEVER include any text before or after the code.
- ONLY return the HTML code, nothing else.
- REMEMBER when given existing code, maintain its core concepts and theme while making dynamic improvements`;

export async function POST(req: Request) {
  try {
    const { prompt, existingCode } = await req.json();

    const messages = [
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

    let content = '';
    const stream = await cerebras.chat.completions.create({
      messages,
      model: 'llama3.1-8b',
      stream: true,
      max_completion_tokens: 2048,
      temperature: 0.7,
      top_p: 0.9
    });

    for await (const chunk of stream) {
      content += chunk.choices[0]?.delta?.content || '';
    }

    return NextResponse.json({ code: content });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate code' },
      { status: 500 }
    );
  }
}