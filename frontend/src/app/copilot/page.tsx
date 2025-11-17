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
      content:
        "👋 Hi! I'm your AI Marketing Copilot. I can help you with campaign strategies, content ideas, SEO optimization, influencer recommendations, and data analysis. What would you like to work on today?",
      timestamp: new Date(),
    },
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestedPrompts = [
    'Help me create a campaign strategy for a summer sale',
    'What are the best practices for Instagram ads?',
    'Analyze my recent campaign performance',
    'Suggest influencers for my fashion brand',
    'Generate content ideas for my blog',
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
        content:
          response.data.data?.response ||
          'Sorry, I could not process your request.',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Failed to send message:', error);

      const fallbackMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content:
          "I'm having trouble connecting right now. Please try again in a moment.",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, fallbackMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col copilot-bg text-white">

      {/* Top header */}
      <div className="px-6 pt-6 pb-2">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-xl bg-gradient-to-r from-purple-500 to-blue-600 shadow-lg shadow-blue-500/40">
            <SparklesIcon className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-purple-300 via-blue-300 to-pink-300 bg-clip-text text-transparent drop-shadow-lg">
              AI Marketing Copilot 🤖
            </h1>
            <p className="text-blue-100 text-sm sm:text-base mt-1">
              Your intelligent assistant for all marketing needs
            </p>
          </div>
        </div>
      </div>

      {/* Main container - occupies remaining space */}
      <div className="flex-1 px-6 pb-6">
        <div className="h-full flex flex-col bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl shadow-2xl shadow-purple-500/20 overflow-hidden">

          {/* Messages area (scrolling) */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/30'
                      : 'bg-white/10 backdrop-blur-md border border-white/20 text-white'
                  }`}
                >
                  {msg.role === 'assistant' && (
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="p-1 rounded bg-purple-500/30">
                        <SparklesIcon className="w-4 h-4 text-purple-300" />
                      </div>
                      <span className="text-xs font-semibold text-purple-200">
                        AI Copilot
                      </span>
                    </div>
                  )}

                  <div className="whitespace-pre-wrap text-sm sm:text-base leading-relaxed">
                    {msg.content}
                  </div>

                  <div className="text-xs mt-2 text-blue-100">
                    {msg.timestamp.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="max-w-[85%] rounded-xl p-4 bg-white/10 backdrop-blur-md border border-white/20">
                  <div className="flex items-center space-x-3">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-400"></div>
                    <span className="text-sm text-white">AI is thinking…</span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Suggested prompts (visible when only initial assistant message exists) */}
          {messages.length <= 1 && (
            <div className="border-t border-white/10 p-4 bg-white/5">
              <div className="flex items-center space-x-2 mb-3">
                <LightBulbIcon className="w-5 h-5 text-yellow-300" />
                <span className="text-sm font-semibold text-yellow-200">Suggested Prompts</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {suggestedPrompts.map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => setInput(prompt)}
                    className="text-left text-sm px-4 py-3 bg-white/10 border border-white/20 rounded-lg hover:bg-white/20 hover:border-purple-400/50 transition-all"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input area - pinned at bottom of the chat container */}
          <div className="border-t border-white/10 p-4 bg-white/5">
            <div className="flex gap-4">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="💬 Ask me anything about your marketing…"
                rows={2}
                className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/70 focus:ring-2 focus:ring-purple-500 resize-none"
              />

              <button
                onClick={handleSend}
                disabled={loading || !input.trim()}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl text-white shadow-lg hover:shadow-purple-500/50 hover:scale-105 transition-all disabled:opacity-50"
              >
                <PaperAirplaneIcon className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-blue-200 mt-2">
              💡 Tip: Press Enter to send, Shift+Enter for new line
            </p>
          </div>
        </div>
      </div>

      {/* Global / page background CSS - ensures entire viewport behind content is themed (no white strip) */}
      <style jsx global>{`
        html, body, #__next {
          height: 100%;
          background: linear-gradient(135deg, #07081a 0%, #2c0f3b 40%, #4f0f6a 70%, #7b1f9a 100%);
          margin: 0;
          padding: 0;
        }

        /* slightly richer layered radial glows to match reference */
        .copilot-bg {
          background:
            radial-gradient(400px 280px at 15% 12%, rgba(47, 84, 255, 0.12), transparent 30%),
            radial-gradient(420px 300px at 85% 15%, rgba(255, 70, 160, 0.10), transparent 30%),
            linear-gradient(135deg, #07081a 0%, #2c0f3b 40%, #4f0f6a 70%, #7b1f9a 100%);
          min-height: 100vh;
        }

        /* remove default scroll glow that could reveal white underneath in some browsers */
        ::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.06);
          border-radius: 999px;
        }
      `}</style>
    </div>
  );
}
