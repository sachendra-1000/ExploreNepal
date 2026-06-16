'use client'

import React from 'react'
import { Compass, Users, MapPin, Heart } from 'lucide-react'

export default function About() {
  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="bg-gray-900 text-white py-20">
        <div className="container-custom text-center space-y-4">
          <h1 className="text-4xl font-bold">About Explore Nepal</h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Your trusted partner for authentic Himalayan experiences since 2009.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold">Our Mission</h2>
              <p className="text-gray-600 leading-relaxed">
                Our mission is to provide travelers with unforgettable experiences while promoting sustainable tourism and supporting local communities in Nepal. We believe in showing the "real" Nepal, beyond the typical tourist trails.
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <div className="text-blue-600"><Compass size={32} /></div>
                  <h3 className="font-bold">Expert Guides</h3>
                  <p className="text-sm text-gray-500">Certified local professionals.</p>
                </div>
                <div className="space-y-2">
                  <div className="text-blue-600"><Heart size={32} /></div>
                  <h3 className="font-bold">Local Support</h3>
                  <p className="text-sm text-gray-500">Supporting local families.</p>
                </div>
              </div>
            </div>
            <div className="rounded-lg overflow-hidden shadow-xl">
              <img src="/image/Kathmandu Valley.jpg" alt="Our Team" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gray-50">
        <div className="container-custom text-center space-y-12">
          <h2 className="text-3xl font-bold">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-sm space-y-4">
              <h3 className="text-xl font-bold">Integrity</h3>
              <p className="text-gray-600">We are honest and transparent in all our dealings.</p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-sm space-y-4">
              <h3 className="text-xl font-bold">Sustainability</h3>
              <p className="text-gray-600">We minimize our environmental impact.</p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-sm space-y-4">
              <h3 className="text-xl font-bold">Community</h3>
              <p className="text-gray-600">We empower local communities through tourism.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
