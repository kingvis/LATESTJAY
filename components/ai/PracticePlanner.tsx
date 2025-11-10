import React, { useState } from 'react';
import { generatePracticePlan } from '../../services/geminiService';
import { COURSES } from '../../constants';
import { SparklesIcon } from '../Icons';

const PracticePlanner = () => {
    const [selectedCourse, setSelectedCourse] = useState(COURSES[0]?.title || '');
    const [goal, setGoal] = useState('');
    const [plan, setPlan] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedCourse || !goal || isLoading) return;

        setIsLoading(true);
        setError('');
        setPlan('');

        try {
            const generatedPlan = await generatePracticePlan(selectedCourse, goal);
            setPlan(generatedPlan);
        } catch (err) {
            setError('Failed to generate practice plan. Please try again.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-xl font-bold text-foreground">AI Practice Planner</h3>
                <p className="text-muted-foreground">Generate custom practice exercises or mini-lesson plans for any course.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="course-select" className="block text-sm font-medium text-muted-foreground mb-1">Select a Course</label>
                    <select
                        id="course-select"
                        value={selectedCourse}
                        onChange={(e) => setSelectedCourse(e.target.value)}
                        className="w-full bg-accent text-foreground border border-border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                        {COURSES.map(course => (
                            <option key={course.title} value={course.title}>{course.title}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="goal-input" className="block text-sm font-medium text-muted-foreground mb-1">What's your goal today?</label>
                    <input
                        type="text"
                        id="goal-input"
                        value={goal}
                        onChange={(e) => setGoal(e.target.value)}
                        placeholder="e.g., Improve finger speed on piano"
                        className="w-full bg-accent text-foreground placeholder-muted-foreground border border-border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-ring"
                        required
                    />
                </div>
                <button
                    type="submit"
                    disabled={!goal || isLoading}
                    className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-lg shadow-sm font-medium text-secondary bg-secondary-foreground hover:bg-secondary-foreground/80 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                    <SparklesIcon className="h-5 w-5" />
                    {isLoading ? 'Generating Plan...' : 'Generate Plan'}
                </button>
            </form>

            {error && <p className="text-center text-red-400 p-4 bg-red-900/20 rounded-lg">{error}</p>}

            {plan && (
                 <div className="mt-6 p-4 bg-accent/50 rounded-lg border border-border">
                    <h4 className="text-lg font-bold text-foreground mb-2">Your Custom Practice Plan:</h4>
                    <div className="text-foreground whitespace-pre-wrap">{plan}</div>
                </div>
            )}
        </div>
    );
};

export default PracticePlanner;