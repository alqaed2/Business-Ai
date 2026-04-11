import React from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { 
  Zap, 
  Shield, 
  Cpu, 
  Globe, 
  ArrowRight, 
  ChevronDown,
  Sparkles,
  Layers,
  Activity
} from 'lucide-react';
import { Button } from "../components/ui/button";

import { useAuth } from '../components/AuthProvider';

const Landing = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const isRtl = i18n.language === 'ar';

  React.useEffect(() => {
    if (!loading && user) {
      navigate('/dashboard');
    }
  }, [user, loading, navigate]);

  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <div className="min-h-screen bg-[#020408] text-white overflow-hidden selection:bg-blue-500/30 selection:text-blue-200">
      {/* Atmospheric Background */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
            x: [0, 50, 0],
            y: [0, 30, 0]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] rounded-full bg-blue-600/20 blur-[120px]"
        />
        <motion.div 
          animate={{ 
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.4, 0.2],
            x: [0, -40, 0],
            y: [0, -50, 0]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-[10%] -right-[10%] w-[60%] h-[60%] rounded-full bg-indigo-600/10 blur-[100px]"
        />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-8 backdrop-blur-sm bg-black/5">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Cpu className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tighter uppercase">AI OS <span className="text-blue-500">CORE</span></span>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-6"
        >
          <Button 
            variant="ghost" 
            className="text-slate-400 hover:text-white hover:bg-white/5 hidden md:flex"
            onClick={() => navigate('/login')}
          >
            {t('landing.login')}
          </Button>
          <Button 
            className="bg-white text-black hover:bg-slate-200 font-bold px-6 rounded-full transition-all hover:scale-105"
            onClick={() => navigate('/login')}
          >
            {t('landing.getStarted')}
          </Button>
        </motion.div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 pt-44 pb-20 px-6 md:px-12 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-6 max-w-5xl"
        >
          <Badge variant="outline" className="bg-blue-500/5 text-blue-400 border-blue-500/20 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-4">
            <Sparkles className="w-3 h-3 mr-2 rtl:mr-0 rtl:ml-2 inline" />
            {t('landing.badge')}
          </Badge>
          
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-light tracking-tight leading-[0.9] text-white">
            {t('landing.heroTitle1')}<br />
            <span className="font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">
              {t('landing.heroTitle2')}
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto font-medium leading-relaxed">
            {t('landing.heroSubtitle')}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
            <Button 
              size="lg" 
              className="w-full sm:w-auto h-14 px-10 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-lg font-bold shadow-2xl shadow-blue-600/30 group"
              onClick={() => navigate('/login')}
            >
              {t('landing.enterSystem')}
              <ArrowRight className={`w-5 h-5 ml-2 rtl:ml-0 rtl:mr-2 transition-transform group-hover:translate-x-1 ${isRtl ? 'rotate-180 group-hover:-translate-x-1' : ''}`} />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="w-full sm:w-auto h-14 px-10 border-white/10 bg-white/5 hover:bg-white/10 text-white rounded-full text-lg font-bold backdrop-blur-sm"
            >
              {t('landing.watchDemo')}
            </Button>
          </div>
        </motion.div>

        {/* Floating AI Core Visualization */}
        <motion.div 
          style={{ y: y1, opacity }}
          className="mt-24 relative"
        >
          <div className="absolute inset-0 bg-blue-500/20 blur-[100px] rounded-full"></div>
          <div className="relative w-64 h-64 md:w-96 md:h-96 flex items-center justify-center">
            {/* Rotating Rings */}
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 border border-blue-500/20 rounded-full"
            />
            <motion.div 
              animate={{ rotate: -360 }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              className="absolute inset-8 border border-indigo-500/30 rounded-full border-dashed"
            />
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              className="absolute inset-16 border-2 border-blue-400/40 rounded-full border-t-transparent"
            />
            
            {/* Central Orb */}
            <motion.div 
              animate={{ 
                scale: [1, 1.1, 1],
                boxShadow: [
                  "0 0 20px rgba(37, 99, 235, 0.4)",
                  "0 0 60px rgba(37, 99, 235, 0.6)",
                  "0 0 20px rgba(37, 99, 235, 0.4)"
                ]
              }}
              transition={{ duration: 4, repeat: Infinity }}
              className="w-32 h-32 md:w-48 md:h-48 bg-gradient-to-br from-blue-500 to-indigo-700 rounded-full flex items-center justify-center relative z-10"
            >
              <Cpu className="w-12 h-12 md:w-20 md:h-20 text-white/90" />
              <div className="absolute inset-0 bg-white/10 rounded-full animate-pulse"></div>
            </motion.div>

            {/* Floating Particles/Nodes */}
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                animate={{ 
                  y: [0, -20, 0],
                  opacity: [0.3, 0.8, 0.3],
                  scale: [1, 1.2, 1]
                }}
                transition={{ 
                  duration: 3 + i, 
                  repeat: Infinity, 
                  delay: i * 0.5 
                }}
                className="absolute w-2 h-2 bg-blue-400 rounded-full"
                style={{ 
                  top: `${20 + Math.random() * 60}%`, 
                  left: `${20 + Math.random() * 60}%`,
                  filter: 'blur(1px)'
                }}
              />
            ))}
          </div>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="relative z-10 py-32 px-6 md:px-12 bg-gradient-to-b from-transparent to-black/40">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                icon: Zap, 
                title: t('landing.features.speed.title'), 
                desc: t('landing.features.speed.desc'),
                color: 'text-amber-400',
                bg: 'bg-amber-400/10'
              },
              { 
                icon: Shield, 
                title: t('landing.features.security.title'), 
                desc: t('landing.features.security.desc'),
                color: 'text-blue-400',
                bg: 'bg-blue-400/10'
              },
              { 
                icon: Activity, 
                title: t('landing.features.intelligence.title'), 
                desc: t('landing.features.intelligence.desc'),
                color: 'text-emerald-400',
                bg: 'bg-emerald-400/10'
              }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all group"
              >
                <div className={`w-14 h-14 rounded-2xl ${feature.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <feature.icon className={`w-7 h-7 ${feature.color}`} />
                </div>
                <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                <p className="text-slate-400 leading-relaxed font-medium">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-20 px-6 md:px-12 border-t border-white/5 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="flex items-center justify-center gap-3 opacity-50">
            <Cpu className="w-5 h-5" />
            <span className="text-sm font-bold tracking-widest uppercase">AI OS CORE v4.0</span>
          </div>
          <p className="text-slate-500 text-sm font-medium">
            &copy; 2026 AI Business OS. All rights reserved. Designed for the future of autonomous enterprise.
          </p>
        </div>
      </footer>

      {/* Scroll Indicator */}
      <motion.div 
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="fixed bottom-10 left-1/2 -translate-x-1/2 z-10 opacity-30"
      >
        <ChevronDown className="w-6 h-6" />
      </motion.div>
    </div>
  );
};

const Badge = ({ children, variant, className }: any) => (
  <div className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${className}`}>
    {children}
  </div>
);

export default Landing;
