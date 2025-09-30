/**
 * @jest-environment node
 */
import { POST, GET } from '@/app/api/api/login/route'

// Mock Supabase
jest.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      signInWithPassword: jest.fn()
    }
  }
}))

// Import mocked supabase
import { supabase } from '@/lib/supabase'
const mockSignInWithPassword = jest.mocked(supabase.auth.signInWithPassword)

// Mock Next.js server components
jest.mock('next/server', () => ({
  NextRequest: jest.fn(),
  NextResponse: {
    json: jest.fn().mockImplementation((data, options) => ({
      json: () => Promise.resolve(data),
      status: options?.status || 200,
      ok: (options?.status || 200) < 400
    }))
  }
}))

describe('/api/api/login', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('POST /api/api/login', () => {
    it('should return 400 if email is missing', async () => {
      const mockRequest = {
        json: jest.fn().mockResolvedValue({ password: 'password123' })
      } as any

      const response = await POST(mockRequest)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Email dan password harus diisi')
    })

    it('should return 400 if password is missing', async () => {
      const mockRequest = {
        json: jest.fn().mockResolvedValue({ email: 'test@example.com' })
      } as any

      const response = await POST(mockRequest)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Email dan password harus diisi')
    })

    it('should return 401 for invalid credentials', async () => {
      mockSignInWithPassword.mockResolvedValue({
         data: { user: null, session: null },
         error: { 
           message: 'Invalid login credentials',
           code: 'invalid_credentials',
           status: 400,
           name: 'AuthError'
         } as any
       })

      const mockRequest = {
        json: jest.fn().mockResolvedValue({ 
          email: 'test@example.com', 
          password: 'wrongpassword' 
        })
      } as any

      const response = await POST(mockRequest)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('Email atau password salah')
    })

    it('should return 401 for unconfirmed email', async () => {
      mockSignInWithPassword.mockResolvedValue({
         data: { user: null, session: null },
         error: { 
           message: 'Email not confirmed',
           code: 'email_not_confirmed',
           status: 400,
           name: 'AuthError'
         } as any
       })

      const mockRequest = {
        json: jest.fn().mockResolvedValue({ 
          email: 'test@example.com', 
          password: 'password123' 
        })
      } as any

      const response = await POST(mockRequest)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('Email belum dikonfirmasi. Silakan cek email Anda.')
    })

    it('should return 200 for successful login', async () => {
      const mockUser = {
        id: '123',
        email: 'test@example.com',
        user_metadata: { name: 'Test User' },
        app_metadata: {},
        aud: 'authenticated',
        created_at: '2023-01-01T00:00:00Z',
        confirmed_at: '2023-01-01T00:00:00Z',
        email_confirmed_at: '2023-01-01T00:00:00Z',
        phone: '',
        last_sign_in_at: '2023-01-01T00:00:00Z',
        role: 'authenticated',
        updated_at: '2023-01-01T00:00:00Z'
      }
      const mockSession = {
        access_token: 'mock-token',
        refresh_token: 'mock-refresh-token',
        expires_in: 3600,
        token_type: 'bearer',
        user: mockUser,
        expires_at: Math.floor(Date.now() / 1000) + 3600
      }

      mockSignInWithPassword.mockResolvedValue({
        data: { user: mockUser, session: mockSession },
        error: null
      })

      const mockRequest = {
        json: jest.fn().mockResolvedValue({ 
          email: 'test@example.com', 
          password: 'password123' 
        })
      } as any

      const response = await POST(mockRequest)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.message).toBe('Login berhasil')
      expect(data.user).toEqual(mockUser)
      expect(data.session).toEqual(mockSession)
    })

    it('should handle unexpected errors', async () => {
      mockSignInWithPassword.mockRejectedValue(
        new Error('Database connection failed')
      )

      const mockRequest = {
        json: jest.fn().mockResolvedValue({ 
          email: 'test@example.com', 
          password: 'password123' 
        })
      } as any

      const response = await POST(mockRequest)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.error).toBe('Terjadi kesalahan server')
    })
  })

  describe('GET /api/api/login', () => {
    it('should return API information', async () => {
      const response = await GET()
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.message).toBe('Login API endpoint')
      expect(data.methods).toEqual(['POST'])
    })
  })
})