// Moteur de recherche immobilier - Nes Thai Business
const propertiesDB = [
    // CONDOS
    {
        id: 'condo-001',
        type: 'condo',
        title: 'The Panora Estuaria',
        location: 'Baan Amphur',
        price: '4.5M THB',
        priceNum: 4500000,
        status: 'sale',
        bedrooms: 1,
        bathrooms: 1,
        area: 45,
        image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&h=400&fit=crop',
        url: 'condo-panora-estuaria.html',
        description: 'Condo luxueux en front de mer avec vue imprenable'
    },
    {
        id: 'condo-002',
        type: 'condo',
        title: 'Copacabana Beach Jomtien',
        location: 'Jomtien Beach',
        price: '3.2M THB',
        priceNum: 3200000,
        status: 'sale',
        bedrooms: 1,
        bathrooms: 1,
        area: 38,
        image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&h=400&fit=crop',
        url: 'condo-copacabana.html',
        description: 'Condo moderne à quelques pas de la plage'
    },
    {
        id: 'condo-003',
        type: 'condo',
        title: 'Centric Sea Pattaya',
        location: 'Centre Pattaya',
        price: '25K THB/mois',
        priceNum: 25000,
        status: 'rent',
        bedrooms: 2,
        bathrooms: 2,
        area: 62,
        image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&h=400&fit=crop',
        url: 'condo-centric-sea.html',
        description: 'Spacieux condo en centre-ville avec piscine'
    },
    {
        id: 'condo-004',
        type: 'condo',
        title: 'Wongamat Tower',
        location: 'Wongamat Beach',
        price: '8.5M THB',
        priceNum: 8500000,
        status: 'sale',
        bedrooms: 2,
        bathrooms: 2,
        area: 85,
        image: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=600&h=400&fit=crop',
        url: 'condo-wongamat-tower.html',
        description: 'Condo haut standing avec vue mer panoramique'
    },
    {
        id: 'condo-005',
        type: 'condo',
        title: 'The Base Pattaya',
        location: 'Centre Pattaya',
        price: '35K THB/mois',
        priceNum: 35000,
        status: 'rent',
        bedrooms: 2,
        bathrooms: 2,
        area: 58,
        image: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=600&h=400&fit=crop',
        url: 'condo-the-base.html',
        description: 'Condo design en plein cœur de Pattaya'
    },
    {
        id: 'condo-006',
        type: 'condo',
        title: 'Northpoint Pattaya',
        location: 'Wongamat',
        price: '12M THB',
        priceNum: 12000000,
        status: 'sale',
        bedrooms: 3,
        bathrooms: 3,
        area: 145,
        image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&h=400&fit=crop',
        url: 'condo-northpoint.html',
        description: 'Penthouse de luxe avec piscine privée'
    },
    {
        id: 'condo-007',
        type: 'condo',
        title: 'Centric Sea - Vue Mer',
        location: 'Centre Pattaya',
        price: '5.9M THB',
        priceNum: 5900000,
        status: 'sale',
        bedrooms: 1,
        bathrooms: 1,
        area: 35,
        image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&h=400&fit=crop',
        url: 'condo-centric.html',
        description: 'Studio moderne avec vue mer partielle'
    },
    {
        id: 'condo-008',
        type: 'condo',
        title: 'Wongamat Beach Penthouse',
        location: 'Wongamat Beach',
        price: '18M THB',
        priceNum: 18000000,
        status: 'sale',
        bedrooms: 3,
        bathrooms: 3,
        area: 220,
        image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&h=400&fit=crop',
        url: 'condo-wongamat-penthouse.html',
        description: 'Penthouse exclusif vue mer panoramique'
    },
    {
        id: 'condo-009',
        type: 'condo',
        title: 'Jomtien Beach Studio',
        location: 'Jomtien Beach',
        price: '15K THB/mois',
        priceNum: 15000,
        status: 'rent',
        bedrooms: 0,
        bathrooms: 1,
        area: 28,
        image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&h=400&fit=crop',
        url: 'condo-jomtien-studio.html',
        description: 'Studio meublé proche plage - idéal investissement'
    },
    {
        id: 'condo-010',
        type: 'condo',
        title: 'Central Pattaya 2 Bed',
        location: 'Centre Pattaya',
        price: '4.2M THB',
        priceNum: 4200000,
        status: 'sale',
        bedrooms: 2,
        bathrooms: 1,
        area: 55,
        image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&h=400&fit=crop',
        url: 'condo-central-2bed.html',
        description: 'Appartement 2 chambres en centre-ville'
    },
    {
        id: 'condo-011',
        type: 'condo',
        title: 'The Panora Pattaya',
        location: 'Pratumnak',
        price: '6.8M THB',
        priceNum: 6800000,
        status: 'sale',
        bedrooms: 2,
        bathrooms: 2,
        area: 72,
        image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&h=400&fit=crop',
        url: 'condo-panora.html',
        description: 'Condo de standing avec équipements premium'
    },
    {
        id: 'condo-012',
        type: 'condo',
        title: 'Wongamat Beach Condo',
        location: 'Wongamat Beach',
        price: '5.5M THB',
        priceNum: 5500000,
        status: 'sale',
        bedrooms: 1,
        bathrooms: 1,
        area: 42,
        image: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=600&h=400&fit=crop',
        url: 'condo-wongamat.html',
        description: 'Condo front de mer avec accès plage direct'
    },
    {
        id: 'condo-013',
        type: 'condo',
        title: 'Axis Pattaya',
        location: 'Pratumnak',
        price: '3.9M THB',
        priceNum: 3900000,
        status: 'sale',
        bedrooms: 1,
        bathrooms: 1,
        area: 36,
        image: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=600&h=400&fit=crop',
        url: 'condo-axis.html',
        description: 'Condo moderne quartier résidentiel calme'
    },
    // MAISONS
    {
        id: 'maison-001',
        type: 'maison',
        title: 'Résidence Chaknok Villa',
        location: 'Chak Nok',
        price: '15M THB',
        priceNum: 15000000,
        status: 'sale',
        bedrooms: 3,
        bathrooms: 3,
        area: 280,
        image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=600&h=400&fit=crop',
        url: 'maison-chaknok-villa.html',
        description: 'Villa luxueuse avec piscine privée'
    },
    {
        id: 'maison-002',
        type: 'maison',
        title: 'Villa Royale Jomtien',
        location: 'Jomtien Beach',
        price: '22M THB',
        priceNum: 22000000,
        status: 'sale',
        bedrooms: 4,
        bathrooms: 4,
        area: 450,
        image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&h=400&fit=crop',
        url: 'maison-royale-jomtien.html',
        description: 'Villa contemporaine avec vue mer'
    },
    {
        id: 'maison-003',
        type: 'maison',
        title: 'Maison Pratumnak Hill',
        location: 'Pratumnak Hill',
        price: '85K THB/mois',
        priceNum: 85000,
        status: 'rent',
        bedrooms: 3,
        bathrooms: 2,
        area: 200,
        image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&h=400&fit=crop',
        url: 'maison-pratumnak-hill.html',
        description: 'Maison familiale avec jardin tropical'
    },
    {
        id: 'maison-004',
        type: 'maison',
        title: "Villa d'Architecte Naklua",
        location: 'Naklua',
        price: '35M THB',
        priceNum: 35000000,
        status: 'sale',
        bedrooms: 5,
        bathrooms: 5,
        area: 680,
        image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&h=400&fit=crop',
        url: 'maison-architecte-naklua.html',
        description: "Villa d'exception design moderne"
    },
    // TERRAINS
    {
        id: 'terrain-001',
        type: 'terrain',
        title: 'Terrain Chaknok Lake',
        location: 'Chak Nok',
        price: '8M THB',
        priceNum: 8000000,
        status: 'sale',
        area: 816,
        areaWah: 204,
        image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&h=400&fit=crop',
        url: 'terrain-chaknok.html',
        description: 'Terrain viabilisé près du lac Chaknok'
    },
    {
        id: 'terrain-002',
        type: 'terrain',
        title: 'Terrain Jomtien Beach',
        location: 'Jomtien Beach',
        price: '12M THB',
        priceNum: 12000000,
        status: 'sale',
        area: 1200,
        areaWah: 300,
        image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&h=400&fit=crop',
        url: 'terrain-jomtien-beach.html',
        description: 'Terrain plat proche de la plage'
    },
    {
        id: 'terrain-003',
        type: 'terrain',
        title: 'Terrain Naklua Hills',
        location: 'Naklua',
        price: '25M THB',
        priceNum: 25000000,
        status: 'sale',
        area: 2000,
        areaWah: 500,
        image: 'https://images.unsplash.com/photo-1449844908441-8829872d2607?w=600&h=400&fit=crop',
        url: 'terrain-naklua-hills.html',
        description: 'Grand terrain avec vue mer panoramique'
    },
    {
        id: 'terrain-004',
        type: 'terrain',
        title: 'Terrain Centre Pattaya',
        location: 'Centre Pattaya',
        price: '45M THB',
        priceNum: 45000000,
        status: 'sale',
        area: 600,
        areaWah: 150,
        image: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=600&h=400&fit=crop',
        url: 'terrain-centre-pattaya.html',
        description: 'Terrain commercial en centre-ville'
    },
    // PROJETS
    {
        id: 'projet-001',
        type: 'projet',
        title: 'Résidence Chaknok',
        location: 'Chak Nok',
        price: '15M THB',
        priceNum: 15000000,
        status: 'sale',
        image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=600&h=400&fit=crop',
        url: 'projet-residence-chaknok.html',
        description: "8 villas d'exception - Livraison 2027"
    },
    {
        id: 'projet-002',
        type: 'projet',
        title: 'The Panora Estuaria',
        location: 'Baan Amphur',
        price: '4.5M THB',
        priceNum: 4500000,
        status: 'sale',
        image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&h=400&fit=crop',
        url: 'projet-panora-estuaria.html',
        description: 'Condo front de mer - Livraison 2025'
    },
    {
        id: 'projet-003',
        type: 'projet',
        title: 'Ocean Horizon',
        location: 'Centre Pattaya',
        price: '3.8M THB',
        priceNum: 3800000,
        status: 'sale',
        image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&h=400&fit=crop',
        url: 'projet-ocean-horizon.html',
        description: 'Tour résidentielle vue mer 360° - Livraison 2026'
    }
];

