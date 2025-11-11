import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { getCourseRecommendation } from '../services/geminiService';
import { ChatIcon, CloseIcon, SendIcon } from './Icons';

const examplePrompts = [
  "I want to learn piano",
  "What's good for a 7-year-old?",
  "Tell me about vocal classes",
];

export const CourseAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      sender: 'ai',
      text: "Welcome to Jay Music Academy! I'm your AI guide. How can I help you find the perfect course today? You can ask me anything, or try one of these prompts!",
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
  
  const sendMessageAndGetResponse = async (messageText: string) => {
    if (!messageText.trim() || isLoading) return;

    const userMessage: ChatMessage = { sender: 'user', text: messageText };
    setMessages((prev) => [...prev, userMessage]);
    setInput(''); // Clear input if it was used
    setIsLoading(true);

    try {
      const aiResponse = await getCourseRecommendation(messageText);
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

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    sendMessageAndGetResponse(input);
  };
  
  const handlePromptClick = (promptText: string) => {
    sendMessageAndGetResponse(promptText);
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
          
          {/* Example Prompts */}
          {messages.length === 1 && !isLoading && (
            <div className="flex flex-wrap gap-2 justify-start pt-2">
              {examplePrompts.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => handlePromptClick(prompt)}
                  disabled={isLoading}
                  className="px-3 py-1.5 bg-accent/80 backdrop-blur-sm border border-border text-accent-foreground rounded-full text-xs hover:bg-secondary hover:text-secondary-foreground transition-colors disabled:opacity-50"
                >
                  {prompt}
                </button>
              ))}
            </div>
           )}

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