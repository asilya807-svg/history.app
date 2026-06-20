// ===== EPOCH MAIN.JS — Full Landing Page Interactivity =====

// ─── 1. NAVBAR: scroll shrink + hamburger ───────────────────────────────────
const navbar = document.getElementById('navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  });
}

const hamburger = document.getElementById('hamburger');
if (hamburger) {
  hamburger.addEventListener('click', () => {
    const links = document.querySelector('.nav-links');
    if (!links) return;
    const isOpen = links.classList.contains('mobile-open');
    if (isOpen) {
      links.classList.remove('mobile-open');
      links.removeAttribute('style');
      hamburger.textContent = '☰';
    } else {
      links.classList.add('mobile-open');
      Object.assign(links.style, {
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        top: '70px',
        right: '16px',
        background: 'white',
        padding: '20px',
        border: '3px solid var(--ink)',
        borderRadius: '20px',
        boxShadow: '8px 8px 0 var(--ink)',
        zIndex: '999',
        gap: '12px',
        animation: 'slide-up 0.25s ease both'
      });
      hamburger.textContent = '✕';
    }
  });

  // Close menu when a link is clicked
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      const links = document.querySelector('.nav-links');
      if (links && links.classList.contains('mobile-open')) {
        links.classList.remove('mobile-open');
        links.removeAttribute('style');
        hamburger.textContent = '☰';
      }
    });
  });
}

// ─── 2. SMOOTH SCROLL for anchor links ──────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ─── 3. SCROLL-REVEAL for cards, steps, pricing ────────────────────────────
function revealOnScroll() {
  const selectors = '.about-card, .price-card, .step-node, .hero-badges .badge, .node-wrap-inner';
  const elements = document.querySelectorAll(selectors);

  elements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(32px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, idx) => {
      if (entry.isIntersecting) {
        const delay = (entry.target.dataset.delay || idx) * 80;
        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }, delay);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  elements.forEach((el, i) => {
    el.dataset.delay = i;
    observer.observe(el);
  });
}
revealOnScroll();

// ─── 4. HERO TITLE TYPEWRITER ────────────────────────────────────────────────
const heroTitle = document.querySelector('.hero-title');
if (heroTitle) {
  const words = ['history.', 'roots.', 'story.', 'heritage.'];
  let wordIndex = 0;
  let charIndex = 0;
  let deleting = false;

  // Find or create the animated span
  let accentSpan = heroTitle.querySelector('.accent-underline');
  if (!accentSpan) {
    accentSpan = document.createElement('span');
    accentSpan.className = 'accent-underline';
    heroTitle.appendChild(accentSpan);
  }
  accentSpan.textContent = words[0];

  function typeWriter() {
    const current = words[wordIndex];
    if (!deleting) {
      charIndex++;
      accentSpan.textContent = current.slice(0, charIndex);
      if (charIndex === current.length) {
        deleting = true;
        setTimeout(typeWriter, 1800);
        return;
      }
    } else {
      charIndex--;
      accentSpan.textContent = current.slice(0, charIndex);
      if (charIndex === 0) {
        deleting = false;
        wordIndex = (wordIndex + 1) % words.length;
      }
    }
    setTimeout(typeWriter, deleting ? 60 : 100);
  }
  setTimeout(typeWriter, 1200);
}

// ─── 5. STICKER PARALLAX on mouse move ──────────────────────────────────────
const stickers = document.querySelectorAll('.hero-stickers .sticker');
if (stickers.length && window.innerWidth > 768) {
  document.addEventListener('mousemove', (e) => {
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    const dx = (e.clientX - cx) / cx;
    const dy = (e.clientY - cy) / cy;

    stickers.forEach((s, i) => {
      const depth = (i % 4 + 1) * 6;
      s.style.transform = `translate(${dx * depth}px, ${dy * depth}px) rotate(${dx * 5}deg)`;
    });
  });
}

// ─── 6. STICKER CLICK burst ──────────────────────────────────────────────────
stickers.forEach(s => {
  s.addEventListener('click', () => {
    s.style.transform = 'scale(1.5) rotate(20deg)';
    s.style.transition = 'transform 0.2s cubic-bezier(.34,1.56,.64,1)';
    setTimeout(() => {
      s.style.transform = '';
      s.style.transition = '';
    }, 400);
    spawnConfettiAt(s);
  });
});

// ─── 7. COUNTER ANIMATION for badges ────────────────────────────────────────
function animateCounter(el, end, suffix) {
  let start = 0;
  const duration = 1200;
  const step = duration / end;
  const timer = setInterval(() => {
    start++;
    el.textContent = start + suffix;
    if (start >= end) clearInterval(timer);
  }, step);
}

const badgeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const badges = entry.target.querySelectorAll('.badge');
      const targets = [
        { el: badges[0], end: 50, suffix: '+ Countries' },
        { el: badges[1], end: 500, suffix: '+ Lessons' },
      ];
      targets.forEach(({ el, end, suffix }) => {
        if (el) {
          const icon = el.textContent.slice(0, 2);
          animateCounter({ set textContent(v) { el.textContent = icon + ' ' + v; } }, end, suffix);
        }
      });
      badgeObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

const heroBadges = document.querySelector('.hero-badges');
if (heroBadges) badgeObserver.observe(heroBadges);

// ─── 8. SCRAPBOOK PAGE FLIP on hover ────────────────────────────────────────
const bookPages = document.querySelectorAll('.book-page');
bookPages.forEach((page, i) => {
  page.addEventListener('mouseenter', () => {
    bookPages.forEach((p, j) => {
      p.style.transition = 'transform 0.4s cubic-bezier(.34,1.56,.64,1), z-index 0s';
      p.style.zIndex = j === i ? '10' : String(bookPages.length - j);
      p.style.transform = j === i
        ? 'rotate(0deg) scale(1.06)'
        : `rotate(${(j - i) * 5}deg)`;
    });
  });
  page.addEventListener('mouseleave', () => {
    const rotations = [-6, 2, 8];
    bookPages.forEach((p, j) => {
      p.style.transform = `rotate(${rotations[j] || 0}deg)`;
      p.style.zIndex = String(bookPages.length - j);
    });
  });
});

// ─── 9. HOW-IT-WORKS step-node hover ripple ─────────────────────────────────
document.querySelectorAll('.step-node').forEach(node => {
  node.addEventListener('click', () => {
    node.querySelector('.node-icon').style.transform = 'scale(1.3)';
    node.querySelector('.node-icon').style.transition = 'transform 0.3s cubic-bezier(.34,1.56,.64,1)';
    setTimeout(() => {
      node.querySelector('.node-icon').style.transform = '';
    }, 350);
  });
});

// ─── 10. PRICE CARD tilt on hover ───────────────────────────────────────────
document.querySelectorAll('.price-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `translate(-4px,-4px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg)`;
    card.style.transition = 'transform 0.1s ease';
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'transform 0.4s ease, box-shadow 0.2s';
  });
});

// ─── 11. CONFETTI BURST helper ───────────────────────────────────────────────
function spawnConfettiAt(el) {
  const rect = el.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  const colors = ['#FF6B9D','#FFD93D','#4ECDC4','#6BCB77','#9B59B6','#FF8C42'];
  const emojis = ['✨','⭐','🌟','💫','🎉','🎊'];

  for (let i = 0; i < 10; i++) {
    const piece = document.createElement('div');
    const useEmoji = Math.random() > 0.5;
    piece.style.cssText = `
      position:fixed; pointer-events:none; z-index:9999;
      left:${cx}px; top:${cy}px;
      font-size:${useEmoji ? 18 : 10}px;
      ${useEmoji ? '' : `width:10px;height:10px;border-radius:2px;background:${colors[i % colors.length]};`}
      transition: none;
    `;
    if (useEmoji) piece.textContent = emojis[i % emojis.length];
    document.body.appendChild(piece);

    const angle = (Math.PI * 2 * i) / 10;
    const dist = 60 + Math.random() * 80;
    const dx = Math.cos(angle) * dist;
    const dy = Math.sin(angle) * dist - 40;
    const rot = Math.random() * 720 - 360;

    piece.animate([
      { transform: 'translate(-50%,-50%) scale(1) rotate(0deg)', opacity: 1 },
      { transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) scale(0.3) rotate(${rot}deg)`, opacity: 0 }
    ], { duration: 700 + Math.random() * 400, easing: 'ease-out', fill: 'forwards' })
    .finished.then(() => piece.remove());
  }
}

// ─── 12. "Get Started" button pulse trail ───────────────────────────────────
const getStartedBtn = document.querySelector('.bounce-btn');
if (getStartedBtn) {
  getStartedBtn.addEventListener('click', (e) => {
    spawnConfettiAt(getStartedBtn);
  });
}

// ─── 13. MARQUEE pause on hover ─────────────────────────────────────────────
const marqueeTrack = document.querySelector('.marquee-track');
if (marqueeTrack) {
  marqueeTrack.addEventListener('mouseenter', () => {
    marqueeTrack.style.animationPlayState = 'paused';
  });
  marqueeTrack.addEventListener('mouseleave', () => {
    marqueeTrack.style.animationPlayState = 'running';
  });
}

// ─── 14. HERO BADGE wiggle on hover ─────────────────────────────────────────
document.querySelectorAll('.badge').forEach(badge => {
  badge.addEventListener('mouseenter', () => {
    badge.style.transform = 'rotate(-4deg) scale(1.08)';
    badge.style.transition = 'transform 0.2s cubic-bezier(.34,1.56,.64,1)';
  });
  badge.addEventListener('mouseleave', () => {
    badge.style.transform = '';
  });
});

// ─── 15. PAGE ENTRANCE animation ────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.4s ease';
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      document.body.style.opacity = '1';
    });
  });
});