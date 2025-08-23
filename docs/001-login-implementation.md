# Dokumentasi Implementasi Login

## Overview
Implementasi sistem login menggunakan Supabase sebagai backend authentication dengan Next.js 15 dan TypeScript.

## Arsitektur

### 1. Supabase Client Configuration
**File:** `lib/supabase.ts`

Konfigurasi client Supabase dengan environment variables:
- `NEXT_PUBLIC_SUPABASE_URL`: URL instance Supabase
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Anonymous key untuk akses public

### 2. API Route
**File:** `app/api/api/login/route.ts`

### 3. Custom Hook
**File:** `hooks/use-login.ts`

**Fungsi:** Mengelola state dan logika login di client-side
**Return:** `{ login, isLoading, error, success }`
**Penggunaan:** Digunakan di level halaman (page), bukan di komponen

### 4. Arsitektur Stateless Components
- **Komponen LoginForm**: Sepenuhnya stateless, menerima semua data melalui props
- **Halaman Login**: Mengelola state menggunakan `useLogin` hook dan meneruskan data ke komponen
- **Separation of Concerns**: Logika bisnis di halaman, presentasi di komponen

#### Props Interface untuk LoginForm:
```typescript
interface LoginFormProps extends React.ComponentProps<"form"> {
  email: string
  password: string
  isLoading: boolean
  error: string | null
  success: boolean
  onEmailChange: (email: string) => void
  onPasswordChange: (password: string) => void
  onSubmit: (e: FormEvent) => void
}
```

### 5. API Route Details
**File:** `app/api/api/login/route.ts`

#### Endpoints:
- **POST /api/api/login**: Endpoint untuk proses login
- **GET /api/api/login**: Informasi API endpoint

#### Request Body (POST):
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

#### Response Success (200):
```json
{
  "success": true,
  "message": "Login berhasil",
  "user": {
    "id": "user-id",
    "email": "user@example.com",
    "user_metadata": {}
  },
  "session": {
    "access_token": "jwt-token",
    "refresh_token": "refresh-token"
  }
}
```

#### Response Error:
- **400**: Email atau password tidak diisi
- **401**: Kredensial tidak valid atau email belum dikonfirmasi
- **500**: Error server internal

### 3. Custom Hook
**File:** `hooks/use-login.ts`

#### Interface:
```typescript
interface UseLoginReturn {
  login: (email: string, password: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  success: boolean;
}
```

#### Usage:
```typescript
const { login, isLoading, error, success } = useLogin();

// Memanggil login
await login('user@example.com', 'password123');
```

### 6. Login Components (Stateless)
Terdapat 5 variasi komponen login yang telah direfactor menjadi stateless:

- `components/shadcn-blocks/login-01/login-form.tsx`
- `components/shadcn-blocks/login-02/login-form.tsx`
- `components/shadcn-blocks/login-03/login-form.tsx`
- `components/shadcn-blocks/login-04/login-form.tsx`
- `components/shadcn-blocks/login-05/login-form.tsx`

#### Karakteristik Komponen Stateless:
- **No Internal State**: Tidak memiliki state internal
- **Props-driven**: Semua data diterima melalui props
- **Pure Components**: Hanya bertanggung jawab untuk rendering UI
- **Reusable**: Dapat digunakan kembali dengan data yang berbeda

#### Contoh Penggunaan di Halaman:
```typescript
"use client"

import { LoginForm } from "@/components/shadcn-blocks/login-01/login-form"
import { useLogin } from "@/hooks/use-login"
import { useState, FormEvent } from "react"

export default function Page() {
  const { login, isLoading, error, success } = useLogin()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    await login(email, password)
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
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
```

## Error Handling

### Client-side Errors:
1. **Validasi Input**: Email dan password wajib diisi
2. **Network Error**: Ditangani dengan pesan "Terjadi kesalahan"
3. **API Error**: Menampilkan pesan error dari server

### Server-side Errors:
1. **Invalid Credentials**: "Email atau password salah"
2. **Email Not Confirmed**: "Email belum dikonfirmasi. Silakan cek email Anda."
3. **Missing Fields**: "Email dan password harus diisi"
4. **Server Error**: "Terjadi kesalahan server"

## Security Features

1. **Environment Variables**: Kredensial Supabase disimpan dalam environment variables
2. **Input Validation**: Validasi email dan password di client dan server
3. **Error Sanitization**: Error messages tidak mengekspos informasi sensitif
4. **HTTPS**: Komunikasi dengan Supabase menggunakan HTTPS

## Testing

### Unit Tests:
- **API Route Tests**: `__tests__/api/login.test.ts`
- **Hook Tests**: `__tests__/hooks/use-login.test.ts`
- **Component Tests**: `__tests__/components/login-form.test.tsx`
- **Page Tests**: `__tests__/pages/login-page.test.tsx`

### Test Coverage:

#### API Route Tests:
- ✅ Successful login
- ✅ Invalid credentials
- ✅ Missing email/password
- ✅ Email not confirmed
- ✅ Network errors
- ✅ Server errors

#### Hook Tests:
- ✅ Loading states
- ✅ Error reset on new attempts
- ✅ Success state management

