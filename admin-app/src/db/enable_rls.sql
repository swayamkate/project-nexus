-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Enable RLS and setup permissive policies for prototype testing on all tables
-- Trainees
ALTER TABLE trainees ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access trainees" ON trainees FOR SELECT USING (true);
CREATE POLICY "Allow public insert access trainees" ON trainees FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access trainees" ON trainees FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access trainees" ON trainees FOR DELETE USING (true);

-- Training Programs
ALTER TABLE training_programs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access training_programs" ON training_programs FOR SELECT USING (true);
CREATE POLICY "Allow public insert access training_programs" ON training_programs FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access training_programs" ON training_programs FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access training_programs" ON training_programs FOR DELETE USING (true);

-- Trainee Enrollments
ALTER TABLE trainee_enrollments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access trainee_enrollments" ON trainee_enrollments FOR SELECT USING (true);
CREATE POLICY "Allow public insert access trainee_enrollments" ON trainee_enrollments FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access trainee_enrollments" ON trainee_enrollments FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access trainee_enrollments" ON trainee_enrollments FOR DELETE USING (true);

-- Trainee Employment
ALTER TABLE trainee_employment ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access trainee_employment" ON trainee_employment FOR SELECT USING (true);
CREATE POLICY "Allow public insert access trainee_employment" ON trainee_employment FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access trainee_employment" ON trainee_employment FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access trainee_employment" ON trainee_employment FOR DELETE USING (true);

-- Trainee Followups
ALTER TABLE trainee_followups ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access trainee_followups" ON trainee_followups FOR SELECT USING (true);
CREATE POLICY "Allow public insert access trainee_followups" ON trainee_followups FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access trainee_followups" ON trainee_followups FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access trainee_followups" ON trainee_followups FOR DELETE USING (true);

-- Top Skill Gaps
ALTER TABLE top_skill_gaps ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access top_skill_gaps" ON top_skill_gaps FOR SELECT USING (true);
CREATE POLICY "Allow public insert access top_skill_gaps" ON top_skill_gaps FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access top_skill_gaps" ON top_skill_gaps FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access top_skill_gaps" ON top_skill_gaps FOR DELETE USING (true);

-- District Stats
ALTER TABLE district_employment_stats ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access district_employment_stats" ON district_employment_stats FOR SELECT USING (true);
CREATE POLICY "Allow public insert access district_employment_stats" ON district_employment_stats FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access district_employment_stats" ON district_employment_stats FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access district_employment_stats" ON district_employment_stats FOR DELETE USING (true);

-- Recommended Opportunities
ALTER TABLE recommended_opportunities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access recommended_opportunities" ON recommended_opportunities FOR SELECT USING (true);
CREATE POLICY "Allow public insert access recommended_opportunities" ON recommended_opportunities FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access recommended_opportunities" ON recommended_opportunities FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access recommended_opportunities" ON recommended_opportunities FOR DELETE USING (true);

-- Trainee Notifications
ALTER TABLE trainee_notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access trainee_notifications" ON trainee_notifications FOR SELECT USING (true);
CREATE POLICY "Allow public insert access trainee_notifications" ON trainee_notifications FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access trainee_notifications" ON trainee_notifications FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access trainee_notifications" ON trainee_notifications FOR DELETE USING (true);

-- AI Policy Insights
ALTER TABLE ai_policy_insights ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access ai_policy_insights" ON ai_policy_insights FOR SELECT USING (true);
CREATE POLICY "Allow public insert access ai_policy_insights" ON ai_policy_insights FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access ai_policy_insights" ON ai_policy_insights FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access ai_policy_insights" ON ai_policy_insights FOR DELETE USING (true);
