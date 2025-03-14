import Editor from '@monaco-editor/react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Wand2, Bug, Undo, Redo, Loader2, Upload } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { useToast } from '@/components/ui/use-toast';
import { useState, useEffect, useRef } from 'react';
import { improveCode, debugCode } from '@/lib/services/openai';
import { extractCodeAndExplanation } from '@/lib/utils/message-formatter';
import { Dialog, DialogFooter, DialogTitle, DialogContent, DialogDescription } from '@/components/ui/dialog';

const LOCAL_STORAGE_KEY = 'kidscoder_editor_content';

export function CodeEditor() {
  const { code, setCode, undo, redo, isProcessing, setProcessing } = useAppStore();
  const { toast } = useToast();
  const [isImproving, setIsImproving] = useState(false);
  const [isDebugging, setIsDebugging] = useState(false);
  const [isDownloadDialogOpen, setIsDownloadDialogOpen] = useState(false);
  const [fileName, setFileName] = useState('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Load from localStorage on component mount
  useEffect(() => {
    const savedCode = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedCode && !code.current) {
      setCode(savedCode);
    }
  }, []);

  // Save to localStorage whenever code changes
  useEffect(() => {
    if (code.current) {
      localStorage.setItem(LOCAL_STORAGE_KEY, code.current);
    } else {
      // Clear local storage if editor is empty
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    }
  }, [code.current]);

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

  const downloadCode = () => {
    if (!code.current) return;

    // Create a blob with the code content
    const blob = new Blob([code.current], { type: 'text/html' });
    const url = URL.createObjectURL(blob);

    // Create a temporary link and trigger the download
    const a = document.createElement('a');
    a.href = url;
    // Ensure filename has an extension if not provided
    let downloadName = fileName || 'code';
    if (!downloadName.toLowerCase().endsWith('.html') && !downloadName.toLowerCase().endsWith('.htm')) {
      downloadName += '.html';
    }
    a.download = downloadName;
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

  const handleFileLoad = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        if (e.target?.result) {
          setCode(e.target.result as string);
        }
      };
      reader.readAsText(file);
    }
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
            onClick={() => fileInputRef.current?.click()}
            disabled={isProcessing || !code.current}
            className="text-red-400 hover:text-red-300"
          >
            <Upload className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">Load HTML</span>
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            accept=".html,.htm"
            style={{ display: 'none' }}
            onChange={handleFileLoad}
          />

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsDownloadDialogOpen(true)}
            disabled={isProcessing || !code.current}
            className="text-red-400 hover:text-red-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-1"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
            <span className="hidden sm:inline">Download</span>
          </Button>
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
      <Dialog open={isDownloadDialogOpen} onOpenChange={(open) => setIsDownloadDialogOpen(open)}>
        <DialogContent>
          <DialogTitle>
            Download Code
          </DialogTitle>
          <DialogDescription className="text-gray-200">
            Enter a filename for your code (optional, defaults to 'code.html'):
          </DialogDescription>
          <input 
            type="text" 
            value={fileName} 
            onChange={(e) => setFileName(e.target.value)} 
            className="mt-4 border rounded p-2 w-full bg-gray-800 text-white"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                downloadCode();
              }
            }}
            placeholder="Enter filename or press Enter for default"
          />
        </DialogContent>
        <DialogFooter className="flex justify-between gap-2">

          </DialogFooter>
      </Dialog>
    </Card>
  );
}