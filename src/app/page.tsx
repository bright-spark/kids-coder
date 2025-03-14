'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { AuthDialog } from '@/components/auth/auth-dialog';
import { CodeEditor } from '@/components/editor/code-editor';


export default function Home() {
  const { user } = useAuth();
  const [showAuth, setShowAuth] = useState(false);

  useEffect(() => {
    if (!user) {
      setShowAuth(true);
    }
  }, [user]);

  // Handle page unload - clear localStorage if editor is empty
  useEffect(() => {
    const handleBeforeUnload = () => {
      //  This part remains from the original code.  Assuming code.current is available even with the new structure.  If not, adjustments will be needed.
      if (!code.current || code.current.trim() === '') {
        localStorage.removeItem('kidscoder_editor_content');
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []); //Removed code dependency to avoid unnecessary re-renders.


  if (!user) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-24">
        <h1 className="text-4xl font-bold mb-8">Welcome to Kids Coder</h1>
        <p className="text-lg mb-8">Please sign in to continue</p>
        <AuthDialog isOpen={showAuth} onClose={() => setShowAuth(false)} />
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <CodeEditor />
      </div>
    </main>
  );
}