-- Migration script to add batch column to existing dft_reg table
-- Run this if you have an existing dft_reg table without the batch column

-- Add batch column with default value '2'
ALTER TABLE dft_reg ADD COLUMN IF NOT EXISTS batch TEXT DEFAULT '2';

-- Update existing records to have batch '2' if they don't have a batch value
UPDATE dft_reg SET batch = '2' WHERE batch IS NULL;

-- Create index for batch column
CREATE INDEX IF NOT EXISTS idx_dft_reg_batch ON dft_reg(batch); 