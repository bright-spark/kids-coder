
'use client';

import { useState } from 'react';
import { signInWithPopup, signOut, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth-context';
import { useToast } from '@/components/ui/use-toast';

export function AuthButtons() {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleSignIn = async () => {
    try {
      setIsLoading(true);
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      toast({
        title: "Successfully signed in",
        description: "Welcome back!",
      });
    } catch (error) {
      toast({
        title: "Error signing in",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      setIsLoading(true);
      await signOut(auth);
      toast({
        title: "Successfully signed out",
        description: "See you next time!",
      });
    } catch (error) {
      toast({
        title: "Error signing out",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

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
        <Button
          variant="default"
          onClick={handleSignIn}
          disabled={isLoading}
        >
          Sign in with Google
        </Button>
      )}
    </div>
  );
}
