#!/usr/bin/env node
/**
 * Extrait les données des pages HTML manuelles pour créer properties.json
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const files = fs.readdirSync(ROOT).filter(f =>
  /^(condo|maison|terrain|projet)-.*\.html$/.test(f)
);

function extractBetween(html, startTag, endTag) {
  const i = html.indexOf(startTag);
  if (i === -1) return '';
  const j = html.indexOf(endTag, i + startTag.length);
  if (j === -1) return '';
  return html.substring(i + startTag.length, j).trim();
}

function extractJsonLd(html) {
  const match = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
  if (!match) return null;
  try { return JSON.parse(match[1]); } catch { return null; }
}

function extractMeta(html, name) {
  // Try name attribute
  let m = html.match(new RegExp(`<meta\\s+name="${name}"\\s+content="([^"]*)"`, 'i'));
  if (m) return m[1];
  // Try content first
  m = html.match(new RegExp(`<meta\\s+content="([^"]*)"\\s+name="${name}"`, 'i'));
  if (m) return m[1];
  return '';
}

function extractOg(html, prop) {
  let m = html.match(new RegExp(`<meta\\s+property="${prop}"\\s+content="([^"]*)"`, 'i'));
  if (m) return m[1];
  m = html.match(new RegExp(`<meta\\s+content="([^"]*)"\\s+property="${prop}"`, 'i'));
  if (m) return m[1];
  return '';
}

function extractTitle(html) {
  const m = html.match(/<title>(.*?)<\/title>/);
  return m ? m[1] : '';
}

function extractPrice(html) {
  // Try data-thb attribute
  let m = html.match(/data-thb="(\d+)"/);
  if (m) return parseInt(m[1]);
  // Try structured data
  const ld = extractJsonLd(html);
  if (ld && ld.price) return parseInt(ld.price);
  if (ld && ld.offers && ld.offers.price) return parseInt(ld.offers.price);
  // Try from detail-price text
  m = html.match(/class="detail-price"[^>]*>([^<]+)/);
  if (m) {
    const num = m[1].replace(/[^\d]/g, '');
    if (num) return parseInt(num);
  }
  return 0;
}

function extractImages(html) {
  const images = [];
  // Main gallery image
  let m = html.match(/id="main-photo"\s+src="([^"]+)"/);
  if (m) images.push(m[1]);
  // Thumbnail images
  const thumbRegex = /class="gallery-thumb"[\s\S]*?<img\s+src="([^"]+)"/g;
  let match;
  while ((match = thumbRegex.exec(html)) !== null) {
    if (!images.includes(match[1])) images.push(match[1]);
  }
  return images;
}

function extractFeatures(html) {
  const features = [];
  const featureRegex = /class="feature-item"[\s\S]*?<strong>(.*?)<\/strong>[\s\S]*?<br\s*\/?>(.*?)<\/div>/g;
  let match;
  while ((match = featureRegex.exec(html)) !== null) {
    features.push({
      label: match[1].trim(),
      value: match[2].trim().replace(/&agrave;/g, 'à').replace(/&eacute;/g, 'é')
    });
  }
  return features;
}

function extractDescription(html) {
  // Get the description section content
  const descSection = html.match(/📋 Description<\/h2>([\s\S]*?)<\/div>\s*<div class="detail-section"/);
  if (!descSection) {
    const alt = html.match(/Description<\/h2>([\s\S]*?)<\/div>\s*<\/div>/);
    if (alt) return alt[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().substring(0, 500);
    return '';
  }
  return descSection[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().substring(0, 800);
}

function extractRef(html) {
  const m = html.match(/Réf:\s*(\S+)/);
  return m ? m[1].replace(/[|]/g, '').trim() : '';
}

function extractSurface(html) {
  const ld = extractJsonLd(html);
  if (ld && ld.floorSize && ld.floorSize.value) return parseInt(ld.floorSize.value);
  const m = html.match(/Surface.*?(\d+)\s*m²/i);
  return m ? parseInt(m[1]) : 0;
}

function extractRooms(html) {
  const ld = extractJsonLd(html);
  if (ld && ld.numberOfRooms) return parseInt(ld.numberOfRooms);
  return 0;
}

function guessType(filename) {
  if (filename.startsWith('condo-')) return 'condo';
  if (filename.startsWith('maison-')) return 'maison';
  if (filename.startsWith('terrain-')) return 'terrain';
  if (filename.startsWith('projet-')) return 'projet';
  return 'autre';
}

function extractH1(html) {
  const m = html.match(/class="detail-title">(.*?)<\/h1>/);
  return m ? m[1].trim() : '';
}

function extractLocation(html) {
  const ld = extractJsonLd(html);
  if (ld && ld.address) {
    return {
      city: ld.address.addressLocality || 'Pattaya',
      district: '',
      country: 'Thaïlande'
    };
  }
  return { city: 'Pattaya', district: '', country: 'Thaïlande' };
}

function extractSidebarInfo(html) {
  const info = {};
  const infoRegex = /<span>(.*?)<\/span>\s*<span[^>]*>(.*?)<\/span>/g;
  let match;
  while ((match = infoRegex.exec(html)) !== null) {
    const key = match[1].trim().toLowerCase();
    const val = match[2].trim();
    if (key === 'type') info.propertyType = val;
    if (key === 'localisation' || key === 'emplacement') info.district = val;
    if (key === 'statut') info.status = val;
  }
  return info;
}

const properties = [];

for (const file of files) {
  const html = fs.readFileSync(path.join(ROOT, file), 'utf8');
  const slug = file.replace('.html', '');
  const type = guessType(file);
  const ld = extractJsonLd(html);
  const title = extractH1(html) || (ld ? ld.name : '') || extractTitle(html).split(' - ')[0].split(' | ')[0];
  const loc = extractLocation(html);
  const sidebarInfo = extractSidebarInfo(html);
  
  const property = {
    id: slug,
    slug: slug,
    title: title,
    type: type,
    price: extractPrice(html),
    currency: 'THB',
    location: {
      city: loc.city,
      district: sidebarInfo.district || loc.district || '',
      country: loc.country
    },
    surface: extractSurface(html),
    rooms: extractRooms(html),
    bedrooms: 0,
    bathrooms: 0,
    description: extractDescription(html),
    features: extractFeatures(html),
    images: extractImages(html),
    status: 'for-sale',
    isPublished: true,
    ref: extractRef(html),
    seo: {
      title: extractTitle(html),
      description: extractMeta(html, 'description'),
      canonicalUrl: `https://www.beaulieu-pattaya.com/${file}`
    },
    structuredData: ld
  };
  
  // Extract bedrooms/bathrooms from features
  for (const f of property.features) {
    if (f.label.toLowerCase().includes('chambre')) {
      const m = f.value.match(/(\d+)/);
      if (m) property.bedrooms = parseInt(m[1]);
    }
    if (f.label.toLowerCase().includes('salle') || f.label.toLowerCase().includes('bain')) {
      const m = f.value.match(/(\d+)/);
      if (m) property.bathrooms = parseInt(m[1]);
    }
  }
  
  properties.push(property);
  console.log(`✅ ${file} → ${property.title} (${property.price} THB)`);
}

// Write output
const outputPath = path.join(ROOT, 'data', 'properties-extracted.json');
fs.writeFileSync(outputPath, JSON.stringify(properties, null, 2), 'utf8');
console.log(`\n📦 ${properties.length} propriétés extraites → ${outputPath}`);
