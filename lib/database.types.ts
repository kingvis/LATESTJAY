export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export type UserRole = 'student' | 'teacher' | 'admin';
export type CourseLevel = 'Beginner' | 'Intermediate' | 'Advanced';
export type EnrollmentStatus = 'active' | 'completed' | 'dropped';
export type AttendanceStatus = 'present' | 'absent';
export type PaymentType = 'course_fee' | 'subscription' | 'teacher_payout';
export type PaymentStatus = 'success' | 'failed' | 'pending';
export type SubscriptionPlan = 'monthly' | 'yearly' | 'none';
export type FeePaymentStatus = 'paid' | 'overdue' | 'partial';

export interface Database {
    public: {
        Tables: {
            profiles: {
                Row: {
                    id: string
                    email: string
                    name: string
                    role: UserRole
                    avatar_url: string | null
                    created_at: string
                }
                Insert: {
                    id: string
                    email: string
                    name: string
                    role?: UserRole
                    avatar_url?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    email?: string
                    name?: string
                    role?: UserRole
                    avatar_url?: string | null
                    created_at?: string
                }
            }
            courses: {
                Row: {
                    id: string
                    title: string
                    description: string | null
                    instructor_id: string | null
                    price: number | null
                    duration: string | null
                    level: CourseLevel | null
                    thumbnail: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    title: string
                    description?: string | null
                    instructor_id?: string | null
                    price?: number | null
                    duration?: string | null
                    level?: CourseLevel | null
                    thumbnail?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    title?: string
                    description?: string | null
                    instructor_id?: string | null
                    price?: number | null
                    duration?: string | null
                    level?: CourseLevel | null
                    thumbnail?: string | null
                    created_at?: string
                }
            }
            enrollments: {
                Row: {
                    id: string
                    student_id: string
                    course_id: string
                    progress: number
                    status: EnrollmentStatus
                    tagged_teacher_id: string | null
                    completion_date: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    student_id: string
                    course_id: string
                    progress?: number
                    status?: EnrollmentStatus
                    tagged_teacher_id?: string | null
                    completion_date?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    student_id?: string
                    course_id?: string
                    progress?: number
                    status?: EnrollmentStatus
                    tagged_teacher_id?: string | null
                    completion_date?: string | null
                    created_at?: string
                }
            }
            subscriptions: {
                Row: {
                    id: string
                    user_id: string
                    plan: SubscriptionPlan
                    start_date: string | null
                    expiry_date: string | null
                    is_active: boolean
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    plan?: SubscriptionPlan
                    start_date?: string | null
                    expiry_date?: string | null
                    is_active?: boolean
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    plan?: SubscriptionPlan
                    start_date?: string | null
                    expiry_date?: string | null
                    is_active?: boolean
                    created_at?: string
                }
            }
            attendance: {
                Row: {
                    id: string
                    student_id: string
                    date: string
                    status: AttendanceStatus
                    created_at: string
                }
                Insert: {
                    id?: string
                    student_id: string
                    date?: string
                    status?: AttendanceStatus
                    created_at?: string
                }
                Update: {
                    id?: string
                    student_id?: string
                    date?: string
                    status?: AttendanceStatus
                    created_at?: string
                }
            }
            payments: {
                Row: {
                    id: string
                    user_id: string
                    amount: number
                    currency: string
                    type: PaymentType
                    status: PaymentStatus
                    transaction_id: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    amount: number
                    currency?: string
                    type: PaymentType
                    status?: PaymentStatus
                    transaction_id?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    amount?: number
                    currency?: string
                    type?: PaymentType
                    status?: PaymentStatus
                    transaction_id?: string | null
                    created_at?: string
                }
            }
            teacher_profiles: {
                Row: {
                    id: string
                    user_id: string
                    specialization: string[] | null
                    average_rating: number
                    total_earned: number
                    pending_payout: number
                    classes_conducted: number
                    student_completion_rate: number
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    specialization?: string[] | null
                    average_rating?: number
                    total_earned?: number
                    pending_payout?: number
                    classes_conducted?: number
                    student_completion_rate?: number
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    specialization?: string[] | null
                    average_rating?: number
                    total_earned?: number
                    pending_payout?: number
                    classes_conducted?: number
                    student_completion_rate?: number
                    created_at?: string
                }
            }
            teacher_ratings: {
                Row: {
                    id: string
                    teacher_id: string
                    student_id: string
                    score: number
                    review: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    teacher_id: string
                    student_id: string
                    score: number
                    review?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    teacher_id?: string
                    student_id?: string
                    score?: number
                    review?: string | null
                    created_at?: string
                }
            }
            student_performance: {
                Row: {
                    id: string
                    student_id: string
                    average_score: number
                    assignments_completed: number
                    fee_payment_status: FeePaymentStatus
                    created_at: string
                }
                Insert: {
                    id?: string
                    student_id: string
                    average_score?: number
                    assignments_completed?: number
                    fee_payment_status?: FeePaymentStatus
                    created_at?: string
                }
                Update: {
                    id?: string
                    student_id?: string
                    average_score?: number
                    assignments_completed?: number
                    fee_payment_status?: FeePaymentStatus
                    created_at?: string
                }
            }
            analytics_reports: {
                Row: {
                    id: string
                    report_date: string
                    total_revenue: number
                    total_transaction_count: number
                    total_students: number
                    active_count: number
                    dropped_count: number
                    completed_count: number
                    created_at: string
                }
                Insert: {
                    id?: string
                    report_date?: string
                    total_revenue?: number
                    total_transaction_count?: number
                    total_students?: number
                    active_count?: number
                    dropped_count?: number
                    completed_count?: number
                    created_at?: string
                }
                Update: {
                    id?: string
                    report_date?: string
                    total_revenue?: number
                    total_transaction_count?: number
                    total_students?: number
                    active_count?: number
                    dropped_count?: number
                    completed_count?: number
                    created_at?: string
                }
            }
            teacher_performance: {
                Row: {
                    id: string
                    report_id: string
                    teacher_id: string
                    teacher_name: string | null
                    average_rating: number
                    total_students: number
                    completion_rate: number
                }
                Insert: {
                    id?: string
                    report_id: string
                    teacher_id: string
                    teacher_name?: string | null
                    average_rating?: number
                    total_students?: number
                    completion_rate?: number
                }
                Update: {
                    id?: string
                    report_id?: string
                    teacher_id?: string
                    teacher_name?: string | null
                    average_rating?: number
                    total_students?: number
                    completion_rate?: number
                }
            }
            system_config: {
                Row: {
                    id: string
                    key: string
                    value: Json | null
                    updated_at: string
                }
                Insert: {
                    id?: string
                    key: string
                    value?: Json | null
                    updated_at?: string
                }
                Update: {
                    id?: string
                    key?: string
                    value?: Json | null
                    updated_at?: string
                }
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            [_ in never]: never
        }
        Enums: {
            [_ in never]: never
        }
    }
}

// Helper types for easier usage
export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Course = Database['public']['Tables']['courses']['Row'];
export type Enrollment = Database['public']['Tables']['enrollments']['Row'];
export type Subscription = Database['public']['Tables']['subscriptions']['Row'];
export type Attendance = Database['public']['Tables']['attendance']['Row'];
export type Payment = Database['public']['Tables']['payments']['Row'];
export type TeacherProfile = Database['public']['Tables']['teacher_profiles']['Row'];
export type TeacherRating = Database['public']['Tables']['teacher_ratings']['Row'];
export type StudentPerformance = Database['public']['Tables']['student_performance']['Row'];
export type AnalyticsReport = Database['public']['Tables']['analytics_reports']['Row'];
export type TeacherPerformance = Database['public']['Tables']['teacher_performance']['Row'];
export type SystemConfig = Database['public']['Tables']['system_config']['Row'];
