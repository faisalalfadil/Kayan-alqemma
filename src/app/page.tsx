'use client'

import { useEffect } from 'react'
import Header from '@/components/sections/Header'
import Hero from '@/components/sections/Hero'
import About from '@/components/sections/About'
import Services from '@/components/sections/Services'
import Calculator from '@/components/sections/Calculator'
import Projects from '@/components/sections/Projects'
import Blog from '@/components/sections/Blog'
import Testimonials from '@/components/sections/Testimonials'
import FAQ from '@/components/sections/FAQ'
import Contact from '@/components/sections/Contact'
import Booking from '@/components/sections/Booking'
import Footer from '@/components/sections/Footer'
import ScrollUtilities from '@/components/ScrollUtilities'
import CookieConsent from '@/components/CookieConsent'
import ChatBot from '@/components/chatbot/ChatBot'
import WhatsAppButton from '@/components/WhatsAppButton'
import AdminDashboard from '@/components/admin/AdminDashboard'
import { useAdminStore } from '@/store/admin-store'

export default function Home() {
  const isOpen = useAdminStore((s) => s.isOpen)
  const open = useAdminStore((s) => s.open)
  const close = useAdminStore((s) => s.close)

  // Keyboard shortcut: Ctrl+Shift+A to toggle admin
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        e.preventDefault()
        if (isOpen) {
          close()
        } else {
          open()
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, open, close])

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Hero />
        <About />
        <Services />
        <Calculator />
        <Projects />
        <Blog />
        <Testimonials />
        <FAQ />
        <Contact />
        <Booking />
      </main>
      <Footer />
      <ScrollUtilities />
      <CookieConsent />
      <ChatBot />
      <WhatsAppButton />

      {/* Admin Dashboard Overlay */}
      {isOpen && <AdminDashboard onClose={close} />}
    </div>
  )
}
