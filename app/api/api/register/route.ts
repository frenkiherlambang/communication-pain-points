import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { AuthResponse } from "@/lib/supabase";

export interface RegisterCredentials {
  email: string;
  password: string;
  confirmPassword: string;
}

/**
 * API Route untuk register menggunakan Supabase Auth
 *
 * @param request - NextRequest object yang berisi email, password, dan confirmPassword
 * @returns NextResponse dengan status registrasi dan data user/session
 */
export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body: RegisterCredentials = await request.json();
    const { email, password, confirmPassword } = body;

    // Validasi input
    if (!email || !password || !confirmPassword) {
      const response: AuthResponse = {
        success: false,
        message: "Email, password, dan konfirmasi password harus diisi",
      };
      return NextResponse.json(response, { status: 400 });
    }

    // Validasi format email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      const response: AuthResponse = {
        success: false,
        message: "Format email tidak valid",
      };
      return NextResponse.json(response, { status: 400 });
    }

    // Validasi password match
    if (password !== confirmPassword) {
      const response: AuthResponse = {
        success: false,
        message: "Password dan konfirmasi password tidak cocok",
      };
      return NextResponse.json(response, { status: 400 });
    }

    // Validasi panjang password
    if (password.length < 6) {
      const response: AuthResponse = {
        success: false,
        message: "Password harus minimal 6 karakter",
      };
      return NextResponse.json(response, { status: 400 });
    }

    // Attempt register dengan Supabase
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      console.error("Register error:", error);

      // Handle specific error cases
      let errorMessage = "Registrasi gagal";

      if (error.message.includes("User already registered")) {
        errorMessage = "Email sudah terdaftar. Silakan gunakan email lain atau login";
      } else if (error.message.includes("Password should be at least")) {
        errorMessage = "Password terlalu lemah. Gunakan minimal 6 karakter";
      } else if (error.message.includes("Invalid email")) {
        errorMessage = "Format email tidak valid";
      } else if (error.message.includes("signup is disabled")) {
        errorMessage = "Registrasi sementara dinonaktifkan";
      }

      const response: AuthResponse = {
        success: false,
        message: errorMessage,
      };
      return NextResponse.json(response, { status: 400 });
    }

    // Register berhasil
    const response: AuthResponse = {
      success: true,
      message: data.user?.email_confirmed_at 
        ? "Registrasi berhasil! Anda sudah bisa login" 
        : "Registrasi berhasil! Silakan cek email untuk konfirmasi akun",
      user: data.user,
      session: data.session,
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error("Server error:", error);

    const response: AuthResponse = {
      success: false,
      message: "Terjadi kesalahan server",
    };

    return NextResponse.json(response, { status: 500 });
  }
}

/**
 * Handle GET request - return API information
 */
export async function GET() {
  return NextResponse.json({
    message: "Register API endpoint",
    method: "POST",
    body: {
      email: "string (required)",
      password: "string (required)",
      confirmPassword: "string (required)",
    },
    responses: {
      201: "Registrasi berhasil",
      400: "Bad request - validasi gagal",
      500: "Server error",
    },
  });
}