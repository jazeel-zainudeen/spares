-- Create Categories Table
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Index for Categories
CREATE INDEX idx_categories_slug ON categories(slug);

-- Add updated_at trigger for categories
CREATE TRIGGER update_categories_modtime
    BEFORE UPDATE ON categories
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Update Parts Table to include category_id
ALTER TABLE parts ADD COLUMN category_id UUID REFERENCES categories(id) ON DELETE RESTRICT;

-- Add index for category_id in parts
CREATE INDEX idx_parts_category_id ON parts(category_id);

-- Enforce UNIQUE constraint on ref_number in parts
ALTER TABLE parts ADD CONSTRAINT unique_ref_number UNIQUE (ref_number);

-- Update full-text search vector to include categories (Optional but recommended)
-- Note: Requires joining categories in a material view or trigger if doing it dynamically,
-- but for simplicity we keep the existing vector or update it if needed.
