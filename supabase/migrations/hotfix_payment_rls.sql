-- HOTFIX: Run this in Supabase SQL Editor to fix payment issues
-- https://supabase.com/dashboard/project/etevyujjjkgnodonxmxl/sql/new

-- 1. Drop existing problematic policies
DROP POLICY IF EXISTS "Anyone can create payments" ON payments;
DROP POLICY IF EXISTS "Only admins can modify config" ON system_config;

-- 2. Create fixed payment insert policy (more permissive)
CREATE POLICY "Authenticated users can create payments"
  ON payments FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- 3. Allow authenticated users to insert into system_config (for payment notifications)
CREATE POLICY "Authenticated can insert config"
  ON system_config FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- 4. Keep admin-only update for config
CREATE POLICY "Admins can update config"
  ON system_config FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admins can delete config"
  ON system_config FOR DELETE
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Verify: Check if payment table has proper RLS
SELECT tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'payments';
