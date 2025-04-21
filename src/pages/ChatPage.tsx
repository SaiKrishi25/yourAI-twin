
import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Send, User, ArrowLeft, Settings } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { AISettingsDialog } from "@/components/AISettingsDialog";
import { generateAIResponse } from "@/services/aiService";
import { useToast } from "@/components/ui/use-toast";
import { UserProfile, ChatMessage, AIPersonaConfig } from "@/types/ai";

const ChatPage = () => {
  const { profileId } = useParams<{ profileId: string }>();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [trollMode, setTrollMode] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  // Load profile and API key from localStorage
  useEffect(() => {
    // Load API key if available
    const storedApiKey = localStorage.getItem('openai_api_key');
    if (storedApiKey) {
      setApiKey(storedApiKey);
    }
    
    // Load profile data
    const storedProfile = localStorage.getItem(`profile-${profileId}`);
    if (storedProfile) {
      const parsedProfile = JSON.parse(storedProfile);
      setProfile(parsedProfile);
      setTrollMode(parsedProfile.trollMode || false);
      
      // Add initial welcome message
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
  
  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  
  // Handle trollMode toggle
  const handleTrollModeToggle = () => {
    setTrollMode(prev => !prev);
    
    // Add a system message when mode changes
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
  
  // Handle send message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;
    
    // Add user message
    const userMessage = {
      id: crypto.randomUUID(),
      sender: "user" as const,
      text: inputValue,
      timestamp: new Date().toISOString(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);
    
    // Get AI response with small delay
    setTimeout(() => {
      getAIResponse(userMessage.text);
    }, 1000);
  };
  
  // Generate AI response
  const getAIResponse = async (userMessage: string) => {
    if (!profile) {
      setIsLoading(false);
      return;
    }
    
    try {
      // Prepare persona config for AI service
      const personaConfig: AIPersonaConfig = {
        name: profile.name,
        bio: profile.bio,
        interests: profile.interests,
        communicationStyle: profile.questions.communicationStyle,
        humorStyle: profile.questions.humorStyle,
        values: profile.questions.values,
        trollMode: trollMode
      };
      
      // Get response from AI service
      const aiResponse = await generateAIResponse(userMessage, personaConfig, apiKey);
      
      // Add AI response
      setMessages(prev => [...prev, {
        id: crypto.randomUUID(),
        sender: "ai" as const,
        text: aiResponse,
        timestamp: new Date().toISOString(),
      }]);
    } catch (error) {
      console.error("Error generating AI response:", error);
      
      // Add error message
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
  
  // Legacy generateAIResponse function - to be removed after migration
  const generateAIResponse = (userMessage: string) => {
    if (!profile) {
      setIsLoading(false);
      return;
    }
    
    // Generate response based on profile data and mode
    let aiResponse;
    
    if (trollMode) {
      // Generate a sarcastic/witty response
      const trollResponses = [
        `Oh sure, because "${userMessage}" is TOTALLY what I want to talk about right now. But whatever, I'll play along.`,
        `Wow, what a fascinating question... said no one ever. But I'll answer anyway.`,
        `*eye roll* Here we go again with the "${userMessage}" talk. Fine, let's do this.`,
        `That's what you're going with? "${userMessage}"? Interesting choice, but okay.`,
        `In my professional opinion as ${profile.name}'s AI, that question deserves a solid "meh". But I'll answer.`,
      ];
      
      aiResponse = trollResponses[Math.floor(Math.random() * trollResponses.length)];
      
      // Add some personalization based on profile
      aiResponse += ` Listen, as someone who's into ${profile.interests.split(',')[0]}, I'd rather talk about that.`;
      
    } else {
      // Generate a more serious, helpful response
      const interests = profile.interests.split(',')[0];
      const communicationStyle = profile.questions.communicationStyle;
      
      aiResponse = `Based on my background and interests in ${interests}, I'd say that's an interesting question. `;
      
      if (communicationStyle.toLowerCase().includes("direct")) {
        aiResponse += `To be direct with you, `;
      } else if (communicationStyle.toLowerCase().includes("detail")) {
        aiResponse += `Let me give you a detailed perspective on this. `;
      }
      
      aiResponse += `As ${profile.name}, I would approach "${userMessage}" with careful consideration. `;
      aiResponse += `My values around ${profile.questions.values.split('.')[0]} would guide my thinking here. `;
      aiResponse += `Does that help answer your question?`;
    }
    
    // Add AI response with typing effect
    setMessages(prev => [...prev, {
      id: crypto.randomUUID(),
      sender: "ai" as const,
      text: aiResponse,
      timestamp: new Date().toISOString(),
    }]);
    
    setIsLoading(false);
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
    <div className="container mx-auto py-4 h-screen flex flex-col">
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
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Label htmlFor="trolling-mode">Trolling Mode</Label>
            <Switch 
              id="trolling-mode" 
              checked={trollMode} 
              onCheckedChange={handleTrollModeToggle}
            />
          </div>
          <Button variant="outline" size="icon" onClick={() => setShowSettings(true)} title="AI Settings">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
        
        <AISettingsDialog 
          open={showSettings} 
          onOpenChange={setShowSettings} 
          apiKey={apiKey} 
          setApiKey={setApiKey} 
        />
      </div>
      
      <Card className="flex-1 overflow-hidden flex flex-col">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={`https://avatar.vercel.sh/${profile.name}.png`} alt={profile.name} />
              <AvatarFallback>{profile.name[0]}</AvatarFallback>
            </Avatar>
            Chat with {profile.name}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto pt-2">
          <div className="space-y-4">
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
                    <div className="w-8 h-8 flex-shrink-0">
                      <Avatar>
                        {message.sender === 'ai' ? (
                          <AvatarImage src={`https://avatar.vercel.sh/${profile.name}.png`} alt={profile.name} />
                        ) : (
                          <AvatarFallback>
                            <User className="h-5 w-5" />
                          </AvatarFallback>
                        )}
                      </Avatar>
                    </div>
                    <div 
                      className={`px-4 py-2 rounded-lg max-w-[80%] ${
                        message.sender === 'user' 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-muted'
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
                  <div className="w-8 h-8 flex-shrink-0">
                    <Avatar>
                      <AvatarImage src={`https://avatar.vercel.sh/${profile.name}.png`} alt={profile.name} />
                      <AvatarFallback>{profile.name[0]}</AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="px-4 py-2 rounded-lg bg-muted">
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
        </CardContent>
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
