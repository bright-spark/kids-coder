interface FormattedMessage {
  code: string;
  explanation: string;
}

/**
 * Extracts code and explanation from a message string
 */
export function extractCodeAndExplanation(content: string): FormattedMessage {
  if (!content || typeof content !== 'string') {
    return { code: '', explanation: '' };
  }

  // Remove all code block markers and get clean code
  const cleanedContent = content
    .replace(/```(?:html|javascript|js|css)?\s*/g, '')
    .replace(/```/g, '')
    .trim();

  // Extract explanation (text before any code blocks if present)
  const explanation = content
    .split('```')[0]
    .trim();

  // Process the cleaned content
  if (cleanedContent) {
    let codeWithComments = cleanedContent;
    
    // Add explanation as HTML comment if present
    if (explanation) {
      const commentBlock = `<!--\nExplanation:\n${explanation}\n-->\n`;
      codeWithComments = commentBlock + codeWithComments;
    }

    // If it's a complete HTML document or standalone element, return with comments
    if (cleanedContent.includes('<!DOCTYPE html') || 
        cleanedContent.includes('<html') ||
        (cleanedContent.trim().startsWith('<') && cleanedContent.trim().endsWith('>'))) {
      return {
        code: codeWithComments,
        explanation
      };
    }

    // Return the cleaned content with comments
    return {
      code: codeWithComments,
      explanation
    };
  }

  return { code: '', explanation: '' };
}