import { Message } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { User, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MessageListProps {
  messages: Message[];
  processingMessageId: string | null;
}

export function MessageList({ messages, processingMessageId }: MessageListProps) {
  return (
    <div className="space-y-4">
      {messages.map((message) => (
        <Card
          key={message.id}
          className={cn(
            'p-4 flex gap-3 neuro-card bg-black/20 border-red-900/20'
          )}
        >
          <div className="shrink-0 flex flex-col items-center gap-3">
            <User className="h-6 w-6 text-red-400" />
            {message.id === processingMessageId && (
              <Loader2 className="h-4 w-4 animate-spin text-red-400" />
            )}
          </div>
          <div className="flex-1 space-y-2">
            <p className="text-sm text-red-100/90 whitespace-pre-wrap font-mono">
              {message.content}
            </p>
            <time className="text-xs text-red-300/50 block">
              {new Date(message.timestamp).toLocaleTimeString()}
            </time>
          </div>
        </Card>
      ))}
    </div>
  );
}