import { useState } from "react";
import { AuthResponse } from "@/lib/supabase";

interface UseLoginReturn {
  login: (email: string, password: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  success: boolean;
}

/**
 * Custom hook untuk menangani proses login
 *
 * @returns Object dengan fungsi login dan state management
 */
export function useLogin(): UseLoginReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch("/api/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data: AuthResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login gagal");
      }

      if (data.success) {
        setSuccess(true);
        // Redirect atau handle success sesuai kebutuhan
        // Misalnya: router.push('/dashboard')
        console.log("Login berhasil:", data.user);
      } else {
        throw new Error(data.message || "Login gagal");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Terjadi kesalahan";
      setError(errorMessage);
      console.error("Login error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    login,
    isLoading,
    error,
    success,
  };
}
