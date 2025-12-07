import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth, UserRole } from '../../contexts/AuthContext';

export const SignUpPage = () => {
    const navigate = useNavigate();
    const { signup, loading: authLoading } = useAuth();
    const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'student' as UserRole });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const validate = () => {
        if (!formData.name || !formData.email || !formData.password) {
            setError('All fields are required');
            return false;
        }
        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            return false;
        }
        return true;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { id, value } = e.target;
        let newFormData = { ...formData, [id]: value };

        // Auto-detect Admin role for @jay.com
        if (id === 'email') {
            if (value.endsWith('@jay.com')) {
                newFormData.role = 'admin';
            } else if (formData.role === 'admin') {
                // Reset to student if changing away from jay.com and was admin
                newFormData.role = 'student';
            }
        }

        setFormData(newFormData as typeof formData);
        setError('');
    };

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) {
            setLoading(true);
            setError('');
            try {
                await signup(formData.email, formData.password, formData.name, formData.role);
                setSuccess(true);
                // Navigate after a short delay to allow state to update
                setTimeout(() => navigate('/dashboard'), 1000);
            } catch (err: any) {
                console.error('Signup failed:', err);
                // Handle specific Supabase errors
                if (err.message?.includes('already registered')) {
                    setError('This email is already registered. Please sign in instead.');
                } else if (err.message?.includes('Password')) {
                    setError(err.message);
                } else {
                    setError(err.message || 'Failed to create account. Please try again.');
                }
            } finally {
                setLoading(false);
            }
        }
    };

    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (success) {
        return (
            <div className="min-h-screen pt-20 pb-12 flex flex-col items-center justify-center px-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center space-y-4"
                >
                    <div className="w-16 h-16 mx-auto bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-foreground">Account Created!</h2>
                    <p className="text-muted-foreground">Redirecting to your dashboard...</p>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-20 pb-12 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md space-y-8"
            >
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-foreground">
                        Create your account
                    </h2>
                    <p className="mt-2 text-center text-sm text-muted-foreground">
                        Join Jay Music Academy today
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSignUp}>
                    <div className="rounded-md shadow-sm space-y-4">
                        <div>
                            <label htmlFor="name" className="sr-only">Full Name</label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-border placeholder-muted-foreground text-foreground rounded-t-md focus:outline-none focus:ring-ring focus:border-ring focus:z-10 sm:text-sm bg-background"
                                placeholder="Full Name"
                                value={formData.name}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label htmlFor="email" className="sr-only">Email address</label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-border placeholder-muted-foreground text-foreground focus:outline-none focus:ring-ring focus:border-ring focus:z-10 sm:text-sm bg-background"
                                placeholder="Email address"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">Password</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="new-password"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-border placeholder-muted-foreground text-foreground rounded-b-md focus:outline-none focus:ring-ring focus:border-ring focus:z-10 sm:text-sm bg-background"
                                placeholder="Password (min 6 characters)"
                                value={formData.password}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label htmlFor="role" className="block text-sm font-medium text-muted-foreground mb-1">I am a...</label>
                            <select
                                id="role"
                                className="block w-full bg-background border border-border rounded-md shadow-sm py-2 px-3 text-foreground focus:outline-none focus:ring-ring focus:border-ring sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                value={formData.role}
                                onChange={handleChange}
                                disabled={formData.email.endsWith('@jay.com')}
                            >
                                {formData.email.endsWith('@jay.com') ? (
                                    <option value="admin">Admin Staff</option>
                                ) : (
                                    <>
                                        <option value="student">Student</option>
                                        <option value="teacher">Teacher</option>
                                    </>
                                )}
                            </select>
                            {formData.email.endsWith('@jay.com') && (
                                <p className="text-xs text-muted-foreground mt-1">
                                    * @jay.com emails are automatically assigned as Admin Staff.
                                </p>
                            )}
                        </div>
                    </div>

                    {error && (
                        <div className="text-red-500 text-sm text-center bg-red-50 dark:bg-red-900/20 p-3 rounded-md">
                            {error}
                        </div>
                    )}

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring disabled:opacity-50"
                        >
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Creating Account...
                                </span>
                            ) : 'Sign up'}
                        </button>
                    </div>
                    <div className="text-center text-sm">
                        <span className="text-muted-foreground">Already have an account? </span>
                        <Link to="/signin" className="font-medium text-primary hover:text-primary/80">
                            Sign in
                        </Link>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};