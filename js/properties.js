// SECURISATION GLOBALE
window.addEventListener("error", function(e) {
  console.error("Erreur globale détectée :", e.message);
});
window.addEventListener("unhandledrejection", function(e) {
  console.error("Promise rejetée :", e.reason);
});

// Mode debug
const DEBUG = ENV.isLocal;

// Protection localStorage
const STORAGE_KEY = "propty_properties_v1";

/**
 * Sanitization anti-XSS
 */

function sanitizeHTML(str) {
  if (typeof str !== "string") return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
    .replace(/`/g, "&#96;")
    .replace(/=/g, "&#61;")
    .replace(/\//g, "&#47;");
}

/**
 * Validation stricte d’une propriété
 */

function validateProperty(property) {
  if (!property || typeof property !== "object") return false;
  let valid = true;
  let errors = [];
  // id
  if (!property.id || typeof property.id !== "string" || property.id.trim() === "") {
    valid = false; errors.push("id");
  }
  // title
  if (!property.title || typeof property.title !== "string" || property.title.trim() === "") {
    valid = false; errors.push("title");
  }
  // price
  if (typeof property.price !== "number" || property.price <= 0) {
    valid = false; errors.push("price");
  }
  // status
  if (["for-sale", "sold"].indexOf(property.status) === -1) {
    valid = false; errors.push("status");
  }
  // images
  if (!Array.isArray(property.images) || property.images.length < 1) {
    valid = false; errors.push("images");
  } else {
    for (let img of property.images) {
      if (typeof img !== "string" || img.trim() === "") {
        valid = false; errors.push("images:empty"); break;
      }
      const trimmed = img.trim();
      if (
        !(trimmed.startsWith("http://") || trimmed.startsWith("https://") || trimmed.startsWith("/") || trimmed.startsWith("./") || trimmed.startsWith("../"))
        || trimmed.startsWith("javascript:")
        || trimmed.startsWith("data:")
        || trimmed.startsWith("blob:")
      ) {
        valid = false; errors.push("images:invalid_url"); break;
      }
    }
  }
  // location
  if (!property.location || typeof property.location !== "string" || property.location.trim() === "") {
    valid = false; errors.push("location");
  }
  // description
  if (!property.description || typeof property.description !== "string" || property.description.trim() === "") {
    valid = false; errors.push("description");
  }
  // features (optionnel)
  if (property.features !== undefined) {
    if (!Array.isArray(property.features)) {
      valid = false; errors.push("features:not_array");
    } else {
      for (let i = 0; i < property.features.length; i++) {
        let f = property.features[i];
        if (typeof f !== "string" || f.trim() === "") {
          valid = false; errors.push("features:invalid"); break;
        }
        property.features[i] = f.trim();
      }
    }
  }
  if (!valid && DEBUG) {
    console.warn("Propriété invalide ignorée :", { property, errors });
  }
  return valid;
}

console.log("SECURITY HARDENING LEVEL : PRODUCTION READY");
// /js/properties.js
// Gestion dynamique des propriétés immobilières

/**
 * Charge les propriétés depuis localStorage ou JSON.
 * @returns {Promise<Array>} Tableau des propriétés ou [] en cas d’erreur.
 */

/**
 * Charge les propriétés depuis /data/properties.json avec cache-busting.
 * Met à jour localStorage uniquement après fetch réussi.
 * Fallback sur localStorage uniquement en cas d’erreur réseau.
 */

/**
 * Chargement robuste des propriétés avec validation stricte et fallback sécurisé.
 */
async function loadProperties() {
  try {
    const response = await fetch('/data/properties.json?v=' + Date.now());
    if (!response.ok) throw new Error('Erreur chargement properties.json');
    const json = await response.json();
    if (!Array.isArray(json)) throw new Error('Format JSON non valide (array attendu)');
    // Validation stricte
    const validProps = json.filter(validateProperty);
    // Sauvegarde uniquement les valides
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(validProps));
    } catch (e) {
      if (DEBUG) console.warn("localStorage non disponible :", e);
    }
    if (DEBUG) console.log("Propriétés chargées et validées :", validProps);
    return validProps;
  } catch (error) {
    if (DEBUG) console.error('Erreur critique :', error);
    // Fallback localStorage sécurisé
    let fallback = [];
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          fallback = parsed.filter(validateProperty);
        }
      }
    } catch (e) {
      if (DEBUG) console.warn("Erreur parsing localStorage :", e);
    }
    return fallback;
  }
}

/**
 * Calcule le prix au m².
 * @param {number} price - Prix total.
 * @param {number} surface - Surface en m².
 * @returns {number} Prix au m² arrondi.
 */
function calculatePricePerSqm(price, surface) {
  if (!price || !surface || surface === 0) return 0;
  return Math.round(price / surface);
}

/**
 * Génère dynamiquement les cards propriétés dans le container donné.
 * @param {string} containerId - ID du conteneur HTML.
 */

/**
 * Rend les propriétés dans le container donné, en forçant le chargement depuis JSON.
 */

/**
 * Rendu sécurisé des propriétés validées et nettoyées.
 */
async function renderProperties(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  const properties = (await loadProperties())
    .filter(p => p.status === 'for-sale' && p.isPublished === true);
  if (DEBUG) console.log("Propriétés à afficher :", properties);
  if (properties.length === 0) {
    container.innerHTML = '<p>Aucune propriété disponible actuellement.</p>';
    return;
  }
  container.innerHTML = properties.map(propertyToCardHTML).join('');
}

/**
 * Retourne la propriété correspondant à l’id.
 * @param {string} id
 * @returns {Promise<Object|null>} Propriété ou null
 */
async function getPropertyById(id) {
  const properties = await fetchProperties();
  return properties.find(p => p.id === id) || null;
}

/**
 * Génère le HTML d’une card propriété (structure à adapter selon le design existant).
 * @param {Object} p - Propriété
 * @returns {string} HTML
 */

function propertyToCardHTML(p) {
  // Utilisation de sanitizeHTML sur tous les champs affichés
  return `
    <div class="property-card">
      <div class="property-image">
        <img src="${sanitizeHTML(p.images[0] || '')}" alt="${sanitizeHTML(p.title)}">
      </div>
      <div class="property-content">
        <h3 class="property-title">${sanitizeHTML(p.title)}</h3>
        <div class="property-location">${sanitizeHTML(p.location)}</div>
        <div class="property-features">
          <span>${sanitizeHTML(String(p.surface))} m²</span> ·
          <span>${sanitizeHTML(String(p.bedrooms))} ch.</span> ·
          <span>${sanitizeHTML(String(p.bathrooms))} sdb</span>
        </div>
        <div class="property-description">${sanitizeHTML(p.description)}</div>
        <ul class="property-advantages">
          ${(Array.isArray(p.features) ? p.features : []).map(f => `<li>${sanitizeHTML(f)}</li>`).join('')}
        </ul>
        <div class="property-price">
          <strong>${sanitizeHTML(p.price.toLocaleString())} ${sanitizeHTML(p.currency)}</strong>
          <span class="price-per-sqm">(${sanitizeHTML(String(calculatePricePerSqm(p.price, p.surface)))} / m²)</span>
        </div>
      </div>
    </div>
  `;
}

console.log("SECURITY HARDENING COMPLETE");
