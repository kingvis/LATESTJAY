-- Jay Music Academy Row Level Security Policies
-- Migration: RLS Policies Setup

-- ============================================
-- ENABLE RLS ON ALL TABLES
-- ============================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE teacher_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE teacher_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_performance ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE teacher_performance ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_config ENABLE ROW LEVEL SECURITY;

-- ============================================
-- PROFILES POLICIES
-- ============================================
-- Everyone can view profiles (for displaying names, etc.)
CREATE POLICY "Profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

-- Users can update their own profile
CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- ============================================
-- COURSES POLICIES
-- ============================================
-- Everyone can view courses
CREATE POLICY "Courses are viewable by everyone"
  ON courses FOR SELECT
  USING (true);

-- Admins can create courses
CREATE POLICY "Admins can create courses"
  ON courses FOR INSERT
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Admins can update courses
CREATE POLICY "Admins can update courses"
  ON courses FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Admins can delete courses
CREATE POLICY "Admins can delete courses"
  ON courses FOR DELETE
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================
-- ENROLLMENTS POLICIES
-- ============================================
-- Students can view their own enrollments
CREATE POLICY "Students can view own enrollments"
  ON enrollments FOR SELECT
  USING (
    auth.uid() = student_id OR
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'teacher'))
  );

-- Students can create their own enrollments
CREATE POLICY "Students can create own enrollments"
  ON enrollments FOR INSERT
  WITH CHECK (auth.uid() = student_id);

-- Students can update their own enrollments (progress)
CREATE POLICY "Students can update own enrollments"
  ON enrollments FOR UPDATE
  USING (
    auth.uid() = student_id OR
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================
-- SUBSCRIPTIONS POLICIES
-- ============================================
-- Users can view their own subscriptions
CREATE POLICY "Users can view own subscriptions"
  ON subscriptions FOR SELECT
  USING (
    auth.uid() = user_id OR
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Admins can manage subscriptions
CREATE POLICY "Admins can manage subscriptions"
  ON subscriptions FOR ALL
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================
-- ATTENDANCE POLICIES
-- ============================================
-- Students can view their own attendance
CREATE POLICY "Students can view own attendance"
  ON attendance FOR SELECT
  USING (
    auth.uid() = student_id OR
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'teacher'))
  );

-- Teachers and admins can manage attendance
CREATE POLICY "Teachers and admins can manage attendance"
  ON attendance FOR ALL
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'teacher'))
  );

-- ============================================
-- PAYMENTS POLICIES
-- ============================================
-- Users can view their own payments
CREATE POLICY "Users can view own payments"
  ON payments FOR SELECT
  USING (
    auth.uid() = user_id OR
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Anyone can create payments (for checkout)
CREATE POLICY "Anyone can create payments"
  ON payments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Admins can update payment status
CREATE POLICY "Admins can update payments"
  ON payments FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================
-- TEACHER PROFILES POLICIES
-- ============================================
-- Everyone can view teacher profiles
CREATE POLICY "Teacher profiles are viewable by everyone"
  ON teacher_profiles FOR SELECT
  USING (true);

-- Teachers can update their own profile
CREATE POLICY "Teachers can update own profile"
  ON teacher_profiles FOR UPDATE
  USING (
    auth.uid() = user_id OR
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Admins can manage teacher profiles
CREATE POLICY "Admins can manage teacher profiles"
  ON teacher_profiles FOR ALL
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================
-- TEACHER RATINGS POLICIES
-- ============================================
-- Everyone can view ratings
CREATE POLICY "Ratings are viewable by everyone"
  ON teacher_ratings FOR SELECT
  USING (true);

-- Students can rate teachers
CREATE POLICY "Students can rate teachers"
  ON teacher_ratings FOR INSERT
  WITH CHECK (
    auth.uid() = student_id AND
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'student')
  );

-- Students can update their own ratings
CREATE POLICY "Students can update own ratings"
  ON teacher_ratings FOR UPDATE
  USING (auth.uid() = student_id);

-- ============================================
-- STUDENT PERFORMANCE POLICIES
-- ============================================
-- Students view own, admins/teachers view all
CREATE POLICY "Students can view own performance"
  ON student_performance FOR SELECT
  USING (
    auth.uid() = student_id OR
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'teacher'))
  );

-- Admins and teachers can update performance
CREATE POLICY "Admins and teachers can update performance"
  ON student_performance FOR ALL
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'teacher'))
  );

-- ============================================
-- ANALYTICS REPORTS POLICIES
-- ============================================
-- Only admins can view analytics
CREATE POLICY "Only admins can view analytics"
  ON analytics_reports FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Only admins can manage analytics
CREATE POLICY "Only admins can manage analytics"
  ON analytics_reports FOR ALL
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================
-- TEACHER PERFORMANCE (Analytics) POLICIES
-- ============================================
CREATE POLICY "Only admins can view teacher performance"
  ON teacher_performance FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Only admins can manage teacher performance"
  ON teacher_performance FOR ALL
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================
-- SYSTEM CONFIG POLICIES
-- ============================================
-- Everyone can read config
CREATE POLICY "Config is readable by everyone"
  ON system_config FOR SELECT
  USING (true);

-- Only admins can modify config
CREATE POLICY "Only admins can modify config"
  ON system_config FOR ALL
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );
