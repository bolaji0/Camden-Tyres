/* 
   Camden Tyres Service - Main JavaScript File
   Author: Camden Tyres Service
   Version: 1.0
*/

document.addEventListener('DOMContentLoaded', function() {
    // Set current year in footer copyright
    document.getElementById('current-year').textContent = new Date().getFullYear();
    
    // Initialize all components
    initMobileMenu();
    initStickyHeader();
    initScrollAnimations();
    initTestimonialSlider();
    initContactForm();
    setupLazyLoading();
});

/**
 * Mobile Menu Toggle
 */
function initMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileNav = document.querySelector('.mobile-nav');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav .nav-link');
    
    if (!mobileMenuBtn || !mobileNav) return;
    
    mobileMenuBtn.addEventListener('click', function() {
        this.classList.toggle('active');
        mobileNav.classList.toggle('active');
    });
    
    // Close mobile menu when a nav link is clicked
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', function() {
            mobileMenuBtn.classList.remove('active');
            mobileNav.classList.remove('active');
        });
    });
}

/**
 * Sticky Header functionality
 */
function initStickyHeader() {
    const header = document.querySelector('.sticky-header');
    
    if (!header) return;
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 10) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

/**
 * Scroll-triggered animations
 */
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    
    if (animatedElements.length === 0) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-visible');
            }
        });
    }, { threshold: 0.1 });
    
    animatedElements.forEach(element => observer.observe(element));
}

/**
 * Testimonial Slider functionality
 */
function initTestimonialSlider() {
    const sliderTrack = document.querySelector('.testimonial-track');
    const prevBtn = document.querySelector('.slider-btn.prev-btn');
    const nextBtn = document.querySelector('.slider-btn.next-btn');
    const dots = document.querySelectorAll('.dot');
    
    if (!sliderTrack || !prevBtn || !nextBtn) return;
    
    let currentSlide = 0;
    let slidesToShow = getSlidesToShow();
    let maxSlides = document.querySelectorAll('.testimonial-card').length - slidesToShow;
    
    // Determine number of slides to show based on screen width
    function getSlidesToShow() {
        if (window.innerWidth >= 1024) {
            return 3;
        } else if (window.innerWidth >= 768) {
            return 2;
        } else {
            return 1;
        }
    }
    
    // Update slider state on window resize
    window.addEventListener('resize', function() {
        slidesToShow = getSlidesToShow();
        maxSlides = document.querySelectorAll('.testimonial-card').length - slidesToShow;
        updateSliderPosition();
    });
    
    // Previous slide button
    prevBtn.addEventListener('click', function() {
        if (currentSlide > 0) {
            currentSlide--;
            updateSliderPosition();
        }
    });
    
    // Next slide button
    nextBtn.addEventListener('click', function() {
        if (currentSlide < maxSlides) {
            currentSlide++;
            updateSliderPosition();
        }
    });
    
    // Dot navigation
    dots.forEach((dot, index) => {
        dot.addEventListener('click', function() {
            currentSlide = index;
            updateSliderPosition();
            updateActiveDot();
        });
    });
    
    // Update slider position
    function updateSliderPosition() {
        const slideWidth = sliderTrack.querySelector('.testimonial-card').offsetWidth;
        sliderTrack.style.transform = `translateX(-${currentSlide * slideWidth}px)`;
        
        // Update button states
        prevBtn.disabled = currentSlide === 0;
        nextBtn.disabled = currentSlide >= maxSlides;
        
        updateActiveDot();
    }
    
    // Update active dot
    function updateActiveDot() {
        dots.forEach((dot, index) => {
            if (index === currentSlide) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }
    
    // Initialize slider position
    updateSliderPosition();
    
    // Add touch swipe functionality for mobile
    let touchStartX = 0;
    let touchEndX = 0;
    
    sliderTrack.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    }, false);
    
    sliderTrack.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, false);
    
    function handleSwipe() {
        const swipeThreshold = 50;
        
        if (touchEndX < touchStartX - swipeThreshold) {
            // Swipe left
            if (currentSlide < maxSlides) {
                currentSlide++;
                updateSliderPosition();
            }
        } else if (touchEndX > touchStartX + swipeThreshold) {
            // Swipe right
            if (currentSlide > 0) {
                currentSlide--;
                updateSliderPosition();
            }
        }
    }
}

