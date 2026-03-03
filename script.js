/**
 * PORTFOLIO VICTORIEN - SCRIPT PRINCIPAL
 * Version optimisée et commentée
 */

// Configuration globale
const CONFIG = {
    typingSpeed: 100,
    typingDeleteSpeed: 50,
    typingPause: 1500,
    animationDelay: 0.1,
    scrollOffset: 80
};

// État de l'application
const STATE = {
    isMenuOpen: false,
    currentSection: 'accueil',
    skillsAnimated: false,
    formSubmitting: false
};

// Initialisation au chargement du DOM
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Portfolio initialisé');
    
    initTypingEffect();
    initNavigation();
    initSkillsAnimation();
    initContactForm();
    initScrollEffects();
    initCurrentYear();
    initToastSystem();
    initResponsiveMenu();
    
    // Déclencher les animations initiales
    requestAnimationFrame(() => {
        document.body.classList.add('loaded');
    });
});

/**
 * Effet de machine à écrire amélioré
 */
function initTypingEffect() {
    const typingElement = document.querySelector('.typing');
    if (!typingElement) return;
    
    const words = [
        "Développeur Full Stack",
        "Créateur de Solutions",
        "Passionné de Tech",
        "Innovateur Digital"
    ];
    
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let isPaused = false;
    
    const type = () => {
        const currentWord = words[wordIndex];
        
        if (!isDeleting && !isPaused) {
            // Écriture
            typingElement.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
            
            if (charIndex === currentWord.length) {
                isPaused = true;
                setTimeout(() => {
                    isPaused = false;
                    isDeleting = true;
                }, CONFIG.typingPause);
            }
        } else if (isDeleting && !isPaused) {
            // Suppression
            typingElement.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
            
            if (charIndex === 0) {
                isDeleting = false;
                wordIndex = (wordIndex + 1) % words.length;
            }
        }
        
        // Vitesse variable selon l'action
        const speed = isDeleting ? CONFIG.typingDeleteSpeed : CONFIG.typingSpeed;
        setTimeout(type, speed);
    };
    
    // Démarrer l'effet avec un délai
    setTimeout(type, 1000);
}

/**
 * Navigation et suivi de section active
 */
function initNavigation() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    const menuToggle = document.querySelector('.menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    
    // Menu mobile
    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', (e) => {
            STATE.isMenuOpen = !STATE.isMenuOpen;
            menuToggle.setAttribute('aria-expanded', STATE.isMenuOpen);
            mainNav.classList.toggle('active');
            
            // Bloquer le défilement quand le menu est ouvert
            document.body.style.overflow = STATE.isMenuOpen ? 'hidden' : '';
            
            // Animation du hamburger
            menuToggle.classList.toggle('active');
        });
        
        // Fermer le menu en cliquant sur un lien
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                STATE.isMenuOpen = false;
                menuToggle.setAttribute('aria-expanded', 'false');
                mainNav.classList.remove('active');
                menuToggle.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }
    
    // Détection de la section active au défilement
    const observerOptions = {
        root: null,
        rootMargin: `-${CONFIG.scrollOffset}px 0px -50% 0px`,
        threshold: 0
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.id;
                STATE.currentSection = sectionId;
                
                // Mettre à jour les liens de navigation
                navLinks.forEach(link => {
                    link.classList.toggle('active', link.getAttribute('href') === `#${sectionId}`);
                });
                
                // Déclencher les animations spécifiques à la section
                if (sectionId === 'competences' && !STATE.skillsAnimated) {
                    animateSkills();
                }
            }
        });
    }, observerOptions);
    
    sections.forEach(section => observer.observe(section));
    
    // Smooth scroll pour les ancres
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href === '#') return;
            
            const targetElement = document.querySelector(href);
            if (targetElement) {
                e.preventDefault();
                
                const targetPosition = targetElement.offsetTop - CONFIG.scrollOffset;
                const startPosition = window.pageYOffset;
                const distance = targetPosition - startPosition;
                const duration = 800;
                let startTime = null;
                
                const ease = (t, b, c, d) => {
                    t /= d / 2;
                    if (t < 1) return c / 2 * t * t + b;
                    t--;
                    return -c / 2 * (t * (t - 2) - 1) + b;
                };
                
                const animation = (currentTime) => {
                    if (startTime === null) startTime = currentTime;
                    const timeElapsed = currentTime - startTime;
                    const run = ease(timeElapsed, startPosition, distance, duration);
                    window.scrollTo(0, run);
                    if (timeElapsed < duration) requestAnimationFrame(animation);
                };
                
                requestAnimationFrame(animation);
            }
        });
    });
}

