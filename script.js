/* ===========================================================
   LUCIEN ACADEMY — SHARED SCRIPT
   Every block is null-guarded so it works on any page.
   =========================================================== */

// ── Navbar scroll ──
const navbar = document.getElementById('navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });
}

// ── Hamburger / mobile nav ──
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobileNav');
if (hamburger && mobileNav) {
  hamburger.addEventListener('click', () => {
    mobileNav.classList.toggle('open');
    hamburger.classList.toggle('active');
  });
  mobileNav.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      mobileNav.classList.remove('open');
      hamburger.classList.remove('active');
    });
  });
}

// ── FAQ accordion ──
document.querySelectorAll('.faq-question').forEach(q => {
  q.addEventListener('click', () => {
    const item = q.parentElement;
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
  });
});

// ── Scroll reveal ──
const reveals = document.querySelectorAll('.reveal');
if (reveals.length) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -60px 0px' });
  reveals.forEach(el => revealObserver.observe(el));
}

// ── Newsletter ──
function handleSubscribe(e) {
  e.preventDefault();
  const btn = e.target.querySelector('button');
  const input = e.target.querySelector('input');
  btn.textContent = 'Subscribed';
  btn.style.background = 'var(--green-accent)';
  input.value = '';
  setTimeout(() => { btn.textContent = 'Subscribe'; btn.style.background = ''; }, 3000);
}

// ── Smooth scroll for on-page anchors ──
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    if (href === '#' || href.length < 2) return;
    const target = document.querySelector(href);
    if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  });
});

// ── MODAL ──
const modalOverlay = document.getElementById('modalOverlay');
const modalConfigs = {
  enroll:    { eyebrow: 'Enrollment Inquiry', title: 'Enroll Your Child', sub: "Tell us about your child and which program interests you. We'll reach out to find the perfect fit.", subject: 'Program Enrollment' },
  workshop:  { eyebrow: 'Workshop Booking', title: 'Book a Workshop', sub: "Tell us about your school or organization and we'll help arrange the perfect workshop for your group.", subject: 'Workshop Booking' },
  bilingual: { eyebrow: 'Bilingual Programs', title: 'Bilingual Program Info', sub: "Interested in our French or bilingual programs? Fill out the form and we'll get back to you with details.", subject: 'Bilingual Programs' },
  franchise: { eyebrow: 'Partnership Inquiry', title: 'Become a Partner', sub: "Interested in bringing Lucien Academy to your community? Share your details and we'll be in touch.", subject: 'Franchise & Partnership' }
};

function openModal(type) {
  if (!modalOverlay) return;
  const config = modalConfigs[type] || modalConfigs.enroll;
  document.getElementById('modalEyebrow').textContent = config.eyebrow;
  document.getElementById('modalTitle').textContent = config.title;
  document.getElementById('modalSub').textContent = config.sub;
  const subjectSelect = document.getElementById('m-subject');
  if (subjectSelect) for (let opt of subjectSelect.options) { if (opt.value === config.subject) { opt.selected = true; break; } }
  document.getElementById('modalFormContent').style.display = '';
  document.getElementById('modalFormSuccess').classList.remove('show');
  document.getElementById('modalContactForm').reset();
  clearModalErrors();
  modalOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  if (!modalOverlay) return;
  modalOverlay.classList.remove('open');
  document.body.style.overflow = '';
}

if (modalOverlay) {
  const modalClose = document.getElementById('modalClose');
  if (modalClose) modalClose.addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', (e) => { if (e.target === modalOverlay) closeModal(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && modalOverlay.classList.contains('open')) closeModal(); });
}

// ── Validation helpers ──
function validateEmail(email) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); }

function setFieldError(input, errEl, show) {
  if (!input) return;
  if (show) { input.classList.add('error'); if (errEl) errEl.classList.add('show'); }
  else { input.classList.remove('error'); if (errEl) errEl.classList.remove('show'); }
}

function clearModalErrors() {
  ['m-name','m-email','m-phone','m-subject','m-message'].forEach(id => {
    const el = document.getElementById(id);
    const err = document.getElementById(id + '-err');
    if (el) el.classList.remove('error');
    if (err) err.classList.remove('show');
  });
}

