require('dotenv').config({ path: '.env.local' });
const cheerio = require('cheerio');
const { createClient } = require('@supabase/supabase-js');
const { execSync } = require('child_process');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const BASE_URL = 'https://bestcoolautoac.com';
const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36';

// Configurable scraping targets
const MAX_PARTS_PER_CATEGORY = 25; // Ensures rapid variety across all product categories!

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

async function getOrCreateCategory(name) {
  if (!name) name = "General";
  const slug = slugify(name);
  if (cache.categories.has(slug)) return cache.categories.get(slug);

  let { data } = await supabase.from('categories').select('id').eq('slug', slug).maybeSingle();
  if (!data) {
    const { data: newData, error } = await supabase.from('categories').insert({ name, slug }).select().single();
    if (error) {
      console.error(`Error inserting category ${name}:`, error.message);
      return null;
    }
    data = newData;
  }
  cache.categories.set(slug, data.id);
  return data.id;
}

async function getOrCreateCompany(name) {
  if (!name) name = "Universal";
  const slug = slugify(name);
  if (cache.companies.has(slug)) return cache.companies.get(slug);

  let { data } = await supabase.from('car_companies').select('id').eq('slug', slug).maybeSingle();
  if (!data) {
    const { data: newData, error } = await supabase.from('car_companies').insert({ name, slug }).select().single();
    if (error) {
      console.error(`Error inserting company ${name}:`, error.message);
      return null;
    }
    data = newData;
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
  data.title = $('.section-title, h1, h2, h3, h4').first().text().replace(/\s+/g, ' ').trim();
  data.image_url = $('.img-fluid, .product-image img, img').map((i, el) => $(el).attr('src')).get().find(src => src && src.includes('product'));
  if (data.image_url && !data.image_url.startsWith('http')) {
    data.image_url = BASE_URL + (data.image_url.startsWith('/') ? '' : '/') + data.image_url;
  }

  $('tr, li, p, .row').each((i, el) => {
    const text = $(el).text().replace(/\s+/g, ' ').trim();
    if (text.includes('Manufacturer Brand')) {
      const match = text.match(/Manufacturer Brand\s+([A-Za-z0-9_-]+)/i);
      if (match) data.manufacturerBrand = match[1].trim();
    }
    if (text.includes('Vehicle Brand')) {
      const match = text.match(/Vehicle Brand\s+([A-Za-z0-9_-]+)/i);
      if (match) data.vehicleBrand = match[1].trim();
    }
    if (text.includes('Part No')) {
      const match = text.match(/Part No\s+([A-Za-z0-9_.-]+)/i);
      if (match) data.partNo = match[1].trim();
    }
    if (text.includes('OEM')) {
      const match = text.match(/OEM\s*(?:No|Number)?\s*[:\s]?\s*([A-Za-z0-9_.-]+)/i);
      if (match) data.oemNo = match[1].trim();
    }
    if (text.includes('Vehicle') && !text.includes('Brand')) {
      const match = text.match(/Vehicle\s+([A-Za-z0-9_\s-]+?)(?:\s+(?:Application|Description|Location|Part|$))/i);
      if (match) data.vehicleModel = match[1].trim();
    }
  });

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
  const categoriesList = [];

  $home('a').each((i, el) => {
    const text = $home(el).text().replace(/\s+/g, ' ').trim();
    const href = $home(el).attr('href');
    if (href && href.includes('/car/category/car_type/') && href.split('/').length <= 7 && text) {
      categoriesList.push({ name: text, url: href });
    }
  });

  // Filter unique categories
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

  // Loop through each category and collect items round-robin to ensure variety
  for (const category of uniqueCategories) {
    console.log(`\n==============================================`);
    console.log(`📂 Processing Category: "${category.name}"`);
    console.log(`==============================================`);

    const categoryId = await getOrCreateCategory(category.name);
    if (!categoryId) continue;

    const catHtml = await fetchHtml(category.url);
    if (!catHtml) continue;

    const $cat = cheerio.load(catHtml);
    let candidateLinks = [];

    $cat('a').each((i, el) => {
      const href = $cat(el).attr('href');
      if (href) {
        if (href.includes('/product/details/')) {
          candidateLinks.push(href);
        } else if (href.includes('/car/category/car_type/') && href !== category.url) {
          candidateLinks.push(href);
        }
      }
    });

    candidateLinks = [...new Set(candidateLinks)];

    // Separate direct product links and subcategory links
    const directProductLinks = candidateLinks.filter(l => l.includes('/product/details/'));
    const subcategoryLinks = candidateLinks.filter(l => !l.includes('/product/details/'));

    let allProductLinks = [...directProductLinks];

    // If subcategories exist, crawl up to 4 subcategories to pick diverse products
    for (const subLink of subcategoryLinks.slice(0, 4)) {
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

        // Determine company & vehicle model
        const companyName = details.vehicleBrand || details.manufacturerBrand || "Universal";
        const companyId = await getOrCreateCompany(companyName);
        if (!companyId) continue;

        const modelName = details.vehicleModel || "General";
        const modelId = await getOrCreateModel(companyId, modelName);
        if (!modelId) continue;

        // Check if part already exists in parts table
        const { data: existingPart } = await supabase
          .from('parts')
          .select('id')
          .eq('ref_number', refNumber)
          .maybeSingle();

        if (!existingPart) {
          const { error } = await supabase.from('parts').insert({
            item: itemName,
            ref_number: refNumber,
            oem_number: details.oemNo || refNumber,
            category_id: categoryId,
            model_id: modelId,
            description: `Compatible: ${companyName} ${modelName}. Category: ${category.name}`,
            image_url: details.image_url || null
          });

          if (error) {
            console.error(`❌ Failed to insert "${itemName}":`, error.message);
          } else {
            insertedInThisCategory++;
            console.log(`✅ [${category.name} #${insertedInThisCategory}] Inserted: ${itemName} (${companyName} - ${refNumber})`);
          }
        } else {
          // If it exists, update category_id if missing
          await supabase.from('parts').update({ category_id: categoryId }).eq('id', existingPart.id);
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
