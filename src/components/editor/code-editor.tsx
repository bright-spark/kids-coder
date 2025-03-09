import Editor from '@monaco-editor/react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Wand2, Bug, Undo, Redo, Loader2 } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { useToast } from '@/components/ui/use-toast';
import { useState } from 'react';
import { improveCode, debugCode } from '@/lib/services/openai';
import { extractCodeAndExplanation } from '@/lib/utils/message-formatter';
import { Dialog, DialogFooter, DialogTitle, DialogContent, DialogDescription } from '@/components/ui/dialog';
import { Button as DialogButton } from '@/components/ui/button';


export function CodeEditor() {
  const { code, setCode, undo, redo, isProcessing, setProcessing } = useAppStore();
  const { toast } = useToast();
  const [isImproving, setIsImproving] = useState(false);
  const [isDebugging, setIsDebugging] = useState(false);
  const [isDownloadDialogOpen, setIsDownloadDialogOpen] = useState(false);
  const [fileName, setFileName] = useState('');

  const handleImprove = async () => {
    setIsImproving(true);
    setProcessing(true);
    try {
      const improvedCode = await improveCode(code.current);
      const { code: formattedCode } = extractCodeAndExplanation(improvedCode);
      setCode(formattedCode || improvedCode);
      toast({
        title: "Code Improved",
        description: "Your code has been enhanced with new features and optimizations",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to improve code",
        variant: "destructive",
      });
    } finally {
      setIsImproving(false);
      setProcessing(false);
    }
  };

  const handleDebug = async () => {
    setIsDebugging(true);
    setProcessing(true);
    try {
      const debuggedCode = await debugCode(code.current);
      const { code: formattedCode } = extractCodeAndExplanation(debuggedCode);
      setCode(formattedCode || debuggedCode);
      toast({
        title: "Code Debugged",
        description: "Your code has been optimized and issues have been fixed",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to debug code",
        variant: "destructive",
      });
    } finally {
      setIsDebugging(false);
      setProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!code.current) return;
    setIsDownloadDialogOpen(true);
  };

  const downloadCode = () => {
    if (!code.current) return;

    // Create a blob with the code content
    const blob = new Blob([code.current], { type: 'text/html' });
    const url = URL.createObjectURL(blob);

    // Create a temporary link and trigger the download
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName || 'code.html';
    document.body.appendChild(a);
    a.click();

    // Clean up
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setIsDownloadDialogOpen(false);

    toast({
      title: "Download Complete",
      description: `Your code has been downloaded as ${fileName || 'code.html'}`,
    });
  };

  return (
    <Card className="w-full neuro-card border-red-900/20 relative">
      {(isProcessing || !code.current) && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-10 flex items-center justify-center rounded-lg">
          {isProcessing ? (
            <div className="text-center space-y-2">
              <Loader2 className="h-8 w-8 animate-spin text-red-400 mx-auto" />
              <p className="text-red-300/90">Processing your code...</p>
            </div>
          ) : (
            <p className="text-red-300/90">Start by generating some code in the Chat tab!</p>
          )}
        </div>
      )}
      <div className="p-2 border-b border-red-900/20 w-full">
        <div className="flex flex-wrap gap-2 justify-between w-full">
          <Button
            variant="ghost"
            size="sm"
            onClick={undo}
            disabled={isProcessing || !code.current}
            className="text-red-400 hover:text-red-300"
          >
            <Undo className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">Undo</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={redo}
            disabled={isProcessing || !code.current}
            className="text-red-400 hover:text-red-300"
          >
            <Redo className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">Redo</span>
          </Button>
          <div className="flex-1" />
          <Button
            variant="ghost"
            size="sm"
            className="text-red-400 hover:text-red-300"
            onClick={handleImprove}
            disabled={isImproving || isProcessing || !code.current}
          >
            <Wand2 className={`h-4 w-4 mr-1 ${isImproving ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">{isImproving ? 'Improving...' : 'Improve'}</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-red-400 hover:text-red-300"
            onClick={handleDebug}
            disabled={isDebugging || isProcessing || !code.current}
          >
            <Bug className={`h-4 w-4 mr-1 ${isDebugging ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">{isDebugging ? 'Debugging...' : 'Debug'}</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-red-400 hover:text-red-300"
            onClick={handleDownload}
            disabled={isProcessing || !code.current}
          >
            Download
          </Button>
        </div>
      </div>
      <div className="h-[500px] sm:h-[600px]">
        <Editor
          height="100%"
          defaultLanguage="html"
          theme="vs-dark"
          value={code.current}
          onChange={(value) => setCode(value || '')}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            wordWrap: 'on',
            formatOnPaste: true,
            formatOnType: true,
            readOnly: isProcessing || !code.current,
          }}
        />
      </div>
      <Dialog open={isDownloadDialogOpen} onClose={() => setIsDownloadDialogOpen(false)}>
        <DialogContent>
          <DialogTitle>
            Download Code
          </DialogTitle>
          <DialogDescription>
            Enter a filename for your code (optional, defaults to 'code.html'):
          </DialogDescription>
          <input type="text" value={fileName} onChange={(e) => setFileName(e.target.value)} className="mt-4 border rounded p-2 w-full"/>
        </DialogContent>
        <DialogFooter>
          <DialogButton variant="destructive" onClick={() => setIsDownloadDialogOpen(false)}>
            Cancel
          </DialogButton>
          <DialogButton onClick={downloadCode}>
            Download
          </DialogButton>
        </DialogFooter>
      </Dialog>
    </Card>
  );
}