"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Brain, Activity, Moon, BatteryWarning, CheckCircle, XCircle, LineChart, Zap, ListTodo } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState, useEffect } from "react";

const MOTIVATIONAL_LINES = [
  "BREAK THE CYCLE.",
  "RECLAIM YOUR FOCUS.",
  "MASTER YOUR DAYS.",
  "NO MORE EXCUSES.",
];

export function LandingPage() {
  const [quoteIndex, setQuoteIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % MOTIVATIONAL_LINES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const cardVariants = {
    hidden: { opacity: 0, y: 80, scale: 0.9, rotateX: 10 },
    visible: { opacity: 1, y: 0, scale: 1, rotateX: 0, transition: { type: "spring" as const, stiffness: 100, damping: 20 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] font-sans text-slate-900 selection:bg-amber-400 selection:text-slate-900 overflow-x-hidden relative">
      
      {/* MASSIVE Scrolling Background Text */}
      <div className="fixed inset-0 overflow-hidden flex items-center justify-center pointer-events-none z-0 opacity-[0.03]">
        <AnimatePresence mode="wait">
          <motion.h1
            key={quoteIndex}
            initial={{ opacity: 0, scale: 0.9, x: '20vw' }}
            animate={{ opacity: 1, scale: 1, x: '-20vw' }}
            exit={{ opacity: 0, scale: 1.1, x: '-40vw' }}
            transition={{ duration: 5, ease: "linear" }}
            className="text-[15vw] font-black tracking-tighter text-slate-900 whitespace-nowrap"
          >
            {MOTIVATIONAL_LINES[quoteIndex]}
          </motion.h1>
        </AnimatePresence>
      </div>

      {/* Soft Animated Background Orbs */}
      <motion.div 
        animate={{ 
          x: ["-5vw", "10vw", "-5vw"], 
          y: ["-10vh", "10vh", "-10vh"],
          scale: [1, 1.2, 1],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        className="fixed top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-[40%_60%_70%_30%] bg-amber-300/30 blur-[120px] pointer-events-none z-0 mix-blend-multiply" 
      />
      <motion.div 
        animate={{ 
          x: ["10vw", "-5vw", "10vw"], 
          y: ["10vh", "-10vh", "10vh"],
          scale: [1.2, 1, 1.2],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        className="fixed bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-[60%_40%_30%_70%] bg-rose-300/30 blur-[120px] pointer-events-none z-0 mix-blend-multiply" 
      />
      <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.05] pointer-events-none z-0"></div>

      {/* Premium Seamless Navigation */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 md:px-12 py-8 bg-transparent pointer-events-auto mix-blend-multiply"
      >
        <div className="flex items-center gap-4 font-black text-3xl tracking-tighter z-10 text-slate-900">
          <motion.div whileHover={{ rotate: 15, scale: 1.1 }} transition={{ type: "spring" }}>
            <Brain className="w-10 h-10 text-amber-500" />
          </motion.div>
          <span>FixMe</span>
        </div>
        <div className="flex items-center gap-6 z-10">
          <Link href="/login">
            <Button variant="ghost" className="text-slate-600 font-bold hover:bg-slate-200/50 hover:text-slate-900 text-lg px-6 rounded-full transition-colors">Log in</Button>
          </Link>
          <Link href="/signup">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button className="bg-slate-900 text-white hover:bg-slate-800 rounded-full px-10 py-7 text-lg font-bold shadow-[0_10px_20px_rgba(0,0,0,0.1)] border-2 border-slate-800">
                Get Started
              </Button>
            </motion.div>
          </Link>
        </div>
      </motion.nav>

      {/* Main Content */}
      <main className="relative z-10 pt-48">
        
        {/* HERO SECTION */}
        <section className="pb-40 px-6 flex flex-col items-center text-center max-w-5xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: -20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-white/60 backdrop-blur-xl border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] text-slate-700 text-sm font-bold mb-12 uppercase tracking-widest"
          >
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse ring-4 ring-rose-500/20" />
            Your Personal Operating System
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 50, rotateX: -20 }} 
            animate={{ opacity: 1, y: 0, rotateX: 0 }} 
            transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.2 }}
            className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-[1.05] text-slate-900 drop-shadow-sm"
          >
            Stop guessing. <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-500">Start mastering.</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, type: "spring" }}
            className="text-2xl text-slate-600 font-medium max-w-3xl mx-auto leading-relaxed mb-16"
          >
            Don&apos;t just track bad habits. Decode them. FixMe uses AI to uncover the hidden triggers sabotaging your days and generates precise micro-experiments to fix them.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.6, type: "spring" }}
          >
            <Link href="/signup">
              <motion.button 
                whileHover={{ scale: 1.05, boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)" }} 
                whileTap={{ scale: 0.95 }}
                className="px-12 py-6 bg-slate-900 text-white rounded-[2.5rem] text-2xl font-black transition-all border border-slate-700 flex items-center gap-4 group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-rose-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="relative z-10">Initialize Reboot</span>
                <ArrowRight className="w-8 h-8 group-hover:translate-x-2 transition-transform relative z-10" />
              </motion.button>
            </Link>
          </motion.div>
        </section>

        {/* STORY SECTIONS */}
        <div className="max-w-6xl mx-auto px-6 space-y-48 pb-48">
          
          {/* SECTION 1: The Input */}
          <motion.section 
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={cardVariants}
            className="flex flex-col md:flex-row items-center gap-16"
          >
            <div className="flex-1 space-y-8">
              <div className="w-20 h-20 bg-gradient-to-br from-amber-100 to-amber-50 rounded-3xl flex items-center justify-center border border-amber-200 shadow-[0_20px_40px_rgba(251,191,36,0.15)] ring-8 ring-amber-50/50">
                <ListTodo className="w-10 h-10 text-amber-600" />
              </div>
              <h2 className="text-5xl md:text-6xl font-black tracking-tighter text-slate-900 leading-tight">Zero friction logging.</h2>
              <p className="text-2xl text-slate-600 font-medium leading-relaxed">
                Forget complex forms and guilt-tripping habit streaks. Just brain-dump what derailed you today. We handle the heavy lifting.
              </p>
            </div>
            
            <div className="flex-1 w-full relative">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-400/20 to-rose-400/20 blur-3xl -z-10 rounded-full" />
              <motion.div whileHover={{ scale: 1.02, rotateZ: -1 }} className="bg-white/60 backdrop-blur-2xl border border-white/80 rounded-[3rem] p-10 shadow-[0_40px_80px_rgba(0,0,0,0.07)] transform rotate-2 transition-all relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 to-rose-400" />
                <div className="flex items-center justify-between mb-8">
                  <span className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /> Raw Input
                  </span>
                </div>
                <div className="space-y-6">
                  <div className="p-8 bg-white/80 rounded-[2rem] border border-slate-100 shadow-sm">
                    <p className="text-slate-800 font-medium leading-relaxed text-xl italic text-slate-600">&quot;Missed the gym again. Hit the snooze button four times and felt completely drained all morning.&quot;</p>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-1 bg-gradient-to-br from-rose-50 to-white text-rose-600 py-4 rounded-2xl flex items-center justify-center gap-3 text-lg font-bold border border-rose-100 shadow-sm">
                      <BatteryWarning className="w-6 h-6" />
                      Low Energy
                    </div>
                    <div className="flex-1 bg-gradient-to-br from-indigo-50 to-white text-indigo-600 py-4 rounded-2xl flex items-center justify-center gap-3 text-lg font-bold border border-indigo-100 shadow-sm">
                      <Moon className="w-6 h-6" />
                      Poor Sleep
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.section>

          {/* SECTION 2: The Insight */}
          <motion.section 
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={cardVariants}
            className="flex flex-col md:flex-row-reverse items-center gap-16"
          >
            <div className="flex-1 space-y-8">
              <div className="w-20 h-20 bg-gradient-to-br from-rose-100 to-rose-50 rounded-3xl flex items-center justify-center border border-rose-200 shadow-[0_20px_40px_rgba(244,63,94,0.15)] ring-8 ring-rose-50/50">
                <LineChart className="w-10 h-10 text-rose-600" />
              </div>
              <h2 className="text-5xl md:text-6xl font-black tracking-tighter text-slate-900 leading-tight">Expose the root cause.</h2>
              <p className="text-2xl text-slate-600 font-medium leading-relaxed">
                Our AI engine synthesizes your logs to expose the invisible correlations that trigger your worst days. Stop fighting symptoms.
              </p>
            </div>
            
            <div className="flex-1 w-full relative">
              <div className="absolute inset-0 bg-gradient-to-br from-rose-400/20 to-indigo-400/20 blur-3xl -z-10 rounded-full" />
              <motion.div whileHover={{ scale: 1.02, rotateZ: 1 }} className="bg-slate-900 rounded-[3rem] p-10 shadow-[0_40px_80px_rgba(0,0,0,0.25)] transform -rotate-2 transition-all relative overflow-hidden border border-slate-700">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-rose-500/10 to-indigo-500/10 blur-2xl" />
                <div className="relative z-10">
                  <div className="flex items-center gap-6 mb-10">
                    <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 backdrop-blur-xl shadow-inner">
                      <Activity className="w-8 h-8 text-rose-400" />
                    </div>
                    <div>
                      <h3 className="font-black text-2xl tracking-tighter text-white">Critical Insight</h3>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-amber-300 text-xs font-bold uppercase tracking-widest bg-amber-500/10 px-2 py-1 rounded-md border border-amber-500/20">Workout</span>
                        <span className="text-white/30 text-xs">correlated with</span>
                        <span className="text-indigo-300 text-xs font-bold uppercase tracking-widest bg-indigo-500/10 px-2 py-1 rounded-md border border-indigo-500/20">Screen Time</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-3xl font-bold leading-tight tracking-tight text-white mb-8">
                    You skip your morning workout <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-amber-400">85% of the time</span> when you use your phone past midnight.
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.section>

          {/* SECTION 3: The Fix */}
          <motion.section 
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={cardVariants}
            className="flex flex-col items-center text-center max-w-5xl mx-auto"
          >
            <div className="w-24 h-24 bg-gradient-to-br from-emerald-100 to-emerald-50 rounded-[2.5rem] flex items-center justify-center mb-10 border border-emerald-200 shadow-[0_20px_40px_rgba(16,185,129,0.15)] ring-8 ring-emerald-50/50">
              <Zap className="w-12 h-12 text-emerald-600 fill-emerald-600" />
            </div>
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-8 text-slate-900 leading-tight">
              Action. Not anxiety.
            </h2>
            <p className="text-2xl text-slate-600 font-medium mb-20 leading-relaxed max-w-4xl mx-auto">
              Awareness without action is just anxiety. FixMe prescribes hyper-specific, 3-day micro-experiments designed to break your destructive loops without relying on willpower.
            </p>
            
            <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid md:grid-cols-3 gap-8 w-full text-left">
              <motion.div variants={cardVariants} whileHover={{ y: -10, scale: 1.02 }} className="bg-white/60 backdrop-blur-2xl border border-white/80 rounded-[2.5rem] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.06)] transition-all relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-1 bg-amber-400 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center shadow-inner">
                    <Moon className="w-7 h-7 text-amber-600" />
                  </div>
                  <h4 className="font-black text-slate-900 text-xl tracking-tight">Experiment Alpha</h4>
                </div>
                <p className="text-slate-800 font-bold text-xl leading-relaxed mb-8">Ban your phone from the bedroom entirely after 11:30 PM.</p>
                <div className="bg-white/80 p-6 rounded-2xl border border-slate-100 shadow-sm relative z-10">
                  <span className="text-xs font-black text-amber-600 uppercase tracking-widest block mb-2">The Architecture</span>
                  <span className="text-[15px] font-medium text-slate-600 leading-relaxed">Sever the late-night dopamine loop to drastically improve baseline morning energy.</span>
                </div>
              </motion.div>

              <motion.div variants={cardVariants} whileHover={{ y: -10, scale: 1.02 }} className="bg-white/60 backdrop-blur-2xl border border-white/80 rounded-[2.5rem] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.06)] transition-all md:translate-y-8 relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-1 bg-indigo-400 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center shadow-inner">
                    <Activity className="w-7 h-7 text-indigo-600" />
                  </div>
                  <h4 className="font-black text-slate-900 text-xl tracking-tight">Experiment Beta</h4>
                </div>
                <p className="text-slate-800 font-bold text-xl leading-relaxed mb-8">Place your packed gym bag literally blocking your front door.</p>
                <div className="bg-white/80 p-6 rounded-2xl border border-slate-100 shadow-sm relative z-10">
                  <span className="text-xs font-black text-indigo-600 uppercase tracking-widest block mb-2">The Architecture</span>
                  <span className="text-[15px] font-medium text-slate-600 leading-relaxed">Eliminate morning friction points. You fail when you have to think, so remove the choice.</span>
                </div>
              </motion.div>

              <motion.div variants={cardVariants} whileHover={{ y: -10, scale: 1.02 }} className="bg-white/60 backdrop-blur-2xl border border-white/80 rounded-[2.5rem] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.06)] transition-all md:translate-y-16 relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-1 bg-emerald-400 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center shadow-inner">
                    <Brain className="w-7 h-7 text-emerald-600" />
                  </div>
                  <h4 className="font-black text-slate-900 text-xl tracking-tight">Experiment Gamma</h4>
                </div>
                <p className="text-slate-800 font-bold text-xl leading-relaxed mb-8">Consume 500ml of water within 60 seconds of waking.</p>
                <div className="bg-white/80 p-6 rounded-2xl border border-slate-100 shadow-sm relative z-10">
                  <span className="text-xs font-black text-emerald-600 uppercase tracking-widest block mb-2">The Architecture</span>
                  <span className="text-[15px] font-medium text-slate-600 leading-relaxed">Instantly shock your nervous system to counter the brain fog reported 4x this week.</span>
                </div>
              </motion.div>
            </motion.div>
          </motion.section>
        </div>

        {/* SECTION 4: Who is this for? */}
        <section className="py-40 px-6 relative z-10">
          <div className="max-w-6xl mx-auto relative z-10">
            <motion.div 
              initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={cardVariants}
              className="mb-24 md:w-2/3"
            >
              <h2 className="text-5xl md:text-6xl font-black tracking-tighter mb-8 text-slate-900 leading-tight">Who needs FixMe?</h2>
              <p className="text-2xl text-slate-600 font-medium leading-relaxed">
                If traditional planners make you feel inadequate and habit streaks only breed anxiety, this is your escape hatch.
              </p>
            </motion.div>
            
            <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid md:grid-cols-2 gap-12">
              <motion.div variants={cardVariants} whileHover={{ scale: 1.02 }} className="bg-white/60 backdrop-blur-2xl rounded-[3rem] p-12 border border-white/80 shadow-[0_30px_60px_rgba(0,0,0,0.05)] transition-all relative overflow-hidden group">
                <div className="absolute -right-20 -top-20 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl group-hover:bg-amber-400/20 transition-colors duration-500" />
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-50 to-white flex items-center justify-center mb-10 border border-amber-200 shadow-sm relative z-10">
                  <Brain className="w-8 h-8 text-amber-600" />
                </div>
                <h3 className="text-4xl font-black mb-6 text-slate-900 tracking-tighter relative z-10">The Ambitious Procrastinator</h3>
                <p className="text-slate-600 leading-relaxed font-medium mb-10 text-xl relative z-10">
                  You know exactly what you should be doing, yet you are paralyzed. You don&apos;t lack discipline; you lack visibility into the underlying triggers—like hidden fatigue or overwhelm—forcing you into avoidance.
                </p>
                <div className="space-y-4 relative z-10">
                  <div className="flex items-center gap-4 text-lg text-slate-800 font-bold bg-white/80 p-6 rounded-2xl border border-slate-100 shadow-sm">
                    <CheckCircle className="w-6 h-6 text-amber-500" />
                    Decodes the real reasons you avoid work
                  </div>
                </div>
              </motion.div>

              <motion.div variants={cardVariants} whileHover={{ scale: 1.02 }} className="bg-white/60 backdrop-blur-2xl rounded-[3rem] p-12 border border-white/80 shadow-[0_30px_60px_rgba(0,0,0,0.05)] transition-all relative overflow-hidden group">
                <div className="absolute -right-20 -top-20 w-64 h-64 bg-rose-400/10 rounded-full blur-3xl group-hover:bg-rose-400/20 transition-colors duration-500" />
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-50 to-white flex items-center justify-center mb-10 border border-rose-200 shadow-sm relative z-10">
                  <Activity className="w-8 h-8 text-rose-600" />
                </div>
                <h3 className="text-4xl font-black mb-6 text-slate-900 tracking-tighter relative z-10">The Burnt-Out Achiever</h3>
                <p className="text-slate-600 leading-relaxed font-medium mb-10 text-xl relative z-10">
                  You sprint until you completely shatter. You require a system that detects the subtle microscopic cracks in your routine—slight sleep deficits, mood drops—long before the inevitable crash occurs.
                </p>
                <div className="space-y-4 relative z-10">
                  <div className="flex items-center gap-4 text-lg text-slate-800 font-bold bg-white/80 p-6 rounded-2xl border border-slate-100 shadow-sm">
                    <CheckCircle className="w-6 h-6 text-rose-500" />
                    Prescribes proactive recovery protocols
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* SECTION 5: Comparison */}
        <section className="py-40 px-6">
          <div className="max-w-5xl mx-auto text-center">
            <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={cardVariants} className="text-5xl md:text-7xl font-black tracking-tighter mb-20 text-slate-900">
              The Matrix vs. Reality
            </motion.h2>
            
            <div className="grid md:grid-cols-2 gap-8 text-left">
              <motion.div initial={{ opacity: 0, x: -50, rotateY: 10 }} whileInView={{ opacity: 1, x: 0, rotateY: 0 }} viewport={{ once: true }} transition={{ type: "spring", stiffness: 100 }} className="bg-white/40 p-12 rounded-[3rem] border border-white/60 shadow-[0_20px_40px_rgba(0,0,0,0.03)] backdrop-blur-xl">
                <h3 className="font-black text-slate-400 mb-10 uppercase tracking-widest text-lg flex items-center gap-3">
                  <span className="w-3 h-3 rounded-full bg-slate-300" /> Legacy Trackers
                </h3>
                <ul className="space-y-8">
                  <li className="flex items-start gap-6">
                    <XCircle className="w-8 h-8 text-slate-300 shrink-0 mt-1" />
                    <span className="text-slate-500 font-medium text-xl leading-relaxed">Makes you feel intensely guilty when you break an arbitrary streak.</span>
                  </li>
                  <li className="flex items-start gap-6">
                    <XCircle className="w-8 h-8 text-slate-300 shrink-0 mt-1" />
                    <span className="text-slate-500 font-medium text-xl leading-relaxed">Forces you to manually check off 15 different micro-habits daily.</span>
                  </li>
                  <li className="flex items-start gap-6">
                    <XCircle className="w-8 h-8 text-slate-300 shrink-0 mt-1" />
                    <span className="text-slate-500 font-medium text-xl leading-relaxed">Tells you <span className="italic">what</span> you missed, but never explains <span className="italic">why</span>.</span>
                  </li>
                </ul>
              </motion.div>
              
              <motion.div initial={{ opacity: 0, x: 50, rotateY: -10 }} whileInView={{ opacity: 1, x: 0, rotateY: 0 }} viewport={{ once: true }} transition={{ type: "spring", stiffness: 100 }} className="bg-slate-900 p-12 rounded-[3rem] shadow-[0_40px_80px_rgba(0,0,0,0.2)] relative overflow-hidden group border border-slate-700">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-transparent to-rose-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <h3 className="font-black text-white mb-10 uppercase tracking-widest text-lg relative z-10 flex items-center gap-3">
                  <span className="w-3 h-3 rounded-full bg-amber-500 animate-pulse shadow-[0_0_10px_rgba(245,158,11,0.8)]" /> FixMe OS
                </h3>
                <ul className="space-y-8 relative z-10">
                  <li className="flex items-start gap-6">
                    <CheckCircle className="w-8 h-8 text-amber-400 shrink-0 mt-1" />
                    <span className="text-slate-200 font-medium text-xl leading-relaxed">Log your struggles in plain English. The AI does the heavy analytical lifting.</span>
                  </li>
                  <li className="flex items-start gap-6">
                    <CheckCircle className="w-8 h-8 text-amber-400 shrink-0 mt-1" />
                    <span className="text-slate-200 font-medium text-xl leading-relaxed">Exposes the deeply hidden correlations destroying your productivity.</span>
                  </li>
                  <li className="flex items-start gap-6">
                    <CheckCircle className="w-8 h-8 text-amber-400 shrink-0 mt-1" />
                    <span className="text-slate-200 font-medium text-xl leading-relaxed">Generates highly targeted micro-experiments to fundamentally rewrite your code.</span>
                  </li>
                </ul>
              </motion.div>
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="py-16 px-6 border-t border-white/40 bg-white/40 backdrop-blur-xl relative z-10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3 font-black text-2xl tracking-tighter text-slate-900">
            <Brain className="w-8 h-8 text-amber-500" />
            <span>FixMe</span>
          </div>
          <div className="text-slate-500 text-lg font-bold">
            © {new Date().getFullYear()} FixMe OS. Built for self-improvement.
          </div>
        </div>
      </footer>
    </div>
  );
}
