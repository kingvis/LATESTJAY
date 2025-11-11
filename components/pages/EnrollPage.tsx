import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { COURSES } from '../../constants';
import { ElegantShape } from '../ui/shape-landing-hero';

export const EnrollPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const initialCourse = searchParams.get('course') || '';

    const [formData, setFormData] = useState({
        parentName: '',
        studentName: '',
        studentAge: '',
        email: '',
        phone: '',
        course: initialCourse,
        branch: '',
        message: ''
    });
    const [status, setStatus] = useState('');

    useEffect(() => {
        // If the initialCourse from URL is a valid course, set it. Otherwise, default to the first course.
        const isValidCourse = COURSES.some(c => c.title === initialCourse);
        setFormData(prev => ({
            ...prev,
            course: isValidCourse ? initialCourse : (COURSES[0]?.title || '')
        }));
    }, [initialCourse]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // In a real app, you would handle form submission to a backend here
        console.log('Form Submitted:', formData);
        setStatus(`Thank you, ${formData.parentName}! Your enrollment request for ${formData.studentName} has been received. We will contact you at ${formData.email} shortly to confirm the details.`);
        
        // Reset form after a delay and redirect
        setTimeout(() => {
            setFormData({
                parentName: '',
                studentName: '',
                studentAge: '',
                email: '',
                phone: '',
                course: COURSES[0]?.title || '',
                branch: '',
                message: ''
            });
            setStatus('');
            navigate('/');
        }, 5000); // Redirect after 5 seconds
    };

    return (
        <div className="relative py-16 md:py-24 overflow-hidden min-h-screen">
            <div className="absolute inset-0 -z-10">
                 <ElegantShape
                    delay={0.3}
                    width={600}
                    height={140}
                    rotate={12}
                    gradient="from-indigo-500/[0.15]"
                    className="left-[-10%] md:left-[-5%] top-[15%] md:top-[20%]"
                />
                <ElegantShape
                    delay={0.5}
                    width={500}
                    height={120}
                    rotate={-15}
                    gradient="from-rose-500/[0.15]"
                    className="right-[-5%] md:right-[0%] top-[70%] md:top-[75%]"
                />
            </div>
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight mb-4">Enroll at the <span className="text-primary">Academy</span></h1>
                    <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                        Take the first step on your musical journey. Fill out the form below and we'll be in touch to finalize your enrollment.
                    </p>
                </div>

                <div className="bg-card/50 backdrop-blur-xl p-8 rounded-lg border border-border">
                    {status ? (
                        <div className="text-center py-12">
                            <h2 className="text-2xl font-bold text-primary mb-4">Enrollment Request Sent!</h2>
                            <p className="text-muted-foreground">{status}</p>
                            <p className="text-sm text-muted-foreground mt-4">Redirecting you to the homepage shortly...</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                             <div className="md:col-span-2">
                                <h2 className="text-xl font-bold text-card-foreground mb-4 border-b border-border pb-2">Student Information</h2>
                            </div>
                            <div>
                                <label htmlFor="studentName" className="block text-sm font-medium text-muted-foreground">Student's Full Name</label>
                                <input type="text" name="studentName" id="studentName" value={formData.studentName} onChange={handleChange} required className="mt-1 block w-full bg-accent border border-border rounded-md shadow-sm py-2 px-3 text-foreground focus:outline-none focus:ring-ring focus:border-ring"/>
                            </div>
                             <div>
                                <label htmlFor="studentAge" className="block text-sm font-medium text-muted-foreground">Student's Age</label>
                                <input type="number" name="studentAge" id="studentAge" value={formData.studentAge} onChange={handleChange} required className="mt-1 block w-full bg-accent border border-border rounded-md shadow-sm py-2 px-3 text-foreground focus:outline-none focus:ring-ring focus:border-ring"/>
                            </div>
                            <div className="md:col-span-2">
                                <h2 className="text-xl font-bold text-card-foreground mb-4 border-b border-border pb-2 pt-4">Parent/Guardian Information</h2>
                            </div>
                            <div>
                                <label htmlFor="parentName" className="block text-sm font-medium text-muted-foreground">Parent/Guardian's Full Name</label>
                                <input type="text" name="parentName" id="parentName" value={formData.parentName} onChange={handleChange} required className="mt-1 block w-full bg-accent border border-border rounded-md shadow-sm py-2 px-3 text-foreground focus:outline-none focus:ring-ring focus:border-ring"/>
                            </div>
                            <div>
                                <label htmlFor="phone" className="block text-sm font-medium text-muted-foreground">Phone Number</label>
                                <input type="tel" name="phone" id="phone" value={formData.phone} onChange={handleChange} required className="mt-1 block w-full bg-accent border border-border rounded-md shadow-sm py-2 px-3 text-foreground focus:outline-none focus:ring-ring focus:border-ring"/>
                            </div>
                             <div className="md:col-span-2">
                                <label htmlFor="email" className="block text-sm font-medium text-muted-foreground">Email Address</label>
                                <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} required className="mt-1 block w-full bg-accent border border-border rounded-md shadow-sm py-2 px-3 text-foreground focus:outline-none focus:ring-ring focus:border-ring"/>
                            </div>
                             <div className="md:col-span-2">
                                <h2 className="text-xl font-bold text-card-foreground mb-4 border-b border-border pb-2 pt-4">Course Details</h2>
                            </div>
                             <div>
                                <label htmlFor="course" className="block text-sm font-medium text-muted-foreground">Select Course</label>
                                <select name="course" id="course" value={formData.course} onChange={handleChange} required className="mt-1 block w-full bg-accent border border-border rounded-md shadow-sm py-2 px-3 text-foreground focus:outline-none focus:ring-ring focus:border-ring">
                                    {COURSES.map(course => <option key={course.title} value={course.title}>{course.title}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-muted-foreground">Preferred Branch</label>
                                <div className="mt-2 space-x-4">
                                     <label className="inline-flex items-center">
                                        <input type="radio" name="branch" value="Thiruninravur" checked={formData.branch === 'Thiruninravur'} onChange={handleChange} required className="form-radio bg-accent border-border text-primary focus:ring-ring"/>
                                        <span className="ml-2 text-muted-foreground">Thiruninravur</span>
                                    </label>
                                    <label className="inline-flex items-center">
                                        <input type="radio" name="branch" value="Kattupakkam" checked={formData.branch === 'Kattupakkam'} onChange={handleChange} required className="form-radio bg-accent border-border text-primary focus:ring-ring"/>
                                        <span className="ml-2 text-muted-foreground">Kattupakkam</span>
                                    </label>
                                </div>
                            </div>
                            <div className="md:col-span-2">
                                <label htmlFor="message" className="block text-sm font-medium text-muted-foreground">Additional Questions (Optional)</label>
                                <textarea name="message" id="message" rows={4} value={formData.message} onChange={handleChange} className="mt-1 block w-full bg-accent border border-border rounded-md shadow-sm py-2 px-3 text-foreground focus:outline-none focus:ring-ring focus:border-ring"></textarea>
                            </div>
                            <div className="md:col-span-2">
                                <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-full shadow-sm text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring transition-all">
                                    Submit Enrollment Request
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};