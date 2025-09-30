"use client"

import { GalleryVerticalEnd } from "lucide-react"
import { RegisterForm } from "@/components/shadcn-blocks/register-01/register-form"
import { useRegister } from "@/hooks/use-register"
import { useState, FormEvent, useEffect } from "react"
import { useRouter } from "next/navigation"

export default function RegisterPage() {
  const { register, isLoading, error, success } = useRegister()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    await register(email, password, confirmPassword)
  }

  // Redirect to login on successful registration
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        router.push('/login')
      }, 3000) // Give user time to see success message
      
      return () => clearTimeout(timer)
    }
  }, [success, router])

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        {/* Logo/Brand */}
        <div className="flex flex-col items-center gap-6 mb-6">
          <a href="/" className="flex items-center gap-2 font-medium">
            <div className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-md">
              <GalleryVerticalEnd className="size-5" />
            </div>
            <span className="text-xl font-semibold">Communication App</span>
          </a>
        </div>

        {/* Register Form */}
        <RegisterForm 
          email={email}
          password={password}
          confirmPassword={confirmPassword}
          isLoading={isLoading}
          error={error}
          success={success}
          onEmailChange={setEmail}
          onPasswordChange={setPassword}
          onConfirmPasswordChange={setConfirmPassword}
          onSubmit={handleSubmit}
        />

        {/* Sign in link */}
        <div className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <a
            href="/login"
            className="text-primary font-medium hover:underline"
          >
            Sign in
          </a>
        </div>
      </div>
    </div>
  )
}