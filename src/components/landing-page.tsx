"use client";

import { motion } from "framer-motion";
import { ArrowRight, Brain, Activity, Moon, BatteryWarning, CheckCircle, XCircle, LineChart, Zap, ListTodo } from "lucide-react";
import { Button } from "@/components/ui/button";

export function LandingPage() {
  const fadeUpVariant = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  return (
    <div className="bg-[#FAFAFA] min-h-screen font-sans text-slate-900 selection:bg-slate-800 selection:text-white overflow-x-hidden">
      
      {/* Background ambient noise/gradient */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-slate-200/40 blur-[120px]" />
        <div className="absolute bottom-[20%] right-[-10%] w-[30%] h-[40%] rounded-full bg-blue-100/30 blur-[100px]" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-6 bg-[#FAFAFA]/70 backdrop-blur-xl border-b border-slate-200/50">
        <div className="flex items-center gap-2 font-bold text-xl tracking-tight z-10">
          <Brain className="w-6 h-6 text-slate-800" />
          <span>FixMe</span>
        </div>
        <div className="flex items-center gap-4 z-10">
          <Button variant="ghost" className="text-slate-600 font-medium hover:bg-slate-200/50">Log in</Button>
          <Button className="bg-slate-900 text-white hover:bg-slate-800 rounded-full px-6 font-medium shadow-sm">Get Started</Button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10">
        
        {/* HERO SECTION */}
        <section className="pt-48 pb-32 px-6 flex flex-col items-center text-center max-w-4xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm text-slate-600 text-sm font-semibold mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-slate-800 animate-pulse" />
            Not just another habit tracker
          </motion.div>
          
          <motion.h1 
            initial="hidden" animate="visible" variants={fadeUpVariant}
            className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-[1.1] text-slate-900"
          >
            Understand why your <br/><span className="text-slate-400">days go wrong.</span>
          </motion.h1>
          
          <motion.p 
            initial="hidden" animate="visible" variants={fadeUpVariant}
            className="text-xl text-slate-500 font-medium max-w-xl mx-auto leading-relaxed mb-16"
          >
            Log daily struggles. Find hidden patterns. Fix recurring problems with AI-powered insights.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 1 }}
            className="text-sm text-slate-400 font-semibold flex flex-col items-center gap-4 uppercase tracking-widest"
          >
            <span>Scroll down</span>
            <motion.div 
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              className="w-px h-16 bg-gradient-to-b from-slate-300 to-transparent"
            />
          </motion.div>
        </section>

        {/* STORY SECTIONS */}
        <div className="max-w-6xl mx-auto px-6 space-y-48 pb-48">
          
          {/* SECTION 1: The Input */}
          <motion.section 
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUpVariant}
            className="flex flex-col md:flex-row items-center gap-16"
          >
            <div className="flex-1 space-y-6">
              <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900">It starts with a simple log.</h2>
              <p className="text-lg text-slate-500 font-medium leading-relaxed">
                No complex forms or tedious tracking. Just tell us what went wrong today in plain English.
              </p>
            </div>
            
            <div className="flex-1 w-full max-w-md">
              <div className="bg-white/80 backdrop-blur-2xl border border-slate-200/60 rounded-[2rem] p-8 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.08)] transform rotate-1 hover:rotate-0 transition-transform ring-1 ring-slate-900/5">
                <div className="flex items-center justify-between mb-6">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Today's Check-in</span>
                </div>
                <div className="space-y-4">
                  <div className="p-5 bg-slate-50/80 rounded-2xl border border-slate-100 shadow-inner">
                    <p className="text-slate-800 font-medium leading-relaxed text-[15px]">"Missed the gym again today. Felt completely drained and couldn't focus."</p>
                  </div>
                  <div className="flex gap-3">
                    <div className="flex-1 bg-red-50/50 text-red-600 py-3 rounded-xl flex items-center justify-center gap-2 text-sm font-semibold border border-red-100/50 shadow-sm transition-colors hover:bg-red-50">
                      <BatteryWarning className="w-4 h-4" />
                      Low Energy
                    </div>
                    <div className="flex-1 bg-slate-100/50 text-slate-700 py-3 rounded-xl flex items-center justify-center gap-2 text-sm font-semibold border border-slate-200/50 shadow-sm transition-colors hover:bg-slate-100">
                      <Moon className="w-4 h-4" />
                      5h Sleep
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>

          {/* SECTION 2: The Insight */}
          <motion.section 
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUpVariant}
            className="flex flex-col md:flex-row-reverse items-center gap-16"
          >
            <div className="flex-1 space-y-6">
              <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900">We connect the dots.</h2>
              <p className="text-lg text-slate-500 font-medium leading-relaxed">
                Our AI analyzes your logs over time to find the hidden correlations sabotaging your days.
              </p>
            </div>
            
            <div className="flex-1 w-full max-w-lg group">
              {/* Premium Card with Animated Glow (Magic UI style) */}
              <div className="relative rounded-[2rem] p-[1px] overflow-hidden bg-gradient-to-b from-slate-800 to-slate-900 shadow-[0_40px_80px_-15px_rgba(0,0,0,0.5)] transform -rotate-1 group-hover:rotate-0 transition-transform duration-500">
                
                {/* Animated Conic Gradient Border effect */}
                <div className="absolute inset-[-100%] animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#000000_0%,#94a3b8_50%,#000000_100%)] opacity-30 group-hover:opacity-70 transition-opacity duration-500" />
                
                <div className="bg-[#09090b] text-white rounded-[calc(2rem-1px)] p-8 relative h-full w-full overflow-hidden">
                  
                  {/* Subtle Background Noise & Lighting */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120%] h-64 bg-slate-500/20 rounded-full blur-[80px] opacity-50 mix-blend-screen pointer-events-none" />

                  <div className="flex items-center gap-4 mb-8 relative z-10">
                    <div className="w-12 h-12 rounded-full bg-[#18181b] flex items-center justify-center border border-white/10 shadow-[0_0_15px_rgba(148,163,184,0.3)]">
                      <Activity className="w-5 h-5 text-slate-300" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg tracking-tight text-white/90">Weekly Pattern Detected</h3>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-slate-400/80 text-[11px] font-bold uppercase tracking-widest">Fitness</span>
                        <span className="text-white/20 text-[10px]">×</span>
                        <span className="text-slate-400/80 text-[11px] font-bold uppercase tracking-widest">Sleep</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-8 relative z-10">
                    <p className="text-[26px] font-medium leading-[1.3] tracking-tight text-white/90">
                      You skip the gym <span className="text-slate-300 font-semibold drop-shadow-[0_0_8px_rgba(148,163,184,0.5)]">85% of the time</span> when you sleep past midnight.
                    </p>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-[#18181b]/80 rounded-2xl p-4 border border-white/5 backdrop-blur-sm">
                        <span className="block text-white/40 text-xs font-semibold uppercase tracking-wider mb-1">Avg Energy</span>
                        <span className="text-2xl font-bold text-white/90">3.2<span className="text-white/40 text-sm">/10</span></span>
                      </div>
                      <div className="bg-[#18181b]/80 rounded-2xl p-4 border border-white/5 backdrop-blur-sm">
                        <span className="block text-white/40 text-xs font-semibold uppercase tracking-wider mb-1">Recovery</span>
                        <span className="text-2xl font-bold text-red-400 drop-shadow-[0_0_8px_rgba(248,113,113,0.3)]">-42%</span>
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-b from-white/[0.08] to-white/[0.02] rounded-2xl p-5 border border-white/[0.05] shadow-inner">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-[13px] font-semibold text-white/60 tracking-wide uppercase">Late Sleep Impact</span>
                        <span className="text-[13px] font-bold text-slate-300 bg-slate-500/10 px-2.5 py-1 rounded-full border border-slate-500/20 shadow-[0_0_10px_rgba(148,163,184,0.2)]">High Correlation</span>
                      </div>
                      
                      {/* Premium Sparkline / Progress */}
                      <div className="relative w-full h-1.5 bg-[#000000] rounded-full overflow-hidden shadow-inner">
                        <motion.div 
                          initial={{ width: 0 }}
                          whileInView={{ width: "85%" }}
                          transition={{ duration: 1.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                          className="absolute top-0 left-0 h-full rounded-full bg-gradient-to-r from-slate-600 via-slate-400 to-white"
                        >
                          {/* Glowing head of progress bar */}
                          <div className="absolute top-0 right-0 w-4 h-full bg-white blur-[2px]" />
                        </motion.div>
                      </div>
                      <div className="flex justify-between mt-2">
                        <span className="text-[11px] text-white/30 font-medium">0%</span>
                        <span className="text-[11px] text-white/30 font-medium">100%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>

          {/* SECTION 3: The Fix */}
          <motion.section 
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUpVariant}
            className="flex flex-col items-center text-center max-w-5xl mx-auto"
          >
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-8 border border-green-200/50 shadow-sm ring-4 ring-green-50/50">
              <ArrowRight className="w-10 h-10 text-green-600 -rotate-45" />
            </div>
            <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 text-slate-900">
              Take action.
            </h2>
            <p className="text-xl text-slate-500 font-medium mb-16 leading-relaxed max-w-3xl mx-auto">
              Knowledge alone isn't enough. Once FixMe identifies your negative patterns, it generates highly specific, 3-to-5 day micro-experiments designed to break the cycle without overwhelming your willpower.
            </p>
            
            <div className="grid md:grid-cols-3 gap-6 w-full text-left">
              <div className="bg-white/80 backdrop-blur-2xl border border-slate-200/60 rounded-3xl p-6 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] hover:shadow-xl hover:-translate-y-2 transition-all duration-500 ring-1 ring-slate-900/5">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-full bg-amber-50 border border-amber-100 flex items-center justify-center shadow-inner">
                    <Zap className="w-5 h-5 text-amber-500 fill-amber-500" />
                  </div>
                  <h4 className="font-bold text-slate-900 text-lg tracking-tight">Experiment #1</h4>
                </div>
                <p className="text-slate-800 font-semibold text-[16px] leading-relaxed mb-6">No phone in bed after 11:30 PM for the next 5 days.</p>
                <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-100 shadow-inner">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">The Strategy</span>
                  <span className="text-sm font-medium text-slate-600 leading-relaxed">Break the late-night doomscrolling cycle to improve next-day baseline energy.</span>
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-2xl border border-slate-200/60 rounded-3xl p-6 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] hover:shadow-xl hover:-translate-y-2 transition-all duration-500 ring-1 ring-slate-900/5 md:translate-y-8">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center shadow-inner">
                    <Activity className="w-5 h-5 text-blue-500" />
                  </div>
                  <h4 className="font-bold text-slate-900 text-lg tracking-tight">Experiment #2</h4>
                </div>
                <p className="text-slate-800 font-semibold text-[16px] leading-relaxed mb-6">Pack your gym bag and leave it by the door before 9 PM.</p>
                <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-100 shadow-inner">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">The Strategy</span>
                  <span className="text-sm font-medium text-slate-600 leading-relaxed">Remove morning friction. Data shows you skip workouts mostly when feeling rushed.</span>
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-2xl border border-slate-200/60 rounded-3xl p-6 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] hover:shadow-xl hover:-translate-y-2 transition-all duration-500 ring-1 ring-slate-900/5 md:translate-y-16">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center shadow-inner">
                    <Brain className="w-5 h-5 text-emerald-500" />
                  </div>
                  <h4 className="font-bold text-slate-900 text-lg tracking-tight">Experiment #3</h4>
                </div>
                <p className="text-slate-800 font-semibold text-[16px] leading-relaxed mb-6">Drink 500ml of water immediately upon waking up.</p>
                <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-100 shadow-inner">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">The Strategy</span>
                  <span className="text-sm font-medium text-slate-600 leading-relaxed">Counteract morning brain fog, which you reported 3 times this week.</span>
                </div>
              </div>
            </div>
          </motion.section>

        </div>

        {/* NEW SECTION: Who is this for? */}
        <section className="py-32 px-6 bg-slate-900 text-white relative overflow-hidden border-y border-slate-800">
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-slate-500/10 rounded-full blur-[120px] pointer-events-none translate-x-1/3 -translate-y-1/3" />
          <div className="max-w-6xl mx-auto relative z-10">
            <div className="mb-20 md:w-2/3">
              <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">Who is FixMe built for?</h2>
              <p className="text-xl text-slate-400 font-medium leading-relaxed">
                If traditional habit trackers make you feel guilty and productivity apps just add to your to-do list, FixMe is for you. We focus on diagnosing the root cause, not just treating the symptoms.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUpVariant} className="bg-white/5 border border-white/10 rounded-3xl p-10 backdrop-blur-sm hover:bg-white/10 transition-colors duration-500">
                <div className="w-12 h-12 rounded-xl bg-slate-500/20 flex items-center justify-center mb-6 border border-slate-500/30">
                  <Brain className="w-6 h-6 text-slate-400" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white">The Chronic Procrastinator</h3>
                <p className="text-slate-400 leading-relaxed font-medium mb-8 text-[15px]">
                  You know what you need to do, but you just can't get yourself to do it. You don't need a louder alarm clock; you need to understand the underlying anxiety or fatigue triggering the avoidance.
                </p>
                <ul className="space-y-4">
                  <li className="flex items-center gap-3 text-sm text-slate-300 font-medium bg-white/5 p-3 rounded-lg border border-white/5"><CheckCircle className="w-4 h-4 text-slate-400" /> Identifies hidden avoidance triggers</li>
                  <li className="flex items-center gap-3 text-sm text-slate-300 font-medium bg-white/5 p-3 rounded-lg border border-white/5"><CheckCircle className="w-4 h-4 text-slate-400" /> Suggests low-friction starting steps</li>
                </ul>
              </motion.div>

              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ delay: 0.2 }} variants={fadeUpVariant} className="bg-white/5 border border-white/10 rounded-3xl p-10 backdrop-blur-sm hover:bg-white/10 transition-colors duration-500">
                <div className="w-12 h-12 rounded-xl bg-rose-500/20 flex items-center justify-center mb-6 border border-rose-500/30">
                  <Activity className="w-6 h-6 text-rose-400" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white">The Burnt-Out High Achiever</h3>
                <p className="text-slate-400 leading-relaxed font-medium mb-8 text-[15px]">
                  You push yourself too hard and inevitably crash. You need a system that detects the early warning signs of burnout—like subtle shifts in your sleep or mood—before you hit the wall completely.
                </p>
                <ul className="space-y-4">
                  <li className="flex items-center gap-3 text-sm text-slate-300 font-medium bg-white/5 p-3 rounded-lg border border-white/5"><CheckCircle className="w-4 h-4 text-rose-400" /> Correlates workload with energy crashes</li>
                  <li className="flex items-center gap-3 text-sm text-slate-300 font-medium bg-white/5 p-3 rounded-lg border border-white/5"><CheckCircle className="w-4 h-4 text-rose-400" /> Enforces proactive recovery experiments</li>
                </ul>
              </motion.div>
            </div>
          </div>
        </section>

        {/* STATIC CONTENT: Features Grid */}
        <section className="py-32 px-6 bg-white border-y border-slate-200/60">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-4xl font-extrabold tracking-tight mb-4 text-slate-900">Designed for self-awareness.</h2>
              <p className="text-lg text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed">Standard habit trackers only tell you what you did. FixMe tells you why you did it.</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUpVariant} className="bg-slate-50/80 p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm border border-slate-200/60 mb-6">
                  <ListTodo className="w-6 h-6 text-slate-700" />
                </div>
                <h3 className="text-xl font-bold mb-3 tracking-tight text-slate-900">Frictionless Logging</h3>
                <p className="text-slate-600 leading-relaxed font-medium text-[15px]">Just type what went wrong. Our AI extracts the mood, energy levels, and categorizes the problem instantly.</p>
              </motion.div>
              
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ delay: 0.2 }} variants={fadeUpVariant} className="bg-slate-50/80 p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm border border-slate-200/60 mb-6">
                  <LineChart className="w-6 h-6 text-slate-700" />
                </div>
                <h3 className="text-xl font-bold mb-3 tracking-tight text-slate-900">Hidden Correlations</h3>
                <p className="text-slate-600 leading-relaxed font-medium text-[15px]">Discover that your procrastination on Tuesdays is actually linked to your sleep schedule on Mondays.</p>
              </motion.div>

              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ delay: 0.4 }} variants={fadeUpVariant} className="bg-slate-50/80 p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm border border-slate-200/60 mb-6">
                  <Brain className="w-6 h-6 text-slate-700" />
                </div>
                <h3 className="text-xl font-bold mb-3 tracking-tight text-slate-900">Smart Experiments</h3>
                <p className="text-slate-600 leading-relaxed font-medium text-[15px]">Stop making generic goals. Get personalized, 3-day micro-experiments designed specifically for your habits.</p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* STATIC CONTENT: Comparison */}
        <section className="py-32 px-6 bg-[#FAFAFA]">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-extrabold tracking-tight mb-16 text-slate-900">The old way vs. The FixMe way</h2>
            
            <div className="grid md:grid-cols-2 gap-8 text-left">
              <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="bg-white/60 p-8 rounded-3xl border border-slate-200/60 opacity-80 backdrop-blur-sm">
                <h3 className="font-bold text-slate-400 mb-6 uppercase tracking-widest text-sm">Other Apps</h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <XCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                    <span className="text-slate-600 font-medium">"You missed the gym today."</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <XCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                    <span className="text-slate-600 font-medium">Forces you to manually track 15 different habits.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <XCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                    <span className="text-slate-600 font-medium">Makes you feel guilty for breaking a streak.</span>
                  </li>
                </ul>
              </motion.div>
              
              <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="bg-white p-8 rounded-3xl border border-slate-200/50 shadow-[0_30px_60px_-15px_rgba(148,163,184,0.15)] ring-1 ring-slate-500/10 backdrop-blur-xl">
                <h3 className="font-bold text-slate-800 mb-6 uppercase tracking-widest text-sm">FixMe</h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                    <span className="text-slate-800 font-semibold text-[15px]">"You missed the gym because you slept late."</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                    <span className="text-slate-800 font-semibold text-[15px]">Log one sentence a day. AI does the heavy lifting.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                    <span className="text-slate-800 font-semibold text-[15px]">Helps you run experiments to actually fix the root cause.</span>
                  </li>
                </ul>
              </motion.div>
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-slate-200 bg-white relative z-10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 font-bold text-lg tracking-tight">
            <Brain className="w-5 h-5 text-slate-800" />
            <span>FixMe</span>
          </div>
          <div className="text-slate-500 text-sm font-medium">
            © {new Date().getFullYear()} FixMe OS. Built for self-improvement.
          </div>
        </div>
      </footer>
    </div>
  );
}
