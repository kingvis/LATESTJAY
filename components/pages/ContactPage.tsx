import React, { useState } from 'react';
import { MailIcon, PhoneIcon } from '../Icons';

export const ContactPage = () => {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [status, setStatus] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // In a real app, you would handle form submission here
        setStatus('Thank you for your message! We will get back to you soon.');
        setFormData({ name: '', email: '', message: '' });
    };

    return (
        <div className="py-16 md:py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight mb-4">Get In <span className="text-secondary">Touch</span></h1>
                    <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                        Have questions or ready to enroll? We'd love to hear from you. Reach out to us through any of the methods below.
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-12 items-start">
                    {/* Contact Form */}
                    <div className="bg-card/50 backdrop-blur-sm p-8 rounded-lg border border-border">
                        <h2 className="text-2xl font-bold text-card-foreground mb-6">Send us a Message</h2>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-muted-foreground">Full Name</label>
                                <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full bg-accent border border-border rounded-md shadow-sm py-2 px-3 text-foreground focus:outline-none focus:ring-ring focus:border-ring"/>
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-muted-foreground">Email Address</label>
                                <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} required className="mt-1 block w-full bg-accent border border-border rounded-md shadow-sm py-2 px-3 text-foreground focus:outline-none focus:ring-ring focus:border-ring"/>
                            </div>
                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-muted-foreground">Message</label>
                                <textarea name="message" id="message" rows={4} value={formData.message} onChange={handleChange} required className="mt-1 block w-full bg-accent border border-border rounded-md shadow-sm py-2 px-3 text-foreground focus:outline-none focus:ring-ring focus:border-ring"></textarea>
                            </div>
                            <div>
                                <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-full shadow-sm text-sm font-medium text-secondary bg-secondary-foreground hover:bg-secondary-foreground/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring transition-all">
                                    Send Message
                                </button>
                            </div>
                        </form>
                        {status && <p className="mt-4 text-center text-green-400">{status}</p>}
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-8">
                        <div className="bg-card/50 backdrop-blur-sm p-8 rounded-lg border border-border">
                             <h3 className="text-xl font-bold text-card-foreground mb-4">Contact Information</h3>
                            <div className="space-y-4 text-muted-foreground">
                                <p className="flex items-center">
                                    <PhoneIcon className="w-5 h-5 mr-3 text-secondary"/>
                                    +91 12345 67890
                                </p>
                                <p className="flex items-center">
                                    <MailIcon className="w-5 h-5 mr-3 text-secondary"/>
                                    info@jaymusicacademy.com
                                </p>
                            </div>
                        </div>
                        <div className="bg-card/50 backdrop-blur-sm p-8 rounded-lg border border-border">
                             <h3 className="text-xl font-bold text-card-foreground mb-4">Operating Hours</h3>
                             <div className="space-y-2 text-muted-foreground">
                                <p><span className="font-semibold text-secondary">Thiruninravur:</span> Mon - Sat, 10am - 8pm</p>
                                <p><span className="font-semibold text-secondary">Kattupakkam:</span> Mon - Sun, Timings vary</p>
                                <p>All branches closed on public holidays.</p>
                             </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};