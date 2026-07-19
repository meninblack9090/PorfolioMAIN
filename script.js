/* ============================================================
   UMALAY PORTFOLIO — script.js
   ============================================================ */

'use strict';

/* =====================
   DARK / LIGHT MODE TOGGLE
   ===================== */
(function () {
  const html = document.documentElement;
  const saved = localStorage.getItem('theme') || 'light';
  html.setAttribute('data-theme', saved);

  window.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('theme-toggle-btn');
    if (!btn) return;
    btn.addEventListener('click', () => {
      const isDark = html.getAttribute('data-theme') === 'dark';
      const next = isDark ? 'light' : 'dark';
      html.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
    });
  });
})();

/* =====================
   NAVBAR: scroll effect + active link
   ===================== */
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');

// Flags declared early to avoid temporal dead zone errors
let countersAnimated = false;
let skillsAnimated = false;

function onScroll() {
  // Scrolled class for blur/bg effect
  navbar.classList.toggle('scrolled', window.scrollY > 20);

  // Scroll-to-top visibility
  scrollTopBtn.classList.toggle('visible', window.scrollY > 400);

  // Active nav link based on section in view
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 90;
    if (window.scrollY >= sectionTop) {
      current = section.getAttribute('id');
    }
  });
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });

  // Reveal animations
  revealOnScroll();
  animateSkills();
}

window.addEventListener('scroll', onScroll, { passive: true });
// onScroll() called after scrollTopBtn is declared below

/* =====================
   HAMBURGER MENU
   ===================== */
const hamburger = document.getElementById('hamburger-btn');
const navLinksContainer = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinksContainer.classList.toggle('open');
});

// Close menu on link click
navLinksContainer.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinksContainer.classList.remove('open');
  });
});

/* =====================
   SCROLL TO TOP
   ===================== */
const scrollTopBtn = document.getElementById('scroll-top-btn');
scrollTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});
onScroll(); // safe to call now that scrollTopBtn exists

/* =====================
   ANIMATED COUNTERS (stats bar)
   ===================== */

function animateCounters() {
  if (countersAnimated) return;
  const statEls = document.querySelectorAll('.stat-number[data-target]');
  const statsBar = document.getElementById('stats-bar');
  if (!statsBar) return;
  const rect = statsBar.getBoundingClientRect();
  if (rect.top < window.innerHeight * 0.9) {
    countersAnimated = true;
    statEls.forEach(el => {
      const target = parseInt(el.dataset.target, 10);
      const duration = 1500;
      const step = Math.ceil(target / (duration / 16));
      let current = 0;
      const timer = setInterval(() => {
        current = Math.min(current + step, target);
        el.textContent = current;
        if (current >= target) clearInterval(timer);
      }, 16);
    });
  }
}

window.addEventListener('scroll', animateCounters, { passive: true });
animateCounters();

/* =====================
   SKILLS ANIMATION
   ===================== */

function animateSkills() {
  if (skillsAnimated) return;
  const skillsSection = document.getElementById('about');
  if (!skillsSection) return;
  const rect = skillsSection.getBoundingClientRect();
  if (rect.top < window.innerHeight * 0.8) {
    skillsAnimated = true;
    document.querySelectorAll('.skill-fill').forEach(bar => {
      const w = bar.dataset.width + '%';
      setTimeout(() => { bar.style.width = w; }, 200);
    });
  }
}

/* =====================
   SCROLL REVEAL
   ===================== */
// Add 'reveal' class to elements we want to animate in
const revealTargets = [
  '.service-card',
  '.portfolio-card',
  '.about-img-wrapper',
  '.about-text-side',
  '.contact-info',
  '.contact-form',
  '.section-header',
];

revealTargets.forEach(selector => {
  document.querySelectorAll(selector).forEach((el, i) => {
    el.classList.add('reveal');
    el.style.transitionDelay = `${i * 0.08}s`;
  });
});

function revealOnScroll() {
  document.querySelectorAll('.reveal').forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.88) {
      el.classList.add('visible');
    }
  });
}

revealOnScroll();

/* =====================
   PORTFOLIO FILTER
   ===================== */
const filterBtns = document.querySelectorAll('.filter-btn');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;

    // Re-render cards with the active filter
    renderCards(filter);
  });
});




/* =====================
   SMOOTH HOVER — hero profile
   ===================== */
