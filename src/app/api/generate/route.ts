import { OpenAI } from 'openai';
import { NextResponse } from 'next/server';

// Azure OpenAI configuration
const apiKey = process.env.AZURE_OPENAI_API_KEY;
const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
const apiVersion = process.env.AZURE_OPENAI_VERSION || '2023-05-15';
const deploymentName = process.env.AZURE_OPENAI_DEPLOYMENT_NAME || 'gpt-4o-mini';

// Check if environment is properly configured
if (!apiKey || !endpoint) {
  console.error('AZURE_OPENAI_API_KEY needs to be set for this app to work');
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
    // Check if required environment variables are set
    if (!apiKey || !endpoint) {
      console.error('AZURE_OPENAI_API_KEY and AZURE_OPENAI_ENDPOINT need to be set for this app to work');
      return NextResponse.json(
        { error: 'API configuration is missing. Please set AZURE_OPENAI_API_KEY and AZURE_OPENAI_ENDPOINT environment variables.' },
        { status: 500 }
      );
    }

    // Parse request body with error handling
    let prompt, existingCode;
    try {
      const body = await req.json();
      prompt = body.prompt;
      existingCode = body.existingCode;
    } catch (parseError) {
      console.error('Error parsing request body:', parseError);
      return NextResponse.json(
        { error: 'Invalid request format' },
        { status: 400 }
      );
    }

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    console.log('Processing request with prompt:', prompt.substring(0, 50) + '...');
    console.log('Existing code provided:', existingCode ? 'Yes, length: ' + existingCode.length : 'No');
    
    // Initialize OpenAI client configured for Azure
    const client = new OpenAI({
      apiKey: apiKey,
      baseURL: `${endpoint}/openai/deployments/${deploymentName}`,
      defaultQuery: { 'api-version': apiVersion },
      defaultHeaders: { 'api-key': apiKey }
    });

    // Prepare messages for the chat completion
    type ChatMessage = 
      | { role: 'system' | 'user' | 'assistant', content: string }
      | { role: 'function', content: string, name: string };
      
    const messages: ChatMessage[] = [
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

    console.log(`Using deployment: ${deploymentName}`);

    try {
      // Call Azure OpenAI API
      const completion = await client.chat.completions.create({
        model: deploymentName,
        messages: messages,
        temperature: 0.7,
        max_tokens: 8192,
        n: 1
      });

      if (!completion || !completion.choices || completion.choices.length === 0) {
        throw new Error('No completion generated from Azure OpenAI API');
      }

      const generatedCode = completion.choices[0].message?.content || '';

      if (!generatedCode) {
        throw new Error('Empty response from Azure OpenAI API');
      }

      return NextResponse.json({ code: generatedCode });
    } catch (apiError) {
      console.error('Error calling Azure OpenAI API:', apiError);

      return NextResponse.json(
        { error: 'Failed to call Azure OpenAI API: ' + (apiError instanceof Error ? apiError.message : String(apiError)) },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate code: ' + (error instanceof Error ? error.message : String(error)) },
      { status: 500 }
    );
  }
}