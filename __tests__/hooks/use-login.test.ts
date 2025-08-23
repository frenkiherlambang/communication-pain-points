import { renderHook, act } from '@testing-library/react'
import { useLogin } from '@/hooks/use-login'

// Mock fetch
global.fetch = jest.fn()

describe('useLogin hook', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(fetch as jest.MockedFunction<typeof fetch>).mockClear()
  })

  it('should initialize with default state', () => {
    const { result } = renderHook(() => useLogin())

    expect(result.current.isLoading).toBe(false)
    expect(result.current.error).toBe(null)
    expect(result.current.success).toBe(false)
  })

  it('should handle successful login', async () => {
    const mockResponse = {
      ok: true,
      json: async () => ({
        message: 'Login berhasil',
        success: true,
        user: { id: '123', email: 'test@example.com' },
        session: { access_token: 'token' }
      })
    }
    ;(fetch as jest.MockedFunction<typeof fetch>).mockResolvedValue(mockResponse as Response)

    const { result } = renderHook(() => useLogin())

    await act(async () => {
      await result.current.login('test@example.com', 'password123')
    })

    expect(result.current.isLoading).toBe(false)
    expect(result.current.error).toBe(null)
    expect(result.current.success).toBe(true)
    expect(fetch).toHaveBeenCalledWith('/api/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password123',
      }),
    })
  })

  it('should handle login error from API', async () => {
    const mockResponse = {
      ok: false,
      json: async () => ({
        message: 'Email atau password salah'
      })
    }
    ;(fetch as jest.MockedFunction<typeof fetch>).mockResolvedValue(mockResponse as Response)

    const { result } = renderHook(() => useLogin())

    await act(async () => {
      await result.current.login('test@example.com', 'wrongpassword')
    })

    expect(result.current.isLoading).toBe(false)
    expect(result.current.error).toBe('Email atau password salah')
    expect(result.current.success).toBe(false)
  })

  it('should handle network error', async () => {
    ;(fetch as jest.MockedFunction<typeof fetch>).mockRejectedValue(new Error('Network error'))

    const { result } = renderHook(() => useLogin())

    await act(async () => {
      await result.current.login('test@example.com', 'password123')
    })

    expect(result.current.isLoading).toBe(false)
    expect(result.current.error).toBe('Network error')
    expect(result.current.success).toBe(false)
  })

  it('should set loading state during login', async () => {
    let resolvePromise: (value: any) => void
    const promise = new Promise((resolve) => {
      resolvePromise = resolve
    })
    
    ;(fetch as jest.MockedFunction<typeof fetch>).mockReturnValue(promise as Promise<Response>)

    const { result } = renderHook(() => useLogin())

    act(() => {
      result.current.login('test@example.com', 'password123')
    })

    expect(result.current.isLoading).toBe(true)
    expect(result.current.error).toBe(null)
    expect(result.current.success).toBe(false)

    // Resolve the promise
    await act(async () => {
      resolvePromise!({
        ok: true,
        json: async () => ({ 
          message: 'Login berhasil',
          success: true
        })
      })
    })

    expect(result.current.isLoading).toBe(false)
  })

  it('should reset error and success state on new login attempt', async () => {
    const mockErrorResponse = {
      ok: false,
      json: async () => ({ message: 'Error pertama' })
    }
    ;(fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce(mockErrorResponse as Response)

    const { result } = renderHook(() => useLogin())

    // First login attempt with error
    await act(async () => {
      await result.current.login('test@example.com', 'wrongpassword')
    })

    expect(result.current.error).toBe('Error pertama')
    expect(result.current.success).toBe(false)

    // Second login attempt
    const mockSuccessResponse = {
      ok: true,
      json: async () => ({ 
        message: 'Login berhasil',
        success: true,
        user: { id: '123', email: 'test@example.com' }
      })
    }
    ;(fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce(mockSuccessResponse as Response)

    await act(async () => {
      await result.current.login('test@example.com', 'correctpassword')
    })

    expect(result.current.error).toBe(null)
    expect(result.current.success).toBe(true)
  })
})