/**
 * Animation des barres de compétences
 */
function initSkillsAnimation() {
    const skillItems = document.querySelectorAll('.skill-item');
    
    skillItems.forEach((item, index) => {
        // Initialiser la largeur à 0
        const progressBar = item.querySelector('.skill-progress');
        if (progressBar) {
            progressBar.style.width = '0%';
        }
        
        // Ajouter un délai pour l'animation en cascade
        item.style.animationDelay = `${index * CONFIG.animationDelay}s`;
    });
    
    // Observer pour déclencher l'animation
    const skillsSection = document.querySelector('#competences');
    if (!skillsSection) return;
    
    const skillsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !STATE.skillsAnimated) {
                animateSkills();
            }
        });
    }, { threshold: 0.3 });
    
    skillsObserver.observe(skillsSection);
}

function animateSkills() {
    const skillItems = document.querySelectorAll('.skill-item');
    
    skillItems.forEach(item => {
        const level = item.dataset.level;
        const progressBar = item.querySelector('.skill-progress');
        const percentElement = item.querySelector('.skill-percent');
        
        if (progressBar) {
            // Animer la barre de progression
            setTimeout(() => {
                progressBar.style.width = `${level}%`;
                
                // Animer le pourcentage
                if (percentElement) {
                    let currentPercent = 0;
                    const targetPercent = parseInt(level);
                    const increment = targetPercent / 50; // 50 étapes
                    const duration = 1500; // 1.5 secondes
                    const stepTime = duration / 50;
                    
                    const timer = setInterval(() => {
                        currentPercent += increment;
                        if (currentPercent >= targetPercent) {
                            currentPercent = targetPercent;
                            clearInterval(timer);
                        }
                        percentElement.textContent = `${Math.round(currentPercent)}%`;
                    }, stepTime);
                }
            }, item.dataset.index * 100); // Délai en cascade
        }
    });
    
    STATE.skillsAnimated = true;
}

/**
 * Gestion du formulaire de contact
 */
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;
    
    const newsletterForm = document.getElementById('newsletterForm');
    
    // Validation du formulaire principal
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        if (STATE.formSubmitting) return;
        
        // Validation
        if (!validateContactForm()) return;
        
        STATE.formSubmitting = true;
        const submitButton = contactForm.querySelector('.btn-submit');
        const originalText = submitButton.innerHTML;
        
        // Afficher l'état de chargement
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi en cours...';
        submitButton.disabled = true;
        
        // Simuler l'envoi (à remplacer par une vraie requête AJAX)
        await simulateFormSubmit();
        
        // Réinitialiser le formulaire
        contactForm.reset();
        
        // Restaurer le bouton
        submitButton.innerHTML = originalText;
        submitButton.disabled = false;
        STATE.formSubmitting = false;
        
        // Afficher le message de succès
        showToast('Message envoyé avec succès ! Je vous répondrai dans les plus brefs délais.', 'success');
    });
    
    // Newsletter (simulation)
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            showToast('Merci pour votre inscription à la newsletter !', 'info');
            newsletterForm.reset();
        });
    }
    
    // Validation en temps réel
    const inputs = contactForm.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', () => validateField(input));
        input.addEventListener('input', () => clearError(input));
    });
}

function validateContactForm() {
    const form = document.getElementById('contactForm');
    let isValid = true;
    
    const fields = [
        { id: 'name', validator: validateName },
        { id: 'email', validator: validateEmail },
        { id: 'subject', validator: validateSubject },
        { id: 'message', validator: validateMessage }
    ];
    
    fields.forEach(field => {
        const input = form.querySelector(`#${field.id}`);
        if (!field.validator(input.value)) {
            showError(input, getErrorMessage(field.id));
            isValid = false;
        }
    });
    
    return isValid;
}

function validateField(input) {
    const validators = {
        name: validateName,
        email: validateEmail,
        subject: validateSubject,
        message: validateMessage
    };
    
    const validator = validators[input.id];
    if (validator && !validator(input.value)) {
        showError(input, getErrorMessage(input.id));
        return false;
    }
    
    clearError(input);
    return true;
}

function validateName(name) {
    return name.trim().length >= 2;
}

function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

function validateSubject(subject) {
    return subject.trim().length >= 5;
}

