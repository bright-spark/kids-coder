export function extractCodeAndExplanation(content: string): {
  code: string;
  explanation: string;
} {
  // Check if content contains code block
  const hasCodeBlock = content.includes('```');
  
  if (!hasCodeBlock) {
    return {
      code: '',
      explanation: '',
    };
  }

  // Extract code and remove all delimiters and language tags
  const codeMatch = content.match(/```(?:html|javascript|css)?\n?([\s\S]*?)```/);
  let code = codeMatch ? codeMatch[1].trim() : '';
  
  // Remove any text before the first HTML tag and after the last HTML tag
  if (code) {
    const htmlStart = code.indexOf('<!DOCTYPE html');
    const htmlEnd = code.lastIndexOf('</html>') + 7;
    
    if (htmlStart !== -1 && htmlEnd !== -1) {
      code = code.slice(htmlStart, htmlEnd);
    }
  }

  return {
    code,
    explanation: '', // Always return empty explanation to hide assistant messages
  };
}