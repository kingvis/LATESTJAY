
import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { getCourseRecommendation } from '../services/geminiService';
import { ChatIcon, CloseIcon, SendIcon } from './Icons';

export const CourseAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      sender: 'ai',
      text: "Hi there! I'm your personal course assistant. Tell me about your interests, and I'll recommend the perfect music or dance course for you!",
    },
  ]);
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
      const aiResponse = await getCourseRecommendation(input);
      const aiMessage: ChatMessage = { sender: 'ai', text: aiResponse };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
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
    <>
      <div
        className={`fixed bottom-8 right-8 z-50 transition-transform duration-300 ease-in-out ${
          isOpen ? 'scale-0' : 'scale-100'
        }`}
      >
        <button
          onClick={() => setIsOpen(true)}
          className="bg-primary text-primary-foreground rounded-full p-4 shadow-lg hover:scale-110 transform transition-transform duration-200 hover:bg-primary/90"
          aria-label="Open Course Assistant"
        >
          <ChatIcon className="h-8 w-8" />
        </button>
      </div>

      <div
        className={`fixed bottom-8 right-8 z-50 w-full max-w-sm h-[70vh] max-h-[500px] bg-card/80 backdrop-blur-xl border border-border rounded-lg shadow-2xl flex flex-col transition-all duration-300 ease-in-out ${
          isOpen
            ? 'opacity-100 transform translate-y-0'
            : 'opacity-0 transform translate-y-10 pointer-events-none'
        }`}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-border">
          <h3 className="text-lg font-bold text-primary">Course Assistant</h3>
          <button onClick={() => setIsOpen(false)} className="text-muted-foreground hover:text-foreground">
            <CloseIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 p-4 overflow-y-auto scrollbar-hide space-y-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex items-end gap-2 ${
                msg.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-xs md:max-w-sm rounded-lg px-4 py-2 ${
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
                        <span className="w-2 h-2 bg-primary rounded-full animate-pulse delay-0"></span>
                        <span className="w-2 h-2 bg-primary rounded-full animate-pulse delay-150"></span>
                        <span className="w-2 h-2 bg-primary rounded-full animate-pulse delay-300"></span>
                    </div>
                </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-border">
          <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me about courses..."
              className="w-full bg-accent text-foreground placeholder-muted-foreground border border-border rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-ring"
              disabled={isLoading}
            />
            <button
              type="submit"
              className="bg-primary text-primary-foreground rounded-full p-3 hover:bg-primary/80 disabled:bg-muted disabled:cursor-not-allowed transition-colors"
              disabled={isLoading || !input.trim()}
              aria-label="Send message"
            >
              <SendIcon className="h-5 w-5" />
            </button>
          </form>
        </div>
      </div>
    </>
  );
};