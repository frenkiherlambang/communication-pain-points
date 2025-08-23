/**
 * @jest-environment node
 */
import { POST, GET } from '@/app/api/api/login/route'

// Mock Supabase
jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn()
}))

// Mock Next.js server components
jest.mock('next/server', () => ({
  NextRequest: jest.fn().mockImplementation((url, options) => ({
    url,
    method: options?.method || 'GET',
    json: jest.fn().mockResolvedValue(JSON.parse(options?.body || '{}')),
    headers: new Map()
  })),
  NextResponse: {
    json: jest.fn().mockImplementation((data, options) => ({
      json: jest.fn().mockResolvedValue(data),
      status: options?.status || 200
    }))
  }
}))

const { createClient } = require('@supabase/supabase-js')
const mockCreateClient = createClient as jest.MockedFunction<typeof createClient>

describe('/api/api/login', () => {
  let mockSupabase: any

  beforeEach(() => {
    mockSupabase = {
      auth: {
        signInWithPassword: jest.fn()
      }
    }
    mockCreateClient.mockReturnValue(mockSupabase)
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
      mockSupabase.auth.signInWithPassword.mockResolvedValue({
        data: { user: null, session: null },
        error: { message: 'Invalid login credentials' }
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
      mockSupabase.auth.signInWithPassword.mockResolvedValue({
        data: { user: null, session: null },
        error: { message: 'Email not confirmed' }
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
        user_metadata: { name: 'Test User' }
      }
      const mockSession = {
        access_token: 'mock-token',
        refresh_token: 'mock-refresh-token'
      }

      mockSupabase.auth.signInWithPassword.mockResolvedValue({
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
      mockSupabase.auth.signInWithPassword.mockRejectedValue(
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