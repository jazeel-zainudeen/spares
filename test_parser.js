const fs = require('fs');
const cheerio = require('cheerio');

const html = fs.readFileSync('/root/.gemini/antigravity-ide/brain/98d89ca7-91e1-4359-a18c-7eb9c5640060/scratch/product.html', 'utf8');
const $ = cheerio.load(html);

// Best Cool Auto AC product details extraction
const title = $('.product-title, h1, h2, h3').first().text().trim();
const image = $('.product-image img, .carousel-inner img').first().attr('src');
const details = {};
$('.product-details table tr, .table tr, li').each((i, el) => {
  const text = $(el).text().trim();
  if (text) console.log("Detail:", text);
});
console.log("Title:", title);
console.log("Image:", image);

// let's just dump the text of the main content area
console.log("Main content:", $('.container').text().replace(/\s+/g, ' ').substring(0, 500));
