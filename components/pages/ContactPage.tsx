import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { MailIcon, PhoneIcon, CheckCircleIcon } from '../Icons';
import { ElegantShape } from '../ui/shape-landing-hero';

export const ContactPage = () => {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [status, setStatus] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // In a real app, you would handle form submission here
        setStatus(`Thank you for your message, ${formData.name}! We will get back to you soon.`);
        setFormData({ name: '', email: '', message: '' });
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
                <ElegantShape
                    delay={0.4}
                    width={300}
                    height={80}
                    rotate={-8}
                    gradient="from-violet-500/[0.15]"
                    className="left-[5%] md:left-[10%] bottom-[5%] md:bottom-[10%]"
                />
            </div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight mb-4">Get In <span className="text-primary">Touch</span></h1>
                    <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                        Have questions or ready to enroll? We'd love to hear from you. Reach out to us through any of the methods below.
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-12 items-start">
                    {/* Contact Form */}
                    <div className="bg-card/50 backdrop-blur-xl p-8 rounded-lg border border-border">
                        {status ? (
                            <div className="text-center py-8 flex flex-col items-center justify-center h-full">
                                <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
                                <h2 className="text-2xl font-bold text-card-foreground mb-2">Message Sent!</h2>
                                <p className="text-muted-foreground mb-6">{status}</p>
                                <NavLink
                                    to="/"
                                    className="inline-block bg-primary text-primary-foreground font-bold py-3 px-8 rounded-full shadow-lg transform transition-transform duration-300 hover:scale-105 hover:shadow-primary/20"
                                >
                                    Return to Home
                                </NavLink>
                            </div>
                        ) : (
                            <>
                                <h2 className="text-2xl font-bold text-card-foreground mb-6">Send us a Message</h2>
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium text-muted-foreground">Full Name</label>
                                        <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full bg-accent border border-border rounded-md shadow-sm py-2 px-3 text-foreground focus:outline-none focus:ring-ring focus:border-ring" />
                                    </div>
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-muted-foreground">Email Address</label>
                                        <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} required className="mt-1 block w-full bg-accent border border-border rounded-md shadow-sm py-2 px-3 text-foreground focus:outline-none focus:ring-ring focus:border-ring" />
                                    </div>
                                    <div>
                                        <label htmlFor="message" className="block text-sm font-medium text-muted-foreground">Message</label>
                                        <textarea name="message" id="message" rows={4} value={formData.message} onChange={handleChange} required className="mt-1 block w-full bg-accent border border-border rounded-md shadow-sm py-2 px-3 text-foreground focus:outline-none focus:ring-ring focus:border-ring"></textarea>
                                    </div>
                                    <div>
                                        <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-full shadow-sm text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring transition-all">
                                            Send Message
                                        </button>
                                    </div>
                                </form>
                            </>
                        )}
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-8">
                        <div className="bg-card/50 backdrop-blur-xl p-8 rounded-lg border border-border">
                            <h3 className="text-xl font-bold text-card-foreground mb-4">Contact Information</h3>
                            <div className="space-y-4 text-muted-foreground">
                                <p className="flex items-center">
                                    <PhoneIcon className="w-5 h-5 mr-3 text-primary" />
                                    +91 8754482015
                                </p>
                                <p className="flex items-center">
                                    <MailIcon className="w-5 h-5 mr-3 text-primary" />
                                    Hello@jaymusicacademy.in
                                </p>
                            </div>
                        </div>
                        <div className="bg-card/50 backdrop-blur-xl p-8 rounded-lg border border-border">
                            <h3 className="text-xl font-bold text-card-foreground mb-4">Operating Hours</h3>
                            <div className="space-y-2 text-muted-foreground">
                                <p><span className="font-semibold text-primary">Thiruninravur:</span> Mon - Fri: 4pm - 8:30pm | Sun: 8am - 5pm</p>
                                <p><span className="font-semibold text-primary">Kattupakkam:</span> Opening Soon</p>
                                <p>All branches closed on public holidays.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};