let currentFilter = 'all';
let searchQuery = '';

function getUrlParams() {
    const params = new URLSearchParams(window.location.search);
    return {
        q: params.get('q') || '',
        type: params.get('type') || 'all'
    };
}

function performSearch() {
    searchQuery = document.getElementById('search-input').value.toLowerCase().trim();
    updateResults();
}

function filterByType(type) {
    currentFilter = type;
    document.querySelectorAll('.filter-chip').forEach(function(chip) {
        chip.classList.remove('active');
        if (chip.getAttribute('data-type') === type) {
            chip.classList.add('active');
        }
    });
    // Synchroniser le select type avancé
    var typeEl = document.getElementById('filter-type');
    if (typeEl) typeEl.value = type === 'all' ? 'all' : type;
    updateResults();
}

function updateFilterCounts() {
    var labels = { all: 'Tous', condo: 'Condos', maison: 'Maisons', terrain: 'Terrains', projet: 'Projets' };
    document.querySelectorAll('.filter-chip').forEach(function(chip) {
        var type = chip.getAttribute('data-type');
        if (!type) return;
        var count = type === 'all' ? propertiesDB.length : propertiesDB.filter(function(p) { return p.type === type; }).length;
        chip.textContent = labels[type] + ' (' + count + ')';
    });
}

