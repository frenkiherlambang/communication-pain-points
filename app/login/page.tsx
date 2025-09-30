"use client"

import { GalleryVerticalEnd } from "lucide-react"
import { LoginForm } from "@/components/shadcn-blocks/login-01/login-form"
import { useLogin } from "@/hooks/use-login"
import { useState, FormEvent, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function LoginPage() {
  const { login, isLoading, error, success } = useLogin()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    await login(email, password)
  }

  // Redirect to dashboard on successful login
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        router.push('/dashboard')
      }, 1500) // Give user time to see success message
      
      return () => clearTimeout(timer)
    }
  }, [success, router])

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        {/* Logo/Brand */}
        <div className="flex flex-col items-center gap-6 mb-6">
          <Link href="/" className="flex items-center gap-2 font-medium">
            <div className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-md">
              <GalleryVerticalEnd className="size-5" />
            </div>
            <span className="text-xl font-semibold">Communication App</span>
          </Link>
        </div>

        {/* Login Form */}
        <LoginForm 
          email={email}
          password={password}
          isLoading={isLoading}
          error={error}
          success={success}
          onEmailChange={setEmail}
          onPasswordChange={setPassword}
          onSubmit={handleSubmit}
        />

      
      </div>
    </div>
  )
}