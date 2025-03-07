
'use client';

import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';

export function ToastTest() {
  const { toast } = useToast();
  
  const showToast = () => {
    toast({
      title: "Toast Test",
      description: "This is a test toast notification",
    });
  };
  
  return (
    <div className="p-4">
      <Button onClick={showToast}>Show Toast</Button>
    </div>
  );
}
