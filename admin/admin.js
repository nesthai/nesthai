// admin.js : Panel admin immobilier - Gère data/properties.json
// Les propriétés sont stockées en localStorage pour édition,
// puis exportées en JSON pour le système de build.

// ENUMS
const TYPE_ENUM = ["condo", "villa", "maison", "terrain", "projet", "local", "autre"];
const STATUS_ENUM = ["for-sale", "for-rent", "sold", "reserved", "off-market"];
const CURRENCY_ENUM = ["THB", "EUR", "USD"];

// Utilitaires
function calculatePricePerSqm(price, surface) {
  if (!price || !surface || surface === 0) return 0;
  return Math.round(price / surface);
}

function generateSlug(title, type) {
  const base = title
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 50)
    .replace(/-$/, '');
  return type + '-' + base;
}

function showStatus(msg) {
  const el = document.getElementById('status-msg');
  el.textContent = msg;
  el.style.display = 'block';
  setTimeout(function() { el.style.display = 'none'; }, 3000);
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// Récupère les propriétés (localStorage ou JSON serveur)
async function getProperties() {
  var props = localStorage.getItem("properties");
  if (props) return JSON.parse(props);
  try {
    var res = await fetch("../data/properties.json");
    var data = await res.json();
    localStorage.setItem("properties", JSON.stringify(data));
    return data;
  } catch (e) {
    console.error("Erreur chargement JSON", e);
    return [];
  }
}

function saveProperties(props) {
  localStorage.setItem("properties", JSON.stringify(props));
  showStatus('Modifications sauvegardées localement. Exportez le JSON pour mettre à jour le site.');
}

// Exporter le JSON (téléchargement)
window.exportJSON = async function() {
  var props = await getProperties();
  var blob = new Blob([JSON.stringify(props, null, 2)], { type: 'application/json' });
  var url = URL.createObjectURL(blob);
  var a = document.createElement('a');
  a.href = url;
  a.download = 'properties.json';
  a.click();
  URL.revokeObjectURL(url);
  showStatus('properties.json téléchargé. Placez-le dans data/ et lancez le build.');
};

// Importer un JSON
window.importJSON = async function(event) {
  var file = event.target.files[0];
  if (!file) return;
  var text = await file.text();
  try {
    var data = JSON.parse(text);
    if (!Array.isArray(data)) throw new Error('Le JSON doit être un tableau');
    localStorage.setItem("properties", JSON.stringify(data));
    showStatus(data.length + ' propriétés importées.');
    renderPropertiesList();
  } catch (e) {
    alert('Erreur: fichier JSON invalide. ' + e.message);
  }
  event.target.value = '';
};

// Recharger depuis le serveur
window.resetToServer = async function() {
  if (!confirm('Recharger les données depuis le serveur ? Les modifications locales seront perdues.')) return;
  localStorage.removeItem("properties");
  showStatus('Données rechargées depuis le serveur.');
  renderPropertiesList();
};

// Affiche la liste des propriétés
async function renderPropertiesList() {
  var listDiv = document.getElementById("properties-list");
  var props = await getProperties();
  if (!props.length) {
    listDiv.innerHTML = "<p>Aucune propriété enregistrée.</p>";
    return;
  }
  var html = "<table class='property-table'><thead><tr>" +
    "<th>Titre</th><th>Type</th><th>Prix</th><th>District</th><th>Status</th><th>Publié</th><th>Actions</th>" +
    "</tr></thead><tbody>";
  for (var i = 0; i < props.length; i++) {
    var p = props[i];
    var published = p.isPublished !== false ? '✅' : '❌';
    var district = (p.location && p.location.district) || (p.location && p.location.city) || '';
    html += '<tr>' +
      '<td>' + escapeHtml(p.title) + '</td>' +
      '<td>' + p.type + '</td>' +
      '<td>' + (p.price ? p.price.toLocaleString() : '0') + ' ' + (p.currency || 'THB') + '</td>' +
      '<td>' + escapeHtml(district) + '</td>' +
      '<td>' + p.status + '</td>' +
      '<td>' + published + '</td>' +
      '<td>' +
        '<button class="btn btn-sm" onclick="editProperty(\'' + p.id + '\')">✏️</button> ' +
        '<button class="btn btn-sm" onclick="duplicateProperty(\'' + p.id + '\')">📋</button> ' +
        '<button class="btn btn-sm btn-danger" onclick="deleteProperty(\'' + p.id + '\')">🗑️</button>' +
      '</td></tr>';
  }
  html += "</tbody></table>";
  html += '<p style="color:#999;margin-top:10px;">' + props.length + ' propriété(s)</p>';
  listDiv.innerHTML = html;
}

// Formulaire
function showForm(property) {
  var section = document.getElementById("form-section");
  section.style.display = "block";
  section.innerHTML = generateFormHTML(property || null);
  section.scrollIntoView({ behavior: 'smooth' });
}

function generateFormHTML(p) {
  // Formater les features
  var featuresText = '';
  if (p && p.features && Array.isArray(p.features)) {
    featuresText = p.features.map(function(f) {
      if (typeof f === 'string') return f;
      return f.label + ': ' + f.value;
    }).join('\n');
  }

  var imagesText = (p && p.images) ? p.images.join('\n') : '';

  return '<form id="property-form">' +
    '<h2>' + (p ? '✏️ Modifier' : '➕ Ajouter') + ' une propriété</h2>' +

    '<fieldset><legend>Informations principales</legend>' +
    '<label>Titre<input type="text" name="title" value="' + escapeHtml(p ? p.title : '') + '" required></label>' +
    '<label>Slug (URL)<input type="text" name="slug" value="' + escapeHtml(p ? p.slug : '') + '" placeholder="auto-généré si vide"><small>Laissez vide pour auto-générer</small></label>' +
    '<label>Type<select name="type" required>' + TYPE_ENUM.map(function(t) { return '<option value="' + t + '"' + (p && p.type === t ? ' selected' : '') + '>' + t + '</option>'; }).join('') + '</select></label>' +
    '<label>Référence<input type="text" name="ref" value="' + escapeHtml(p ? p.ref : '') + '"></label>' +
    '</fieldset>' +

    '<fieldset><legend>Prix</legend>' +
    '<label>Prix<input type="number" name="price" value="' + (p ? p.price : '') + '" required></label>' +
    '<label>Devise<select name="currency" required>' + CURRENCY_ENUM.map(function(c) { return '<option value="' + c + '"' + (p && p.currency === c ? ' selected' : '') + '>' + c + '</option>'; }).join('') + '</select></label>' +
    '</fieldset>' +

    '<fieldset><legend>Localisation</legend>' +
    '<label>Ville<input type="text" name="city" value="' + escapeHtml(p && p.location ? p.location.city : '') + '" required></label>' +
    '<label>District<input type="text" name="district" value="' + escapeHtml(p && p.location ? p.location.district : '') + '"></label>' +
    '<label>Pays<input type="text" name="country" value="' + escapeHtml(p && p.location ? p.location.country : 'Thaïlande') + '"></label>' +
    '</fieldset>' +

    '<fieldset><legend>Caractéristiques</legend>' +
    '<label>Surface (m²)<input type="number" name="surface" value="' + (p ? p.surface : '') + '"></label>' +
    '<label>Pièces<input type="number" name="rooms" value="' + (p ? p.rooms : '') + '"></label>' +
    '<label>Chambres<input type="number" name="bedrooms" value="' + (p ? p.bedrooms : '') + '"></label>' +
    '<label>Salles de bain<input type="number" name="bathrooms" value="' + (p ? p.bathrooms : '') + '"></label>' +
    '</fieldset>' +

    '<fieldset><legend>Description & Atouts</legend>' +
    '<label>Description<textarea name="description" rows="6">' + escapeHtml(p ? p.description : '') + '</textarea></label>' +
    '<label>Atouts (un par ligne, format "Label: Valeur")<textarea name="features" rows="6" placeholder="Chambres: 2&#10;Surface: 68 m²&#10;Piscine: Commune">' + escapeHtml(featuresText) + '</textarea></label>' +
    '</fieldset>' +

    '<fieldset><legend>Images</legend>' +
    '<label>URLs des images (une par ligne)<textarea name="images" rows="4">' + escapeHtml(imagesText) + '</textarea></label>' +
    '</fieldset>' +

    '<fieldset><legend>Statut & Publication</legend>' +
    '<label>Status<select name="status" required>' + STATUS_ENUM.map(function(s) { return '<option value="' + s + '"' + (p && p.status === s ? ' selected' : '') + '>' + s + '</option>'; }).join('') + '</select></label>' +
    '<label><input type="checkbox" name="isPublished"' + (!p || p.isPublished !== false ? ' checked' : '') + '> Publié sur le site</label>' +
    '</fieldset>' +

    '<fieldset><legend>SEO (optionnel)</legend>' +
    '<label>Titre SEO<input type="text" name="seoTitle" value="' + escapeHtml(p && p.seo ? p.seo.title : '') + '"></label>' +
    '<label>Description SEO<textarea name="seoDescription" rows="2">' + escapeHtml(p && p.seo ? p.seo.description : '') + '</textarea></label>' +
    '</fieldset>' +

    '<div class="form-actions">' +
    '<button class="btn" type="submit">' + (p ? 'Enregistrer' : 'Ajouter') + '</button>' +
    '<button class="btn" type="button" onclick="hideForm()">Annuler</button>' +
    '</div></form>';
}

// Conversion formulaire → objet propriété
function formToProperty(form) {
  var title = form.title.value.trim();
  var type = form.type.value;
  var slug = form.slug.value.trim();
  if (!slug) slug = generateSlug(title, type);

  // Parser les features
  var featuresRaw = form.features.value.trim();
  var features = [];
  if (featuresRaw) {
    features = featuresRaw.split('\n').map(function(line) {
      var parts = line.split(':');
      if (parts.length >= 2) {
        return { label: parts[0].trim(), value: parts.slice(1).join(':').trim() };
      }
      return { label: line.trim(), value: '' };
    }).filter(function(f) { return f.label; });
  }

  // Parser les images
  var images = form.images.value.trim()
    .split('\n').map(function(i) { return i.trim(); }).filter(function(i) { return i; });

  return {
    id: slug,
    slug: slug,
    title: title,
    type: type,
    price: Number(form.price.value) || 0,
    currency: form.currency.value,
    location: {
      city: form.city.value.trim(),
      district: form.district.value.trim(),
      country: form.country.value.trim() || 'Thaïlande'
    },
    surface: Number(form.surface.value) || 0,
    rooms: Number(form.rooms.value) || 0,
    bedrooms: Number(form.bedrooms.value) || 0,
    bathrooms: Number(form.bathrooms.value) || 0,
    description: form.description.value.trim(),
    features: features,
    images: images,
    status: form.status.value,
    isPublished: form.isPublished.checked,
    ref: form.ref.value.trim(),
    seo: {
      title: form.seoTitle.value.trim() || (title + ' | Beaulieu Pattaya'),
      description: form.seoDescription.value.trim(),
      canonicalUrl: 'https://www.beaulieu-pattaya.com/' + slug + '.html'
    }
  };
}

// Ajout
function addProperty() {
  showForm();
  document.getElementById("property-form").onsubmit = async function(e) {
    e.preventDefault();
    var props = await getProperties();
    var newProp = formToProperty(e.target);
    newProp.createdAt = new Date().toISOString();
    newProp.updatedAt = newProp.createdAt;

    // Vérifier unicité du slug
    if (props.some(function(p) { return p.slug === newProp.slug || p.id === newProp.id; })) {
      newProp.slug += '-' + Date.now().toString(36);
      newProp.id = newProp.slug;
    }

    props.push(newProp);
    saveProperties(props);
    hideForm();
    renderPropertiesList();
  };
}

// Edition
window.editProperty = async function(id) {
  var props = await getProperties();
  var prop = props.find(function(p) { return p.id === id; });
  if (!prop) return;
  showForm(prop);
  document.getElementById("property-form").onsubmit = async function(e) {
    e.preventDefault();
    var updatedProp = formToProperty(e.target);
    updatedProp.createdAt = prop.createdAt;
    updatedProp.updatedAt = new Date().toISOString();
    if (prop.structuredData) updatedProp.structuredData = prop.structuredData;
    var idx = props.findIndex(function(p) { return p.id === id; });
    props[idx] = updatedProp;
    saveProperties(props);
    hideForm();
    renderPropertiesList();
  };
};

// Dupliquer
window.duplicateProperty = async function(id) {
  var props = await getProperties();
  var prop = props.find(function(p) { return p.id === id; });
  if (!prop) return;
  var dup = JSON.parse(JSON.stringify(prop));
  dup.id = prop.slug + '-copie-' + Date.now().toString(36);
  dup.slug = dup.id;
  dup.title = prop.title + ' (copie)';
  dup.createdAt = new Date().toISOString();
  dup.updatedAt = dup.createdAt;
  if (dup.seo) dup.seo.canonicalUrl = 'https://www.beaulieu-pattaya.com/' + dup.slug + '.html';
  props.push(dup);
  saveProperties(props);
  renderPropertiesList();
};

// Supprimer
window.deleteProperty = async function(id) {
  if (!confirm("Confirmer la suppression ?")) return;
  var props = await getProperties();
  var idx = props.findIndex(function(p) { return p.id === id; });
  if (idx > -1) {
    props.splice(idx, 1);
    saveProperties(props);
    renderPropertiesList();
  }
};

// Cache le formulaire
window.hideForm = function() {
  document.getElementById("form-section").style.display = "none";
};

// Initialisation
window.onload = function() {
  renderPropertiesList();
  document.getElementById("add-property-btn").onclick = addProperty;
};
