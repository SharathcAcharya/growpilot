'use client';

import { useState, useEffect, useRef } from 'react';
import { api } from '@/lib/api';
import { PaperAirplaneIcon, SparklesIcon, LightBulbIcon } from '@heroicons/react/24/outline';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function CopilotPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "👋 Hi! I'm your AI Marketing Copilot. I can help you with campaign strategies, content ideas, SEO optimization, influencer recommendations, and data analysis. What would you like to work on today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestedPrompts = [
    "Help me create a campaign strategy for a summer sale",
    "What are the best practices for Instagram ads?",
    "Analyze my recent campaign performance",
    "Suggest influencers for my fashion brand",
    "Generate content ideas for my blog",
    "How can I improve my website's SEO?",
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await api.chatCopilot({
        message: input,
        conversationHistory: messages.map((m) => ({
          role: m.role,
          content: m.content,
        })),
      });

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.data.data?.response || 'Sorry, I could not process your request.',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Failed to send message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I'm having trouble connecting right now. Please try again in a moment.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handlePromptClick = (prompt: string) => {
    setInput(prompt);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      <div className="mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-xl bg-linear-to-r from-purple-500 to-blue-600">
            <SparklesIcon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-linear-to-r from-purple-400 via-blue-400 to-pink-400 bg-clip-text text-transparent">
              AI Marketing Copilot 🤖
            </h1>
            <p className="text-gray-200 text-sm sm:text-base mt-1">Your intelligent assistant for all marketing needs</p>
          </div>
        </div>
      </div>

      <div className="flex-1 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl shadow-2xl shadow-purple-500/20 flex flex-col overflow-hidden hover:border-purple-400/50 transition-all">
        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}
            >
              <div
                className={`max-w-[85%] sm:max-w-[80%] rounded-xl p-3 sm:p-4 ${
                  message.role === 'user'
                    ? 'bg-linear-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/30'
                    : 'bg-white/10 backdrop-blur-sm border border-white/20 text-white'
                }`}
              >
                {message.role === 'assistant' && (
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="p-1 rounded bg-purple-500/20">
                      <SparklesIcon className="w-3 h-3 sm:w-4 sm:h-4 text-purple-400" />
                    </div>
                    <span className="text-xs font-semibold text-purple-400">AI Copilot</span>
                  </div>
                )}
                <div className="whitespace-pre-wrap text-sm sm:text-base leading-relaxed">{message.content}</div>
                <div
                  className={`text-xs mt-2 ${
                    message.role === 'user' ? 'text-blue-100' : 'text-gray-200'
                  }`}
                >
                  🕒 {message.timestamp.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="max-w-[85%] sm:max-w-[80%] rounded-xl p-3 sm:p-4 bg-white/10 backdrop-blur-sm border border-white/20">
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-400"></div>
                  <span className="text-white text-sm">AI is thinking...</span>
                  <div className="flex space-x-1">
                    <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Prompts */}
        {messages.length <= 1 && (
          <div className="border-t border-white/10 p-4 bg-white/5">
            <div className="flex items-center space-x-2 mb-3">
              <div className="p-1 rounded bg-yellow-500/20">
                <LightBulbIcon className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" />
              </div>
              <span className="text-sm font-semibold text-white">💡 Suggested Prompts</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {suggestedPrompts.map((prompt, index) => (
                <button
                  key={index}
                  onClick={() => handlePromptClick(prompt)}
                  className="text-left text-xs sm:text-sm px-3 sm:px-4 py-2 bg-white/10 border border-white/20 rounded-lg hover:border-purple-400/50 hover:bg-white/20 transition-all text-white hover:text-purple-300 group"
                >
                  <span className="group-hover:translate-x-1 inline-block transition-transform">
                    {prompt}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="border-t border-white/10 p-4 bg-white/5">
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="💬 Ask me anything about your marketing..."
              rows={2}
              className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none transition-all hover:bg-white/15"
            />
            <button
              onClick={handleSend}
              disabled={loading || !input.trim()}
              className="px-6 py-3 bg-linear-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 font-semibold shadow-lg hover:shadow-purple-500/50 hover:scale-105 group self-end sm:self-auto"
            >
              <PaperAirplaneIcon className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
              <span>Send</span>
            </button>
          </div>
          <p className="text-xs text-gray-200 mt-2 flex items-center">
            <span className="mr-1">💡</span>
            Tip: Press Enter to send, Shift+Enter for new line
          </p>
        </div>
      </div>
    </div>
  );
}