const heroCircle = document.querySelector('.hero-circle');
if (heroCircle) {
  heroCircle.style.transition = 'box-shadow 0.35s ease';
  heroCircle.addEventListener('mouseenter', () => {
    heroCircle.style.boxShadow = '0 0 100px rgba(255,107,0,0.45), 0 0 0 4px rgba(255,107,0,0.4)';
  });
  heroCircle.addEventListener('mouseleave', () => {
    heroCircle.style.boxShadow = '0 0 60px rgba(255,107,0,0.2), 0 0 0 3px rgba(255,107,0,0.15)';
  });
}

/* =====================
   NAV LINK SMOOTH SCROLL
   (fallback for older browsers)
   ===================== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    const target = document.querySelector(targetId);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

/* =====================
   TYPING EFFECT — hero title
   ===================== */
const heroTitle = document.querySelector('.hero-title');
if (heroTitle) {
  const words = ['Web Development', 'App Development', 'UI/UX Design', 'Graphic Design'];
  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingTimeout;

  // Only start after initial animation
  setTimeout(() => {
    heroTitle.textContent = '';
    type();
  }, 1200);

  function type() {
    const current = words[wordIndex];
    if (!isDeleting) {
      heroTitle.textContent = current.slice(0, ++charIndex);
      if (charIndex === current.length) {
        isDeleting = true;
        typingTimeout = setTimeout(type, 2000);
        return;
      }
    } else {
      heroTitle.textContent = current.slice(0, --charIndex);
      if (charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        typingTimeout = setTimeout(type, 300);
        return;
      }
    }
    typingTimeout = setTimeout(type, isDeleting ? 60 : 90);
  }

  // Add blinking cursor
  const cursor = document.createElement('span');
  cursor.textContent = '|';
  cursor.style.cssText = 'color: #FF6B00; animation: blink 1s step-end infinite; margin-left: 2px;';
  heroTitle.insertAdjacentElement('afterend', cursor);

  const blinkStyle = document.createElement('style');
  blinkStyle.textContent = `@keyframes blink { 50% { opacity: 0; } }`;
  document.head.appendChild(blinkStyle);
}

console.log('%cUmalay Portfolio 🎨', 'color:#FF6B00;font-size:1.2rem;font-weight:bold;');
console.log('%cCrafted with ❤️ and creativity', 'color:#aaa;font-size:0.9rem;');

/* =====================
   PROJECT DATA + CARDS
   ===================== */
const PROJECTS = [
  {
    id: 'cyber',
    title: 'Secure Login System',
    tag: 'Cybersecurity',
    tagClass: 'tag-cyber',
    category: 'web',
    img: 'assets/Cyber security.png',
    desc: 'A full-featured secure authentication system implementing industry-standard cryptographic techniques. Features SHA-256 password hashing with dynamic salting and peppering, real-time password strength meter, and both a static HTML/localStorage version and a PHP/MySQL backend version.',
    tech: ['HTML5', 'CSS3', 'JavaScript', 'PHP', 'MySQL', 'SHA-256'],
    features: [
      { icon: 'fas fa-lock',          text: 'SHA-256 hashing with salting & peppering' },
      { icon: 'fas fa-tachometer-alt', text: 'Real-time password strength meter' },
      { icon: 'fas fa-database',      text: 'PHP/MySQL backend + localStorage fallback' },
      { icon: 'fas fa-shield-alt',    text: 'Brute-force protection & session management' },
    ],
    github: 'https://github.com/meninblack9090/CyberProj',
    demo: '#',
  },
  {
    id: 'derma',
    title: 'DermaLink',
    tag: 'Health Tech',
    tagClass: 'tag-health',
    category: 'web',
    img: 'assets/Dermalink.png',
    desc: 'A skin health platform connecting users with certified dermatologists for AI-assisted assessments. Features a mock AI face scan for acne & skin analysis, specialist booking system, and a built-in HTML5 audio music player for a calming user experience.',
    tech: ['React', 'Node.js', 'HTML5 Audio', 'CSS3', 'JavaScript', 'Canvas API'],
    features: [
      { icon: 'fas fa-microscope',    text: 'Mock AI face scan & skin condition analysis' },
      { icon: 'fas fa-calendar-check', text: 'Specialist booking & appointment system' },
      { icon: 'fas fa-music',         text: 'Shuffle-based HTML5 audio music player' },
      { icon: 'fas fa-user-md',       text: 'Dermatologist profile directory' },
    ],
    github: '#',
    demo: '#',
  },
  {
    id: 'eco',
    title: 'CapWeb / CapCV',
    tag: 'Computer Vision',
    tagClass: 'tag-env',
    category: 'mobile',
    img: 'assets/Ecowaste.png',
    desc: 'A smart waste classification and environmental impact tracking system powered by YOLO object detection. Classifies waste into multiple categories in real-time, tracks CO₂ savings, and stores data in Supabase for analytics and leaderboard features.',
    tech: ['Python', 'YOLO', 'Supabase', 'Flutter', 'Django', 'OpenCV'],
    features: [
      { icon: 'fas fa-camera',      text: 'Real-time YOLO waste detection & classification' },
      { icon: 'fas fa-leaf',        text: 'CO₂ savings tracker & environmental dashboard' },
      { icon: 'fas fa-layer-group', text: 'Multi-category waste classification' },
      { icon: 'fas fa-cloud',       text: 'Supabase backend for data persistence' },
    ],
    github: '#',
    demo: '#',
  },
];

