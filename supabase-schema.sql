-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create scan_results table
CREATE TABLE IF NOT EXISTS scan_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL, -- Changed to TEXT to support Firebase UIDs
  url TEXT NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
  vulnerabilities JSONB NOT NULL DEFAULT '[]',
  summary JSONB NOT NULL DEFAULT '{}',
  security_score JSONB NOT NULL DEFAULT '{}',
  certificate_info JSONB,
  scheduled_scan_id UUID, -- Reference to scheduled scan if this was a scheduled scan
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create scheduled_scans table
CREATE TABLE IF NOT EXISTS scheduled_scans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL, -- Changed to TEXT to support Firebase UIDs
  url TEXT NOT NULL,
  name VARCHAR(255) NOT NULL, -- User-friendly name for the scheduled scan
  schedule_type VARCHAR(50) NOT NULL CHECK (schedule_type IN ('random', 'weekly', 'monthly')),
  schedule_config JSONB NOT NULL DEFAULT '{}', -- Configuration for the schedule
  is_active BOOLEAN DEFAULT TRUE,
  last_run TIMESTAMP WITH TIME ZONE,
  next_run TIMESTAMP WITH TIME ZONE,
  total_runs INTEGER DEFAULT 0,
  email_notifications BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_scan_results_user_id ON scan_results(user_id);
CREATE INDEX IF NOT EXISTS idx_scan_results_created_at ON scan_results(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_scan_results_url ON scan_results(url);
CREATE INDEX IF NOT EXISTS idx_scan_results_scheduled_scan_id ON scan_results(scheduled_scan_id);

CREATE INDEX IF NOT EXISTS idx_scheduled_scans_user_id ON scheduled_scans(user_id);
CREATE INDEX IF NOT EXISTS idx_scheduled_scans_next_run ON scheduled_scans(next_run);
CREATE INDEX IF NOT EXISTS idx_scheduled_scans_active ON scheduled_scans(is_active);
CREATE INDEX IF NOT EXISTS idx_scheduled_scans_schedule_type ON scheduled_scans(schedule_type);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE scan_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE scheduled_scans ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for users table
CREATE POLICY "Users can view their own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Create RLS policies for scan_results table
CREATE POLICY "Users can view their own scan results" ON scan_results
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own scan results" ON scan_results
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own scan results" ON scan_results
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own scan results" ON scan_results
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for scheduled_scans table
CREATE POLICY "Users can view their own scheduled scans" ON scheduled_scans
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own scheduled scans" ON scheduled_scans
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own scheduled scans" ON scheduled_scans
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own scheduled scans" ON scheduled_scans
  FOR DELETE USING (auth.uid() = user_id);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_scan_results_updated_at BEFORE UPDATE ON scan_results
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_scheduled_scans_updated_at BEFORE UPDATE ON scheduled_scans
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
