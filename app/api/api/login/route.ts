import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { LoginCredentials, AuthResponse } from "@/lib/supabase";

/**
 * API Route untuk login menggunakan Supabase Auth
 *
 * @param request - NextRequest object yang berisi email dan password
 * @returns NextResponse dengan status login dan data user/session
 */
export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body: LoginCredentials = await request.json();
    const { email, password } = body;

    // Validasi input
    if (!email || !password) {
      const response: AuthResponse = {
        success: false,
        message: "Email dan password harus diisi",
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

    // Attempt login dengan Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Login error:", error);

      // Handle specific error cases
      let errorMessage = "Login gagal";

      if (error.message.includes("Invalid login credentials")) {
        errorMessage = "Email atau password salah";
      } else if (error.message.includes("Email not confirmed")) {
        errorMessage = "Email belum dikonfirmasi. Silakan cek email Anda";
      } else if (error.message.includes("Too many requests")) {
        errorMessage = "Terlalu banyak percobaan login. Coba lagi nanti";
      }

      const response: AuthResponse = {
        success: false,
        message: errorMessage,
      };
      return NextResponse.json(response, { status: 401 });
    }

    // Login berhasil
    const response: AuthResponse = {
      success: true,
      message: "Login berhasil",
      user: data.user,
      session: data.session,
    };

    return NextResponse.json(response, { status: 200 });
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
    message: "Login API endpoint",
    method: "POST",
    body: {
      email: "string (required)",
      password: "string (required)",
    },
    responses: {
      200: "Login berhasil",
      400: "Bad request - validasi gagal",
      401: "Unauthorized - kredensial salah",
      500: "Server error",
    },
  });
}