/**
 * Contact Form Validation and Submission
 */
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateForm()) {
            // Form validation passed
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                service: document.getElementById('service-required').value,
                message: document.getElementById('message').value
            };
            
            // In a real application, you would submit the form data to a server here
            // For now, we'll just show a success message
            showToast('Message Sent!', 'Thank you for contacting Camden Tyres. We\'ll get back to you soon.', 'success');
            
            // Reset form
            contactForm.reset();
        }
    });
    
    function validateForm() {
        let isValid = true;
        
        // Validate name field
        const nameInput = document.getElementById('name');
        const nameError = document.getElementById('name-error');
        
        if (!nameInput.value.trim()) {
            nameError.textContent = 'Name is required';
            isValid = false;
        } else {
            nameError.textContent = '';
        }
        
        // Validate email field
        const emailInput = document.getElementById('email');
        const emailError = document.getElementById('email-error');
        
        if (!emailInput.value.trim()) {
            emailError.textContent = 'Email is required';
            isValid = false;
        } else if (!validateEmail(emailInput.value)) {
            emailError.textContent = 'Please enter a valid email address';
            isValid = false;
        } else {
            emailError.textContent = '';
        }
        
        // Validate phone field (optional)
        const phoneInput = document.getElementById('phone');
        const phoneError = document.getElementById('phone-error');
        
        if (phoneInput.value && !validatePhone(phoneInput.value)) {
            phoneError.textContent = 'Please enter a valid phone number';
            isValid = false;
        } else {
            phoneError.textContent = '';
        }
        
        // Validate service field
        const serviceInput = document.getElementById('service-required');
        const serviceError = document.getElementById('service-error');
        
        if (!serviceInput.value) {
            serviceError.textContent = 'Please select a service';
            isValid = false;
        } else {
            serviceError.textContent = '';
        }
        
        // Validate message field
        const messageInput = document.getElementById('message');
        const messageError = document.getElementById('message-error');
        
        if (!messageInput.value.trim()) {
            messageError.textContent = 'Message is required';
            isValid = false;
        } else {
            messageError.textContent = '';
        }
        
        return isValid;
    }
}

/**
 * Validate email format
 */
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Validate phone number format
 */
function validatePhone(phone) {
    const phoneRegex = /^[0-9+\-\s()]{7,15}$/;
    return phoneRegex.test(phone);
}

/**
 * Show toast notification
 */
function showToast(title, message, type = 'success') {
    const toastContainer = document.getElementById('toast-container');
    
    if (!toastContainer) return;
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    toast.innerHTML = `
        <div class="toast-content">
            <div class="toast-title">${title}</div>
            <div class="toast-message">${message}</div>
        </div>
        <button class="toast-close">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    toastContainer.appendChild(toast);
    
    // Add click event to close button
    const closeBtn = toast.querySelector('.toast-close');
    closeBtn.addEventListener('click', function() {
        toast.style.animation = 'slideOut 0.3s ease forwards';
        setTimeout(() => {
            toast.remove();
        }, 300);
    });
    
    // Auto-remove toast after 5 seconds
    setTimeout(() => {
        if (toast.parentNode) {
            toast.style.animation = 'slideOut 0.3s ease forwards';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.remove();
                }
            }, 300);
        }
    }, 5000);
}

/**
 * Lazy loading for images
 */
function setupLazyLoading() {
    if ('IntersectionObserver' in window) {
        const lazyImageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const lazyImage = entry.target;
                    lazyImage.src = lazyImage.dataset.src;
                    lazyImage.removeAttribute('data-src');
                    lazyImageObserver.unobserve(lazyImage);
                }
            });
        });
        
        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => lazyImageObserver.observe(img));
    } else {
        // Fallback for browsers without intersection observer
        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
        });
    }
}

/**
 * Smooth scrolling for anchor links
 */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80, // Offset for the fixed header
                behavior: 'smooth'
            });
        }
    });
});