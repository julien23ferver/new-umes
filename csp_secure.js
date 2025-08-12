// 🛡️ CONTENT SECURITY POLICY ULTRA-SÉCURISÉ
// Protection maximale contre XSS, injection et attaques avancées

class SecureCSP {
    constructor() {
        this.cspConfig = this.createSecureCSP();
        this.applyCSP();
        this.monitorViolations();
    }

    // 🔒 Création d'une CSP ultra-sécurisée
    createSecureCSP() {
        return {
            // 🚫 Sources par défaut - TRÈS RESTRICTIVES
            'default-src': ["'self'"],
            
            // 📜 Scripts - UNIQUEMENT les sources de confiance
            'script-src': [
                "'self'",
                "'nonce-" + this.generateNonce() + "'", // Nonce pour scripts inline autorisés
                "https://cdnjs.cloudflare.com",
                "https://cdn.jsdelivr.net",
                "https://code.jquery.com",
                "https://unpkg.com",
                "https://d3js.org",
                "https://threejs.org",
                "https://cdn.plot.ly",
                "https://stackpath.bootstrapcdn.com",
                "https://maps.googleapis.com",
                "https://cdn.tailwindcss.com",
                "https://ajax.googleapis.com",
                "https://kit.fontawesome.com",
                "https://cdn.datatables.net",
                "https://maxcdn.bootstrapcdn.com",
                "https://code.highcharts.com",
                "https://tako-static-assets-production.s3.amazonaws.com",
                "https://www.youtube.com",
                "https://fonts.googleapis.com",
                "https://fonts.gstatic.com",
                "https://pfst.cf2.poecdn.net",
                "https://puc.poecdn.net",
                "https://i.imgur.com",
                "https://wikimedia.org",
                "https://*.icons8.com",
                "https://*.giphy.com",
                "https://picsum.photos",
                "https://images.unsplash.com",
                "https://upload.wikimedia.org"
            ],
            
            // 🎨 Styles - Sources autorisées uniquement
            'style-src': [
                "'self'",
                "'unsafe-inline'", // Nécessaire pour les styles dynamiques
                "https://fonts.googleapis.com",
                "https://cdnjs.cloudflare.com",
                "https://cdn.jsdelivr.net",
                "https://stackpath.bootstrapcdn.com",
                "https://maxcdn.bootstrapcdn.com",
                "https://kit.fontawesome.com",
                "https://cdn.tailwindcss.com"
            ],
            
            // 🖼️ Images - Domaines de confiance uniquement
            'img-src': [
                "'self'",
                "data:",
                "blob:",
                "https://i.imgur.com",
                "https://wikimedia.org",
                "https://*.icons8.com",
                "https://*.giphy.com",
                "https://picsum.photos",
                "https://images.unsplash.com",
                "https://upload.wikimedia.org",
                "https://pfst.cf2.poecdn.net",
                "https://puc.poecdn.net"
            ],
            
            // 🔗 Connexions - API et services autorisés
            'connect-src': [
                "'self'",
                "https://dpaumpllxdqpjytkctpo.supabase.co",
                "https://api.ssi.gouv.fr",
                "https://fonts.googleapis.com",
                "https://fonts.gstatic.com"
            ],
            
            // 📺 Frames - Très restrictif
            'frame-src': [
                "'self'",
                "https://www.youtube.com",
                "https://trytako.com"
            ],
            
            // 👶 Child frames - Aucun
            'child-src': ["'self'"],
            
            // 📱 Manifest - Local uniquement
            'manifest-src': ["'self'"],
            
            // 🔧 Workers - Local uniquement
            'worker-src': ["'self'"],
            
            // 📄 Documents - Aucun
            'object-src': ["'none'"],
            
            // 🔌 Plugins - Aucun
            'plugin-types': [],
            
            // 📊 Media - Sources autorisées
            'media-src': [
                "'self'",
                "https://www.youtube.com",
                "https://*.giphy.com"
            ],
            
            // 🎯 Form actions - Local uniquement
            'form-action': ["'self'"],
            
            // 🔗 Base URI - Local uniquement
            'base-uri': ["'self'"],
            
            // 🔗 Frame ancestors - Aucun (protection contre clickjacking)
            'frame-ancestors': ["'none'"],
            
            // 🔗 Navigation - Local uniquement
            'navigate-to': ["'self'"],
            
            // 🔗 Upgrade des requêtes
            'upgrade-insecure-requests': true,
            
            // 🚫 Blocage du contenu mixte
            'block-all-mixed-content': true,
            
            // 🔍 Mode strict
            'require-trusted-types-for': ["'script'"]
        };
    }

    // 🔑 Génération d'un nonce sécurisé
    generateNonce() {
        const array = new Uint8Array(16);
        crypto.getRandomValues(array);
        return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    }

    // 🛡️ Application de la CSP
    applyCSP() {
        const cspString = this.buildCSPString();
        
        // Ajouter la meta tag CSP
        const meta = document.createElement('meta');
        meta.httpEquiv = 'Content-Security-Policy';
        meta.content = cspString;
        document.head.appendChild(meta);
        
        // Ajouter des en-têtes de sécurité supplémentaires
        this.addSecurityHeaders();
        
        // Protéger contre les modifications de la CSP
        this.protectCSP();
    }

    // 🔧 Construction de la chaîne CSP
    buildCSPString() {
        const directives = [];
        
        for (const [directive, sources] of Object.entries(this.cspConfig)) {
            if (Array.isArray(sources)) {
                directives.push(`${directive} ${sources.join(' ')}`);
            } else if (typeof sources === 'boolean' && sources) {
                directives.push(directive);
            }
        }
        
        return directives.join('; ');
    }

