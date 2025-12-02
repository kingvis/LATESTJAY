import React, { useState } from 'react';
import { useAuth, UserRole } from '../../contexts/AuthContext';
import { useNavigate, NavLink } from 'react-router-dom';
import { cn } from '../../lib/utils';

export const SignInPage = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState('test@example.com');
    const [password, setPassword] = useState('password');
    const [role, setRole] = useState<UserRole>('student');
    const [errors, setErrors] = useState({ email: '', password: '' });

    const validate = () => {
        const newErrors = { email: '', password: '' };
        let isValid = true;

        if (!email) {
            newErrors.email = 'Email is required.';
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = 'Email address is invalid.';
            isValid = false;
        }

        if (!password) {
            newErrors.password = 'Password is required.';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };


    const handleSignIn = (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) {
            // In a real app, you would validate credentials
            login({
                name: 'Test User',
                email: email,
                role: role
            });
            navigate('/dashboard');
        }
    };

    return (
        <div className="py-16 md:py-24 flex items-center justify-center">
            <div className="max-w-md w-full mx-auto p-8 bg-card/50 backdrop-blur-sm rounded-lg border border-border">
                <h1 className="text-3xl font-bold text-center mb-6">Sign In</h1>
                <form onSubmit={handleSignIn} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-muted-foreground">Email</label>
                        <input
                            type="email"
                            id="email"
                            className={cn(
                                "mt-1 block w-full bg-accent border border-border rounded-md shadow-sm py-2 px-3 text-foreground focus:outline-none focus:ring-ring focus:border-ring",
                                { "border-destructive focus:border-destructive": errors.email }
                            )}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
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
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                    </div>
                    <div>
                        <label htmlFor="role" className="block text-sm font-medium text-muted-foreground">Sign in as...</label>
                        <select
                            id="role"
                            className="mt-1 block w-full bg-accent border border-border rounded-md shadow-sm py-2 px-3 text-foreground focus:outline-none focus:ring-ring focus:border-ring"
                            value={role}
                            onChange={(e) => setRole(e.target.value as UserRole)}
                        >
                            <option value="student">Student</option>
                            <option value="teacher">Teacher</option>
                        </select>
                    </div>
                    <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-full shadow-sm text-sm font-medium text-secondary bg-secondary-foreground hover:bg-secondary-foreground/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring transition-all">
                        Sign In
                    </button>
                </form>
                <p className="mt-6 text-center text-sm text-muted-foreground">
                    Don't have an account?{' '}
                    <NavLink to="/signup" className="font-medium text-secondary hover:underline">
                        Sign up
                    </NavLink>
                </p>
            </div>
        </div>
    );
};