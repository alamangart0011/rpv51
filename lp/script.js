/* =====================================================================
   RPV51 — рекламный лендинг. Квиз, лиды в ВК и по телефону, аналитика.
   ===================================================================== */

// ---- КОНФИГ (заполните ID перед запуском рекламы) ----
const CONFIG = {
  phone: '+79010458232',
  vkScreen: 'rpv51',          // vk.com/rpv51
  vkMessage: 'https://vk.me/rpv51',
  vkGroupId: '',              // ЧИСЛОВОЙ id сообщества — для виджета ВК (необязательно). Как узнать: regtools.ru → «узнать id группы»
  metrikaId: '96237257',             // номер счётчика Яндекс.Метрики, напр. 99999999
  vkPixelId: '',             // ID пикселя VK Ads / top.mail.ru
  leadEndpoint: 'https://formsubmit.co/ajax/holydude0011@gmail.com',          // URL приёма заявок: Formspree/Getform/вебхук CRM. Пусто = заявка только в ВК/по телефону
};

// ---- АНАЛИТИКА (грузится только если заданы ID) ----
function initAnalytics() {
  if (CONFIG.metrikaId) {
    (function (m, e, t, r, i, k, a) { m[i] = m[i] || function () { (m[i].a = m[i].a || []).push(arguments); }; m[i].l = 1 * new Date();
      for (var j = 0; j < document.scripts.length; j++) { if (document.scripts[j].src === r) { return; } }
      k = e.createElement(t), a = e.getElementsByTagName(t)[0]; k.async = 1; k.src = r; a.parentNode.insertBefore(k, a);
    })(window, document, 'script', 'https://mc.yandex.ru/metrika/tag.js', 'ym');
    ym(CONFIG.metrikaId, 'init', { clickmap: true, trackLinks: true, accurateTrackBounce: true, webvisor: true });
  }
  if (CONFIG.vkPixelId) {
    var _tmr = window._tmr || (window._tmr = []);
    _tmr.push({ id: CONFIG.vkPixelId, type: 'pageView', start: (new Date()).getTime() });
    (function (d, w, id) { if (d.getElementById(id)) return; var ts = d.createElement('script'); ts.type = 'text/javascript'; ts.async = true; ts.id = id;
      ts.src = 'https://top-fwz1.mail.ru/js/code.js'; var f = function () { var s = d.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ts, s); };
      if (w.opera == '[object Opera]') { d.addEventListener('DOMContentLoaded', f, false); } else { f(); }
    })(document, window, 'tmr-code');
  }
}
function track(goal, params) {
  try { if (window.ym && CONFIG.metrikaId) ym(CONFIG.metrikaId, 'reachGoal', goal, params || {}); } catch (e) {}
  try { if (window._tmr && CONFIG.vkPixelId) window._tmr.push({ type: 'reachGoal', id: CONFIG.vkPixelId, goal: goal }); } catch (e) {}
}
initAnalytics();

// ---- UTM-метки + отправка лида ----
const UTM = (() => { const p = new URLSearchParams(location.search); const o = {}; ['utm_source','utm_medium','utm_campaign','utm_content','utm_term'].forEach((k) => { const v = p.get(k); if (v) o[k] = v; }); o.page = location.href.split('#')[0]; return o; })();
function sendLead(data) {
  const payload = { ...data, ...UTM };
  if (CONFIG.leadEndpoint) {
    try { fetch(CONFIG.leadEndpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ _subject: 'Заявка с сайта RPV51', _template: 'table', _captcha: 'false', ...payload }) }).catch(() => {}); } catch (e) {}
  }
  return payload; // без вывода ПДн в консоль
}
function markInvalid(el) { if (!el) return; el.classList.add('invalid'); el.setAttribute('aria-invalid', 'true'); }
function clearInvalid(el) { if (!el) return; el.classList.remove('invalid'); el.removeAttribute('aria-invalid'); }
document.addEventListener('input', (e) => { if (e.target.matches && e.target.matches('input,textarea')) clearInvalid(e.target); });

// ---- ВК-ВИДЖЕТ сообщества (если задан числовой id) ----
function initVkWidget() {
  if (!CONFIG.vkGroupId) return; // без id показываем статичную ссылку (уже в разметке)
  const s = document.createElement('script');
  s.src = 'https://vk.com/js/api/openapi.js?169';
  s.onload = function () {
    try {
      document.getElementById('vk_community').innerHTML = '';
      window.VK.Widgets.Group('vk_community', { mode: 3, width: 'auto', height: 330, color1: '161a20', color2: 'f4f6f8', color3: 'f5a623' }, CONFIG.vkGroupId);
      window.VK.Widgets.CommunityMessages(CONFIG.vkGroupId, { tooltipButtonText: 'Записаться в RPV51', expanded: 0 });
    } catch (e) {}
  };
  document.head.appendChild(s);
}
initVkWidget();

