-- Create tables for the spare parts catalog

-- CAR COMPANIES
CREATE TABLE car_companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  logo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Indexes for car_companies
CREATE INDEX idx_car_companies_slug ON car_companies(slug);


-- CAR MODELS
CREATE TABLE car_models (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES car_companies(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(company_id, slug) -- Prevent duplicate slugs per company
);

-- Indexes for car_models
CREATE INDEX idx_car_models_company_id ON car_models(company_id);
CREATE INDEX idx_car_models_slug ON car_models(slug);


-- PARTS
CREATE TABLE parts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  model_id UUID NOT NULL REFERENCES car_models(id) ON DELETE CASCADE,
  ref_number VARCHAR(100) NOT NULL,
  oem_number VARCHAR(100),
  item VARCHAR(255) NOT NULL,
  description TEXT,
  image_url TEXT,
  cloudinary_public_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Indexes for parts
CREATE INDEX idx_parts_model_id ON parts(model_id);
CREATE INDEX idx_parts_ref_number ON parts(ref_number);
CREATE INDEX idx_parts_oem_number ON parts(oem_number);

-- Full-text search index (optional, but highly recommended for catalog search)
ALTER TABLE parts ADD COLUMN text_search_vector tsvector GENERATED ALWAYS AS (
    setweight(to_tsvector('english', coalesce(item, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(description, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(ref_number, '')), 'C') ||
    setweight(to_tsvector('english', coalesce(oem_number, '')), 'D')
) STORED;

CREATE INDEX idx_parts_text_search ON parts USING GIN (text_search_vector);


-- updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_car_companies_modtime
    BEFORE UPDATE ON car_companies
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_car_models_modtime
    BEFORE UPDATE ON car_models
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_parts_modtime
    BEFORE UPDATE ON parts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
