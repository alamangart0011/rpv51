// ============ HEADER + TO-TOP ============
const header = document.getElementById('header');
const toTop = document.getElementById('toTop');
function onScroll() {
  const y = window.scrollY;
  header.classList.toggle('scrolled', y > 20);
  toTop.classList.toggle('show', y > 700);
}
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// ============ МОБИЛЬНОЕ МЕНЮ ============
const burger = document.getElementById('burger');
const nav = document.getElementById('nav');
function closeMenu() { nav.classList.remove('open'); burger.classList.remove('active'); burger.setAttribute('aria-expanded', 'false'); }
burger.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  burger.classList.toggle('active', open);
  burger.setAttribute('aria-expanded', String(open));
});
nav.querySelectorAll('.nav__link').forEach((l) => l.addEventListener('click', closeMenu));

// ============ REVEAL ============
const revealTargets = document.querySelectorAll(
  '.card, .benefit, .step, .review, .section__head, .price-table, .price-cta, .why__media, .why__item, .gallery__item, .reviews-top, .reviews-widget, .booking__info, .form, .faq__item, .contacts__info, .contacts__map'
);
revealTargets.forEach((el) => el.classList.add('reveal'));
const io = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      entry.target.style.transitionDelay = `${(i % 4) * 60}ms`;
      entry.target.classList.add('visible');
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
revealTargets.forEach((el) => io.observe(el));

// ============ МАСКА ТЕЛЕФОНА ============
function maskPhone(e) {
  let d = e.target.value.replace(/\D/g, '');
  if (d.startsWith('8')) d = '7' + d.slice(1);
  if (!d.startsWith('7')) d = '7' + d;
  d = d.slice(0, 11);
  let out = '+7';
  if (d.length > 1) out += ' (' + d.slice(1, 4);
  if (d.length >= 4) out += ') ' + d.slice(4, 7);
  if (d.length >= 7) out += '-' + d.slice(7, 9);
  if (d.length >= 9) out += '-' + d.slice(9, 11);
  e.target.value = out;
}
document.querySelectorAll('input[name="phone"]').forEach((i) => i.addEventListener('input', maskPhone));

// ============ ОБРАБОТКА ФОРМ ============
function handleForm(form, successEl, onDone) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;
    form.querySelectorAll('[required]').forEach((f) => {
      const empty = !f.value.trim();
      f.classList.toggle('invalid', empty);
      if (empty) valid = false;
    });
    const phone = form.querySelector('input[name="phone"]');
    if (phone && phone.value.replace(/\D/g, '').length < 11) { phone.classList.add('invalid'); valid = false; }
    if (!valid) return;

    // ── ПОДКЛЮЧИТЕ ОТПРАВКУ: e-mail (Formspree), вебхук или CRM ──
    const data = Object.fromEntries(new FormData(form).entries());
    console.log('Заявка RPV51:', data);

    form.reset();
    if (successEl) { successEl.hidden = false; setTimeout(() => { successEl.hidden = true; if (onDone) onDone(); }, 6000); }
  });
  form.querySelectorAll('input, textarea').forEach((el) => el.addEventListener('input', () => el.classList.remove('invalid')));
}
handleForm(document.getElementById('bookingForm'), document.getElementById('formSuccess'));

// ============ МОДАЛКА ЗАПИСИ ============
const modal = document.getElementById('bookModal');
function openModal() { modal.classList.add('open'); modal.setAttribute('aria-hidden', 'false'); document.body.style.overflow = 'hidden'; setTimeout(() => modal.querySelector('input[name="name"]').focus(), 80); }
function closeModal() { modal.classList.remove('open'); modal.setAttribute('aria-hidden', 'true'); document.body.style.overflow = ''; }
document.querySelectorAll('.js-book').forEach((b) => b.addEventListener('click', (e) => {
  // для ссылки-«Записаться» в мобильной панели не мешаем якорю на десктопе — открываем модалку всегда
  e.preventDefault(); openModal();
}));
document.querySelectorAll('.js-modal-close').forEach((b) => b.addEventListener('click', closeModal));
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') { closeModal(); closeLightbox(); } });
handleForm(document.getElementById('modalForm'), document.getElementById('modalSuccess'), closeModal);

// ============ ЛАЙТБОКС ГАЛЕРЕИ ============
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
function closeLightbox() { lightbox.classList.remove('open'); }
document.querySelectorAll('#galleryGrid .gallery__item img').forEach((img) => {
  img.parentElement.addEventListener('click', () => {
    lightboxImg.src = img.src;
    lightbox.classList.add('open');
  });
});
document.getElementById('lightboxClose').addEventListener('click', closeLightbox);
lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });

// ============ ГОД ============
document.getElementById('year').textContent = new Date().getFullYear();
