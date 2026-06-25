'use client'

import React, { useState, useEffect, useRef } from 'react'
import { MessageCircle, X, Send, User, Minus, Maximize2, Sparkles } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'model'; content: string; id: string }>>([])
  const [isTyping, setIsTyping] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isTyping])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim() || isTyping) return

    const userMessageId = Date.now().toString()
    const newMessages = [
      ...messages,
      {
        role: 'user' as const,
        content: message.trim(),
        id: userMessageId
      }
    ]
    setMessages(newMessages)
    setMessage('')
    setIsTyping(true)
    setUnreadCount(0)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages })
      })

      const data = await response.json()
      setMessages([
        ...newMessages,
        {
          role: 'model',
          content: data.text || 'Sorry, I could not get a response.',
          id: (Date.now() + 1).toString()
        }
      ])
      if (!isOpen || isMinimized) {
        setUnreadCount(prev => prev + 1)
      }
    } catch (error) {
      console.error('Error sending message:', error)
      setMessages([
        ...newMessages,
        {
          role: 'model',
          content: 'Sorry, there was an error sending your message. Please try again.',
          id: (Date.now() + 1).toString()
        }
      ])
    } finally {
      setIsTyping(false)
    }
  }

  const toggleChat = () => {
    setIsOpen(!isOpen)
    if (!isOpen) {
      setUnreadCount(0)
      setIsMinimized(false)
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-[200] flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className={`bg-white border border-slate-100 rounded-[2rem] shadow-2xl overflow-hidden flex flex-col transition-all duration-300 ${
              isMinimized ? 'h-20 w-72' : 'h-[600px] w-[400px] max-w-[90vw]'
            }`}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-5 flex items-center justify-between text-white shrink-0">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                    <Sparkles size={20} />
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-blue-600 bg-emerald-400" />
                </div>
                <div>
                  <h3 className="text-sm font-black tracking-tight">Explore Nepal AI</h3>
                  <p className="text-[10px] font-bold opacity-80 uppercase tracking-widest">
                    Always online
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button 
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  {isMinimized ? <Maximize2 size={18} /> : <Minus size={18} />}
                </button>
                <button 
                  onClick={toggleChat}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* Messages Area */}
                <div 
                  ref={scrollRef}
                  className="flex-1 p-6 overflow-y-auto bg-slate-50 space-y-4"
                >
                  {messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-4">
                      <div className="w-20 h-20 rounded-[2rem] bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-indigo-600">
                        <MessageCircle size={40} />
                      </div>
                      <div className="space-y-2">
                        <h4 className="text-lg font-black text-slate-900">Hello there! 👋</h4>
                        <p className="text-sm font-medium text-slate-500">
                          I'm your AI travel assistant for Explore Nepal! Ask me anything about travel in Nepal, our services, or general questions!
                        </p>
                      </div>
                    </div>
                  ) : (
                    messages.map((msg) => {
                      const isMe = msg.role === 'user'
                      return (
                        <div 
                          key={msg.id} 
                          className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                        >
                          <div className={`max-w-[85%] p-4 rounded-2xl text-sm font-medium shadow-sm ${
                            isMe 
                              ? 'bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-tr-none' 
                              : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none'
                          }`}>
                            <div className="prose prose-sm prose-indigo">
                              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                {msg.content}
                              </ReactMarkdown>
                            </div>
                          </div>
                        </div>
                      )
                    })
                  )}
                  {isTyping && (
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                        <Sparkles size={16} className="text-indigo-600" />
                      </div>
                      <div className="flex gap-1.5 p-3 bg-white rounded-2xl border border-slate-100">
                        <motion.div
                          className="w-2 h-2 bg-slate-400 rounded-full"
                          animate={{ y: [0, -6, 0] }}
                          transition={{ duration: 1.2, repeat: Infinity, delay: 0 }}
                        />
                        <motion.div
                          className="w-2 h-2 bg-slate-400 rounded-full"
                          animate={{ y: [0, -6, 0] }}
                          transition={{ duration: 1.2, repeat: Infinity, delay: 0.2 }}
                        />
                        <motion.div
                          className="w-2 h-2 bg-slate-400 rounded-full"
                          animate={{ y: [0, -6, 0] }}
                          transition={{ duration: 1.2, repeat: Infinity, delay: 0.4 }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Input Area */}
                <form 
                  onSubmit={handleSendMessage}
                  className="p-4 bg-white border-t border-slate-100 shrink-0"
                >
                  <div className="relative">
                    <input 
                      type="text" 
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Ask me anything about Nepal..."
                      className="w-full pl-5 pr-14 py-4 bg-slate-50 border-2 border-transparent focus:border-blue-500 rounded-2xl focus:ring-2 focus:ring-blue-500/20 transition-all text-sm font-bold text-slate-900"
                    />
                    <button 
                      type="submit"
                      disabled={!message.trim() || isTyping}
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-11 h-11 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 text-white flex items-center justify-center shadow-lg shadow-blue-600/30 disabled:opacity-50 disabled:shadow-none transition-all active:scale-95"
                    >
                      <Send size={18} />
                    </button>
                  </div>
                </form>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Trigger Button */}
      <button
        onClick={toggleChat}
        className="w-16 h-16 rounded-[1.5rem] bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-2xl shadow-indigo-600/40 flex items-center justify-center hover:scale-110 transition-transform relative group"
      >
        <AnimatePresence mode='wait'>
          {isOpen ? (
            <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
              <X size={28} />
            </motion.div>
          ) : (
            <motion.div key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
              <MessageCircle size={28} />
            </motion.div>
          )}
        </AnimatePresence>
        
        {unreadCount > 0 && !isOpen && (
          <div className="absolute -top-2 -left-2 w-7 h-7 bg-rose-500 text-white text-[10px] font-black rounded-full flex items-center justify-center border-4 border-white shadow-lg animate-bounce">
            {unreadCount}
          </div>
        )}

        <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          Chat with AI
        </div>
      </button>
    </div>
  )
}
