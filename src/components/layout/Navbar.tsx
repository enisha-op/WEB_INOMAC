'use client'
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Search } from 'lucide-react';

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Modelos', href: '#catalogo' },
    { name: 'Financiamiento', href: '#financiamiento' },
    { name: 'Servicios', href: '#servicios' },
    { name: 'Contacto', href: '#contacto' },
  ];

  return (
    <nav 
      className={`fixed w-full z-50 transition-all duration-500 ${
        isScrolled 
          ? 'bg-black/90 backdrop-blur-lg py-3 border-b border-white/10' 
          : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-[1400px] mx-auto px-8 flex justify-between items-center">
        
        {/* LOGO MINIMALISTA */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center"
        >
          <span className="text-xl font-light tracking-[0.3em] text-white uppercase">
            INO<span className="font-black italic text-primary">MAC</span>
          </span>
        </motion.div>

        {/* DESKTOP MENU ESTILO PORSCHE */}
        <div className="hidden md:flex items-center space-x-12">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="group relative text-white/70 hover:text-white text-[10px] font-bold uppercase tracking-[0.2em] transition-colors"
            >
              {link.name}
              {/* Línea animada inferior */}
              <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-primary transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
          
          <div className="h-4 w-[1px] bg-white/20 mx-2" />
          
          <button className="text-white hover:text-primary transition-colors">
            <Search size={18} strokeWidth={1.5} />
          </button>
        </div>

        {/* MOBILE TOGGLE */}
        <div className="md:hidden flex items-center gap-6">
           <button className="text-white">
            <Search size={20} strokeWidth={1.5} />
          </button>
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-white"
          >
            {isMobileMenuOpen ? <X size={24} strokeWidth={1.5} /> : <Menu size={24} strokeWidth={1.5} />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU FULL SCREEN */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 top-0 left-0 w-full h-screen bg-black z-[-1] flex flex-col justify-center px-12"
          >
            <div className="flex flex-col space-y-8">
              {navLinks.map((link, i) => (
                <motion.a
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-3xl font-light text-white uppercase tracking-tighter hover:text-primary transition-colors"
                >
                  {link.name}
                </motion.a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};