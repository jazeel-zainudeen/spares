#!/usr/bin/env node

/**
 * cleanup.js — Clears all data from Supabase tables and Cloudinary uploaded assets.
 * 
 * Usage:
 *   node scripts/cleanup.js          # Clear DB only
 *   node scripts/cleanup.js --all    # Clear DB + Cloudinary
 *   node scripts/cleanup.js --cloud  # Clear Cloudinary only
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const cloudApiKey = process.env.CLOUDINARY_API_KEY;
const cloudApiSecret = process.env.CLOUDINARY_API_SECRET;

const args = process.argv.slice(2);
const clearCloud = args.includes('--all') || args.includes('--cloud');
const clearDb = !args.includes('--cloud') || args.includes('--all');

async function clearDatabase() {
  console.log('\n🗑️  Clearing Supabase database...');
  
  // Delete in FK order: parts -> car_models -> car_companies -> categories
  const tables = ['parts', 'car_models', 'car_companies', 'categories'];
  
  for (const table of tables) {
    const { count, error } = await supabase
      .from(table)
      .delete({ count: 'exact' })
      .neq('id', '00000000-0000-0000-0000-000000000000');
    
    if (error) {
      console.error(`  ❌ ${table}: ${error.message}`);
    } else {
      console.log(`  ✅ ${table} cleared (${count ?? '?'} rows deleted)`);
    }
  }
}

async function clearCloudinary() {
  if (!cloudName || !cloudApiKey || !cloudApiSecret) {
    console.error('  ❌ Cloudinary credentials not found in .env.local');
    return;
  }

  console.log('\n☁️  Clearing Cloudinary assets...');

  try {
    const cloudinary = require('cloudinary').v2;
    cloudinary.config({
      cloud_name: cloudName,
      api_key: cloudApiKey,
      api_secret: cloudApiSecret,
    });

    // Delete all resources in the "spares" folder (or all if no folder)
    const folders = ['spares', ''];
    let totalDeleted = 0;

    for (const folder of folders) {
      try {
        let hasMore = true;
        let nextCursor = undefined;

        while (hasMore) {
          const options = {
            type: 'upload',
            max_results: 500,
          };
          if (folder) options.prefix = folder;
          if (nextCursor) options.next_cursor = nextCursor;

          const result = await cloudinary.api.resources(options);
          const ids = (result.resources || []).map(r => r.public_id);

          if (ids.length > 0) {
            // Delete in batches of 100 (Cloudinary limit)
            for (let i = 0; i < ids.length; i += 100) {
              const batch = ids.slice(i, i + 100);
              await cloudinary.api.delete_resources(batch);
              totalDeleted += batch.length;
              console.log(`  🗑️  Deleted ${batch.length} assets${folder ? ` from "${folder}/"` : ''}`);
            }
          }

          nextCursor = result.next_cursor;
          hasMore = !!nextCursor;
        }
      } catch (err) {
        if (err.error && err.error.http_code === 404) {
          // Folder doesn't exist, skip
        } else if (folder === '' && totalDeleted > 0) {
          // Already deleted from root, fine
        } else {
          console.error(`  ⚠️  ${folder || 'root'}: ${err.message || err}`);
        }
      }
    }

    if (totalDeleted === 0) {
      console.log('  ℹ️  No Cloudinary assets found to delete');
    } else {
      console.log(`  ✅ Total Cloudinary assets deleted: ${totalDeleted}`);
    }
  } catch (err) {
    console.error('  ❌ Cloudinary error:', err.message);
  }
}

(async () => {
  console.log('🧹 AutoPartsPro Cleanup Script');
  console.log('================================');
  
  if (clearDb) await clearDatabase();
  if (clearCloud) await clearCloudinary();

  console.log('\n✨ Cleanup complete!\n');
})();
