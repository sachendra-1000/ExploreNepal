'use client'

import React, { useState, useEffect, useRef } from 'react'
import { MessageCircle, Send, User, Search, Filter, MoreVertical, CheckCheck, Trash2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/context/AuthContext'
import { sendChatMessage, subscribeToChatMessages, deleteChatMessage, markMessageAsRead } from '@/lib/firestore'
import Button from './ui/Button'
import { Card, CardContent } from './ui/Card'

export default function AdminChat() {
  const [messages, setMessages] = useState<any[]>([])
  const [message, setMessage] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const { user } = useAuth()
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const unsubscribe = subscribeToChatMessages((newMessages: any[]) => {
      setMessages(newMessages)
    })
    return () => unsubscribe()
  }, [])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
    // Mark unread user messages as read
    messages.forEach(m => {
      if (!m.read && m.senderRole === 'user') {
        markMessageAsRead(m.id)
      }
    })
  }, [messages])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim()) return

    const messageData = {
      senderId: user?.uid,
      senderName: user?.displayName || 'Admin',
      senderRole: 'admin',
      message: message.trim()
    }

    await sendChatMessage(messageData)
    setMessage('')
  }

  const handleDeleteMessage = async (messageId: string) => {
    if (confirm('Are you sure you want to delete this message?')) {
      await deleteChatMessage(messageId)
    }
  }

  const filteredMessages = messages.filter(m => 
    m.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.senderName.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="h-[calc(100vh-180px)] flex gap-6 overflow-hidden">
      {/* Users List (Simplified for this view) */}
      <Card className="w-80 hidden lg:flex flex-col border-none shadow-xl shadow-slate-200/50 rounded-3xl overflow-hidden">
        <div className="p-6 border-b border-slate-50 space-y-4">
          <h3 className="text-lg font-black text-slate-900 tracking-tight">Active Chats</h3>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search conversations..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border-none rounded-xl text-xs font-bold focus:ring-2 focus:ring-indigo-600/20 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {/* In a real app, you'd group by senderId. For now, showing a generic list item */}
          <button className="w-full p-4 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center gap-4 transition-all">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-black text-sm">
              <MessageCircle size={20} />
            </div>
            <div className="text-left overflow-hidden">
              <p className="text-sm font-black text-slate-900 truncate">Global Channel</p>
              <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">Public Support</p>
            </div>
          </button>
        </div>
      </Card>

      {/* Chat Area */}
      <Card className="flex-1 border-none shadow-xl shadow-slate-200/50 rounded-3xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-white/50 backdrop-blur-sm relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-white shadow-lg">
              <MessageCircle size={24} />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900 tracking-tight leading-none mb-1">Public Support Channel</h3>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2.5 rounded-xl hover:bg-slate-50 text-slate-400 transition-colors">
              <Filter size={18} />
            </button>
            <button className="p-2.5 rounded-xl hover:bg-slate-50 text-slate-400 transition-colors">
              <MoreVertical size={18} />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div 
          ref={scrollRef}
          className="flex-1 p-8 overflow-y-auto bg-slate-50/50 space-y-6 custom-scrollbar"
        >
          {filteredMessages.map((msg) => {
            const isMe = msg.senderRole === 'admin'
            return (
              <div 
                key={msg.id} 
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} group`}
              >
                <div className={`max-w-[70%] relative`}>
                  {!isMe && (
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 ml-1">
                      {msg.senderName}
                    </p>
                  )}
                  <div className={`p-5 rounded-[2rem] text-sm font-bold shadow-sm ${
                    isMe 
                      ? 'bg-indigo-600 text-white rounded-tr-none shadow-indigo-600/10' 
                      : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none'
                  }`}>
                    {msg.message}
                  </div>
                  <div className={`mt-2 flex items-center gap-2 px-1 ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">
                      {msg.timestamp?.toDate?.() 
                        ? new Date(msg.timestamp.toDate()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                        : new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    {isMe && <CheckCheck size={12} className="text-indigo-400" />}
                    <button 
                      onClick={() => handleDeleteMessage(msg.id)}
                      className="p-1 rounded-full hover:bg-slate-200/50 text-slate-400 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Input */}
        <div className="p-6 bg-white border-t border-slate-50">
          <form onSubmit={handleSendMessage} className="relative">
            <input 
              type="text" 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your response to travelers..."
              className="w-full pl-6 pr-32 py-5 bg-slate-50 border-none rounded-[1.5rem] focus:ring-2 focus:ring-indigo-600/20 transition-all font-bold text-slate-900"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
              <Button 
                type="submit"
                disabled={!message.trim()}
                className="rounded-2xl py-3 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-indigo-600/20 disabled:opacity-50"
              >
                <Send size={14} className="mr-2" />
                Send
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  )
}
