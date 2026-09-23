const fs = require('fs');
const cheerio = require('cheerio');

const html = fs.readFileSync('/root/.gemini/antigravity-ide/brain/98d89ca7-91e1-4359-a18c-7eb9c5640060/scratch/cat_1.html', 'utf8');
const $ = cheerio.load(html);

const items = [];
// find product cards, they might be inside a grid or list
$('.product-item, .item, .card').each((i, el) => {
  items.push($(el).html());
});

console.log("Found items by class:", items.length);

if (items.length === 0) {
  // let's just find links that might look like products
  const links = [];
  $('a').each((i, el) => {
    const href = $(el).attr('href');
    if (href && href.includes('/car/product/')) {
      links.push(href);
    }
  });
  console.log("Found product links:", links.length);
  if (links.length > 0) {
    console.log(links.slice(0, 5));
  }
}
