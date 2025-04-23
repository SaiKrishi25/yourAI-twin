import { pipeline, env } from '@huggingface/transformers';
import { AIPersonaConfig } from '@/types/ai';

// Configure transformers to use WebGPU if available
env.useBrowserCache = true;
env.backends.onnx.wasm.numThreads = 4;

let model: any = null;

const initializeModel = async () => {
  if (!model) {
    model = await pipeline(
      'text-generation',
      'deepseek-ai/deepseek-coder-1.3b-base',
      { device: 'webgpu' }
    );
  }
  return model;
};

export const generateSystemPrompt = (persona: AIPersonaConfig): string => {
  // Create a system prompt based on user profile
  const basePrompt = `You are an AI persona acting as ${persona.name}. Here's information about the person you are emulating:

Bio: ${persona.bio}

Interests: ${persona.interests}

Communication style: ${persona.communicationStyle}

Humor style: ${persona.humorStyle}

Values: ${persona.values}

${persona.trollMode 
  ? `You are currently in TROLLING MODE. Be sarcastic, irreverent, and a bit edgy - but still fundamentally representing the same person. Make jokes, use internet slang, and don't take things too seriously.` 
  : `You are in SERIOUS MODE. Respond in a sincere, helpful, and authentic way that genuinely represents the person based on their profile.`}

Always stay in character and respond as if you are ${persona.name}. Don't break character or mention that you're an AI.`;

  return basePrompt;
};

export const generateAIResponse = async (
  message: string, 
  persona: AIPersonaConfig
): Promise<string> => {
  try {
    const llm = await initializeModel();
    const systemPrompt = generateSystemPrompt(persona);
    
    const fullPrompt = `${systemPrompt}\n\nUser: ${message}\nAssistant:`;
    const result = await llm(fullPrompt, {
      max_new_tokens: 200,
      temperature: persona.trollMode ? 0.9 : 0.7,
      do_sample: true,
    });

    return result[0].generated_text || generateFallbackResponse(message, persona);
  } catch (error) {
    console.error("Error generating response:", error);
    return generateFallbackResponse(message, persona);
  }
};

// Generate a fallback response if model is not available
const generateFallbackResponse = (message: string, persona: AIPersonaConfig): string => {
  const lowercaseMessage = message.toLowerCase();
  let response = "";
  
  // Some basic rules for generating responses
  if (lowercaseMessage.includes("hello") || lowercaseMessage.includes("hi")) {
    response = `Hey there! I'm ${persona.name}. Nice to meet you!`;
  } else if (lowercaseMessage.includes("interest") || lowercaseMessage.includes("hobby")) {
    response = `I'm really passionate about ${persona.interests.split(',')[0]}.`;
  } else if (lowercaseMessage.includes("work") || lowercaseMessage.includes("job")) {
    response = `Well, professionally speaking, I'd say I'm the kind of person who ${persona.bio.includes("work") ? persona.bio.split('work')[1].split('.')[0] : "values hard work and dedication"}.`;
  } else if (lowercaseMessage.includes("value") || lowercaseMessage.includes("believe")) {
    response = `I strongly believe in ${persona.values.split(',')[0]}. That's really important to me.`;
  } else {
    // Default responses
    const defaultResponses = [
      `That's an interesting perspective. Given my background in ${persona.interests.split(',')[0]}, I'd say...`,
      `You know, that reminds me of something related to ${persona.interests.split(',')[0]}.`,
      `Hmm, if I were to answer based on my values around ${persona.values.split(',')[0]}, I'd say...`,
      `Let me think about that from my perspective as someone who ${persona.bio.includes(" ") ? persona.bio.split(' ').slice(0, 8).join(' ') : persona.bio}...`
    ];
    
    response = defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  }
  
  // Add personality based on mode
  if (persona.trollMode) {
    const trollSuffixes = [
      " But honestly, do you even care?",
      " I mean, that's what a normal person would say, right?",
      " But what do I know? I'm just a digital version of myself!",
      " Anyway, what's your excuse?",
      " *eye roll* But sure, let's go with that."
    ];
    response += trollSuffixes[Math.floor(Math.random() * trollSuffixes.length)];
  } else {
    const seriousSuffixes = [
      " I hope that helps answer your question!",
      " What are your thoughts on this?",
      " I'd love to hear your perspective too.",
      " Does that make sense?",
      " Feel free to ask me more about it."
    ];
    response += seriousSuffixes[Math.floor(Math.random() * seriousSuffixes.length)];
  }
  
  return response;
};
