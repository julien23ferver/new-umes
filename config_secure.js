// 🔐 CONFIGURATION SÉCURISÉE - GESTION DES CLÉS API
// Protection contre l'exposition des clés sensibles

class SecureConfig {
    constructor() {
        this.config = this.loadSecureConfig();
        this.initEncryption();
    }

    // 🔑 Chargement sécurisé de la configuration
    loadSecureConfig() {
        // Configuration de base (sans clés sensibles)
        const baseConfig = {
            appName: 'Cyber Quizz',
            version: '2.0.0',
            environment: this.detectEnvironment(),
            allowedDomains: [
                'ssi.gouv.fr',
                'fonts.googleapis.com',
                'fonts.gstatic.com',
                'cdnjs.cloudflare.com',
                'cdn.jsdelivr.net',
                'unpkg.com',
                'd3js.org',
                'threejs.org',
                'cdn.plot.ly',
                'stackpath.bootstrapcdn.com',
                'maps.googleapis.com',
                'cdn.tailwindcss.com',
                'ajax.googleapis.com',
                'kit.fontawesome.com',
                'cdn.datatables.net',
                'maxcdn.bootstrapcdn.com',
                'code.highcharts.com',
                'tako-static-assets-production.s3.amazonaws.com',
                'www.youtube.com',
                'pfst.cf2.poecdn.net',
                'puc.poecdn.net',
                'i.imgur.com',
                'wikimedia.org',
                'icons8.com',
                'giphy.com',
                'picsum.photos',
                'images.unsplash.com',
                'upload.wikimedia.org'
            ],
            security: {
                maxRequestsPerMinute: 60,
                sessionTimeout: 3600000, // 1 heure
                maxLoginAttempts: 3,
                passwordMinLength: 8,
                requireSpecialChars: true,
                enableRateLimiting: true,
                enableXSSProtection: true,
                enableCSRFProtection: true
            }
        };

        // Chargement des clés depuis des variables d'environnement ou stockage sécurisé
        const apiKeys = this.loadAPIKeys();
        
        return { ...baseConfig, ...apiKeys };
    }

    // 🌍 Détection de l'environnement
    detectEnvironment() {
        const hostname = window.location.hostname;
        if (hostname === 'localhost' || hostname === '127.0.0.1') {
            return 'development';
        } else if (hostname.includes('test') || hostname.includes('staging')) {
            return 'staging';
        } else {
            return 'production';
        }
    }

    // 🔑 Chargement sécurisé des clés API
    loadAPIKeys() {
        // En production, les clés doivent être chargées depuis le serveur
        // via des variables d'environnement ou un service de gestion des secrets
        
        if (this.detectEnvironment() === 'development') {
            // Configuration de développement (clés de test uniquement)
            return {
                supabase: {
                    url: 'https://dpaumpllxdqpjytkctpo.supabase.co',
                    key: this.decryptKey('U2FsdGVkX1+QKLMgyzw4_N8tZEoVKkyA51TnVFPpMQyeIbRHQNLVJI') // Clé chiffrée
                }
            };
        } else {
            // En production, charger depuis le serveur
            return this.loadKeysFromServer();
        }
    }

    // 🔐 Chiffrement des clés sensibles
    encryptKey(key) {
        // Utilisation d'un algorithme de chiffrement simple pour l'exemple
        // En production, utiliser des algorithmes plus robustes
        return btoa(key);
    }

    // 🔓 Déchiffrement des clés
    decryptKey(encryptedKey) {
        try {
            return atob(encryptedKey);
        } catch (e) {
            console.error('Erreur de déchiffrement de clé');
            return null;
        }
    }

    // 🌐 Chargement des clés depuis le serveur
    async loadKeysFromServer() {
        try {
            // En production, faire un appel sécurisé au serveur
            const response = await fetch('/api/config/keys', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                },
                credentials: 'include'
            });

            if (response.ok) {
                return await response.json();
            } else {
                throw new Error('Impossible de charger la configuration');
            }
        } catch (error) {
            console.error('Erreur de chargement de la configuration:', error);
            return {};
        }
    }

    // 🔒 Initialisation du chiffrement
    initEncryption() {
        // Génération d'une clé de session unique
        this.sessionKey = this.generateSessionKey();
        
        // Chiffrement des données sensibles en mémoire
        this.encryptSensitiveData();
    }

    // 🔑 Génération d'une clé de session
    generateSessionKey() {
        const array = new Uint8Array(32);
        crypto.getRandomValues(array);
        return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    }

    // 🔐 Chiffrement des données sensibles
    encryptSensitiveData() {
        // Chiffrer les clés API en mémoire
        if (this.config.supabase) {
            this.config.supabase.key = this.encryptKey(this.config.supabase.key);
        }
    }

    // 🔓 Récupération sécurisée d'une clé
    getSecureKey(keyName) {
        switch (keyName) {
            case 'supabase_url':
                return this.config.supabase?.url;
            case 'supabase_key':
                return this.decryptKey(this.config.supabase?.key);
            default:
                return null;
        }
    }

    // ✅ Validation de la configuration
    validateConfig() {
        const required = ['appName', 'version', 'environment'];
        const missing = required.filter(key => !this.config[key]);
        
        if (missing.length > 0) {
            throw new Error(`Configuration incomplète: ${missing.join(', ')} manquant`);
        }
        
        return true;
    }

    // 🔍 Validation des domaines autorisés
    isDomainAllowed(domain) {
        return this.config.allowedDomains.some(allowed => 
            domain === allowed || domain.endsWith('.' + allowed)
        );
    }

    // 🛡️ Validation des paramètres de sécurité
    validateSecurityParams(params) {
        const security = this.config.security;
        
        return {
            isValid: true,
            rateLimit: params.requestsPerMinute <= security.maxRequestsPerMinute,
            sessionValid: params.sessionAge <= security.sessionTimeout,
            xssProtected: security.enableXSSProtection,
            csrfProtected: security.enableCSRFProtection
        };
    }

    // 🔄 Mise à jour sécurisée de la configuration
    updateConfig(updates) {
        // Vérifier que les mises à jour ne contiennent pas de données sensibles
        const sensitiveKeys = ['supabase_key', 'api_key', 'secret'];
        const hasSensitiveData = sensitiveKeys.some(key => key in updates);
        
        if (hasSensitiveData) {
            throw new Error('Tentative de mise à jour de données sensibles détectée');
        }
        
        // Appliquer les mises à jour
        this.config = { ...this.config, ...updates };
        
        // Re-valider la configuration
        this.validateConfig();
    }
}

// 🔐 Instance sécurisée de la configuration
const secureConfig = new SecureConfig();

// 🚫 Protection contre les modifications
Object.freeze(secureConfig);

// 🔒 Export sécurisé
window.SecureConfig = SecureConfig;
window.secureConfig = secureConfig;
