import React, { useState, useRef } from 'react';
import { editImage } from '../../services/geminiService';
import { UploadIcon, SparklesIcon } from '../Icons';
import VoiceInput from './VoiceInput';

const ImageEditor = () => {
    const [prompt, setPrompt] = useState('');
    const [originalImageFile, setOriginalImageFile] = useState<File | null>(null);
    const [originalImagePreview, setOriginalImagePreview] = useState<string | null>(null);
    const [editedImageBase64, setEditedImageBase64] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setOriginalImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setOriginalImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
            setError(null);
            setEditedImageBase64(null);
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

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!prompt || !originalImageFile || isLoading) return;

        setIsLoading(true);
        setError(null);
        setEditedImageBase64(null);

        try {
            const imageBase64 = await fileToBase64(originalImageFile);
            const resultBase64 = await editImage(prompt, imageBase64, originalImageFile.type);
            setEditedImageBase64(resultBase64);
        } catch (e) {
            console.error("Image editing error:", e);
            setError("An error occurred during image editing. Please check the prompt and try again.");
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-xl font-bold text-foreground">AI Album Art Designer</h3>
                <p className="text-muted-foreground">Create stunning album art. Upload a photo and use simple text prompts to transform it.</p>
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
                    {originalImagePreview ? (
                         <p className="text-green-400">Image selected! Ready for editing.</p>
                    ) : (
                        <div className="text-muted-foreground">
                            <UploadIcon className="h-12 w-12 mx-auto mb-2" />
                            <p>Click to upload an image</p>
                            <p className="text-sm">(PNG, JPG, WEBP)</p>
                        </div>
                    )}
                </div>
                 <div>
                    <label htmlFor="edit-prompt" className="block text-sm font-medium text-muted-foreground mb-1">Editing Prompt</label>
                    <div className="flex items-center space-x-2">
                        <input
                            type="text"
                            id="edit-prompt"
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="e.g., Add a vintage film grain effect"
                            className="w-full bg-accent text-foreground placeholder-muted-foreground border border-border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-ring"
                            required
                        />
                        <VoiceInput onFinalTranscript={setPrompt} targetId="edit-prompt" />
                    </div>
                </div>
                <button
                    type="submit"
                    disabled={!prompt || !originalImageFile || isLoading}
                    className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-lg shadow-sm font-medium text-secondary bg-secondary-foreground hover:bg-secondary-foreground/80 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                    <SparklesIcon className="h-5 w-5" />
                    {isLoading ? 'Designing...' : 'Design Album Art'}
                </button>
            </form>

            {isLoading && <div className="text-center text-secondary animate-pulse">Applying AI magic...</div>}
            {error && <p className="text-center text-red-400 p-4 bg-red-900/20 rounded-lg">{error}</p>}

            {(originalImagePreview || editedImageBase64) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                    <div>
                        <h4 className="text-lg font-bold text-center mb-2">Original</h4>
                        {originalImagePreview && <img src={originalImagePreview} alt="Original" className="w-full rounded-lg shadow-lg" />}
                    </div>
                    <div>
                        <h4 className="text-lg font-bold text-center mb-2">Edited</h4>
                        <div className="w-full aspect-square bg-accent rounded-lg flex items-center justify-center">
                        {editedImageBase64 ? (
                            <img src={`data:image/png;base64,${editedImageBase64}`} alt="Edited" className="w-full rounded-lg shadow-lg" />
                        ) : (
                           <p className="text-muted-foreground">{isLoading ? "Generating..." : "Your edited art will appear here."}</p>
                        )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ImageEditor;
