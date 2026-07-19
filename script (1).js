document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Footer year ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Mobile nav toggle ---------- */
  const navToggle = document.getElementById('navToggle');
  const mainNav = document.getElementById('mainNav');

  if (navToggle && mainNav) {
    navToggle.addEventListener('click', () => {
      const isOpen = mainNav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    mainNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mainNav.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- Sticky header shadow on scroll ---------- */
  const header = document.getElementById('siteHeader');
  const backToTop = document.getElementById('backToTop');

  const onScroll = () => {
    const scrolled = window.scrollY > 12;
    if (header) header.classList.toggle('scrolled', scrolled);
    if (backToTop) backToTop.classList.toggle('visible', window.scrollY > 700);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------- News notices (static data rendered client-side) ---------- */
  const notices = [
    {
      tag: 'Academics',
      date: '14 July 2026',
      title: 'WAEC and NECO results, class of 2026',
      excerpt: 'This year\u2019s SSS3 leavers recorded the school\u2019s highest average result in a decade, with 38 students earning admission into Nigerian and international universities.'
    },
    {
      tag: 'Sport',
      date: '2 July 2026',
      title: 'Fenwick House retains the Founders\u2019 Cup',
      excerpt: 'A closely fought inter-house athletics finals saw Fenwick edge Lancaster by six points on the final relay of the day.'
    },
    {
      tag: 'Service',
      date: '21 June 2026',
      title: 'Graduating class service term begins in September',
      excerpt: 'SSS3 students will spend one day a week at partner charities and local nurseries as part of their graduation requirement.'
    },
    {
      tag: 'Community',
      date: '9 June 2026',
      title: 'Open Day dates announced for the new session',
      excerpt: 'Prospective families are invited to tour the campus, meet class teachers, and sit in on a live lesson across three dates this term.'
    },
    {
      tag: 'Arts',
      date: '30 May 2026',
      title: 'Third Term production: A Midsummer Night\u2019s Dream',
      excerpt: 'Auditions open to all classes next month; rehearsals begin the first week of Third Term in the Marlowe Hall.'
    },
    {
      tag: 'Admissions',
      date: '18 May 2026',
      title: 'Scholarship applications for the 2026/27 session now open',
      excerpt: 'Means-tested scholarships covering up to 100% of fees are available for Primary and Secondary entry; the deadline for applications is in October.'
    }
  ];

  const newsGrid = document.getElementById('newsGrid');
  if (newsGrid) {
    newsGrid.innerHTML = notices.map(n => `
      <article class="news-card reveal">
        <span class="news-tag">${n.tag}</span>
        <h3>${n.title}</h3>
        <p class="news-date">${n.date}</p>
        <p class="news-excerpt">${n.excerpt}</p>
      </article>
    `).join('');
  }

  /* ---------- Admissions form (front-end only) ---------- */
  const form = document.getElementById('admissionsForm');
  const status = document.getElementById('formStatus');

  if (form && status) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      if (!form.checkValidity()) {
        status.textContent = 'Please complete every field before submitting.';
        status.style.color = '#E4C766';
        form.reportValidity();
        return;
      }

      const name = document.getElementById('parentName').value.trim();
      status.textContent = `Thank you, ${name}. The admissions team will email your prospectus shortly.`;
      status.style.color = '#E4C766';
      form.reset();
    });
  }

  /* ---------- Reduced motion check ---------- */
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length && !prefersReducedMotion) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

    revealEls.forEach((el, i) => {
      el.style.transitionDelay = `${(i % 4) * 70}ms`;
      revealObserver.observe(el);
    });
  } else {
    revealEls.forEach(el => el.classList.add('in-view'));
  }

  /* ---------- Animated stat counters ---------- */
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length) {
    const animateCount = (el) => {
      const target = parseInt(el.getAttribute('data-count'), 10);
      if (prefersReducedMotion) {
        el.textContent = target.toLocaleString('en-US');
        return;
      }
      const duration = 1200;
      const start = performance.now();
      const step = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(target * eased).toLocaleString('en-US');
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };

    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });

    counters.forEach(el => counterObserver.observe(el));
  }

  /* ---------- Active nav link on scroll ---------- */
  const navLinks = document.querySelectorAll('.main-nav a[href^="#"]');
  const sections = Array.from(navLinks)
    .map(link => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  if (sections.length) {
    const setActiveLink = (id) => {
      navLinks.forEach(link => {
        link.classList.toggle('active-link', link.getAttribute('href') === `#${id}`);
      });
    };

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) setActiveLink(entry.target.id);
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

    sections.forEach(section => sectionObserver.observe(section));
  }

});
