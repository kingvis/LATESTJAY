import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { StudentDashboard } from './StudentDashboard';
import { TeacherDashboard } from './TeacherDashboard';

export const DashboardPage = () => {
    const { user } = useAuth();

    return (
        <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {user?.role === 'teacher' ? (
                    <TeacherDashboard />
                ) : (
                    <StudentDashboard />
                )}
            </div>
        </div>
    );
};
