-- Create live_course_reg table for enrollments
CREATE TABLE live_course_reg (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  course UUID NOT NULL REFERENCES courses(id),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  discipline TEXT,
  university TEXT,
  phone TEXT,
  messenger TEXT,
  telegram TEXT,
  country TEXT,
  state TEXT,
  city TEXT,
  status TEXT,
  experience TEXT[],
  comments TEXT,
  payment_screenshot_url TEXT,
  payment_method TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE live_course_reg ENABLE ROW LEVEL SECURITY;

-- Create index for course
CREATE INDEX idx_live_course_reg_course ON live_course_reg(course);

-- Allow anyone to select (read)
CREATE POLICY "Allow all read" ON live_course_reg
  FOR SELECT
  USING (true);

-- Allow anyone to insert (write)
CREATE POLICY "Allow all insert" ON live_course_reg
  FOR INSERT
  WITH CHECK (true); 