# Jay Music Academy
## Technical Integration & Platform Documentation

> **Live URL:** https://latestjay.vercel.app  
> **Repository:** https://github.com/kingvis/LATESTJAY  
> **Last Updated:** December 9, 2025

---

## Executive Summary

Jay Music Academy is a comprehensive music education platform built with modern web technologies. This document provides complete technical documentation covering:

- Data Integration & APIs
- Authentication System
- Payment Workflow
- Dashboard Features
- Real-time Capabilities

---

## 🛠️ Technology Stack

### Frontend

| Technology | Purpose |
|------------|---------|
| React 18 | UI Framework |
| TypeScript | Type Safety |
| Vite | Build Tool |
| Framer Motion | Animations |
| TailwindCSS | Styling |

### Backend (Supabase)

| Service | Purpose |
|---------|---------|
| Supabase Auth | User Authentication |
| Supabase Database | PostgreSQL Database |
| Supabase Storage | File Storage |
| Supabase Edge Functions | Serverless Functions |
| Supabase Realtime | Live Updates |

---

## 🔑 API Keys & Configuration

### Environment Variables

```bash
# Supabase Configuration
VITE_SUPABASE_URL=https://etevyujjjkgnodonxmxl.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV0ZXZ5dWpqamtnbm9kb254bXhsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEwOTYxODgsImV4cCI6MjA2NjY3MjE4OH0.7PBmUffU8mFAIZRmRDnShZIFM0kNK4GTEltWLeiRMXo
```

### Key Configuration Details

| Key | Description | Security Level |
|-----|-------------|----------------|
| SUPABASE_URL | Project endpoint URL | Public |
| SUPABASE_ANON_KEY | Anonymous/Public API key | Public |
| SUPABASE_SERVICE_ROLE_KEY | Admin key (server-side only) | 🔒 Secret |
| RESEND_API_KEY | Email service API key | 🔒 Secret |

> [!IMPORTANT]
> The anon key is safe for client-side use. Row Level Security (RLS) policies protect data access.

---

## 📊 Database Schema

### Entity Relationship Diagram

```mermaid
erDiagram
    auth_users ||--|| profiles : "has"
    profiles ||--o{ enrollments : "creates"
    profiles ||--o{ payments : "makes"
    profiles ||--o{ subscriptions : "has"
    profiles ||--o{ attendance : "tracked"
    profiles ||--o{ teacher_profiles : "has"
    courses ||--o{ enrollments : "contains"
    teacher_profiles ||--o{ teacher_ratings : "receives"
    analytics_reports ||--o{ teacher_performance : "includes"
```

### Table Definitions

#### 1. profiles - User Profiles

```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  role TEXT CHECK (role IN ('student', 'teacher', 'admin')),
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Purpose:** Extends Supabase Auth users with custom profile data.

---

#### 2. courses - Course Catalog

```sql
CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  instructor_id UUID REFERENCES profiles(id),
  price DECIMAL(10, 2),
  duration TEXT,
  level TEXT CHECK (level IN ('Beginner', 'Intermediate', 'Advanced')),
  thumbnail TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Purpose:** Stores all music courses offered on the platform.

---

#### 3. enrollments - Student Enrollments

```sql
CREATE TABLE enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES profiles(id),
  course_id UUID REFERENCES courses(id),
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  status TEXT CHECK (status IN ('active', 'completed', 'dropped')),
  tagged_teacher_id UUID REFERENCES profiles(id),
  completion_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(student_id, course_id)
);
```

**Purpose:** Tracks student course enrollments and progress.

---

#### 4. payments - Payment Records

```sql
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  amount DECIMAL(10, 2) NOT NULL,
  currency TEXT DEFAULT 'INR',
  type TEXT CHECK (type IN ('course_fee', 'subscription', 'teacher_payout')),
  status TEXT CHECK (status IN ('success', 'failed', 'pending')),
  transaction_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Purpose:** Stores all payment transactions.

---

#### 5. subscriptions - User Subscriptions

```sql
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  plan TEXT CHECK (plan IN ('monthly', 'yearly', 'none')),
  start_date TIMESTAMPTZ,
  expiry_date TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Purpose:** Manages subscription plans and billing cycles.

---

#### 6. system_config - System Configuration

```sql
CREATE TABLE system_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL UNIQUE,
  value JSONB,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Purpose:** Stores system-wide configuration like payment details.

**Example - Payment Details:**
```json
{
  "bankName": "HDFC Bank",
  "accountNumber": "1234567890",
  "ifscCode": "HDFC0001234",
  "upiId": "jaymusic@upi"
}
```

---

## 🔐 Authentication System

### Authentication Flow

```mermaid
sequenceDiagram
    participant User
    participant App
    participant Supabase Auth
    participant Database

    User->>App: Enter credentials
    App->>Supabase Auth: signUp/signIn
    Supabase Auth->>Database: Validate credentials
    Database-->>Supabase Auth: Create session
    Supabase Auth-->>App: Return session + user
    App->>Database: Fetch profile
    Database-->>App: Profile data
    App-->>User: Logged in
