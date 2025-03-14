
'use client';

import { useState } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth-context';
import { useToast } from '@/components/ui/use-toast';
import { AuthDialog } from './auth-dialog';

export function AuthButtons() {
  const [isLoading, setIsLoading] = useState(false);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

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
