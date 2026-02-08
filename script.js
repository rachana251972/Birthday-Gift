// ===== Birthday Website JavaScript ===== //

// Initialize everything on page load
document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true
    });

    // Initialize particles.js for space background
    initParticlesSpace();
    
    // Initialize other features
    initConfetti();
    initCounters();
    initSmoothScroll();
    initMusicToggle();
    initBlowCandles();
    initLetterTyping();
});

// ===== Particles.js Space Background ===== //
function initParticlesSpace() {
    if (typeof particlesJS === 'undefined') {
        console.warn('particles.js not loaded');
        return;
    }

    particlesJS('particles-js', {
        particles: {
            number: {
                value: 200,
                density: {
                    enable: true,
                    value_area: 1000
                }
            },
            color: {
                value: ["#ffffff", "#FFD700", "#87CEEB", "#FFF8DC", "#E6E6FA"]
            },
            shape: {
                type: "circle"
            },
            opacity: {
                value: 0.8,
                random: true,
                anim: {
                    enable: true,
                    speed: 1,
                    opacity_min: 0.1,
                    sync: false
                }
            },
            size: {
                value: 2,
                random: true,
                anim: {
                    enable: true,
                    speed: 2,
                    size_min: 0.5,
                    sync: false
                }
            },
            line_linked: {
                enable: false
            },
            move: {
                enable: true,
                speed: 0.3,
                direction: "none",
                random: true,
                straight: false,
                out_mode: "out",
                bounce: false
            }
        },
        interactivity: {
            detect_on: "canvas",
            events: {
                onhover: {
                    enable: true,
                    mode: "bubble"
                },
                onclick: {
                    enable: true,
                    mode: "push"
                },
                resize: true
            },
            modes: {
                bubble: {
                    distance: 150,
                    size: 4,
                    duration: 2,
                    opacity: 1,
                    speed: 3
                },
                push: {
                    particles_nb: 4
                }
            }
        },
        retina_detect: true
    });
}

// ===== Confetti System ===== //
function initConfetti() {
    const canvas = document.getElementById('confetti-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let confettiPieces = [];
    let isAnimating = false;

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

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
        }

        update() {
            this.y += this.speedY;
            this.x += this.speedX;
            this.rotation += this.rotationSpeed;
        }

        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation * Math.PI / 180);
            ctx.fillStyle = this.color;
            ctx.fillRect(-this.size / 2, -this.size / 4, this.size, this.size / 2);
            ctx.restore();
        }
    }

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

    window.triggerConfetti = function(count = 100) {
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
}

// ===== Counter Animation ===== //
function initCounters() {
    const counters = document.querySelectorAll('.counter');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-target'));
                animateCounter(counter, target);
                observer.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => observer.observe(counter));
}

function animateCounter(element, target) {
    let current = 0;
    const increment = target / 100;
    const stepTime = 20;

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
    if (!musicToggle || !bgMusic) return;
    
    let isPlaying = false;

    // Try to autoplay music
    function tryAutoplay() {
        bgMusic.play().then(() => {
            isPlaying = true;
            musicToggle.textContent = '🔇';
        }).catch(() => {
            // Autoplay blocked - will play on first interaction
            document.addEventListener('click', function autoplayOnClick() {
                bgMusic.play().then(() => {
                    isPlaying = true;
                    musicToggle.textContent = '🔇';
                }).catch(() => {});
                document.removeEventListener('click', autoplayOnClick);
            }, { once: true });
        });
    }
    
    tryAutoplay();

    musicToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        if (isPlaying) {
            bgMusic.pause();
            musicToggle.textContent = '🎵';
        } else {
            bgMusic.play().catch(() => {});
            musicToggle.textContent = '🔇';
        }
        isPlaying = !isPlaying;
    });
}

// ===== Blow Candles ===== //
function initBlowCandles() {
    const blowButton = document.getElementById('blow-candles');
    if (!blowButton) return;
    
    let hasBlown = false;

    blowButton.addEventListener('click', () => {
        if (!hasBlown) {
            hasBlown = true;
            window.triggerConfetti(200);
            blowButton.innerHTML = '🎉 Happy Birthday! 🎉';
            blowButton.style.background = 'linear-gradient(to right, #10B981, #3B82F6)';
            showCelebration();
        } else {
            window.triggerConfetti(50);
        }
    });
}

function showCelebration() {
    const message = document.createElement('div');
    message.className = 'fixed inset-0 flex items-center justify-center z-50 pointer-events-none';
    message.innerHTML = `
        <div class="text-center">
            <div class="text-8xl mb-4">🎊</div>
            <h2 class="font-dancing text-5xl md:text-6xl text-gold">Wish Granted!</h2>
        </div>
    `;
    document.body.appendChild(message);

    setTimeout(() => {
        message.style.opacity = '0';
        message.style.transition = 'opacity 1s';
        setTimeout(() => message.remove(), 1000);
    }, 2500);
}

// ===== Letter Typing Effect with Sound ===== //
function initLetterTyping() {
    const letterContent = document.getElementById('letter-content');
    const signature = document.querySelector('#letter .font-dancing.text-2xl');
    if (!letterContent) return;

    const letterText = "Dear Bhaiya, you've been my guide, my protector, and my best friend. From teaching me to ride a bicycle to helping me with life decisions, you've always been there. Thank you for being the best brother anyone could ask for!";
    
    let hasTyped = false;
    let audioContext = null;
    
    // Create typing sound using Web Audio API
    function createTypingSound() {
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        // Typewriter click sound
        oscillator.frequency.setValueAtTime(800 + Math.random() * 400, audioContext.currentTime);
        oscillator.type = 'square';
        
        gainNode.gain.setValueAtTime(0.03, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.05);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.05);
    }
    
    // Typing effect function
    function typeText(element, text, index = 0) {
        if (index < text.length) {
            element.textContent += text.charAt(index);
            
            // Play typing sound for non-space characters
            if (text.charAt(index) !== ' ') {
                createTypingSound();
            }
            
            // Random delay for natural feel
            const delay = text.charAt(index) === ' ' ? 30 : 
                         text.charAt(index) === ',' ? 150 :
                         text.charAt(index) === '.' ? 200 :
                         text.charAt(index) === '!' ? 200 :
                         40 + Math.random() * 30;
            
            setTimeout(() => typeText(element, text, index + 1), delay);
        } else {
            // Typing complete - show signature with fade
            element.classList.remove('typing');
            if (signature) {
                signature.classList.remove('opacity-0');
                signature.classList.add('opacity-100');
                signature.style.transition = 'opacity 1s ease-in-out';
            }
        }
    }
    
    // Observe when letter section comes into view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !hasTyped) {
                hasTyped = true;
                letterContent.textContent = '';
                letterContent.classList.add('typing');
                
                // Small delay before starting
                setTimeout(() => {
                    typeText(letterContent, letterText);
                }, 500);
                
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });
    
    observer.observe(letterContent.closest('section') || letterContent);
}

// Console message
console.log('%c🎂 Happy Birthday Bhaiya! 🎂', 'color: gold; font-size: 24px; font-weight: bold;');
