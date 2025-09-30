import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { LoginForm } from '@/components/shadcn-blocks/login-01/login-form'

// Mock props untuk testing
const mockProps = {
  email: '',
  password: '',
  isLoading: false,
  error: null,
  success: false,
  onEmailChange: jest.fn(),
  onPasswordChange: jest.fn(),
  onSubmit: jest.fn(),
}

describe('LoginForm Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render login form with all elements', () => {
    render(<LoginForm {...mockProps} />)
    
    expect(screen.getByText('Login to your account')).toBeInTheDocument()
    expect(screen.getByText('Enter your email below to login to your account')).toBeInTheDocument()
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
    expect(screen.getByLabelText('Password')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument()
  })

  it('should display email and password values from props', () => {
    const propsWithValues = {
      ...mockProps,
      email: 'test@example.com',
      password: 'password123',
    }
    
    render(<LoginForm {...propsWithValues} />)
    
    expect(screen.getByDisplayValue('test@example.com')).toBeInTheDocument()
    expect(screen.getByDisplayValue('password123')).toBeInTheDocument()
  })

  it('should call onEmailChange when email input changes', () => {
    render(<LoginForm {...mockProps} />)
    
    const emailInput = screen.getByLabelText('Email')
    fireEvent.change(emailInput, { target: { value: 'new@example.com' } })
    
    expect(mockProps.onEmailChange).toHaveBeenCalledWith('new@example.com')
  })

  it('should call onPasswordChange when password input changes', () => {
    render(<LoginForm {...mockProps} />)
    
    const passwordInput = screen.getByLabelText('Password')
    fireEvent.change(passwordInput, { target: { value: 'newpassword' } })
    
    expect(mockProps.onPasswordChange).toHaveBeenCalledWith('newpassword')
  })

  it('should call onSubmit when form is submitted', () => {
    render(<LoginForm {...mockProps} />)
    
    const form = screen.getByRole('button', { name: 'Login' }).closest('form')
    fireEvent.submit(form!)
    
    expect(mockProps.onSubmit).toHaveBeenCalled()
  })

  it('should display error message when error prop is provided', () => {
    const propsWithError = {
      ...mockProps,
      error: 'Email atau password salah',
    }
    
    render(<LoginForm {...propsWithError} />)
    
    expect(screen.getByText('Email atau password salah')).toBeInTheDocument()
    expect(screen.getByText('Email atau password salah')).toHaveClass('text-red-600')
  })

  it('should display success message when success prop is true', () => {
    const propsWithSuccess = {
      ...mockProps,
      success: true,
    }
    
    render(<LoginForm {...propsWithSuccess} />)
    
    expect(screen.getByText('Login berhasil! Mengalihkan...')).toBeInTheDocument()
    expect(screen.getByText('Login berhasil! Mengalihkan...')).toHaveClass('text-green-600')
  })

  it('should disable inputs and show loading text when isLoading is true', () => {
    const propsWithLoading = {
      ...mockProps,
      isLoading: true,
    }
    
    render(<LoginForm {...propsWithLoading} />)
    
    expect(screen.getByLabelText('Email')).toBeDisabled()
    expect(screen.getByLabelText('Password')).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Logging in...' })).toBeDisabled()
  })

  it('should not display error or success messages when both are null/false', () => {
    render(<LoginForm {...mockProps} />)
    
    expect(screen.queryByText(/Email atau password salah/)).not.toBeInTheDocument()
    expect(screen.queryByText(/Login berhasil/)).not.toBeInTheDocument()
  })

  it('should have proper form structure and accessibility', () => {
    render(<LoginForm {...mockProps} />)
    
    const emailInput = screen.getByLabelText('Email')
    const passwordInput = screen.getByLabelText('Password')
    
    expect(emailInput).toHaveAttribute('type', 'email')
    expect(emailInput).toHaveAttribute('required')
    expect(passwordInput).toHaveAttribute('type', 'password')
    expect(passwordInput).toHaveAttribute('required')
  })

  it('should render forgot password link', () => {
    render(<LoginForm {...mockProps} />)
    
    expect(screen.getByText('Forgot your password?')).toBeInTheDocument()
  })

  it('should render sign up link', () => {
    render(<LoginForm {...mockProps} />)
    
    expect(screen.getByText('Sign up')).toBeInTheDocument()
  })

  it('should render Google login button', () => {
    render(<LoginForm {...mockProps} />)
    
    expect(screen.getByText('Login with Google')).toBeInTheDocument()
  })
})