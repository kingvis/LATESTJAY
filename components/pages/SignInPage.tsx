import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, NavLink } from 'react-router-dom';

export const SignInPage = () => {
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSignIn = (e: React.FormEvent) => {
        e.preventDefault();
        // In a real app, you would validate credentials
        login();
        navigate('/ai-studio');
    };

    return (
        <div className="py-16 md:py-24 flex items-center justify-center">
            <div className="max-w-md w-full mx-auto p-8 bg-card/50 backdrop-blur-sm rounded-lg border border-border">
                <h1 className="text-3xl font-bold text-center mb-6">Sign In</h1>
                <form onSubmit={handleSignIn} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-muted-foreground">Email</label>
                        <input type="email" id="email" className="mt-1 block w-full bg-accent border border-border rounded-md shadow-sm py-2 px-3 text-foreground focus:outline-none focus:ring-ring focus:border-ring" defaultValue="test@example.com" required />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-muted-foreground">Password</label>
                        <input type="password" id="password" className="mt-1 block w-full bg-accent border border-border rounded-md shadow-sm py-2 px-3 text-foreground focus:outline-none focus:ring-ring focus:border-ring" defaultValue="password" required />
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
