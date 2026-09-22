'use strict';
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
let storedLanguage;
try { storedLanguage = localStorage.getItem('acn-language'); } catch {}
const queryLanguage = new URLSearchParams(location.search).get('lang');
let language = ['pt','en'].includes(queryLanguage) ? queryLanguage : (['pt','en'].includes(storedLanguage) ? storedLanguage : 'pt');
let filter = 'all';
let formState = '';
let isSending = false;
const selectedModels = {smartline:'1530', 'tube-heavy':'standard'};
const openAddons = new Set();
const t = key => COPY[language][key] ?? key;
const local = value => value && typeof value === 'object' ? value[language] : value;
const escapeHTML = value => String(value ?? '').replace(/[&<>"']/g, character => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[character]));
const pending = () => `<span class="pending-badge">${t('pending')}</span>`;
const machineName = machine => language === 'en' && machine.nameEn ? machine.nameEn : machine.name;

function renderSpecs(machine) {
  let specs = machine.specs;
  if (machine.variants) specs = machine.variants.find(variant => variant.id === selectedModels[machine.id]).specs;
  if (machine.models) specs = specs.map(([key,value]) => [key, key === 'workingArea' ? machine.models.find(model => model.id === selectedModels[machine.id]).area : value]);
  return `<dl class="specs">${specs.map(([key,value]) => `<div><dt>${t(key)}</dt><dd>${value === null ? pending() : escapeHTML(local(value))}</dd></div>`).join('')}</dl>`;
}
function renderMachines() {
  const shown = MACHINES.filter(machine => filter === 'all' || machine.cat === filter);
  $('#machine-grid').innerHTML = shown.map(machine => {
    const number = String(MACHINES.indexOf(machine) + 1).padStart(2,'0');
    const models = machine.models ? `<p class="model-label">${t('models')}</p><div class="model-options" role="group" aria-label="${t('models')} SMARTLINE">${machine.models.map(model => `<button type="button" data-model="${model.id}" data-machine="${machine.id}" aria-pressed="${selectedModels[machine.id] === model.id}">${model.name}<small>${model.area}</small></button>`).join('')}</div>` : '';
    const variants = machine.variants ? `<div class="model-options" role="group" aria-label="${t('models')} ${machineName(machine)}">${machine.variants.map(variant => `<button type="button" data-model="${variant.id}" data-machine="${machine.id}" aria-pressed="${selectedModels[machine.id] === variant.id}">${t(variant.label)}</button>`).join('')}</div>` : '';
    const addons = machine.addons.length ? `<details class="addons" data-addons="${machine.id}" ${openAddons.has(machine.id) ? 'open' : ''}><summary><span>Add-ons <span class="addons-count">/ ${String(machine.addons.length).padStart(2,'0')}</span></span></summary><ul>${machine.addons.map(addon => `<li><strong>${escapeHTML(local(addon.title))}</strong>${addon.text ? `<p>${escapeHTML(local(addon.text))}</p>` : ''}${addon.pending ? pending() : ''}${addon.engineering ? `<p>${t('engineering')}</p>` : ''}</li>`).join('')}</ul></details>` : '';
    return `<article class="machine-card" id="machine-${machine.id}" aria-labelledby="title-${machine.id}"><div class="machine-photo ${machine.image ? '' : 'empty'}">${machine.image ? `<img src="${machine.image}" alt="ACN ${machineName(machine)}" loading="lazy" width="1000" height="625">` : `<span class="photo-pending">${t('photoPending')}</span>`}<span class="machine-number">${number} / ACN</span></div><div class="machine-body"><p class="machine-tag">${t(machine.tag)}</p><h3 id="title-${machine.id}">${machineName(machine)}</h3><p class="machine-desc">${escapeHTML(local(machine.description))}</p>${models}${variants}${renderSpecs(machine)}${addons}<p class="engineering-note">${t('engineering')}</p><a class="machine-link" href="#contact" data-enquire="${machine.id}"><span>${t('configure')}</span><span aria-hidden="true">↗</span></a></div></article>`;
  }).join('');
  $('#result-count').textContent = `${String(shown.length).padStart(2,'0')} ${t('systems')}`;
  $$('.addons').forEach(details => details.addEventListener('toggle', () => details.open ? openAddons.add(details.dataset.addons) : openAddons.delete(details.dataset.addons)));
}
function renderFormStatus() {
  $('#form-status').textContent = formState ? t(formState) : '';
  $('#form-status').className = `form-status ${formState === 'success' ? 'success' : formState && formState !== 'sending' ? 'error' : ''}`;
  $('#contact-form button[type=submit]').disabled = isSending;
  $('#contact-form button[type=submit] span:first-child').textContent = t(isSending ? 'sending' : 'send');
}
function setLanguage(next) {
  language = next;
  document.documentElement.lang = language === 'pt' ? 'pt-PT' : 'en';
  document.title = t('title');
  $('meta[name=description]').content = t('meta');
  $$('[data-i18n]').forEach(element => { element.textContent = t(element.dataset.i18n); });
  $$('[data-i18n-aria]').forEach(element => element.setAttribute('aria-label', t(element.dataset.i18nAria)));
  $$('[data-i18n-alt]').forEach(element => element.alt = t(element.dataset.i18nAlt));
  $$('[data-i18n-placeholder]').forEach(element => element.placeholder = t(element.dataset.i18nPlaceholder));
  $$('[data-lang]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.lang === language)));
  $('.menu-toggle').setAttribute('aria-label', t($('.menu-toggle').getAttribute('aria-expanded') === 'true' ? 'closeMenu' : 'menuLabel'));
  try { localStorage.setItem('acn-language', language); } catch {}
  const url = new URL(location.href); url.searchParams.set('lang', language); history.replaceState(null,'',url);
  renderMachines(); renderFormStatus();
}
$$('[data-lang]').forEach(button => button.addEventListener('click', () => setLanguage(button.dataset.lang)));
$$('[data-filter]').forEach(button => button.addEventListener('click', () => {
  filter = button.dataset.filter;
  $$('[data-filter]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
  renderMachines();
}));
$('#machine-grid').addEventListener('click', event => {
  const model = event.target.closest('[data-model]');
  if (model) {
    selectedModels[model.dataset.machine] = model.dataset.model;
    renderMachines();
    $(`[data-machine="${model.dataset.machine}"][data-model="${model.dataset.model}"]`).focus({preventScroll:true});
  }
  const enquiry = event.target.closest('[data-enquire]');
  if (enquiry) {
    const machine = MACHINES.find(item => item.id === enquiry.dataset.enquire);
    const message = $('#contact-form textarea');
    const modelSuffix = machine.models ? ` ${selectedModels[machine.id]}` : machine.variants && selectedModels[machine.id] === 'custom' ? ` (${t('custom')})` : '';
    if (!message.value.trim()) message.value = `${t('interest')} ${machineName(machine)}${modelSuffix}.\n`;
  }
});
function closeMenu(restoreFocus = false) {
  $('#navigation').classList.remove('is-open');
  $('.menu-toggle').setAttribute('aria-expanded','false');
  $('.menu-toggle').setAttribute('aria-label', t('menuLabel'));
  if (restoreFocus) $('.menu-toggle').focus();
}
$('.menu-toggle').addEventListener('click', () => {
  const open = $('#navigation').classList.toggle('is-open');
  $('.menu-toggle').setAttribute('aria-expanded', String(open));
  $('.menu-toggle').setAttribute('aria-label',t(open ? 'closeMenu' : 'menuLabel'));
});
$$('#navigation a').forEach(link => link.addEventListener('click', () => closeMenu()));
document.addEventListener('keydown', event => { if (event.key === 'Escape' && $('#navigation').classList.contains('is-open')) closeMenu(true); });
document.addEventListener('click', event => { if (!event.target.closest('#header')) closeMenu(); });

const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const clamp = (value,min=0,max=1) => Math.max(min, Math.min(max,value));
const smoothstep = value => value * value * (3 - 2 * value);
function setupHero() {
  const media = $('#hero-media');
  if (HERO_MEDIA.video) {
    const video = document.createElement('video');
    video.src = HERO_MEDIA.video; video.poster = HERO_MEDIA.frames[0]; video.muted = true; video.loop = true; video.playsInline = true; video.preload = 'metadata';
    media.replaceChildren(video);
    if (!reducedMotion.matches) video.play().catch(() => {});
  } else if (HERO_MEDIA.frames.length > 0) {
    media.replaceChildren(...HERO_MEDIA.frames.map((src,index) => {
      const layer = document.createElement('div'); layer.className = 'hero-layer';
      const image = document.createElement('img'); image.src = src; image.alt = '';
      if (!index) image.fetchPriority = 'high'; layer.append(image); return layer;
    }));
  }
  $('.hero-counter').innerHTML = `01 <span>/ ${String(HERO_MEDIA.video ? 1 : HERO_MEDIA.frames.length).padStart(2,'0')}</span>`;
}
let scrollFrame = 0;
function updateScroll() {
  scrollFrame = 0;
  const top = scrollY;
  const max = document.documentElement.scrollHeight - innerHeight;
  $('.reading-progress span').style.transform = `scaleX(${max > 0 ? clamp(top / max) : 0})`;
  const light = ['what','contact'].some(id => { const bounds = document.getElementById(id).getBoundingClientRect(); return bounds.top <= 50 && bounds.bottom > 50; });
  $('#header').classList.toggle('is-light',light);
  const hero = $('#top');
  // Short viewports leave no scroll distance for the sticky hero: hold the first frame instead.
  const travel = hero.offsetHeight - innerHeight;
  const progress = reducedMotion.matches || travel < 120 ? 0 : clamp(-hero.getBoundingClientRect().top / travel);
  const layers = $$('.hero-layer');
  const phase = progress * Math.max(0,layers.length-1);
  layers.forEach((layer,index) => {
    const opacity = reducedMotion.matches ? Number(index === 0) : (index === 0 ? 1 : smoothstep(clamp(phase-(index-1))));
    layer.style.opacity = String(opacity);
    // Zoom the photograph inside the layer, never the layer itself: the layer is the clipping frame.
    const image = layer.firstElementChild;
    if (image) image.style.transform = `scale(${reducedMotion.matches ? 1 : 1 + .1 * clamp(phase-index)})`;
  });
  $('.hero-content').style.transform = `translateY(${-progress*24}px)`;
  $('.hero-counter').innerHTML = `${String(Math.min(layers.length || 1,Math.floor(phase+.5)+1)).padStart(2,'0')} <span>/ ${String(layers.length || 1).padStart(2,'0')}</span>`;
}
function scheduleScroll() { if (!scrollFrame) scrollFrame = requestAnimationFrame(updateScroll); }
window.addEventListener('scroll',scheduleScroll,{passive:true});
window.addEventListener('resize',() => { if (innerWidth > 760) closeMenu(); scheduleScroll(); },{passive:true});
reducedMotion.addEventListener('change',() => { const video = $('#hero-media video'); if(video) reducedMotion.matches ? video.pause() : video.play().catch(()=>{}); scheduleScroll(); });
if ('IntersectionObserver' in window && !reducedMotion.matches) {
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.remove('is-pending'); observer.unobserve(entry.target); }
  }),{threshold:.12});
  $$('.reveal').forEach(element => {element.classList.add('is-pending'); observer.observe(element);});
}
// Count each metric once when its own cell becomes visible, including on mobile.
function setupMetricCounters() {
  if (!('IntersectionObserver' in window) || reducedMotion.matches) return;
  const counters = $$('.metrics strong').map((element, index) => ({
    element, node:element.firstChild, target:Number(element.firstChild.textContent), index, frame:0
  }));
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      observer.unobserve(entry.target);
      const counter = counters.find(item => item.element.parentElement === entry.target);
      const start = performance.now() + counter.index * 80;
      function tick(now) {
        const progress = clamp((now - start) / 1500);
        const eased = 1 - Math.pow(1 - progress, 3);
        counter.node.textContent = String(Math.round(counter.target * eased));
        if (progress < 1) counter.frame = requestAnimationFrame(tick);
        else counter.frame = 0;
      }
      counter.frame = requestAnimationFrame(tick);
    });
  }, {threshold:.55});
  counters.forEach(counter => {
    counter.node.textContent = '0';
    observer.observe(counter.element.parentElement);
  });
  reducedMotion.addEventListener('change', event => {
    if (!event.matches) return;
    observer.disconnect();
    counters.forEach(counter => {
      cancelAnimationFrame(counter.frame);
      counter.node.textContent = String(counter.target);
    });
  });
}
setupMetricCounters();
$('#contact-form').addEventListener('submit', async event => {
  event.preventDefault();
  if (isSending) return;
  const form = event.currentTarget;
  if (!form.reportValidity()) return;
  const data = Object.fromEntries(new FormData(form)); data.language = language;
  isSending = true; formState = 'sending'; renderFormStatus();
  const controller = new AbortController(); const timeout = setTimeout(() => controller.abort(),25000);
  try {
    const response = await fetch('/api/contact',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data),signal:controller.signal});
    const result = await response.json();
    if (!response.ok || result.ok !== true) { formState = response.status === 429 ? 'rateLimited' : response.status === 400 ? 'invalid' : 'unavailable'; }
    else { formState = 'success'; form.reset(); }
  } catch { formState = 'unavailable'; }
  finally { clearTimeout(timeout); isSending = false; renderFormStatus(); }
});
$('#year').textContent = new Date().getFullYear();
setLanguage(language); setupHero(); updateScroll();
