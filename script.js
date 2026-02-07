// ===== Birthday Website JavaScript ===== //

// Initialize AOS (Animate On Scroll)
document.addEventListener('DOMContentLoaded', function() {
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: false,
        mirror: true
    });

    // Initialize all features
    initSpaceBackground();
    initShootingStars();
    initStarOriginEffects();
    initConfetti();
    initCounters();
    initSmoothScroll();
    initMusicToggle();
    initBlowCandles();
    init3DCardEffects();
    createFloatingHearts();
});

// ===== Space Background Initialization ===== //
function initSpaceBackground() {
    createStarField();
    animateSpaceElements();
}

function createStarField() {
    const starsLayer = document.getElementById('stars-layer');
    if (!starsLayer) return;
    
    // Create additional random stars
    for (let i = 0; i < 200; i++) {
        const star = document.createElement('div');
        star.className = 'dynamic-star';
        star.style.cssText = `
            position: absolute;
            width: ${Math.random() * 3 + 1}px;
            height: ${Math.random() * 3 + 1}px;
            background: ${Math.random() > 0.7 ? '#FFD700' : '#fff'};
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            opacity: ${Math.random() * 0.7 + 0.3};
            animation: star-twinkle ${Math.random() * 3 + 2}s ease-in-out infinite;
            animation-delay: ${Math.random() * 3}s;
        `;
        starsLayer.appendChild(star);
    }

    // Add twinkling animation style
    const style = document.createElement('style');
    style.textContent = `
        @keyframes star-twinkle {
            0%, 100% { opacity: 0.3; transform: scale(1); }
            50% { opacity: 1; transform: scale(1.5); }
        }
    `;
    document.head.appendChild(style);
}

function animateSpaceElements() {
    // Add random movement to astronauts
    const astronauts = document.querySelectorAll('.astronaut');
    astronauts.forEach((astro, index) => {
        astro.style.animationDuration = `${20 + index * 5}s`;
    });
}

// ===== Shooting Stars ===== //
function initShootingStars() {
    const shootingStarsContainer = document.getElementById('shooting-stars');
    if (!shootingStarsContainer) return;
    
    function createShootingStar() {
        const star = document.createElement('div');
        star.className = 'shooting-star';
        star.style.left = Math.random() * 70 + '%';
        star.style.top = Math.random() * 30 + '%';
        star.style.animationDuration = (Math.random() * 2 + 1) + 's';
        shootingStarsContainer.appendChild(star);
        
        setTimeout(() => star.remove(), 3000);
    }
    
    // Create shooting stars periodically
    setInterval(createShootingStar, 4000);
    
    // Create a few immediately
    setTimeout(createShootingStar, 1000);
    setTimeout(createShootingStar, 2500);
}

// ===== Star Origin Effects for Timeline Cards ===== //
function initStarOriginEffects() {
    const observerOptions = {
        threshold: 0.3,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const card = entry.target;
                createStarBurstEffect(card);
            }
        });
    }, observerOptions);

    // Observe all timeline cards with star-origin class
    document.querySelectorAll('.star-origin').forEach(card => {
        observer.observe(card);
    });
}

