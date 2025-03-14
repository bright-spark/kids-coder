
'use client';

import { useState, useEffect } from 'react';
import { signOut, FirebaseError } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth-context';
import { useToast } from '@/components/ui/use-toast';
import { AuthDialog } from './auth-dialog';
import { AlertCircle } from 'lucide-react';

export function AuthButtons() {
  const [isLoading, setIsLoading] = useState(false);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const { user, authError } = useAuth();
  const { toast } = useToast();

  // Show auth errors as toast notifications
  useEffect(() => {
    if (authError) {
      toast({
        title: "Authentication Error",
        description: authError,
        variant: "destructive",
      });
    }
  }, [authError, toast]);

  const handleSignOut = async () => {
    if (!auth) {
      toast({
        title: "Error",
        description: "Firebase is not properly initialized. Check your configuration.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      await signOut(auth);
      toast({
        title: "Successfully signed out",
        description: "See you next time!",
      });
    } catch (error) {
      const errorMessage = error instanceof FirebaseError 
        ? `Error: ${error.code} - ${error.message}` 
        : "Something went wrong. Please try again later.";
      
      toast({
        title: "Error signing out",
        description: errorMessage,
        variant: "destructive",
      });
      console.error('Sign out error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Firebase not initialized error
  if (!auth) {
    return (
      <div className="flex items-center gap-2 text-red-500">
        <AlertCircle className="h-4 w-4" />
        <span className="text-sm">Firebase not initialized</span>
      </div>
    );
  }

  return (
    <div>
      {user ? (
        <Button
          variant="outline"
          onClick={handleSignOut}
          disabled={isLoading}
        >
          Sign Out
        </Button>
      ) : (
        <>
          <Button
            variant="default"
            onClick={() => setShowAuthDialog(true)}
            disabled={isLoading}
          >
            Sign In
          </Button>
          <AuthDialog 
            isOpen={showAuthDialog} 
            onClose={() => setShowAuthDialog(false)} 
          />
        </>
      )}
    </div>
  );
}
