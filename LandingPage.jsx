import React, { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import { Cpu, Activity, Shield, Terminal, ArrowRight, Crosshair, Zap, Database, Lock, Eye, Code, Power, X, Network, Server, Fingerprint } from 'lucide-react';

// --- CUSTOM CURSOR ---
const CustomCursor = () => {
  const [mode, setMode] = useState('default');
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { damping: 25, stiffness: 300, mass: 0.5 };
  const smoothX = useSpring(cursorX, springConfig);
  const smoothY = useSpring(cursorY, springConfig);

  useEffect(() => {
    const updatePosition = (e) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };
    const handleMouseOver = (e) => {
      const target = e.target;
      if (target.tagName.toLowerCase() === 'button' || target.closest('button') || target.classList.contains('interactive')) {
        setMode('hover');
      } else if (target.classList.contains('view-trigger')) {
        setMode('view');
      } else {
        setMode('default');
      }
    };
    window.addEventListener('mousemove', updatePosition);
    window.addEventListener('mouseover', handleMouseOver);
    return () => {
      window.removeEventListener('mousemove', updatePosition);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, [cursorX, cursorY]);

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 bg-cyan-400 rounded-full pointer-events-none z-[100] mix-blend-screen shadow-[0_0_10px_rgba(0,212,255,0.8)] -ml-1 -mt-1 hidden md:block"
        style={{ x: cursorX, y: cursorY }}
        animate={{ scale: mode === 'hover' ? 0.5 : 1 }}
      />
      <motion.div
        className="fixed top-0 left-0 border border-cyan-500/50 rounded-full pointer-events-none z-[99] hidden md:flex items-center justify-center -ml-4 -mt-4"
        style={{ 
          x: smoothX, 
          y: smoothY,
          width: 32,
          height: 32
        }}
        animate={{
          scale: mode === 'hover' ? 1.5 : mode === 'view' ? 2.5 : 1,
          borderColor: mode === 'view' ? 'rgba(0, 255, 136, 0.8)' : 'rgba(0, 212, 255, 0.5)',
          backgroundColor: mode === 'view' ? 'rgba(0, 255, 136, 0.1)' : 'transparent'
        }}
        transition={{ type: 'spring', stiffness: 150, damping: 15 }}
      >
        {mode === 'view' && (
          <span className="text-[8px] font-orbitron font-bold text-green-400 tracking-widest">SCAN</span>
        )}
      </motion.div>
    </>
  );
};

// --- 3D TILT CARD ---
const TiltCard = ({ children, className }) => {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const rotateX = useTransform(y, [-0.5, 0.5], [15, -15]);
  const rotateY = useTransform(x, [-0.5, 0.5], [-15, 15]);
  
  const springConfig = { damping: 20, stiffness: 200 };
  const smoothX = useSpring(rotateX, springConfig);
  const smoothY = useSpring(rotateY, springConfig);

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX: smoothX, rotateY: smoothY, transformStyle: "preserve-3d" }}
      className={`cyber-card rounded-lg relative overflow-hidden group ${className}`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      <div className="relative z-10 h-full p-6 flex flex-col" style={{ transform: "translateZ(30px)" }}>
        {children}
      </div>
    </motion.div>
  );
};

