'use client'

import React, { useState, useEffect } from 'react'
import { Settings, Trash2, Plus, Download, CheckCircle, X } from 'lucide-react'
import { db } from '@/lib/firebase'
import { doc, setDoc, getDoc, collection, getDocs, deleteDoc } from 'firebase/firestore'
import { motion } from 'framer-motion'
import Toast from '@/components/Toast'
import AdminRoute from '@/components/AdminRoute'

export default function AISettings() {
  const [aiEnabled, setAiEnabled] = useState(true)
  const [welcomeMessage, setWelcomeMessage] = useState('Hello there! 👋 I\'m your AI travel assistant for Explore Nepal! Ask me anything about travel in Nepal, our services, or general questions!')
  const [customKnowledge, setCustomKnowledge] = useState('')
  const [toast, setToast] = useState<{ show: boolean; type: 'success' | 'error' | 'info'; message: string }>({ show: false, type: 'success', message: '' })
  const [loading, setLoading] = useState(false)
  const [chatHistory, setChatHistory] = useState<any[]>([])

  // Load AI settings from Firestore
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const settingsDoc = await getDoc(doc(db, 'settings', 'ai'))
        if (settingsDoc.exists()) {
          const data = settingsDoc.data()
          setAiEnabled(data.enabled ?? true)
          setWelcomeMessage(data.welcomeMessage || welcomeMessage)
          setCustomKnowledge(data.customKnowledge || '')
        }
      } catch (error) {
        console.error('Error loading AI settings:', error)
      }
    }
    loadSettings()
  }, [])

  // Save settings to Firestore
  const handleSaveSettings = async () => {
    setLoading(true)
    try {
      await setDoc(doc(db, 'settings', 'ai'), {
        enabled: aiEnabled,
        welcomeMessage,
        customKnowledge,
        updatedAt: new Date()
      }, { merge: true })
      setToast({ show: true, type: 'success', message: 'Settings saved successfully!' })
    } catch (error) {
      console.error('Error saving settings:', error)
      setToast({ show: true, type: 'error', message: 'Failed to save settings.' })
    } finally {
      setLoading(false)
    }
  }

  // Clear chat history
  const handleClearHistory = async () => {
    if (confirm('Are you sure you want to clear all chat history?')) {
      try {
        const chatsSnapshot = await getDocs(collection(db, 'chatMessages'))
        const deletePromises = chatsSnapshot.docs.map(doc => deleteDoc(doc.ref))
        await Promise.all(deletePromises)
        setToast({ show: true, type: 'success', message: 'Chat history cleared successfully!' })
      } catch (error) {
        console.error('Error clearing chat history:', error)
        setToast({ show: true, type: 'error', message: 'Failed to clear chat history.' })
      }
    }
  }

  // Export chat history
  const handleExportHistory = () => {
    const dataStr = JSON.stringify(chatHistory, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const a = document.createElement('a')
    a.href = url
    a.download = `explore-nepal-chat-history-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <AdminRoute>
      <div className="min-h-screen bg-slate-50 p-8">
        <Toast 
          show={toast.show} 
          type={toast.type} 
          message={toast.message} 
          onClose={() => setToast({ ...toast, show: false })} 
        />
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
              <Settings size={24} className="text-indigo-600" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900">AI Assistant Settings</h1>
              <p className="text-slate-500 font-medium">Manage your AI travel assistant</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Settings */}
            <div className="lg:col-span-2 space-y-6">
              {/* General Settings */}
              <div className="bg-white rounded-[2rem] border border-slate-100 p-8 shadow-sm">
                <h2 className="text-lg font-black text-slate-900 mb-6">General Settings</h2>
                
                <div className="space-y-6">
                  {/* Enable/Disable AI */}
                  <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl">
                    <div>
                      <p className="font-bold text-slate-700">Enable AI Assistant</p>
                      <p className="text-xs text-slate-400 font-medium">Turn the AI chat widget on or off</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-xs font-black uppercase tracking-widest ${aiEnabled ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {aiEnabled ? 'ON' : 'OFF'}
                      </span>
                      <button 
                        onClick={() => setAiEnabled(!aiEnabled)} 
                        className={`w-14 h-7 rounded-full relative transition-colors cursor-pointer ${
                          aiEnabled ? 'bg-gradient-to-r from-blue-600 to-indigo-700' : 'bg-slate-300'
                        }`}
                      >
                        <div className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow-md transition-transform ${
                          aiEnabled ? 'translate-x-7.5' : 'translate-x-0.5'
                        }`} style={{ transform: aiEnabled ? 'translateX(28px)' : 'translateX(2px)' }} />
                      </button>
                    </div>
                  </div>

                  {/* Welcome Message */}
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400">Welcome Message</label>
                    <textarea 
                      value={welcomeMessage} 
                      onChange={(e) => setWelcomeMessage(e.target.value)} 
                      className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-600/20 font-bold text-slate-900 resize-none"
                      rows={4}
                    />
                  </div>
                </div>
              </div>

              {/* Custom Knowledge */}
              <div className="bg-white rounded-[2rem] border border-slate-100 p-8 shadow-sm">
                <h2 className="text-lg font-black text-slate-900 mb-6">Custom Knowledge</h2>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400">
                    Add custom information for the AI to use
                  </label>
                  <textarea 
                    value={customKnowledge} 
                    onChange={(e) => setCustomKnowledge(e.target.value)} 
                    className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-600/20 font-bold text-slate-900 resize-none"
                    rows={8}
                    placeholder="Add information about your services, policies, or special offers..."
                  />
                </div>
              </div>

              <button 
                onClick={handleSaveSettings} 
                disabled={loading}
                className="w-full lg:w-auto px-12 py-4 bg-gradient-to-r from-indigo-600 to-blue-700 text-white rounded-[1.5rem] font-black text-sm shadow-lg shadow-indigo-600/20 hover:shadow-xl transition-all disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>

            {/* Chat History */}
            <div className="space-y-6">
              <div className="bg-white rounded-[2rem] border border-slate-100 p-8 shadow-sm">
                <h2 className="text-lg font-black text-slate-900 mb-6">Chat History</h2>

                <div className="space-y-4">
                  <button 
                    onClick={handleExportHistory}
                    className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-slate-50 border border-slate-200 rounded-xl font-black text-sm text-slate-700 hover:bg-slate-100 transition-all"
                  >
                    <Download size={18} /> Export Chat History
                  </button>

                  <button 
                    onClick={handleClearHistory}
                    className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-rose-50 border border-rose-200 rounded-xl font-black text-sm text-rose-600 hover:bg-rose-100 transition-all"
                  >
                    <Trash2 size={18} /> Clear Chat History
                  </button>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                      <CheckCircle size={20} className="text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-sm font-black text-slate-700">Status</p>
                      <p className="text-xs text-slate-500 font-medium">
                        {aiEnabled ? 'AI Assistant is active' : 'AI Assistant is disabled'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AdminRoute>
  )
}
