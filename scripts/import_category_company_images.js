require('dotenv').config({ path: '.env.local' });
require('dotenv').config({ path: '.env' });
const cheerio = require('cheerio');
const { createClient } = require('@supabase/supabase-js');
const { execSync } = require('child_process');
const cloudinary = require('cloudinary').v2;

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SECRET_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Supabase URL or Key missing in environment.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const cloudName = process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

if (cloudName && apiKey && apiSecret) {
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
  });
}

const BASE_URL = 'https://bestcoolautoac.com';
const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36';

function fetchHtml(url) {
  try {
    return execSync(`curl -s -L -A "${USER_AGENT}" "${url}"`, { maxBuffer: 1024 * 1024 * 10, stdio: 'pipe' }).toString();
  } catch (error) {
    return null;
  }
}

async function uploadToCloudinary(imageUrl, folder) {
  if (!imageUrl) return imageUrl;
  if (imageUrl.includes('res.cloudinary.com')) return imageUrl;
  if (!cloudName || !apiKey || !apiSecret) {
    return imageUrl;
  }
  try {
    const res = await cloudinary.uploader.upload(imageUrl, { folder });
    return res.secure_url;
  } catch (err) {
    console.error(`⚠️ Failed to upload image (${imageUrl}) to Cloudinary: ${err.message}`);
    return imageUrl;
  }
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

async function syncCategoryImages() {
  console.log('\n📂 Syncing Category Images...');
  const homeHtml = fetchHtml(BASE_URL);
  if (!homeHtml) {
    console.error('Failed to load home page for category scraping.');
    return;
  }

  const $home = cheerio.load(homeHtml);
  const categoriesList = [];

  $home('a').each((i, el) => {
    const text = $home(el).text().replace(/\s+/g, ' ').trim();
    const href = $home(el).attr('href');
    if (href && href.includes('/car/category/car_type/') && href.split('/').length <= 7 && text) {
      if (!categoriesList.find(c => c.url === href)) {
        categoriesList.push({ name: text, url: href });
      }
    }
  });

  const { data: dbCategories, error } = await supabase.from('categories').select('*');
  if (error) {
    console.error('Error fetching categories from DB:', error.message);
    return;
  }

  for (const cat of categoriesList) {
    const catHtml = fetchHtml(cat.url);
    if (!catHtml) continue;

    const $cat = cheerio.load(catHtml);
    let categoryImageUrl = null;

    $cat('img').each((i, el) => {
      const src = $cat(el).attr('src') || '';
      if (src.includes('/images/cat/')) {
        categoryImageUrl = src.startsWith('http') ? src : BASE_URL + (src.startsWith('/') ? '' : '/') + src;
      }
    });

    if (categoryImageUrl) {
      const slug = slugify(cat.name);
      const existingCat = dbCategories.find(c => c.slug === slug || c.name.toLowerCase() === cat.name.toLowerCase());

      const finalImageUrl = await uploadToCloudinary(categoryImageUrl, 'spares/categories');

      if (existingCat) {
        if (!existingCat.image_url || existingCat.image_url !== finalImageUrl) {
          await supabase.from('categories').update({ image_url: finalImageUrl }).eq('id', existingCat.id);
          console.log(`✅ Updated category image for DB category "${existingCat.name}": ${finalImageUrl}`);
        } else {
          console.log(`ℹ️ Category "${existingCat.name}" image already up to date.`);
        }
      } else {
        const { data: newCat, error: insertError } = await supabase
          .from('categories')
          .insert({ name: cat.name, slug, image_url: finalImageUrl })
          .select()
          .single();
        if (!insertError) {
          console.log(`✅ Created category "${cat.name}" with image: ${finalImageUrl}`);
        } else {
          console.error(`❌ Failed to insert category "${cat.name}": ${insertError.message}`);
        }
      }
    }
  }
}

async function syncCompanyLogos() {
  console.log('\n🚗 Syncing Car Company Logos...');
  const homeHtml = fetchHtml(BASE_URL);
  if (!homeHtml) {
    console.error('Failed to load home page for company logo scraping.');
    return;
  }

  const $home = cheerio.load(homeHtml);
  const companyLogosMap = new Map();

  function addCompanyLogo(name, src) {
    if (!name || !src) return;
    const cleanName = name.replace(/\s+/g, ' ').trim();
    if (!cleanName) return;
    const fullUrl = src.startsWith('http') ? src : BASE_URL + (src.startsWith('/') ? '' : '/') + src;
    const slug = slugify(cleanName);
    if (slug && !companyLogosMap.has(slug)) {
      companyLogosMap.set(slug, { name: cleanName, logoUrl: fullUrl });
    }
  }

  $home('img').each((i, el) => {
    const src = $home(el).attr('src') || '';
    const alt = $home(el).attr('alt') || '';
    if (src.includes('m_brands') || src.includes('vehicle_brand') || src.includes('brands/')) {
      addCompanyLogo(alt, src);
    }
  });

  $home('a').each((i, el) => {
    const href = $home(el).attr('href') || '';
    const img = $home(el).find('img').attr('src') || '';
    const alt = $home(el).find('img').attr('alt') || $home(el).text();
    if ((href.includes('vehicle_brand') || href.includes('brand')) && img) {
      addCompanyLogo(alt, img);
    }
  });

  const { data: dbCompanies, error } = await supabase.from('car_companies').select('*');
  if (error) {
    console.error('Error fetching car companies from DB:', error.message);
    return;
  }

  for (const dbCompany of dbCompanies) {
    const match = companyLogosMap.get(dbCompany.slug) || Array.from(companyLogosMap.values()).find(c => c.name.toLowerCase() === dbCompany.name.toLowerCase());
    if (match) {
      const finalLogoUrl = await uploadToCloudinary(match.logoUrl, 'spares/companies');
      if (!dbCompany.logo_url || dbCompany.logo_url !== finalLogoUrl) {
        await supabase.from('car_companies').update({ logo_url: finalLogoUrl }).eq('id', dbCompany.id);
        console.log(`✅ Updated company logo for DB company "${dbCompany.name}": ${finalLogoUrl}`);
      } else {
        console.log(`ℹ️ Company "${dbCompany.name}" logo already up to date.`);
      }
    } else {
      console.warn(`⚠️ No scraped logo found for DB company "${dbCompany.name}" (${dbCompany.slug})`);
    }
  }

  // Also insert any new companies from source that have logos
  for (const [slug, item] of companyLogosMap.entries()) {
    const exists = dbCompanies.some(c => c.slug === slug || c.name.toLowerCase() === item.name.toLowerCase());
    if (!exists) {
      const finalLogoUrl = await uploadToCloudinary(item.logoUrl, 'spares/companies');
      const { error: insertError } = await supabase.from('car_companies').insert({
        name: item.name,
        slug,
        logo_url: finalLogoUrl,
      });
      if (!insertError) {
        console.log(`✅ Created company "${item.name}" with logo: ${finalLogoUrl}`);
      }
    }
  }
}

async function main() {
  console.log('🚀 Starting Category & Company Image Fix/Import Script...');
  await syncCategoryImages();
  await syncCompanyLogos();
  console.log('\n🎉 Category & Company Image Fix/Import Completed Successfully!');
}

main().catch(console.error);
