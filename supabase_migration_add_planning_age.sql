-- Migration: Add planning_age column to retirement_plans table
-- Date: 2026-05-30
-- Description: Add planning_age field to store user's target age for retirement fund planning

ALTER TABLE public.retirement_plans 
ADD COLUMN IF NOT EXISTS planning_age INTEGER;

-- Add comment to explain the column
COMMENT ON COLUMN public.retirement_plans.planning_age IS 'Target age until which retirement funds should last (based on mortality table, max P90)';
