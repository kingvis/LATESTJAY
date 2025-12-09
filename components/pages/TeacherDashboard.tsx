import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { motion } from 'framer-motion';

export const TeacherDashboard = () => {
    const { user } = useAuth();

    const assignedStudents = [
        { id: 1, name: 'Alice Johnson', course: 'Piano Mastery', progress: 65, lastActive: '2 hours ago' },
        { id: 2, name: 'Bob Smith', course: 'Vocal Training', progress: 30, lastActive: '1 day ago' },
        { id: 3, name: 'Charlie Brown', course: 'Guitar Basics', progress: 10, lastActive: '3 days ago' },
    ];

    const pendingCourses = [
        { id: 1, title: 'Advanced Jazz Harmony', status: 'Draft', lastEdited: '2023-11-15' },
        { id: 2, title: 'Songwriting Workshop', status: 'Review', lastEdited: '2023-11-20' },
    ];

    return (
        <div className="space-y-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-foreground">Welcome back, {user?.name || 'Teacher'}!</h1>
                <p className="text-muted-foreground">Manage your students and courses here.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Assigned Students */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-card/50 backdrop-blur-sm border border-border rounded-lg p-6 shadow-lg"
                >
                    <h2 className="text-xl font-semibold mb-4 text-primary">Assigned Students</h2>
                    <div className="space-y-4">
                        {assignedStudents.map((student) => (
                            <div key={student.id} className="flex items-center justify-between p-3 bg-accent/50 rounded-lg">
                                <div>
                                    <p className="font-medium">{student.name}</p>
                                    <p className="text-xs text-muted-foreground">{student.course}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-medium">{student.progress}%</p>
                                    <p className="text-xs text-muted-foreground">{student.lastActive}</p>
                                </div>
                            </div>
                        ))}
                        <button className="w-full py-2 mt-2 text-sm text-primary hover:underline">
                            View All Students
                        </button>
                    </div>
                </motion.div>

                {/* Pending Courses */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-card/50 backdrop-blur-sm border border-border rounded-lg p-6 shadow-lg"
                >
                    <h2 className="text-xl font-semibold mb-4 text-secondary">Pending Courses</h2>
                    <div className="space-y-4">
                        {pendingCourses.map((course) => (
                            <div key={course.id} className="flex items-center justify-between p-3 bg-accent/50 rounded-lg">
                                <div>
                                    <p className="font-medium">{course.title}</p>
                                    <p className="text-xs text-muted-foreground">Last Edited: {course.lastEdited}</p>
                                </div>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${course.status === 'Draft' ? 'bg-yellow-500/20 text-yellow-500' : 'bg-blue-500/20 text-blue-500'
                                    }`}>
                                    {course.status}
                                </span>
                            </div>
                        ))}
                        <button className="w-full py-2 mt-2 text-sm text-muted-foreground hover:text-foreground border border-dashed border-border rounded-lg hover:border-primary transition-colors">
                            + Create New Course
                        </button>
                    </div>
                </motion.div>
            </div>

            {/* Salary Details */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-card/50 backdrop-blur-sm border border-border rounded-lg p-6 shadow-lg"
            >
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-green-400">Salary Details</h2>
                    <span className="text-sm text-muted-foreground">This Month</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-4 bg-accent/30 rounded-lg border border-border">
                        <p className="text-sm text-muted-foreground">Total Earnings</p>
                        <h3 className="text-2xl font-bold">₹2,70,000</h3>
                    </div>
                    <div className="p-4 bg-accent/30 rounded-lg border border-border">
                        <p className="text-sm text-muted-foreground">Pending Payout</p>
                        <h3 className="text-2xl font-bold">₹1,00,000</h3>
                    </div>
                    <div className="p-4 bg-accent/30 rounded-lg border border-border">
                        <p className="text-sm text-muted-foreground">Next Payout Date</p>
                        <h3 className="text-2xl font-bold">Dec 15</h3>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};
