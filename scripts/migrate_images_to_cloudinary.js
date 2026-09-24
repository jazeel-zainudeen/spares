#!/usr/bin/env node

/**
 * migrate_images_to_cloudinary.js
 * 
 * Migrates all existing non-Cloudinary image URLs in Supabase tables
 * (parts, categories, car_companies) to Cloudinary, updating the database
 * records with Cloudinary secure URLs and public IDs.
 */

require('dotenv').config({ path: '.env.local' });
require('dotenv').config({ path: '.env' });

const { createClient } = require('@supabase/supabase-js');
const cloudinary = require('cloudinary').v2;

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SECRET_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Supabase configuration missing in environment variables.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const cloudName = process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

if (!cloudName || !apiKey || !apiSecret) {
  console.error('❌ Cloudinary configuration missing (CLOUDINARY_CLOUD_NAME / CLOUDINARY_API_KEY / CLOUDINARY_API_SECRET).');
  process.exit(1);
}

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
});

async function uploadToCloudinary(url, folder) {
  try {
    const res = await cloudinary.uploader.upload(url, { folder });
    return {
      secure_url: res.secure_url,
      public_id: res.public_id,
    };
  } catch (err) {
    throw new Error(`Cloudinary upload failed: ${err.message}`);
  }
}

async function migrateParts() {
  console.log('\n📦 Checking parts for external image URLs...');
  
  const { data: parts, error } = await supabase
    .from('parts')
    .select('id, item, ref_number, image_url, cloudinary_public_id')
    .not('image_url', 'is', null);

  if (error) {
    console.error('❌ Error fetching parts:', error.message);
    return;
  }

  const toMigrate = (parts || []).filter(p => p.image_url && !p.image_url.includes('res.cloudinary.com'));

  console.log(`Found ${toMigrate.length} parts with external image URLs to migrate.`);

  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < toMigrate.length; i++) {
    const part = toMigrate[i];
    const progress = `[${i + 1}/${toMigrate.length}]`;

    try {
      console.log(`${progress} 📸 Uploading image for part: "${part.item}" (${part.ref_number})...`);
      const { secure_url, public_id } = await uploadToCloudinary(part.image_url, 'spares/parts');

      const { error: updateError } = await supabase
        .from('parts')
        .update({
          image_url: secure_url,
          cloudinary_public_id: public_id,
        })
        .eq('id', part.id);

      if (updateError) {
        console.error(`${progress} ❌ Failed to update DB for "${part.item}": ${updateError.message}`);
        failCount++;
      } else {
        console.log(`${progress} ✅ Migrated to: ${secure_url}`);
        successCount++;
      }
    } catch (err) {
      console.error(`${progress} ❌ Error uploading "${part.item}": ${err.message}`);
      failCount++;
    }
  }

  console.log(`\n✨ Parts migration complete: ${successCount} succeeded, ${failCount} failed.`);
}

async function migrateCategories() {
  console.log('\n📂 Checking categories for external image URLs...');
  
  const { data: categories, error } = await supabase
    .from('categories')
    .select('id, name, image_url')
    .not('image_url', 'is', null);

  if (error) {
    console.error('❌ Error fetching categories:', error.message);
    return;
  }

  const toMigrate = (categories || []).filter(c => c.image_url && !c.image_url.includes('res.cloudinary.com'));

  if (toMigrate.length === 0) {
    console.log('No categories with external image URLs found.');
    return;
  }

  console.log(`Found ${toMigrate.length} categories with external image URLs to migrate.`);

  for (let i = 0; i < toMigrate.length; i++) {
    const cat = toMigrate[i];
    try {
      console.log(`📸 Uploading image for category: "${cat.name}"...`);
      const { secure_url } = await uploadToCloudinary(cat.image_url, 'spares/categories');

      await supabase
        .from('categories')
        .update({ image_url: secure_url })
        .eq('id', cat.id);

      console.log(`✅ Category "${cat.name}" migrated to: ${secure_url}`);
    } catch (err) {
      console.error(`❌ Error migrating category "${cat.name}": ${err.message}`);
    }
  }
}

async function migrateCompanies() {
  console.log('\n🚗 Checking car companies for external logo URLs...');
  
  const { data: companies, error } = await supabase
    .from('car_companies')
    .select('id, name, logo_url')
    .not('logo_url', 'is', null);

  if (error) {
    console.error('❌ Error fetching car companies:', error.message);
    return;
  }

  const toMigrate = (companies || []).filter(c => c.logo_url && !c.logo_url.includes('res.cloudinary.com'));

  if (toMigrate.length === 0) {
    console.log('No car companies with external logo URLs found.');
    return;
  }

  console.log(`Found ${toMigrate.length} car companies with external logo URLs to migrate.`);

  for (let i = 0; i < toMigrate.length; i++) {
    const comp = toMigrate[i];
    try {
      console.log(`📸 Uploading logo for company: "${comp.name}"...`);
      const { secure_url } = await uploadToCloudinary(comp.logo_url, 'spares/companies');

      await supabase
        .from('car_companies')
        .update({ logo_url: secure_url })
        .eq('id', comp.id);

      console.log(`✅ Company "${comp.name}" logo migrated to: ${secure_url}`);
    } catch (err) {
      console.error(`❌ Error migrating company "${comp.name}": ${err.message}`);
    }
  }
}

(async () => {
  console.log('🚀 Starting Cloudinary Image Migration');
  console.log('====================================');
  
  await migrateParts();
  await migrateCategories();
  await migrateCompanies();

  console.log('\n🎉 Image migration script finished successfully!\n');
})();