function toggleAdvancedFilters() {
    var panel = document.getElementById('advancedFiltersPanel');
    var btn = document.getElementById('advancedFiltersToggle');
    panel.classList.toggle('hidden');
    btn.classList.toggle('active');
}

function applyAdvancedFilters() {
    // Synchroniser le filtre type avancé avec les chips rapides
    var typeEl = document.getElementById('filter-type');
    if (typeEl && typeEl.value !== 'all') {
        currentFilter = typeEl.value;
        document.querySelectorAll('.filter-chip').forEach(function(chip) {
            chip.classList.remove('active');
        });
    }
    updateResults();
}

function resetAdvancedFilters() {
    var ids = ['filter-type','filter-price-min','filter-price-max','filter-bedrooms',
               'filter-bathrooms','filter-area-min','filter-area-max','filter-status','filter-sort'];
    ids.forEach(function(id) {
        var el = document.getElementById(id);
        if (el) el.selectedIndex = 0;
    });
    var zoneEl = document.getElementById('filter-zone');
    if (zoneEl) {
        for (var i = 0; i < zoneEl.options.length; i++) {
            zoneEl.options[i].selected = false;
        }
    }
    document.querySelectorAll('.features-grid input[type="checkbox"]').forEach(function(cb) {
        cb.checked = false;
    });
    currentFilter = 'all';
    searchQuery = '';
    document.getElementById('search-input').value = '';
    document.querySelectorAll('.filter-chip').forEach(function(chip) {
        chip.classList.remove('active');
    });
    document.querySelector('.filter-chip').classList.add('active');
    updateResults();
}

