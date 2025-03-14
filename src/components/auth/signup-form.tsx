
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { auth } from '@/lib/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';

export function SignupForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }
    setIsLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      toast({
        title: "Success",
        description: "Account created successfully!",
      });
    } catch (error) {
      const firebaseError = error as FirebaseError;
      const errorMessages: Record<string, string> = {
        'auth/email-already-in-use': 'An account with this email already exists',
        'auth/invalid-email': 'Invalid email address',
        'auth/weak-password': 'Password is too weak - must be at least 6 characters',
        'auth/network-request-failed': 'Network error - please check your connection',
      };
      
      toast({
        title: "Error",
        description: errorMessages[firebaseError.code] || 'Failed to create account',
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-[350px] bg-black/40 backdrop-blur-lg border-red-900/20">
      <CardHeader>
        <CardTitle className="text-2xl text-red-400">Create Account</CardTitle>
        <CardDescription>Sign up to get started</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSignup} className="space-y-4">
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-black/20 border-red-900/20"
            required
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-black/20 border-red-900/20"
            required
          />
          <Input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="bg-black/20 border-red-900/20"
            required
          />
        </form>
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <Button 
          onClick={handleSignup} 
          className="w-full bg-red-500 hover:bg-red-600" 
          disabled={isLoading}
        >
          {isLoading ? "Creating Account..." : "Sign Up"}
        </Button>
        <Button variant="link" className="text-red-400" onClick={() => window.location.href = '/auth/login'}>
          Already have an account? Log in
        </Button>
      </CardFooter>
    </Card>
  );
}
