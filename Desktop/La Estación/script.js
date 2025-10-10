// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
}));

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Header background change on scroll - DISABLED
// window.addEventListener('scroll', () => {
//     const header = document.querySelector('.header');
//     if (window.scrollY > 100) {
//         header.style.background = '#235746';
//         header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
//     } else {
//         header.style.background = '#235746';
//         header.style.boxShadow = 'none';
//     }
// });

// Contact form handling with Formspree
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Get form data
        const name = this.querySelector('#nombre').value;
        const email = this.querySelector('#email').value;
        const subject = this.querySelector('#asunto').value;
        const message = this.querySelector('#mensaje').value;
        const phone = this.querySelector('#telefono').value;
        
        // Basic validation
        if (!name || !email || !subject || !message) {
            alert('Por favor, completa todos los campos obligatorios (marcados con *).');
            return;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Por favor, ingresa un correo electrónico válido.');
            return;
        }
        
        // Show loading state
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Enviando...';
        submitBtn.disabled = true;
        
        try {
            // Submit to Formspree
            const formData = new FormData(this);
            const response = await fetch(this.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            if (response.ok) {
                // Success
                alert('¡Mensaje enviado con éxito! Te contactaremos en menos de 24 horas.');
                this.reset();
            } else {
                // Error
                const data = await response.json();
                if (data.errors) {
                    alert('Hubo un error al enviar el mensaje. Por favor, inténtalo de nuevo.');
                } else {
                    alert('¡Mensaje enviado con éxito! Te contactaremos en menos de 24 horas.');
                    this.reset();
                }
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Hubo un error al enviar el mensaje. Por favor, inténtalo de nuevo.');
        } finally {
            // Reset button state
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });
}

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.service-card, .about-text');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Active navigation link highlighting
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.scrollY >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Add active class styles
const style = document.createElement('style');
style.textContent = `
    .nav-link.active {
        color: var(--orange-accent) !important;
    }
    .nav-link.active::after {
        width: 100% !important;
    }
    .hamburger.active span:nth-child(1) {
        transform: rotate(-45deg) translate(-5px, 6px);
    }
    .hamburger.active span:nth-child(2) {
        opacity: 0;
    }
    .hamburger.active span:nth-child(3) {
        transform: rotate(45deg) translate(-5px, -6px);
    }
`;
document.head.appendChild(style);

// Loading animation
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// Back to top button
const backToTopBtn = document.createElement('button');
backToTopBtn.innerHTML = '↑';
backToTopBtn.className = 'back-to-top';
backToTopBtn.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: var(--orange-accent);
    color: white;
    border: none;
    font-size: 20px;
    cursor: pointer;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
    z-index: 1000;
    box-shadow: 0 4px 12px rgba(220, 113, 14, 0.3);
