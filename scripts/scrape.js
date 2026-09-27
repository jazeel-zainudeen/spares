require('dotenv').config({ path: '.env.local' });
require('dotenv').config({ path: '.env' });
const cheerio = require('cheerio');
const { createClient } = require('@supabase/supabase-js');
const { execSync } = require('child_process');
const cloudinary = require('cloudinary').v2;

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SECRET_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
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

async function uploadToCloudinary(imageUrl, folder = 'spares/parts') {
  if (!imageUrl) return { url: null, publicId: null };
  if (imageUrl.includes('res.cloudinary.com')) {
    return { url: imageUrl, publicId: null };
  }
  if (!cloudName || !apiKey || !apiSecret) {
    console.warn(`⚠️ Cloudinary credentials missing. Saving raw image URL: ${imageUrl}`);
    return { url: imageUrl, publicId: null };
  }
  try {
    const res = await cloudinary.uploader.upload(imageUrl, { folder });
    return {
      url: res.secure_url,
      publicId: res.public_id,
    };
  } catch (err) {
    console.error(`⚠️ Failed to upload image (${imageUrl}) to Cloudinary: ${err.message}`);
    return { url: imageUrl, publicId: null };
  }
}

const BASE_URL = 'https://bestcoolautoac.com';
const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36';

const MAX_PARTS_PER_CATEGORY = 25;

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

async function fetchHtml(url) {
  try {
    return execSync(`curl -s -L -A "${USER_AGENT}" "${url}"`, { maxBuffer: 1024 * 1024 * 10, stdio: 'pipe' }).toString();
  } catch (error) {
    return null;
  }
}

const cache = {
  categories: new Map(),
  companies: new Map(),
  models: new Map(),
};

const companyLogosMap = new Map();

