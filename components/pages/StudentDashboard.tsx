import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { motion } from 'framer-motion';

export const StudentDashboard = () => {
    const { user } = useAuth();

    const enrolledCourses = [
        { id: 1, title: 'Piano Mastery', progress: 65, nextLesson: 'Chords & Inversions' },
        { id: 2, title: 'Vocal Training', progress: 30, nextLesson: 'Breathing Techniques' },
    ];

    const savedSessions = [
        { id: 1, type: 'Lyrics', title: 'Neon Jazz Club Song', date: '2023-10-27' },
        { id: 2, type: 'Art', title: 'Rock Concert Poster', date: '2023-10-25' },
    ];

    return (
        <div className="space-y-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-foreground">Welcome back, {user?.name || 'Student'}!</h1>
                <p className="text-muted-foreground">Here's an overview of your musical journey.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Enrolled Courses */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-card/50 backdrop-blur-sm border border-border rounded-lg p-6 shadow-lg"
                >
                    <h2 className="text-xl font-semibold mb-4 text-primary">My Courses</h2>
                    <div className="space-y-6">
                        {enrolledCourses.map((course) => (
                            <div key={course.id} className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="font-medium">{course.title}</span>
                                    <span className="text-muted-foreground">{course.progress}%</span>
                                </div>
                                <div className="h-2 bg-accent rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-primary rounded-full transition-all duration-500"
                                        style={{ width: `${course.progress}%` }}
                                    />
                                </div>
                                <p className="text-xs text-muted-foreground">Next: {course.nextLesson}</p>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Saved AI Sessions */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-card/50 backdrop-blur-sm border border-border rounded-lg p-6 shadow-lg"
                >
                    <h2 className="text-xl font-semibold mb-4 text-secondary">Saved AI Sessions</h2>
                    <div className="space-y-4">
                        {savedSessions.map((session) => (
                            <div key={session.id} className="flex items-center justify-between p-3 bg-accent/50 rounded-lg hover:bg-accent transition-colors cursor-pointer">
                                <div>
                                    <p className="font-medium">{session.title}</p>
                                    <p className="text-xs text-muted-foreground">{session.type} • {session.date}</p>
                                </div>
                                <button className="text-sm text-primary hover:underline">View</button>
                            </div>
                        ))}
                        <button className="w-full py-2 mt-2 text-sm text-muted-foreground hover:text-foreground border border-dashed border-border rounded-lg hover:border-primary transition-colors">
                            + New Session
                        </button>
                    </div>
                </motion.div>
            </div>

            {/* Stats / Achievements Row */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4"
            >
                <div className="bg-card/30 p-4 rounded-lg text-center border border-border">
                    <h3 className="text-2xl font-bold text-primary">12</h3>
                    <p className="text-xs text-muted-foreground">Hours Practiced</p>
                </div>
                <div className="bg-card/30 p-4 rounded-lg text-center border border-border">
                    <h3 className="text-2xl font-bold text-secondary">5</h3>
                    <p className="text-xs text-muted-foreground">Songs Composed</p>
                </div>
                <div className="bg-card/30 p-4 rounded-lg text-center border border-border">
                    <h3 className="text-2xl font-bold text-green-400">8</h3>
                    <p className="text-xs text-muted-foreground">Badges Earned</p>
                </div>
                <div className="bg-card/30 p-4 rounded-lg text-center border border-border">
                    <h3 className="text-2xl font-bold text-purple-400">Top 10%</h3>
                    <p className="text-xs text-muted-foreground">Class Rank</p>
                </div>
            </motion.div>
        </div>
    );
};
