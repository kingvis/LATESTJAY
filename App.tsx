import React from 'react';
import { HashRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomePage } from './components/pages/HomePage';
import { AboutPage } from './components/pages/AboutPage';
import { CoursesPage } from './components/pages/CoursesPage';
import { BranchesPage } from './components/pages/BranchesPage';
import { ContactPage } from './components/pages/ContactPage';
import { AIStudioPage } from './components/pages/AIStudioPage';
import { DashboardPage } from './components/pages/DashboardPage';
import { CourseAssistant } from './components/CourseAssistant';
import { AuthProvider } from './contexts/AuthContext';
import { SignInPage } from './components/pages/SignInPage';
import { SignUpPage } from './components/pages/SignUpPage';
import { EnrollPage } from './components/pages/EnrollPage';
import { PricingPage } from './components/pages/PricingPage';
import { StaffDashboard } from './components/pages/StaffDashboard';
import { ProtectedRoute } from './components/ProtectedRoute';
import { ScrollManager } from './components/ScrollManager';
import { PageTransition } from './components/PageTransition';

const AppContent = () => {
  const location = useLocation();
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground font-sans antialiased">
      <Header />
      <main className="flex-grow pt-16">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<PageTransition><HomePage /></PageTransition>} />
            <Route path="/about" element={<PageTransition><AboutPage /></PageTransition>} />
            <Route path="/courses" element={<PageTransition><CoursesPage /></PageTransition>} />
            <Route path="/branches" element={<PageTransition><BranchesPage /></PageTransition>} />
            <Route path="/contact" element={<PageTransition><ContactPage /></PageTransition>} />
            {/* <Route path="/ai-studio" element={
              <PageTransition>
                <ProtectedRoute>
                  <AIStudioPage />
                </ProtectedRoute>
              </PageTransition>
            } /> */}
            <Route path="/dashboard" element={
              <PageTransition>
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              </PageTransition>
            } />
            <Route path="/staff-dashboard" element={
              <PageTransition>
                <ProtectedRoute allowedRoles={['admin']}>
                  <StaffDashboard />
                </ProtectedRoute>
              </PageTransition>
            } />
            <Route path="/signin" element={<PageTransition><SignInPage /></PageTransition>} />
            <Route path="/signup" element={<PageTransition><SignUpPage /></PageTransition>} />
            <Route path="/enroll" element={<PageTransition><EnrollPage /></PageTransition>} />
            <Route path="/pricing" element={<PageTransition><PricingPage /></PageTransition>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AnimatePresence>
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
        <ScrollManager />
        <AppContent />
      </Router>
    </AuthProvider>
  );
};

export default App;