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
    // If it's a complete HTML document, return as is
    if (cleanedContent.includes('<!DOCTYPE html') || cleanedContent.includes('<html')) {
      return {
        code: cleanedContent,
        explanation
      };
    }

    // If it's a standalone HTML element
    if (cleanedContent.trim().startsWith('<') && cleanedContent.trim().endsWith('>')) {
      return {
        code: cleanedContent,
        explanation
      };
    }

    // Return the cleaned content
    return {
      code: cleanedContent,
      explanation
    };
  }

  return { code: '', explanation: '' };
}