const grid = document.getElementById('portfolio-grid');

function renderCards(filter = 'all') {
  grid.innerHTML = '';
  const filtered = filter === 'all' ? PROJECTS : PROJECTS.filter(p => p.category === filter);
  filtered.forEach((p, i) => {
    const card = document.createElement('div');
    card.className = 'pj-card reveal';
    card.style.transitionDelay = `${i * 0.1}s`;
    card.setAttribute('data-id', p.id);
    card.setAttribute('data-category', p.category);
    card.innerHTML = `
      <div class="pj-card-thumb">
        <img src="${p.img}" alt="${p.title}" loading="lazy" />
        <div class="pj-card-thumb-hover">
          <i class="fas fa-expand-alt"></i> View Project
        </div>
      </div>
      <div class="pj-card-body">
        <p class="pj-card-title">${p.title}</p>
        <span class="pj-card-tag ${p.tagClass}">${p.tag}</span>
      </div>
    `;
    card.addEventListener('click', () => openProjectModal(p));
    grid.appendChild(card);
    // Trigger reveal animation
    requestAnimationFrame(() => {
      requestAnimationFrame(() => card.classList.add('visible'));
    });
  });
}

renderCards();

/* =====================
   PROJECT MODAL
   ===================== */
const overlay   = document.getElementById('pj-overlay');
const pjModal   = document.getElementById('pj-modal');
const pjClose   = document.getElementById('pj-close');
const pjHeroImg = document.getElementById('pj-hero-img');
const pjTag     = document.getElementById('pj-tag');
const pjTitle   = document.getElementById('pj-title');
const pjDesc    = document.getElementById('pj-desc');
const pjTech    = document.getElementById('pj-tech');
const pjFeatures = document.getElementById('pj-features');
const pjGithub  = document.getElementById('pj-github');
const pjDemo    = document.getElementById('pj-demo');

function openProjectModal(p) {
  // Populate
  pjHeroImg.src = p.img;
  pjHeroImg.alt = p.title;
  pjTag.textContent = p.tag;
  pjTag.className = `pj-tag ${p.tagClass}`;
  pjTitle.textContent = p.title;
  pjDesc.textContent = p.desc;

  pjTech.innerHTML = p.tech.map(t => `<span class="pj-badge">${t}</span>`).join('');

  pjFeatures.innerHTML = p.features.map(f => `
    <li class="pj-feature-item">
      <i class="${f.icon}"></i>
      <span>${f.text}</span>
    </li>
  `).join('');

  pjGithub.href = p.github;
  pjDemo.href = p.demo;
  pjGithub.style.display = (!p.github || p.github === '#') ? 'none' : 'inline-flex';
  pjDemo.style.display   = (!p.demo   || p.demo   === '#') ? 'none' : 'inline-flex';

  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
  pjModal.scrollTop = 0;
  setTimeout(() => pjClose.focus(), 50);
}

function closeProjectModal() {
  overlay.classList.remove('open');
  document.body.style.overflow = '';
  setTimeout(() => { pjHeroImg.src = ''; }, 300);
}

pjClose.addEventListener('click', closeProjectModal);
overlay.addEventListener('click', e => { if (e.target === overlay) closeProjectModal(); });
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && overlay.classList.contains('open')) closeProjectModal();
});


