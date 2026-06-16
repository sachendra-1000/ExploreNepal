'use client'

import React, { useState, useEffect, useRef } from 'react'
import { MessageCircle, X, Send, User, Minus, Maximize2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/context/AuthContext'
import { sendChatMessage, subscribeToChatMessages, markMessageAsRead } from '@/lib/firestore'
import Button from './ui/Button'

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState<any[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const { user } = useAuth()
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const unsubscribe = subscribeToChatMessages((newMessages) => {
      setMessages(newMessages)
      // Update unread count
      if (!isOpen || isMinimized) {
        const unread = newMessages.filter(m => !m.read && m.senderRole !== 'user').length
        setUnreadCount(unread)
      }
    })
    return () => unsubscribe()
  }, [isOpen, isMinimized])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
    // Mark messages as read when chat is open
    if (isOpen && !isMinimized) {
      messages.forEach(m => {
        if (!m.read && m.senderRole === 'admin') {
          markMessageAsRead(m.id)
        }
      })
      setUnreadCount(0)
    }
  }, [messages, isOpen, isMinimized])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim()) return

    const messageData = {
      senderId: user?.uid || 'guest-' + Math.random().toString(36).substr(2, 9),
      senderName: user?.displayName || 'Guest User',
      senderRole: user?.role === 'admin' ? 'admin' : 'user',
      message: message.trim()
    }

    await sendChatMessage(messageData)
    setMessage('')
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
              isMinimized ? 'h-20 w-72' : 'h-[550px] w-[380px] max-w-[90vw]'
            }`}
          >
            {/* Header */}
            <div className="bg-blue-600 p-5 flex items-center justify-between text-white shrink-0">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                    <User size={20} />
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-blue-600 bg-emerald-400" />
                </div>
                <div>
                  <h3 className="text-sm font-black tracking-tight">Live Support</h3>
                  <p className="text-[10px] font-bold opacity-80 uppercase tracking-widest">
                    Online
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
                  className="flex-1 p-6 overflow-y-auto bg-slate-50 space-y-4 custom-scrollbar"
                >
                  {messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-4">
                      <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center text-blue-400">
                        <MessageCircle size={32} />
                      </div>
                      <div className="space-y-2">
                        <h4 className="text-sm font-black text-slate-900">Start a Conversation</h4>
                        <p className="text-xs font-medium text-slate-500">Ask us anything about your trip to Nepal!</p>
                      </div>
                    </div>
                  ) : (
                    messages.map((msg) => {
                      const isMe = msg.senderRole === 'user' || (msg.senderId.startsWith('guest') && !user?.uid)
                      return (
                        <div 
                          key={msg.id} 
                          className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                        >
                          <div className={`max-w-[80%] p-4 rounded-2xl text-sm font-medium shadow-sm ${
                            isMe 
                              ? 'bg-blue-600 text-white rounded-tr-none' 
                              : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none'
                          }`}>
                            {msg.message}
                          </div>
                          <div className="mt-1 flex items-center gap-1.5 px-1">
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                              {msg.senderRole === 'admin' ? 'Support' : msg.senderName}
                            </span>
                            <span className="text-[9px] font-bold text-slate-300">•</span>
                            <span className="text-[9px] font-bold text-slate-400">
                              {msg.timestamp?.toDate?.() 
                                ? new Date(msg.timestamp.toDate()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                : new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        </div>
                      )
                    })
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
                      placeholder="Type your message..."
                      className="w-full pl-6 pr-14 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-600 transition-all text-sm font-bold text-slate-900"
                    />
                    <button 
                      type="submit"
                      disabled={!message.trim()}
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-600/20 disabled:opacity-50 disabled:shadow-none transition-all active:scale-95"
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
        className="w-16 h-16 rounded-[1.5rem] bg-blue-600 text-white shadow-2xl shadow-blue-600/40 flex items-center justify-center hover:scale-110 transition-transform relative group"
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
          Chat with us
        </div>
      </button>
    </div>
  )
}
