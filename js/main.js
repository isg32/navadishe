// Registration submissions go through /api/register (a Vercel serverless
// function) rather than hitting the Apps Script URL directly from the
// browser — see README.md for how to set APPS_SCRIPT_URL.

// Mobile menu toggle
const burger = document.getElementById('burgerBtn');
const mobileMenu = document.getElementById('mobileMenu');
if (burger && mobileMenu) {
  burger.addEventListener('click', () => {
    const isOpen = mobileMenu.style.display !== 'none';
    mobileMenu.style.display = isOpen ? 'none' : 'block';
    burger.setAttribute('aria-expanded', String(!isOpen));
  });
  mobileMenu.querySelectorAll('a').forEach((a) => {
    a.addEventListener('click', () => {
      mobileMenu.style.display = 'none';
    });
  });
}

// Scroll reveal
const revealEls = document.querySelectorAll('.reveal');
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  revealEls.forEach((el) => el.classList.add('in'));
} else {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.01, rootMargin: '0px 0px 15% 0px' }
  );
  revealEls.forEach((el) => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.88 && rect.bottom > 0) {
      el.classList.add('in');
    } else {
      io.observe(el);
    }
  });
}

// Registration form submission
const form = document.getElementById('registerForm');
const statusEl = document.getElementById('formStatus');

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Honeypot: if this hidden field got filled, it's a bot — silently stop
    if (form.website && form.website.value) return;

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalLabel = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting…';

    const formData = new FormData(form);

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok || data.result === 'error') {
        throw new Error(data.error || 'Request failed');
      }

      form.hidden = true;
      statusEl.hidden = false;
      statusEl.className = 'form-status success';
      statusEl.innerHTML =
        "Thank you! Your school's registration has been received. Our team will reach out shortly.";
    } catch (err) {
      statusEl.hidden = false;
      statusEl.className = 'form-status error';
      statusEl.textContent =
        'Something went wrong sending your registration. Please try again in a moment.';
      submitBtn.disabled = false;
      submitBtn.textContent = originalLabel;
    }
  });
}
