/* ═══════════════════════════════════════════════
   ADNAN PORTFOLIO — script.js
   ═══════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  // ── NAV SCROLL STATE ──────────────────────────
  const nav = document.getElementById('nav');
  const onScroll = () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ── MOBILE HAMBURGER ─────────────────────────
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('nav-active');
    hamburger.classList.toggle('toggle');
    document.body.style.overflow = navLinks.classList.contains('nav-active') ? 'hidden' : '';
  });

  // ── SMOOTH SCROLL + CLOSE MENU ────────────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      navLinks.classList.remove('nav-active');
      hamburger.classList.remove('toggle');
      document.body.style.overflow = '';
      target.scrollIntoView({ behavior: 'smooth' });
    });
  });

  // ── INTERSECTION OBSERVER — SECTIONS ─────────
  const sections = document.querySelectorAll('.section');
  const sectionObserver = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      });
    },
    { threshold: 0.08 }
  );
  sections.forEach(s => sectionObserver.observe(s));

  // ── COUNTER ANIMATION ─────────────────────────
  const statNums = document.querySelectorAll('.stat-num[data-target]');
  let countersStarted = false;

  function animateCounters() {
    if (countersStarted) return;
    countersStarted = true;
    statNums.forEach(el => {
      const target = parseInt(el.dataset.target, 10);
      const duration = 1800;
      const start = performance.now();
      const step = (now) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(eased * target);
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = target;
      };
      requestAnimationFrame(step);
    });
  }

  const heroObserver = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting) animateCounters();
    },
    { threshold: 0.3 }
  );
  const heroSection = document.getElementById('hero');
  if (heroSection) heroObserver.observe(heroSection);

  // ── PARTICLE CANVAS ───────────────────────────
  const canvas = document.getElementById('particleCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let W, H, particles = [];
    const PARTICLE_COUNT = 80;

    const resize = () => {
      W = canvas.width  = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener('resize', resize, { passive: true });
    resize();

    class Particle {
      constructor() { this.reset(); }
      reset() {
        this.x  = Math.random() * W;
        this.y  = Math.random() * H;
        this.vx = (Math.random() - 0.5) * 0.3;
        this.vy = (Math.random() - 0.5) * 0.3;
        this.r  = Math.random() * 1.4 + 0.3;
        this.alpha = Math.random() * 0.4 + 0.1;
        this.hue = Math.random() > 0.6 ? 185 : (Math.random() > 0.5 ? 270 : 160);
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${this.hue}, 100%, 65%, ${this.alpha})`;
        ctx.fill();
      }
    }

    for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());

    const drawLines = () => {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(0,229,255,${0.04 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
    };

    const loop = () => {
      ctx.clearRect(0, 0, W, H);
      particles.forEach(p => { p.update(); p.draw(); });
      drawLines();
      requestAnimationFrame(loop);
    };
    loop();
  }

  // ── CONTACT FORM ─────────────────────────────
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const btn = document.getElementById('formSubmitBtn');
      const span = btn.querySelector('span');
      span.textContent = 'Sending…';
      btn.disabled = true;

      // Simulate send (replace with your EmailJS or backend call)
      setTimeout(() => {
        span.textContent = '✓ Message Sent!';
        btn.style.background = 'linear-gradient(135deg, #22d3a0 0%, #0d9b72 100%)';
        contactForm.reset();
        setTimeout(() => {
          span.textContent = 'Send Message';
          btn.style.background = '';
          btn.disabled = false;
        }, 3500);
      }, 1200);
    });
  }

  // ── SKILL CARD STAGGER ───────────────────────
  const skillCards = document.querySelectorAll('.skill-card');
  const cardObserver = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const idx = parseInt(entry.target.dataset.index, 10) || 0;
        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }, idx * 80);
        obs.unobserve(entry.target);
      });
    },
    { threshold: 0.1 }
  );
  skillCards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(24px)';
    card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    cardObserver.observe(card);
  });

});
