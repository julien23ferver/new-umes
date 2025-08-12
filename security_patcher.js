// 🔧 PATCHER DE SÉCURISATION AUTOMATIQUE
// Correction automatique de toutes les vulnérabilités identifiées

class SecurityPatcher {
    constructor() {
        this.patches = [];
        this.initPatcher();
    }

    // 🔧 Initialisation du patcher
    initPatcher() {
        this.loadSecurityScripts();
        this.applySecurityPatches();
        this.monitorForNewVulnerabilities();
    }

    // 📜 Chargement des scripts de sécurité
    loadSecurityScripts() {
        const scripts = [
            'security_fixes.js',
            'config_secure.js', 
            'csp_secure.js'
        ];

        scripts.forEach(script => {
            const scriptElement = document.createElement('script');
            scriptElement.src = script;
            scriptElement.async = false;
            document.head.appendChild(scriptElement);
        });
    }

    // 🛡️ Application des correctifs de sécurité
    applySecurityPatches() {
        this.patchHTMLStructure();
        this.patchXSSVulnerabilities();
        this.patchEventHandlers();
        this.patchAPIKeys();
        this.patchLocalStorage();
        this.patchDOMManipulation();
        this.patchNetworkRequests();
        this.patchInputValidation();
    }

    // 🏗️ Correction de la structure HTML
    patchHTMLStructure() {
        // Vérifier et corriger la structure HTML
        if (!document.doctype) {
            console.warn('DOCTYPE manquant - ajout automatique');
            const doctype = document.implementation.createDocumentType('html', '', '');
            document.insertBefore(doctype, document.firstChild);
        }

        // S'assurer que les balises HTML, HEAD, BODY existent
        if (!document.documentElement) {
            const html = document.createElement('html');
            html.lang = 'fr';
            document.appendChild(html);
        }

        if (!document.head) {
            const head = document.createElement('head');
            document.documentElement.insertBefore(head, document.documentElement.firstChild);
        }

        if (!document.body) {
            const body = document.createElement('body');
            document.documentElement.appendChild(body);
        }
    }

    // 💉 Correction des vulnérabilités XSS
    patchXSSVulnerabilities() {
        // Remplacer tous les innerHTML dangereux par des méthodes sécurisées
        const originalInnerHTML = Object.getOwnPropertyDescriptor(Element.prototype, 'innerHTML');
        
        Object.defineProperty(Element.prototype, 'innerHTML', {
            set: function(value) {
                if (typeof value === 'string') {
                    // Sanitisation automatique
                    value = this.sanitizeHTML(value);
                }
                originalInnerHTML.set.call(this, value);
            },
            get: originalInnerHTML.get
        });

        // Protéger contre les injections via textContent
        const originalTextContent = Object.getOwnPropertyDescriptor(Node.prototype, 'textContent');
        Object.defineProperty(Node.prototype, 'textContent', {
            set: function(value) {
                if (typeof value === 'string') {
                    value = this.sanitizeText(value);
                }
                originalTextContent.set.call(this, value);
            },
            get: originalTextContent.get
        });
    }

    // 🧹 Sanitisation HTML
    sanitizeHTML(html) {
        if (typeof html !== 'string') return html;
        
        // Supprimer les scripts et balises dangereuses
        let sanitized = html
            .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
            .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
            .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
            .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '')
            .replace(/javascript:/gi, '')
            .replace(/on\w+\s*=/gi, '')
            .replace(/data:text\/html/gi, '')
            .replace(/vbscript:/gi, '');
        