```

### Authentication Functions

#### Sign Up
```typescript
export const signUp = async (
  email: string, 
  password: string, 
  name: string, 
  role: 'student' | 'teacher' | 'admin'
) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name, role }
    }
  });
  return data;
};
```

#### Sign In
```typescript
export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  return data;
};
```

#### Session Persistence
```typescript
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: window.localStorage
  }
});
```

---

## 💳 Payment System

### Payment Workflow

```mermaid
flowchart TD
    A[User Selects Plan] --> B[Payment Modal Opens]
    B --> C{Payment Details Configured?}
    C -->|Yes| D[Display Bank/UPI Details]
    C -->|No| E[Show Configuration Message]
    D --> F[User Makes Bank Transfer]
    F --> G["User Clicks 'I Made Payment'"]
    G --> H[Create Payment Record<br/>Status: PENDING]
    H --> I[Success Message]
    I --> J[Admin Dashboard]
    J --> K[Admin Reviews Payment]
    K --> L{Approve?}
    L -->|Yes| M[Update Status: SUCCESS]
    L -->|No| N[Update Status: FAILED]
    M --> O[Trigger Email Function]
    O --> P[Send Confirmation Email]
```

### Payment Service Functions

#### Create Payment
```typescript
export async function createPayment(params: {
  amount: number;
  type: 'course_fee' | 'subscription' | 'teacher_payout';
  planName: string;
  currency?: string;
}): Promise<PaymentResult> {
  // Get authenticated user
  const { data: { user } } = await supabase.auth.getUser();
  
  // Generate transaction ID
  const transactionId = `TXN_${Date.now()}_${randomString()}`;
  
  // Insert payment record
  const { data, error } = await supabase
    .from('payments')
    .insert({
      user_id: user.id,
      amount: params.amount,
      currency: params.currency || 'INR',
      type: params.type,
      status: 'pending',
      transaction_id: transactionId
    })
    .select()
    .single();
    
  return { success: true, payment: data };
}
```

#### Update Payment Status (Admin)
```typescript
export async function updatePaymentStatus(
  paymentId: string,
  status: 'success' | 'failed' | 'pending'
): Promise<PaymentResult> {
  const { data, error } = await supabase
    .from('payments')
    .update({ status })
    .eq('id', paymentId)
    .select()
    .single();
    
  // Trigger email on success
  if (status === 'success') {
    await sendPaymentConfirmationEmail(data);
  }
  
  return { success: true, payment: data };
}
```

### Email Notification (Edge Function)

```typescript
// supabase/functions/send-payment-email/index.ts
serve(async (req) => {
  const { to, userName, amount, currency, transactionId } = await req.json();
  
  // Send via Resend API
  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from: 'Jay Music Academy <noreply@jaymusicacademy.in>',
      to: [to],
      subject: `✓ Payment Confirmed - ${currency} ${amount}`,
      html: emailTemplate
    })
  });
});
```

---

## 📊 Dashboard Features

### Student Dashboard

| Feature | Description |
|---------|-------------|
| My Courses | View enrolled courses with progress |
| Progress Tracking | Visual progress bars for each course |
| Attendance | View attendance history |
| Payments | Payment history and receipts |
| Subscription | Current plan and renewal date |

**Example: Fetching Enrolled Courses**
```typescript
const { data: enrollments } = await supabase
  .from('enrollments')
  .select(`
    *,
    course:courses(*)
  `)
  .eq('student_id', userId)
  .eq('status', 'active');
```

---

### Teacher Dashboard

| Feature | Description |
|---------|-------------|
| My Students | List of enrolled students |
| Course Management | Create/edit courses |
| Ratings | View student ratings and reviews |
| Earnings | Total earned: ₹2,70,000, Pending: ₹1,00,000 |
| Analytics | Student completion rates |

**Example: Teacher Profile Data**
```typescript
const { data: profile } = await supabase
  .from('teacher_profiles')
  .select(`
    *,
    user:profiles(name, email, avatar_url)
  `)
  .eq('user_id', teacherId)
  .single();
```

---

### Admin/Staff Dashboard

#### 1. Financial Overview

| Metric | Query |
|--------|-------|
| Total Revenue | `SUM(amount) WHERE status = 'success'` |
| Transaction Count | `COUNT(*) FROM payments` |
| Pending Payments | `COUNT(*) WHERE status = 'pending'` |

#### 2. Teacher Performance
```typescript
const teacherMetrics = await supabase
  .from('teacher_profiles')
  .select(`
    user:profiles(name),
    average_rating,
    total_students,
    completion_rate
  `)
  .order('average_rating', { ascending: false });
