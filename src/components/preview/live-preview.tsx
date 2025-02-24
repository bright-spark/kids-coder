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
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(code, 'text/html');
      const errors = Array.from(doc.querySelectorAll('parsererror'));

      if (errors.length > 0) {
        setError({
          message: 'Invalid HTML structure',
          type: 'error'
        });
        return;
      }

      // Update iframe content for live reload
      if (iframeRef.current) {
        const iframe = iframeRef.current;
        const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;

        if (iframeDoc) {
          iframeDoc.open();
          iframeDoc.write(code);
          iframeDoc.close();
        }
      }

      setError(null);
    } catch (e) {
      setError({
        message: 'Failed to parse code',
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
          sandbox="allow-scripts allow-forms allow-same-origin allow-modals allow-popups allow-presentation"
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