function createStarBurstEffect(element) {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const topY = rect.top;
    
    // Create star particles falling from above
    for (let i = 0; i < 15; i++) {
        setTimeout(() => {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: fixed;
                width: ${Math.random() * 6 + 2}px;
                height: ${Math.random() * 6 + 2}px;
                background: ${['#FFD700', '#FFF', '#87CEEB', '#FFE4B5'][Math.floor(Math.random() * 4)]};
                border-radius: 50%;
                left: ${centerX + (Math.random() - 0.5) * 100}px;
                top: ${topY - 50}px;
                pointer-events: none;
                z-index: 100;
                box-shadow: 0 0 6px currentColor;
                animation: star-fall-particle 1.5s ease-out forwards;
            `;
            document.body.appendChild(particle);
            
            setTimeout(() => particle.remove(), 1500);
        }, i * 50);
    }
}

// Add star particle animation
const starParticleStyle = document.createElement('style');
starParticleStyle.textContent = `
    @keyframes star-fall-particle {
        0% {
            transform: translateY(0) scale(1);
            opacity: 1;
        }
        100% {
            transform: translateY(150px) scale(0);
            opacity: 0;
        }
    }
`;
document.head.appendChild(starParticleStyle);

// ===== Confetti System ===== //
function initConfetti() {
    const canvas = document.getElementById('confetti-canvas');
    const ctx = canvas.getContext('2d');
    let confettiPieces = [];
    let isAnimating = false;

    // Set canvas size
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Confetti piece class
    class Confetti {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = -20;
            this.size = Math.random() * 10 + 5;
            this.speedY = Math.random() * 3 + 2;
            this.speedX = (Math.random() - 0.5) * 4;
            this.rotation = Math.random() * 360;
            this.rotationSpeed = (Math.random() - 0.5) * 10;
            this.color = `hsl(${Math.random() * 360}, 80%, 60%)`;
            this.shape = Math.random() > 0.5 ? 'rect' : 'circle';
        }

        update() {
            this.y += this.speedY;
            this.x += this.speedX;
            this.rotation += this.rotationSpeed;
            this.speedX += (Math.random() - 0.5) * 0.2;
        }

        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation * Math.PI / 180);
            ctx.fillStyle = this.color;
            
            if (this.shape === 'rect') {
                ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size / 2);
            } else {
                ctx.beginPath();
                ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.restore();
        }
    }

    // Animation loop
    function animate() {
        if (!isAnimating) return;
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        confettiPieces.forEach((piece, index) => {
            piece.update();
            piece.draw();
            
            if (piece.y > canvas.height) {
                confettiPieces.splice(index, 1);
            }
        });

        if (confettiPieces.length > 0) {
            requestAnimationFrame(animate);
        } else {
            isAnimating = false;
        }
    }

    // Trigger confetti burst
    window.triggerConfetti = function(count = 150) {
        for (let i = 0; i < count; i++) {
            setTimeout(() => {
                confettiPieces.push(new Confetti());
            }, i * 10);
        }
        
        if (!isAnimating) {
            isAnimating = true;
            animate();
        }
    };

    // Auto-trigger on page load after a delay
    setTimeout(() => {
        window.triggerConfetti(100);
    }, 2000);
}

// ===== Counter Animation ===== //
function initCounters() {
    const counters = document.querySelectorAll('.counter');
    
    const observerOptions = {
        threshold: 0.5
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-target'));
                animateCounter(counter, target);
                observer.unobserve(counter);
            }
        });
    }, observerOptions);

    counters.forEach(counter => observer.observe(counter));
}

function animateCounter(element, target) {
    let current = 0;
    const increment = target / 100;
    const duration = 2000;
    const stepTime = duration / 100;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = formatNumber(target);
            clearInterval(timer);
        } else {
            element.textContent = formatNumber(Math.floor(current));
        }
    }, stepTime);
}

function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(0) + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(0) + 'K';
    }
    return num.toString();
}

// ===== Smooth Scroll ===== //
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
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
}

// ===== Music Toggle ===== //
function initMusicToggle() {
    const musicToggle = document.getElementById('music-toggle');
    const bgMusic = document.getElementById('bg-music');
    let isPlaying = false;

    musicToggle.addEventListener('click', () => {
        if (isPlaying) {
            bgMusic.pause();
            musicToggle.textContent = '🎵';
        } else {
            bgMusic.play().catch(() => {
                console.log('Music playback requires user interaction');
            });
            musicToggle.textContent = '🔇';
        }
        isPlaying = !isPlaying;
    });
}

// ===== Blow Candles Interaction ===== //
function initBlowCandles() {
    const blowButton = document.getElementById('blow-candles');
    let hasBlown = false;

    blowButton.addEventListener('click', () => {
        if (!hasBlown) {
            hasBlown = true;
            
            // Major confetti burst
            window.triggerConfetti(300);

            // Change button text
            blowButton.innerHTML = '🎉 Happy Birthday! 🎉';
            blowButton.classList.remove('animate-pulse-slow');
            blowButton.classList.add('bg-gradient-to-r', 'from-green-500', 'to-blue-500');

            // Show celebration message
            showCelebrationMessage();

            // Create fireworks effect
            createFireworks();

            // Play celebration sound (if available)
            playCelebrationSound();
        } else {
            // Continue confetti
            window.triggerConfetti(100);
        }
    });
}

function showCelebrationMessage() {
    const message = document.createElement('div');
    message.className = 'fixed inset-0 flex items-center justify-center z-50 pointer-events-none';
    message.innerHTML = `
        <div class="text-center animate-bounce">
            <div class="text-9xl mb-4">🎊</div>
            <h2 class="font-dancing text-6xl text-gold animate-glow">Wish Granted!</h2>
        </div>
    `;
    document.body.appendChild(message);

    setTimeout(() => {
        message.style.opacity = '0';
        message.style.transition = 'opacity 1s';
        setTimeout(() => message.remove(), 1000);
    }, 3000);
}

function createFireworks() {
    const colors = ['#FFD700', '#FF6B6B', '#4169E1', '#10B981', '#F59E0B', '#EC4899'];
    
    for (let i = 0; i < 5; i++) {
        setTimeout(() => {
            const x = Math.random() * window.innerWidth;
            const y = Math.random() * (window.innerHeight / 2);
            createFirework(x, y, colors[Math.floor(Math.random() * colors.length)]);
        }, i * 500);
    }
}

function createFirework(x, y, color) {
    const particles = 30;
    
    for (let i = 0; i < particles; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'fixed';
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        particle.style.width = '8px';
        particle.style.height = '8px';
        particle.style.borderRadius = '50%';
        particle.style.backgroundColor = color;
        particle.style.pointerEvents = 'none';
        particle.style.zIndex = '1000';
        
        const angle = (i / particles) * Math.PI * 2;
        const velocity = Math.random() * 100 + 100;
        const tx = Math.cos(angle) * velocity;
        const ty = Math.sin(angle) * velocity;
        
        particle.style.setProperty('--tx', tx + 'px');
        particle.style.setProperty('--ty', ty + 'px');
        particle.style.animation = 'burst 1s ease-out forwards';
        
        document.body.appendChild(particle);
        
        setTimeout(() => particle.remove(), 1000);
    }
}

function playCelebrationSound() {
    // Create a simple celebration sound using Web Audio API
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        // Play a cheerful sequence
        const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
        
        notes.forEach((freq, i) => {
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.value = freq;
            oscillator.type = 'sine';
            
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime + i * 0.15);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + i * 0.15 + 0.5);
            
            oscillator.start(audioContext.currentTime + i * 0.15);
            oscillator.stop(audioContext.currentTime + i * 0.15 + 0.5);
        });
    } catch (e) {
        console.log('Audio not supported');
    }
}

// ===== 3D Card Effects ===== //
function init3DCardEffects() {
    const cards = document.querySelectorAll('.card-3d');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
        });
    });
}

// ===== Floating Hearts ===== //
function createFloatingHearts() {
    setInterval(() => {
        const heart = document.createElement('div');
        heart.innerHTML = '💖';
        heart.style.position = 'fixed';
        heart.style.left = Math.random() * 100 + '%';
        heart.style.bottom = '-50px';
        heart.style.fontSize = (Math.random() * 20 + 20) + 'px';
        heart.style.opacity = Math.random() * 0.5 + 0.3;
        heart.style.pointerEvents = 'none';
        heart.style.zIndex = '5';
        heart.style.animation = 'float-up 6s ease-in-out forwards';
        
        document.body.appendChild(heart);
        
        setTimeout(() => heart.remove(), 6000);
    }, 3000);
}

// Add float-up animation
const style = document.createElement('style');
style.textContent = `
    @keyframes float-up {
        0% {
            transform: translateY(0) translateX(0) rotate(0deg);
            opacity: var(--start-opacity, 0.5);
        }
        100% {
            transform: translateY(-100vh) translateX(${Math.random() * 200 - 100}px) rotate(360deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ===== Parallax Effect on Scroll ===== //
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    
    // Parallax for floating elements
    const floatingElements = document.querySelectorAll('.floating-balloon');
    floatingElements.forEach((el, index) => {
        const speed = 0.1 + (index * 0.05);
        el.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

// ===== Easter Egg: Konami Code ===== //
const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let konamiIndex = 0;

document.addEventListener('keydown', (e) => {
    if (e.key === konamiCode[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) {
            activateSecretMode();
            konamiIndex = 0;
        }
    } else {
        konamiIndex = 0;
    }
});

function activateSecretMode() {
    // Rainbow mode!
    document.body.style.animation = 'rainbow-bg 5s linear infinite';
    
    const rainbowStyle = document.createElement('style');
    rainbowStyle.textContent = `
        @keyframes rainbow-bg {
            0% { filter: hue-rotate(0deg); }
            100% { filter: hue-rotate(360deg); }
        }
    `;
    document.head.appendChild(rainbowStyle);
    
    // Mega confetti
    window.triggerConfetti(500);
    
    // Secret message
    const secretMsg = document.createElement('div');
    secretMsg.className = 'fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 text-center';
    secretMsg.innerHTML = `
        <div class="bg-black/80 backdrop-blur-lg p-8 rounded-3xl border border-gold/50">
            <h2 class="font-dancing text-4xl text-gold mb-4">🎮 Secret Mode Activated! 🎮</h2>
            <p class="text-xl">You found the easter egg!</p>
            <p class="text-gold mt-2">Best Bhaiya Ever! 🏆</p>
        </div>
    `;
    document.body.appendChild(secretMsg);
    
    setTimeout(() => {
        document.body.style.animation = '';
        secretMsg.style.opacity = '0';
        secretMsg.style.transition = 'opacity 1s';
        setTimeout(() => secretMsg.remove(), 1000);
    }, 5000);
}

// ===== Touch Support for Mobile ===== //
document.addEventListener('touchstart', function() {}, {passive: true});

// ===== Preloader (Optional) ===== //
window.addEventListener('load', () => {
    // Remove any preloader if exists
    const preloader = document.getElementById('preloader');
    if (preloader) {
        preloader.style.opacity = '0';
        setTimeout(() => preloader.remove(), 500);
    }
    
    // Initial animation
    setTimeout(() => {
        window.triggerConfetti(50);
    }, 1000);
});

// ===== Console Message ===== //
console.log('%c🎂 Happy Birthday Bhaiya! 🎂', 'color: gold; font-size: 30px; font-weight: bold;');
console.log('%cMade with ❤️ for the Best Brother!', 'color: pink; font-size: 16px;');
