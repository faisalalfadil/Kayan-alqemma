'use client';

import { useState, useEffect, useCallback } from 'react';
import { Menu, Phone, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useSettings } from '@/hooks/useSettings';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetClose,
} from '@/components/ui/sheet';

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const NAV_LINKS = [
  { label: 'الرئيسية', href: '#home' },
  { label: 'من نحن', href: '#about' },
  { label: 'خدماتنا', href: '#services' },
  { label: 'حاسبة الأسعار', href: '#calculator' },
  { label: 'مشاريعنا', href: '#projects' },
  { label: 'آراء العملاء', href: '#testimonials' },
  { label: 'المدونة', href: '#blog' },
  { label: 'الأسئلة الشائعة', href: '#faq' },
  { label: 'حجز موعد', href: '#booking' },
  { label: 'اتصل بنا', href: '#contact' },
] as const;

/* ------------------------------------------------------------------ */
/*  Logo SVG (placeholder)                                             */
/* ------------------------------------------------------------------ */

function Logo({ className, siteName }: { className?: string; siteName: string }) {
  return (
    <img
      src="/company-logo.png"
      alt={siteName}
      className={cn('h-10 w-10 shrink-0 rounded-lg object-cover', className)}
    />
  );
}

/* ------------------------------------------------------------------ */
/*  Top Bar                                                            */
/* ------------------------------------------------------------------ */

