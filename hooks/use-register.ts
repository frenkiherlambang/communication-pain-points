import { useState } from "react";
import { AuthResponse } from "@/lib/supabase";

interface UseRegisterReturn {
  register: (email: string, password: string, confirmPassword: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  success: boolean;
}

/**
 * Custom hook untuk menangani proses registrasi
 *
 * @returns Object dengan fungsi register dan state management
 */
export function useRegister(): UseRegisterReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const register = async (email: string, password: string, confirmPassword: string) => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch("/api/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, confirmPassword }),
      });

      const data: AuthResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registrasi gagal");
      }

      if (data.success) {
        setSuccess(true);
        console.log("Registrasi berhasil:", data.user);
      } else {
        throw new Error(data.message || "Registrasi gagal");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Terjadi kesalahan";
      setError(errorMessage);
      console.error("Register error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    register,
    isLoading,
    error,
    success,
  };
}