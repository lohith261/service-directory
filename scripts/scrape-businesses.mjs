/**
 * Scrapes business listings from Yellow Pages as a fallback to Yelp API.
 * Usage: node scripts/scrape-businesses.mjs
 * No API key required.
 */

import { writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { chromium } from 'playwright';

const __dirname = dirname(fileURLToPath(import.meta.url));

const CITIES = [
  { name: 'Austin',      slug: 'austin-tx',      ypLocation: 'austin-tx' },
  { name: 'Los Angeles', slug: 'los-angeles-ca',  ypLocation: 'los-angeles-ca' },
  { name: 'Miami',       slug: 'miami-fl',        ypLocation: 'miami-fl' },
  { name: 'New York',    slug: 'new-york-ny',     ypLocation: 'new-york-ny' },
  { name: 'Chicago',     slug: 'chicago-il',      ypLocation: 'chicago-il' },
];

const STATE_MAP = {
  'austin-tx': 'TX', 'los-angeles-ca': 'CA',
  'miami-fl': 'FL', 'new-york-ny': 'NY', 'chicago-il': 'IL',
};

const TRADES = [
  { trade_type: 'plumber',     query: 'plumbers' },
  { trade_type: 'electrician', query: 'electricians' },
  { trade_type: 'hvac',        query: 'hvac' },
  { trade_type: 'general',     query: 'handyman' },
];

async function scrapeYellowPages(page, query, location) {
  const url = `https://www.yellowpages.com/search?search_terms=${query}&geo_location_terms=${location}`;
  console.log(`    Scraping: ${url}`);

  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(2000);

  return page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('.result .info'));
    return cards.slice(0, 5).map(card => {
      const name = card.querySelector('.business-name')?.textContent?.trim() ?? '';
      const phone = card.querySelector('.phones')?.textContent?.trim() ?? '';
      const street = card.querySelector('.street-address')?.textContent?.trim() ?? '';
      const locality = card.querySelector('.locality')?.textContent?.trim() ?? '';
      const ratingEl = card.querySelector('[class*="rating"]');
      const rating = ratingEl
        ? parseFloat(ratingEl.getAttribute('class')?.match(/(\d+)/)?.[1] ?? '0') / 10
        : 0;
      const reviewsEl = card.querySelector('.count');
      const reviews_count = reviewsEl
        ? parseInt(reviewsEl.textContent?.replace(/\D/g, '') ?? '0')
        : 0;
      const website = card.querySelector('a.track-visit-website')?.href ?? '';
      const zip = locality.match(/\d{5}/)?.[0] ?? '';

      return { name, phone, street, locality, rating, reviews_count, website, zip };
    });
  });
}

async function run() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent:
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  });
  const page = await context.newPage();

  for (const city of CITIES) {
    console.log(`\n📍 Scraping ${city.name}...`);
    const businesses = [];
    const seen = new Set();

    for (const { trade_type, query } of TRADES) {
      try {
        const results = await scrapeYellowPages(page, query, city.ypLocation);
        let count = 0;

        for (const r of results) {
          if (!r.name || seen.has(r.name)) continue;
          seen.add(r.name);

          businesses.push({
            id: `${city.slug}-${trade_type}-${businesses.length + 1}`,
            name: r.name,
            city: city.name,
            state: STATE_MAP[city.slug] ?? '',
            zip: r.zip,
            phone: r.phone,
            website: r.website || undefined,
            rating: Math.min(5, Math.max(0, r.rating || 4.0)),
            reviews_count: r.reviews_count || 0,
            trade_type,
            service_radius_miles: 15,
            image_url: undefined,
            hours: undefined,
            verified: false,
          });
          count++;
        }

        console.log(`  ✓ ${trade_type}: ${count} businesses`);
        await page.waitForTimeout(1500);
      } catch (err) {
        console.error(`  ✗ ${trade_type}: ${err.message}`);
      }
    }

    if (businesses.length > 0) {
      const outPath = resolve(__dirname, `../src/content/businesses/${city.slug}.json`);
      writeFileSync(outPath, JSON.stringify(businesses, null, 2));
      console.log(`  💾 Saved ${businesses.length} businesses → ${city.slug}.json`);
    } else {
      console.log(`  ⚠ No businesses found for ${city.name} — keeping existing data`);
    }
  }

  await browser.close();
  console.log('\n✅ Done! Review the JSON files, then commit and push.');
}

run().catch(err => {
  console.error('Fatal:', err);
  process.exit(1);
});
