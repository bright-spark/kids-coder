import { Card } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { CodeError } from '@/lib/types';
import { useAppStore } from '@/lib/store';

interface LivePreviewProps {
  code: string;
}

export function LivePreview({ code }: LivePreviewProps) {
  const [error, setError] = useState<CodeError | null>(null);
  const { isProcessing } = useAppStore();
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (!code?.trim()) return;

    try {
      if (iframeRef.current) {
        const iframe = iframeRef.current;
        const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;

        if (iframeDoc) {
          iframeDoc.open();
          
          // If code contains HTML structure, use it directly
          if (code.includes('<!DOCTYPE') || code.includes('<html') || code.includes('<body')) {
            iframeDoc.write(code);
          } else {
            // For JavaScript or HTML fragments, wrap in proper HTML structure
            const wrappedCode = `
              <!DOCTYPE html>
              <html>
                <head>
                  <meta charset="UTF-8">
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                </head>
                <body>
                  ${code.includes('<') ? code : ''}
                  ${!code.includes('<') ? `<script>${code}</script>` : ''}
                </body>
              </html>
            `;
            iframeDoc.write(wrappedCode);
          }
          
          iframeDoc.close();
        }
      }

      setError(null);
    } catch (err) {
      setError({
        message: err instanceof Error ? err.message : 'Failed to render preview',
        type: 'error'
      });
    }
  }, [code]);

  return (
    <Card className="w-full space-y-4 neuro-card border-red-900/20 relative">
      {(isProcessing || !code) && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-10 flex items-center justify-center rounded-lg">
          {isProcessing ? (
            <div className="text-center space-y-2">
              <Loader2 className="h-8 w-8 animate-spin text-red-400 mx-auto" />
              <p className="text-red-300/90">Processing your code...</p>
            </div>
          ) : (
            <p className="text-red-300/90">Generate some code to see the preview!</p>
          )}
        </div>
      )}
      {error && (
        <Alert variant="destructive" className="m-4 bg-red-950/20 border-red-900/20">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error.message}</AlertDescription>
        </Alert>
      )}
      <div className="h-[500px] sm:h-[600px]">
        <iframe
          ref={iframeRef}
          title="preview"
          className="w-full h-full rounded-lg bg-white"
          
          onError={(_e) => {
            setError({
              message: 'Failed to render preview',
              type: 'error'
            });
          }}
        />
      </div>
    </Card>
  );
}