import React from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomePage } from './components/pages/HomePage';
import { AboutPage } from './components/pages/AboutPage';
import { CoursesPage } from './components/pages/CoursesPage';
import { BranchesPage } from './components/pages/BranchesPage';
import { ContactPage } from './components/pages/ContactPage';
import { AIStudioPage } from './components/pages/AIStudioPage';
import { CourseAssistant } from './components/CourseAssistant';
import { AuthProvider } from './contexts/AuthContext';
import { SignInPage } from './components/pages/SignInPage';
import { SignUpPage } from './components/pages/SignUpPage';
import { ProtectedRoute } from './components/ProtectedRoute';

const AppContent = () => {
  const location = useLocation();
  
  // Use a key on Routes to force re-render on navigation, which helps with scroll-to-top behavior
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground font-sans antialiased">
      <Header />
      <main className="flex-grow pt-16">
        <Routes key={location.pathname}>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/branches" element={<BranchesPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/ai-studio" element={
            <ProtectedRoute>
              <AIStudioPage />
            </ProtectedRoute>
          } />
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/signup" element={<SignUpPage />} />
        </Routes>
      </main>
      <Footer />
      <CourseAssistant />
    </div>
  );
};


const App = () => {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
};

export default App;
