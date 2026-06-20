import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Brain, ArrowRight, AlertCircle } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { signup } from "../login/actions"

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedSearchParams = await searchParams;
  const error = resolvedSearchParams?.error as string | undefined;

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6 md:p-10 bg-[#FDFBF7] font-sans text-slate-900 selection:bg-amber-400 selection:text-slate-900 overflow-x-hidden relative">
      <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.05] pointer-events-none z-0"></div>

      {/* Soft Animated Background Orbs */}
      <div className="fixed top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-[40%_60%_70%_30%] bg-amber-300/30 blur-[120px] pointer-events-none z-0 mix-blend-multiply animate-[spin_20s_linear_infinite]" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-[60%_40%_30%_70%] bg-rose-300/30 blur-[120px] pointer-events-none z-0 mix-blend-multiply animate-[spin_25s_linear_infinite_reverse]" />
      
      <div className="relative z-10 w-full max-w-md">
        <div className="mb-10 flex flex-col items-center justify-center space-y-4 text-center">
          <div className="flex items-center gap-3 font-black text-3xl tracking-tighter text-slate-900">
            <Brain className="w-10 h-10 text-amber-500" />
            <span>FixMe OS</span>
          </div>
          <div className="space-y-1">
            <h1 className="text-3xl font-black tracking-tighter text-slate-900">Initialize your account</h1>
            <p className="text-base font-medium text-slate-600">
              Start decoding your patterns today.
            </p>
          </div>
        </div>

        <Card className="border-4 border-white bg-white/80 backdrop-blur-2xl shadow-[0_30px_60px_rgba(0,0,0,0.08)] rounded-[2.5rem] overflow-hidden">
          <CardHeader className="space-y-1 px-8 pt-8 pb-4">
            <CardTitle className="text-2xl font-black text-slate-900 tracking-tight">Sign up</CardTitle>
            <CardDescription className="text-slate-500 font-medium text-sm">
              Enter your email and password below
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 px-8 pb-8">
            {error && (
              <div className="flex items-center gap-2 p-4 text-sm font-bold text-rose-600 bg-rose-50 rounded-2xl border-2 border-rose-100 shadow-sm">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <p>{error}</p>
              </div>
            )}
            <form className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="font-bold text-slate-700 ml-1">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="m@example.com"
                  className="bg-[#FDFBF7] border-2 border-slate-100 h-14 rounded-2xl px-4 text-base transition-all focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:border-amber-400 shadow-inner"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="font-bold text-slate-700 ml-1">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  className="bg-[#FDFBF7] border-2 border-slate-100 h-14 rounded-2xl px-4 text-base transition-all focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:border-amber-400 shadow-inner"
                  required
                />
              </div>
              <div className="flex flex-col gap-2 pt-4">
                <Button formAction={signup} type="submit" className="w-full group h-14 bg-slate-900 text-white hover:bg-slate-800 rounded-2xl text-lg font-bold shadow-[0_10px_20px_rgba(0,0,0,0.1)] border-2 border-slate-800 transition-all">
                  Create Account
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center border-t-2 border-slate-100 bg-[#FDFBF7]/50 p-6">
            <p className="text-base font-medium text-slate-600">
              Already have an account?{" "}
              <Link href="/login" className="font-black text-amber-600 hover:text-amber-700 transition-colors">
                Sign in
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
