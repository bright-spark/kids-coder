
import { OpenAIClient, AzureKeyCredential } from '@azure/openai';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Get Azure configuration
    const apiKey = process.env.AZURE_OPENAI_API_KEY || '';
    const endpoint = process.env.AZURE_OPENAI_ENDPOINT || '';
    const deploymentName = process.env.AZURE_OPENAI_DEPLOYMENT_NAME || 'gpt-4o-mini';
    
    if (!apiKey || !endpoint) {
      return NextResponse.json({
        status: 'error',
        message: 'Missing API configuration',
        details: {
          apiKeyPresent: !!apiKey,
          endpointPresent: !!endpoint
        }
      }, { status: 400 });
    }
    
    // Initialize Azure OpenAI client
    const client = new OpenAIClient(endpoint, new AzureKeyCredential(apiKey));
    
    // Test with a simple completion
    const testMessages = [
      { role: "system", content: "You are a helpful assistant." },
      { role: "user", content: "Say 'Hello from Azure OpenAI!'" }
    ];
    
    // Call Azure OpenAI API
    const completion = await client.getChatCompletions(
      deploymentName,
      testMessages,
      { maxTokens: 50 }
    );
    
    return NextResponse.json({
      status: 'success',
      message: 'Successfully connected to Azure OpenAI',
      response: completion.choices[0].message?.content || 'No response',
      deploymentName,
      apiEndpoint: endpoint.substring(0, 15) + '...'
    });
    
  } catch (error) {
    console.error('Connection test error:', error);
    return NextResponse.json({
      status: 'error',
      message: 'Failed to connect to Azure OpenAI',
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
