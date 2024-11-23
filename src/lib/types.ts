export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: number;
  code?: string;
}

export interface CodeCookbook {
  id: string;
  text: string;
}

export interface CodeCategory {
  id: 'game' | 'animation' | 'interactive' | 'art';
  title: string;
  description: string;
  icon: 'Gamepad2' | 'Sparkles' | 'MousePointer2' | 'Palette';
  recipes: CodeCookbook[];
  usedIndices: number[];
}

export interface CodeError {
  line?: number;
  message: string;
  type: 'error' | 'warning';
}

export interface CodeState {
  current: string;
  history: string[];
  position: number;
}

export interface ChatState {
  messages: Message[];
  currentMessage: string;
  isLoading: boolean;
  processingMessageId: string | null;
  categories: Record<string, CodeCategory>;
}