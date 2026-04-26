/**
 * Fetches real business data from Yelp Fusion API and writes to JSON files.
 * Usage: node scripts/fetch-yelp.mjs
 * Requires: YELP_API_KEY in .env.local
 */

import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Load .env.local
const envPath = resolve(__dirname, '../.env.local');
const envVars = Object.fromEntries(
  readFileSync(envPath, 'utf-8')
    .split('\n')
    .filter(l => l.includes('='))
    .map(l => {
      const [key, ...rest] = l.split('=');
      return [key.trim(), rest.join('=').trim().replace(/^"|"$/g, '')];
    })
);

const API_KEY = envVars.YELP_API_KEY;
if (!API_KEY) {
  console.error('❌ YELP_API_KEY not found in .env.local');
  process.exit(1);
}

const CITIES = [
  { name: 'Austin',       slug: 'austin-tx',       location: 'Austin, TX' },
  { name: 'Los Angeles',  slug: 'los-angeles-ca',   location: 'Los Angeles, CA' },
  { name: 'Miami',        slug: 'miami-fl',         location: 'Miami, FL' },
  { name: 'New York',     slug: 'new-york-ny',      location: 'New York, NY' },
  { name: 'Chicago',      slug: 'chicago-il',       location: 'Chicago, IL' },
];

const TRADE_CATEGORIES = [
  { trade_type: 'plumber',      yelpCategory: 'plumbing' },
  { trade_type: 'electrician',  yelpCategory: 'electricians' },
  { trade_type: 'hvac',         yelpCategory: 'hvac' },
  { trade_type: 'general',      yelpCategory: 'handyman' },
];

const STATE_MAP = {
  'Austin, TX': 'TX', 'Los Angeles, CA': 'CA',
  'Miami, FL': 'FL', 'New York, NY': 'NY', 'Chicago, IL': 'IL',
};

async function fetchYelp(location, category, limit = 10) {
  const url = new URL('https://api.yelp.com/v3/businesses/search');
  url.searchParams.set('location', location);
  url.searchParams.set('categories', category);
  url.searchParams.set('limit', String(limit));
  url.searchParams.set('sort_by', 'rating');

  const res = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${API_KEY}` },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Yelp API error ${res.status}: ${text}`);
  }

  const json = await res.json();
  return json.businesses ?? [];
}

function mapBusiness(biz, tradeType, cityName, location) {
  const addr = biz.location ?? {};
  return {
    id: biz.id,
    name: biz.name,
    city: cityName,
    state: STATE_MAP[location] ?? '',
    zip: addr.zip_code ?? '',
    phone: biz.display_phone ?? biz.phone ?? '',
    website: biz.url ?? undefined,
    rating: biz.rating ?? 0,
    reviews_count: biz.review_count ?? 0,
    trade_type: tradeType,
    service_radius_miles: 15,
    image_url: biz.image_url ?? undefined,
    hours: undefined,
    verified: false,
  };
}

async function run() {
  for (const city of CITIES) {
    console.log(`\n📍 Fetching businesses for ${city.name}...`);
    const businesses = [];
    const seen = new Set();

    for (const { trade_type, yelpCategory } of TRADE_CATEGORIES) {
      try {
        const results = await fetchYelp(city.location, yelpCategory, 5);
        const mapped = results
          .filter(b => !seen.has(b.id))
          .map(b => {
            seen.add(b.id);
            return mapBusiness(b, trade_type, city.name, city.location);
          });

        businesses.push(...mapped);
        console.log(`  ✓ ${trade_type}: ${mapped.length} businesses`);

        // Respect Yelp rate limit
        await new Promise(r => setTimeout(r, 300));
      } catch (err) {
        console.error(`  ✗ ${trade_type}: ${err.message}`);
      }
    }

    const outPath = resolve(__dirname, `../src/content/businesses/${city.slug}.json`);
    writeFileSync(outPath, JSON.stringify(businesses, null, 2));
    console.log(`  💾 Saved ${businesses.length} businesses → ${city.slug}.json`);
  }

  console.log('\n✅ Done! Commit and push to update the live site.');
}

run().catch(err => {
  console.error('Fatal:', err);
  process.exit(1);
});