#### Component Tests (Stateless):
- ✅ Render dengan props yang benar
- ✅ Display email dan password values
- ✅ Call onEmailChange saat input berubah
- ✅ Call onPasswordChange saat input berubah
- ✅ Call onSubmit saat form disubmit
- ✅ Display error message
- ✅ Display success message
- ✅ Disable inputs saat loading
- ✅ Accessibility dan form structure

#### Page Tests:
- ✅ Render halaman dengan form
- ✅ Handle email dan password input changes
- ✅ Call login function saat form disubmit
- ✅ Display loading, error, dan success states
- ✅ Maintain state between re-renders

### Menjalankan Tests:
```bash
# Semua tests
npm test

# Test spesifik
npm test -- __tests__/components/login-form.test.tsx
npm test -- __tests__/pages/login-page.test.tsx
```

## Setup Instructions

### 1. Install Dependencies
```bash
npm install @supabase/supabase-js
```

### 2. Environment Variables
Buat file `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Supabase Configuration
1. Buat project di Supabase
2. Setup authentication providers
3. Configure email templates (opsional)
4. Setup RLS policies (jika diperlukan)

### 4. Usage dalam Komponen
```typescript
import { useLogin } from '@/hooks/use-login'
import { useState, FormEvent } from 'react'

export function LoginForm() {
  const { login, isLoading, error, success } = useLogin()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    await login(email, password)
  }

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="error">{error}</div>}
      {success && <div className="success">Login berhasil!</div>}
      
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={isLoading}
        required
      />
      
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        disabled={isLoading}
        required
      />
      
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  )
}
```

## Troubleshooting

### Common Issues:

1. **"Invalid login credentials"**
   - Pastikan email dan password benar
   - Cek apakah user sudah terdaftar di Supabase

2. **"Email not confirmed"**
   - User perlu mengkonfirmasi email terlebih dahulu
   - Cek spam folder untuk email konfirmasi

3. **Network errors**
   - Cek koneksi internet
   - Pastikan Supabase URL dan key benar
   - Cek status Supabase service

4. **Environment variables tidak terbaca**
   - Pastikan file `.env.local` ada di root project
   - Restart development server setelah menambah env vars
   - Pastikan nama variable dimulai dengan `NEXT_PUBLIC_`

## Best Practices

1. **Security**:
   - Jangan commit file `.env.local` ke repository
   - Gunakan environment variables untuk semua kredensial

2. **Component Architecture**:
   - Gunakan stateless components untuk UI yang reusable
   - Pindahkan state management ke level halaman
   - Pisahkan business logic ke custom hooks

3. **Testing**:
   - Test komponen secara terpisah dari business logic
   - Mock dependencies untuk unit testing
   - Maintain high test coverage untuk critical paths

## Changelog

### v2.0.0 - Stateless Component Architecture
**Tanggal**: Januari 2025

#### Breaking Changes:
- ✅ **Refactor LoginForm menjadi stateless**: Semua komponen login sekarang menerima props dan tidak memiliki state internal
- ✅ **Pindahkan state ke page level**: State management (email, password, loading, error) dipindahkan ke halaman yang menggunakan komponen
- ✅ **Custom Hook useLogin**: Business logic login dipindahkan ke custom hook yang reusable

#### New Features:
- ✅ **Improved Reusability**: Komponen dapat digunakan dengan data yang berbeda
- ✅ **Better Testing**: Unit test terpisah untuk komponen dan business logic
- ✅ **Enhanced Documentation**: Dokumentasi lengkap dengan contoh penggunaan

#### Technical Improvements:
- ✅ **Type Safety**: Interface props yang jelas untuk semua komponen
- ✅ **Performance**: Komponen stateless lebih ringan dan mudah di-optimize
- ✅ **Maintainability**: Separation of concerns yang lebih baik

#### Migration Guide:
Untuk mengupdate dari versi sebelumnya:
1. Update import komponen LoginForm
2. Tambahkan state management di halaman
3. Import dan gunakan useLogin hook
4. Pass props yang diperlukan ke LoginForm

```typescript
// Sebelum (v1.x)
import { LoginForm } from "@/components/login-form"

export default function Page() {
  return <LoginForm />
}

// Sesudah (v2.x)
import { LoginForm } from "@/components/login-form"
import { useLogin } from "@/hooks/use-login"
import { useState } from "react"

export default function Page() {
  const { login, isLoading, error, success } = useLogin()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    await login(email, password)
  }

  return (
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
  )
}
```
   - Implement rate limiting untuk login attempts

2. **User Experience**:
   - Berikan feedback yang jelas untuk setiap state
   - Disable form saat loading
   - Reset error state pada attempt baru

3. **Error Handling**:
   - Tangani semua kemungkinan error
   - Berikan pesan error yang user-friendly
   - Log error untuk debugging

4. **Performance**:
   - Gunakan loading states
   - Implement proper form validation
   - Cache session data jika diperlukan

## Changelog

### v1.0.0 (Current)
- ✅ Basic login functionality dengan Supabase
- ✅ 5 variasi komponen login
- ✅ Custom hook untuk state management
- ✅ Comprehensive error handling
- ✅ Unit tests untuk API dan hook
- ✅ TypeScript support
- ✅ Dokumentasi lengkap

### Future Enhancements
- [ ] Remember me functionality
- [ ] Social login (Google, GitHub, etc.)
- [ ] Password reset flow
- [ ] Two-factor authentication
- [ ] Session management
- [ ] Logout functionality