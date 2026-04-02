/**
 * MediSwift Premium Cards - Cursor Magic Engine
 * 3D Tilt + Cursor Spotlight + Particle FX + Entrance Animations
 */
(function() {
  'use strict';

  /* ─── Card data ─── */
  const cardData = [
    { index: 1, color: 'rgba(255,80,80,0.25)',   particle: '#ff7050' },
    { index: 2, color: 'rgba(63,188,192,0.25)',  particle: '#3fbcc0' },
    { index: 3, color: 'rgba(160,100,255,0.25)', particle: '#c084fc' },
    { index: 4, color: 'rgba(255,200,50,0.25)',  particle: '#fbbf24' },
  ];

  /* ─── Wait for DOM ─── */
  document.addEventListener('DOMContentLoaded', init);

  function init() {
    const section = document.querySelector('.featured-services');
    if (!section) return;

    /* Inject section title */
    injectSectionTitle(section);

    /* Get all cards */
    const cards = section.querySelectorAll('.icon-box');

    cards.forEach((card, i) => {
      const data = cardData[i] || cardData[0];
      card.setAttribute('data-card', data.index);

      /* Inject floating particles */
      injectParticles(card, data.particle);

      /* ── Mouse Enter: start tracking ── */
      card.addEventListener('mouseenter', (e) => {
        card.style.transition = 'box-shadow 0.15s ease';
      });

      /* ── Mouse Move: 3D tilt + spotlight ── */
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const w = rect.width;
        const h = rect.height;

        /* Tilt calculation — max ±12deg */
        const tiltX = ((y / h) - 0.5) * -14;
        const tiltY = ((x / w) - 0.5) * 14;

        /* Apply 3D tilt */
        card.style.transform = `perspective(900px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.035)`;

        /* Cursor spotlight position */
        card.style.setProperty('--mouse-x', x + 'px');
        card.style.setProperty('--mouse-y', y + 'px');

        /* Dynamic shadow follows cursor */
        const shadowX = (x / w - 0.5) * 20;
        const shadowY = (y / h - 0.5) * 20;
        card.style.boxShadow = `
          ${shadowX}px ${shadowY + 20}px 60px ${data.color},
          0 8px 32px rgba(0,0,0,0.5),
          inset 0 1px 0 rgba(255,255,255,0.1)
        `;
      });

      /* ── Mouse Leave: reset ── */
      card.addEventListener('mouseleave', () => {
        card.style.transition = 'transform 0.6s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.5s ease';
        card.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) scale(1)';
        card.style.boxShadow = '0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)';
      });
    });

    /* ── Entrance animations on scroll ── */
    setupScrollReveal(cards);
  }

  /* ── Inject premium section title ── */
  function injectSectionTitle(section) {
    const container = section.querySelector('.container');
    if (!container) return;

    // Check if title already injected
    if (section.querySelector('.featured-services-title')) return;

    const titleDiv = document.createElement('div');
    titleDiv.className = 'featured-services-title';
    titleDiv.innerHTML = `
      <div style="font-size:12px;font-weight:700;letter-spacing:4px;color:#3fbcc0;text-transform:uppercase;margin-bottom:10px;">
        ◈ Our Core Services
      </div>
      <h2 style="font-size:38px;font-weight:800;color:#fff;letter-spacing:-1px;margin-bottom:12px;">
        Everything You Need for <span style="background:linear-gradient(135deg,#3fbcc0,#00dfe4);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;">Better Health</span>
      </h2>
      <p style="color:rgba(180,220,222,0.7);font-size:16px;max-width:520px;margin:0 auto;">
        Access world-class healthcare services from the comfort of your home.
      </p>
    `;
    container.insertBefore(titleDiv, container.firstChild);
  }



  /* ── Inject floating glowing particles ── */
  function injectParticles(card, color) {
    const count = 5;
    for (let i = 0; i < count; i++) {
      const p = document.createElement('div');
      p.className = 'card-particle';

      const size = Math.random() * 40 + 10;
      const left = Math.random() * 90;
      const delay = Math.random() * 4;
      const duration = Math.random() * 6 + 5;

      p.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        left: ${left}%;
        bottom: -${size}px;
        background: radial-gradient(circle, ${color}, transparent);
        animation-duration: ${duration}s;
        animation-delay: ${delay}s;
      `;

      card.appendChild(p);
    }
  }

  /* ── Scroll-reveal entrance animation ── */
  function setupScrollReveal(cards) {
    // Set initial hidden state
    cards.forEach((card, i) => {
      card.style.opacity = '0';
      card.style.transform = 'perspective(900px) translateY(50px) scale(0.95)';
      card.style.transition = `opacity 0.7s ease ${i * 0.12}s, transform 0.7s cubic-bezier(0.34,1.56,0.64,1) ${i * 0.12}s`;
    });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const card = entry.target;
          card.style.opacity = '1';
          card.style.transform = 'perspective(900px) translateY(0) scale(1)';
          observer.unobserve(card);
        }
      });
    }, { threshold: 0.15 });

    cards.forEach(card => observer.observe(card));
  }

})();
