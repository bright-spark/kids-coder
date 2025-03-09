import React, { useRef } from 'react';
import { Send, Sparkles, Trash2, ChevronRight, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MessageList } from './message-list';
import { StarterPrompts } from './starter-prompts';
import { Message } from '@/lib/types';
import { CODE_CATEGORIES } from '@/lib/constants';
import { useAppStore } from '@/lib/store';
import { generateCode } from '@/lib/services/openai';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';

export function ChatInterface() {
  const { chat, setChatState, setCode, setActiveTab, clearChat, code } = useAppStore();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chat.currentMessage.trim() || chat.isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: chat.currentMessage,
      role: 'user',
      timestamp: Date.now(),
    };

    setChatState({
      messages: [userMessage, ...chat.messages],
      currentMessage: '',
      isLoading: true,
      processingMessageId: userMessage.id,
    });

    try {
      const generatedCode = await generateCode(chat.currentMessage, code.current);
      setCode(generatedCode);
      
      // Save to localStorage after generating new code
      if (generatedCode?.trim()) {
        localStorage.setItem('kidscoder_editor_content', generatedCode);
      }
      
      setActiveTab('editor');

      setChatState({
        messages: [userMessage, ...chat.messages],
        isLoading: false,
        processingMessageId: null,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate code",
        variant: "destructive",
      });
      setChatState({
        isLoading: false,
        processingMessageId: null,
      });
    }
  };

  const handlePromptSelect = (promptText: string) => {
    setChatState({ currentMessage: promptText });
  };

  const handleFileLoad = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCode(e.target?.result as string);
        setActiveTab('editor');
      };
      reader.readAsText(file);
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto neuro-card border-red-900/20">
      <div className="p-4 space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <ChevronRight className="h-5 w-5 text-red-400" />
            <Label className="text-lg font-semibold text-red-500">Instruction</Label>
          </div>
          {chat.messages.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearChat}
              className="text-red-400 hover:text-red-300"
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Clear
            </Button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            value={chat.currentMessage}
            onChange={(e) => setChatState({ currentMessage: e.target.value })}
            placeholder="Ask me to create something cool..."
            className="flex-1 bg-black/20 border-red-900/20 neuro-pressed"
            disabled={chat.isLoading}
          />
          <Button
            type="submit"
            disabled={chat.isLoading || !chat.currentMessage.trim()}
            className={cn(
              "bg-black hover:bg-black/90 text-red-500",
              "neuro-shadow transition-all duration-200",
              chat.isLoading && "neuro-pressed transform scale-95 opacity-50 bg-black/50"
            )}
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>

        <div className="flex space-x-2 mb-6">
          <Button
            variant="outline"
            className="flex-1 bg-red-950/20 text-red-400 border-red-900/40 hover:bg-red-950/40"
            onClick={clearChat}
            disabled={((!chat.messages.length && !code.current) || chat.isLoading)}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Clear Chat
          </Button>
          <Button
            variant="outline"
            className="flex-1 bg-red-950/20 text-red-400 border-red-900/40 hover:bg-red-950/40"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="h-4 w-4 mr-2" />
            Load HTML
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            accept=".html,.htm"
            style={{ display: 'none' }}
            onChange={handleFileLoad}
          />
        </div>

        {chat.messages.length === 0 ? (
          <div className="space-y-4">
            <div className="text-center">
              <Sparkles className="h-8 w-8 mx-auto mb-2 text-red-400" />
              <h3 className="text-lg font-semibold text-red-500 mb-1">
                Choose a Fun Category!
              </h3>
              <p className="text-sm text-red-300/70 mb-4">
                Pick a category to get a random coding project
              </p>
            </div>
            <StarterPrompts
              categories={chat.categories || CODE_CATEGORIES}
              onSelectPrompt={handlePromptSelect}
            />
          </div>
        ) : (
          <div className="min-h-[400px] space-y-4 overflow-y-auto">
            <MessageList
              messages={chat.messages.filter(m => m.role === 'user')}
              processingMessageId={chat.processingMessageId}
            />
          </div>
        )}
      </div>
    </Card>
  );
}