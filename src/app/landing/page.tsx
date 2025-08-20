'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/landing/Header'
import Hero from '@/components/landing/Hero'
import VideoSection from '@/components/landing/VideoSection'
import Features from '@/components/landing/Features'
import Pricing from '@/components/landing/Pricing'
import About from '@/components/landing/About'
import Contact from '@/components/landing/Contact'
import Footer from '@/components/landing/Footer'

export default function LandingPage() {
  const router = useRouter()

  return (
    <div className="tubemine-landing">
      {/* Fixed Header with Navigation */}
      <Header router={router} />
      
      {/* Main Content Sections */}
      <main>
        {/* Hero Section - First impression */}
        <Hero router={router} />
        
        {/* Video Section - Demo video */}
        <VideoSection />
        
        {/* Features Section - What we offer */}
        <Features />
        
        {/* Pricing Section - Plans and pricing */}
        <Pricing router={router} />
        
        {/* About Section - Company info */}
        <About />
        
        {/* Contact Section - Get in touch */}
        <Contact />
      </main>

       {/* Footer */}
      <Footer />
    </div>
  )
}
