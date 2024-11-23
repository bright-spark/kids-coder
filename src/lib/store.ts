import { create } from 'zustand';
import { CodeState, ChatState } from './types';
import { CODE_CATEGORIES } from './constants';

interface AppState {
  code: CodeState;
  chat: ChatState;
  activeTab: string;
  isProcessing: boolean;
  setCode: (code: string) => void;
  setActiveTab: (tab: string) => void;
  setProcessing: (state: boolean) => void;
  setChatState: (state: Partial<ChatState>) => void;
  clearChat: () => void;
  undo: () => void;
  redo: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  code: {
    current: '',
    history: [''],
    position: 0,
  },
  chat: {
    messages: [],
    currentMessage: '',
    isLoading: false,
    processingMessageId: null,
    categories: CODE_CATEGORIES,
  },
  activeTab: 'chat',
  isProcessing: false,
  setCode: (code: string) =>
    set((state) => {
      if (code === state.code.current) return state;
      return {
        code: {
          current: code,
          history: [...state.code.history.slice(0, state.code.position + 1), code],
          position: state.code.position + 1,
        },
      };
    }),
  setActiveTab: (tab: string) => set({ activeTab: tab }),
  setProcessing: (state: boolean) => set({ isProcessing: state }),
  setChatState: (chatState: Partial<ChatState>) =>
    set((state) => ({
      chat: { ...state.chat, ...chatState },
    })),
  clearChat: () =>
    set((state) => ({
      chat: {
        messages: [],
        currentMessage: '',
        isLoading: false,
        processingMessageId: null,
        categories: CODE_CATEGORIES,
      },
      code: {
        current: '',
        history: [''],
        position: 0,
      },
    })),
  undo: () =>
    set((state) => {
      const newPosition = Math.max(0, state.code.position - 1);
      return {
        code: {
          ...state.code,
          current: state.code.history[newPosition],
          position: newPosition,
        },
      };
    }),
  redo: () =>
    set((state) => {
      const newPosition = Math.min(
        state.code.history.length - 1,
        state.code.position + 1
      );
      return {
        code: {
          ...state.code,
          current: state.code.history[newPosition],
          position: newPosition,
        },
      };
    }),
}));