`;

document.body.appendChild(backToTopBtn);

window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        backToTopBtn.style.opacity = '1';
        backToTopBtn.style.visibility = 'visible';
    } else {
        backToTopBtn.style.opacity = '0';
        backToTopBtn.style.visibility = 'hidden';
    }
});

backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Add hover effect to back to top button
backToTopBtn.addEventListener('mouseenter', () => {
    backToTopBtn.style.transform = 'scale(1.1)';
    backToTopBtn.style.background = 'var(--dark-brown)';
});

backToTopBtn.addEventListener('mouseleave', () => {
    backToTopBtn.style.transform = 'scale(1)';
    backToTopBtn.style.background = 'var(--orange-accent)';
});

// Gallery Lightbox functionality
function initLightbox() {
    console.log('Initializing lightbox...');
    
    // Create lightbox HTML structure
    const lightboxHTML = `
        <div id="lightbox" class="lightbox" style="display: none;">
            <div class="lightbox-overlay"></div>
            <div class="lightbox-content">
                <button class="lightbox-close">&times;</button>
                <button class="lightbox-prev">&larr;</button>
                <button class="lightbox-next">&rarr;</button>
                <img class="lightbox-image" src="" alt="">
                <div class="lightbox-caption"></div>
            </div>
        </div>
    `;
    
    // Add lightbox to body
    document.body.insertAdjacentHTML('beforeend', lightboxHTML);
    
    // Get lightbox elements
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.querySelector('.lightbox-image');
    const lightboxCaption = document.querySelector('.lightbox-caption');
    const lightboxClose = document.querySelector('.lightbox-close');
    const lightboxPrev = document.querySelector('.lightbox-prev');
    const lightboxNext = document.querySelector('.lightbox-next');
    const lightboxOverlay = document.querySelector('.lightbox-overlay');
    
    // Get all gallery images
    const galleryImages = document.querySelectorAll('.gallery-image-container img');
    let currentImageIndex = 0;
    
    console.log('Gallery images found:', galleryImages.length);
    
    // Lightbox styles
    const lightboxStyles = `
        .lightbox {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 9999;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .lightbox-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            cursor: pointer;
        }
        
        .lightbox-content {
            position: relative;
            max-width: 90%;
            max-height: 90%;
            display: flex;
            flex-direction: column;
            align-items: center;
        }
        
        .lightbox-image {
            max-width: 100%;
            max-height: 80vh;
            object-fit: contain;
            border-radius: 8px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
        }
        
        .lightbox-caption {
            color: white;
            text-align: center;
            margin-top: 1rem;
            font-size: 1.1rem;
            font-family: 'Playfair Display', serif;
        }
        
        .lightbox-close,
        .lightbox-prev,
        .lightbox-next {
            position: absolute;
            background: rgba(0, 0, 0, 0.7);
            color: white;
            border: none;
            font-size: 2rem;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
            z-index: 10000;
        }
        
        .lightbox-close {
            top: 20px;
            right: 20px;
            font-size: 2.5rem;
        }
        
        .lightbox-prev {
            left: 20px;
            top: 50%;
            transform: translateY(-50%);
        }
        
        .lightbox-next {
            right: 20px;
            top: 50%;
            transform: translateY(-50%);
        }
        
        .lightbox-close:hover,
        .lightbox-prev:hover,
        .lightbox-next:hover {
            background: var(--orange-accent);
            transform: scale(1.1);
        }
        
        .lightbox-prev:hover,
        .lightbox-next:hover {
            transform: translateY(-50%) scale(1.1);
        }
        
        @media (max-width: 768px) {
            .lightbox-close,
            .lightbox-prev,
            .lightbox-next {
                width: 40px;
                height: 40px;
                font-size: 1.5rem;
            }
            
            .lightbox-close {
                top: 10px;
                right: 10px;
                font-size: 2rem;
            }
            
            .lightbox-prev {
                left: 10px;
            }
            
            .lightbox-next {
                right: 10px;
            }
        }
    `;
    
    // Add lightbox styles
    const styleSheet = document.createElement('style');
    styleSheet.textContent = lightboxStyles;
    document.head.appendChild(styleSheet);
    
    // Function to open lightbox
    function openLightbox(imageSrc, imageAlt, imageIndex) {
        console.log('Opening lightbox for image:', imageIndex, imageSrc);
        currentImageIndex = imageIndex;
        lightboxImage.src = imageSrc;
        lightboxCaption.textContent = imageAlt;
        lightbox.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        
        // Show/hide navigation buttons based on number of images
        if (galleryImages.length <= 1) {
            lightboxPrev.style.display = 'none';
            lightboxNext.style.display = 'none';
        } else {
            lightboxPrev.style.display = 'flex';
            lightboxNext.style.display = 'flex';
        }
    }
    
    // Function to close lightbox
    function closeLightbox() {
        lightbox.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
    
    // Function to show next image
    function showNextImage() {
        currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
        const nextImage = galleryImages[currentImageIndex];
        lightboxImage.src = nextImage.src;
        lightboxCaption.textContent = nextImage.alt;
    }
    
    // Function to show previous image
    function showPrevImage() {
        currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
        const prevImage = galleryImages[currentImageIndex];
        lightboxImage.src = prevImage.src;
        lightboxCaption.textContent = prevImage.alt;
    }
    
    // Add click event listeners to gallery images
    galleryImages.forEach((img, index) => {
        console.log('Adding click listener to image:', index, img.src);
        img.style.cursor = 'pointer';
        img.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('Image clicked:', index);
            openLightbox(img.src, img.alt, index);
        });
    });
    
    // Add click event listeners to gallery containers
    const galleryContainers = document.querySelectorAll('.gallery-image-container');
    galleryContainers.forEach((container, index) => {
        console.log('Adding click listener to container:', index);
        container.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const img = container.querySelector('img');
            if (img) {
                console.log('Container clicked, opening lightbox for image:', index);
                openLightbox(img.src, img.alt, index);
            }
        });
    });
    
    // Add event listeners for lightbox controls
    lightboxClose.addEventListener('click', closeLightbox);
    lightboxOverlay.addEventListener('click', closeLightbox);
    lightboxNext.addEventListener('click', showNextImage);
    lightboxPrev.addEventListener('click', showPrevImage);
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (lightbox.style.display === 'flex') {
            switch(e.key) {
                case 'Escape':
                    closeLightbox();
                    break;
                case 'ArrowRight':
                    showNextImage();
                    break;
                case 'ArrowLeft':
                    showPrevImage();
                    break;
            }
        }
    });
    
    console.log('Lightbox initialized successfully');
}

// Initialize lightbox when DOM is ready
document.addEventListener('DOMContentLoaded', initLightbox);
