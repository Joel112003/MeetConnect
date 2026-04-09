import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { validateLoginForm, formatValidationError } from '../utils/validators'
import { useAuth } from '../hooks/useAuth'

export default function LoginPage() {
  const navigate = useNavigate()
  const { login, loading: authLoading } = useAuth()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    // Validate form
    const validation = validateLoginForm({ email, password })
    if (!validation.isValid) {
      setError(formatValidationError(validation.errors))
      return
    }

    try {
      const result = await login(email, password)

      if (result.success) {
        setSuccess('Login successful! Redirecting...')
        // Redirect after brief delay
        setTimeout(() => {
          navigate('/dashboard')
        }, 500)
      } else {
        setError(result.error || 'Login failed')
      }
    } catch (err) {
      setError(err.message || 'An error occurred during login')
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100 p-4 overflow-hidden">
      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl p-8 md:p-12 border border-white/20" style={{ animation: 'slideInUp 0.7s ease-out' }}>
          
          {/* Header */}
          <div className="text-center mb-10" style={{ animation: 'slideInUp 0.7s ease-out 0.1s backwards' }}>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent mb-2">
              Welcome Back
            </h1>
            <p className="text-gray-600 text-sm font-medium tracking-wide">
              Sign in to your account
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-5 p-3 bg-red-50 border-l-4 border-red-500 text-red-600 text-sm rounded flex items-center gap-2" style={{ animation: 'slideInUp 0.3s ease-out' }}>
              <span className="text-xl">⚠</span>
              <span>{error}</span>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="mb-5 p-3 bg-green-50 border-l-4 border-green-500 text-green-600 text-sm rounded flex items-center gap-2" style={{ animation: 'slideInUp 0.3s ease-out' }}>
              <span className="text-xl">✓</span>
              <span>{success}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            
            {/* Email Field */}
            <div style={{ animation: 'slideInUp 0.7s ease-out 0.2s backwards' }}>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-800 uppercase tracking-wider mb-2">
                Email Address
              </label>
              <div className="relative group">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-600 text-lg group-focus-within:scale-110 transition-transform">
                  ✉
                </span>
                <input
                  type="email"
                  id="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  required
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-lg font-medium text-gray-800 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            {/* Password Field */}
            <div style={{ animation: 'slideInUp 0.7s ease-out 0.3s backwards' }}>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-800 uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative group">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-600 text-lg group-focus-within:scale-110 transition-transform">
                  🔒
                </span>
                <input
                  type="password"
                  id="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  required
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-lg font-medium text-gray-800 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between text-sm" style={{ animation: 'slideInUp 0.7s ease-out 0.4s backwards' }}>
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  disabled={authLoading}
                  className="w-4 h-4 accent-blue-600 cursor-pointer rounded disabled:cursor-not-allowed"
                />
                <span className="text-gray-700 font-medium group-hover:text-blue-600 transition-colors">
                  Remember me
                </span>
              </label>
              <a
                href="/forgot-password"
                className="text-blue-600 font-semibold hover:text-blue-700 transition-colors duration-300"
              >
                Forgot Password?
              </a>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={authLoading}
              className="w-full mt-8 py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold text-sm uppercase tracking-wide rounded-lg shadow-lg hover:shadow-xl hover:translate-y-[-2px] active:translate-y-[-1px] disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0 transition-all duration-300 relative overflow-hidden group"
              style={{ animation: 'slideInUp 0.7s ease-out 0.5s backwards' }}
            >
              <span className="absolute inset-0 bg-white/30 translate-x-full group-hover:translate-x-0 transition-transform duration-500"></span>
              <span className="relative flex items-center justify-center gap-2">
                {authLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    SIGNING IN...
                  </>
                ) : (
                  'Sign In'
                )}
              </span>
            </button>
          </form>

          {/* Signup Link */}
          <div className="mt-8 text-center text-sm text-gray-600" style={{ animation: 'slideInUp 0.7s ease-out 0.6s backwards' }}>
            Don't have an account?{' '}
            <a
              href="/signup"
              className="text-blue-600 font-bold hover:text-blue-700 transition-colors duration-300"
            >
              Create one
            </a>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(1rem);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}
