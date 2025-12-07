import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../contexts/AuthContext';
import type {
    Course,
    Enrollment,
    Payment,
    Profile,
    TeacherProfile,
    StudentPerformance,
    Attendance,
    AnalyticsReport,
    Subscription
} from '../lib/database.types';

// ============================================
// PROFILE HOOKS
// ============================================
export function useProfile() {
    const { user } = useAuth();
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchProfile = useCallback(async () => {
        if (!user?.id) {
            setLoading(false);
            return;
        }

        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();

            if (error) throw error;
            setProfile(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [user?.id]);

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    return { profile, loading, error, refetch: fetchProfile };
}

// ============================================
// COURSES HOOKS
// ============================================
export function useCourses() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchCourses = useCallback(async () => {
        try {
            const { data, error } = await supabase
                .from('courses')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setCourses(data || []);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCourses();

        // Real-time subscription
        const channel = supabase
            .channel('courses-changes')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'courses' }, () => {
                fetchCourses();
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [fetchCourses]);

    const createCourse = async (course: Omit<Course, 'id' | 'created_at'>) => {
        const { data, error } = await supabase.from('courses').insert(course).select().single();
        if (error) throw error;
        return data;
    };

    const updateCourse = async (id: string, updates: Partial<Course>) => {
        const { data, error } = await supabase.from('courses').update(updates).eq('id', id).select().single();
        if (error) throw error;
        return data;
    };

    const deleteCourse = async (id: string) => {
        const { error } = await supabase.from('courses').delete().eq('id', id);
        if (error) throw error;
    };

    return { courses, loading, error, refetch: fetchCourses, createCourse, updateCourse, deleteCourse };
}

// ============================================
// ENROLLMENTS HOOKS
// ============================================
export function useEnrollments() {
    const { user } = useAuth();
    const [enrollments, setEnrollments] = useState<(Enrollment & { course?: Course })[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchEnrollments = useCallback(async () => {
        if (!user?.id) {
            setLoading(false);
            return;
        }

        try {
            const { data, error } = await supabase
                .from('enrollments')
                .select(`
          *,
          course:courses(*)
        `)
                .eq('student_id', user.id)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setEnrollments(data || []);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [user?.id]);

    useEffect(() => {
        fetchEnrollments();

        // Real-time subscription
        if (user?.id) {
            const channel = supabase
                .channel('enrollments-changes')
                .on('postgres_changes', {
                    event: '*',
                    schema: 'public',
                    table: 'enrollments',
                    filter: `student_id=eq.${user.id}`
                }, () => {
                    fetchEnrollments();
                })
                .subscribe();

            return () => {
                supabase.removeChannel(channel);
            };
        }
    }, [fetchEnrollments, user?.id]);

    const enrollInCourse = async (courseId: string) => {
        if (!user?.id) throw new Error('Not authenticated');

        const { data, error } = await supabase
            .from('enrollments')
            .insert({ student_id: user.id, course_id: courseId })
            .select()
            .single();

        if (error) throw error;
        return data;
    };

    const updateProgress = async (enrollmentId: string, progress: number) => {
        const { data, error } = await supabase
            .from('enrollments')
            .update({
                progress,
                status: progress >= 100 ? 'completed' : 'active',
                completion_date: progress >= 100 ? new Date().toISOString() : null
            })
            .eq('id', enrollmentId)
            .select()
            .single();

        if (error) throw error;
        return data;
    };

    return { enrollments, loading, error, refetch: fetchEnrollments, enrollInCourse, updateProgress };
}

// ============================================
// PAYMENTS HOOKS
// ============================================
export function usePayments() {
    const { user } = useAuth();
    const [payments, setPayments] = useState<Payment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchPayments = useCallback(async () => {
        if (!user?.id) {
            setLoading(false);
            return;
        }

        try {
            const { data, error } = await supabase
                .from('payments')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setPayments(data || []);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [user?.id]);

    useEffect(() => {
        fetchPayments();
    }, [fetchPayments]);

    const createPayment = async (payment: Omit<Payment, 'id' | 'created_at' | 'user_id'>) => {
        if (!user?.id) throw new Error('Not authenticated');

        const { data, error } = await supabase
            .from('payments')
            .insert({ ...payment, user_id: user.id })
            .select()
            .single();

        if (error) throw error;
        return data;
    };

    return { payments, loading, error, refetch: fetchPayments, createPayment };
}

// ============================================
// TEACHER PROFILE HOOKS
// ============================================
export function useTeacherProfile(userId?: string) {
    const { user } = useAuth();
    const [teacherProfile, setTeacherProfile] = useState<TeacherProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const targetUserId = userId || user?.id;

    const fetchTeacherProfile = useCallback(async () => {
        if (!targetUserId) {
            setLoading(false);
            return;
        }

        try {
            const { data, error } = await supabase
                .from('teacher_profiles')
                .select('*')
                .eq('user_id', targetUserId)
                .single();

            if (error && error.code !== 'PGRST116') throw error;
            setTeacherProfile(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [targetUserId]);

    useEffect(() => {
        fetchTeacherProfile();
    }, [fetchTeacherProfile]);

    return { teacherProfile, loading, error, refetch: fetchTeacherProfile };
}

// ============================================
// STUDENT PERFORMANCE HOOKS
// ============================================
export function useStudentPerformance() {
    const { user } = useAuth();
    const [performance, setPerformance] = useState<StudentPerformance | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchPerformance = useCallback(async () => {
        if (!user?.id) {
            setLoading(false);
            return;
        }

        try {
            const { data, error } = await supabase
                .from('student_performance')
                .select('*')
                .eq('student_id', user.id)
                .single();

            if (error && error.code !== 'PGRST116') throw error;
            setPerformance(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [user?.id]);

    useEffect(() => {
        fetchPerformance();
    }, [fetchPerformance]);

    return { performance, loading, error, refetch: fetchPerformance };
}

// ============================================
// ATTENDANCE HOOKS
// ============================================
export function useAttendance() {
    const { user } = useAuth();
    const [attendance, setAttendance] = useState<Attendance[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchAttendance = useCallback(async () => {
        if (!user?.id) {
            setLoading(false);
            return;
        }

        try {
            const { data, error } = await supabase
                .from('attendance')
                .select('*')
                .eq('student_id', user.id)
                .order('date', { ascending: false })
                .limit(30);

            if (error) throw error;
            setAttendance(data || []);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [user?.id]);

    useEffect(() => {
        fetchAttendance();
    }, [fetchAttendance]);

    return { attendance, loading, error, refetch: fetchAttendance };
}

// ============================================
// SUBSCRIPTION HOOKS
// ============================================
export function useSubscription() {
    const { user } = useAuth();
    const [subscription, setSubscription] = useState<Subscription | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchSubscription = useCallback(async () => {
        if (!user?.id) {
            setLoading(false);
            return;
        }

        try {
            const { data, error } = await supabase
                .from('subscriptions')
                .select('*')
                .eq('user_id', user.id)
                .eq('is_active', true)
                .single();

            if (error && error.code !== 'PGRST116') throw error;
            setSubscription(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [user?.id]);

    useEffect(() => {
        fetchSubscription();
    }, [fetchSubscription]);

    return { subscription, loading, error, refetch: fetchSubscription };
}

// ============================================
// ANALYTICS HOOKS (Admin only)
// ============================================
export function useAnalytics() {
    const { user } = useAuth();
    const [report, setReport] = useState<AnalyticsReport | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchLatestReport = useCallback(async () => {
        if (user?.role !== 'admin') {
            setLoading(false);
            return;
        }

        try {
            const { data, error } = await supabase
                .from('analytics_reports')
                .select('*')
                .order('report_date', { ascending: false })
                .limit(1)
                .single();

            if (error && error.code !== 'PGRST116') throw error;
            setReport(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [user?.role]);

    useEffect(() => {
        fetchLatestReport();
    }, [fetchLatestReport]);

    const generateReport = async () => {
        // Get all necessary data
        const [paymentsRes, enrollmentsRes, studentsRes] = await Promise.all([
            supabase.from('payments').select('amount, status'),
            supabase.from('enrollments').select('status'),
            supabase.from('profiles').select('id').eq('role', 'student')
        ]);

        const payments = paymentsRes.data || [];
        const enrollments = enrollmentsRes.data || [];
        const students = studentsRes.data || [];

        const successfulPayments = payments.filter(p => p.status === 'success');
        const totalRevenue = successfulPayments.reduce((sum, p) => sum + (p.amount || 0), 0);

        const { data, error } = await supabase
            .from('analytics_reports')
            .insert({
                total_revenue: totalRevenue,
                total_transaction_count: payments.length,
                total_students: students.length,
                active_count: enrollments.filter(e => e.status === 'active').length,
                dropped_count: enrollments.filter(e => e.status === 'dropped').length,
                completed_count: enrollments.filter(e => e.status === 'completed').length
            })
            .select()
            .single();

        if (error) throw error;
        setReport(data);
        return data;
    };

    return { report, loading, error, refetch: fetchLatestReport, generateReport };
}

// ============================================
// ALL STUDENTS (Admin/Teacher)
// ============================================
export function useAllStudents() {
    const { user } = useAuth();
    const [students, setStudents] = useState<Profile[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchStudents = useCallback(async () => {
        if (!user || !['admin', 'teacher'].includes(user.role)) {
            setLoading(false);
            return;
        }

        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('role', 'student')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setStudents(data || []);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        fetchStudents();
    }, [fetchStudents]);

    return { students, loading, error, refetch: fetchStudents };
}

// ============================================
// ALL TEACHERS (Admin)
// ============================================
export function useAllTeachers() {
    const { user } = useAuth();
    const [teachers, setTeachers] = useState<(Profile & { teacher_profile?: TeacherProfile })[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchTeachers = useCallback(async () => {
        if (user?.role !== 'admin') {
            setLoading(false);
            return;
        }

        try {
            const { data, error } = await supabase
                .from('profiles')
                .select(`
          *,
          teacher_profile:teacher_profiles(*)
        `)
                .eq('role', 'teacher')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setTeachers(data || []);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [user?.role]);

    useEffect(() => {
        fetchTeachers();
    }, [fetchTeachers]);

    return { teachers, loading, error, refetch: fetchTeachers };
}

// ============================================
// SYSTEM CONFIG HOOKS
// ============================================
export function useSystemConfig(key: string) {
    const [config, setConfig] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchConfig = useCallback(async () => {
        try {
            const { data, error } = await supabase
                .from('system_config')
                .select('value')
                .eq('key', key)
                .single();

            if (error && error.code !== 'PGRST116') throw error;
            setConfig(data?.value || null);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [key]);

    useEffect(() => {
        fetchConfig();
    }, [fetchConfig]);

    const updateConfig = async (value: any) => {
        const { error } = await supabase
            .from('system_config')
            .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: 'key' });

        if (error) throw error;
        setConfig(value);
    };

    return { config, loading, error, refetch: fetchConfig, updateConfig };
}
