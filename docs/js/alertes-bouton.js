/**
 * Bouton flottant Alertes Prix - NesThai Property
 * Remplace l'ancien bouton cookie par un bouton d'alertes immobilières attractif
 * Version: 1.0.0
 */

(function() {
    'use strict';

    /**
     * Crée le bouton flottant d'alertes prix
     */
    function createAlertesButton() {
        // Vérifier si le bouton existe déjà
        if (document.getElementById('alertes-prix-btn')) {
            return;
        }

        // Créer le conteneur principal
        const container = document.createElement('div');
        container.id = 'alertes-prix-container';
        
        // Créer le bouton
        const btn = document.createElement('a');
        btn.id = 'alertes-prix-btn';
        btn.href = 'alertes-prix.html';
        btn.setAttribute('aria-label', 'Créer une alerte prix immobilier');
        btn.setAttribute('title', '🔔 Alertes immobilières');
        btn.innerHTML = `
            <span class="alertes-icon">🔔</span>
            <span class="alertes-badge">1</span>
        `;
        
        // Créer le tooltip
        const tooltip = document.createElement('div');
        tooltip.id = 'alertes-prix-tooltip';
        tooltip.innerHTML = `
            <span class="tooltip-text">🔔 Créer une alerte prix</span>
            <span class="tooltip-arrow"></span>
        `;
        
        // Assembler
        container.appendChild(btn);
        container.appendChild(tooltip);
        document.body.appendChild(container);
        
        // Ajouter les styles
        addStyles();
        
        // Event listeners
        setupEventListeners(btn, tooltip);
    }

    /**
     * Ajoute les styles CSS du bouton
     */
    function addStyles() {
        // Vérifier si les styles existent déjà
        if (document.getElementById('alertes-prix-styles')) {
            return;
        }

        const styles = document.createElement('style');
        styles.id = 'alertes-prix-styles';
        styles.textContent = `
            /* ========================================
               BOUTON ALERTES PRIX FLOTTANT
               ======================================== */
            
            #alertes-prix-container {
                position: fixed;
                bottom: 30px;
                left: 30px;
                z-index: 9999;
                display: flex;
                align-items: center;
                gap: 15px;
            }
            
            /* Bouton principal */
            #alertes-prix-btn {
                position: relative;
                width: 60px;
                height: 60px;
                background: linear-gradient(135deg, #D4AF37 0%, #F4E4BC 50%, #D4AF37 100%);
                background-size: 200% 200%;
                border: 3px solid #ffffff;
                border-radius: 50%;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                text-decoration: none;
                box-shadow: 0 4px 15px rgba(212, 175, 55, 0.4);
                animation: 
                    pulse-gold 2s infinite,
                    shimmer 3s linear infinite;
                transition: all 0.3s ease;
            }
            
            /* Icône cloche */
            #alertes-prix-btn .alertes-icon {
                font-size: 24px;
                line-height: 1;
                filter: drop-shadow(0 1px 2px rgba(0,0,0,0.2));
                animation: bell-ring 2s ease-in-out infinite;
            }
            
            /* Badge de notification */
            #alertes-prix-btn .alertes-badge {
                position: absolute;
                top: -5px;
                right: -5px;
                width: 22px;
                height: 22px;
                background: #e74c3c;
                color: #ffffff;
                font-size: 12px;
                font-weight: 700;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                border: 2px solid #ffffff;
                box-shadow: 0 2px 8px rgba(231, 76, 60, 0.4);
                animation: bounce 1s infinite;
            }
            
            /* Tooltip */
            #alertes-prix-tooltip {
                position: absolute;
                left: 75px;
                background: rgba(26, 26, 26, 0.95);
                color: #ffffff;
                padding: 10px 16px;
                border-radius: 8px;
                font-size: 14px;
                font-weight: 500;
                white-space: nowrap;
                opacity: 0;
                visibility: hidden;
                transform: translateX(-10px);
                transition: all 0.3s ease;
                box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            }
            
            #alertes-prix-tooltip .tooltip-text {
                display: block;
            }
            
            #alertes-prix-tooltip .tooltip-arrow {
                position: absolute;
                left: -6px;
                top: 50%;
                transform: translateY(-50%);
                width: 0;
                height: 0;
                border-top: 6px solid transparent;
                border-bottom: 6px solid transparent;
                border-right: 6px solid rgba(26, 26, 26, 0.95);
            }
            
            /* Hover effects */
            #alertes-prix-container:hover #alertes-prix-btn {
                animation: none;
                filter: brightness(1.15);
                transform: scale(1.1);
                box-shadow: 0 0 30px rgba(212, 175, 55, 0.8);
            }
            
            #alertes-prix-container:hover #alertes-prix-tooltip {
                opacity: 1;
                visibility: visible;
                transform: translateX(0);
            }
            
            #alertes-prix-container:hover .alertes-badge {
                animation: none;
                transform: scale(1.1);
            }
            
            /* Animations */
            @keyframes pulse-gold {
                0% {
                    box-shadow: 0 0 0 0 rgba(212, 175, 55, 0.7);
                    transform: scale(1);
                }
                70% {
                    box-shadow: 0 0 0 20px rgba(212, 175, 55, 0);
                    transform: scale(1.02);
                }
                100% {
                    box-shadow: 0 0 0 0 rgba(212, 175, 55, 0);
                    transform: scale(1);
                }
            }
            
            @keyframes shimmer {
                0% {
                    background-position: 0% 50%;
                }
                50% {
                    background-position: 100% 50%;
                }
                100% {
                    background-position: 0% 50%;
                }
            }
            
            @keyframes bell-ring {
                0%, 100% {
                    transform: rotate(0deg);
                }
                5%, 15%, 25% {
                    transform: rotate(8deg);
                }
                10%, 20% {
                    transform: rotate(-8deg);
                }
                30% {
                    transform: rotate(0deg);
                }
            }
            
            @keyframes bounce {
                0%, 100% {
                    transform: translateY(0);
                }
                50% {
                    transform: translateY(-5px);
                }
            }
            
            /* Animation d'entrée au chargement */
            @keyframes slide-in-left {
                0% {
                    opacity: 0;
                    transform: translateX(-100px);
                }
                100% {
                    opacity: 1;
                    transform: translateX(0);
                }
            }
            
            #alertes-prix-btn {
                animation: 
                    slide-in-left 0.6s ease-out,
                    pulse-gold 2s infinite 0.6s,
                    shimmer 3s linear infinite;
            }
            
            /* Responsive mobile */
            @media (max-width: 768px) {
                #alertes-prix-container {
                    bottom: 20px;
                    left: 20px;
                }
                
                #alertes-prix-btn {
                    width: 50px;
                    height: 50px;
                }
                
                #alertes-prix-btn .alertes-icon {
                    font-size: 20px;
                }
                
                #alertes-prix-btn .alertes-badge {
                    width: 20px;
                    height: 20px;
                    font-size: 11px;
                    top: -4px;
                    right: -4px;
                }
                
                #alertes-prix-tooltip {
                    display: none;
                }
            }
            
            /* Masquer sur la page alertes-prix.html */
            body.page-alertes-prix #alertes-prix-container,
            body.page-alertes #alertes-prix-container {
                display: none !important;
            }
        `;
        
        document.head.appendChild(styles);
    }

    /**
     * Configure les événements du bouton
     */
    function setupEventListeners(btn, tooltip) {
        // Animation au clic
        btn.addEventListener('click', function(e) {
            // Effet de ripple
            const ripple = document.createElement('span');
            ripple.style.cssText = `
                position: absolute;
                width: 20px;
                height: 20px;
                background: rgba(255,255,255,0.6);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple-effect 0.6s ease-out;
                pointer-events: none;
            `;
            
            const rect = btn.getBoundingClientRect();
            ripple.style.left = '50%';
            ripple.style.top = '50%';
            ripple.style.marginLeft = '-10px';
            ripple.style.marginTop = '-10px';
            
            btn.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
        });
        
        // Ajouter l'animation ripple au style
        const rippleStyle = document.createElement('style');
        rippleStyle.textContent = `
            @keyframes ripple-effect {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(rippleStyle);
    }

    /**
     * Détecte si on est sur la page alertes-prix
     */
    function checkPage() {
        const path = window.location.pathname;
        if (path.includes('alertes-prix') || path.includes('alertes')) {
            document.body.classList.add('page-alertes-prix');
        }
    }

    /**
     * Initialise le bouton
     */
    function init() {
        checkPage();
        
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', createAlertesButton);
        } else {
            createAlertesButton();
        }
    }

    // Démarrer
    init();

})();