function populateZones() {
    var zones = [];
    propertiesDB.forEach(function(prop) {
        if (prop.location && zones.indexOf(prop.location) === -1) {
            zones.push(prop.location);
        }
    });
    zones.sort();
    var select = document.getElementById('filter-zone');
    if (!select) return;
    zones.forEach(function(zone) {
        var opt = document.createElement('option');
        opt.value = zone;
        opt.textContent = zone;
        select.appendChild(opt);
    });
}

function getSelectedZones() {
    var select = document.getElementById('filter-zone');
    if (!select) return [];
    var selected = [];
    for (var i = 0; i < select.options.length; i++) {
        if (select.options[i].selected) selected.push(select.options[i].value);
    }
    return selected;
}

function getCheckedFeatures() {
    var checked = [];
    document.querySelectorAll('.features-grid input[type="checkbox"]:checked').forEach(function(cb) {
        checked.push(cb.value);
    });
    return checked;
}

function matchesFeatures(prop, features) {
    if (features.length === 0) return true;
    var text = (prop.description + ' ' + prop.title).toLowerCase();
    var featureKeywords = {
        'piscine': ['piscine'],
        'piscine-privee': ['piscine priv'],
        'vue-mer': ['vue mer', 'vue ocean', 'sea view', 'ocean view'],
        'vue-montagne': ['vue montagne', 'mountain view'],
        'vue-ville': ['vue ville', 'city view'],
        'front-de-mer': ['front de mer', 'beachfront'],
        'acces-plage': ['acc\u00e8s plage', 'acces plage', 'acc\u00e8s direct plage', 'plage'],
        'salle-de-sport': ['salle de sport', 'fitness', 'gym'],
        'securite-24h': ['s\u00e9curit\u00e9 24', 'securite 24', 'gardien', '24/7'],
        'parking': ['parking'],
        'balcon': ['balcon'],
        'terrasse': ['terrasse'],
        'jardin': ['jardin'],
        'meuble': ['meubl\u00e9', 'meuble', 'furnished'],
        'freehold': ['freehold'],
        'leasehold': ['leasehold'],
        'foreign-quota': ['foreign quota', 'quota \u00e9tranger'],
        'thai-quota': ['thai quota'],
        'proche-ecoles': ['\u00e9cole', 'ecole', 'school'],
        'proche-golf': ['golf'],
        'proche-centre-commercial': ['centre commercial', 'mall', 'shopping']
    };
    return features.every(function(f) {
        var keywords = featureKeywords[f] || [f];
        return keywords.some(function(kw) { return text.indexOf(kw) !== -1; });
    });
}

