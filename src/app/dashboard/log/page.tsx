"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Battery, BatteryLow, BatteryMedium, BatteryFull, Moon, Frown, Meh, Smile, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { createDailyLog } from "./actions"
import { useRouter } from "next/navigation"

export default function DailyLogPage() {
  const router = useRouter()
  const [problem, setProblem] = useState("")
  const [mood, setMood] = useState<number | null>(null)
  const [energy, setEnergy] = useState<number | null>(null)
  const [sleep, setSleep] = useState<number>(7)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [validationError, setValidationError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setValidationError(null)
    
    if (!problem.trim()) {
      setValidationError("Please tell us what your biggest struggle was today.")
      return
    }
    if (mood === null) {
      setValidationError("Please select your Mood.")
      return
    }
    if (energy === null) {
      setValidationError("Please select your Energy level.")
      return
    }
    
    setIsSubmitting(true)
    try {
      await createDailyLog({
        problemDescription: problem,
        mood,
        energy,
        sleepHours: sleep,
      })
      
      // Navigate back to dashboard on success
      router.push("/dashboard")
    } catch (error) {
      console.error(error)
      alert("Failed to save log. Please try again.")
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto py-12 relative">
      {/* Ambient Orbs */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-amber-400/20 blur-[100px] rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-rose-400/20 blur-[100px] rounded-full pointer-events-none translate-x-1/2 translate-y-1/2" />

      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className="mb-12 text-center relative z-10"
      >
        <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-slate-900 mb-4">Daily Check-in</h1>
        <p className="text-xl text-slate-500 font-medium">Log what went wrong today to find the hidden patterns.</p>
      </motion.div>

      <motion.form 
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.1 }}
        onSubmit={handleSubmit}
        className="bg-white/80 backdrop-blur-2xl border-4 border-white rounded-[3rem] p-10 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.08)] ring-1 ring-slate-900/5 space-y-12 relative overflow-hidden z-10"
      >
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-amber-400 via-rose-400 to-amber-500" />
        
        {/* The Problem */}
        <div className="space-y-6">
          <label className="block text-2xl font-black tracking-tight text-slate-900">
            What was your biggest struggle today?
          </label>
          <div className="relative group">
            <div className="absolute -inset-2 bg-gradient-to-r from-amber-200 to-rose-200 rounded-[2rem] blur-xl opacity-20 group-focus-within:opacity-60 transition duration-500" />
            <textarea
              value={problem}
              onChange={(e) => setProblem(e.target.value)}
              required
              placeholder="e.g., 'Missed the gym again today. Felt completely drained and couldn't focus.'"
              className="relative w-full min-h-[160px] p-6 bg-white border-2 border-slate-100 rounded-[2rem] resize-none focus:ring-4 focus:ring-amber-400/20 focus:border-amber-300 transition-all text-xl text-slate-800 font-medium shadow-sm outline-none"
            />
          </div>
        </div>

        {/* The Modifiers */}
        <div className="grid md:grid-cols-2 gap-10 pt-8 border-t-2 border-slate-100">
          
          {/* Mood */}
          <div className="space-y-4">
            <label className="block text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Smile className="w-4 h-4" /> Mood
            </label>
            <div className="flex gap-3">
              {[
                { val: 1, icon: Frown, label: "Bad" },
                { val: 2, icon: Meh, label: "Okay" },
                { val: 3, icon: Smile, label: "Good" }
              ].map((m) => (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  key={m.val}
                  type="button"
                  onClick={() => setMood(m.val)}
                  className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-[1.5rem] border-2 transition-all ${
                    mood === m.val 
                      ? 'bg-amber-100 border-amber-300 text-amber-700 shadow-[0_10px_20px_rgba(251,191,36,0.2)]' 
                      : 'bg-[#FDFBF7] border-slate-100 text-slate-400 hover:border-amber-200 hover:text-slate-600 shadow-inner'
                  }`}
                >
                  <m.icon className={`w-8 h-8 ${mood === m.val ? 'fill-amber-500/20' : ''}`} />
                  <span className="text-sm font-black uppercase tracking-wider">{m.label}</span>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Energy */}
          <div className="space-y-4">
            <label className="block text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Zap className="w-4 h-4" /> Energy
            </label>
            <div className="flex gap-3">
              {[
                { val: 1, icon: BatteryLow, label: "Low" },
                { val: 2, icon: BatteryMedium, label: "Med" },
                { val: 3, icon: BatteryFull, label: "High" }
              ].map((e) => (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  key={e.val}
                  type="button"
                  onClick={() => setEnergy(e.val)}
                  className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-[1.5rem] border-2 transition-all ${
                    energy === e.val 
                      ? 'bg-rose-100 border-rose-300 text-rose-700 shadow-[0_10px_20px_rgba(244,63,94,0.2)]' 
                      : 'bg-[#FDFBF7] border-slate-100 text-slate-400 hover:border-rose-200 hover:text-slate-600 shadow-inner'
                  }`}
                >
                  <e.icon className={`w-8 h-8 ${energy === e.val ? 'fill-rose-500/20' : ''}`} />
                  <span className="text-sm font-black uppercase tracking-wider">{e.label}</span>
                </motion.button>
              ))}
            </div>
          </div>

        </div>

        {/* Sleep */}
        <div className="space-y-6 pt-8 border-t-2 border-slate-100">
          <div className="flex justify-between items-end">
            <label className="block text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Moon className="w-4 h-4" /> Sleep Last Night
            </label>
            <span className="text-3xl font-black text-indigo-900 flex items-baseline gap-1">
              {sleep} <span className="text-sm font-black text-indigo-400 uppercase tracking-widest">hours</span>
            </span>
          </div>
          <div className="flex items-center gap-4 bg-[#FDFBF7] p-6 rounded-[2rem] border-2 border-slate-100 shadow-inner">
            <Moon className="w-8 h-8 text-indigo-300 fill-indigo-300/20" />
            <input 
              type="range" 
              min="0" 
              max="14" 
              step="0.5"
              value={sleep}
              onChange={(e) => setSleep(parseFloat(e.target.value))}
              className="w-full accent-indigo-500 h-4 bg-slate-200 rounded-full appearance-none cursor-pointer"
            />
          </div>
        </div>

        {/* Submit */}
        <div className="pt-8">
          {validationError && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 p-4 bg-red-50 border-2 border-red-200 text-red-600 font-bold rounded-2xl text-center shadow-inner">
              {validationError}
            </motion.div>
          )}
          
          <motion.div whileHover={!isSubmitting ? { scale: 1.02 } : {}} whileTap={!isSubmitting ? { scale: 0.98 } : {}}>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full py-8 text-2xl font-black rounded-[2rem] bg-slate-900 text-white hover:bg-slate-800 transition-all shadow-[0_20px_40px_rgba(0,0,0,0.2)] disabled:opacity-50 disabled:shadow-none"
            >
              {isSubmitting ? "Logging..." : "Log to FixMe"}
            </Button>
          </motion.div>
        </div>
      </motion.form>
    </div>
  )
}
