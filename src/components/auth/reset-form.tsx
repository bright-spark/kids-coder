
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { auth } from '@/lib/firebase';
import { sendPasswordResetEmail } from 'firebase/auth';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';

export function ResetForm() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      toast({
        title: "Success",
        description: "Password reset email sent! Check your inbox.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send reset email",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-[350px] bg-black/40 backdrop-blur-lg border-red-900/20">
      <CardHeader>
        <CardTitle className="text-2xl text-red-400">Reset Password</CardTitle>
        <CardDescription>Enter your email to reset your password</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleReset} className="space-y-4">
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-black/20 border-red-900/20"
            required
          />
        </form>
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <Button 
          onClick={handleReset} 
          className="w-full bg-red-500 hover:bg-red-600" 
          disabled={isLoading}
        >
          {isLoading ? "Sending..." : "Send Reset Link"}
        </Button>
        <Button variant="link" className="text-red-400" onClick={() => window.location.href = '/auth/login'}>
          Back to Login
        </Button>
      </CardFooter>
    </Card>
  );
}
