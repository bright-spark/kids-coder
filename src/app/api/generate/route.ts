import { NextResponse } from 'next/server';
import { OpenAIClient, AzureKeyCredential } from '@azure/openai';

const client = new OpenAIClient(
  process.env.AZURE_OPENAI_ENDPOINT!,
  new AzureKeyCredential(process.env.AZURE_OPENAI_KEY!),
  { apiVersion: '2024-08-01-preview' }
);

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

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    const messages = [
      { role: "system", content: SYSTEM_PROMPT },
    ];


    messages.push({
        role: "user",
        content: prompt,
      });
    

    if (!process.env.AZURE_OPENAI_DEPLOYMENT_NAME) {
      throw new Error('AZURE_OPENAI_DEPLOYMENT_NAME is not configured');
    }

    try {
      const stream = await client.streamChatCompletions(
        process.env.AZURE_OPENAI_DEPLOYMENT_NAME,
        messages,
        { maxTokens: 2048, temperature: 0.7 }
      );

      let content = '';
      for await (const chunk of stream) {
        const delta = chunk.choices[0]?.delta?.content;
        if (delta) content += delta;
      }

      if (!content) {
        throw new Error('No content received from Azure OpenAI');
      }

      return NextResponse.json({ code: content });
    } catch (error: any) {
      console.error('Azure OpenAI Error:', {
        name: error.name,
        message: error.message,
        status: error.status,
        code: error.code
      });
      
      return NextResponse.json(
        { 
          error: error.message || 'Failed to generate code',
          code: error.code
        },
        { status: error.status || 500 }
      );
    }
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}