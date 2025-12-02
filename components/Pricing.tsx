'use client';
import React from 'react';
import { PlusIcon, ShieldCheckIcon, CheckIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import { BorderTrail } from './ui/border-trail';
import { useAuth } from '../contexts/AuthContext';
import useRazorpay from 'react-razorpay';
import axios from 'axios';

export function Pricing() {
    const { user } = useAuth();
    const [Razorpay] = useRazorpay();
    const isStudent = !user || user.role === 'student';
    const isTeacher = !user || user.role === 'teacher';

    const handlePayment = async (amount: number, planName: string) => {
        try {
            // 1. Create order on backend
            const { data: order } = await axios.post('http://localhost:5000/create-order', {
                amount: amount,
                currency: 'INR',
            });

            // 2. Initialize Razorpay options
            const options = {
                key: 'rzp_test_placeholder', // Replace with your actual key
                amount: order.amount,
                currency: order.currency,
                name: 'Jay Music Academy',
                description: `Payment for ${planName}`,
                order_id: order.id,
                handler: (response: any) => {
                    console.log(response);
                    alert(`Payment Successful! Payment ID: ${response.razorpay_payment_id}`);
                },
                prefill: {
                    name: user?.name || 'Test User',
                    email: user?.email || 'test@example.com',
                    contact: '9999999999',
                },
                theme: {
                    color: '#3399cc',
                },
            };

            // 3. Open Razorpay checkout
            const rzp1 = new Razorpay(options);
            rzp1.on('payment.failed', function (response: any) {
                alert(response.error.description);
            });
            rzp1.open();
        } catch (error) {
            console.error('Payment Error:', error);
            alert('Payment failed. Please try again.');
        }
    };

    return (
        <section className="relative min-h-screen overflow-hidden py-24">
            <div id="pricing" className="mx-auto w-full max-w-6xl space-y-12 px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                    viewport={{ once: true }}
                    className="mx-auto max-w-xl space-y-5"
                >
                    <div className="flex justify-center">
                        <div className="rounded-lg border px-4 py-1 font-mono">Pricing</div>
                    </div>
                    <h2 className="mt-5 text-center text-2xl font-bold tracking-tighter md:text-3xl lg:text-4xl">
                        Plans for Every Musician
                    </h2>
                    <p className="text-muted-foreground mt-5 text-center text-sm md:text-base">
                        Whether you're learning or teaching, we have the perfect plan for you.
                    </p>
                </motion.div>

                <div className="relative space-y-12">
                    <div
                        className={cn(
                            'z--10 pointer-events-none absolute inset-0 size-full',
                            'bg-[linear-gradient(to_right,--theme(--color-foreground/.2)_1px,transparent_1px),linear-gradient(to_bottom,--theme(--color-foreground/.2)_1px,transparent_1px)]',
                            'bg-[size:32px_32px]',
                            '[mask-image:radial-gradient(ellipse_at_center,var(--background)_10%,transparent)]',
                        )}
                    />

                    {/* Student Pricing */}
                    {isStudent && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                            viewport={{ once: true }}
                            className="mx-auto w-full max-w-2xl space-y-4"
                        >
                            <h3 className="text-xl font-bold text-center">For Students</h3>
                            <div className="grid md:grid-cols-2 bg-background relative border p-4 rounded-xl">
                                <PlusIcon className="absolute -top-3 -left-3  size-5.5" />
                                <PlusIcon className="absolute -top-3 -right-3 size-5.5" />
                                <PlusIcon className="absolute -bottom-3 -left-3 size-5.5" />
                                <PlusIcon className="absolute -right-3 -bottom-3 size-5.5" />

                                <div className="w-full px-4 pt-5 pb-4 border-b md:border-b-0 md:border-r border-border/50">
                                    <div className="space-y-1">
                                        <div className="flex items-center justify-between">
                                            <h3 className="leading-none font-semibold">Monthly</h3>
                                            <div className="flex items-center gap-x-1">
                                                <span className="text-muted-foreground text-sm line-through">$35</span>
                                                <Badge variant="secondary">Save 15%</Badge>
                                            </div>
                                        </div>
                                        <p className="text-muted-foreground text-sm">Flexible learning at your pace.</p>
                                    </div>
                                    <div className="mt-10 space-y-4">
                                        <div className="text-muted-foreground flex items-end gap-0.5 text-xl">
                                            <span>$</span>
                                            <span className="text-foreground -mb-0.5 text-4xl font-extrabold tracking-tighter md:text-5xl">
                                                29
                                            </span>
                                            <span>/month</span>
                                        </div>
                                        <Button className="w-full" variant="outline" onClick={() => handlePayment(29, 'Student Monthly Plan')}>
                                            Start Learning
                                        </Button>
                                        <ul className="text-xs text-muted-foreground space-y-2 pt-4">
                                            <li className="flex items-center"><CheckIcon className="size-3 mr-2" /> Access to all courses</li>
                                            <li className="flex items-center"><CheckIcon className="size-3 mr-2" /> Weekly live sessions</li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="relative w-full rounded-lg px-4 pt-5 pb-4">
                                    <BorderTrail
                                        style={{
                                            boxShadow:
                                                '0px 0px 60px 30px rgb(255 255 255 / 50%), 0 0 100px 60px rgb(0 0 0 / 50%), 0 0 140px 90px rgb(0 0 0 / 50%)',
                                        }}
                                        size={100}
                                    />
                                    <div className="space-y-1">
                                        <div className="flex items-center justify-between">
                                            <h3 className="leading-none font-semibold">Yearly</h3>
                                            <div className="flex items-center gap-x-1">
                                                <span className="text-muted-foreground text-sm line-through">$420</span>
                                                <Badge>Best Value</Badge>
                                            </div>
                                        </div>
                                        <p className="text-muted-foreground text-sm">Commit to mastery and save big.</p>
                                    </div>
                                    <div className="mt-10 space-y-4">
                                        <div className="text-muted-foreground flex items-end text-xl">
                                            <span>$</span>
                                            <span className="text-foreground -mb-0.5 text-4xl font-extrabold tracking-tighter md:text-5xl">
                                                290
                                            </span>
                                            <span>/year</span>
                                        </div>
                                        <Button className="w-full" onClick={() => handlePayment(290, 'Student Yearly Plan')}>
                                            Get Yearly Plan
                                        </Button>
                                        <ul className="text-xs text-muted-foreground space-y-2 pt-4">
                                            <li className="flex items-center"><CheckIcon className="size-3 mr-2" /> All Monthly features</li>
                                            <li className="flex items-center"><CheckIcon className="size-3 mr-2" /> 2 months free</li>
                                            <li className="flex items-center"><CheckIcon className="size-3 mr-2" /> Offline downloads</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Teacher Pricing */}
                    {isTeacher && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                            viewport={{ once: true }}
                            className="mx-auto w-full max-w-2xl space-y-4"
                        >
                            <h3 className="text-xl font-bold text-center">For Teachers</h3>
                            <div className="grid md:grid-cols-2 bg-background relative border p-4 rounded-xl shadow-lg">
                                <PlusIcon className="absolute -top-3 -left-3  size-5.5" />
                                <PlusIcon className="absolute -top-3 -right-3 size-5.5" />
                                <PlusIcon className="absolute -bottom-3 -left-3 size-5.5" />
                                <PlusIcon className="absolute -right-3 -bottom-3 size-5.5" />

                                <div className="w-full px-4 pt-5 pb-4 border-b md:border-b-0 md:border-r border-border/50">
                                    <div className="space-y-1">
                                        <div className="flex items-center justify-between">
                                            <h3 className="leading-none font-semibold">Monthly Membership</h3>
                                            <Badge variant="outline">Teacher</Badge>
                                        </div>
                                        <p className="text-muted-foreground text-sm">Start teaching with flexibility.</p>
                                    </div>
                                    <div className="mt-8 space-y-4">
                                        <div className="text-muted-foreground flex items-end gap-0.5 text-xl">
                                            <span>$</span>
                                            <span className="text-foreground -mb-0.5 text-4xl font-extrabold tracking-tighter md:text-5xl">
                                                12
                                            </span>
                                            <span>/month</span>
                                        </div>
                                        <Button className="w-full" variant="outline" onClick={() => handlePayment(12, 'Teacher Monthly Membership')}>
                                            Apply Monthly
                                        </Button>
                                        <ul className="text-sm text-muted-foreground space-y-3 pt-4">
                                            <li className="flex items-center"><ShieldCheckIcon className="size-4 mr-2 text-primary" /> Verified Teacher Badge</li>
                                            <li className="flex items-center"><CheckIcon className="size-4 mr-2 text-primary" /> Unlimited Course Uploads</li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="relative w-full rounded-lg px-4 pt-5 pb-4">
                                    <BorderTrail
                                        style={{
                                            boxShadow:
                                                '0px 0px 60px 30px rgb(255 255 255 / 50%), 0 0 100px 60px rgb(0 0 0 / 50%), 0 0 140px 90px rgb(0 0 0 / 50%)',
                                        }}
                                        size={100}
                                    />
                                    <div className="space-y-1">
                                        <div className="flex items-center justify-between">
                                            <h3 className="leading-none font-semibold">Yearly Membership</h3>
                                            <Badge>Best Value</Badge>
                                        </div>
                                        <p className="text-muted-foreground text-sm">Commit to your teaching career.</p>
                                    </div>
                                    <div className="mt-8 space-y-4">
                                        <div className="text-muted-foreground flex items-end gap-0.5 text-xl">
                                            <span>$</span>
                                            <span className="text-foreground -mb-0.5 text-4xl font-extrabold tracking-tighter md:text-5xl">
                                                99
                                            </span>
                                            <span>/year</span>
                                        </div>
                                        <Button className="w-full" variant="default" onClick={() => handlePayment(99, 'Teacher Yearly Membership')}>
                                            Apply Yearly
                                        </Button>
                                        <ul className="text-sm text-muted-foreground space-y-3 pt-4">
                                            <li className="flex items-center"><ShieldCheckIcon className="size-4 mr-2 text-primary" /> All Monthly Benefits</li>
                                            <li className="flex items-center"><CheckIcon className="size-4 mr-2 text-primary" /> Student Analytics Dashboard</li>
                                            <li className="flex items-center"><CheckIcon className="size-4 mr-2 text-primary" /> Priority Support</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        </section>
    );
}
