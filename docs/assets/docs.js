// Trail Selection
function selectTrail(trail) {
    localStorage.setItem('selectedTrail', trail);
    
    // Visual feedback
    const cards = document.querySelectorAll('.trail-card');
    cards.forEach(card => {
        if (card.dataset.trail === trail) {
            card.style.transform = 'scale(1.05)';
            card.style.border = '3px solid #6366f1';
        }
    });
    
    // Redirect to first guide page after animation
    setTimeout(() => {
        window.location.href = 'guia/fundamentos.html?trail=' + trail;
    }, 500);
}

// Get selected trail
function getSelectedTrail() {
    return localStorage.getItem('selectedTrail') || 'beginner';
}

// Smooth scroll for anchor links
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

// Add animation on scroll
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

// Observe all sections
document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });
    
    // Highlight active trail if coming back
    const selectedTrail = getSelectedTrail();
    const trailCard = document.querySelector(`[data-trail="${selectedTrail}"]`);
    if (trailCard) {
        trailCard.style.border = '2px solid #6366f1';
    }
});

// Copy code button functionality (for future code blocks)
function copyCode(button) {
    const code = button.parentElement.querySelector('code').textContent;
    navigator.clipboard.writeText(code).then(() => {
        button.textContent = 'Copiado!';
        setTimeout(() => {
            button.innerHTML = '<i class="fas fa-copy"></i> Copiar';
        }, 2000);
    });
}

// Progress tracker
function updateProgress(currentPhase, totalPhases) {
    const percentage = (currentPhase / totalPhases) * 100;
    const progressBar = document.querySelector('.progress-bar');
    if (progressBar) {
        progressBar.style.width = percentage + '%';
    }
}

console.log('📚 Documentação do Clube do Foco carregada!');