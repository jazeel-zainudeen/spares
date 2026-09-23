require('dotenv').config({ path: '.env.local' });
const cheerio = require('cheerio');
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const { execSync } = require('child_process');

const BASE_URL = 'https://bestcoolautoac.com';
const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36';

async function fetchHtml(url) {
  try {
    return execSync(`curl -s -L -A "${USER_AGENT}" ${url}`, { maxBuffer: 1024 * 1024 * 10, stdio: 'pipe' }).toString();
  } catch (error) {
    return null;
  }
}

const cache = {
  categories: new Map(),
  companies: new Map(),
};

async function getOrCreate(table, map, name, slug) {
  if (!name) return null;
  if (map.has(name)) return map.get(name);
  let { data } = await supabase.from(table).select('id').eq('name', name).maybeSingle();
  if (!data) {
    const insertData = { name };
    if (slug) insertData.slug = slug;
    const { data: newData, error } = await supabase.from(table).insert(insertData).select().single();
    if (error) return null;
    data = newData;
  }
  map.set(name, data.id);
  return data.id;
}

function extractProductDetails($) {
  const data = {};
  data.title = $('.section-title, h1, h2, h3, h4').first().text().replace(/\s+/g, ' ').trim();
  data.image_url = $('.img-fluid, .product-image img, img').map((i, el) => $(el).attr('src')).get().find(src => src && src.includes('product'));
  if (data.image_url && !data.image_url.startsWith('http')) {
    data.image_url = BASE_URL + (data.image_url.startsWith('/') ? '' : '/') + data.image_url;
  }
  $('.row, tr, li, p').each((i, el) => {
    const text = $(el).text().replace(/\s+/g, ' ').trim();
    if (text.includes('Manufacturer Brand')) data.brand = text.split('Manufacturer Brand')[1].trim().split(' ')[0];
    if (text.includes('Vehicle Brand')) data.vehicleBrand = text.split('Vehicle Brand')[1].trim().split(' ')[0];
    if (text.includes('Part No')) data.partNo = text.split('Part No')[1].trim().split(' ')[0];
    if (text.includes('Vehicle') && !text.includes('Brand')) data.vehicleModel = text.split('Vehicle')[1].trim().split(' ')[0];
  });
  return data;
}

async function scrape() {
  console.log("Starting scrape...");
  const homeHtml = await fetchHtml(BASE_URL);
  if (!homeHtml) return;
  const $home = cheerio.load(homeHtml);
  let categoryLinks = [];
  $home('a').each((i, el) => {
    const href = $home(el).attr('href');
    if (href && href.includes('/car/category/car_type/') && href.split('/').length <= 7) {
      categoryLinks.push(href);
    }
  });
  
  // We'll scrape everything
  categoryLinks = [...new Set(categoryLinks)]; 
  
  for (const catLink of categoryLinks) {
    console.log(`Crawling category: ${catLink}`);
    const catHtml = await fetchHtml(catLink);
    if (!catHtml) continue;
    const $cat = cheerio.load(catHtml);
    let productLinks = [];
    
    // Check for direct products or subcategories
    $cat('a').each((i, el) => {
      const href = $cat(el).attr('href');
      if (href && href.includes('/product/details/')) productLinks.push(href);
      else if (href && href.includes('/car/category/car_type/') && href !== catLink) productLinks.push(href);
    });
    
    productLinks = [...new Set(productLinks)];
    
    for (const prodLink of productLinks) {
      if (!prodLink.includes('/product/details/')) {
        const subHtml = await fetchHtml(prodLink);
        if (subHtml) {
          const $sub = cheerio.load(subHtml);
          $sub('a').each((i, el) => {
            const href = $sub(el).attr('href');
            if (href && href.includes('/product/details/')) productLinks.push(href);
          });
        }
        continue;
      }
      
      const prodHtml = await fetchHtml(prodLink);
      if (!prodHtml) continue;
      const details = extractProductDetails(cheerio.load(prodHtml));
      if (!details.title && !details.partNo) continue;
      
      let company_id = null;
      if (details.brand) company_id = await getOrCreate('companies', cache.companies, details.brand, details.brand.toLowerCase());
      
      let category_id = await getOrCreate('categories', cache.categories, 'AC Parts', 'ac-parts');
      const partName = details.title || (details.partNo ? `Part ${details.partNo}` : 'Unknown Part');
      
      const { data: existingPart } = await supabase.from('parts').select('id').eq('part_number', details.partNo || partName).maybeSingle();
      if (!existingPart) {
        await supabase.from('parts').insert({
          name: partName,
          part_number: details.partNo || partName,
          description: `Vehicle: ${details.vehicleBrand || ''} ${details.vehicleModel || ''}`,
          company_id, category_id, image_url: details.image_url
        });
        console.log(`✅ Inserted ${partName}`);
      } else {
        console.log(`⚠️ Exists ${partName}`);
      }
    }
  }
  console.log("Scraping finished!");
}
scrape().catch(console.error);
