
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/components/ui/use-toast';

interface AISettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  apiKey: string;
  setApiKey: (apiKey: string) => void;
}

export function AISettingsDialog({ open, onOpenChange, apiKey, setApiKey }: AISettingsDialogProps) {
  const [inputApiKey, setInputApiKey] = useState(apiKey || '');
  const { toast } = useToast();
  
  const handleSave = () => {
    setApiKey(inputApiKey);
    
    // Store API key in localStorage (note: in a production app, this should be handled more securely)
    if (inputApiKey) {
      localStorage.setItem('openai_api_key', inputApiKey);
      toast({
        title: "Settings Saved",
        description: "Your OpenAI API key has been saved"
      });
    } else {
      localStorage.removeItem('openai_api_key');
      toast({
        title: "API Key Removed",
        description: "The app will now use simple rule-based responses"
      });
    }
    
    onOpenChange(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>AI Settings</DialogTitle>
          <DialogDescription>
            Configure your AI persona settings. Add your OpenAI API key for enhanced responses.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <Alert className="bg-amber-50 text-amber-800 border-amber-200">
            <AlertCircle className="h-4 w-4 text-amber-800" />
            <AlertDescription>
              Your API key will be stored locally in your browser and is only used for generating responses.
            </AlertDescription>
          </Alert>
          
          <div className="space-y-2">
            <Label htmlFor="apiKey">OpenAI API Key</Label>
            <Input
              id="apiKey"
              placeholder="sk-..."
              value={inputApiKey}
              onChange={(e) => setInputApiKey(e.target.value)}
              type="password"
            />
            <p className="text-xs text-muted-foreground">
              Enter your OpenAI API key to enhance AI responses. Without an API key, the app will use simple rule-based responses.
            </p>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSave}>Save Settings</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
