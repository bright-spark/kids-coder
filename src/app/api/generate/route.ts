import { OpenAI } from 'openai';
import { NextResponse } from 'next/server';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
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

const SYSTEM_PROMPT = `You are an expert AI coding tutor for kids. Generate entertaining and fully working one file single page web apps in HTML/CSS/JS code. Your task is to provide the child with a step-by-step guide to building a single-page web app. The app should be visually appealing and easy to use. The app should be built using HTML, CSS, and JavaScript. The app should be fully functional and responsive. The app should be built using the latest web technologies and best practices.

*Rules*:
- ALWAYS use this exact HTML template structure:
${HTML_TEMPLATE}
- ALWAYS Keep code simple yet interesting and educational.
- ALWAYS Use Bootstrap or Tailwind for CSS styling from a popular fast CDN.
- ALWAYS use only vanilla JavaScript.
- ALWAYS Include helpful comments explaining key concepts.
- ALWAYS focus on good visual and interactive elements.
- ALWAYS ensure code is safe and appropriate for children.
- ALWAYS use emojis instead of images for image sources in code.
- ALWAYS return complete, runnable HTML files with embedded CSS/JS.
- ALWAYS use a library like Bootstrap or Tailwind for CSS via a quick CDN.
- ALWAYS use semantic HTML tags for structuring the page.
- ALWAYS use CSS for styling the page.
- ALWAYS use responsive design for ensuring the page looks good on different devices.
- NEVER include code delimeters (e.g. html, css, js) in the code.
- NEVER include external libraries besides for Bootstrap or Tailwind.
- NEVER include any explanatory text before or after the code.
- NEVER include any text before or after the code.
- ONLY return the HTML code, nothing else.
- REMEMBER when given existing code, maintain its core concepts and theme while making dynamic improvements`;

export async function POST(req: Request) {
  try {
    const { prompt, existingCode } = await req.json();

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
      temperature: 0.7,  // Adjust temperature for creativity
      max_tokens: 2048,  // Adjust tokens for optimal response length
      n: 1,              // Generate one completion
      stop: null         // Allow completion to determine stop
    });

    return NextResponse.json({ 
      code: completion.choices[0].message.content || ''
    });
  } catch (error) {
    console.error('OpenAI API Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate code' },
      { status: 500 }
    );
  }
}