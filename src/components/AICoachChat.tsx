'use client';

import { useChat } from '@ai-sdk/react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, User, Brain, Loader2 } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

export default function AICoachChat() {
  const [isOpen, setIsOpen] = useState(false);
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/chat',
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <>
      {/* Floating Action Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-slate-900 text-white rounded-full shadow-[0_10px_40px_rgba(0,0,0,0.2)] flex items-center justify-center border-2 border-slate-700 z-40 group"
      >
        <MessageSquare className="w-7 h-7 group-hover:scale-110 transition-transform" />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            className="fixed bottom-28 right-6 w-[90vw] sm:w-[400px] h-[600px] max-h-[70vh] bg-white rounded-3xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.15)] border border-slate-200/60 z-50 flex flex-col overflow-hidden ring-1 ring-slate-900/5"
          >
            {/* Header */}
            <div className="bg-slate-900 px-6 py-4 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
                  <Brain className="w-5 h-5 text-indigo-400" />
                </div>
                <div>
                  <h3 className="text-white font-bold tracking-tight">FixMe Coach</h3>
                  <p className="text-slate-400 text-xs font-medium">AI powered by Llama 3.1</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 text-white/70 hover:bg-white/20 hover:text-white flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50">
              {messages.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 space-y-4">
                  <Brain className="w-12 h-12 text-slate-300 opacity-50" />
                  <p className="text-sm font-medium px-4">
                    I'm your personal behavioral coach. I've already read your past logs and active experiments. Ask me anything about your progress!
                  </p>
                </div>
              )}
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-5 py-3 ${
                      m.role === 'user'
                        ? 'bg-indigo-600 text-white rounded-tr-sm shadow-md'
                        : 'bg-white text-slate-800 rounded-tl-sm shadow-sm border border-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1.5 opacity-60">
                      {m.role === 'user' ? (
                        <User className="w-3.5 h-3.5" />
                      ) : (
                        <Brain className="w-3.5 h-3.5" />
                      )}
                      <span className="text-[10px] uppercase font-bold tracking-widest">
                        {m.role === 'user' ? 'You' : 'Coach'}
                      </span>
                    </div>
                    {/* Basic markdown simulation for newlines */}
                    <div className="text-sm leading-relaxed whitespace-pre-wrap font-medium">
                      {m.content}
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && messages.length > 0 && messages[messages.length - 1].role === 'user' && (
                 <div className="flex justify-start">
                   <div className="bg-white border border-slate-100 rounded-2xl rounded-tl-sm px-5 py-4 shadow-sm flex items-center gap-2">
                     <Loader2 className="w-4 h-4 animate-spin text-indigo-500" />
                     <span className="text-sm text-slate-400 font-medium">Thinking...</span>
                   </div>
                 </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form
              onSubmit={handleSubmit}
              className="p-4 bg-white border-t border-slate-100 shrink-0"
            >
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={input}
                  onChange={handleInputChange}
                  placeholder="Ask for advice..."
                  className="w-full pl-5 pr-14 py-4 rounded-2xl bg-slate-100 border-none outline-none text-slate-900 text-sm font-medium placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500/20 transition-shadow"
                />
                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="absolute right-2 w-10 h-10 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:hover:bg-indigo-600 text-white flex items-center justify-center transition-colors shadow-sm cursor-pointer z-10"
                >
                  <Send className="w-4 h-4 ml-1" />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
