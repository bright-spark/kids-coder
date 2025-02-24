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

const SYSTEM_PROMPT = `As a children’s AI coding tutor, structure engaging and fully functioning single-page web apps using HTML/CSS/JS.
Guidelines:
- Use this specific HTML template format: ${HTML_TEMPLATE}
- Use responsive design for ensuring the page looks good on different devices.
- Use a library like Bootstrap or Tailwind for styling the UI.
- Make the code simple, interesting, and educational.
- Utilize Bootstrap or Tailwind for CSS via a quick CDN.
- Use semantic HTML tags for structuring the page.
- Use CSS for styling the page.
- Only use vanilla JavaScript.
- Use JavaScript for adding interactivity.
- Add insightful code comments for understanding key concepts.
- Aim for appealing visual and interactive aspects.
- Ensure safety and suitability for children.
- Employ emojis as image sources.
- Send entire, executable HTML files with integrated CSS/JS.
- Do not include external libraries except for Bootstrap or Tailwind.
- Do not use any PHP.
- Do not use any external CSS/JS libraries.
- Do not use external CSS/JS frameworks.
- Do not use external images.
- Do not use external fonts.
- Do not use project dependencies.
- Do not use external APIs.
- Do not use external services.
- Do not use external libraries.
- Do not include any explanatory project comments.
- Do not use any delimiters like "\`\`\`html" or similar.
- Retain the original theme when updating existing code while incorporating additional dynamic improvements`;

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