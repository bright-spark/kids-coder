
import { NextResponse } from 'next/server';

// Simple test endpoint to verify API routing is working
export async function GET() {
  // Test basic API
  const basicStatus = {
    status: 'ok',
    message: 'API is working',
    timestamp: new Date().toISOString()
  };
  
  // Check Azure configuration
  const apiKey = process.env.AZURE_OPENAI_API_KEY;
  const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
  const deploymentName = process.env.AZURE_OPENAI_DEPLOYMENT_NAME || 'gpt-4o-mini';
  
  return NextResponse.json({
    ...basicStatus,
    azure: {
      configured: !!(apiKey && endpoint),
      endpoint: endpoint ? `${endpoint.substring(0, 10)}...` : 'Not configured',
      deploymentName,
      apiKeyPresent: !!apiKey
    }
  });
}
