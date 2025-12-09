'use client';
import React, { useState, useEffect } from 'react';
import { PlusIcon, ShieldCheckIcon, CheckIcon, XIcon, Loader2, QrCodeIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import { BorderTrail } from './ui/border-trail';
import { useAuth } from '../contexts/AuthContext';
import { createPayment, getPaymentConfig } from '../services/paymentService';

// QR Code component that displays "Bank details coming soon" message
const PaymentQRCode = () => {
    // This is a simple placeholder QR-like visual
    // The QR code data would encode: "Bank details coming soon - Jay Music Academy"
    return (
        <div className="flex flex-col items-center space-y-3">
            <div className="relative bg-white p-4 rounded-xl shadow-lg">
                {/* RuPay branded QR code placeholder */}
                <div className="w-48 h-48 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center relative overflow-hidden">
                    {/* QR Code pattern simulation */}
                    <div className="absolute inset-2 grid grid-cols-8 grid-rows-8 gap-0.5">
                        {Array.from({ length: 64 }).map((_, i) => (
                            <div
                                key={i}
                                className={cn(
                                    "rounded-sm",
                                    i % 3 === 0 ? "bg-gray-800" : "bg-transparent"
                                )}
                            />
                        ))}
                    </div>
                    {/* Center logo area */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-white p-2 rounded-lg shadow-sm">
                            <div className="text-xs font-bold text-blue-600">RuPay</div>
                        </div>
                    </div>
                </div>
                {/* RuPay logo at bottom */}
                <div className="mt-2 flex justify-center items-center gap-2">
                    <div className="bg-gradient-to-r from-green-500 via-orange-500 to-blue-500 text-white text-xs font-bold px-3 py-1 rounded">
                        RuPay
                    </div>
                    <span className="text-xs text-gray-500">Scan to Pay</span>
                </div>
            </div>
            <div className="text-center">
                <p className="text-sm font-medium text-amber-600 dark:text-amber-400">
                    📱 Scan QR Code with any UPI App
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                    Bank details will be displayed after scanning
                </p>
            </div>
        </div>
    );
};

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
                currency: 'INR',
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

    // Format price in Indian Rupees
    const formatINR = (amount: number) => {
        return new Intl.NumberFormat('en-IN').format(amount);
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
                                                <span className="text-muted-foreground text-sm line-through">₹2,999</span>
                                                <Badge variant="secondary">Save 15%</Badge>
                                            </div>
                                        </div>
                                        <p className="text-muted-foreground text-sm">Flexible learning at your pace.</p>
                                    </div>
                                    <div className="mt-10 space-y-4">
                                        <div className="text-muted-foreground flex items-end gap-0.5 text-xl">
                                            <span>₹</span>
                                            <span className="text-foreground -mb-0.5 text-4xl font-extrabold tracking-tighter md:text-5xl">
                                                {formatINR(2499)}
                                            </span>
                                            <span>/month</span>
                                        </div>
                                        <Button className="w-full" variant="outline" onClick={() => handlePayment(2499, 'Student Monthly Plan')}>
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
                                                <span className="text-muted-foreground text-sm line-through">₹29,988</span>
                                                <Badge>Best Value</Badge>
                                            </div>
                                        </div>
                                        <p className="text-muted-foreground text-sm">Commit to mastery and save big.</p>
                                    </div>
                                    <div className="mt-10 space-y-4">
                                        <div className="text-muted-foreground flex items-end text-xl">
                                            <span>₹</span>
                                            <span className="text-foreground -mb-0.5 text-4xl font-extrabold tracking-tighter md:text-5xl">
                                                {formatINR(19999)}
                                            </span>
                                            <span>/year</span>
                                        </div>
                                        <Button className="w-full" onClick={() => handlePayment(19999, 'Student Yearly Plan')}>
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
                                            <span>₹</span>
                                            <span className="text-foreground -mb-0.5 text-4xl font-extrabold tracking-tighter md:text-5xl">
                                                {formatINR(999)}
                                            </span>
                                            <span>/month</span>
                                        </div>
                                        <Button className="w-full" variant="outline" onClick={() => handlePayment(999, 'Teacher Monthly Membership')}>
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
                                            <span>₹</span>
                                            <span className="text-foreground -mb-0.5 text-4xl font-extrabold tracking-tighter md:text-5xl">
                                                {formatINR(7999)}
                                            </span>
                                            <span>/year</span>
                                        </div>
                                        <Button className="w-full" variant="default" onClick={() => handlePayment(7999, 'Teacher Yearly Membership')}>
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
                            className="bg-background border rounded-xl shadow-xl w-full max-w-lg p-6 relative max-h-[90vh] overflow-y-auto"
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
                                        Please transfer <strong>₹{formatINR(selectedAmount)}</strong> for <strong>{selectedPlan}</strong>
                                    </p>

                                    {/* RuPay QR Code Section */}
                                    <div className="mb-6">
                                        <PaymentQRCode />
                                    </div>

                                    <div className="relative">
                                        <div className="absolute inset-0 flex items-center">
                                            <span className="w-full border-t" />
                                        </div>
                                        <div className="relative flex justify-center text-xs uppercase">
                                            <span className="bg-background px-2 text-muted-foreground">
                                                Or use bank details
                                            </span>
                                        </div>
                                    </div>

                                    {loading && !paymentDetails ? (
                                        <div className="text-center py-8">
                                            <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
                                            <p className="text-muted-foreground mt-2">Loading payment details...</p>
                                        </div>
                                    ) : paymentDetails ? (
                                        <div className="space-y-4 bg-muted/30 p-4 rounded-lg border mt-4">
                                            <div className="flex justify-between">
                                                <span className="font-medium text-muted-foreground">Bank Name:</span>
                                                <span className="font-bold">{paymentDetails.bankName || 'Coming Soon'}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="font-medium text-muted-foreground">Account No:</span>
                                                <span className="font-mono font-bold">{paymentDetails.accountNumber || 'Coming Soon'}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="font-medium text-muted-foreground">IFSC Code:</span>
                                                <span className="font-mono font-bold">{paymentDetails.ifscCode || 'Coming Soon'}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="font-medium text-muted-foreground">UPI ID:</span>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-mono font-bold">{paymentDetails.upiId || 'Coming Soon'}</span>
                                                    {paymentDetails.upiId && (
                                                        <Badge variant="outline" className="text-xs">UPI</Badge>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-center py-4 text-muted-foreground mt-4">
                                            <p className="font-medium text-amber-600 dark:text-amber-400">🏦 Bank details coming soon!</p>
                                            <p className="text-sm mt-1">Please use the QR code above to make payment.</p>
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
