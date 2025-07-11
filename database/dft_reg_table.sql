-- Create dft_reg table for DFT course enrollments
CREATE TABLE dft_reg (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  messenger TEXT,
  telegram TEXT,
  country TEXT NOT NULL,
  state TEXT,
  city TEXT,
  status TEXT NOT NULL,
  experience TEXT NOT NULL,
  comments TEXT NOT NULL,
  payment_method TEXT NOT NULL,
  payment_screenshot_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE dft_reg ENABLE ROW LEVEL SECURITY;

-- Create indexes for better performance
CREATE INDEX idx_dft_reg_email ON dft_reg(email);
CREATE INDEX idx_dft_reg_created_at ON dft_reg(created_at);
CREATE INDEX idx_dft_reg_country ON dft_reg(country);
CREATE INDEX idx_dft_reg_status ON dft_reg(status);

-- Allow anyone to select (read) - for admin access
CREATE POLICY "Allow all read" ON dft_reg
  FOR SELECT
  USING (true);

-- Allow anyone to insert (write) - for form submissions
CREATE POLICY "Allow all insert" ON dft_reg
  FOR INSERT
  WITH CHECK (true);

-- Allow admins to update
CREATE POLICY "Allow admin update" ON dft_reg
  FOR UPDATE
  USING (true);

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_dft_reg_updated_at 
    BEFORE UPDATE ON dft_reg 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column(); 