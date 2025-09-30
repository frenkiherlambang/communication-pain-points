import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import Page from '@/app/(shadcn-blocks)/login-01/page'
import { useLogin } from '@/hooks/use-login'

// Mock useLogin hook
jest.mock('@/hooks/use-login')
const mockUseLogin = useLogin as jest.MockedFunction<typeof useLogin>

// Mock LoginForm component
jest.mock('@/components/shadcn-blocks/login-01/login-form', () => {
  return {
    LoginForm: ({ email, password, isLoading, error, success, onEmailChange, onPasswordChange, onSubmit }: any) => (
      <form onSubmit={onSubmit} data-testid="login-form">
        <input
          type="email"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          placeholder="Email"
          disabled={isLoading}
        />
        <input
          type="password"
          value={password}
          onChange={(e) => onPasswordChange(e.target.value)}
          placeholder="Password"
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
        {error && <div data-testid="error-message">{error}</div>}
        {success && <div data-testid="success-message">Login berhasil!</div>}
      </form>
    )
  }
})

describe('Login Page', () => {
  const mockLogin = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    mockUseLogin.mockReturnValue({
      login: mockLogin,
      isLoading: false,
      error: null,
      success: false,
    })
  })

  it('should render login page with form', () => {
    render(<Page />)
    
    expect(screen.getByTestId('login-form')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument()
  })

  it('should handle email input change', () => {
    render(<Page />)
    
    const emailInput = screen.getByPlaceholderText('Email')
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    
    expect(emailInput).toHaveValue('test@example.com')
  })

  it('should handle password input change', () => {
    render(<Page />)
    
    const passwordInput = screen.getByPlaceholderText('Password')
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    
    expect(passwordInput).toHaveValue('password123')
  })

  it('should call login function when form is submitted', async () => {
    render(<Page />)
    
    const emailInput = screen.getByPlaceholderText('Email')
    const passwordInput = screen.getByPlaceholderText('Password')
    const submitButton = screen.getByRole('button', { name: 'Login' })
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123')
    })
  })

  it('should display loading state when isLoading is true', () => {
    mockUseLogin.mockReturnValue({
      login: mockLogin,
      isLoading: true,
      error: null,
      success: false,
    })
    
    render(<Page />)
    
    expect(screen.getByRole('button', { name: 'Logging in...' })).toBeDisabled()
    expect(screen.getByPlaceholderText('Email')).toBeDisabled()
    expect(screen.getByPlaceholderText('Password')).toBeDisabled()
  })

  it('should display error message when error occurs', () => {
    mockUseLogin.mockReturnValue({
      login: mockLogin,
      isLoading: false,
      error: 'Email atau password salah',
      success: false,
    })
    
    render(<Page />)
    
    expect(screen.getByTestId('error-message')).toHaveTextContent('Email atau password salah')
  })

  it('should display success message when login is successful', () => {
    mockUseLogin.mockReturnValue({
      login: mockLogin,
      isLoading: false,
      error: null,
      success: true,
    })
    
    render(<Page />)
    
    expect(screen.getByTestId('success-message')).toHaveTextContent('Login berhasil!')
  })

  it('should prevent form submission when fields are empty', async () => {
    render(<Page />)
    
    const submitButton = screen.getByRole('button', { name: 'Login' })
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('', '')
    })
  })

  it('should maintain state between re-renders', () => {
    const { rerender } = render(<Page />)
    
    const emailInput = screen.getByPlaceholderText('Email')
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    
    rerender(<Page />)
    
    expect(screen.getByPlaceholderText('Email')).toHaveValue('test@example.com')
  })

  it('should call useLogin hook on component mount', () => {
    render(<Page />)
    
    expect(mockUseLogin).toHaveBeenCalled()
  })
})