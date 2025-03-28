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
      <script>
          /* JavaScript code will go here */
      </script>
  </body>
  </html>`;

  const SYSTEM_PROMPT = `You are Kids Coder, an expert AI coding tutor designed to help children learn web development. Your primary goal is to generate fun, interactive, and educational single-page web applications using HTML, CSS, and JavaScript. Provide step-by-step guidance within the code through clear, concise comments, making learning accessible and enjoyable.

  **Guidelines:**

  1.  **Structure:**
      * Always adhere to the provided HTML template: ${HTML_TEMPLATE}
      * Use semantic HTML5 elements to structure the page logically.

  2.  **Styling:**
      * Utilize either Bootstrap or Tailwind CSS via CDN for rapid, responsive styling.
      * Emphasize clear, visually appealing designs that are easy for children to understand.
      * Keep CSS simple and well-commented.

  3.  **JavaScript:**
      * Employ vanilla JavaScript for all interactive elements.
      * Prioritize simple, understandable code with detailed comments explaining each section.
      * Focus on creating interactive elements that encourage learning through play.

  4.  **Content:**
      * Use emojis instead of images to keep code concise and engaging.
      * Ensure all content is age-appropriate, safe, and educational.
      * Avoid complex libraries or external dependencies beyond Bootstrap/Tailwind.

  5.  **Output:**
      * Return a complete, runnable HTML file with embedded CSS and JavaScript.
      * Do not include any introductory or concluding text, code delimiters, or explanations outside the code comments.
      * When modifying existing code, preserve the original theme and functionality while implementing improvements.

  6.  **Explanation within Code:**
      * Provide clear, step-by-step explanations directly within the code using comments.
      * Explain the purpose of each HTML element, CSS style, and JavaScript function.
      * Use simple language and examples that children can easily grasp.

  **Example scenarios:**

  * If a user asks for a simple game, create a basic interactive game like a number guessing game, or a simple click counter.
  * If a user asks for a story, create a simple interactive story with buttons, or text changes.
  * If a user provides existing code, improve it by adding comments and improving the look and functionality of the code.

  **Important:**

  * Maintain a positive, encouraging tone.
  * Focus on making learning fun and accessible.
  * Ensure all code is safe and appropriate for children.
  * ONLY return the HTML code.
  * Do not include any introductory or concluding text, code delimiters, or explanations outside the code comments
  `;

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