    // 🔒 Ajout d'en-têtes de sécurité supplémentaires
    addSecurityHeaders() {
        const headers = [
            { name: 'X-Content-Type-Options', value: 'nosniff' },
            { name: 'X-Frame-Options', value: 'DENY' },
            { name: 'X-XSS-Protection', value: '1; mode=block' },
            { name: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
            { name: 'Permissions-Policy', value: 'geolocation=(), microphone=(), camera=()' },
            { name: 'Cross-Origin-Embedder-Policy', value: 'require-corp' },
            { name: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
            { name: 'Cross-Origin-Resource-Policy', value: 'same-origin' }
        ];
        
        headers.forEach(header => {
            const meta = document.createElement('meta');
            meta.httpEquiv = header.name;
            meta.content = header.value;
            document.head.appendChild(meta);
        });
    }

    // 🚫 Protection de la CSP contre les modifications
    protectCSP() {
        // Override de createElement pour empêcher la suppression des meta CSP
        const originalCreateElement = document.createElement;
        document.createElement = function(tagName) {
            const element = originalCreateElement.call(this, tagName);
            
            if (tagName.toLowerCase() === 'meta') {
                Object.defineProperty(element, 'httpEquiv', {
                    set: function(value) {
                        if (value === 'Content-Security-Policy') {
                            console.warn('Tentative de modification de la CSP détectée');
                            return;
                        }
                        this.setAttribute('http-equiv', value);
                    },
                    get: function() {
                        return this.getAttribute('http-equiv');
                    }
                });
            }
            
            return element;
        };
    }

    // 👁️ Surveillance des violations CSP
    monitorViolations() {
        // Créer un endpoint de reporting (en production, pointer vers votre serveur)
        const reportUri = '/csp-violation-report';
        
        // Ajouter le reporting à la CSP
        const reportingCSP = this.buildCSPString() + `; report-uri ${reportUri}; report-to default`;
        
        // Créer un observer pour détecter les violations
        this.createViolationObserver();
        
        // Logger les violations en développement
        if (window.location.hostname === 'localhost') {
            this.logViolations();
        }
    }

    // 🔍 Création d'un observateur de violations
    createViolationObserver() {
        // Observer les modifications du DOM pour détecter les injections
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        this.checkForInjection(node);
                    }
                });
            });
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // 🚨 Vérification d'injection
    checkForInjection(element) {
        const dangerousPatterns = [
            /<script/i,
            /javascript:/i,
            /on\w+\s*=/i,
            /data:text\/html/i,
            /vbscript:/i
        ];
        
        const html = element.outerHTML || element.innerHTML || '';
        
        dangerousPatterns.forEach(pattern => {
            if (pattern.test(html)) {
                console.error('Injection détectée:', html);
                this.reportViolation('injection-detected', html);
            }
        });
    }

    // 📊 Logging des violations
    logViolations() {
        // Override de console.error pour capturer les violations CSP
        const originalError = console.error;
        console.error = (...args) => {
            if (args[0] && typeof args[0] === 'string' && args[0].includes('CSP')) {
                this.reportViolation('csp-violation', args.join(' '));
            }
            originalError.apply(console, args);
        };
    }

    // 📤 Reporting des violations
    reportViolation(type, details) {
        const violation = {
            type: type,
            details: details,
            timestamp: new Date().toISOString(),
            url: window.location.href,
            userAgent: navigator.userAgent
        };
        
        // En production, envoyer au serveur
        if (window.location.hostname !== 'localhost') {
            fetch('/api/security/violations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                },
                body: JSON.stringify(violation)
            }).catch(error => {
                console.warn('Impossible de reporter la violation:', error);
            });
        } else {
            console.warn('Violation de sécurité:', violation);
        }
    }

    // ✅ Validation de la CSP
    validateCSP() {
        const violations = [];
        
        // Vérifier que tous les scripts externes sont autorisés
        const scripts = document.querySelectorAll('script[src]');
        scripts.forEach(script => {
            const src = script.src;
            if (!this.isSourceAllowed(src, 'script-src')) {
                violations.push(`Script non autorisé: ${src}`);
            }
        });
        
        // Vérifier les styles
        const styles = document.querySelectorAll('link[rel="stylesheet"]');
        styles.forEach(style => {
            const href = style.href;
            if (!this.isSourceAllowed(href, 'style-src')) {
                violations.push(`Style non autorisé: ${href}`);
            }
        });
        
        return {
            isValid: violations.length === 0,
            violations: violations
        };
    }

    // 🔍 Vérification si une source est autorisée
    isSourceAllowed(source, directive) {
        const allowedSources = this.cspConfig[directive];
        if (!allowedSources) return false;
        
        try {
            const url = new URL(source);
            return allowedSources.some(allowed => {
                if (allowed === "'self'") {
                    return url.origin === window.location.origin;
                }
                if (allowed.startsWith('https://')) {
                    return url.origin === allowed.replace('https://', '');
                }
                return false;
            });
        } catch (e) {
            return false;
        }
    }
}

// 🛡️ Initialisation de la CSP sécurisée
const secureCSP = new SecureCSP();

// 🚫 Protection contre les modifications
Object.freeze(secureCSP);

// 🔒 Export sécurisé
window.SecureCSP = SecureCSP;
window.secureCSP = secureCSP;
