import React, { useState, useRef, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { ThemeToggle } from './ui/theme-toggle';
import { useAuth } from '../contexts/AuthContext';
import { LogOutIcon, UserIcon } from './Icons';

export const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { isAuthenticated, logout, user } = useAuth();
  const userMenuRef = useRef<HTMLDivElement>(null);

  const commonLinks = [
    { to: '/', text: 'Home' },
    { to: '/about', text: 'About' },
    { to: '/courses', text: 'Courses' },
    { to: '/branches', text: 'Branches' },
    { to: '/pricing', text: 'Pricing' },
    { to: '/contact', text: 'Contact' },
  ];

  const authLinks = [
    ...commonLinks,
    ...(user?.role !== 'admin' ? [{ to: '/dashboard', text: 'Dashboard' }] : []),
    ...(user?.role === 'admin' ? [{ to: '/staff-dashboard', text: 'Staff Analysis' }] : []),
  ];

  const navLinks = isAuthenticated ? authLinks : commonLinks;

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    setIsOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [userMenuRef]);


  return (
    <header className="fixed top-0 z-40 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <NavLink to="/" className="text-2xl font-bold text-foreground">
              Jay Music Academy
            </NavLink>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <nav className="flex items-center space-x-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive
                      ? 'bg-secondary text-secondary-foreground'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                    }`
                  }
                >
                  {link.text}
                </NavLink>
              ))}
            </nav>
            <ThemeToggle />
            {isAuthenticated ? (
              <div className="relative" ref={userMenuRef}>
                <button onClick={() => setIsUserMenuOpen(!isUserMenuOpen)} className="flex items-center justify-center h-10 w-10 rounded-full bg-accent text-accent-foreground hover:bg-secondary/20 focus:outline-none focus:ring-2 focus:ring-ring">
                  <UserIcon className="h-5 w-5" />
                </button>
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-card rounded-md shadow-lg py-1 border border-border">
                    <button onClick={handleLogout} className="w-full text-left flex items-center px-4 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground">
                      <LogOutIcon className="mr-2 h-4 w-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <NavLink to="/signin" className="px-4 py-2 rounded-md text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors">
                  Sign In
                </NavLink>
                <NavLink to="/signup" className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md text-sm font-medium transition-colors">
                  Sign Up
                </NavLink>
              </div>
            )}
          </div>
          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent focus:outline-none focus:ring-2 focus:ring-inset focus:ring-ring"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-md text-base font-medium ${isActive
                    ? 'bg-secondary text-secondary-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  }`
                }
              >
                {link.text}
              </NavLink>
            ))}
            <div className="border-t border-border pt-4 mt-4">
              {isAuthenticated ? (
                <button onClick={handleLogout} className="w-full text-left flex items-center px-3 py-2 text-base font-medium rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground">
                  <LogOutIcon className="mr-3 h-5 w-5" />
                  Sign Out
                </button>
              ) : (
                <>
                  <NavLink to="/signin" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground">
                    Sign In
                  </NavLink>
                  <NavLink to="/signup" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground">
                    Sign Up
                  </NavLink>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};