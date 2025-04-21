
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-950">
      <div className="container mx-auto px-4 py-20">
        <div className="flex flex-col items-center text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500 mb-6">
            Personal AI
          </h1>
          <p className="text-xl md:text-2xl text-slate-700 dark:text-slate-300 max-w-2xl mb-8">
            Turn your profile into a living, AI-powered persona that talks just like you — built from your profile data and sample content.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/profile">
              <Button size="lg" className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600">
                Create Your AI Persona
              </Button>
            </Link>
            <Link to="/browse">
              <Button size="lg" variant="outline">
                Browse Personas
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="rounded-full bg-purple-100 dark:bg-purple-900 w-12 h-12 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600 dark:text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Create Your Profile</h3>
            <p className="text-muted-foreground">
              Fill out your information, upload your resume, or answer some questions about yourself to build your AI persona.
            </p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="rounded-full bg-blue-100 dark:bg-blue-900 w-12 h-12 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 dark:text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Chat Like You</h3>
            <p className="text-muted-foreground">
              Our AI generates responses that mimic your communication style, personality, and knowledge.
            </p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="rounded-full bg-green-100 dark:bg-green-900 w-12 h-12 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600 dark:text-green-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Dual Personality Modes</h3>
            <p className="text-muted-foreground">
              Switch between "Serious" and "Trolling" modes to see different sides of your AI personality.
            </p>
          </Card>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
          <h2 className="text-3xl font-bold mb-6 text-center">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="rounded-full bg-purple-100 dark:bg-purple-900 w-10 h-10 flex items-center justify-center flex-shrink-0">
                  <span className="font-bold text-purple-600 dark:text-purple-300">1</span>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Create Your Profile</h3>
                  <p className="text-muted-foreground">Fill out your information and personality details</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="rounded-full bg-purple-100 dark:bg-purple-900 w-10 h-10 flex items-center justify-center flex-shrink-0">
                  <span className="font-bold text-purple-600 dark:text-purple-300">2</span>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Train Your AI</h3>
                  <p className="text-muted-foreground">Our system analyzes your data to create your digital twin</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="rounded-full bg-purple-100 dark:bg-purple-900 w-10 h-10 flex items-center justify-center flex-shrink-0">
                  <span className="font-bold text-purple-600 dark:text-purple-300">3</span>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Chat and Share</h3>
                  <p className="text-muted-foreground">Let others interact with your AI persona</p>
                </div>
              </div>
            </div>
            <div className="rounded-lg bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950 dark:to-purple-950 p-8 border border-purple-100 dark:border-purple-900">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-purple-500"></div>
                <div>
                  <h4 className="font-medium">AI John</h4>
                  <p className="text-xs text-muted-foreground">Online</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="bg-white dark:bg-gray-700 rounded-lg p-3 max-w-[80%]">
                  <p className="text-sm">Hi there! How can I help you today?</p>
                </div>
                <div className="bg-purple-500 text-white rounded-lg p-3 max-w-[80%] ml-auto">
                  <p className="text-sm">Tell me about your interests</p>
                </div>
                <div className="bg-white dark:bg-gray-700 rounded-lg p-3 max-w-[80%]">
                  <p className="text-sm">I love hiking, photography, and developing AI systems that mimic human conversation!</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-16 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to create your AI twin?</h2>
          <Link to="/profile">
            <Button size="lg" className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600">
              Get Started Now
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Index;