```

#### 3. Student Metrics

| Metric | Description |
|--------|-------------|
| Total Students | All registered students |
| Active Students | Currently enrolled |
| Completed | Finished at least one course |
| Dropped | Inactive/cancelled |

#### 4. Payment Configuration
```typescript
// Get payment details
const config = await supabase
  .from('system_config')
  .select('value')
  .eq('key', 'paymentDetails')
  .single();

// Update payment details
await supabase
  .from('system_config')
  .upsert({
    key: 'paymentDetails',
    value: {
      bankName: 'HDFC Bank',
      accountNumber: '1234567890',
      ifscCode: 'HDFC0001234',
      upiId: 'jaymusic@upi'
    }
  });
```

---

## 🔒 Row Level Security (RLS)

### Security Policies

#### Profiles
```sql
-- Anyone can view profiles
CREATE POLICY "Profiles are viewable by everyone"
  ON profiles FOR SELECT USING (true);

-- Users can only update their own profile
CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE USING (auth.uid() = id);
```

#### Payments
```sql
-- Users can view their own payments
CREATE POLICY "Users can view own payments"
  ON payments FOR SELECT
  USING (auth.uid() = user_id OR role = 'admin');

-- Authenticated users can create payments
CREATE POLICY "Authenticated users can create payments"
  ON payments FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Only admins can update payment status
CREATE POLICY "Admins can update payments"
  ON payments FOR UPDATE
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
```

---

## 🔄 Real-time Features

### Live Subscriptions

#### Real-time Payments
```typescript
const subscription = supabase
  .channel('payments-changes')
  .on(
    'postgres_changes',
    {
      event: '*',
      schema: 'public',
      table: 'payments'
    },
    (payload) => {
      console.log('Payment changed:', payload);
      // Update UI automatically
    }
  )
  .subscribe();
```

#### Real-time Enrollments
```typescript
const enrollmentSub = supabase
  .channel('enrollment-updates')
  .on(
    'postgres_changes',
    {
      event: 'UPDATE',
      schema: 'public',
      table: 'enrollments',
      filter: `student_id=eq.${userId}`
    },
    (payload) => {
      // Progress updated in real-time
      updateProgress(payload.new.progress);
    }
  )
  .subscribe();
```

---

## 📋 Pricing Plans (INR)

### Student Plans

| Plan | Price | Features |
|------|-------|----------|
| Monthly | ₹2,499/month | All courses, weekly live sessions |
| Yearly | ₹19,999/year | All monthly features + 2 months free + offline downloads |

### Teacher Plans

| Plan | Price | Features |
|------|-------|----------|
| Monthly | ₹999/month | Verified badge, unlimited course uploads |
| Yearly | ₹7,999/year | All monthly + analytics dashboard + priority support |

---

## 🚀 Deployment Checklist

### Required Steps

- [ ] Run SQL migrations in Supabase Dashboard
- [ ] Configure environment variables
- [ ] Disable email confirmation (optional)
- [ ] Deploy Edge Function for emails
- [ ] Set RESEND_API_KEY secret
- [ ] Configure payment details in Staff Dashboard

### SQL Migration Order

```
20241207000001_initial_schema.sql     - Tables
20241207000002_rls_policies.sql       - Security
20241207000003_storage.sql            - Storage buckets
20241207000004_payment_trigger.sql    - Triggers
```

---

## 🔮 Future Roadmap

### Phase 1: Enhanced Features
- [ ] Video streaming for courses
- [ ] Live class scheduling with calendar
- [ ] Push notifications

### Phase 2: Mobile App
- [ ] React Native mobile app
- [ ] Offline course downloads
- [ ] Mobile payment integration (UPI deep links)

### Phase 3: AI Features
- [ ] AI-powered vocal coach
- [ ] Music composition assistant
- [ ] Personalized learning paths

### Phase 4: Integrations
- [ ] Razorpay payment gateway
- [ ] WhatsApp notifications
- [ ] Google Calendar sync
- [ ] Zoom integration for live classes

---

## 📞 Support & Contact

| Type | Details |
|------|---------|
| **Email** | Hello@jaymusicacademy.in |
| **Phone** | +91 8754482015 |
| **Dashboard** | https://latestjay.vercel.app/contact |
| **Repository** | https://github.com/kingvis/LATESTJAY |

---

*Document prepared for Jay Music Academy client presentation.*  
*© 2025 Jay Music Academy. All rights reserved.*
