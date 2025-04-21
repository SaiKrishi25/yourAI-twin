
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { UserProfile } from "@/types/ai";
import { useToast } from "@/components/ui/use-toast";

const ProfilePage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentTab, setCurrentTab] = useState("basic");
  const [profile, setProfile] = useState<UserProfile>({
    id: crypto.randomUUID(),
    name: "",
    bio: "",
    interests: "",
    personality: "",
    resume: null,
    questions: {
      favoriteThings: "",
      communicationStyle: "",
      humorStyle: "",
      values: "",
    },
    trollMode: false,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleQuestionChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      questions: {
        ...prev.questions,
        [name]: value,
      },
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfile((prev) => ({
        ...prev,
        resume: file,
      }));
    }
  };

  const handleTrollModeToggle = () => {
    setProfile((prev) => ({
      ...prev,
      trollMode: !prev.trollMode,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    try {
      // In a real app, we'd save this to a database
      localStorage.setItem(`profile-${profile.id}`, JSON.stringify({
        ...profile,
        resume: profile.resume ? (typeof profile.resume === 'string' ? profile.resume : profile.resume.name) : null, // Can't store File object in localStorage
      }));
      
      toast({
        title: "Profile Created",
        description: "Your AI persona is ready to chat!",
      });
      
      // Navigate to the chat with this profile
      navigate(`/chat/${profile.id}`);
    } catch (error) {
      console.error("Error saving profile:", error);
      toast({
        title: "Error",
        description: "Failed to save your profile",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-4xl font-bold text-center mb-8">Create Your AI Persona</h1>
      <p className="text-lg text-center text-muted-foreground mb-10">
        Let's build your AI personality! Fill in the details below to create an AI that talks just like you.
      </p>

      <form onSubmit={handleSubmit}>
        <div className="max-w-3xl mx-auto">
          <Tabs defaultValue="basic" value={currentTab} onValueChange={setCurrentTab}>
            <TabsList className="grid grid-cols-3 mb-8">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="personality">Personality</TabsTrigger>
              <TabsTrigger value="upload">Upload & Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="basic">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                  <CardDescription>
                    Start with your essential information to create your AI persona
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input 
                      id="name" 
                      name="name" 
                      placeholder="Your name"
                      value={profile.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea 
                      id="bio" 
                      name="bio" 
                      placeholder="Tell us about yourself in a few sentences"
                      value={profile.bio}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="interests">Interests</Label>
                    <Textarea 
                      id="interests" 
                      name="interests" 
                      placeholder="What are you passionate about? List your hobbies and interests"
                      value={profile.interests}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="button" onClick={() => setCurrentTab("personality")} className="w-full">
                    Next: Personality
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="personality">
              <Card>
                <CardHeader>
                  <CardTitle>Personality Questionnaire</CardTitle>
                  <CardDescription>
                    Help us understand how you communicate and express yourself
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="favoriteThings">What are your favorite things in life?</Label>
                    <Textarea 
                      id="favoriteThings" 
                      name="favoriteThings" 
                      placeholder="Describe things that make you happy"
                      value={profile.questions.favoriteThings}
                      onChange={handleQuestionChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="communicationStyle">How would you describe your communication style?</Label>
                    <Textarea 
                      id="communicationStyle" 
                      name="communicationStyle" 
                      placeholder="Are you direct? Verbose? Casual? Formal?"
                      value={profile.questions.communicationStyle}
                      onChange={handleQuestionChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="humorStyle">Describe your sense of humor</Label>
                    <Textarea 
                      id="humorStyle" 
                      name="humorStyle" 
                      placeholder="What makes you laugh? Are you sarcastic, witty, silly?"
                      value={profile.questions.humorStyle}
                      onChange={handleQuestionChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="values">What values are important to you?</Label>
                    <Textarea 
                      id="values" 
                      name="values" 
                      placeholder="What principles guide your life and decisions?"
                      value={profile.questions.values}
                      onChange={handleQuestionChange}
                      required
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button type="button" variant="outline" onClick={() => setCurrentTab("basic")}>
                    Back
                  </Button>
                  <Button type="button" onClick={() => setCurrentTab("upload")}>
                    Next: Upload & Settings
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="upload">
              <Card>
                <CardHeader>
                  <CardTitle>Upload Resume & Preferences</CardTitle>
                  <CardDescription>
                    Upload additional information and set your AI's behavior
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="resume">Upload Resume (Optional)</Label>
                    <Input 
                      id="resume" 
                      type="file" 
                      accept=".pdf,.doc,.docx" 
                      onChange={handleFileChange}
                    />
                    <p className="text-sm text-muted-foreground">
                      Your resume will help the AI understand your professional background better
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Switch 
                        id="trollMode" 
                        checked={profile.trollMode} 
                        onCheckedChange={handleTrollModeToggle}
                      />
                      <Label htmlFor="trollMode">Enable Trolling Mode</Label>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Toggle between "Serious" mode (default) or "Trolling" mode (more playful and sarcastic)
                    </p>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button type="button" variant="outline" onClick={() => setCurrentTab("personality")}>
                    Back
                  </Button>
                  <Button type="submit">Create My AI Persona</Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </form>
    </div>
  );
};

export default ProfilePage;