function validateMessage(message) {
    return message.trim().length >= 10;
}

function getErrorMessage(fieldId) {
    const messages = {
        name: 'Le nom doit contenir au moins 2 caractères',
        email: 'Veuillez entrer une adresse email valide',
        subject: 'Le sujet doit contenir au moins 5 caractères',
        message: 'Le message doit contenir au moins 10 caractères'
    };
    
    return messages[fieldId] || 'Ce champ est invalide';
}

function showError(input, message) {
    const errorElement = document.getElementById(`${input.id}Error`);
    if (errorElement) {
        errorElement.textContent = message;
        input.classList.add('error');
    }
}

function clearError(input) {
    const errorElement = document.getElementById(`${input.id}Error`);
    if (errorElement) {
        errorElement.textContent = '';
        input.classList.remove('error');
    }
}

async function simulateFormSubmit() {
    return new Promise(resolve => {
        setTimeout(resolve, 1500);
    });
}

/**
 * Effets de défilement
 */
function initScrollEffects() {
    const backToTopBtn = document.querySelector('.back-top-btn');
    
    // Bouton "retour en haut"
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 500) {
            backToTopBtn?.classList.add('visible');
        } else {
            backToTopBtn?.classList.remove('visible');
        }
        
        // Animation des éléments au défilement
        animateOnScroll();
    });
    
    // Animation des éléments au chargement
    animateOnScroll();
}

function animateOnScroll() {
    const animatedElements = document.querySelectorAll('.project-card, .skill-category');
    
    animatedElements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
            element.classList.add('animate-in');
        }
    });
}

/**
 * Utilitaires
 */
function initCurrentYear() {
    const yearElement = document.getElementById('currentYear');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

function initToastSystem() {
    // Le toast est déjà dans le HTML
}

function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    if (!toast) return;
    
    // Définir le style selon le type
    const colors = {
        success: '#4caf50',
        error: '#f44336',
        warning: '#ff9800',
        info: '#2196f3'
    };
    
    toast.textContent = message;
    toast.style.borderColor = colors[type] || colors.info;
    toast.classList.add('show');
    
    // Masquer automatiquement après 5 secondes
    setTimeout(() => {
        toast.classList.remove('show');
    }, 5000);
}

function initResponsiveMenu() {
    // Fermer le menu en cliquant à l'extérieur
    document.addEventListener('click', (e) => {
        const menuToggle = document.querySelector('.menu-toggle');
        const mainNav = document.querySelector('.main-nav');
        
        if (STATE.isMenuOpen && 
            !e.target.closest('.main-nav') && 
            !e.target.closest('.menu-toggle')) {
            STATE.isMenuOpen = false;
            menuToggle?.setAttribute('aria-expanded', 'false');
            mainNav?.classList.remove('active');
            menuToggle?.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
    
    // Gérer la touche Échap
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && STATE.isMenuOpen) {
            const menuToggle = document.querySelector('.menu-toggle');
            const mainNav = document.querySelector('.main-nav');
            
            STATE.isMenuOpen = false;
            menuToggle?.setAttribute('aria-expanded', 'false');
            mainNav?.classList.remove('active');
            menuToggle?.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

/**
 * Gestion des erreurs d'images
 */
document.addEventListener('error', (e) => {
    if (e.target.tagName === 'IMG') {
        e.target.style.display = 'none';
        console.warn(`Image non chargée: ${e.target.src}`);
    }
}, true);

/**
 * Performance monitoring
 */
if ('performance' in window) {
    window.addEventListener('load', () => {
        setTimeout(() => {
            const timing = performance.timing;
            const loadTime = timing.loadEventEnd - timing.navigationStart;
            
            console.log(`📊 Temps de chargement: ${loadTime}ms`);
            
            if (loadTime > 3000) {
                console.warn('⚠️ Temps de chargement élevé, optimisations recommandées');
            }
        }, 0);
    });
}

/**
 * Service Worker (optionnel - à décommenter si nécessaire)
 */
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // navigator.serviceWorker.register('/sw.js')
        //     .then(registration => {
        //         console.log('Service Worker enregistré avec succès:', registration);
        //     })
        //     .catch(error => {
        //         console.log("Échec de l'enregistrement du Service Worker:", error);
        //     });
    });
}

// Export pour utilisation dans la console (débogage)
window.Portfolio = {
    showToast,
    validateContactForm,
    animateSkills,
    CONFIG,
    STATE
};