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
        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
          <SparklesIcon className="w-8 h-8 mr-3 text-purple-600" />
          AI Marketing Copilot
        </h1>
        <p className="text-gray-600 mt-1">Your intelligent assistant for all marketing needs</p>
      </div>

      <div className="flex-1 bg-white rounded-lg shadow-lg flex flex-col overflow-hidden">
        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-4 ${
                  message.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gradient-to-br from-purple-50 to-blue-50 text-gray-800 border border-purple-100'
                }`}
              >
                {message.role === 'assistant' && (
                  <div className="flex items-center space-x-2 mb-2">
                    <SparklesIcon className="w-4 h-4 text-purple-600" />
                    <span className="text-xs font-semibold text-purple-600">AI Copilot</span>
                  </div>
                )}
                <div className="whitespace-pre-wrap">{message.content}</div>
                <div
                  className={`text-xs mt-2 ${
                    message.role === 'user' ? 'text-blue-100' : 'text-gray-500'
                  }`}
                >
                  {message.timestamp.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="max-w-[80%] rounded-lg p-4 bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-100">
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
                  <span className="text-gray-600">AI is thinking...</span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Prompts */}
        {messages.length <= 1 && (
          <div className="border-t border-gray-200 p-4 bg-gray-50">
            <div className="flex items-center space-x-2 mb-3">
              <LightBulbIcon className="w-5 h-5 text-yellow-600" />
              <span className="text-sm font-semibold text-gray-700">Suggested Prompts</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {suggestedPrompts.map((prompt, index) => (
                <button
                  key={index}
                  onClick={() => handlePromptClick(prompt)}
                  className="text-left text-sm px-4 py-2 bg-white border border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="border-t border-gray-200 p-4 bg-white">
          <div className="flex space-x-4">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything about your marketing..."
              rows={2}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
            <button
              onClick={handleSend}
              disabled={loading || !input.trim()}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <PaperAirplaneIcon className="w-5 h-5" />
              <span>Send</span>
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            💡 Tip: Press Enter to send, Shift+Enter for new line
          </p>
        </div>
      </div>
    </div>
  );
}
