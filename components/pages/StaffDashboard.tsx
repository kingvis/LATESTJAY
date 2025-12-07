import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../ui/table";
import { Badge } from "../ui/badge";

interface AnalyticsData {
    reportDate: string;
    financials: {
        totalRevenue: number;
        totalTransactionCount: number;
    };
    teacherPerformance: Array<{
        teacherName: string;
        averageRating: number;
        totalStudents: number;
        completionRate: number;
    }>;
    studentMetrics: {
        totalStudents: number;
        activeCount: number;
        droppedCount: number;
        completedCount: number;
    };
}

export const StaffDashboard = () => {
    const [data, setData] = useState<AnalyticsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:5000/analytics/latest');
                setData(response.data);
            } catch (err) {
                console.error('Error fetching analytics:', err);
                setError('Failed to load analytics data. Please generate a report first.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleGenerateReport = async () => {
        setLoading(true);
        try {
            await axios.post('http://localhost:5000/generate-report');
            const response = await axios.get('http://localhost:5000/analytics/latest');
            setData(response.data);
            setError('');
        } catch (err) {
            console.error('Error generating report:', err);
            setError('Failed to generate new report.');
        } finally {
            setLoading(false);
        }
    };

    if (loading && !data) return <div className="p-8 text-center">Loading Analytics...</div>;

    return (
        <div className="p-8 space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">Staff Analysis Dashboard</h1>
                    <p className="text-muted-foreground">
                        Latest Report: {data ? new Date(data.reportDate).toLocaleString() : 'None'}
                    </p>
                </div>
                <button
                    onClick={handleGenerateReport}
                    className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90"
                >
                    Generate New Report
                </button>
            </div>

            {error && <div className="text-red-500">{error}</div>}

            {data && (
                <>
                    {/* Financials Summary Table */}
                    <div className="border rounded-lg p-4 bg-card">
                        <h2 className="text-xl font-semibold mb-4">Financial Overview</h2>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Metric</TableHead>
                                    <TableHead className="text-right">Value</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <TableRow>
                                    <TableCell>Total Revenue</TableCell>
                                    <TableCell className="text-right font-bold text-green-600">
                                        ${data.financials.totalRevenue.toLocaleString()}
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Total Transactions</TableCell>
                                    <TableCell className="text-right">{data.financials.totalTransactionCount}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </div>

                    {/* Teacher Performance Table */}
                    <div className="border rounded-lg p-4 bg-card">
                        <h2 className="text-xl font-semibold mb-4">Teacher Performance</h2>
                        <Table>
                            <TableCaption>Performance metrics for all teachers.</TableCaption>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Teacher Name</TableHead>
                                    <TableHead className="text-right">Avg Rating</TableHead>
                                    <TableHead className="text-right">Total Students</TableHead>
                                    <TableHead className="text-right">Completion Rate</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {data.teacherPerformance.map((teacher, index) => (
                                    <TableRow key={index}>
                                        <TableCell className="font-medium">{teacher.teacherName}</TableCell>
                                        <TableCell className="text-right">
                                            <Badge variant="outline" className={teacher.averageRating >= 4.5 ? "bg-green-100 text-green-800" : ""}>
                                                {teacher.averageRating.toFixed(1)} / 5.0
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">{teacher.totalStudents}</TableCell>
                                        <TableCell className="text-right">{teacher.completionRate}%</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Student Metrics Table */}
                    <div className="border rounded-lg p-4 bg-card">
                        <h2 className="text-xl font-semibold mb-4">Student Metrics</h2>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Count</TableHead>
                                    <TableHead className="text-right">Percentage</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <TableRow>
                                    <TableCell>Active Students</TableCell>
                                    <TableCell className="text-right">{data.studentMetrics.activeCount}</TableCell>
                                    <TableCell className="text-right">
                                        {((data.studentMetrics.activeCount / data.studentMetrics.totalStudents) * 100).toFixed(1)}%
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Completed Courses</TableCell>
                                    <TableCell className="text-right">{data.studentMetrics.completedCount}</TableCell>
                                    <TableCell className="text-right">
                                        {((data.studentMetrics.completedCount / data.studentMetrics.totalStudents) * 100).toFixed(1)}%
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Dropped Out</TableCell>
                                    <TableCell className="text-right">{data.studentMetrics.droppedCount}</TableCell>
                                    <TableCell className="text-right">
                                        {((data.studentMetrics.droppedCount / data.studentMetrics.totalStudents) * 100).toFixed(1)}%
                                    </TableCell>
                                </TableRow>
                                <TableRow className="bg-muted/50 font-bold">
                                    <TableCell>Total Students</TableCell>
                                    <TableCell className="text-right">{data.studentMetrics.totalStudents}</TableCell>
                                    <TableCell className="text-right">100%</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </div>

                    {/* Payment Configuration */}
                    <PaymentConfig />
                </>
            )}
        </div>
    );
};

const PaymentConfig = () => {
    const [details, setDetails] = useState({
        bankName: '',
        accountNumber: '',
        ifscCode: '',
        upiId: ''
    });
    const [msg, setMsg] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadConfig = async () => {
            try {
                const { getPaymentConfig } = await import('../../services/paymentService');
                const config = await getPaymentConfig();
                if (config) setDetails(config);
            } catch (err) {
                console.error('Failed to load payment config:', err);
            } finally {
                setLoading(false);
            }
        };
        loadConfig();
    }, []);

    const handleSave = async () => {
        try {
            setMsg('Saving...');
            const { updatePaymentConfig } = await import('../../services/paymentService');
            await updatePaymentConfig(details);
            setMsg('Payment details updated successfully!');
            setTimeout(() => setMsg(''), 3000);
        } catch (err) {
            console.error('Failed to save payment config:', err);
            setMsg('Failed to update details.');
        }
    };

    if (loading) {
        return (
            <div className="border rounded-lg p-4 bg-card">
                <h2 className="text-xl font-semibold mb-4">Payment Configuration</h2>
                <p className="text-muted-foreground">Loading...</p>
            </div>
        );
    }

    return (
        <div className="border rounded-lg p-4 bg-card space-y-4">
            <h2 className="text-xl font-semibold">Payment Configuration</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Bank Name</label>
                    <input
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        value={details.bankName}
                        onChange={e => setDetails({ ...details, bankName: e.target.value })}
                        placeholder="e.g. HDFC Bank"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium">Account Number</label>
                    <input
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        value={details.accountNumber}
                        onChange={e => setDetails({ ...details, accountNumber: e.target.value })}
                        placeholder="e.g. 1234567890"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium">IFSC Code</label>
                    <input
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        value={details.ifscCode}
                        onChange={e => setDetails({ ...details, ifscCode: e.target.value })}
                        placeholder="e.g. HDFC0001234"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium">UPI ID</label>
                    <input
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        value={details.upiId}
                        onChange={e => setDetails({ ...details, upiId: e.target.value })}
                        placeholder="e.g. jaymusic@upi"
                    />
                </div>
            </div>
            <div className="flex items-center gap-4">
                <button
                    onClick={handleSave}
                    className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90"
                >
                    Save Configuration
                </button>
                {msg && <span className={`text-sm ${msg.includes('success') ? 'text-green-600' : 'text-muted-foreground'}`}>{msg}</span>}
            </div>
        </div>
    );
};

