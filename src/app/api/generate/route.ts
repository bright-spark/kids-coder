import { NextResponse } from 'next/server';
import { OpenAIClient, AzureKeyCredential } from '@azure/openai';

const client = new OpenAIClient(
  process.env.AZURE_OPENAI_ENDPOINT!,
  new AzureKeyCredential(process.env.AZURE_OPENAI_KEY!)
);

const SYSTEM_PROMPT = `You are a helpful AI assistant that generates HTML code based on user instructions. 
Your code should be semantic, accessible, and follow best practices.`;

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
    

    const stream = await client.streamChatCompletions(
      process.env.AZURE_OPENAI_DEPLOYMENT_NAME!,
      messages,
      { maxTokens: 2048, temperature: 0.7 }
    );

    let content = '';
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