'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ChatInterface } from '@/components/chat/chat-interface'
import { CodeEditor } from '@/components/editor/code-editor'
import { LivePreview } from '@/components/preview/live-preview'
import { MessageCircle, Code2, Play } from 'lucide-react'
import { useAppStore } from '@/lib/store'
import { Toaster } from '@/components/ui/toaster'

export default function Home() {
  const { activeTab, setActiveTab, code } = useAppStore()

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#1a0000] to-[#2d0000]">
      <div className="container mx-auto px-4 py-4 sm:py-8 max-w-[1400px]">
        <header className="text-center mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-red-500 mb-2">Kids Coder</h1>
          <p className="text-red-300/80">AI-Powered Code Generator for Young Learners</p>
        </header>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-3 bg-black/40 backdrop-blur-lg neuro-shadow rounded-xl p-1">
            <TabsTrigger 
              value="chat" 
              className="data-[state=active]:bg-red-600 data-[state=active]:text-white rounded-lg"
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Chat</span>
            </TabsTrigger>
            <TabsTrigger 
              value="editor" 
              className="data-[state=active]:bg-red-600 data-[state=active]:text-white rounded-lg"
            >
              <Code2 className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Editor</span>
            </TabsTrigger>
            <TabsTrigger 
              value="preview" 
              className="data-[state=active]:bg-red-600 data-[state=active]:text-white rounded-lg"
            >
              <Play className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Preview</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="chat" className="mt-4">
            <ChatInterface />
          </TabsContent>

          <TabsContent value="editor" className="mt-4">
            <CodeEditor />
          </TabsContent>

          <TabsContent value="preview" className="mt-4">
            <LivePreview code={code.current} />
          </TabsContent>
        </Tabs>
      </div>
      <Toaster />
    </div>
  )
}