function extractCompanyLogosFromHome($home) {
  function addCompanyLogo(name, src) {
    if (!name || !src) return;
    const cleanName = name.replace(/\s+/g, ' ').trim();
    if (!cleanName) return;
    const fullUrl = src.startsWith('http') ? src : BASE_URL + (src.startsWith('/') ? '' : '/') + src;
    const slug = slugify(cleanName);
    if (slug && !companyLogosMap.has(slug)) {
      companyLogosMap.set(slug, fullUrl);
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
}

async function getOrCreateCategory(name, rawCategoryImageUrl = null) {
  if (!name) name = "General";
  const slug = slugify(name);
  if (cache.categories.has(slug)) return cache.categories.get(slug);

  let categoryImageUrl = null;
  if (rawCategoryImageUrl) {
    const uploaded = await uploadToCloudinary(rawCategoryImageUrl, 'spares/categories');
    categoryImageUrl = uploaded.url;
  }

  let { data } = await supabase.from('categories').select('*').eq('slug', slug).maybeSingle();
  if (!data) {
    const { data: newData, error } = await supabase.from('categories').insert({
      name,
      slug,
      image_url: categoryImageUrl,
    }).select().single();
    if (error) {
      console.error(`Error inserting category ${name}:`, error.message);
      return null;
    }
    data = newData;
  } else if (categoryImageUrl && (!data.image_url || !data.image_url.includes('res.cloudinary.com'))) {
    await supabase.from('categories').update({ image_url: categoryImageUrl }).eq('id', data.id);
  }

  cache.categories.set(slug, data.id);
  return data.id;
}

async function getOrCreateCompany(name, rawLogoUrl = null) {
  if (!name) name = "Universal";
  const slug = slugify(name);
  if (cache.companies.has(slug)) return cache.companies.get(slug);

  let logoUrl = null;
  const logoCandidate = rawLogoUrl || companyLogosMap.get(slug);
  if (logoCandidate) {
    const uploaded = await uploadToCloudinary(logoCandidate, 'spares/companies');
    logoUrl = uploaded.url;
  }

  let { data } = await supabase.from('car_companies').select('*').eq('slug', slug).maybeSingle();
  if (!data) {
    const { data: newData, error } = await supabase.from('car_companies').insert({
      name,
      slug,
      logo_url: logoUrl,
    }).select().single();
    if (error) {
      console.error(`Error inserting company ${name}:`, error.message);
      return null;
    }
    data = newData;
  } else if (logoUrl && (!data.logo_url || !data.logo_url.includes('res.cloudinary.com'))) {
    await supabase.from('car_companies').update({ logo_url: logoUrl }).eq('id', data.id);
  }

  cache.companies.set(slug, data.id);
  return data.id;
}

async function getOrCreateModel(companyId, modelName) {
  if (!modelName) modelName = "General";
  const modelSlug = slugify(modelName) || "general";
  const cacheKey = `${companyId}:${modelSlug}`;
  if (cache.models.has(cacheKey)) return cache.models.get(cacheKey);

  let { data } = await supabase.from('car_models').select('id').eq('company_id', companyId).eq('slug', modelSlug).maybeSingle();
  if (!data) {
    const { data: newData, error } = await supabase.from('car_models').insert({
      company_id: companyId,
      name: modelName,
      slug: modelSlug
    }).select().single();
    if (error) {
      console.error(`Error inserting model ${modelName}:`, error.message);
      return null;
    }
    data = newData;
  }
  cache.models.set(cacheKey, data.id);
  return data.id;
}

function extractProductDetails($) {
  const data = {};

  data.title = $('h4.mb-0').first().text().replace(/\s+/g, ' ').trim()
    || $('h1, h2, h3, h4').first().text().replace(/\s+/g, ' ').trim();

  $('img').each((i, el) => {
    const src = $(el).attr('src') || '';
    if (src.includes('images/car_image') || src.includes('car_image/')) {
      if (!data.image_url) {
        data.image_url = src.startsWith('http') ? src : BASE_URL + (src.startsWith('/') ? '' : '/') + src;
      }
    }
  });

  const tds = $('td');
  for (let i = 0; i < tds.length - 1; i++) {
    const labelTd = $(tds[i]);
    const valueTd = $(tds[i + 1]);
    const labelText = labelTd.text().replace(/\s+/g, ' ').trim();
    const valueText = valueTd.text().replace(/\s+/g, ' ').trim();
    
    const style = labelTd.attr('style') || '';
    if (!style.includes('font-weight') && !style.includes('bold')) continue;

    if (labelText === 'Manufacturer Brand' && valueText) {
      data.manufacturerBrand = valueText;
      i++;
    } else if (labelText === 'Vehicle Brand' && valueText) {
      data.vehicleBrand = valueText;
      i++;
    } else if (labelText === 'Part No' && valueText) {
      const parts = valueText.split(/[,;]/).map(s => s.trim()).filter(Boolean);
      data.partNo = parts[0];
      if (parts.length > 1) {
        data.oemNo = parts[1];
      }
      i++;
    } else if (labelText === 'OEM' || labelText === 'OEM No' || labelText === 'OEM Number') {
      if (valueText) data.oemNo = valueText;
      i++;
    } else if (labelText === 'Vehicle' && valueText) {
      data.vehicleModel = valueText;
      i++;
    } else if (labelText === 'Year' && valueText) {
      data.year = valueText;
      i++;
    } else if (labelText === 'Application' && valueText) {
      data.application = valueText;
      i++;
    }
  }

  if (!data.vehicleModel && data.title && data.vehicleBrand) {
    const brand = data.vehicleBrand.toUpperCase();
    const titleUpper = data.title.toUpperCase();
    const brandIdx = titleUpper.indexOf(brand);
    if (brandIdx !== -1) {
      const afterBrand = data.title.substring(brandIdx + brand.length).trim();
      if (afterBrand) {
        const modelMatch = afterBrand.match(/^([A-Za-z0-9\s-]+?)(?:\s+\d+[Pp][Kk]|\s+\d{5,}|$)/);
        if (modelMatch) {
          data.vehicleModel = modelMatch[1].trim();
        } else {
          data.vehicleModel = afterBrand.split(/\s+/).slice(0, 3).join(' ');
        }
      }
    }
  }

  return data;
}

async function scrape() {
  console.log("🚀 Starting multi-category diverse parts scraping...");

  const homeHtml = await fetchHtml(BASE_URL);
  if (!homeHtml) {
    console.error("Failed to load home page");
    return;
  }

  const $home = cheerio.load(homeHtml);
  extractCompanyLogosFromHome($home);

  const categoriesList = [];

  $home('a').each((i, el) => {
    const text = $home(el).text().replace(/\s+/g, ' ').trim();
    const href = $home(el).attr('href');
    if (href && href.includes('/car/category/car_type/') && href.split('/').length <= 7 && text) {
      categoriesList.push({ name: text, url: href });
    }
  });

  const seenCat = new Set();
  const uniqueCategories = [];
  for (const cat of categoriesList) {
    if (!seenCat.has(cat.url)) {
      seenCat.add(cat.url);
      uniqueCategories.push(cat);
    }
  }

  console.log(`Found ${uniqueCategories.length} distinct categories on bestcoolautoac.com:`);
  uniqueCategories.forEach((c, idx) => console.log(`  ${idx + 1}. ${c.name} (${c.url})`));

  for (const category of uniqueCategories) {
    console.log(`\n==============================================`);
    console.log(`📂 Processing Category: "${category.name}"`);
    console.log(`==============================================`);

    const catHtml = await fetchHtml(category.url);
    if (!catHtml) continue;

    const $cat = cheerio.load(catHtml);
    let categoryImageUrl = null;
    $cat('img').each((i, el) => {
      const src = $cat(el).attr('src') || '';
      if (src.includes('/images/cat/')) {
        categoryImageUrl = src.startsWith('http') ? src : BASE_URL + (src.startsWith('/') ? '' : '/') + src;
      }
    });

    const categoryId = await getOrCreateCategory(category.name, categoryImageUrl);
    if (!categoryId) continue;

    let directProductLinks = [];
    let subcategoryLinks = [];

    $cat('a').each((i, el) => {
      const href = $cat(el).attr('href');
      if (href) {
        if (href.includes('/product/details/')) {
          directProductLinks.push(href);
        } else if (href.startsWith(category.url + '/')) {
          subcategoryLinks.push(href);
        }
      }
    });

    directProductLinks = [...new Set(directProductLinks)];
    subcategoryLinks = [...new Set(subcategoryLinks)];

    let allProductLinks = [...directProductLinks];

    for (const subLink of subcategoryLinks.slice(0, 6)) {
      if (allProductLinks.length >= MAX_PARTS_PER_CATEGORY * 2) break;
      const subHtml = await fetchHtml(subLink);
      if (!subHtml) continue;
      const $sub = cheerio.load(subHtml);
      $sub('a').each((i, el) => {
        const href = $sub(el).attr('href');
        if (href && href.includes('/product/details/')) {
          allProductLinks.push(href);
        }
      });
      allProductLinks = [...new Set(allProductLinks)];
    }

    allProductLinks = [...new Set(allProductLinks)];
    console.log(`Found ${allProductLinks.length} product candidate links in "${category.name}"`);

    let insertedInThisCategory = 0;

    for (const prodLink of allProductLinks) {
      if (insertedInThisCategory >= MAX_PARTS_PER_CATEGORY) {
        console.log(`🎯 Reached category quota (${MAX_PARTS_PER_CATEGORY} parts) for "${category.name}". Moving to next category for diversity!`);
        break;
      }

      try {
        const prodHtml = await fetchHtml(prodLink);
        if (!prodHtml) continue;

        const details = extractProductDetails(cheerio.load(prodHtml));
        const refNumber = details.partNo || details.title?.split(' ')[0] || null;
        const itemName = details.title || (refNumber ? `${refNumber} ${category.name}` : null);

        if (!itemName || !refNumber) continue;

        const companyName = details.vehicleBrand || details.manufacturerBrand || "Universal";
        const companyId = await getOrCreateCompany(companyName);
        if (!companyId) continue;

        const modelName = details.vehicleModel || "General";
        const modelId = await getOrCreateModel(companyId, modelName);
        if (!modelId) continue;

        const { data: existingPart } = await supabase
          .from('parts')
          .select('id, image_url, cloudinary_public_id, category_id')
          .eq('ref_number', refNumber)
          .maybeSingle();

        let imageUrl = null;
        let cloudinaryPublicId = null;

        if (details.image_url) {
          const uploaded = await uploadToCloudinary(details.image_url, 'spares/parts');
          imageUrl = uploaded.url;
          cloudinaryPublicId = uploaded.publicId;
        }

        if (!existingPart) {
          const { error } = await supabase.from('parts').insert({
            item: itemName,
            ref_number: refNumber,
            oem_number: details.oemNo || refNumber,
            category_id: categoryId,
            model_id: modelId,
            description: `Compatible: ${companyName} ${modelName}. Category: ${category.name}`,
            image_url: imageUrl,
            cloudinary_public_id: cloudinaryPublicId,
          });

          if (error) {
            console.error(`❌ Failed to insert "${itemName}":`, error.message);
          } else {
            insertedInThisCategory++;
            console.log(`✅ [${category.name} #${insertedInThisCategory}] Inserted: ${itemName} (${companyName} - ${refNumber})`);
          }
        } else {
          const updates = {};
          if (!existingPart.category_id) updates.category_id = categoryId;

          if (imageUrl && (!existingPart.image_url || !existingPart.image_url.includes('res.cloudinary.com'))) {
            updates.image_url = imageUrl;
            if (cloudinaryPublicId) updates.cloudinary_public_id = cloudinaryPublicId;
          }

          if (Object.keys(updates).length > 0) {
            await supabase.from('parts').update(updates).eq('id', existingPart.id);
          }
          console.log(`ℹ️ [${category.name}] Exists: ${refNumber}`);
        }
      } catch (err) {
        console.error(`Error processing ${prodLink}:`, err.message);
      }
    }
  }

  console.log("\n🎉 Diverse scraping across all categories successfully completed!");
}

scrape().catch(console.error);
