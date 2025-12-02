import React, { useState } from 'react';
import { useAuth, UserRole } from '../../contexts/AuthContext';
import { useNavigate, NavLink } from 'react-router-dom';
import { cn } from '../../lib/utils';

export const SignUpPage = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'student' as UserRole });
    const [errors, setErrors] = useState({ name: '', email: '', password: '' });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const validate = () => {
        const newErrors = { name: '', email: '', password: '' };
        let isValid = true;

        if (!formData.name.trim()) {
            newErrors.name = 'Full Name is required.';
            isValid = false;
        }

        if (!formData.email) {
            newErrors.email = 'Email is required.';
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email address is invalid.';
            isValid = false;
        }

        if (!formData.password) {
            newErrors.password = 'Password is required.';
            isValid = false;
        } else if (formData.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters long.';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };


    const handleSignUp = (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) {
            // In a real app, you would create a new user
            login({
                name: formData.name,
                email: formData.email,
                role: formData.role
            });
            navigate('/dashboard');
        }
    };

    return (
        <div className="py-16 md:py-24 flex items-center justify-center">
            <div className="max-w-md w-full mx-auto p-8 bg-card/50 backdrop-blur-sm rounded-lg border border-border">
                <h1 className="text-3xl font-bold text-center mb-6">Sign Up</h1>
                <form onSubmit={handleSignUp} className="space-y-6">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-muted-foreground">Full Name</label>
                        <input
                            type="text"
                            id="name"
                            className={cn(
                                "mt-1 block w-full bg-accent border border-border rounded-md shadow-sm py-2 px-3 text-foreground focus:outline-none focus:ring-ring focus:border-ring",
                                { "border-destructive focus:border-destructive": errors.name }
                            )}
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-muted-foreground">Email</label>
                        <input
                            type="email"
                            id="email"
                            className={cn(
                                "mt-1 block w-full bg-accent border border-border rounded-md shadow-sm py-2 px-3 text-foreground focus:outline-none focus:ring-ring focus:border-ring",
                                { "border-destructive focus:border-destructive": errors.email }
                            )}
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-muted-foreground">Password</label>
                        <input
                            type="password"
                            id="password"
                            className={cn(
                                "mt-1 block w-full bg-accent border border-border rounded-md shadow-sm py-2 px-3 text-foreground focus:outline-none focus:ring-ring focus:border-ring",
                                { "border-destructive focus:border-destructive": errors.password }
                            )}
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                        {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                    </div>
                    <div>
                        <label htmlFor="role" className="block text-sm font-medium text-muted-foreground">I am a...</label>
                        <select
                            id="role"
                            className="mt-1 block w-full bg-accent border border-border rounded-md shadow-sm py-2 px-3 text-foreground focus:outline-none focus:ring-ring focus:border-ring"
                            value={formData.role}
                            onChange={handleChange}
                        >
                            <option value="student">Student</option>
                            <option value="teacher">Teacher</option>
                        </select>
                    </div>
                    <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-full shadow-sm text-sm font-medium text-secondary bg-secondary-foreground hover:bg-secondary-foreground/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring transition-all">
                        Sign Up
                    </button>
                </form>
                <p className="mt-6 text-center text-sm text-muted-foreground">
                    Already have an account?{' '}
                    <NavLink to="/signin" className="font-medium text-secondary hover:underline">
                        Sign in
                    </NavLink>
                </p>
            </div>
        </div>
    );
};