import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../../types';
import { getWebResponse } from '../../services/geminiService';
import { SendIcon } from '../Icons';
import VoiceInput from './VoiceInput';

const WebExplorer = () => {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage: ChatMessage = { sender: 'user', text: input };
        setMessages((prev) => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const aiResponse = await getWebResponse(input);
            setMessages((prev) => [...prev, aiResponse]);
        } catch (error) {
            console.error(error);
            const errorMessage: ChatMessage = {
                sender: 'ai',
                text: "Sorry, I couldn't search the web right now. Please try again.",
            };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className="space-y-6 flex flex-col h-[65vh] max-h-[600px]">
            <div>
                <h3 className="text-xl font-bold text-foreground">Musicpedia</h3>
                <p className="text-muted-foreground">Your AI-powered music encyclopedia. Ask about music history, artists, or the latest industry news.</p>
            </div>
            
            <div className="flex-1 p-4 overflow-y-auto scrollbar-hide space-y-4 bg-accent/50 rounded-lg border border-border">
                {messages.length === 0 && (
                    <div className="text-center text-muted-foreground h-full flex items-center justify-center">
                        <p>Ask a question about music...</p>
                    </div>
                )}
                {messages.map((msg, index) => (
                    <div key={index}>
                        <div
                            className={`flex items-end gap-2 ${
                                msg.sender === 'user' ? 'justify-end' : 'justify-start'
                            }`}
                        >
                            <div
                                className={`max-w-xs md:max-w-md rounded-lg px-4 py-2 ${
                                    msg.sender === 'user'
                                    ? 'bg-primary text-primary-foreground rounded-br-none'
                                    : 'bg-accent text-accent-foreground rounded-bl-none'
                                }`}
                            >
                                <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                            </div>
                        </div>
                        {msg.sources && msg.sources.length > 0 && (
                            <div className="mt-2 text-xs text-muted-foreground">
                                <strong className="text-foreground">Sources:</strong>
                                <ul className="list-disc list-inside">
                                    {msg.sources.map((source, i) => source.web && (
                                        <li key={i}>
                                            <a href={source.web.uri} target="_blank" rel="noopener noreferrer" className="text-secondary hover:underline">
                                                {source.web.title}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                ))}
                 {isLoading && (
                     <div className="flex justify-start gap-2">
                        <div className="bg-accent text-accent-foreground rounded-lg px-4 py-2 rounded-bl-none">
                            <div className="flex items-center space-x-1">
                                <span className="w-2 h-2 bg-secondary rounded-full animate-pulse delay-0"></span>
                                <span className="w-2 h-2 bg-secondary rounded-full animate-pulse delay-150"></span>
                                <span className="w-2 h-2 bg-secondary rounded-full animate-pulse delay-300"></span>
                            </div>
                        </div>
                    </div>
                  )}
                <div ref={messagesEndRef} />
            </div>

            <div className="">
                <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
                    <input
                        id="web-explorer-input"
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="e.g., What are the origins of blues music?"
                        className="w-full bg-accent text-foreground placeholder-muted-foreground border border-border rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-ring"
                        disabled={isLoading}
                    />
                    <button
                        type="submit"
                        className="bg-secondary-foreground text-secondary rounded-full p-3 hover:bg-secondary-foreground/80 disabled:bg-muted disabled:cursor-not-allowed transition-colors"
                        disabled={isLoading || !input.trim()}
                        aria-label="Send message"
                    >
                        <SendIcon className="h-5 w-5" />
                    </button>
                    <VoiceInput onFinalTranscript={setInput} targetId="web-explorer-input" className="bg-secondary text-secondary-foreground" />
                </form>
            </div>
        </div>
    );
};

export default WebExplorer;
