import { ReactNode } from 'react';

export interface Course {
  title: string;
  category: string;
  description: string;
  icon: ReactNode;
  level?: string;
  imageUrl?: string;
  instructor: string;
  schedule: string;
  prerequisites: string[];
}

export interface Testimonial {
  name: string;
  course: string;
  quote: string;
  avatar: string;
}

export interface Faculty {
  name: string;
  role: string;
  experience: string;
  imageUrl: string;
}

export interface ChatMessage {
  sender: 'user' | 'ai';
  text: string;
  sources?: GroundingChunk[];
}

// Minimal type definition for Veo operation
export interface VideoGenerationOperation {
  done: boolean;
  name: string;
  response?: {
    generatedVideos?: {
      video?: {
        uri: string;
      };
    }[];
  };
  error?: any;
}

// Types for Grounding
export interface WebChunk {
  uri: string;
  title: string;
}

export interface MapsChunk {
    uri: string;
    title: string;
    placeAnswerSources?: {
        reviewSnippets?: {
            text: string;
            author: string;
        }[];
    }[];
}

export interface GroundingChunk {
  web?: WebChunk;
  maps?: MapsChunk;
}


// Types for Live API
export interface AudioTranscription {
  text: string;
  isFinal?: boolean;
}

export interface LiveServerMessage {
  serverContent?: {
    modelTurn?: {
      parts: {
        inlineData: {
          data: string; // base64 encoded audio
          mimeType: 'audio/pcm';
        };
      }[];
    };
    outputTranscription?: AudioTranscription;
    inputTranscription?: AudioTranscription;
    turnComplete?: boolean;
    interrupted?: boolean;
  };
  // other properties omitted for brevity
}