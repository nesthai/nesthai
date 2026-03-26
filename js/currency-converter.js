/**
 * Convertisseur THB → EUR temps réel — NesThai Pattaya
 * ─────────────────────────────────────────────────────
 * API principale : https://open.er-api.com/v6/latest/THB  (gratuit, sans clé)
 * API secours    : https://api.exchangerate-api.com/v4/latest/THB
 * Cache          : sessionStorage (1 requête par session navigateur)
 * Fallback       : taux fixe 0.026 si les deux API échouent
 *
 * Attributs HTML reconnus : data-thb, data-price-thb
 * Classes ciblées : .detail-price, .card-price, .project-card p
 */
(function() {
    'use strict';

    /* ── Configuration ──────────────────────────────── */
    var API_PRIMARY   = 'https://open.er-api.com/v6/latest/THB';
    var API_SECONDARY = 'https://api.exchangerate-api.com/v4/latest/THB';
    var FALLBACK      = 0.026;         // ≈ 38,5 THB/EUR — utilisé si les API échouent
    var CACHE_KEY     = 'nesthai_thb_eur';
    var CACHE_TTL     = 3600000;       // 1 h en ms

    /* Taux actif — sera remplacé par la valeur API */
    var rate = FALLBACK;
    var rateSource = 'fallback';

    /* ── Récupération du taux ───────────────────────── */
    /**
     * Tente un appel XHR vers une URL d'API.
     * Retourne une Promise résolue avec le taux EUR ou rejetée.
     */
    function tryApi(url) {
        return new Promise(function(resolve, reject) {
            var xhr = new XMLHttpRequest();
            xhr.open('GET', url, true);
            xhr.timeout = 5000;
            xhr.onload = function() {
                try {
                    var data = JSON.parse(xhr.responseText);
                    var eurRate = data && data.rates && data.rates.EUR;
                    if (eurRate && eurRate > 0) {
                        resolve(eurRate);
                    } else {
                        reject('Pas de taux EUR dans la réponse');
                    }
                } catch (e) { reject(e); }
            };
            xhr.onerror = function() { reject('Erreur réseau'); };
            xhr.ontimeout = function() { reject('Timeout'); };
            xhr.send();
        });
    }

    /**
     * Charge le taux EUR depuis le cache ou les API (primary → secondary → fallback).
     * Retourne une Promise toujours résolue avec le taux.
     */
    function fetchRate() {
        return new Promise(function(resolve) {
            // 1. Vérifier le cache session
            try {
                var cached = sessionStorage.getItem(CACHE_KEY);
                if (cached) {
                    var obj = JSON.parse(cached);
                    if (obj.ts && Date.now() - obj.ts < CACHE_TTL && obj.rate > 0) {
                        rate = obj.rate;
                        rateSource = 'cache';
                        console.log('[CurrencyConverter] Taux cache : 1 THB = ' + rate + ' EUR');
                        return resolve(rate);
                    }
                }
            } catch (e) { /* sessionStorage indisponible — on continue */ }

            // 2. API principale → API secours → fallback
            tryApi(API_PRIMARY)
                .catch(function() { return tryApi(API_SECONDARY); })
                .then(function(eurRate) {
                    rate = eurRate;
                    rateSource = 'api';
                    console.log('[CurrencyConverter] Taux API temps réel : 1 THB = ' + rate + ' EUR');
                    try { sessionStorage.setItem(CACHE_KEY, JSON.stringify({ rate: rate, ts: Date.now() })); } catch (e) {}
                    resolve(rate);
                })
                .catch(function() {
                    rateSource = 'fallback';
                    console.warn('[CurrencyConverter] APIs indisponibles, fallback : 1 THB = ' + rate + ' EUR');
                    resolve(rate);
                });
        });
    }

    /* ── Parsing ────────────────────────────────────── */
    /**
     * Extrait le montant en THB depuis un texte de prix.
     * Gère : "2.89M THB", "12M THB", "85K THB/mois",
     *         "4,500,000 THB", "À partir de 3,800,000 THB", etc.
     */
    function parseThbAmount(text) {
        if (!text) return null;
        var s = text.replace(/[àa]\s*partir\s*de/i, '').trim();

        // Format compact : 2.89M THB, 12M THB, 85K THB
        var m = s.match(/([\d]+(?:[.,]\d+)?)\s*([MK])\s*THB/i);
        if (m) {
            var n = parseFloat(m[1].replace(',', '.'));
            return Math.round(n * (m[2].toUpperCase() === 'M' ? 1e6 : 1e3));
        }

        // Format complet : 4,500,000 THB  OU  4 500 000 ฿
        m = s.match(/([\d\s,.\u00a0]+)\s*(?:THB|฿)/i);
        if (m) {
            return parseInt(m[1].replace(/[\s,.\u00a0]/g, ''), 10) || null;
        }
        return null;
    }

    /* ── Formatage ──────────────────────────────────── */
    /** Format détaillé : 117 000 € */
    function fmtEur(n) {
        return n.toLocaleString('fr-FR') + ' €';
    }

    /** Format compact pour les cartes : 75 K€, 1.2 M€ */
    function fmtEurCompact(n) {
        if (n >= 1e6) {
            var m = n / 1e6;
            return (m % 1 === 0 ? m.toFixed(0) : m.toFixed(1).replace(/\.0$/, '')) + ' M€';
        }
        if (n >= 1000) return Math.round(n / 1000) + ' K€';
        return n + ' €';
    }

    /** Obtient le montant THB depuis data-thb ou data-price-thb */
    function getThbData(el) {
        return parseInt(el.getAttribute('data-thb') || el.getAttribute('data-price-thb'), 10) || 0;
    }

    /* ── Conversion globale ─────────────────────────── */
    function convertAll() {

        /* 1. Pages de détail — éléments avec data-thb / data-price-thb */
        document.querySelectorAll('.detail-price[data-thb], .detail-price[data-price-thb]').forEach(function(el) {
            var thb = getThbData(el);
            if (!thb) return;
            var eur = Math.round(thb * rate);
            var parent = el.closest('.detail-price-container') || el.parentElement;
            var cd = parent.querySelector('.detail-price-converted');
            if (cd) {
                cd.innerHTML = '<span class="currency-eur">≈ ' + fmtEur(eur) + '</span>';
            } else {
                cd = document.createElement('div');
                cd.className = 'detail-price-converted';
                cd.innerHTML = '<span class="currency-eur">≈ ' + fmtEur(eur) + '</span>';
                el.insertAdjacentElement('afterend', cd);
            }
        });

        /* 2. Pages de détail — prix sans data-thb (locations, etc.) */
        document.querySelectorAll('.detail-price:not([data-thb]):not([data-price-thb])').forEach(function(el) {
            if (el.nextElementSibling && el.nextElementSibling.classList.contains('detail-price-converted')) return;
            var thb = parseThbAmount(el.textContent);
            if (!thb) return;
            var eur = Math.round(thb * rate);
            var div = document.createElement('div');
            div.className = 'detail-price-converted';
            div.innerHTML = '<span class="currency-eur">≈ ' + fmtEur(eur) + '</span>';
            el.insertAdjacentElement('afterend', div);
        });

        /* 3. Cartes d'annonces — overlay sur images */
        document.querySelectorAll('.card-price').forEach(function(el) {
            if (el.querySelector('.price-eur')) return;
            var thb = parseThbAmount(el.childNodes[0] ? el.childNodes[0].textContent : el.textContent);
            if (!thb) return;
            var eur = Math.round(thb * rate);
            var span = document.createElement('div');
            span.className = 'price-eur';
            span.textContent = '≈ ' + fmtEurCompact(eur);
            el.appendChild(span);
        });

        /* 4. Cartes projets (projets.html — prix inline) */
        document.querySelectorAll('.project-content p, .project-card p').forEach(function(el) {
            if (el.querySelector('.price-eur')) return;
            if (el.textContent.indexOf('THB') === -1) return;
            var thb = parseThbAmount(el.textContent);
            if (!thb) return;
            var eur = Math.round(thb * rate);
            var span = document.createElement('span');
            span.className = 'price-eur price-eur-inline';
            span.textContent = ' ≈ ' + fmtEurCompact(eur);
            el.appendChild(span);
        });
    }

    /* ── Démarrage ──────────────────────────────────── */
    function init() {
        // Charger le taux puis convertir
        fetchRate().then(function() {
            convertAll();

            // MutationObserver pour le contenu dynamique (recherche.html)
            var timer = null;
            var obs = new MutationObserver(function(mutations) {
                var dominated = false;
                for (var i = 0; i < mutations.length; i++) {
                    for (var j = 0; j < mutations[i].addedNodes.length; j++) {
                        var node = mutations[i].addedNodes[j];
                        if (node.nodeType === 1) {
                            if (node.querySelector && node.querySelector('.card-price, .detail-price')) { dominated = true; break; }
                            if (node.classList && node.classList.contains('card-price')) { dominated = true; break; }
                        }
                    }
                    if (dominated) break;
                }
                if (dominated) {
                    clearTimeout(timer);
                    timer = setTimeout(convertAll, 100);
                }
            });
            obs.observe(document.body, { childList: true, subtree: true });
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    /* ── API publique ───────────────────────────────── */
    window.CurrencyConverter = {
        convertAll: convertAll,
        parseThbAmount: parseThbAmount,
        getRate: function() { return rate; },
        getSource: function() { return rateSource; },
        refresh: function() { return fetchRate().then(convertAll); }
    };
})();
