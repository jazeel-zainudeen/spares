-- Migration: Add support for multiple images on parts
ALTER TABLE parts ADD COLUMN IF NOT EXISTS image_urls TEXT[] DEFAULT '{}';
ALTER TABLE parts ADD COLUMN IF NOT EXISTS cloudinary_public_ids TEXT[] DEFAULT '{}';

-- Backfill existing single image_url into image_urls for existing records
UPDATE parts
SET image_urls = ARRAY[image_url],
    cloudinary_public_ids = CASE 
      WHEN cloudinary_public_id IS NOT NULL AND cloudinary_public_id != '' 
      THEN ARRAY[cloudinary_public_id] 
      ELSE '{}'::text[] 
    END
WHERE image_url IS NOT NULL AND (image_urls IS NULL OR cardinality(image_urls) = 0);