// ---- МАСКА ТЕЛЕФОНА ----
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
function bindMask(scope) { (scope || document).querySelectorAll('input[name="phone"]').forEach((i) => { if (!i.dataset.mask) { i.dataset.mask = 1; i.addEventListener('input', maskPhone); } }); }
function validPhone(v) { return v.replace(/\D/g, '').length >= 11; }

// ---- КВИЗ ----
const QUIZ = [
  { q: 'Что беспокоит в машине?', options: ['Не заводится / горит «чек» — нужна диагностика', 'Двигатель (стук, расход, тяга, бензин/дизель)', 'Ходовая и подвеска (стуки, вибрация)', 'Тормоза', 'МКПП и сцепление', 'Автоэлектрика (генератор, стартер)', 'Плановое ТО или замена масла', 'Шиномонтаж R13-R22', 'Пока не знаю — нужна диагностика'] },
  { q: 'Какая у вас марка авто?', options: ['Hyundai / Kia', 'Volkswagen / Skoda / Audi', 'Toyota / Nissan / Mitsubishi', 'Ford / Chevrolet / Opel', 'Renault / Lada / отечественная', 'Премиум / спорт (BMW, Mercedes, Mustang)', 'Коммерческий транспорт', 'Другая марка'] },
  { q: 'Как срочно нужна машина?', options: ['Сегодня-завтра, машина нужна', 'На этой неделе', 'Могу приехать в выходной (работаем в субботу)', 'Пока просто хочу узнать цену'] },
];
const answers = {};
let step = 0;
const totalSteps = QUIZ.length + 1; // + шаг контактов
const quizForm = document.getElementById('quizForm');
const quizBar = document.getElementById('quizBar');
const quizSuccess = document.getElementById('quizSuccess');

function renderStep() {
  if (!quizForm || !quizBar) return;
  quizBar.style.width = ((step) / totalSteps * 100) + '%';
  if (step < QUIZ.length) {
    const s = QUIZ[step];
    quizForm.innerHTML =
      '<div class="quiz__step active"><div class="quiz__q">' + (step + 1) + '. ' + s.q + '</div><div class="quiz__opts">' +
      s.options.map((o, i) => '<button type="button" class="quiz__opt" data-i="' + i + '"><span class="dot"></span>' + o + '</button>').join('') +
      '</div><div class="quiz__nav">' + (step > 0 ? '<button type="button" class="quiz__back">← Назад</button>' : '<span></span>') + '<span style="color:var(--muted);font-size:13px">Шаг ' + (step + 1) + ' из ' + totalSteps + '</span></div></div>';
    quizForm.querySelectorAll('.quiz__opt').forEach((b) => b.addEventListener('click', () => {
      answers['Q' + (step + 1) + '. ' + s.q] = s.options[b.dataset.i];
      track('quiz_step', { step: step + 1 });
      step++; renderStep();
    }));
  } else {
    // финальный шаг — контакты
    quizForm.innerHTML =
      '<div class="quiz__step active"><div class="quiz__q">Куда отправить расчёт и записать на бесплатную диагностику?</div>' +
      '<div class="field"><span>Ваше имя</span><input type="text" name="name" placeholder="Иван" required></div>' +
      '<div class="field"><span>Телефон — перезвоним за 15 минут</span><input type="tel" name="phone" placeholder="+7 (___) ___-__-__" required></div>' +
      '<button type="submit" class="btn btn--primary btn--full btn--lg">Получить расчёт</button>' +
      '<div class="lead__or">или запишитесь сразу</div>' +
      '<a class="btn btn--vk btn--full" href="' + CONFIG.vkMessage + '" target="_blank" rel="noopener">Написать в ВК</a>' +
      '<div class="quiz__nav" style="margin-top:14px"><button type="button" class="quiz__back">← Назад</button><span></span></div></div>';
    bindMask(quizForm);
  }
  const back = quizForm.querySelector('.quiz__back');
  if (back) back.addEventListener('click', () => { step--; renderStep(); });
}

quizForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = quizForm.querySelector('[name="name"]');
  const phone = quizForm.querySelector('[name="phone"]');
  let ok = true;
  if (!name.value.trim()) { markInvalid(name); ok = false; }
  if (!phone || !validPhone(phone.value)) { markInvalid(phone); ok = false; }
  if (!ok) return;
  answers['Имя'] = name.value.trim();
  answers['Телефон'] = phone.value.trim();
  // Отправка заявки на бэкенд/CRM, если задан CONFIG.leadEndpoint (+ запись через ВК ниже)
  sendLead(answers);
  track('lead'); track('quiz_lead');
  quizForm.style.display = 'none';
  document.getElementById('successVk').href = CONFIG.vkMessage;
  quizSuccess.hidden = false;
  quizBar.style.width = '100%';
});
renderStep();

// ---- ПРОСТЫЕ ФОРМЫ (CTA, модалка) ----
function handleForm(form, successEl, onDone) {
  if (!form) return;
  bindMask(form);
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let ok = true;
    form.querySelectorAll('[required]').forEach((f) => { const empty = !f.value.trim(); if (empty) { markInvalid(f); ok = false; } else { clearInvalid(f); } });
    const phone = form.querySelector('input[name="phone"]');
    if (phone && !validPhone(phone.value)) { markInvalid(phone); ok = false; }
    if (!ok) return;
    const data = Object.fromEntries(new FormData(form).entries());
    sendLead(data);
    track('lead');
    form.reset();
    if (successEl) { successEl.hidden = false; setTimeout(() => { successEl.hidden = true; if (onDone) onDone(); }, 6000); }
  });
  form.querySelectorAll('input,textarea').forEach((el) => el.addEventListener('input', () => el.classList.remove('invalid')));
}
handleForm(document.getElementById('ctaForm'), document.getElementById('ctaSuccess'));

// ---- МОДАЛКА ----
const modal = document.getElementById('bookModal');
let lastFocused = null;
function trapTab(e) {
  if (e.key !== 'Tab' || !modal.classList.contains('open')) return;
  const f = modal.querySelectorAll('button,[href],input,textarea,select,[tabindex]:not([tabindex="-1"])');
  if (!f.length) return;
  const first = f[0], last = f[f.length - 1];
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
}
function openModal() { lastFocused = document.activeElement; modal.classList.add('open'); modal.setAttribute('aria-hidden', 'false'); document.body.style.overflow = 'hidden'; document.addEventListener('keydown', trapTab); track('open_modal'); setTimeout(() => { const n = modal.querySelector('input[name="name"]'); if (n) n.focus(); }, 80); }
function closeModal() { modal.classList.remove('open'); modal.setAttribute('aria-hidden', 'true'); document.body.style.overflow = ''; document.removeEventListener('keydown', trapTab); if (lastFocused && lastFocused.focus) lastFocused.focus(); }
document.querySelectorAll('.js-book').forEach((b) => b.addEventListener('click', (e) => { e.preventDefault(); openModal(); }));
document.querySelectorAll('.js-modal-close').forEach((b) => b.addEventListener('click', closeModal));
handleForm(document.getElementById('modalForm'), document.getElementById('modalSuccess'), closeModal);

// ---- ТРЕКИНГ КЛИКОВ по каналам ----
document.querySelectorAll('.js-call').forEach((a) => a.addEventListener('click', () => track('call')));
document.querySelectorAll('.js-vk').forEach((a) => a.addEventListener('click', () => track('vk')));
document.querySelectorAll('.js-route').forEach((a) => a.addEventListener('click', () => track('route')));

// ---- ЛАЙТБОКС ----
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
function closeLightbox() { lightbox.classList.remove('open'); }
if (lightbox && lightboxImg) {
  document.querySelectorAll('#galleryGrid .gallery__item img').forEach((img) => img.parentElement.addEventListener('click', () => { lightboxImg.src = img.src; lightbox.classList.add('open'); }));
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
}
const lightboxCloseBtn = document.getElementById('lightboxClose');
if (lightboxCloseBtn) lightboxCloseBtn.addEventListener('click', closeLightbox);
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') { closeModal(); closeLightbox(); } });

// ---- TO-TOP + REVEAL ----
const toTop = document.getElementById('toTop');
if (toTop) window.addEventListener('scroll', () => toTop.classList.toggle('show', window.scrollY > 700), { passive: true });
const rt = document.querySelectorAll('.card,.step,.review,.section__head,.gallery__item,.reviews-top,.reviews-widget,.vkblock,.faq__item,.contacts__info,.contacts__map,.tstat');
rt.forEach((el) => el.classList.add('reveal'));
const io = new IntersectionObserver((en) => en.forEach((e, i) => { if (e.isIntersecting) { e.target.style.transitionDelay = (i % 4) * 60 + 'ms'; e.target.classList.add('visible'); io.unobserve(e.target); } }), { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
rt.forEach((el) => io.observe(el));

document.getElementById('year').textContent = new Date().getFullYear();