function updateResults() {
    var resultsContainer = document.getElementById('search-results-grid');
    var noResults = document.getElementById('no-results');
    var countElement = document.getElementById('results-count');

    var typeEl = document.getElementById('filter-type');
    var priceMinEl = document.getElementById('filter-price-min');
    var priceMaxEl = document.getElementById('filter-price-max');
    var bedroomsEl = document.getElementById('filter-bedrooms');
    var bathroomsEl = document.getElementById('filter-bathrooms');
    var areaMinEl = document.getElementById('filter-area-min');
    var areaMaxEl = document.getElementById('filter-area-max');
    var statusEl = document.getElementById('filter-status');
    var sortEl = document.getElementById('filter-sort');

    var advType = typeEl ? typeEl.value : 'all';
    var priceMin = priceMinEl ? parseInt(priceMinEl.value) : 0;
    var priceMax = priceMaxEl ? parseInt(priceMaxEl.value) : 0;
    var minBedrooms = bedroomsEl ? parseInt(bedroomsEl.value) : -1;
    var minBathrooms = bathroomsEl ? parseInt(bathroomsEl.value) : 0;
    var areaMin = areaMinEl ? parseInt(areaMinEl.value) : 0;
    var areaMax = areaMaxEl ? parseInt(areaMaxEl.value) : 0;
    var statusFilter = statusEl ? statusEl.value : 'all';
    var sortBy = sortEl ? sortEl.value : 'recent';
    var selectedZones = getSelectedZones();
    var checkedFeatures = getCheckedFeatures();

    // Le filtre rapide (chips) a priorité sauf si le filtre avancé type est utilisé
    var effectiveType = currentFilter !== 'all' ? currentFilter : advType;

    var results = propertiesDB.filter(function(prop) {
        if (effectiveType !== 'all' && prop.type !== effectiveType) return false;
        if (searchQuery) {
            var searchIn = (prop.title + ' ' + prop.location + ' ' + prop.description + ' ' + prop.type).toLowerCase();
            if (searchIn.indexOf(searchQuery) === -1) return false;
        }
        if (priceMin > 0 && prop.priceNum < priceMin) return false;
        if (priceMax > 0 && prop.priceNum > priceMax) return false;
        if (minBedrooms === 0 && (prop.bedrooms || 0) !== 0) { /* studio: only show 0-bedroom */ }
        else if (minBedrooms === 0) { /* ok, studio matches */ }
        else if (minBedrooms > 0 && (prop.bedrooms || 0) < minBedrooms) return false;
        if (minBathrooms > 0 && (prop.bathrooms || 0) < minBathrooms) return false;
        if (areaMin > 0 && (prop.area || 0) < areaMin) return false;
        if (areaMax > 0 && (prop.area || 0) > areaMax) return false;
        if (statusFilter !== 'all' && prop.status !== statusFilter) return false;
        if (selectedZones.length > 0 && selectedZones.indexOf(prop.location) === -1) return false;
        if (!matchesFeatures(prop, checkedFeatures)) return false;
        return true;
    });

    // Tri
    if (sortBy === 'price-asc') {
        results.sort(function(a, b) { return a.priceNum - b.priceNum; });
    } else if (sortBy === 'price-desc') {
        results.sort(function(a, b) { return b.priceNum - a.priceNum; });
    } else if (sortBy === 'area-desc') {
        results.sort(function(a, b) { return (b.area || 0) - (a.area || 0); });
    }

    countElement.textContent = results.length + ' bien(s) trouvé(s)';

    if (results.length === 0) {
        resultsContainer.innerHTML = '';
        noResults.style.display = 'block';
        return;
    }

    noResults.style.display = 'none';

    resultsContainer.innerHTML = results.map(function(prop) {
        return '<article class="property-card">' +
            '<a href="' + prop.url + '" style="text-decoration: none; color: inherit; display: block;">' +
                '<div class="card-image">' +
                    '<img src="' + prop.image + '" alt="' + prop.title + '">' +
                    '<span class="card-badge badge-' + prop.status + '">' + (prop.status === 'sale' ? 'À Vendre' : 'À Louer') + '</span>' +
                    '<div class="card-price">' + prop.price + '</div>' +
                '</div>' +
                '<div class="card-content">' +
                    '<h3>' + prop.title + '</h3>' +
                    '<p class="card-location">📍 ' + prop.location + '</p>' +
                    '<div class="card-features">' +
                        (prop.bedrooms ? '<span>🛏️ ' + prop.bedrooms + ' Ch.</span>' : '') +
                        (prop.bathrooms ? '<span>🛁 ' + prop.bathrooms + ' SdB</span>' : '') +
                        '<span>📐 ' + (prop.areaWah || prop.area) + ' ' + (prop.areaWah ? 'sq.wah' : 'm²') + '</span>' +
                    '</div>' +
                    '<p class="card-description">' + prop.description + '...</p>' +
                    '<span class="btn btn-outline" style="margin-top: 10px; display: inline-block; padding: 8px 20px; font-size: 0.8rem;">Voir détails →</span>' +
                '</div>' +
            '</a>' +
        '</article>';
    }).join('');
}

document.addEventListener('DOMContentLoaded', function() {
    var params = getUrlParams();

    if (params.q) {
        document.getElementById('search-input').value = params.q;
        searchQuery = params.q.toLowerCase();
    }

    if (params.type && params.type !== 'all') {
        currentFilter = params.type;
        document.querySelectorAll('.filter-chip').forEach(function(chip) {
            chip.classList.remove('active');
            if (chip.getAttribute('data-type') === params.type) {
                chip.classList.add('active');
            }
        });
    }

    populateZones();
    updateFilterCounts();
    updateResults();

    document.getElementById('search-input').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
});
