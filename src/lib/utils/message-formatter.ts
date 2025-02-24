
export function extractCodeAndExplanation(content: string): {
  code: string;
  explanation: string;
} {
  // Handle empty content
  if (!content?.trim()) {
    return { code: '', explanation: '' };
  }

  // Extract code block if present
  const codeBlockMatch = content.match(/```(?:html|javascript|js|css)?\n?([\s\S]*?)```/);
  
  if (codeBlockMatch) {
    // Use code block content
    let code = codeBlockMatch[1].trim();
    
    // If it's a complete HTML document, return as is
    if (code.includes('<!DOCTYPE html') || code.includes('<html')) {
      return { code, explanation: '' };
    }
    
    // If it's just HTML fragment, wrap it in proper HTML structure
    if (code.match(/<[^>]*>/)) {
      code = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Preview</title>
</head>
<body>
    ${code}
</body>
</html>`;
    }
    
    // If it's JavaScript code, wrap it in HTML with script tag
    if (!code.includes('<')) {
      code = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Preview</title>
</head>
<body>
    <script>
    ${code}
    </script>
</body>
</html>`;
    }
    
    return { code, explanation: '' };
  }

  // No code block found, check for direct HTML content
  if (content.includes('<!DOCTYPE html') || content.includes('<html')) {
    return { code: content.trim(), explanation: '' };
  }

  return { code: '', explanation: '' };
}
