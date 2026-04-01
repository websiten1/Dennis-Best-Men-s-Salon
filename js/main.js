/* ============================================================
   Dennis Best Men's Salon — Main JavaScript
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Nav: scroll effect ──────────────────────────────────── */
  const nav = document.querySelector('.nav');
  const onScroll = () => {
    if (window.scrollY > 40) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ── Nav: hamburger ──────────────────────────────────────── */
  const hamburger    = document.querySelector('.nav__hamburger');
  const mobileMenu   = document.querySelector('.nav__mobile');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('open');
      hamburger.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close on outside click
    document.addEventListener('click', e => {
      if (!nav.contains(e.target)) {
        mobileMenu.classList.remove('open');
        hamburger.classList.remove('open');
        document.body.style.overflow = '';
      }
    });

    // Close on link click
    mobileMenu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        hamburger.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  /* ── Active nav link ─────────────────────────────────────── */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__links a, .nav__mobile a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });

  /* ── Hero bg Ken Burns ───────────────────────────────────── */
  const heroBg = document.querySelector('.hero__bg');
  if (heroBg) {
    setTimeout(() => heroBg.classList.add('loaded'), 100);
  }

  /* ── Scroll Reveal ───────────────────────────────────────── */
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

  /* ── Testimonials Carousel ───────────────────────────────── */
  const track  = document.querySelector('.testimonials__track');
  const dots   = document.querySelectorAll('.testimonials__dot');
  const prevBtn = document.querySelector('.testimonials__arrow.prev');
  const nextBtn = document.querySelector('.testimonials__arrow.next');

  if (track) {
    let current = 0;
    const slides = track.querySelectorAll('.testimonials__slide');
    const total  = slides.length;
    let autoTimer;

    const goTo = (idx) => {
      current = (idx + total) % total;
      track.style.transform = `translateX(-${current * 100}%)`;
      dots.forEach((d, i) => d.classList.toggle('active', i === current));
    };

    const startAuto = () => {
      clearInterval(autoTimer);
      autoTimer = setInterval(() => goTo(current + 1), 5000);
    };

    if (prevBtn) prevBtn.addEventListener('click', () => { goTo(current - 1); startAuto(); });
    if (nextBtn) nextBtn.addEventListener('click', () => { goTo(current + 1); startAuto(); });

    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => { goTo(i); startAuto(); });
    });

    // Touch/swipe
    let touchStartX = 0;
    track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', e => {
      const dx = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(dx) > 50) { goTo(dx < 0 ? current + 1 : current - 1); startAuto(); }
    });

    goTo(0);
    startAuto();
  }

  /* ── Gallery Lightbox ────────────────────────────────────── */
  const lightbox    = document.querySelector('.lightbox');
  const lbImg       = document.querySelector('.lightbox__img');
  const lbClose     = document.querySelector('.lightbox__close');
  const lbPrev      = document.querySelector('.lightbox__prev');
  const lbNext      = document.querySelector('.lightbox__next');
  const lbCounter   = document.querySelector('.lightbox__counter');
  const galleryItems = document.querySelectorAll('.gallery__item');

  if (lightbox && galleryItems.length) {
    let lbIndex = 0;
    const srcs  = Array.from(galleryItems).map(el => el.querySelector('img').src);

    const openLb = (idx) => {
      lbIndex = (idx + srcs.length) % srcs.length;
      lbImg.src = srcs[lbIndex];
      if (lbCounter) lbCounter.textContent = `${lbIndex + 1} / ${srcs.length}`;
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
    };

    const closeLb = () => {
      lightbox.classList.remove('open');
      document.body.style.overflow = '';
    };

    galleryItems.forEach((item, i) => {
      item.addEventListener('click', () => openLb(i));
    });

    if (lbClose)  lbClose.addEventListener('click', closeLb);
    if (lbPrev)   lbPrev.addEventListener('click', () => openLb(lbIndex - 1));
    if (lbNext)   lbNext.addEventListener('click', () => openLb(lbIndex + 1));

    lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLb(); });

    document.addEventListener('keydown', e => {
      if (!lightbox.classList.contains('open')) return;
      if (e.key === 'Escape')      closeLb();
      if (e.key === 'ArrowLeft')   openLb(lbIndex - 1);
      if (e.key === 'ArrowRight')  openLb(lbIndex + 1);
    });
  }

  /* ── Gallery scroll-in animation ────────────────────────── */
  const galleryObs = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 60);
        galleryObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.05 });

  document.querySelectorAll('.gallery__item').forEach(el => galleryObs.observe(el));

  /* ── Contact Form ────────────────────────────────────────── */
  const form = document.querySelector('.contact-form form');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const btn  = form.querySelector('.form-submit');
      const orig = btn.textContent;
      btn.textContent = 'Sending…';
      btn.disabled = true;

      setTimeout(() => {
        form.reset();
        btn.textContent = orig;
        btn.disabled = false;
        const success = document.querySelector('.form-success');
        if (success) {
          success.style.display = 'block';
          setTimeout(() => { success.style.display = 'none'; }, 5000);
        }
      }, 1200);
    });
  }

  /* ── Smooth anchor scroll offset ────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const top = target.getBoundingClientRect().top + window.scrollY - 90;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

});
