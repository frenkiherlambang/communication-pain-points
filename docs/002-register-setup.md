# Registration Setup Guide

## Overview
This guide explains how to set up the registration functionality that connects to Supabase for user authentication.

## Current Implementation Status
✅ **Complete and Working**: The registration system is fully implemented and ready to use once Supabase is configured.

### What's Already Implemented:
1. **Register Page** (`/app/register/page.tsx`) - Complete UI with form handling
2. **RegisterForm Component** (`/components/shadcn-blocks/register-01/register-form.tsx`) - Stateless form component
3. **useRegister Hook** (`/hooks/use-register.ts`) - State management for registration
4. **API Route** (`/app/api/api/register/route.ts`) - Backend endpoint with validation
5. **Supabase Integration** - Uses Supabase Auth for user management

## Setup Instructions

### 1. Configure Supabase Environment Variables

The registration system requires Supabase credentials. Update the `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**How to get these values:**
1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project (or create a new one)
3. Go to Settings > API
4. Copy the "Project URL" and "anon public" key

### 2. Supabase Authentication Setup

The registration uses Supabase Auth, which automatically creates users in the `auth.users` table. No additional database setup is required for basic authentication.

**Optional: Custom User Data**
If you want to store additional user information, you can use the existing `users` table defined in `/types/sql/users.sql`:

```sql
create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  account_id text not null,
  platform text not null,
  profile_url text,
  first_interaction_date date,
  last_interaction_date date,
  total_interactions int default 0,
  avg_sentiment numeric(3,2) default 0.0
);
```

### 3. Test the Registration

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Navigate to: `http://localhost:3002/register`

3. Fill out the registration form:
   - Email: Valid email address
   - Password: Minimum 6 characters
   - Confirm Password: Must match password

4. Submit the form and check for:
   - Success message
   - Email confirmation (if enabled in Supabase)
   - Automatic redirect to login page after 3 seconds

## Features

### Form Validation
- ✅ Email format validation
- ✅ Password minimum length (6 characters)
- ✅ Password confirmation matching
- ✅ Required field validation

### Error Handling
- ✅ User-friendly error messages
- ✅ Duplicate email detection
- ✅ Network error handling
- ✅ Server error handling

### User Experience
- ✅ Loading states during registration
- ✅ Success feedback
- ✅ Automatic redirect to login
- ✅ Responsive design
- ✅ Accessibility support

### Security
- ✅ Server-side validation
- ✅ Secure password handling
- ✅ Environment variable protection
- ✅ HTTPS communication with Supabase

## API Endpoints

### POST /api/api/register
Handles user registration with validation.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "confirmPassword": "password123"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Registrasi berhasil! Silakan cek email untuk konfirmasi akun",
  "user": { ... },
  "session": { ... }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "Email sudah terdaftar. Silakan gunakan email lain atau login"
}
```

## Troubleshooting

### Common Issues:

1. **"Registrasi gagal" Error**
   - Check if Supabase environment variables are set correctly
   - Verify Supabase project is active and accessible

2. **"Email sudah terdaftar" Error**
   - User already exists in Supabase Auth
   - Direct them to login page instead

3. **Network Errors**
   - Check internet connection
   - Verify Supabase project URL is correct

4. **Email Confirmation Not Working**
   - Check Supabase Auth settings
   - Verify email templates are configured
   - Check spam folder

### Development Tips:

1. **Testing Registration:**
   - Use temporary email services for testing
   - Check Supabase Auth dashboard for registered users
   - Monitor browser network tab for API calls

2. **Debugging:**
   - Check browser console for errors
   - Review server logs in terminal
   - Use Supabase dashboard to monitor auth events

## Next Steps

After successful registration setup:

1. **Email Confirmation**: Configure email templates in Supabase
2. **User Profiles**: Implement user profile management
3. **Password Reset**: Add forgot password functionality
4. **Social Login**: Add Google/GitHub OAuth options
5. **User Roles**: Implement role-based access control

## Related Files

- `/app/register/page.tsx` - Registration page
- `/components/shadcn-blocks/register-01/register-form.tsx` - Form component
- `/hooks/use-register.ts` - Registration hook
- `/app/api/api/register/route.ts` - API endpoint
- `/lib/supabase.ts` - Supabase configuration
- `/docs/001-login-implementation.md` - Login documentation