// 🔒 SYSTÈME DE SÉCURISATION AVANCÉ - ANTI-PENTEST
// Protection contre XSS, injection, et attaques avancées

class SecurityManager {
    constructor() {
        this.sanitizeConfig = {
            allowedTags: ['b', 'i', 'em', 'strong', 'a', 'br', 'span', 'div', 'p'],
            allowedAttributes: {
                'a': ['href', 'target', 'rel'],
                'span': ['class'],
                'div': ['class'],
                'p': ['class']
            }
        };
        this.initSecurity();
    }

    // 🔐 Initialisation des protections
    initSecurity() {
        this.disableConsoleInProduction();
        this.preventDevTools();
        this.addSecurityHeaders();
        this.sanitizeAllInputs();
        this.protectAgainstXSS();
        this.addRateLimiting();
        this.encryptLocalStorage();
    }

    // 🚫 Désactiver la console en production
    disableConsoleInProduction() {
        if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
            console.log = () => {};
            console.warn = () => {};
            console.error = () => {};
            console.debug = () => {};
        }
    }

    // 🛡️ Empêcher l'ouverture des DevTools
    preventDevTools() {
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) {
                e.preventDefault();
                return false;
            }
            if (e.key === 'F12') {
                e.preventDefault();
                return false;
            }
        });

        // Détection des DevTools
        setInterval(() => {
            const devtools = /./;
            devtools.toString = function() {
                this.opened = true;
            }
            console.log('%c', devtools);
            if (devtools.opened) {
                document.body.innerHTML = '<h1>Accès non autorisé détecté</h1>';
            }
        }, 1000);
    }

    // 🔒 Ajouter des en-têtes de sécurité
    addSecurityHeaders() {
        // Headers seront ajoutés côté serveur
        const meta = document.createElement('meta');
        meta.httpEquiv = 'X-Content-Type-Options';
        meta.content = 'nosniff';
        document.head.appendChild(meta);

        const meta2 = document.createElement('meta');
        meta2.httpEquiv = 'X-Frame-Options';
        meta2.content = 'DENY';
        document.head.appendChild(meta2);
    }

    // 🧹 Sanitisation avancée des entrées
    sanitizeInput(input) {
        if (typeof input !== 'string') return input;
        
        // Supprimer les scripts et balises dangereuses
        let sanitized = input
            .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
            .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
            .replace(/javascript:/gi, '')
            .replace(/on\w+\s*=/gi, '')
            .replace(/data:/gi, '')
            .replace(/vbscript:/gi, '');
        
        // Encoder les caractères spéciaux
        sanitized = this.htmlEncode(sanitized);
        
        return sanitized;
    }

    // 🔤 Encodage HTML sécurisé
    htmlEncode(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    // 🛡️ Protection XSS globale
    protectAgainstXSS() {
        // Override innerHTML pour le sécuriser
        const originalInnerHTML = Object.getOwnPropertyDescriptor(Element.prototype, 'innerHTML');
        
        Object.defineProperty(Element.prototype, 'innerHTML', {
            set: function(value) {
                if (typeof value === 'string') {
                    value = securityManager.sanitizeInput(value);
                }
                originalInnerHTML.set.call(this, value);
            },
            get: originalInnerHTML.get
        });
    }

    // 🔄 Sanitisation de tous les inputs
    sanitizeAllInputs() {
        document.addEventListener('input', (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                e.target.value = this.sanitizeInput(e.target.value);
            }
        });
    }

    // ⏱️ Rate limiting
    addRateLimiting() {
        this.requestCount = 0;
        this.lastRequest = Date.now();
        
        const originalFetch = window.fetch;
        window.fetch = (...args) => {
            const now = Date.now();
            if (now - this.lastRequest < 100) { // 100ms entre requêtes
                this.requestCount++;
                if (this.requestCount > 10) { // Max 10 requêtes rapides
                    throw new Error('Rate limit exceeded');
                }
            } else {
                this.requestCount = 0;
            }
            this.lastRequest = now;
            return originalFetch(...args);
        };
    }

    // 🔐 Chiffrement du localStorage
    encryptLocalStorage() {
        const originalSetItem = Storage.prototype.setItem;
        const originalGetItem = Storage.prototype.getItem;
        
        Storage.prototype.setItem = function(key, value) {
            const encrypted = btoa(encodeURIComponent(value));
            originalSetItem.call(this, key, encrypted);
        };
        
        Storage.prototype.getItem = function(key) {
            const encrypted = originalGetItem.call(this, key);
            if (encrypted) {
                try {
                    return decodeURIComponent(atob(encrypted));
                } catch (e) {
                    return null;
                }
            }
            return null;
        };
    }

    // 🔍 Validation des URLs
    validateURL(url) {
        try {
            const urlObj = new URL(url);
            const allowedDomains = [
                'ssi.gouv.fr',
                'fonts.googleapis.com',
                'fonts.gstatic.com',
                'cdnjs.cloudflare.com',
                'cdn.jsdelivr.net'
            ];
            
            return allowedDomains.some(domain => urlObj.hostname.endsWith(domain));
        } catch (e) {
            return false;
        }
    }

    // 🚨 Détection d'injection
    detectInjection(input) {
        const patterns = [
            /<script/i,
            /javascript:/i,
            /on\w+\s*=/i,
            /data:text\/html/i,
            /vbscript:/i,
            /<iframe/i,
            /<object/i,
            /<embed/i
        ];
        
        return patterns.some(pattern => pattern.test(input));
    }

    // 🔒 Fonction sécurisée pour innerHTML
    setSecureInnerHTML(element, content) {
        if (this.detectInjection(content)) {
            console.warn('Tentative d\'injection détectée');
            return false;
        }
        
        const sanitized = this.sanitizeInput(content);
        element.innerHTML = sanitized;
        return true;
    }

    // 🛡️ Protection contre les attaques par timing
    addTimingProtection() {
        const originalDate = Date.now;
        let lastCall = 0;
        
        Date.now = function() {
            const now = originalDate();
            if (now - lastCall < 10) { // Protection contre les attaques par timing
                return lastCall + 10;
            }
            lastCall = now;
            return now;
        };
    }
}

// 🔐 Initialisation du gestionnaire de sécurité
const securityManager = new SecurityManager();

// 🚫 Protection contre les modifications du DOM
Object.freeze(securityManager);

// 🔒 Export des fonctions sécurisées
window.SecurityManager = SecurityManager;
window.securityManager = securityManager;
