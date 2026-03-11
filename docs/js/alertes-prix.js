/**
 * Système d'Alertes Prix - Beaulieu Property
 * Gestion des alertes email pour les nouveaux biens immobiliers
 * Version: 1.0.0
 */

(function() {
    'use strict';

    // Configuration
    const CONFIG = {
        storageKey: 'beaulieu_price_alerts',
        adminEmail: 'alertes@beaulieu-pattaya.com',
        maxAlertsPerEmail: 5,
        cookieExpiry: 365
    };

    // État des sélections visuelles
    function initVisualSelections() {
        // Type de bien
        document.querySelectorAll('.checkbox-item').forEach(item => {
            const checkbox = item.querySelector('input[type="checkbox"]');
            if (checkbox) {
                // État initial
                if (checkbox.checked) {
                    item.classList.add('selected');
                }
                
                // Changement
                checkbox.addEventListener('change', () => {
                    item.classList.toggle('selected', checkbox.checked);
                });
                
                // Clic sur le label
                item.addEventListener('click', (e) => {
                    if (e.target !== checkbox) {
                        checkbox.checked = !checkbox.checked;
                        item.classList.toggle('selected', checkbox.checked);
                    }
                });
            }
        });

        // Localisations
        document.querySelectorAll('.location-item').forEach(item => {
            const checkbox = item.querySelector('input[type="checkbox"]');
            if (checkbox) {
                if (checkbox.checked) {
                    item.classList.add('selected');
                }
                
                checkbox.addEventListener('change', () => {
                    item.classList.toggle('selected', checkbox.checked);
                    
                    // Gérer "Toutes zones"
                    if (checkbox.value === 'all' && checkbox.checked) {
                        document.querySelectorAll('input[name="location"]').forEach(cb => {
                            if (cb.value !== 'all') {
                                cb.checked = false;
                                cb.closest('.location-item').classList.remove('selected');
                            }
                        });
                    } else if (checkbox.value !== 'all' && checkbox.checked) {
                        document.querySelectorAll('input[name="location"][value="all"]').forEach(cb => {
                            cb.checked = false;
                            cb.closest('.location-item').classList.remove('selected');
                        });
                    }
                });
                
                item.addEventListener('click', (e) => {
                    if (e.target !== checkbox) {
                        checkbox.checked = !checkbox.checked;
                        checkbox.dispatchEvent(new Event('change'));
                    }
                });
            }
        });
    }

    // Validation du formulaire
    function validateForm(formData) {
        const errors = [];
        
        if (!formData.get('firstName') || formData.get('firstName').trim().length < 2) {
            errors.push('Le prénom est obligatoire');
        }
        
        if (!formData.get('lastName') || formData.get('lastName').trim().length < 2) {
            errors.push('Le nom est obligatoire');
        }
        
        const email = formData.get('email');
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            errors.push('Veuillez entrer un email valide');
        }
        
        const propertyTypes = formData.getAll('propertyType');
        if (propertyTypes.length === 0) {
            errors.push('Veuillez sélectionner au moins un type de bien');
        }
        
        const locations = formData.getAll('location');
        if (locations.length === 0) {
            errors.push('Veuillez sélectionner au moins une zone');
        }
        
        if (!formData.get('consent')) {
            errors.push('Vous devez accepter les conditions pour créer une alerte');
        }
        
        return errors;
    }

    // Sauvegarder l'alerte
    function saveAlert(formData) {
        const alert = {
            id: generateId(),
            date: new Date().toISOString(),
            firstName: formData.get('firstName').trim(),
            lastName: formData.get('lastName').trim(),
            email: formData.get('email').trim().toLowerCase(),
            phone: formData.get('phone')?.trim() || '',
            propertyTypes: formData.getAll('propertyType'),
            minPrice: parseInt(formData.get('minPrice')) || 0,
            maxPrice: parseInt(formData.get('maxPrice')) || 999999999,
            locations: formData.getAll('location'),
            bedrooms: parseInt(formData.get('bedrooms')) || 0,
            features: formData.getAll('features'),
            comments: formData.get('comments')?.trim() || '',
            active: true,
            notificationsSent: 0
        };

        // Récupérer les alertes existantes
        let alerts = getStoredAlerts();
        
        // Vérifier le nombre d'alertes par email
        const userAlerts = alerts.filter(a => a.email === alert.email && a.active);
        if (userAlerts.length >= CONFIG.maxAlertsPerEmail) {
            return { 
                success: false, 
                error: `Vous avez atteint la limite de ${CONFIG.maxAlertsPerEmail} alertes actives. Supprimez une alerte existante pour en créer une nouvelle.` 
            };
        }

        // Ajouter la nouvelle alerte
        alerts.push(alert);
        localStorage.setItem(CONFIG.storageKey, JSON.stringify(alerts));
        
        // Sauvegarder aussi dans un cookie pour le suivi
        setCookie('beaulieu_alert_email', alert.email, CONFIG.cookieExpiry);
        
        return { success: true, alert: alert };
    }

    // Récupérer les alertes stockées
    function getStoredAlerts() {
        try {
            const stored = localStorage.getItem(CONFIG.storageKey);
            return stored ? JSON.parse(stored) : [];
        } catch (e) {
            return [];
        }
    }

    // Générer un ID unique
    function generateId() {
        return 'alert_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    // Cookie helper
    function setCookie(name, value, days) {
        const expires = new Date();
        expires.setDate(expires.getDate() + days);
        document.cookie = `${name}=${encodeURIComponent(value)};expires=${expires.toUTCString()};path=/;Secure;SameSite=Lax`;
    }

    // Simuler l'envoi au serveur (pour démo)
    function simulateServerSend(alert) {
        console.log('📧 Alerte à envoyer au serveur:', alert);
        
        // Dans une vraie implémentation, faire un fetch POST ici
        // fetch('/api/alerts', { method: 'POST', body: JSON.stringify(alert) })
        
        return new Promise(resolve => {
            setTimeout(() => resolve({ success: true }), 500);
        });
    }

    // Vérifier si un bien correspond à une alerte
    function checkPropertyMatch(property, alert) {
        // Vérifier le type
        if (!alert.propertyTypes.includes(property.type)) {
            return false;
        }
        
        // Vérifier le prix
        if (property.price < alert.minPrice || property.price > alert.maxPrice) {
            return false;
        }
        
        // Vérifier la localisation
        if (!alert.locations.includes('all') && !alert.locations.includes(property.location)) {
            return false;
        }
        
        // Vérifier les chambres
        if (property.bedrooms < alert.bedrooms) {
            return false;
        }
        
        // Vérifier les critères optionnels
        if (alert.features && alert.features.length > 0) {
            for (const feature of alert.features) {
                if (!property.features.includes(feature)) {
                    return false;
                }
            }
        }
        
        return true;
    }

    // Gestion du formulaire
    function handleFormSubmit(e) {
        e.preventDefault();
        
        const form = e.target;
        const formData = new FormData(form);
        const submitBtn = form.querySelector('.btn-submit');
        
        // Validation
        const errors = validateForm(formData);
        if (errors.length > 0) {
            alert('Erreurs dans le formulaire :\n\n' + errors.join('\n'));
            return;
        }
        
        // Désactiver le bouton
        submitBtn.disabled = true;
        submitBtn.textContent = 'Création en cours...';
        
        // Sauvegarder l'alerte
        const result = saveAlert(formData);
        
        if (!result.success) {
            alert(result.error);
            submitBtn.disabled = false;
            submitBtn.textContent = '🚀 Créer mon alerte gratuite';
            return;
        }
        
        // Envoyer au serveur
        simulateServerSend(result.alert).then(() => {
            // Afficher la confirmation
            showConfirmationModal();
            
            // Réinitialiser le formulaire
            form.reset();
            document.querySelectorAll('.checkbox-item, .location-item').forEach(item => {
                item.classList.remove('selected');
            });
            
            // Restaurer les valeurs par défaut
            document.querySelectorAll('input[name="propertyType"][value="condo"]').forEach(cb => {
                cb.checked = true;
                cb.closest('.checkbox-item').classList.add('selected');
            });
            document.querySelectorAll('input[name="location"]').forEach(cb => {
                if (cb.value === 'central-pattaya' || cb.value === 'jomtien') {
                    cb.checked = true;
                    cb.closest('.location-item').classList.add('selected');
                }
            });
            
            // Réactiver le bouton
            submitBtn.disabled = false;
            submitBtn.textContent = '🚀 Créer mon alerte gratuite';
        });
    }

    // Afficher le modal de confirmation
    function showConfirmationModal() {
        const modal = document.getElementById('confirmationModal');
        if (modal) {
            modal.classList.add('active');
        }
    }

    // Fermer le modal
    window.closeModal = function() {
        const modal = document.getElementById('confirmationModal');
        if (modal) {
            modal.classList.remove('active');
        }
    };

    // Gestion du prix max affiché
    function updatePriceDisplay() {
        const minPrice = document.getElementById('minPrice');
        const maxPrice = document.getElementById('maxPrice');
        
        if (minPrice && maxPrice) {
            minPrice.addEventListener('change', () => {
                const min = parseInt(minPrice.value);
                const max = parseInt(maxPrice.value);
                
                if (min >= max && max !== 999999999) {
                    // Ajuster le max
                    const options = maxPrice.querySelectorAll('option');
                    for (const option of options) {
                        if (parseInt(option.value) > min) {
                            maxPrice.value = option.value;
                            break;
                        }
                    }
                }
            });
        }
    }

    // API publique pour vérifier les correspondances (utilisable par l'admin)
    window.AlertSystem = {
        getAllAlerts: getStoredAlerts,
        getAlertsByEmail: function(email) {
            return getStoredAlerts().filter(a => a.email === email.toLowerCase());
        },
        deleteAlert: function(alertId) {
            let alerts = getStoredAlerts();
            alerts = alerts.filter(a => a.id !== alertId);
            localStorage.setItem(CONFIG.storageKey, JSON.stringify(alerts));
            return true;
        },
        checkMatch: checkPropertyMatch,
        
        // Pour tester : simuler un nouveau bien
        testNewProperty: function(property) {
            const alerts = getStoredAlerts().filter(a => a.active);
            const matches = [];
            
            for (const alert of alerts) {
                if (checkPropertyMatch(property, alert)) {
                    matches.push(alert);
                    alert.notificationsSent++;
                }
            }
            
            // Sauvegarder les compteurs mis à jour
            localStorage.setItem(CONFIG.storageKey, JSON.stringify(alerts));
            
            console.log(`📧 ${matches.length} alertes correspondantes trouvées:`, matches);
            return matches;
        }
    };

    // Initialisation
    document.addEventListener('DOMContentLoaded', () => {
        const form = document.getElementById('alerts-form');
        if (form) {
            initVisualSelections();
            updatePriceDisplay();
            form.addEventListener('submit', handleFormSubmit);
        }
        
        // Fermer le modal au clic sur l'overlay
        const modal = document.getElementById('confirmationModal');
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    closeModal();
                }
            });
        }
        
        console.log('🔔 Système d\'alertes prix initialisé');
    });

})();
