'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { MapPin, Phone, Mail, Globe, Share2, Camera, Tv, Send, ChevronRight } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const socialLinks = [
    { icon: Share2, href: '#', label: 'Facebook', color: 'hover:bg-[#1877F2]' },
    { icon: Camera, href: '#', label: 'Instagram', color: 'hover:bg-[#E4405F]' },
    { icon: Send, href: '#', label: 'Twitter', color: 'hover:bg-[#1DA1F2]' },
    { icon: Tv, href: '#', label: 'Youtube', color: 'hover:bg-[#FF0000]' }
  ]

  return (
    <footer className="bg-slate-900 text-slate-300 pt-20 pb-10 overflow-hidden relative">
      {/* Decorative elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl -translate-y-1/2" />
      <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl translate-y-1/2" />

      <div className="container-custom mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Column */}
          <div className="space-y-8">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="relative w-12 h-12 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Image
                  src="/image/logo_explorenepal-removebg-preview.png"
                  alt="Explore Nepal Logo"
                  fill
                  className="object-contain brightness-0 invert"
                />
              </div>
              <span className="text-xl font-black tracking-tighter text-white">
                EXPLORE<span className="text-blue-600">NEPAL</span>
              </span>
            </Link>
            <p className="text-sm font-medium leading-relaxed opacity-80">
              Discover the breathtaking beauty of the Himalayas and the rich cultural heritage of Nepal with our curated travel experiences.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social, idx) => (
                <a 
                  key={idx} 
                  href={social.href}
                  className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white transition-all duration-300 ${social.color} hover:scale-110`}
                  aria-label={social.label}
                >
                  <social.icon size={18} />
                </a>
              ))}
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="text-white font-black uppercase tracking-widest text-xs mb-8">Quick Links</h4>
            <ul className="space-y-4">
              {[
                { name: 'Home', href: '/' },
                { name: 'About Us', href: '/about' },
                { name: 'Destinations', href: '/places' },
                { name: 'Packages', href: '/packages' },
                { name: 'Contact Us', href: '/contact' }
              ].map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm font-bold hover:text-blue-500 flex items-center gap-2 group transition-colors">
                    <ChevronRight size={14} className="text-blue-600 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-black uppercase tracking-widest text-xs mb-8">Our Services</h4>
            <ul className="space-y-4">
              {[
                { name: 'Luxury Hotels', href: '/hotels' },
                { name: 'Expert Guides', href: '/guides' },
                { name: 'Bus Booking', href: '/bus' },
                { name: 'Local Tours', href: '/packages' },
                { name: 'Adventure Sports', href: '/adventure' }
              ].map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm font-bold hover:text-blue-500 flex items-center gap-2 group transition-colors">
                    <ChevronRight size={14} className="text-blue-600 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-8">
            <h4 className="text-white font-black uppercase tracking-widest text-xs mb-8">Contact Us</h4>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-blue-500 shrink-0">
                  <MapPin size={18} />
                </div>
                <div>
                  <p className="text-xs font-black text-white uppercase tracking-wider mb-1">Office Location</p>
                  <p className="text-sm font-medium opacity-80">Thamel, Kathmandu, Nepal</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-emerald-500 shrink-0">
                  <Phone size={18} />
                </div>
                <div>
                  <p className="text-xs font-black text-white uppercase tracking-wider mb-1">Phone Number</p>
                  <p className="text-sm font-medium opacity-80">+977 1 4412345</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-violet-500 shrink-0">
                  <Mail size={18} />
                </div>
                <div>
                  <p className="text-xs font-black text-white uppercase tracking-wider mb-1">Email Address</p>
                  <p className="text-sm font-medium opacity-80">info@explorenepal.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-xs font-bold opacity-60">
            &copy; {currentYear} Explore Nepal. All rights reserved.
          </p>
          <div className="flex gap-8">
            <Link href="/privacy" className="text-xs font-bold hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="text-xs font-bold hover:text-white transition-colors">Terms of Service</Link>
            <Link href="/cookies" className="text-xs font-bold hover:text-white transition-colors">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
