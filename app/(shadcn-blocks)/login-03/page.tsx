"use client"

import { GalleryVerticalEnd } from "lucide-react"
import { LoginForm } from "@/components/shadcn-blocks/login-03/login-form"
import { useLogin } from "@/hooks/use-login"
import { useState, FormEvent } from "react"

export default function LoginPage() {
  const { login, isLoading, error, success } = useLogin()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    await login(email, password)
  }

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
            <GalleryVerticalEnd className="size-4" />
          </div>
          Acme Inc.
        </a>
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
