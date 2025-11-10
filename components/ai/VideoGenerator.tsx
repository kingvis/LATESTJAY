import React, { useState, useRef, useEffect } from 'react';
import { generateVideo, getVideoOperationStatus } from '../../services/geminiService';
import { UploadIcon, SparklesIcon } from '../Icons';
import { VideoGenerationOperation } from '../../types';
import VoiceInput from './VoiceInput';

const VideoGenerator = () => {
    const [prompt, setPrompt] = useState('');
    const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('16:9');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const [operation, setOperation] = useState<VideoGenerationOperation | null>(null);
    const [apiKeySelected, setApiKeySelected] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const checkKey = async () => {
            if (window.aistudio && typeof window.aistudio.hasSelectedApiKey === 'function') {
                const hasKey = await window.aistudio.hasSelectedApiKey();
                setApiKeySelected(hasKey);
            }
        };
        checkKey();
    }, []);

    const handleSelectKey = async () => {
        await window.aistudio.openSelectKey();
        // Assume selection is successful to avoid race conditions
        setApiKeySelected(true);
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
            setError(null);
            setVideoUrl(null);
        }
    };

    const fileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve((reader.result as string).split(',')[1]);
            reader.onerror = error => reject(error);
        });
    };
    
    const pollOperation = async (op: VideoGenerationOperation) => {
      let currentOp = op;
      while (!currentOp.done) {
        await new Promise(resolve => setTimeout(resolve, 10000)); // Poll every 10 seconds
        try {
          currentOp = await getVideoOperationStatus(currentOp);
          if(currentOp.error) {
            throw new Error(currentOp.error.message || 'Polling failed');
          }
        } catch (e) {
          console.error("Polling error:", e);
          setError("An error occurred while checking video status. Please try again.");
          setIsLoading(false);
          return;
        }
      }
      setOperation(currentOp);
      
      const uri = currentOp.response?.generatedVideos?.[0]?.video?.uri;
      if (uri) {
        // Must append API key to fetch video
        const finalUrl = `${uri}&key=${process.env.API_KEY}`;
        setVideoUrl(finalUrl);
      } else {
        setError("Video generation complete, but no video URL was found.");
      }
      setIsLoading(false);
    };


    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!prompt || !imageFile || isLoading) return;

        setIsLoading(true);
        setError(null);
        setVideoUrl(null);
        setOperation(null);

        try {
            const imageBase64 = await fileToBase64(imageFile);
            const initialOp = await generateVideo(prompt, imageBase64, imageFile.type, aspectRatio);
            setOperation(initialOp);
            await pollOperation(initialOp);

        } catch (e: any) {
            console.error("Video generation error:", e);
            let errorMessage = "An error occurred during video generation. Please try again.";
            if (e.message?.includes("Requested entity was not found")) {
                errorMessage = "API Key not found or invalid. Please select a valid API key.";
                setApiKeySelected(false);
            }
            setError(errorMessage);
            setIsLoading(false);
        }
    };

    if (!apiKeySelected) {
        return (
            <div className="text-center">
                <h3 className="text-xl font-bold text-foreground mb-2">API Key Required</h3>
                <p className="text-muted-foreground mb-4">Video generation requires a Google AI API key. Please select one to proceed.</p>
                <p className="text-sm text-muted-foreground/80 mb-4">For more information, see the <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="text-secondary underline">billing documentation</a>.</p>
                <button
                    onClick={handleSelectKey}
                    className="bg-secondary-foreground text-secondary font-bold py-2 px-4 rounded-lg hover:bg-secondary-foreground/80 transition-colors"
                >
                    Select API Key
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-xl font-bold text-foreground">AI Music Video Creator</h3>
                <p className="text-muted-foreground">Turn your static album art into a captivating music video. Upload an image, describe a visual theme, and let Veo animate it.</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div 
                    className="relative border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-secondary transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                >
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/png, image/jpeg, image/webp"
                        className="hidden"
                        aria-label="Upload Image"
                    />
                    {imagePreview ? (
                        <img src={imagePreview} alt="Preview" className="mx-auto max-h-48 rounded-lg" />
                    ) : (
                        <div className="text-muted-foreground">
                            <UploadIcon className="h-12 w-12 mx-auto mb-2" />
                            <p>Click to upload album art</p>
                            <p className="text-sm">(PNG, JPG, WEBP)</p>
                        </div>
                    )}
                </div>

                <div>
                    <label htmlFor="prompt" className="block text-sm font-medium text-muted-foreground mb-1">Visual Prompt</label>
                    <div className="flex items-start space-x-2">
                        <textarea
                            id="prompt"
                            rows={3}
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="e.g., An animated, swirling galaxy for a synthwave track"
                            className="w-full bg-accent text-foreground placeholder-muted-foreground border border-border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-ring"
                            required
                        />
                        <VoiceInput onFinalTranscript={setPrompt} targetId="prompt" className="p-3 mt-1" />
                    </div>
                </div>
                
                 <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">Aspect Ratio</label>
                    <div className="flex gap-4 text-muted-foreground">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="radio" name="aspectRatio" value="16:9" checked={aspectRatio === '16:9'} onChange={() => setAspectRatio('16:9')} className="form-radio bg-accent border-border text-secondary focus:ring-secondary"/>
                            Landscape (16:9)
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="radio" name="aspectRatio" value="9:16" checked={aspectRatio === '9:16'} onChange={() => setAspectRatio('9:16')} className="form-radio bg-accent border-border text-secondary focus:ring-secondary"/>
                            Portrait (9:16)
                        </label>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={!prompt || !imageFile || isLoading}
                    className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-lg shadow-sm font-medium text-secondary bg-secondary-foreground hover:bg-secondary-foreground/80 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                    <SparklesIcon className="h-5 w-5" />
                    {isLoading ? 'Generating...' : 'Generate Video'}
                </button>
            </form>

            {isLoading && (
              <div className="text-center p-4 bg-accent rounded-lg">
                  <p className="text-secondary font-semibold animate-pulse">Video generation in progress...</p>
                  <p className="text-sm text-muted-foreground mt-2">This can take a few minutes. Please be patient and stay on this page.</p>
              </div>
            )}
            
            {error && <p className="text-center text-red-400 p-4 bg-red-900/20 rounded-lg">{error}</p>}
            
            {videoUrl && (
                <div className="mt-6">
                    <h4 className="text-lg font-bold text-center mb-4">Your Generated Video</h4>
                    <video controls autoPlay loop src={videoUrl} className="w-full rounded-lg shadow-lg" />
                </div>
            )}
        </div>
    );
};

export default VideoGenerator;