function TopBar({ phone, workingHours }: { phone: string; workingHours: string }) {
  return (
    <div className="bg-[#0f172a] text-white/80 text-xs">
      <div className="container mx-auto flex items-center justify-between px-4 py-2">
        {/* Phone */}
        <a
          href={`tel:${phone.replace(/\s/g, '')}`}
          dir="ltr"
          className="flex items-center gap-1.5 transition-colors hover:text-white"
        >
          <Phone className="h-3.5 w-3.5" />
          <span>{phone}</span>
        </a>

        {/* Social & info */}
        <div className="flex items-center gap-4">
          <span className="hidden sm:inline">{workingHours}</span>
          <span className="hidden md:inline text-white/30">|</span>
          {/* Social icons as simple text placeholders */}
          <div className="hidden sm:flex items-center gap-3">
            {['تويتر', 'انستقرام', 'واتساب'].map((name) => (
              <span
                key={name}
                className="cursor-pointer transition-colors hover:text-white"
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Desktop Nav Links                                                  */
/* ------------------------------------------------------------------ */

function DesktopNav({
  activeSection,
  onItemClick,
}: {
  activeSection: string;
  onItemClick: () => void;
}) {
  return (
    <nav className="hidden lg:flex items-center gap-1">
      {NAV_LINKS.map((link) => {
        const isActive = activeSection === link.href.replace('#', '');
        return (
          <a
            key={link.href}
            href={link.href}
            onClick={onItemClick}
            className={cn(
              'relative px-3 py-2 text-sm font-medium transition-colors rounded-md',
              isActive
                ? 'text-white'
                : 'text-white/80 hover:text-white hover:bg-white/10'
            )}
          >
            {link.label}
            {/* Active indicator */}
            {isActive && (
              <motion.span
                layoutId="nav-active-indicator"
                className="absolute inset-x-1 -bottom-0.5 h-0.5 rounded-full bg-brand-orange"
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}
          </a>
        );
      })}
    </nav>
  );
}

/* ------------------------------------------------------------------ */
/*  Mobile Nav (inside Sheet)                                          */
/* ------------------------------------------------------------------ */

function MobileNav({
  activeSection,
  onClose,
  phone,
}: {
  activeSection: string;
  onClose: () => void;
  phone: string;
}) {
  return (
    <div className="flex flex-col gap-1 px-4 pt-6">
      {NAV_LINKS.map((link, index) => {
        const isActive = activeSection === link.href.replace('#', '');
        return (
          <motion.a
            key={link.href}
            href={link.href}
            onClick={onClose}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.06, duration: 0.3 }}
            className={cn(
              'flex items-center gap-3 rounded-lg px-4 py-3 text-base font-medium transition-colors',
              isActive
                ? 'bg-brand-blue/10 text-brand-blue'
                : 'text-foreground/80 hover:bg-muted hover:text-foreground'
            )}
          >
            <span
              className={cn(
                'h-1.5 w-1.5 rounded-full shrink-0',
                isActive ? 'bg-brand-orange' : 'bg-foreground/20'
              )}
            />
            {link.label}
            <ChevronDown className="mr-auto h-4 w-4 rotate-[-90deg] opacity-40" />
          </motion.a>
        );
      })}

      {/* Mobile CTA */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: NAV_LINKS.length * 0.06 + 0.1, duration: 0.3 }}
        className="mt-4 px-4"
      >
        <Button
          asChild
          className="w-full bg-brand-orange text-white hover:bg-brand-orange/90 text-base font-bold py-6 rounded-lg"
        >
          <a href="#contact" onClick={onClose}>
            احصل على عرض سعر
          </a>
        </Button>

        {/* Mobile phone */}
        <a
          href={`tel:${phone.replace(/\s/g, '')}`}
          dir="ltr"
          className="mt-4 flex items-center justify-center gap-2 rounded-lg border border-border px-4 py-3 text-sm text-muted-foreground transition-colors hover:border-brand-blue hover:text-brand-blue"
        >
          <Phone className="h-4 w-4" />
          {phone}
        </a>
      </motion.div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Header Component                                              */
/* ------------------------------------------------------------------ */

export default function Header() {
  const { settings } = useSettings();
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [mobileOpen, setMobileOpen] = useState(false);

  /* ---------- Scroll listener ---------- */
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  /* ---------- IntersectionObserver (scroll‑spy) ---------- */
  useEffect(() => {
    const sectionIds = NAV_LINKS.map((l) => l.href.replace('#', ''));
    const observers: IntersectionObserver[] = [];

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveSection(id);
            }
          });
        },
        { rootMargin: '-40% 0px -55% 0px', threshold: 0 }
      );

      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  /* ---------- Lock body scroll when mobile menu is open ---------- */
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const closeMobile = useCallback(() => setMobileOpen(false), []);

  /* ---------- Close mobile on resize ---------- */
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <header
      className={cn(
        'fixed top-0 right-0 left-0 z-50 transition-all duration-300',
        isScrolled
          ? 'bg-[#1a56db]/95 backdrop-blur-md shadow-lg shadow-black/10'
          : 'bg-[#1a56db]'
      )}
    >
      {/* ---- Top Bar ---- */}
      <AnimatePresence>
        {!isScrolled && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <TopBar phone={settings.phone} workingHours={settings.workingHours} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ---- Main Navbar ---- */}
      <div className="border-t border-white/10">
        <div className="container mx-auto flex items-center justify-between px-4 py-3 lg:py-4">
          {/* Logo + Brand */}
          <a href="#home" className="flex items-center gap-3 group">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            >
              <Logo className="text-white" siteName={settings.siteName} />
            </motion.div>
            <div className="flex flex-col leading-tight">
              <span className="text-white font-bold text-sm sm:text-base lg:text-lg tracking-tight">
                {settings.siteName}
              </span>
              <span className="text-white/50 text-[10px] sm:text-xs hidden sm:block">
                توريد وتركيب المظلات الكهربائية
              </span>
            </div>
          </a>

          {/* Desktop nav links */}
          <DesktopNav activeSection={activeSection} onItemClick={closeMobile} />

          {/* Right side: CTA + Mobile trigger */}
          <div className="flex items-center gap-3">
            {/* CTA Button — hidden on small screens */}
            <Button
              asChild
              className="hidden lg:flex bg-brand-orange hover:bg-brand-orange-light text-white font-bold text-sm px-5 py-2.5 rounded-lg shadow-md shadow-brand-orange/25 transition-all hover:shadow-lg hover:shadow-brand-orange/30"
            >
              <motion.a
                href="#contact"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
              >
                احصل على عرض سعر
              </motion.a>
            </Button>

            {/* Mobile hamburger */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden text-white hover:bg-white/10"
                  aria-label="فتح القائمة"
                >
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>

              <SheetContent
                side="right"
                className="w-[300px] sm:w-[360px] bg-background p-0 overflow-y-auto"
              >
                {/* Mobile header */}
                <div className="flex items-center gap-3 border-b px-4 py-4">
                  <Logo className="text-brand-blue" siteName={settings.siteName} />
                  <SheetTitle className="text-base font-bold text-foreground">
                    {settings.siteName}
                  </SheetTitle>
                </div>

                {/* Nav links */}
                <MobileNav activeSection={activeSection} onClose={closeMobile} phone={settings.phone} />
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
