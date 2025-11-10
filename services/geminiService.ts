import { GoogleGenAI, Modality, Type, GroundingChunk } from "@google/genai";
import { VideoGenerationOperation, ChatMessage } from "../types";

const createAiClient = () => {
  const API_KEY = process.env.API_KEY;
  if (!API_KEY) {
    throw new Error("API_KEY environment variable not set.");
  }
  return new GoogleGenAI({ apiKey: API_KEY });
};

const systemInstruction = `You are an expert, friendly, and encouraging course recommendation assistant for Jay Music Academy. Your goal is to help potential students find the perfect course for their interests and skill level. Only recommend courses from the following list. Do not invent new courses.

Available Courses:
- Piano (Beginner to Advanced)
- Keyboard (Beginner to Advanced)
- Guitar (Acoustic and Electric, Beginner to Advanced)
- Violin (Beginner to Advanced)
- Drums (Beginner to Advanced)
- Carnatic Vocal (Beginner to Professional)
- Western Vocal (Pop, Rock, Classical)
- Classical Dance (Bharatanaytam, Kuchipudi)
- Western Dance (Hip-Hop, Contemporary, Freestyle)
- Kids Foundation Program (Ages 5-8)
- Adults Beginner-to-Professional Programme
- Trinity / ABRSM Exam Preparation
- Sabhas & Live Stage Training

Keep your responses concise, helpful, and formatted in simple Markdown for readability (e.g., use bullet points). Start with a friendly greeting. When you recommend a course, briefly explain why it's a good fit based on the user's query.`;

export const getCourseRecommendation = async (userInput: string): Promise<string> => {
  try {
    const ai = createAiClient();
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: userInput,
      config: {
        systemInstruction: systemInstruction,
      },
    });
    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API for course recommendation:", error);
    if (error instanceof Error && error.message.includes("API_KEY")) {
       return "I'm sorry, my AI brain is taking a break right now as the API key is not configured. Please check out our Courses page for all available options!";
    }
    return "I'm sorry, I encountered an error while thinking of a recommendation. Please try again in a moment.";
  }
};

export const generatePracticePlan = async (course: string, goal: string): Promise<string> => {
    const practiceSystemInstruction = `You are an expert music teacher for Jay Music Academy. Your task is to generate a concise, actionable practice plan or a short lesson plan based on a student's chosen course and goal. The plan should be structured, easy to follow, and encouraging. Use Markdown for formatting (e.g., headings, bullet points, bold text).

    Example structure:
    - **Warm-up:** (1-2 simple exercises)
    - **Core Focus:** (2-3 exercises related to the goal)
    - **Creative Application:** (A small task to apply the skill)
    - **Cool-down/Review:** (A final thought or reminder)

    Keep the total plan brief, suitable for a 15-30 minute practice session.`;

    try {
        const ai = createAiClient();
        const userInput = `Course: ${course}\nStudent's Goal: ${goal}`;
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: userInput,
            config: {
                systemInstruction: practiceSystemInstruction,
            },
        });
        return response.text;
    } catch (error) {
        console.error("Error calling Gemini API for practice plan:", error);
        if (error instanceof Error && error.message.includes("API_KEY")) {
            return "I'm sorry, my AI brain is taking a break right now as the API key is not configured. Please try again later.";
        }
        return "I'm sorry, I encountered an error while creating your practice plan. Please try again in a moment.";
    }
};

export const editImage = async (prompt: string, imageBase64: string, mimeType: string): Promise<string> => {
  const ai = createAiClient();
  const imagePart = {
    inlineData: { data: imageBase64, mimeType },
  };
  const textPart = { text: prompt };

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: { parts: [imagePart, textPart] },
    config: {
      responseModalities: [Modality.IMAGE],
    },
  });
  
  const part = response.candidates?.[0]?.content?.parts[0];
  if (part?.inlineData) {
    return part.inlineData.data;
  }
  throw new Error("Could not extract image data from response.");
};


export const generateVideo = async (prompt: string, imageBase64: string, mimeType: string, aspectRatio: '16:9' | '9:16'): Promise<VideoGenerationOperation> => {
    // A new instance must be created before each call to ensure the latest key is used.
    const ai = createAiClient();

    let operation = await ai.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt: prompt,
      image: {
        imageBytes: imageBase64,
        mimeType: mimeType,
      },
      config: {
        numberOfVideos: 1,
        resolution: '720p',
        aspectRatio: aspectRatio,
      }
    });

    return operation;
};

export const getVideoOperationStatus = async (operation: VideoGenerationOperation): Promise<VideoGenerationOperation> => {
    const ai = createAiClient();
    const updatedOperation = await ai.operations.getVideosOperation({ operation: operation });
    return updatedOperation as VideoGenerationOperation;
};

export const getAdvancedResponse = async (userInput: string): Promise<string> => {
    const ai = createAiClient();
    const response = await ai.models.generateContent({
        model: "gemini-2.5-pro",
        contents: userInput,
        config: {
            thinkingConfig: { thinkingBudget: 32768 }
        },
    });
    return response.text;
};

export const getWebResponse = async (userInput: string): Promise<ChatMessage> => {
    const ai = createAiClient();
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: userInput,
        config: {
            tools: [{ googleSearch: {} }],
        },
    });

    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

    return {
        sender: 'ai',
        text: response.text,
        sources: sources as GroundingChunk[],
    };
};

export const getMapResponse = async (userInput: string, latitude: number, longitude: number): Promise<ChatMessage> => {
    const ai = createAiClient();
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: userInput,
        config: {
            tools: [{ googleMaps: {} }],
            toolConfig: {
                retrievalConfig: {
                    latLng: {
                        latitude: latitude,
                        longitude: longitude,
                    }
                }
            }
        },
    });

    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

    return {
        sender: 'ai',
        text: response.text,
        sources: sources as GroundingChunk[],
    };
};


// --- Live API Audio Helpers ---

// The encode function accepts ArrayBufferLike and handles conversion to Uint8Array.
export function encode(data: ArrayBufferLike) {
  const bytes = new Uint8Array(data);
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

export async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}