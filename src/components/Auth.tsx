import React from 'react';
    import {
      BookOpen,
      Mail,
      Lock,
      Eye,
      EyeOff,
      Loader2,
      HelpCircle,
      AlertCircle,
      User,
      Users,
      ShieldCheck,
    } from 'lucide-react';
    import { supabase } from '../lib/supabase';
    import { z } from 'zod';

    interface AuthProps {
      onLogin: () => void;
    }

    const emailSchema = z.string().email('Please enter a valid email address');
    const passwordSchema = z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]).*$/,
        'Password must include at least one uppercase letter, one lowercase letter, one number, and one special character'
      );

    export default function Auth({ onLogin }: AuthProps) {
      const [email, setEmail] = React.useState('');
      const [password, setPassword] = React.useState('');
      const [showPassword, setShowPassword] = React.useState(false);
      const [loading, setLoading] = React.useState(false);
      const [error, setError] = React.useState<string | null>(null);
      const [showHelp, setShowHelp] = React.useState(false);
      const [activeTab, setActiveTab] = React.useState<'student' | 'teacher' | 'admin'>('student');
      const [isSignUp, setIsSignUp] = React.useState(false);

      const validateForm = () => {
        try {
          emailSchema.parse(email);
          passwordSchema.parse(password);
          return true;
        } catch (err) {
          if (err instanceof z.ZodError) {
            setError(err.errors[0].message);
          }
          return false;
        }
      };

      const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        setError(null);

        try {
          let authResponse;
          if (isSignUp) {
            authResponse = await supabase.auth.signUp({
              email,
              password,
            });
          } else {
            authResponse = await supabase.auth.signInWithPassword({
              email,
              password,
            });
          }

          if (authResponse.error) {
            if (authResponse.error.message === 'Invalid login credentials') {
              throw new Error('Incorrect email or password. Please try again.');
            }
            throw authResponse.error;
          }

          onLogin();
        } catch (err: any) {
          setError(err.message || 'An error occurred during login');
        } finally {
          setLoading(false);
        }
      };

      const handleForgotPassword = async () => {
        if (!email) {
          setError('Please enter your email address');
          return;
        }

        try {
          const { error } = await supabase.auth.resetPasswordForEmail(email);
          if (error) throw error;
          setError('Password reset instructions sent to your email');
        } catch (err: any) {
          setError(err.message);
        }
      };

      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-indigo-500 to-purple-600 text-gray-900">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-100 mb-4">
                <BookOpen className="w-8 h-8 text-indigo-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">EduFlow</h1>
              <p className="text-gray-600 mt-2">
                {isSignUp ? 'Create your account' : 'Sign in to your account'}
              </p>
            </div>

            <div className="flex justify-center space-x-4 mb-6">
              <button
                onClick={() => setActiveTab('student')}
                className={`px-4 py-2 rounded-md text-sm font-medium focus:outline-none transition-colors ${
                  activeTab === 'student'
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <div className="flex items-center">
                  <User className="w-4 h-4 mr-2" />
                  Student Login
                </div>
              </button>
              <button
                onClick={() => setActiveTab('teacher')}
                className={`px-4 py-2 rounded-md text-sm font-medium focus:outline-none transition-colors ${
                  activeTab === 'teacher'
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-2" />
                  Teacher Login
                </div>
              </button>
              <button
                onClick={() => setActiveTab('admin')}
                className={`px-4 py-2 rounded-md text-sm font-medium focus:outline-none transition-colors ${
                  activeTab === 'admin'
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <div className="flex items-center">
                  <ShieldCheck className="w-4 h-4 mr-2" />
                  Admin Login
                </div>
              </button>
            </div>

            {error && (
              <div className={`mb-6 p-4 rounded-lg flex items-start ${
                error.includes('sent to your email')
                  ? 'bg-green-50'
                  : 'bg-red-50'
              }`}>
                <AlertCircle className={`w-5 h-5 mt-0.5 mr-3 flex-shrink-0 ${
                  error.includes('sent to your email')
                    ? 'text-green-500'
                    : 'text-red-500'
                }`} />
                <p className={`text-sm ${
                  error.includes('sent to your email')
                    ? 'text-green-600'
                    : 'text-red-600'
                }`}>{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError(null);
                    }}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder={`${activeTab === 'student' ? 'student' : activeTab === 'teacher' ? 'teacher' : 'admin'}@example.com`}
                    required
                    aria-label="Email address"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError(null);
                    }}
                    className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Enter your password"
                    required
                    aria-label="Password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setShowHelp(!showHelp)}
                  className="text-sm text-indigo-600 hover:text-indigo-500 flex items-center"
                >
                  <HelpCircle className="w-4 h-4 mr-1" />
                  Need help?
                </button>
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-sm text-indigo-600 hover:text-indigo-500"
                >
                  Forgot password?
                </button>
              </div>

              {showHelp && (
                <div className="p-4 rounded-lg bg-blue-50 text-sm text-blue-700">
                  <h3 className="font-medium mb-2">Help & Support</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Make sure you're using your school-provided email address</li>
                    <li>Password should be at least 8 characters long</li>
                    <li>Contact your administrator if you can't access your account</li>
                    <li>For technical support, email: support@eduflow.com</li>
                  </ul>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  isSignUp ? 'Sign up' : 'Sign in'
                )}
              </button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    {isSignUp ? 'Already have an account?' : 'First time here?'}
                  </span>
                </div>
              </div>
              <p className="mt-4 text-center text-sm text-gray-600">
                {isSignUp ? (
                  <button
                    onClick={() => setIsSignUp(false)}
                    className="text-indigo-600 hover:text-indigo-500"
                  >
                    Sign in
                  </button>
                ) : (
                  <>
                    Contact your school administrator to get your login credentials or
                    <button
                      onClick={() => setIsSignUp(true)}
                      className="text-indigo-600 hover:text-indigo-500 ml-1"
                    >
                      Sign up
                    </button>
                  </>
                )}
              </p>
            </div>
          </div>
        </div>
      );
    }
