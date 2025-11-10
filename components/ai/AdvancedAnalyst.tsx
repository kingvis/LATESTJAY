import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../../types';
import { getAdvancedResponse } from '../../services/geminiService';
import { SendIcon } from '../Icons';

const AdvancedAnalyst = () => {
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
            const aiResponse = await getAdvancedResponse(input);
            const aiMessage: ChatMessage = { sender: 'ai', text: aiResponse };
            setMessages((prev) => [...prev, aiMessage]);
        } catch (error) {
            console.error(error);
            const errorMessage: ChatMessage = {
                sender: 'ai',
                text: "Sorry, I'm having trouble connecting. Please try again later.",
            };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className="space-y-6 flex flex-col h-[65vh] max-h-[600px]">
            <div>
                <h3 className="text-xl font-bold text-foreground">AI Songwriting Partner</h3>
                <p className="text-muted-foreground">Your creative partner for composing and lyric writing. Brainstorm ideas, analyze chords, or break through writer's block.</p>
            </div>
            
            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto scrollbar-hide space-y-4 bg-accent/50 rounded-lg border border-border">
                {messages.length === 0 && (
                    <div className="text-center text-muted-foreground h-full flex items-center justify-center">
                        <p>Ask a music theory question or start writing a song...</p>
                    </div>
                )}
                {messages.map((msg, index) => (
                    <div
                        key={index}
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

            {/* Input */}
            <div className="">
                <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="e.g., Write lyrics for a chorus about summer nights"
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
                </form>
            </div>
        </div>
    );
};

export default AdvancedAnalyst;