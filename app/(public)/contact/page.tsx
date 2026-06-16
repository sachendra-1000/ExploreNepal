'use client'

import React, { useState } from 'react'
import { Phone, Mail, MapPin, Send, Share2, Camera, Tv, Globe, Clock, MessageCircle, ChevronRight, ShieldCheck } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { motion } from 'framer-motion'

export default function Contact() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission logic here
    console.log('Form submitted:', formData)
    alert('Thank you for your message. We will get back to you soon!')
    setFormData({ fullName: '', email: '', phone: '', subject: '', message: '' })
  }

  const contactInfo = [
    {
      icon: MapPin,
      title: 'Our Office',
      details: 'Thamel, Kathmandu, Nepal',
      subDetails: 'Main Tourism Hub',
      color: 'blue'
    },
    {
      icon: Phone,
      title: 'Phone Number',
      details: '+977 1 4412345',
      subDetails: 'Mon-Fri from 9am to 6pm',
      color: 'emerald'
    },
    {
      icon: Mail,
      title: 'Email Address',
      details: 'hello@explorenepal.com',
      subDetails: 'Online Support 24/7',
      color: 'violet'
    }
  ]

  const socialLinks = [
    { icon: Share2, href: '#', label: 'Facebook', color: 'bg-[#1877F2]' },
    { icon: Camera, href: '#', label: 'Instagram', color: 'bg-[#E4405F]' },
    { icon: Send, href: '#', label: 'Twitter', color: 'bg-[#1DA1F2]' },
    { icon: Tv, href: '#', label: 'Youtube', color: 'bg-[#FF0000]' }
  ]

  return (
    <div className="bg-slate-50 min-h-screen pt-32 pb-20">
      <div className="container-custom mx-auto px-4">
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-[0.3em] shadow-sm"
          >
            <Globe size={14} />
            <span>Get In Touch</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter"
          >
            We're Here to <span className="text-blue-600">Help You</span> Explore
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-slate-500 text-lg font-medium leading-relaxed"
          >
            Have questions about a trek, hotel booking, or need a custom itinerary? Our team of local experts is ready to assist you.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Form */}
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="border-none shadow-2xl shadow-slate-200/50 rounded-[2.5rem] overflow-hidden">
                <div className="bg-blue-600 p-8 text-white">
                  <h2 className="text-2xl font-black tracking-tight">Send Us a Message</h2>
                  <p className="text-blue-100 font-medium opacity-80">We typically respond within 2 hours.</p>
                </div>
                <CardContent className="p-10">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Full Name</label>
                        <input 
                          type="text" 
                          required
                          value={formData.fullName}
                          onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                          className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-600 transition-all font-bold text-slate-900" 
                          placeholder="John Doe" 
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Email Address</label>
                        <input 
                          type="email" 
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-600 transition-all font-bold text-slate-900" 
                          placeholder="john@example.com" 
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Phone Number</label>
                        <input 
                          type="tel" 
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-600 transition-all font-bold text-slate-900" 
                          placeholder="+977 98XXXXXXXX" 
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Subject</label>
                        <input 
                          type="text" 
                          required
                          value={formData.subject}
                          onChange={(e) => setFormData({...formData, subject: e.target.value})}
                          className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-600 transition-all font-bold text-slate-900" 
                          placeholder="How can we help?" 
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Your Message</label>
                      <textarea 
                        required
                        value={formData.message}
                        onChange={(e) => setFormData({...formData, message: e.target.value})}
                        className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-600 transition-all font-bold text-slate-900 min-h-[160px] resize-none" 
                        placeholder="Tell us more about your travel plans..."
                      ></textarea>
                    </div>

                    <Button type="submit" size="lg" className="w-full rounded-2xl py-6 shadow-xl shadow-blue-600/20 font-black text-sm uppercase tracking-[0.2em]">
                      <Send size={18} className="mr-2" />
                      Send Message
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Right Column: Info */}
          <div className="lg:col-span-5 space-y-8">
            {/* Contact Cards */}
            <div className="grid grid-cols-1 gap-6">
              {contactInfo.map((info, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + (idx * 0.1) }}
                >
                  <Card className="border-none shadow-lg shadow-slate-200/50 rounded-3xl hover:shadow-xl transition-all group">
                    <CardContent className="p-6 flex items-center gap-6">
                      <div className={`w-14 h-14 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-blue-600 shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-all duration-500`}>
                        <info.icon size={24} />
                      </div>
                      <div>
                        <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">{info.title}</h3>
                        <p className="text-lg font-black text-slate-900">{info.details}</p>
                        <p className="text-xs font-bold text-slate-500">{info.subDetails}</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Business Hours */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <Card className="border-none shadow-lg shadow-slate-200/50 rounded-[2rem] bg-slate-900 text-white overflow-hidden relative group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 rounded-full -mr-16 -mt-16 blur-2xl group-hover:scale-150 transition-transform duration-1000" />
                <CardContent className="p-8 relative z-10 space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                      <Clock size={20} className="text-blue-400" />
                    </div>
                    <h3 className="text-xl font-black tracking-tight">Business Hours</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-white/5">
                      <span className="text-slate-400 font-bold">Sunday - Friday</span>
                      <span className="font-black">9:00 AM - 6:00 PM</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-slate-400 font-bold">Saturday</span>
                      <span className="font-black text-blue-400">10:00 AM - 2:00 PM</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-white/5 rounded-xl border border-white/5">
                    <ShieldCheck size={16} className="text-emerald-400" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Official Registered Agency</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Social Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex items-center justify-between p-2 bg-white rounded-3xl border border-slate-100 shadow-md"
            >
              <span className="px-6 text-xs font-black text-slate-400 uppercase tracking-widest">Follow Us</span>
              <div className="flex gap-2">
                {socialLinks.map((social, idx) => (
                  <a 
                    key={idx} 
                    href={social.href}
                    className={`w-12 h-12 rounded-2xl ${social.color} flex items-center justify-center text-white shadow-lg hover:scale-110 transition-transform`}
                    aria-label={social.label}
                  >
                    <social.icon size={20} />
                  </a>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Map Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="mt-20"
        >
          <Card className="border-none shadow-2xl shadow-slate-200/50 rounded-[3rem] overflow-hidden h-[450px] relative group">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3532.127891253459!2d85.31215447614944!3d27.71337492552802!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb1900139199d3%3A0x600203006240f901!2sThamel%2C%20Kathmandu%2044600!5e0!3m2!1sen!2snp!4v1711234567890!5m2!1sen!2snp" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen={true} 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              className="grayscale group-hover:grayscale-0 transition-all duration-1000"
            ></iframe>
            <div className="absolute top-8 left-8">
              <div className="px-6 py-4 bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white flex items-center gap-4">
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white">
                  <MapPin size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">Visit Our Office</h4>
                  <p className="text-xs font-bold text-slate-500">Thamel, Kathmandu, Nepal</p>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
