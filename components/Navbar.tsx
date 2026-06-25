'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Menu, X, ChevronDown, User, LogOut } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { motion, AnimatePresence } from 'framer-motion'

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuth()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLogout = async () => {
    const result = await logout()
    if (result.success) {
      router.push('/')
      setIsProfileOpen(false)
    }
  }

  const mainNavLinks = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Packages', href: '/packages' },
    { name: 'Local Tours', href: '/local-tours' },
    { name: 'Hotels', href: '/hotels' },
    { name: 'Guides', href: '/guides' },
    { name: 'Bus', href: '/bus' },
    { name: 'Booking', href: '/booking' },
    { name: 'Contact', href: '/contact' },
  ]

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
      isScrolled 
        ? 'bg-slate-900/95 backdrop-blur-md shadow-2xl py-3 border-b border-slate-700/50' 
        : 'bg-slate-900 py-4 border-b border-slate-800'
    }`}>
      <div className="container-custom mx-auto px-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="relative w-12 h-12 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Image
                  src="/image/logo_explorenepal-removebg-preview.png"
                  alt="Explore Nepal Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <span className="hidden sm:block text-lg lg:text-xl font-black tracking-tighter text-white">
                EXPLORE<span className="text-blue-400">NEPAL</span>
              </span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center space-x-1 flex-1 mx-8">
            {mainNavLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href}
                className={`px-3 py-2 rounded-lg text-[12px] font-semibold uppercase tracking-widest transition-all duration-300 whitespace-nowrap ${
                  pathname === link.href 
                    ? 'text-blue-400 bg-blue-500/20' 
                    : 'text-slate-300 hover:text-blue-400 hover:bg-slate-800/50'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="hidden lg:flex items-center space-x-3">
            {user ? (
              <div className="relative">
                <button 
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 p-1.5 px-3 bg-slate-800 rounded-xl border border-slate-700 hover:border-blue-500 hover:shadow-lg hover:shadow-blue-600/20 transition-all focus:outline-none group"
                >
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-xs shadow-lg">
                    {user.displayName?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <span className="text-xs font-semibold text-slate-200">{(user.displayName || 'Account').split(' ')[0]}</span>
                  <ChevronDown size={14} className={`text-slate-400 transition-transform duration-300 ${isProfileOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                      className="absolute right-0 mt-2 w-56 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl py-2 z-50 overflow-hidden"
                    >
                      <div className="px-4 py-3 border-b border-slate-700">
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Signed in as</p>
                        <p className="text-sm font-bold text-white truncate mt-1">{user.email}</p>
                      </div>
                      {user.role !== 'admin' && (
                        <>
                          <Link 
                            href="/bookings"
                            className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-slate-300 hover:text-blue-400 hover:bg-slate-700 transition-colors"
                            onClick={() => setIsProfileOpen(false)}
                          >
                            <User size={16} />
                            My Bookings
                          </Link>
                          <Link 
                            href="/user"
                            className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-slate-300 hover:text-blue-400 hover:bg-slate-700 transition-colors"
                            onClick={() => setIsProfileOpen(false)}
                          >
                            <User size={16} />
                            My Profile
                          </Link>
                        </>
                      )}
                      <button 
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-rose-400 hover:bg-rose-900/20 transition-colors"
                      >
                        <LogOut size={16} />
                        Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <>
                <Link 
                  href="/login"
                  className="inline-flex items-center justify-center rounded-full border border-slate-700 bg-slate-800 px-4 py-2 text-sm font-semibold text-slate-200 hover:border-blue-400 hover:text-blue-400 transition"
                >
                  Login
                </Link>
                <Link 
                  href="/signup"
                  className="inline-flex items-center justify-center rounded-full bg-blue-500 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-400 transition"
                >
                  Signup
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center space-x-3">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)} 
              className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-blue-400 transition-colors"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden bg-slate-900 border-t border-slate-800 overflow-hidden"
          >
            <div className="flex flex-col p-4 space-y-2">
              {mainNavLinks.map((link) => (
                <Link 
                  key={link.name} 
                  href={link.href}
                  className={`px-4 py-3 rounded-lg text-sm font-semibold transition-all ${
                    pathname === link.href 
                      ? 'text-blue-400 bg-blue-500/20' 
                      : 'text-slate-300 hover:text-blue-400 hover:bg-slate-800'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}

              {!user && (
                <div className="pt-4 border-t border-slate-700 mt-4 space-y-2">
                  <Link 
                    href="/login"
                    className="block w-full rounded-full border border-slate-700 bg-slate-800 px-4 py-3 text-center text-sm font-semibold text-slate-200 hover:border-blue-400 hover:text-blue-400 transition"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link 
                    href="/signup"
                    className="block w-full rounded-full bg-blue-500 px-4 py-3 text-center text-sm font-semibold text-white hover:bg-blue-400 transition"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Signup
                  </Link>
                </div>
              )}

              {user && (
                <div className="pt-4 border-t border-slate-700 mt-4 space-y-2">
                  {user.role !== 'admin' && (
                    <>
                      <Link 
                        href="/bookings"
                        className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-slate-300 hover:text-blue-400 hover:bg-slate-800 transition-colors font-semibold"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <User size={18} />
                        My Bookings
                      </Link>
                      <Link 
                        href="/user"
                        className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-slate-300 hover:text-blue-400 hover:bg-slate-800 transition-colors font-semibold"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <User size={18} />
                        My Profile
                      </Link>
                    </>
                  )}
                  <button 
                    onClick={() => { 
                      handleLogout()
                      setIsMenuOpen(false)
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-rose-400 hover:bg-rose-900/20 transition-colors font-semibold"
                  >
                    <LogOut size={18} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
