import { NextResponse } from 'next/server';

// Simple HTML template for fallback
const FALLBACK_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Kids Coder Project</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <style>
        body {
            font-family: 'Comic Sans MS', cursive, sans-serif;
            background-color: #f5f5f5;
            padding: 20px;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            background-color: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }
        h1 {
            color: #0066cc;
            text-align: center;
        }
        .message {
            padding: 20px;
            background-color: #ffebcd;
            border-radius: 10px;
            margin: 20px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Hello, Coder! 👋</h1>
        <div class="message">
            <p>Our code wizard is taking a short break! 🧙‍♂️</p>
            <p>Here's a simple example page for you to start with. You can modify this code to create your own amazing project!</p>
        </div>
        <div class="row">
            <div class="col text-center">
                <button id="changeColorBtn" class="btn btn-primary">Change Color</button>
                <button id="addTextBtn" class="btn btn-success">Add Text</button>
            </div>
        </div>
        <div id="output" class="mt-4 p-3 border rounded">
            Your creations will appear here!
        </div>
    </div>

    <script>
        // Simple interactive buttons
        document.getElementById('changeColorBtn').addEventListener('click', function() {
            const colors = ['#ffcccc', '#ccffcc', '#ccccff', '#ffffcc', '#ffccff'];
            const randomColor = colors[Math.floor(Math.random() * colors.length)];
            document.getElementById('output').style.backgroundColor = randomColor;
        });

        document.getElementById('addTextBtn').addEventListener('click', function() {
            const messages = [
                '🚀 Coding is fun!',
                '🎮 Games are made with code!',
                '🤖 Robots use code too!',
                '💻 Keep learning to code!',
                '🎨 Code is creative!'
            ];
            const randomMessage = messages[Math.floor(Math.random() * messages.length)];
            document.getElementById('output').innerHTML += '<p>' + randomMessage + '</p>';
        });
    </script>
</body>
</html>`;

export async function POST(req: Request) {
  try {
    const { prompt, existingCode } = await req.json();

    console.log('Fallback API called with prompt:', prompt?.substring(0, 50));

    // Return the fallback HTML code
    return NextResponse.json({ 
      code: FALLBACK_HTML,
      message: 'Using fallback code generation' 
    });
  } catch (error) {
    console.error('Fallback API Error:', error);
    return NextResponse.json(
      { error: 'Fallback API failed: ' + (error instanceof Error ? error.message : String(error)) },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    code: FALLBACK_HTML
  });
}