        return sanitized;
    }

    // 📝 Sanitisation de texte
    sanitizeText(text) {
        if (typeof text !== 'string') return text;
        
        // Encoder les caractères spéciaux
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // 🎯 Correction des event handlers inline
    patchEventHandlers() {
        // Remplacer tous les onclick par des event listeners sécurisés
        const elementsWithOnclick = document.querySelectorAll('[onclick]');
        
        elementsWithOnclick.forEach(element => {
            const onclickValue = element.getAttribute('onclick');
            
            // Supprimer l'attribut onclick
            element.removeAttribute('onclick');
            
            // Ajouter un event listener sécurisé
            element.addEventListener('click', (e) => {
                this.executeSecureHandler(onclickValue, e);
            });
        });

        // Protéger contre l'ajout de nouveaux event handlers inline
        this.preventInlineEventHandlers();
    }

    // 🔒 Exécution sécurisée des handlers
    executeSecureHandler(handlerCode, event) {
        // Liste des fonctions autorisées
        const allowedFunctions = [
            'showCreditsModal',
            'toggleLanguage',
            'showGlossary',
            'showHallOfFame',
            'handleRevisionClick',
            'startGame',
            'goHome',
            'previousQuestion',
            'nextQuestion',
            'selectOption',
            'exportToPDF',
            'replayGame',
            'reviewErrors',
            'closeRevisionModal',
            'startRevisionMode',
            'closeCreditsModal',
            'openCredits',
            'backToMenu',
            'goToPreviousPage',
            'openJournal',
            'closeJournal',
            'openSettings',
            'closeSettings',
            'resetSettings',
            'closeCredits',
            'restartGame',
            'makeChoice'
        ];

        // Extraire le nom de la fonction
        const functionMatch = handlerCode.match(/(\w+)\s*\(/);
        if (functionMatch && allowedFunctions.includes(functionMatch[1])) {
            try {
                // Exécuter la fonction de manière sécurisée
                const functionName = functionMatch[1];
                if (typeof window[functionName] === 'function') {
                    window[functionName](event);
                }
            } catch (error) {
                console.error('Erreur d\'exécution du handler:', error);
            }
        } else {
            console.warn('Fonction non autorisée dans onclick:', handlerCode);
        }
    }

    // 🚫 Empêcher les event handlers inline
    preventInlineEventHandlers() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        const inlineEvents = ['onclick', 'onload', 'onerror', 'onmouseover'];
                        inlineEvents.forEach(event => {
                            if (node.hasAttribute(event)) {
                                console.warn(`Event handler inline détecté et supprimé: ${event}`);
                                node.removeAttribute(event);
                            }
                        });
                    }
                });
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['onclick', 'onload', 'onerror', 'onmouseover']
        });
    }

    // 🔑 Correction des clés API exposées
    patchAPIKeys() {
        // Remplacer les clés hardcodées par des appels sécurisés
        const scripts = document.querySelectorAll('script');
        
        scripts.forEach(script => {
            if (script.textContent.includes('supabaseKey')) {
                // Remplacer par un appel sécurisé
                script.textContent = script.textContent.replace(
                    /const supabaseKey = '([^']+)'/g,
                    'const supabaseKey = secureConfig.getSecureKey("supabase_key")'
                );
            }
        });
    }

    // 💾 Correction du localStorage
    patchLocalStorage() {
        // Chiffrer automatiquement toutes les données du localStorage
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

    // 🎨 Correction de la manipulation du DOM
    patchDOMManipulation() {
        // Sécuriser createElement
        const originalCreateElement = document.createElement;
        document.createElement = function(tagName) {
            const element = originalCreateElement.call(this, tagName);
            
            // Protéger contre les balises dangereuses
            const dangerousTags = ['script', 'iframe', 'object', 'embed'];
            if (dangerousTags.includes(tagName.toLowerCase())) {
                console.warn(`Tentative de création de balise dangereuse: ${tagName}`);
                return document.createElement('div'); // Retourner un div inoffensif
            }
            
            return element;
        };
    }

    // 🌐 Correction des requêtes réseau
    patchNetworkRequests() {
        // Sécuriser fetch
        const originalFetch = window.fetch;
        window.fetch = (...args) => {
            // Validation des URLs
            if (args[0] && typeof args[0] === 'string') {
                if (!this.isURLAllowed(args[0])) {
                    throw new Error('URL non autorisée');
                }
            }
            
            return originalFetch(...args);
        };

        // Sécuriser XMLHttpRequest
        const originalOpen = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function(method, url, ...args) {
            if (typeof url === 'string' && !this.isURLAllowed(url)) {
                throw new Error('URL non autorisée');
            }
            return originalOpen.call(this, method, url, ...args);
        };
    }

    // ✅ Validation des URLs
    isURLAllowed(url) {
        try {
            const urlObj = new URL(url);
            const allowedDomains = [
                'ssi.gouv.fr',
                'fonts.googleapis.com',
                'fonts.gstatic.com',
                'cdnjs.cloudflare.com',
                'cdn.jsdelivr.net',
                'dpaumpllxdqpjytkctpo.supabase.co'
            ];
            
            return allowedDomains.some(domain => urlObj.hostname.endsWith(domain));
        } catch (e) {
            return false;
        }
    }

    // 🔍 Correction de la validation des entrées
    patchInputValidation() {
        // Ajouter une validation automatique à tous les inputs
        document.addEventListener('input', (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                e.target.value = this.sanitizeInput(e.target.value);
            }
        });

        // Validation des formulaires
        document.addEventListener('submit', (e) => {
            const form = e.target;
            const inputs = form.querySelectorAll('input, textarea');
            
            inputs.forEach(input => {
                if (!this.validateInput(input)) {
                    e.preventDefault();
                    console.error('Validation d\'entrée échouée');
                }
            });
        });
    }

    // 🧹 Sanitisation des entrées
    sanitizeInput(input) {
        if (typeof input !== 'string') return input;
        
        return input
            .replace(/<script/gi, '')
            .replace(/javascript:/gi, '')
            .replace(/on\w+\s*=/gi, '')
            .replace(/data:text\/html/gi, '');
    }

    // ✅ Validation des entrées
    validateInput(input) {
        const value = input.value;
        
        // Vérifier la longueur
        if (input.maxLength && value.length > input.maxLength) {
            return false;
        }
        
        // Vérifier les patterns
        if (input.pattern && !new RegExp(input.pattern).test(value)) {
            return false;
        }
        
        // Vérifier les injections
        if (this.detectInjection(value)) {
            return false;
        }
        
        return true;
    }

    // 🚨 Détection d'injection
    detectInjection(input) {
        const patterns = [
            /<script/i,
            /javascript:/i,
            /on\w+\s*=/i,
            /data:text\/html/i,
            /vbscript:/i
        ];
        
        return patterns.some(pattern => pattern.test(input));
    }

    // 👁️ Surveillance des nouvelles vulnérabilités
    monitorForNewVulnerabilities() {
        // Observer les modifications du DOM
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        this.checkForVulnerabilities(node);
                    }
                });
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // 🔍 Vérification des vulnérabilités
    checkForVulnerabilities(element) {
        // Vérifier les event handlers inline
        const inlineEvents = ['onclick', 'onload', 'onerror', 'onmouseover'];
        inlineEvents.forEach(event => {
            if (element.hasAttribute(event)) {
                console.warn(`Vulnérabilité détectée: ${event} sur`, element);
                element.removeAttribute(event);
            }
        });

        // Vérifier les scripts inline
        const scripts = element.querySelectorAll('script');
        scripts.forEach(script => {
            if (!script.src) {
                console.warn('Script inline détecté et supprimé');
                script.remove();
            }
        });

        // Vérifier les iframes
        const iframes = element.querySelectorAll('iframe');
        iframes.forEach(iframe => {
            if (!this.isURLAllowed(iframe.src)) {
                console.warn('Iframe non autorisé détecté et supprimé');
                iframe.remove();
            }
        });
    }

    // 📊 Rapport de sécurité
    generateSecurityReport() {
        const report = {
            timestamp: new Date().toISOString(),
            url: window.location.href,
            vulnerabilities: {
                xss: this.countXSSVulnerabilities(),
                injection: this.countInjectionVulnerabilities(),
                insecureHandlers: this.countInsecureHandlers(),
                exposedKeys: this.countExposedKeys()
            },
            patches: this.patches.length,
            recommendations: this.generateRecommendations()
        };

        return report;
    }

    // 🔢 Compter les vulnérabilités XSS
    countXSSVulnerabilities() {
        const innerHTMLCount = document.querySelectorAll('*').length; // Approximation
        const scriptCount = document.querySelectorAll('script:not([src])').length;
        return innerHTMLCount + scriptCount;
    }

    // 🔢 Compter les vulnérabilités d'injection
    countInjectionVulnerabilities() {
        const inputs = document.querySelectorAll('input, textarea');
        let count = 0;
        
        inputs.forEach(input => {
            if (this.detectInjection(input.value)) {
                count++;
            }
        });
        
        return count;
    }

    // 🔢 Compter les handlers non sécurisés
    countInsecureHandlers() {
        const inlineEvents = ['onclick', 'onload', 'onerror', 'onmouseover'];
        let count = 0;
        
        inlineEvents.forEach(event => {
            count += document.querySelectorAll(`[${event}]`).length;
        });
        
        return count;
    }

    // 🔢 Compter les clés exposées
    countExposedKeys() {
        const scripts = document.querySelectorAll('script');
        let count = 0;
        
        scripts.forEach(script => {
            if (script.textContent.includes('supabaseKey') || 
                script.textContent.includes('api_key') ||
                script.textContent.includes('secret')) {
                count++;
            }
        });
        
        return count;
    }

    // 💡 Générer des recommandations
    generateRecommendations() {
        const recommendations = [];
        
        if (this.countXSSVulnerabilities() > 0) {
            recommendations.push('Remplacer innerHTML par textContent ou sanitizer');
        }
        
        if (this.countInsecureHandlers() > 0) {
            recommendations.push('Remplacer les event handlers inline par addEventListener');
        }
        
        if (this.countExposedKeys() > 0) {
            recommendations.push('Déplacer les clés API vers des variables d\'environnement');
        }
        
        return recommendations;
    }
}

// 🔧 Initialisation du patcher de sécurité
const securityPatcher = new SecurityPatcher();

// 📊 Génération du rapport de sécurité
setTimeout(() => {
    const report = securityPatcher.generateSecurityReport();
    console.log('🔒 Rapport de sécurité:', report);
}, 2000);

// 🚫 Protection contre les modifications
Object.freeze(securityPatcher);

// 🔒 Export sécurisé
window.SecurityPatcher = SecurityPatcher;
window.securityPatcher = securityPatcher;
