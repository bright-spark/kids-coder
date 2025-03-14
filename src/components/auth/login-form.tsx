'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { auth } from '@/lib/firebase';
// import { signInWithEmailAndPassword } from 'firebase/auth'; // Removed as login function handles auth
import { useToast } from '@/components/ui/use-toast';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { useRouter } from 'next/navigation';

// Placeholder for the login function - needs to be implemented separately.
const login = async (email: string, password: string) => {
  try {
    // Your actual login logic here using Firebase or another auth provider.
    // Example using Firebase (replace with your actual implementation):
    const result = await signInWithEmailAndPassword(auth, email, password);
    if (result.user) {
      // Assuming login handles token generation and storage.  Adapt as needed for your actual implementation.
      return { success: true, error: null };
    } else {
      return { success: false, error: new Error("Login failed") };
    }
  } catch (error) {
    return { success: false, error: error };
  }
};



export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { success, error } = await login(email, password);
      if (success) {
        toast({
          title: "Success",
          description: "Successfully logged in!",
        });
        router.replace('/');
      } else {
        throw error;
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Login failed: " + (error.message || "An unknown error occurred."),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-[350px] bg-black/40 backdrop-blur-lg border-red-900/20">
      <CardHeader>
        <CardTitle className="text-2xl text-red-400">Welcome Back!</CardTitle>
        <CardDescription>Enter your credentials to continue</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleLogin} className="space-y-4">
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
        </form>
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <Button 
          onClick={handleLogin} 
          className="w-full bg-red-500 hover:bg-red-600" 
          disabled={isLoading}
        >
          {isLoading ? "Logging in..." : "Log In"}
        </Button>
        <div className="flex justify-between w-full text-sm">
          <Button variant="link" className="text-red-400 p-0" onClick={() => window.location.href = '/auth/signup'}>
            Create Account
          </Button>
          <Button variant="link" className="text-red-400 p-0" onClick={() => window.location.href = '/auth/reset'}>
            Forgot Password?
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}