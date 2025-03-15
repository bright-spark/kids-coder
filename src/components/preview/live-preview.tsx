
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useAppStore } from '@/lib/store';

interface PreviewError {
  message: string;
  type: string;
}

export function LivePreview() {
  const { code, isProcessing } = useAppStore();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [error, setError] = useState<PreviewError | null>(null);
  const updateTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (!code?.current) return;

    const updatePreview = () => {
      try {
        const iframe = iframeRef.current;
        if (!iframe) return;

        const doc = iframe.contentDocument || iframe.contentWindow?.document;
        if (!doc) return;

        doc.open();
        doc.write(code.current);
        doc.close();
        setError(null);
      } catch (err) {
        setError({
          message: 'Failed to update preview',
          type: 'error'
        });
      }
    };

    clearTimeout(updateTimeoutRef.current);
    updateTimeoutRef.current = setTimeout(updatePreview, 300);

    return () => {
      clearTimeout(updateTimeoutRef.current);
    };
  }, [code?.current]);

  return (
    <Card className="w-full space-y-4 neuro-card border-red-900/20 relative">
      {(isProcessing || !code?.current) && (
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
          onError={() => {
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