// --- TERMINAL COMPONENT ---
const CyberTerminal = ({ onSubscribe }) => {
  const [logs, setLogs] = useState([]);
  const [input, setInput] = useState('');
  const endRef = useRef(null);

  const initialLogs = [
    "[SYSTEM] NEURAXIS OS v9.4.2 Boot Sequence Initiated...",
    "[SUCCESS] Secure connection established.",
    "[INFO] Type 'help' for available commands. Try '/subscribe' or '/contact'."
  ];

  useEffect(() => {
    let delay = 0;
    initialLogs.forEach((log, i) => {
      setTimeout(() => {
        setLogs(prev => [...prev, log]);
      }, delay);
      delay += 800 + Math.random() * 500;
    });
  }, []);

  useEffect(() => {
    if (endRef.current) {
      endRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  const handleCommand = (e) => {
    if (e.key === 'Enter' && input.trim()) {
      const cmd = input.trim().toLowerCase();
      setLogs(prev => [...prev, `> ${cmd}`]);
      setInput('');
      
      setTimeout(() => {
        let response = '';
        if (cmd === 'help') {
          response = "[HELP] Commands: /contact, /subscribe, status, clear";
        } else if (cmd === 'status') {
          response = "[STATUS] Bio-metrics: Nominal. Latency: 12ms. Core Temp: 34°C.";
        } else if (cmd === '/contact') {
          response = "[INFO] Contact protocols initiated. Routing to comms@neuraxis.tech...";
        } else if (cmd === '/subscribe') {
          response = "[ACTION] Opening waitlist application interface...";
          setTimeout(onSubscribe, 1000);
        } else if (cmd === 'clear') {
          setLogs([]);
          return;
        } else {
          response = `[ERROR] Unknown command '${cmd}'. Type 'help'.`;
        }
        setLogs(prev => [...prev, response]);
      }, 600);
    }
  };

  return (
    <div className="terminal-bg rounded-lg p-1 overflow-hidden font-cyber-mono text-sm shadow-2xl relative w-full max-w-2xl mx-auto h-80 flex flex-col">
      <div className="bg-cyan-950/40 border-b border-cyan-900/50 p-2 flex items-center justify-between text-cyan-500 text-xs uppercase tracking-widest">
        <div className="flex items-center gap-2">
          <Terminal size={14} />
          <span>System.Interface</span>
        </div>
        <div className="flex gap-1">
          <div className="w-2 h-2 rounded-full bg-red-500/80"></div>
          <div className="w-2 h-2 rounded-full bg-amber-500/80"></div>
          <div className="w-2 h-2 rounded-full bg-green-500/80"></div>
        </div>
      </div>
      <div className="p-4 overflow-y-auto flex-1 flex flex-col gap-1 text-cyan-300/80">
        {logs.map((log, i) => (
          <div key={i} className={`${log.includes('[ERROR]') ? 'text-red-400' : log.includes('[SUCCESS]') || log.includes('[ACTION]') ? 'text-green-400' : ''}`}>
            {log}
          </div>
        ))}
        <div className="flex items-center gap-2 mt-2">
          <span className="text-cyan-500">&gt;</span>
          <input 
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleCommand}
            className="bg-transparent border-none outline-none text-cyan-300/90 w-full font-cyber-mono focus:ring-0"
            spellCheck={false}
            autoComplete="off"
            autoFocus
          />
        </div>
        <div ref={endRef} />
      </div>
    </div>
  );
};

// --- WAITLIST MODAL ---
const WaitlistModal = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
        >
          <motion.div
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            className="bg-[#060d1a] border border-cyan-500/30 p-8 rounded-lg max-w-md w-full relative shadow-[0_0_40px_rgba(0,212,255,0.1)]"
          >
            <button onClick={onClose} className="absolute top-4 right-4 text-cyan-500 hover:text-white transition-colors interactive">
              <X size={20} />
            </button>
            <h2 className="font-orbitron text-2xl font-bold mb-2 text-white">Join the Waitlist</h2>
            <p className="font-inter text-sm text-gray-400 mb-6">Secure your priority access for the next generation of neural augmentation. Limited slots available for early adopters.</p>
            
            <form onSubmit={(e) => { e.preventDefault(); onClose(); }} className="flex flex-col gap-4">
              <div>
                <label className="font-cyber-mono text-xs text-cyan-500 block mb-1">IDENTIFICATION (EMAIL)</label>
                <input 
                  type="email" 
                  required
                  placeholder="subject@domain.com"
                  className="w-full bg-cyan-950/20 border border-cyan-500/20 p-3 text-white font-cyber-mono text-sm focus:outline-none focus:border-cyan-400 transition-colors rounded-sm"
                />
              </div>
              <button type="submit" className="interactive mt-2 w-full py-3 bg-cyan-500 text-black font-orbitron font-bold text-sm tracking-wider hover:bg-cyan-400 transition-colors rounded-sm flex items-center justify-center gap-2">
                <Lock size={16} /> SUBMIT APPLICATION
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// --- MAIN PAGE ---
export default function LandingPage() {
  const [stats, setStats] = useState({ load: 12, temp: 35, sync: 98 });
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setStats({
        load: Math.floor(10 + Math.random() * 25),
        temp: Math.floor(34 + Math.random() * 5),
        sync: Math.floor(95 + Math.random() * 5)
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const scrollToSection = (e, id) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen scanlines hex-grid relative selection:bg-cyan-500/30">
      <CustomCursor />
      <WaitlistModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      {/* Decorative Overlays */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-cyan-600/5 blur-[150px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[800px] h-[800px] rounded-full bg-purple-600/5 blur-[150px]" />
      </div>

      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 border-b border-cyan-500/10 bg-black/40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 interactive cursor-pointer" onClick={() => window.scrollTo({top:0, behavior:'smooth'})}>
            <motion.div 
              animate={{ rotate: 360 }} 
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              className="text-cyan-400"
            >
              <Zap className="w-6 h-6" />
            </motion.div>
            <span className="font-orbitron font-bold text-xl tracking-[0.2em] text-white">
              NEUR<span className="text-cyan-400">AXIS</span>
            </span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 font-cyber-mono text-sm tracking-widest text-gray-400">
            {['IMPLANTS', 'TECHNOLOGY', 'SYSTEMS'].map((item) => (
              <a 
                key={item} 
                href={`#${item.toLowerCase()}`} 
                onClick={(e) => scrollToSection(e, item.toLowerCase())}
                className="hover:text-cyan-400 transition-colors relative group interactive"
              >
                {item}
                <span className="absolute -bottom-2 left-0 w-full h-[1px] bg-cyan-400 scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
              </a>
            ))}
          </div>

          <button 
            onClick={() => setIsModalOpen(true)}
            className="interactive font-orbitron text-xs font-bold px-6 py-2.5 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 hover:border-cyan-400 transition-all shadow-[0_0_15px_rgba(0,212,255,0.1)] hover:shadow-[0_0_20px_rgba(0,212,255,0.3)] rounded-sm"
          >
            INITIATE LINK
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 pt-40 pb-20 px-6 max-w-7xl mx-auto flex flex-col items-center justify-center min-h-[90vh] text-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 border border-cyan-500/30 bg-cyan-950/20 text-cyan-400 font-cyber-mono text-xs uppercase tracking-widest mb-8 rounded-full"
        >
          <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          Enterprise Grade BCI Technology
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="font-orbitron font-black text-5xl md:text-7xl lg:text-8xl tracking-tighter mb-6 leading-tight uppercase"
        >
          Transcend <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 glitch" data-text="HUMANITY">
            HUMANITY
          </span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="max-w-2xl mx-auto text-gray-400 font-inter text-lg mb-12 leading-relaxed"
        >
          Pioneering the next evolution of cognitive and physical capabilities. Seamlessly integrate military-grade cybernetics with biological systems for unparalleled performance.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-6"
        >
          <button 
            onClick={() => setIsModalOpen(true)}
            className="interactive group relative px-8 py-4 bg-cyan-500 text-black font-orbitron font-bold text-sm tracking-wider overflow-hidden hover:scale-105 transition-transform flex items-center justify-center gap-2 rounded-sm"
          >
            <span className="relative z-10">APPLY FOR ACCESS</span>
            <ArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform" />
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform" />
          </button>
          
          <button 
            onClick={(e) => scrollToSection(e, 'systems')}
            className="interactive px-8 py-4 border border-gray-700 text-white font-orbitron font-bold text-sm tracking-wider hover:border-cyan-500/50 hover:bg-cyan-500/5 transition-all flex items-center justify-center gap-2 rounded-sm"
          >
            <Terminal className="w-4 h-4" />
            VIEW ARCHITECTURE
          </button>
        </motion.div>
      </main>

      {/* Ticker Tape */}
      <div className="border-y border-cyan-500/10 bg-black/60 py-3 relative z-10">
        <div className="ticker-wrap w-full font-cyber-mono text-cyan-400/80 text-xs tracking-widest uppercase flex items-center gap-8">
          <div className="ticker-track">
            {[...Array(10)].map((_, i) => (
              <span key={i} className="mx-8 flex items-center gap-4 whitespace-nowrap">
                <span>//</span>
                <span>SECURE LATTICE: ONLINE</span>
                <span>//</span>
                <span>FDA APPROVAL PENDING: CORTEX V2</span>
                <span>//</span>
                <span className="text-purple-400">ENCRYPTION: QUANTUM 256-BIT</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <section id="implants" className="py-24 px-6 max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-end mb-16">
          <div>
            <h2 className="font-orbitron font-bold text-3xl md:text-4xl mb-4 text-white uppercase tracking-tight">Enterprise Solutions</h2>
            <p className="font-cyber-mono text-gray-400 max-w-xl">State-of-the-art neuroprosthetics and sensory enhancements designed for high-performance operators.</p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <TiltCard className="view-trigger">
            <div className="bracket-corners absolute inset-0 m-4 pointer-events-none opacity-50" />
            <div className="mb-8 p-4 bg-cyan-500/10 w-fit rounded-sm border border-cyan-500/20">
              <Eye className="w-8 h-8 text-cyan-400" />
            </div>
            <h3 className="font-orbitron font-bold text-xl mb-2 text-white">Ocular HUD Framework</h3>
            <p className="font-inter text-sm text-gray-400 mb-6 flex-1">
              Direct-to-retina data streaming interface. Provides real-time environmental analysis, biometrics, and secure communications overlay.
            </p>
            <div className="border-t border-gray-800 pt-4 flex justify-between items-center font-cyber-mono text-xs">
              <span className="text-cyan-400">LATENCY: &lt;2ms</span>
              <span className="text-gray-500">OPTICAL</span>
            </div>
          </TiltCard>

          <TiltCard className="view-trigger">
            <div className="bracket-corners absolute inset-0 m-4 pointer-events-none opacity-50" />
            <div className="mb-8 p-4 bg-purple-500/10 w-fit rounded-sm border border-purple-500/20">
              <Cpu className="w-8 h-8 text-purple-400" />
            </div>
            <h3 className="font-orbitron font-bold text-xl mb-2 text-white">Neural Coprocessor</h3>
            <p className="font-inter text-sm text-gray-400 mb-6 flex-1">
              Implanted cognitive accelerator. Offloads complex calculations and drastically improves reaction times and memory retention.
            </p>
            <div className="border-t border-gray-800 pt-4 flex justify-between items-center font-cyber-mono text-xs">
              <span className="text-purple-400">INTEGRATION: 99.8%</span>
              <span className="text-gray-500">CORTEX</span>
            </div>
          </TiltCard>

          <TiltCard className="view-trigger">
            <div className="bracket-corners absolute inset-0 m-4 pointer-events-none opacity-50" />
            <div className="mb-8 p-4 bg-gray-500/10 w-fit rounded-sm border border-gray-500/20">
              <Fingerprint className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="font-orbitron font-bold text-xl mb-2 text-white">Biometric Encryption</h3>
            <p className="font-inter text-sm text-gray-400 mb-6 flex-1">
              Hardware-level cryptographic keys bound to your unique DNA signature. Impossible to spoof or extract without host consensus.
            </p>
            <div className="border-t border-gray-800 pt-4 flex justify-between items-center font-cyber-mono text-xs">
              <span className="text-gray-400">QUANTUM SECURE</span>
              <span className="text-gray-500">SECURITY</span>
            </div>
          </TiltCard>
        </div>
      </section>

      {/* Technology Architecture */}
      <section id="technology" className="py-24 px-6 relative z-10 bg-[#040914]/80 border-y border-cyan-500/10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-orbitron font-bold text-3xl md:text-4xl mb-4 text-white uppercase tracking-tight">Architecture</h2>
            <p className="font-cyber-mono text-gray-400 max-w-2xl mx-auto">Our proprietary stack ensures flawless communication between biological tissue and silicon microprocessors.</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center p-6 border border-gray-800 rounded-lg bg-black/40 hover:border-cyan-500/30 transition-colors">
              <Network className="w-10 h-10 text-cyan-400 mx-auto mb-4" />
              <h4 className="font-orbitron font-bold mb-2">Lattice Sync</h4>
              <p className="font-inter text-xs text-gray-500">Continuous cloud synchronization with end-to-end encryption for backup and updates.</p>
            </div>
            <div className="text-center p-6 border border-gray-800 rounded-lg bg-black/40 hover:border-purple-500/30 transition-colors">
              <Server className="w-10 h-10 text-purple-400 mx-auto mb-4" />
              <h4 className="font-orbitron font-bold mb-2">Edge Compute</h4>
              <p className="font-inter text-xs text-gray-500">On-device processing reduces latency to near-zero, crucial for combat and reflex scenarios.</p>
            </div>
            <div className="text-center p-6 border border-gray-800 rounded-lg bg-black/40 hover:border-green-500/30 transition-colors">
              <Activity className="w-10 h-10 text-green-400 mx-auto mb-4" />
              <h4 className="font-orbitron font-bold mb-2">Bio-feedback</h4>
              <p className="font-inter text-xs text-gray-500">Real-time monitoring of host vitals prevents hardware rejection and thermal overload.</p>
            </div>
            <div className="text-center p-6 border border-gray-800 rounded-lg bg-black/40 hover:border-red-500/30 transition-colors">
              <Lock className="w-10 h-10 text-red-400 mx-auto mb-4" />
              <h4 className="font-orbitron font-bold mb-2">Zero Trust</h4>
              <p className="font-inter text-xs text-gray-500">Hardware isolation guarantees that compromised networks cannot affect host implants.</p>
            </div>
          </div>
        </div>
      </section>

      {/* System Telemetry & Terminal */}
      <section id="systems" className="py-24 px-6 relative z-10 border-b border-cyan-500/10">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Left: Stats & Visuals */}
          <div>
            <h2 className="font-orbitron font-bold text-3xl mb-8 uppercase text-white">Live System Telemetry</h2>
            
            <div className="grid grid-cols-2 gap-4 mb-10">
              <div className="p-5 border border-cyan-500/20 bg-cyan-950/20 rounded-sm">
                <div className="font-cyber-mono text-gray-500 text-xs mb-2">NEURAL LOAD</div>
                <div className="font-orbitron text-3xl font-bold text-cyan-400">{stats.load}%</div>
              </div>
              <div className="p-5 border border-purple-500/20 bg-purple-950/20 rounded-sm">
                <div className="font-cyber-mono text-gray-500 text-xs mb-2">CORE TEMP</div>
                <div className="font-orbitron text-3xl font-bold text-purple-400">{stats.temp}°C</div>
              </div>
              <div className="p-5 border border-green-500/20 bg-green-950/20 rounded-sm col-span-2 flex justify-between items-center">
                <div>
                  <div className="font-cyber-mono text-gray-500 text-xs mb-2">BIOSYNC RATE</div>
                  <div className="font-orbitron text-3xl font-bold text-green-400">{stats.sync}%</div>
                </div>
                <Activity className="text-green-400 w-8 h-8 opacity-50" />
              </div>
            </div>

            <p className="font-inter text-sm text-gray-400 leading-relaxed mb-6">
              Interact with the live system console to test connectivity. Use commands like <code className="text-cyan-400">/subscribe</code> or <code className="text-cyan-400">status</code> to interface with the demonstration API.
            </p>
          </div>

          {/* Right: Terminal */}
          <div className="relative">
            <div className="absolute inset-0 bg-cyan-500/5 blur-3xl -z-10" />
            <div className="absolute -inset-4 border border-cyan-500/10 rounded-xl -z-10" />
            <CyberTerminal onSubscribe={() => setIsModalOpen(true)} />
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black py-12 px-6 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2 text-cyan-500/70 cursor-pointer interactive" onClick={() => window.scrollTo({top:0, behavior:'smooth'})}>
            <Zap className="w-5 h-5" />
            <span className="font-orbitron font-bold tracking-widest text-sm">NEURAXIS</span>
          </div>
          
          <div className="font-cyber-mono text-xs text-gray-500 flex gap-6">
            <a href="#" className="hover:text-cyan-400 transition-colors">RESEARCH</a>
            <a href="#" className="hover:text-cyan-400 transition-colors">SECURITY</a>
            <a href="#" className="hover:text-cyan-400 transition-colors">CAREERS</a>
            <a href="#" className="hover:text-cyan-400 transition-colors">LEGAL</a>
          </div>

          <div className="font-cyber-mono text-xs text-green-500/70 flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
            API STATUS: ONLINE
          </div>
        </div>
      </footer>
    </div>
  );
}