function validateForm(prefix) {
  let valid = true;
  const name = document.getElementById(prefix + 'name');
  const email = document.getElementById(prefix + 'email');
  const phone = document.getElementById(prefix + 'phone');
  const subject = document.getElementById(prefix + 'subject');
  const message = document.getElementById(prefix + 'message');
  setFieldError(name, document.getElementById(prefix + 'name-err'), !name.value.trim()); if (!name.value.trim()) valid = false;
  setFieldError(email, document.getElementById(prefix + 'email-err'), !validateEmail(email.value.trim())); if (!validateEmail(email.value.trim())) valid = false;
  setFieldError(phone, document.getElementById(prefix + 'phone-err'), !phone.value.trim()); if (!phone.value.trim()) valid = false;
  setFieldError(subject, document.getElementById(prefix + 'subject-err'), !subject.value); if (!subject.value) valid = false;
  setFieldError(message, document.getElementById(prefix + 'message-err'), !message.value.trim()); if (!message.value.trim()) valid = false;
  return valid;
}

function buildMailto(name, email, phone, address, subject, message) {
  const body = `Name: ${name}%0AEmail: ${email}%0APhone: ${phone}%0AAddress: ${address}%0A%0AMessage:%0A${encodeURIComponent(message)}`;
  return `mailto:lucienacademy@gmail.com?subject=${encodeURIComponent(subject)}&body=${body}`;
}

// ── Modal form submit ──
const modalContactForm = document.getElementById('modalContactForm');
if (modalContactForm) {
  modalContactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    if (!validateForm('m-')) return;
    const btn = document.getElementById('modalFormBtn');
    const email = document.getElementById('m-email').value.trim();
    const name = document.getElementById('m-name').value.trim();
    const phone = document.getElementById('m-phone').value.trim();
    const address = document.getElementById('m-address').value.trim();
    const subject = document.getElementById('m-subject').value;
    const message = document.getElementById('m-message').value.trim();
    btn.disabled = true;
    btn.textContent = 'Sending...';
    window.location.href = buildMailto(name, email, phone, address, subject, message);
    setTimeout(() => {
      document.getElementById('modalSuccessEmail').textContent = email;
      document.getElementById('modalFormContent').style.display = 'none';
      document.getElementById('modalFormSuccess').classList.add('show');
    }, 800);
  });
}

// ── Main (page) contact form submit ──
const mainContactForm = document.getElementById('mainContactForm');
if (mainContactForm) {
  mainContactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    if (!validateForm('main-')) return;
    const btn = document.getElementById('mainFormBtn');
    const email = document.getElementById('main-email').value.trim();
    const name = document.getElementById('main-name').value.trim();
    const phone = document.getElementById('main-phone').value.trim();
    const address = document.getElementById('main-address').value.trim();
    const subject = document.getElementById('main-subject').value;
    const message = document.getElementById('main-message').value.trim();
    btn.disabled = true;
    btn.textContent = 'Sending...';
    window.location.href = buildMailto(name, email, phone, address, subject, message);
    setTimeout(() => {
      document.getElementById('successEmail').textContent = email;
      document.getElementById('mainFormContent').style.display = 'none';
      document.getElementById('mainFormSuccess').classList.add('show');
    }, 800);
  });
}

function resetMainForm() {
  const form = document.getElementById('mainContactForm');
  if (!form) return;
  form.reset();
  const btn = document.getElementById('mainFormBtn');
  btn.disabled = false;
  btn.innerHTML = 'Send Message <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>';
  document.getElementById('mainFormContent').style.display = '';
  document.getElementById('mainFormSuccess').classList.remove('show');
  ['main-name','main-email','main-phone','main-subject','main-message'].forEach(id => {
    const el = document.getElementById(id);
    const err = document.getElementById(id + '-err');
    if (el) el.classList.remove('error');
    if (err) err.classList.remove('show');
  });
}

// ── Live clear errors on input ──
['m-name','m-email','m-phone','m-subject','m-message','main-name','main-email','main-phone','main-subject','main-message'].forEach(id => {
  const el = document.getElementById(id);
  if (el) el.addEventListener('input', () => {
    el.classList.remove('error');
    const err = document.getElementById(id + '-err');
    if (err) err.classList.remove('show');
  });
});
