/**
 * Cookie Consent Manager - NesThai Property
 * Conformité RGPD / GDPR pour clients européens
 * Version: 1.0.0
 */

(function() {
    'use strict';

    // Configuration
    const CONFIG = {
        cookieName: 'nesthai_cookie_consent',
        cookieExpiry: 365, // jours
        privacyUrl: 'politique-confidentialite.html',
        companyName: 'Nes Thai Business Co., Ltd.'
    };

    // État du consentement
    let consentState = {
        essential: true, // Toujours true
        preferences: false,
        analytics: false,
        marketing: false,
        timestamp: null
    };

    /**
     * Récupère le consentement stocké
     */
    function getStoredConsent() {
        const cookie = document.cookie
            .split('; ')
            .find(row => row.startsWith(CONFIG.cookieName + '='));
        
        if (cookie) {
            try {
                return JSON.parse(decodeURIComponent(cookie.split('=')[1]));
            } catch (e) {
                return null;
            }
        }
        return null;
    }

    /**
     * Sauvegarde le consentement
     */
    function saveConsent(state) {
        const value = encodeURIComponent(JSON.stringify(state));
        const expiry = new Date();
        expiry.setDate(expiry.getDate() + CONFIG.cookieExpiry);
        
        document.cookie = `${CONFIG.cookieName}=${value};expires=${expiry.toUTCString()};path=/;Secure;SameSite=Lax`;
        
        // Stockage local pour accès rapide
        localStorage.setItem(CONFIG.cookieName, JSON.stringify(state));
    }

    /**
     * Crée la bannière de consentement
     */
    function createBanner() {
        const banner = document.createElement('div');
        banner.id = 'cookie-banner';
        banner.setAttribute('role', 'dialog');
        banner.setAttribute('aria-label', 'Gestion des cookies');
        banner.innerHTML = `
            <div class="cookie-banner-container">
                <div class="cookie-banner-content">
                    <div class="cookie-banner-text">
                        <h3>🍪 Gestion des cookies</h3>
                        <p>
                            <strong>${CONFIG.companyName}</strong> utilise des cookies pour améliorer votre expérience 
                            et mesurer l'audience de notre site. Certains cookies sont nécessaires au fonctionnement 
                            du site, d'autres nécessitent votre consentement.
                        </p>
                        <p class="cookie-banner-legal">
                            En poursuivant votre navigation, vous acceptez notre 
                            <a href="${CONFIG.privacyUrl}" target="_blank" rel="noopener">politique de confidentialité</a>.
                        </p>
                    </div>
                    <div class="cookie-banner-actions">
                        <button type="button" class="cookie-btn cookie-btn-customize" id="cookie-customize">
                            Personnaliser
                        </button>
                        <button type="button" class="cookie-btn cookie-btn-accept" id="cookie-accept-all">
                            Tout accepter
                        </button>
                        <button type="button" class="cookie-btn cookie-btn-essential" id="cookie-essential">
                            Refuser (essentiels uniquement)
                        </button>
                    </div>
                </div>
                
                <!-- Panneau de personnalisation -->
                <div class="cookie-customize-panel" id="cookie-panel" style="display: none;">
                    <div class="cookie-options">
                        <div class="cookie-option">
                            <div class="cookie-option-info">
                                <h4>Cookies essentiels</h4>
                                <p>Nécessaires au fonctionnement du site (sécurité, panier, préférences de base)</p>
                            </div>
                            <label class="cookie-toggle">
                                <input type="checkbox" checked disabled>
                                <span class="cookie-toggle-slider"></span>
                            </label>
                        </div>
                        
                        <div class="cookie-option">
                            <div class="cookie-option-info">
                                <h4>Cookies de préférences</h4>
                                <p>Mémorisent vos choix (langue, devise affichée THB/€/$)</p>
                            </div>
                            <label class="cookie-toggle">
                                <input type="checkbox" id="cookie-pref" checked>
                                <span class="cookie-toggle-slider"></span>
                            </label>
                        </div>
                        
                        <div class="cookie-option">
                            <div class="cookie-option-info">
                                <h4>Cookies statistiques (Google Analytics)</h4>
                                <p>Mesure d'audience anonymisée - nous aide à améliorer le site</p>
                            </div>
                            <label class="cookie-toggle">
                                <input type="checkbox" id="cookie-analytics">
                                <span class="cookie-toggle-slider"></span>
                            </label>
                        </div>
                        
                        <div class="cookie-option">
                            <div class="cookie-option-info">
                                <h4>Cookies marketing (Facebook, Google Ads)</h4>
                                <p>Publicités personnalisées et remarketing</p>
                            </div>
                            <label class="cookie-toggle">
                                <input type="checkbox" id="cookie-marketing">
                                <span class="cookie-toggle-slider"></span>
                            </label>
                        </div>
                    </div>
                    <div class="cookie-panel-actions">
                        <button type="button" class="cookie-btn cookie-btn-save" id="cookie-save">
                            Enregistrer mes choix
                        </button>
                    </div>
                </div>
            </div>
        `;

        // Styles inline pour la bannière
        const styles = document.createElement('style');
        styles.textContent = `
            #cookie-banner {
                position: fixed;
                bottom: 0;
                left: 0;
                right: 0;
                background: #1a1a1a;
                color: #fff;
                z-index: 10000;
                padding: 20px;
                box-shadow: 0 -4px 20px rgba(0,0,0,0.3);
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
                font-size: 14px;
                line-height: 1.5;
            }
            
            .cookie-banner-container {
                max-width: 1200px;
                margin: 0 auto;
            }
            
            .cookie-banner-content {
                display: flex;
                gap: 30px;
                align-items: flex-start;
            }
            
            .cookie-banner-text {
                flex: 1;
            }
            
            .cookie-banner-text h3 {
                margin: 0 0 10px 0;
                font-size: 18px;
                color: #C9A962;
            }
            
            .cookie-banner-text p {
                margin: 0 0 10px 0;
                color: rgba(255,255,255,0.9);
            }
            
            .cookie-banner-legal {
                font-size: 12px;
                color: rgba(255,255,255,0.6) !important;
            }
            
            .cookie-banner-legal a {
                color: #C9A962;
                text-decoration: underline;
            }
            
            .cookie-banner-actions {
                display: flex;
                flex-direction: column;
                gap: 10px;
                min-width: 200px;
            }
            
            .cookie-btn {
                padding: 12px 20px;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 14px;
                font-weight: 500;
                transition: all 0.3s ease;
                text-align: center;
            }
            
            .cookie-btn-accept {
                background: #C9A962;
                color: #1a1a1a;
            }
            
            .cookie-btn-accept:hover {
                background: #d4b76a;
                transform: translateY(-1px);
            }
            
            .cookie-btn-customize {
                background: transparent;
                color: #C9A962;
                border: 1px solid #C9A962;
            }
            
            .cookie-btn-customize:hover {
                background: rgba(201,169,98,0.1);
            }
            
            .cookie-btn-essential {
                background: transparent;
                color: rgba(255,255,255,0.7);
                border: 1px solid rgba(255,255,255,0.3);
                font-size: 12px;
            }
            
            .cookie-btn-essential:hover {
                color: #fff;
                border-color: #fff;
            }
            
            .cookie-customize-panel {
                margin-top: 20px;
                padding-top: 20px;
                border-top: 1px solid rgba(255,255,255,0.1);
            }
            
            .cookie-options {
                display: grid;
                gap: 15px;
                margin-bottom: 20px;
            }
            
            .cookie-option {
                display: flex;
                justify-content: space-between;
                align-items: center;
                background: rgba(255,255,255,0.05);
                padding: 15px;
                border-radius: 8px;
            }
            
            .cookie-option-info h4 {
                margin: 0 0 5px 0;
                font-size: 14px;
                color: #fff;
            }
            
            .cookie-option-info p {
                margin: 0;
                font-size: 12px;
                color: rgba(255,255,255,0.6);
            }
            
            .cookie-toggle {
                position: relative;
                display: inline-block;
                width: 50px;
                height: 26px;
                flex-shrink: 0;
            }
            
            .cookie-toggle input {
                opacity: 0;
                width: 0;
                height: 0;
            }
            
            .cookie-toggle-slider {
                position: absolute;
                cursor: pointer;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background-color: #444;
                transition: .3s;
                border-radius: 26px;
            }
            
            .cookie-toggle-slider:before {
                position: absolute;
                content: "";
                height: 20px;
                width: 20px;
                left: 3px;
                bottom: 3px;
                background-color: white;
                transition: .3s;
                border-radius: 50%;
            }
            
            .cookie-toggle input:checked + .cookie-toggle-slider {
                background-color: #C9A962;
            }
            
            .cookie-toggle input:checked + .cookie-toggle-slider:before {
                transform: translateX(24px);
            }
            
            .cookie-toggle input:disabled + .cookie-toggle-slider {
                opacity: 0.5;
                cursor: not-allowed;
            }
            
            .cookie-panel-actions {
                text-align: center;
            }
            
            .cookie-btn-save {
                background: #C9A962;
                color: #1a1a1a;
                padding: 12px 40px;
            }
            
            .cookie-btn-save:hover {
                background: #d4b76a;
            }
            
            /* Bouton flottant pour modifier le consentement */
            #cookie-settings-btn {
                position: fixed;
                bottom: 90px;
                left: 20px;
                width: 45px;
                height: 45px;
                background: #1a1a1a;
                border: 2px solid #C9A962;
                border-radius: 50%;
                cursor: pointer;
                z-index: 9999;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 20px;
                transition: all 0.3s ease;
                box-shadow: 0 2px 10px rgba(0,0,0,0.3);
            }
            
            #cookie-settings-btn:hover {
                background: #C9A962;
                transform: scale(1.1);
            }
            
            /* Responsive */
            @media (max-width: 768px) {
                .cookie-banner-content {
                    flex-direction: column;
                }
                
                .cookie-banner-actions {
                    width: 100%;
                }
                
                .cookie-btn {
                    width: 100%;
                }
                
                .cookie-option {
                    flex-direction: column;
                    align-items: flex-start;
                    gap: 15px;
                }
                
                #cookie-settings-btn {
                    bottom: 80px;
                    left: 15px;
                }
            }
        `;
        
        document.head.appendChild(styles);
        document.body.appendChild(banner);
        
        // Event listeners
        setupEventListeners();
    }

    /**
     * Configure les événements de la bannière
     */
    function setupEventListeners() {
        const banner = document.getElementById('cookie-banner');
        const panel = document.getElementById('cookie-panel');
        
        // Bouton personnaliser
        document.getElementById('cookie-customize')?.addEventListener('click', () => {
            panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
        });
        
        // Bouton tout accepter
        document.getElementById('cookie-accept-all')?.addEventListener('click', () => {
            consentState = {
                essential: true,
                preferences: true,
                analytics: true,
                marketing: true,
                timestamp: new Date().toISOString()
            };
            saveConsent(consentState);
            hideBanner();
            activateServices();
        });
        
        // Bouton essentiels uniquement
        document.getElementById('cookie-essential')?.addEventListener('click', () => {
            consentState = {
                essential: true,
                preferences: false,
                analytics: false,
                marketing: false,
                timestamp: new Date().toISOString()
            };
            saveConsent(consentState);
            hideBanner();
        });
        
        // Bouton sauvegarder personnalisation
        document.getElementById('cookie-save')?.addEventListener('click', () => {
            consentState = {
                essential: true,
                preferences: document.getElementById('cookie-pref')?.checked || false,
                analytics: document.getElementById('cookie-analytics')?.checked || false,
                marketing: document.getElementById('cookie-marketing')?.checked || false,
                timestamp: new Date().toISOString()
            };
            saveConsent(consentState);
            hideBanner();
            activateServices();
        });
    }

    /**
     * Masque la bannière
     */
    function hideBanner() {
        const banner = document.getElementById('cookie-banner');
        if (banner) {
            banner.style.display = 'none';
        }
    }

    /**
     * Active les services selon le consentement
     */
    function activateServices() {
        // Google Analytics
        if (consentState.analytics && typeof gtag !== 'undefined') {
            gtag('consent', 'update', {
                'analytics_storage': 'granted'
            });
        }
        
        // Marketing
        if (consentState.marketing && typeof gtag !== 'undefined') {
            gtag('consent', 'update', {
                'ad_storage': 'granted',
                'ad_user_data': 'granted',
                'ad_personalization': 'granted'
            });
        }
        
        // Facebook Pixel
        if (consentState.marketing && typeof fbq !== 'undefined') {
            fbq('consent', 'grant');
        }
        
        // Événement personnalisé
        window.dispatchEvent(new CustomEvent('cookieConsentUpdated', { detail: consentState }));
    }

    /**
     * Crée le bouton flottant pour modifier le consentement
     */
    function createSettingsButton() {
        const btn = document.createElement('button');
        btn.id = 'cookie-settings-btn';
        btn.innerHTML = '🍪';
        btn.setAttribute('title', 'Modifier mes préférences cookies');
        btn.setAttribute('aria-label', 'Modifier les préférences de cookies');
        
        btn.addEventListener('click', () => {
            const banner = document.getElementById('cookie-banner');
            if (banner) {
                banner.style.display = 'block';
                window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
            } else {
                createBanner();
            }
        });
        
        document.body.appendChild(btn);
    }

    /**
     * Initialise le gestionnaire de consentement
     */
    function init() {
        const stored = getStoredConsent();
        
        if (stored) {
            consentState = stored;
            // Afficher le bouton de paramètres
            createSettingsButton();
            activateServices();
        } else {
            // Première visite - afficher la bannière
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', createBanner);
            } else {
                createBanner();
            }
            createSettingsButton();
        }
    }

    // API publique
    window.CookieConsent = {
        getState: () => ({ ...consentState }),
        hasConsent: (type) => consentState[type] || false,
        reset: () => {
            document.cookie = `${CONFIG.cookieName}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
            localStorage.removeItem(CONFIG.cookieName);
            location.reload();
        }
    };

    // Démarrer
    init();

})();
