import { OpenAI } from 'openai';
import { NextResponse } from 'next/server';

// Load environment variables
const apiKey = process.env.AZURE_OPENAI_API_KEY || '';
const endpoint = process.env.AZURE_OPENAI_ENDPOINT || '';
const apiVersion = process.env.AZURE_OPENAI_VERSION || '2023-05-15';
const deploymentName = process.env.AZURE_OPENAI_DEPLOYMENT_NAME || 'gpt-4o-mini';

// System prompt for code generation
const SYSTEM_PROMPT = `You are an expert coding assistant for children learning to code.
Focus on generating clean, simple, and well-commented HTML, CSS, and JavaScript code that is interactive and educational.
Create code that is easy to understand for young learners, with fun and engaging elements when possible.
Explain concepts in the comments using simple language. Use emojis occasionally in comments for friendliness.
Prioritize safety and appropriate content for children at all times.`;

export async function POST(req: Request) {
  try {
    console.log('API route called: /api/generate');

    // Check if required environment variables are set
    if (!apiKey || !endpoint) {
      console.error('AZURE_OPENAI_API_KEY and AZURE_OPENAI_ENDPOINT need to be set for this app to work');
      return NextResponse.json(
        { error: 'API configuration is missing. Please set AZURE_OPENAI_API_KEY and AZURE_OPENAI_ENDPOINT environment variables.' },
        { status: 500 }
      );
    }

    // Parse request body with error handling
    let prompt, existingCode, preserveContext, codeLanguage;
    try {
      const body = await req.json();
      prompt = body.prompt;
      existingCode = body.existingCode; // Using the correct parameter name
      preserveContext = body.preserveContext;
      codeLanguage = body.codeLanguage || 'html';

      console.log('Request params:', {
        promptLength: prompt?.length,
        existingCodeLength: existingCode?.length,
        preserveContext,
        codeLanguage
      });
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

    // Create messages array for the API call
    let userContent = prompt;

    // Add existing code context if provided
    if (existingCode && preserveContext) {
      userContent += `\n\nHere is the existing code for context. Please maintain its style and structure while making improvements:\n\`\`\`${codeLanguage}\n${existingCode}\n\`\`\``;
      console.log('Added code context to prompt, total length:', userContent.length);
    }

    const messages: Array<OpenAI.Chat.ChatCompletionMessageParam> = [
      {
        role: 'system',
        content: SYSTEM_PROMPT
      },
      {
        role: 'user',
        content: userContent
      }
    ];


    console.log(`Using deployment: ${deploymentName}`);
    console.log('Number of messages:', messages.length);

    try {
      // Call Azure OpenAI API
      console.log('Calling Azure OpenAI API...');
      const completion = await client.chat.completions.create({
        model: deploymentName,
        messages: messages,
        temperature: 0.7,
        max_tokens: 2048,
        n: 1
      });

      if (!completion || !completion.choices || completion.choices.length === 0) {
        throw new Error('No completion generated from Azure OpenAI API');
      }

      const generatedCode = completion.choices[0].message?.content || '';

      if (!generatedCode) {
        throw new Error('Empty response from Azure OpenAI API');
      }

      // Extract code from markdown code blocks if present
      let cleanedCode = generatedCode;
      const codeBlockRegex = /```(?:\w+)?\s*([\s\S]*?)```/g;
      const matches = [...generatedCode.matchAll(codeBlockRegex)];

      if (matches.length > 0) {
        // Use the first code block if found
        cleanedCode = matches[0][1].trim();
        console.log('Extracted code from markdown code block');
      }

      console.log('Generated code length:', cleanedCode.length);
      return NextResponse.json({ code: cleanedCode });
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