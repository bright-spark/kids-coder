import { NextResponse } from 'next/server';

interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

// Create Azure OpenAI client
const endpoint = process.env.AZURE_OPENAI_ENDPOINT || '';
const apiKey = process.env.AZURE_OPENAI_API_KEY || '';
const deploymentName = process.env.AZURE_OPENAI_DEPLOYMENT_NAME || '';
const apiVersion = process.env.AZURE_OPENAI_VERSION || "2023-05-15";

// Ensure we're listening on all interfaces in production
export const config = {
  runtime: 'edge',
  regions: ['iad1']
};

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

    const messages: Message[] = [
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

    // Import the Azure OpenAI service
    const { AzureGPTService } = await import('@/lib/services/openai');
    
    // Create a new instance for this API route
    const azureService = new AzureGPTService();
    
    // Get the response from Azure OpenAI
    const content = await azureService.chat(messages, SYSTEM_PROMPT);
    
    // Mock data structure to match the expected format
    const data = { 
      choices: [{ 
        message: { 
          content 
        } 
      }] 
    };

    return NextResponse.json({ 
      code: data.choices[0].message?.content || ''
    });
  } catch (error) {
    console.error('Azure OpenAI API Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate code' },
      { status: 500 }
    );
  }
}