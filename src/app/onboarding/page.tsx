'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { ArrowRight, Sparkles, AlertCircle } from 'lucide-react';

const STUCK_AREAS = [
  "Fitness", "Sleep", "Career", "Money", "Productivity", "Relationships", "Health"
];

const BURNOUT_FREQUENCIES = [
  "Daily", "Weekly", "Monthly", "Rarely"
];

const MOTIVATIONAL_LINES = [
  "AWARENESS IS THE FIRST STEP.",
  "LET'S UNCOVER THE PATTERNS.",
  "NO MORE TREATING SYMPTOMS.",
  "YOUR SYSTEM IS BROKEN.",
  "LET'S FIND THE ROOT CAUSE.",
];

// Helper to stagger text without disappearing on re-renders
const AnimatedText = ({ text, className }: { text: string, className?: string }) => {
  const words = text.split(" ");
  return (
    <div className={`inline-flex flex-wrap justify-center gap-x-2 gap-y-1 ${className}`}>
      {words.map((word, i) => (
        <motion.span
          key={`${word}-${i}`}
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: i * 0.08, type: 'spring', damping: 12, stiffness: 100 }}
          className="inline-block"
        >
          {word}
        </motion.span>
      ))}
    </div>
  );
};

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [quoteIndex, setQuoteIndex] = useState(0);

  const [answers, setAnswers] = useState({
    area: "",
    burnout: "",
    roadblock: "",
  });

  // Cycle through motivational lines
  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % MOTIVATIONAL_LINES.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  const handleFinish = async () => {
    if (!answers.roadblock.trim()) return;
    setIsGenerating(true);
    setError(null);

    try {
      const res = await fetch('/api/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(answers),
      });
      
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Failed to generate profile");

      setTimeout(() => {
        router.push('/dashboard');
      }, 2500);
    } catch (err: any) {
      setError(err.message);
      setIsGenerating(false);
    }
  };

  // Shared card animation variants
  const cardVariants: Variants = {
    initial: { x: 100, opacity: 0, scale: 0.95 },
    animate: { x: 0, opacity: 1, scale: 1, transition: { type: "spring", stiffness: 100, damping: 20 } },
    exit: { x: -100, opacity: 0, scale: 0.95, transition: { duration: 0.3 } },
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-slate-900 flex items-center justify-center p-6 relative overflow-hidden font-sans">
      
      {/* MASSIVE Scrolling Background Text */}
      <div className="absolute inset-0 overflow-hidden flex items-center justify-center pointer-events-none z-0 opacity-[0.02]">
        <AnimatePresence mode="wait">
          <motion.h1
            key={quoteIndex}
            initial={{ opacity: 0, scale: 0.9, x: '20vw' }}
            animate={{ opacity: 1, scale: 1, x: '-20vw' }}
            exit={{ opacity: 0, scale: 1.1, x: '-40vw' }}
            transition={{ duration: 6, ease: "linear" }}
            className="text-[12vw] font-black tracking-tighter text-slate-900 whitespace-nowrap"
          >
            {MOTIVATIONAL_LINES[quoteIndex]}
          </motion.h1>
        </AnimatePresence>
      </div>

      {/* Soft Animated Background Elements */}
      <motion.div 
        animate={{ 
          x: ["-5vw", "5vw", "-5vw"], 
          y: ["-5vh", "5vh", "-5vh"],
          scale: [1, 1.1, 1],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-amber-200/40 blur-[120px] pointer-events-none z-0" 
      />
      <motion.div 
        animate={{ 
          x: ["5vw", "-5vw", "5vw"], 
          y: ["5vh", "-5vh", "5vh"],
          scale: [1.1, 1, 1.1],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-rose-200/40 blur-[120px] pointer-events-none z-0" 
      />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.06] pointer-events-none z-0"></div>

      <div className="max-w-2xl w-full relative z-10 mt-8">
        <AnimatePresence mode="wait">
          {step === 1 && !isGenerating && (
            <motion.div
              key="step1"
              variants={cardVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="space-y-16"
            >
              <h2 className="text-5xl md:text-6xl font-black text-center tracking-tighter leading-[1.1] text-slate-900 drop-shadow-sm">
                <AnimatedText text="What area of your life feels most" />
                <motion.span 
                  initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.8, type: "spring", bounce: 0.6 }}
                  className="text-amber-500 block mt-2 inline-block drop-shadow-md"
                >
                  stuck right now?
                </motion.span>
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {STUCK_AREAS.map((area, idx) => (
                  <motion.button
                    initial={{ opacity: 0, y: 30, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ delay: 0.4 + (idx * 0.05), type: "spring", stiffness: 300, damping: 15 }}
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    key={area}
                    onClick={() => { setAnswers({ ...answers, area }); setTimeout(handleNext, 400); }}
                    className={`p-6 rounded-[2rem] font-black text-lg transition-all duration-300 border-4 shadow-xl ${
                      answers.area === area 
                        ? 'bg-amber-400 border-amber-500 text-slate-900 shadow-[0_20px_50px_rgba(251,191,36,0.5)] z-10 relative' 
                        : 'bg-white border-white text-slate-600 hover:border-amber-200 hover:shadow-2xl'
                    }`}
                  >
                    {area}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 2 && !isGenerating && (
            <motion.div
              key="step2"
              variants={cardVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="space-y-16"
            >
              <h2 className="text-5xl md:text-6xl font-black text-center tracking-tighter leading-[1.1] text-slate-900 drop-shadow-sm">
                <AnimatedText text="How often do you feel completely" />
                <motion.span 
                  initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.6, type: "spring", bounce: 0.6 }}
                  className="text-rose-500 block mt-2 inline-block drop-shadow-md"
                >
                  burnt out?
                </motion.span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {BURNOUT_FREQUENCIES.map((freq, idx) => (
                  <motion.button
                    initial={{ opacity: 0, x: idx % 2 === 0 ? -30 : 30, scale: 0.9 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    transition={{ delay: 0.4 + (idx * 0.1), type: "spring", stiffness: 300, damping: 15 }}
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    key={freq}
                    onClick={() => { setAnswers({ ...answers, burnout: freq }); setTimeout(handleNext, 400); }}
                    className={`p-8 rounded-[2.5rem] font-black text-2xl transition-all duration-300 border-4 shadow-xl ${
                      answers.burnout === freq 
                        ? 'bg-rose-400 border-rose-500 text-white shadow-[0_20px_50px_rgba(244,63,94,0.4)] z-10 relative' 
                        : 'bg-white border-white text-slate-600 hover:border-rose-200 hover:shadow-2xl'
                    }`}
                  >
                    {freq}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 3 && !isGenerating && (
            <motion.div
              key="step3"
              variants={cardVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="space-y-12"
            >
              <h2 className="text-4xl md:text-5xl font-black text-center tracking-tighter leading-[1.1] text-slate-900 drop-shadow-sm">
                <AnimatedText text="In your own words, what is the biggest" />
                <motion.span 
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8, type: "spring" }}
                  className="text-indigo-500 block mt-2"
                >
                  roadblock?
                </motion.span>
              </h2>
              <div className="space-y-8">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }} 
                  animate={{ opacity: 1, scale: 1 }} 
                  transition={{ delay: 0.4, type: "spring", bounce: 0.4 }}
                  className="relative group z-20"
                >
                  <div className="absolute -inset-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-[2.5rem] blur-xl opacity-10 group-focus-within:opacity-30 transition duration-500 animate-pulse"></div>
                  <textarea
                    value={answers.roadblock}
                    onChange={(e) => setAnswers({ ...answers, roadblock: e.target.value })}
                    placeholder="E.g. I never have enough time after work..."
                    className="relative w-full h-56 bg-white/90 backdrop-blur-xl border-4 border-white rounded-[2rem] p-8 text-2xl font-semibold focus:outline-none focus:border-indigo-400 resize-none transition-all placeholder:text-slate-300 text-slate-800 shadow-[0_20px_50px_rgba(0,0,0,0.05)] z-20"
                  />
                </motion.div>
                
                {error && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 justify-center text-red-500 bg-red-50 p-4 rounded-2xl border-2 border-red-200 font-bold z-20 relative">
                    <AlertCircle className="w-6 h-6" />
                    <p>{error}</p>
                  </motion.div>
                )}
                
                <motion.div 
                  initial={{ opacity: 0, y: 30 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ delay: 0.6, type: "spring" }}
                  className="z-20 relative"
                >
                  <motion.button 
                    whileHover={{ scale: 1.02, boxShadow: "0 20px 40px rgba(99, 102, 241, 0.2)" }} 
                    whileTap={{ scale: 0.98 }}
                    onClick={handleFinish} 
                    disabled={!answers.roadblock.trim()}
                    className="w-full h-20 bg-slate-900 text-white rounded-[2rem] text-2xl font-black transition-all border-4 border-slate-800 disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden"
                  >
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    />
                    <span className="relative z-10 flex items-center justify-center gap-4">
                      Complete Assessment 
                      <motion.div animate={{ x: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
                        <ArrowRight className="w-8 h-8" />
                      </motion.div>
                    </span>
                  </motion.button>
                </motion.div>
              </div>
            </motion.div>
          )}

          {isGenerating && (
            <motion.div
              key="generating"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", damping: 12, stiffness: 100 }}
              className="flex flex-col items-center justify-center space-y-16 py-20 z-20 relative"
            >
              <div className="relative flex items-center justify-center">
                <motion.div 
                  animate={{ 
                    borderRadius: ["30% 70% 70% 30%", "70% 30% 30% 70%", "30% 70% 70% 30%"],
                    rotate: [0, 180, 360],
                    scale: [1, 1.2, 1]
                  }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute w-64 h-64 bg-gradient-to-br from-amber-400 via-rose-400 to-indigo-400 blur-2xl opacity-40 mix-blend-multiply"
                />
                <motion.div 
                  animate={{ 
                    borderRadius: ["70% 30% 30% 70%", "30% 70% 70% 30%", "70% 30% 30% 70%"],
                    rotate: [360, 180, 0],
                  }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="w-48 h-48 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-[0_30px_60px_rgba(0,0,0,0.1)] z-10 relative border-4 border-white"
                >
                  <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1, repeat: Infinity }}>
                    <Sparkles className="w-20 h-20 text-amber-500" />
                  </motion.div>
                </motion.div>
              </div>
              
              <div className="text-center space-y-6">
                <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter">
                  Synthesizing <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-rose-500">Profile</span>
                </h2>
                <div className="h-8 overflow-hidden relative w-80 mx-auto flex justify-center">
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={quoteIndex}
                      initial={{ opacity: 0, y: 30, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -30, scale: 1.1 }}
                      transition={{ type: "spring" }}
                      className="text-slate-500 font-bold tracking-[0.2em] uppercase text-sm absolute w-full"
                    >
                      {["Analyzing roadblocks...", "Finding correlations...", "Drafting experiment...", "Finalizing profile..."][quoteIndex % 4]}
                    </motion.p>
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bouncy Progress Tracker */}
        {!isGenerating && (
          <div className="mt-20 flex justify-center gap-4 z-20 relative">
            {[1, 2, 3].map((i) => (
              <motion.div 
                key={i} 
                animate={{ 
                  scale: i === step ? 1.5 : 1,
                  width: i === step ? 64 : 24,
                  backgroundColor: i === step ? '#0f172a' : (i < step ? '#94a3b8' : '#e2e8f0')
                }}
                transition={{ type: "spring", damping: 10, stiffness: 200 }}
                className="h-3 rounded-full"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
