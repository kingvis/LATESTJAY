import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';

export const SignUpPage = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'student' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

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

        setFormData(newFormData);
        setError('');
    };

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) {
            setLoading(true);
            try {
                // Call backend API
                const response = await axios.post('http://localhost:5000/signup', formData);

                // If successful, log the user in locally
                login({
                    id: response.data.user._id,
                    name: response.data.user.name,
                    email: response.data.user.email,
                    role: response.data.user.role as 'student' | 'teacher' | 'admin'
                });

                navigate('/dashboard');
            } catch (err: any) {
                console.error('Signup failed:', err);
                setError(err.response?.data?.message || 'Failed to create account. Please try again.');
            } finally {
                setLoading(false);
            }
        }
    };

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
                                placeholder="Password"
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
                        <div className="text-red-500 text-sm text-center">
                            {error}
                        </div>
                    )}

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring disabled:opacity-50"
                        >
                            {loading ? 'Creating Account...' : 'Sign up'}
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