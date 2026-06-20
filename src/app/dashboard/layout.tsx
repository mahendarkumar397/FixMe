import { Brain, Activity, LineChart, Settings, LogOut, FileText } from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"
import { createClient } from "@/utils/supabase/server"
import { signout } from "@/app/login/actions"
import AICoachChat from "@/components/AICoachChat"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    redirect('/login')
  }

  return (
    <div className="flex min-h-screen bg-[#FDFBF7] font-sans text-slate-900 relative overflow-hidden">
      
      {/* Soft Ambient Dashboard Background */}
      <div className="absolute inset-0 pointer-events-none z-0 opacity-40">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-amber-200/40 blur-[120px] mix-blend-multiply" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-rose-200/40 blur-[120px] mix-blend-multiply" />
      </div>
      {/* Sidebar Navigation */}
      <aside className="w-64 border-r border-slate-200/50 bg-white/60 backdrop-blur-xl flex flex-col hidden md:flex relative z-20 shadow-[10px_0_30px_rgba(0,0,0,0.02)]">
        <div className="p-6 border-b border-slate-200 flex items-center gap-2 font-bold text-xl tracking-tight">
          <Brain className="w-6 h-6 text-slate-800" />
          <span>FixMe</span>
        </div>
        
        <nav className="flex-1 p-4 flex flex-col gap-2">
          <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium transition-colors">
            <Activity className="w-5 h-5" />
            Overview
          </Link>
          <Link href="/dashboard/log" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-900 text-white font-medium shadow-md shadow-slate-900/10">
            <FileText className="w-5 h-5" />
            Daily Log
          </Link>
          <Link href="/dashboard/insights" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium transition-colors">
            <LineChart className="w-5 h-5" />
            Insights
          </Link>
          <Link href="/dashboard/experiments" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium transition-colors">
            <Activity className="w-5 h-5" />
            Experiments
          </Link>
        </nav>
        
        <div className="p-4 border-t border-slate-200 flex flex-col gap-2">
          <Link href="/dashboard/settings" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium transition-colors">
            <Settings className="w-5 h-5" />
            Settings
          </Link>
          <form action={signout} className="w-full">
            <button type="submit" className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 font-medium transition-colors w-full text-left">
              <LogOut className="w-5 h-5" />
              Sign Out
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto relative z-10">
        {/* Mobile Header */}
        <header className="md:hidden p-4 border-b border-slate-200/50 bg-white/60 backdrop-blur-xl flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-2 font-bold text-lg tracking-tight">
            <Brain className="w-5 h-5 text-slate-800" />
            <span>FixMe</span>
          </div>
          {/* Mobile menu toggle would go here */}
        </header>

        <div className="flex-1 p-6 md:p-10 max-w-5xl mx-auto w-full">
          {children}
        </div>
      </main>
      <AICoachChat />
    </div>
  )
}
