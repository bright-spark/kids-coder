
import { NextResponse } from 'next/server';

// Environment check endpoint to verify API configuration
export async function GET() {
  // Check Azure configuration
  const apiKey = process.env.AZURE_OPENAI_API_KEY;
  const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
  const apiVersion = process.env.AZURE_OPENAI_VERSION || '2023-05-15';
  const deploymentName = process.env.AZURE_OPENAI_DEPLOYMENT_NAME || 'gpt-4o-mini';
  
  return NextResponse.json({
    status: 'ok',
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
    config: {
      azure: {
        configured: !!(apiKey && endpoint),
        endpoint: endpoint ? `${endpoint.substring(0, 10)}...` : 'Not configured',
        apiVersion,
        deploymentName,
        apiKeyPresent: !!apiKey,
        apiKeyLength: apiKey ? apiKey.length : 0
      }
    }
  });
}
