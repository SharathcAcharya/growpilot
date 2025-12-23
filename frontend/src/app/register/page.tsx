'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { auth } from '@/lib/firebase';
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, updateProfile, signOut } from 'firebase/auth';
import { useUserStore } from '@/store/userStore';

export default function RegisterPage() {
  const router = useRouter();
  const { firebaseUser, setFirebaseUser, logout } = useUserStore();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  // Validation helpers
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string): { valid: boolean; message: string } => {
    if (password.length < 6) {
      return { valid: false, message: 'Password must be at least 6 characters' };
    }
    if (!/[A-Za-z]/.test(password)) {
      return { valid: false, message: 'Password must contain at least one letter' };
    }
    if (!/[0-9]/.test(password)) {
      return { valid: false, message: 'Password must contain at least one number' };
    }
    return { valid: true, message: '' };
  };

  const validateName = (name: string): boolean => {
    const trimmedName = name.trim();
    // Check length
    if (trimmedName.length < 2) {
      return false;
    }
    // Check if name contains only letters and spaces (no numbers or special characters)
    const nameRegex = /^[a-zA-Z\s]+$/;
    return nameRegex.test(trimmedName);
  };

  // Auto-logout when visiting register page for security
  useEffect(() => {
    if (firebaseUser) {
      handleLogout();
    }
  }, []); // Only run once when mounted

  const handleLogout = async () => {
    try {
      if (auth) {
        await signOut(auth);
      }
      logout();
    } catch (error) {
      console.error('Logout error:', error);
      setError('Failed to logout. Please try again.');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear errors
    setError('');
    setFieldErrors(prev => ({ ...prev, [name]: '' }));

    // Real-time validation
    if (name === 'name' && value) {
      if (!validateName(value)) {
        if (value.trim().length < 2) {
          setFieldErrors(prev => ({ ...prev, name: 'Name must be at least 2 characters' }));
        } else if (!/^[a-zA-Z\s]+$/.test(value)) {
          setFieldErrors(prev => ({ ...prev, name: 'Name can only contain letters and spaces' }));
        }
      }
    }

    if (name === 'email' && value) {
      if (!validateEmail(value)) {
        setFieldErrors(prev => ({ ...prev, email: 'Please enter a valid email address' }));
      }
    }

    if (name === 'password' && value) {
      const validation = validatePassword(value);
      if (!validation.valid) {
        setFieldErrors(prev => ({ ...prev, password: validation.message }));
      }
    }

    if (name === 'confirmPassword' && value) {
      if (value !== formData.password) {
        setFieldErrors(prev => ({ ...prev, confirmPassword: 'Passwords do not match' }));
      }
    }
  };

  const validateForm = () => {
    const errors = { name: '', email: '', password: '', confirmPassword: '' };
    let isValid = true;

    // Name validation
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
      isValid = false;
    } else if (!validateName(formData.name)) {
      if (formData.name.trim().length < 2) {
        errors.name = 'Name must be at least 2 characters';
      } else {
        errors.name = 'Name can only contain letters and spaces';
      }
      isValid = false;
    }

    // Email validation
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
      isValid = false;
    } else if (!validateEmail(formData.email)) {
      errors.email = 'Please enter a valid email address';
      isValid = false;
    }

    // Password validation
    if (!formData.password) {
      errors.password = 'Password is required';
      isValid = false;
    } else {
      const validation = validatePassword(formData.password);
      if (!validation.valid) {
        errors.password = validation.message;
        isValid = false;
      }
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
      isValid = false;
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }

    // Terms validation
    if (!acceptedTerms) {
      setError('⚠️ Please accept the terms and conditions to continue');
      isValid = false;
    }

    setFieldErrors(errors);
    return isValid;
  };

  const handleEmailRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      if (!auth) {
        setError('Authentication service is not configured. Please check Firebase settings.');
        return;
      }

      // Create Firebase account
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      console.log('✅ Firebase account created:', userCredential.user.email);

      // Update display name in Firebase
      await updateProfile(userCredential.user, {
        displayName: formData.name
      });

      console.log('✅ Display name updated:', formData.name);

      // Update local state
      setFirebaseUser(userCredential.user);

      // AuthProvider will automatically:
      // 1. Detect the auth state change
      // 2. Create/fetch user profile from backend
      // 3. Redirect to dashboard
      console.log('⏳ Waiting for AuthProvider to sync with backend...');
      
      // Show success message
      setError('');
      setFormData({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
      });
    } catch (err: any) {
      console.error('❌ Registration error:', err);
      
      // Handle Firebase errors with specific messages
      if (err.code === 'auth/email-already-in-use') {
        setFieldErrors(prev => ({ ...prev, email: 'Email already registered' }));
        setError('This email is already registered. Please sign in instead or use a different email.');
      } else if (err.code === 'auth/weak-password') {
        setFieldErrors(prev => ({ ...prev, password: 'Password is too weak' }));
        setError('Please use a stronger password (at least 6 characters with letters and numbers).');
      } else if (err.code === 'auth/invalid-email') {
        setFieldErrors(prev => ({ ...prev, email: 'Invalid email format' }));
        setError('Please enter a valid email address.');
      } else if (err.code === 'auth/operation-not-allowed') {
        setError('Email/password authentication is not enabled. Please contact support.');
      } else if (err.code === 'auth/network-request-failed') {
        setError('Network error. Please check your internet connection and try again.');
      } else {
        setError(err.message || 'Failed to create account. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    setError('');
    
    if (!acceptedTerms) {
      setError('Please accept the terms and conditions');
      return;
    }

    setIsLoading(true);

    try {
      if (!auth) {
        setError('Authentication service is not configured. Please use email registration instead.');
        setIsLoading(false);
        return;
      }

      const provider = new GoogleAuthProvider();
      provider.addScope('profile');
      provider.addScope('email');
      
      const userCredential = await signInWithPopup(auth, provider);
      console.log('✅ Google sign-up successful:', userCredential.user.email);
      
      // Update local state
      setFirebaseUser(userCredential.user);
      
      // AuthProvider will handle backend sync and redirection
      console.log('⏳ Waiting for AuthProvider to sync with backend...');
    } catch (err: any) {
      console.error('Google registration error:', err);
      
      // Handle specific Firebase errors
      if (err.code === 'auth/operation-not-allowed') {
        setError('Google Sign-up is not enabled. Please use email registration instead.');
      } else if (err.code === 'auth/popup-closed-by-user') {
        setError('Sign-up cancelled. Please try again.');
      } else if (err.code === 'auth/popup-blocked') {
        setError('Pop-up blocked. Please allow pop-ups for this site.');
      } else if (err.code === 'auth/account-exists-with-different-credential') {
        setError('An account already exists with this email. Please sign in instead.');
      } else {
        setError('Failed to sign up with Google. Please use email registration instead.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-purple-900 to-black flex items-center justify-center p-3 sm:p-4 md:p-6">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse-glow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Back to Home Button */}
        <button
          onClick={() => router.push('/')}
          className="mb-3 sm:mb-4 flex items-center space-x-2 text-sm sm:text-base text-gray-400 hover:text-white transition-colors"
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>Back to Home</span>
        </button>

        {/* Logo and Title */}
        <div className="text-center mb-6 sm:mb-8 animate-fade-in">
          <h1 className="text-3xl sm:text-4xl font-bold bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">GrowPilot</h1>
          <p className="text-sm sm:text-base text-gray-200">Create your account and get started</p>
        </div>

        {/* Register Card */}
        <div className="glass p-5 sm:p-6 md:p-8 rounded-2xl shadow-2xl animate-slide-in-up">
          <form onSubmit={handleEmailRegister} className="space-y-5">
            {/* Name Input */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-200 mb-2">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                required
                className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${
                  fieldErrors.name ? 'border-red-500 focus:ring-red-500' : 'border-white/20 focus:ring-purple-500 focus:border-transparent'
                }`}
                placeholder="John Doe"
                disabled={isLoading || !!firebaseUser}
              />
              {fieldErrors.name && (
                <p className="mt-1 text-xs sm:text-sm text-red-400 flex items-center gap-1">
                  <span>⚠️</span> {fieldErrors.name}
                </p>
              )}
            </div>

            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-200 mb-2">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${
                  fieldErrors.email ? 'border-red-500 focus:ring-red-500' : 'border-white/20 focus:ring-purple-500 focus:border-transparent'
                }`}
                placeholder="john@example.com"
                disabled={isLoading || !!firebaseUser}
              />
              {fieldErrors.email && (
                <p className="mt-1 text-xs sm:text-sm text-red-400 flex items-center gap-1">
                  <span>⚠️</span> {fieldErrors.email}
                </p>
              )}
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-200 mb-2">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                placeholder="••••••••"
                disabled={isLoading || !!firebaseUser}
              />
            </div>

            {/* Confirm Password Input */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-200 mb-2">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                placeholder="••••••••"
                disabled={isLoading || !!firebaseUser}
              />
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-start">
              <input
                id="terms"
                type="checkbox"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-white/20 bg-white/10 text-purple-600 focus:ring-purple-500 focus:ring-offset-0"
                disabled={isLoading || !!firebaseUser}
              />
              <label htmlFor="terms" className="ml-3 text-sm text-gray-200">
                I agree to the{' '}
                <Link href="/terms" className="text-purple-300 hover:text-purple-200 font-semibold">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/privacy" className="text-purple-300 hover:text-purple-200 font-semibold">
                  Privacy Policy
                </Link>
              </label>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 animate-shake">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            {/* Register Button */}
            <button
              type="submit"
              disabled={isLoading || !!firebaseUser}
              className="w-full py-3 bg-linear-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <div className="spinner spinner-sm mr-2"></div>
                  Creating account...
                </span>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/20"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-gray-900/80 text-gray-200">Or sign up with</span>
            </div>
          </div>

          {/* Google Sign Up */}
          <button
            onClick={handleGoogleRegister}
            disabled={isLoading || !!firebaseUser}
            className="w-full py-3 bg-white/10 border border-white/20 text-white font-semibold rounded-lg hover:bg-white/15 hover:border-purple-400/50 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span>Sign up with Google</span>
          </button>

          <p className="text-xs text-gray-400 text-center mt-3">
            Google Sign-up requires Firebase configuration
          </p>

          {/* Sign In Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-200">
              Already have an account?{' '}
              <Link href="/login" className="text-purple-300 hover:text-purple-200 font-semibold transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </div>

        {/* Back to Home */}
        <div className="mt-6 text-center">
          <Link href="/" className="text-gray-400 hover:text-white transition-colors inline-flex items-center">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
