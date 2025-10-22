-- Fix RLS issues on roles and chapters tables

-- Enable RLS on roles and chapters
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE chapters ENABLE ROW LEVEL SECURITY;

-- Roles table: Public read, admin write
CREATE POLICY "Anyone can view roles" ON roles FOR SELECT USING (true);
CREATE POLICY "Only admins can modify roles" ON roles FOR ALL USING (
  EXISTS (SELECT 1 FROM users u WHERE u.id = current_setting('app.current_user_id', true)::uuid AND u.role_id IN (
    SELECT id FROM roles WHERE name IN ('elite_master', 'super_admin')
  ))
);

-- Chapters table: Public read, admin write  
CREATE POLICY "Anyone can view chapters" ON chapters FOR SELECT USING (true);
CREATE POLICY "Only admins can modify chapters" ON chapters FOR ALL USING (
  EXISTS (SELECT 1 FROM users u WHERE u.id = current_setting('app.current_user_id', true)::uuid AND u.role_id IN (
    SELECT id FROM roles WHERE name IN ('elite_master', 'super_admin')
  ))
);