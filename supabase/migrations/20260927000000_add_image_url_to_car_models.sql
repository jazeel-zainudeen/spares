-- Migration: Add image_url to car_models
ALTER TABLE car_models ADD COLUMN IF NOT EXISTS image_url TEXT;
