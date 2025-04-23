
import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Send, ArrowLeft } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { generateAIResponse } from "@/services/aiService";
import { UserProfile, ChatMessage } from "@/types/ai";

const ChatPage = () => {
  const { profileId } = useParams<{ profileId: string }>();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [trollMode, setTrollMode] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Load profile data
    const storedProfile = localStorage.getItem(`profile-${profileId}`);
    if (storedProfile) {
      const parsedProfile = JSON.parse(storedProfile);
      setProfile(parsedProfile);
      setTrollMode(parsedProfile.trollMode || false);
      
      setMessages([
        {
          id: crypto.randomUUID(),
          sender: "ai" as const,
          text: `Hi there! I'm ${parsedProfile.name}'s AI persona. How can I help you today?`,
          timestamp: new Date().toISOString(),
        },
      ]);
    }
  }, [profileId]);
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  
  const handleTrollModeToggle = () => {
    setTrollMode(prev => !prev);
    
    const modeMessage = !trollMode 
      ? "Switching to Trolling Mode. Prepare for some attitude!"
      : "Switching back to Serious Mode.";
      
    setMessages(prev => [...prev, {
      id: crypto.randomUUID(),
      sender: "system" as const,
      text: modeMessage,
      timestamp: new Date().toISOString(),
    }]);
  };
  
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading || !profile) return;
    
    const userMessage = {
      id: crypto.randomUUID(),
      sender: "user" as const,
      text: inputValue,
      timestamp: new Date().toISOString(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);
    
    try {
      const aiResponse = await generateAIResponse(userMessage.text, {
        name: profile.name,
        bio: profile.bio,
        interests: profile.interests,
        communicationStyle: profile.questions.communicationStyle,
        humorStyle: profile.questions.humorStyle,
        values: profile.questions.values,
        trollMode
      });
      
      setMessages(prev => [...prev, {
        id: crypto.randomUUID(),
        sender: "ai" as const,
        text: aiResponse,
        timestamp: new Date().toISOString(),
      }]);
    } catch (error) {
      console.error("Error getting AI response:", error);
      setMessages(prev => [...prev, {
        id: crypto.randomUUID(),
        sender: "system" as const,
        text: "Sorry, I had trouble responding. Please try again.",
        timestamp: new Date().toISOString(),
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!profile) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Profile not found</h2>
          <Link to="/">
            <Button>Return to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto py-4 h-screen flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Link to="/">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">{profile.name}'s AI Persona</h1>
          <Badge variant={trollMode ? "destructive" : "default"}>
            {trollMode ? "Trolling Mode" : "Serious Mode"}
          </Badge>
        </div>
        
        <div className="flex items-center space-x-2">
          <Label htmlFor="trolling-mode">Trolling Mode</Label>
          <Switch 
            id="trolling-mode" 
            checked={trollMode} 
            onCheckedChange={handleTrollModeToggle}
          />
        </div>
      </div>
      
      <Card className="flex-1 overflow-hidden flex flex-col p-4 bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
        <div className="flex-1 overflow-y-auto space-y-4">
          {messages.map(message => (
            <div 
              key={message.id} 
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} ${message.sender === 'system' ? 'justify-center' : ''}`}
            >
              {message.sender === 'system' ? (
                <div className="bg-muted px-3 py-2 rounded-md max-w-[80%] text-sm text-muted-foreground">
                  {message.text}
                </div>
              ) : (
                <div 
                  className={`flex gap-2 ${message.sender === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  <Avatar className={`w-8 h-8 ${message.sender === 'ai' ? 'bg-primary/10' : 'bg-secondary/10'}`}>
                    <div className="w-full h-full flex items-center justify-center text-xs font-medium">
                      {message.sender === 'ai' ? profile.name[0] : 'U'}
                    </div>
                  </Avatar>
                  <div 
                    className={`px-4 py-2 rounded-lg max-w-[80%] ${
                      message.sender === 'user' 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-secondary/50'
                    }`}
                  >
                    {message.text}
                  </div>
                </div>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex gap-2">
                <Avatar className="w-8 h-8 bg-primary/10">
                  <div className="w-full h-full flex items-center justify-center text-xs font-medium">
                    {profile.name[0]}
                  </div>
                </Avatar>
                <div className="px-4 py-2 rounded-lg bg-secondary/50">
                  <span className="flex gap-1">
                    <span className="animate-pulse">.</span>
                    <span className="animate-pulse delay-100">.</span>
                    <span className="animate-pulse delay-200">.</span>
                  </span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </Card>
      
      <form onSubmit={handleSendMessage} className="mt-4 flex gap-2">
        <Input 
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Type your message..."
          disabled={isLoading}
          className="flex-1"
        />
        <Button type="submit" disabled={isLoading} size="icon">
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
};

export default ChatPage;
