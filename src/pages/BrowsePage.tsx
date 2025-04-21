
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageSquare, ThumbsUp, ThumbsDown } from "lucide-react";

const BrowsePage = () => {
  const [profiles, setProfiles] = useState([]);

  // Load all profiles from localStorage
  useEffect(() => {
    const allProfiles = [];
    
    // Scan localStorage for profile items
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith("profile-")) {
        try {
          const profile = JSON.parse(localStorage.getItem(key));
          
          // Add ratings if they don't exist
          if (!profile.ratings) {
            profile.ratings = {
              upvotes: Math.floor(Math.random() * 10),
              downvotes: Math.floor(Math.random() * 3),
            };
          }
          
          allProfiles.push(profile);
        } catch (error) {
          console.error("Error parsing profile:", error);
        }
      }
    }
    
    setProfiles(allProfiles);
  }, []);

  // Handle upvote/downvote
  const handleVote = (profileId, voteType) => {
    setProfiles(prevProfiles => 
      prevProfiles.map(profile => {
        if (profile.id === profileId) {
          const updatedProfile = {
            ...profile,
            ratings: {
              ...profile.ratings,
              [voteType]: (profile.ratings[voteType] || 0) + 1
            }
          };
          
          // Update in localStorage
          localStorage.setItem(`profile-${profile.id}`, JSON.stringify(updatedProfile));
          
          return updatedProfile;
        }
        return profile;
      })
    );
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-4xl font-bold mb-2">Browse AI Personas</h1>
      <p className="text-lg text-muted-foreground mb-8">
        Chat with these AI personas to get to know the people behind them
      </p>

      {profiles.length === 0 ? (
        <div className="text-center py-20">
          <h2 className="text-2xl font-semibold mb-4">No AI personas yet</h2>
          <p className="text-muted-foreground mb-6">Create your own AI persona to get started!</p>
          <Link to="/profile">
            <Button size="lg">Create AI Persona</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {profiles.map(profile => (
            <Card key={profile.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Avatar>
                      <AvatarImage src={`https://avatar.vercel.sh/${profile.name}.png`} alt={profile.name} />
                      <AvatarFallback>{profile.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle>{profile.name}</CardTitle>
                    </div>
                  </div>
                  <Badge variant={profile.trollMode ? "destructive" : "default"}>
                    {profile.trollMode ? "Troll Mode" : "Serious Mode"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pb-2">
                <p className="line-clamp-3">{profile.bio}</p>
                <div className="mt-2">
                  <p className="text-sm text-muted-foreground">
                    Interests: {profile.interests.split(',').slice(0, 3).join(', ')}
                    {profile.interests.split(',').length > 3 ? '...' : ''}
                  </p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between pt-2">
                <div className="flex items-center space-x-4">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-green-600"
                    onClick={() => handleVote(profile.id, 'upvotes')}
                  >
                    <ThumbsUp className="h-5 w-5" />
                    <span className="ml-1">{profile.ratings?.upvotes || 0}</span>
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="text-red-600"
                    onClick={() => handleVote(profile.id, 'downvotes')}
                  >
                    <ThumbsDown className="h-5 w-5" />
                    <span className="ml-1">{profile.ratings?.downvotes || 0}</span>
                  </Button>
                </div>
                <Link to={`/chat/${profile.id}`}>
                  <Button variant="default">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Chat Now
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default BrowsePage;
