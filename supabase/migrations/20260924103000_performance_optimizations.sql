-- Performance Optimization Indexes

-- Composite indexes for common catalog queries with ordering by created_at DESC
CREATE INDEX IF NOT EXISTS idx_parts_category_created ON parts (category_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_parts_model_created ON parts (model_id, created_at DESC);

-- Btree indexes on lowercase names for fast filtering & case-insensitive matching
CREATE INDEX IF NOT EXISTS idx_car_companies_name_lower ON car_companies (lower(name));
CREATE INDEX IF NOT EXISTS idx_car_models_name_lower ON car_models (lower(name));
CREATE INDEX IF NOT EXISTS idx_categories_name_lower ON categories (lower(name));
