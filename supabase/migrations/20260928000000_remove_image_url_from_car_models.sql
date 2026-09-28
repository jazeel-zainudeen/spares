-- Migration: Remove image_url from car_models
ALTER TABLE car_models DROP COLUMN IF EXISTS image_url;
