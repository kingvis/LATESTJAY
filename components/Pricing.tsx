'use client';
import React, { useState, useEffect } from 'react';
import { PlusIcon, ShieldCheckIcon, CheckIcon, XIcon, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import { BorderTrail } from './ui/border-trail';
import { useAuth } from '../contexts/AuthContext';
import { createPayment, getPaymentConfig } from '../services/paymentService';

export function Pricing() {
    const { user } = useAuth();
    const isAdmin = user?.role === 'admin';
    const isStudent = !user || user.role === 'student' || isAdmin;
    const isTeacher = !user || user.role === 'teacher' || isAdmin;
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState('');
    const [selectedAmount, setSelectedAmount] = useState(0);
    const [paymentDetails, setPaymentDetails] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [paymentSuccess, setPaymentSuccess] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (showPaymentModal) {
            setLoading(true);
            getPaymentConfig()
                .then(config => setPaymentDetails(config))
                .catch(err => {
                    console.error('Failed to load payment config:', err);
                    setError('Failed to load payment details');
                })
                .finally(() => setLoading(false));
        } else {
            // Reset state when modal closes
            setPaymentSuccess(false);
            setError('');
        }
    }, [showPaymentModal]);

    const handlePayment = (amount: number, planName: string) => {
        setSelectedPlan(planName);
        setSelectedAmount(amount);
        setShowPaymentModal(true);
    };

    const handleConfirmPayment = async () => {
        if (!user) {
            setError('Please sign in to make a payment.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const result = await createPayment({
                amount: selectedAmount,
                type: 'subscription',
                planName: selectedPlan,
                currency: 'USD',
            });

            if (result.success) {
                setPaymentSuccess(true);
                // Auto close after 3 seconds
                setTimeout(() => {
                    setShowPaymentModal(false);
                }, 3000);
            } else {
                setError(result.error || 'Payment failed. Please try again.');
            }
        } catch (err: any) {
            console.error('Payment error:', err);
            setError(err.message || 'An unexpected error occurred.');
        } finally {
            setLoading(false);
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

            {/* Payment Modal */}
            <AnimatePresence>
                {showPaymentModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-background border rounded-xl shadow-xl w-full max-w-md p-6 relative"
                        >
                            <button
                                onClick={() => setShowPaymentModal(false)}
                                className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
                            >
                                <XIcon className="size-5" />
                            </button>

                            {paymentSuccess ? (
                                <div className="text-center py-8">
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="w-16 h-16 mx-auto bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4"
                                    >
                                        <CheckIcon className="w-8 h-8 text-green-600 dark:text-green-400" />
                                    </motion.div>
                                    <h2 className="text-2xl font-bold mb-2">Payment Recorded!</h2>
                                    <p className="text-muted-foreground">
                                        Your payment has been recorded successfully. You'll receive a confirmation email once it's approved.
                                    </p>
                                </div>
                            ) : (
                                <>
                                    <h2 className="text-2xl font-bold mb-2">Complete Your Payment</h2>
                                    <p className="text-muted-foreground mb-6">
                                        Please transfer <strong>${selectedAmount}</strong> for <strong>{selectedPlan}</strong> to the account below.
                                    </p>

                                    {loading && !paymentDetails ? (
                                        <div className="text-center py-8">
                                            <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
                                            <p className="text-muted-foreground mt-2">Loading payment details...</p>
                                        </div>
                                    ) : paymentDetails ? (
                                        <div className="space-y-4 bg-muted/30 p-4 rounded-lg border">
                                            <div className="flex justify-between">
                                                <span className="font-medium text-muted-foreground">Bank Name:</span>
                                                <span className="font-bold">{paymentDetails.bankName || 'Not Configured'}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="font-medium text-muted-foreground">Account No:</span>
                                                <span className="font-mono font-bold">{paymentDetails.accountNumber || 'Not Configured'}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="font-medium text-muted-foreground">IFSC Code:</span>
                                                <span className="font-mono font-bold">{paymentDetails.ifscCode || 'Not Configured'}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="font-medium text-muted-foreground">UPI ID:</span>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-mono font-bold">{paymentDetails.upiId || 'Not Configured'}</span>
                                                    {paymentDetails.upiId && (
                                                        <Badge variant="outline" className="text-xs">UPI</Badge>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-center py-8 text-muted-foreground">
                                            <p>Payment details not configured yet.</p>
                                            <p className="text-sm">Please contact admin.</p>
                                        </div>
                                    )}

                                    {error && (
                                        <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm">
                                            {error}
                                        </div>
                                    )}

                                    <div className="mt-6 text-sm text-muted-foreground text-center">
                                        <p>After payment, click below to record it. You'll receive an email confirmation once approved.</p>
                                    </div>

                                    <Button
                                        className="w-full mt-6"
                                        onClick={handleConfirmPayment}
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <span className="flex items-center gap-2">
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                Processing...
                                            </span>
                                        ) : (
                                            'I Have Made the Payment'
                                        )}
                                    </Button>
                                </>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}
