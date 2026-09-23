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
const selectedModels = Object.fromEntries(MACHINES.filter(m => m.models || m.variants).map(m => [m.id,(m.models || m.variants)[0].id]));
const openAddons = new Set();
const expandedMachines = new Set();
const t = key => COPY[language][key] ?? key;
const local = value => value && typeof value === 'object' ? value[language] : value;
const escapeHTML = value => String(value ?? '').replace(/[&<>"']/g, character => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[character]));
const pending = () => `<span class="pending-badge">${t('pending')}</span>`;
const machineName = machine => language === 'en' && machine.nameEn ? machine.nameEn : machine.name;
const activeModel = machine => (machine.models || machine.variants || []).find(model => model.id === selectedModels[machine.id]);
function renderSpecs(machine) {
  const model = activeModel(machine);
  let specs = model?.specs || machine.specs;
  if (model?.power) specs = model.area ? [['workingArea',model.area],['source',model.power]] : [['minDiameter',model.minDiameter],['maxDiameter',model.maxDiameter],['source',model.power]];
  else if (model?.area) specs = specs.map(([key,value]) => [key,key === 'workingArea' ? model.area : value]);
  return `<dl class="specs">${specs.map(([key,value]) => `<div><dt>${t(key)}</dt><dd>${value === null ? pending() : escapeHTML(local(value))}</dd></div>`).join('')}${(machine.features || []).map(f => `<div><dt>${language === 'pt' ? 'Características' : 'Features'}</dt><dd>${escapeHTML(local(f))}</dd></div>`).join('')}</dl>`;
}
function renderMachineAddons(machine) {
  const ids = activeModel(machine)?.addons || machine.addons;
  return ids.length ? `<details class="addons" data-addons="${machine.id}" ${openAddons.has(machine.id) ? 'open' : ''}><summary><span><strong>Add-ons <span class="addons-count">${String(ids.length).padStart(2,'0')}</span></strong><small>${language === 'pt' ? 'Ver opções disponíveis' : 'View available options'}</small></span></summary><ul>${ids.map(id => {const addon = ADDONS.find(a => a.id === id);return `<li><a href="#addon-${id}" data-addon-link="${id}">${escapeHTML(local(addon.title))} ↗</a></li>`;}).join('')}</ul></details>` : '';
}
function renderAddons() {
  $('#addon-grid').innerHTML = ADDONS.map(addon => `<article class="addon-card" id="addon-${addon.id}" tabindex="-1"><div class="addon-placeholder"><span aria-hidden="true">＋</span><p>${t('photoPending')}</p></div><div><p class="machine-tag">${escapeHTML(addon.applies)}</p><h3>${escapeHTML(local(addon.title))}</h3><p>${escapeHTML(local(addon.text))}</p></div></article>`).join('');
}
function renderMachines() {
  const machinesVisible = !['addons','custom'].includes(filter);
  $('#machine-grid').hidden = !machinesVisible;
  $('#addons').hidden = filter !== 'addons';
  $('#manufacture').hidden = filter !== 'custom';
  $('.catalogue-bottom').hidden = !machinesVisible;
  $$('[data-filter]').forEach(button => button.setAttribute('aria-pressed',String(button.dataset.filter === filter)));
  if (!machinesVisible) {
    $('#result-count').textContent = filter === 'addons' ? `${String(ADDONS.length).padStart(2,'0')} add-ons` : 'ACN Manufacture';
    return;
  }
  const shown = MACHINES.filter(machine => filter === 'all' || machine.cat === filter);
  $('#machine-grid').className = `machine-grid ${filter === 'all' ? 'is-overview' : 'is-detail'}`;
  $('#machine-grid').innerHTML = shown.map(machine => {
    const number = String(MACHINES.indexOf(machine) + 1).padStart(2,'0');
    const models = machine.models || machine.variants;
    const options = models ? `<p class="model-label">${t('models')}</p><div class="model-options" role="group" aria-label="${t('models')} ${machineName(machine)}">${models.map(model => `<button type="button" data-model="${model.id}" data-machine="${machine.id}" aria-pressed="${selectedModels[machine.id] === model.id}">${model.name || t(model.label)}</button>`).join('')}${machine.manufacture ? '<a href="#manufacture">Customized ↗</a>' : ''}</div>` : '';
    return `<article class="machine-card ${expandedMachines.has(machine.id) ? 'is-expanded' : ''}" id="machine-${machine.id}" aria-labelledby="title-${machine.id}"><div class="machine-photo"><img src="${machine.image}" alt="ACN ${machineName(machine)}" loading="lazy" width="1000" height="625"><span class="machine-number">${number} / ACN</span></div><div class="machine-body"><p class="machine-tag">${t(machine.tag)}</p><h3 id="title-${machine.id}"><button class="machine-toggle" type="button" data-expand="${machine.id}" aria-expanded="${filter !== 'all' || expandedMachines.has(machine.id)}" aria-controls="details-${machine.id}">${machineName(machine)} <span aria-hidden="true">+</span></button></h3><div class="machine-details" id="details-${machine.id}"><p class="machine-desc">${escapeHTML(local(machine.description))}</p>${options}<div class="model-specs">${renderSpecs(machine)}</div><div class="model-addons">${renderMachineAddons(machine)}</div><a class="machine-link" href="#contact" data-enquire="${machine.id}"><span>${t('configure')}</span><span aria-hidden="true">↗</span></a></div></div></article>`;
  }).join('');
  $('#result-count').textContent = `${String(shown.length).padStart(2,'0')} ${t('systems')}`;
}
$('#machine-grid').addEventListener('toggle', event => {
  const details = event.target;
  if (details.matches('.addons')) details.open ? openAddons.add(details.dataset.addons) : openAddons.delete(details.dataset.addons);
}, true);
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
  renderMachines(); renderAddons(); renderFormStatus();
}
$$('[data-lang]').forEach(button => button.addEventListener('click', () => setLanguage(button.dataset.lang)));
function selectCatalogueView(next) {
  filter = next;
  renderMachines();
}
$$('[data-filter]').forEach(button => button.addEventListener('click', () => {
  selectCatalogueView(button.dataset.filter);
  if (['#manufacture','#addons'].includes(location.hash) || location.hash.startsWith('#addon-')) history.replaceState(null,'',`${location.pathname}${location.search}#range`);
}));
function openCatalogueAnchor(hash) {
  if (hash === '#manufacture') selectCatalogueView('custom');
  else if (hash === '#addons' || hash.startsWith('#addon-')) selectCatalogueView('addons');
  else if (hash === '#range') selectCatalogueView('all');
  else return;
  const target = document.getElementById(hash.slice(1));
  target?.scrollIntoView();
  if (hash.startsWith('#addon-')) target?.focus({preventScroll:true});
}
document.addEventListener('click', event => {
  const link = event.target.closest('a[href^="#"]');
  if (link) openCatalogueAnchor(link.getAttribute('href'));
});
window.addEventListener('hashchange', () => openCatalogueAnchor(location.hash));
$('#machine-grid').addEventListener('click', event => {
  const card = event.target.closest('.machine-card');
  const expand = event.target.closest('[data-expand]');
  if (expand) {
    const open = filter === 'all' ? !card.classList.contains('is-expanded') : card.classList.contains('is-collapsed');
    card.classList.toggle('is-expanded',open);
    card.classList.toggle('is-collapsed',!open);
    open ? expandedMachines.add(expand.dataset.expand) : expandedMachines.delete(expand.dataset.expand);
    expand.setAttribute('aria-expanded',String(open));
  }
  const model = event.target.closest('[data-model]');
  if (model) {
    const machine = MACHINES.find(m => m.id === model.dataset.machine);
    selectedModels[machine.id] = model.dataset.model;
    card.classList.remove('is-collapsed');
    card.classList.add('is-expanded');
    expandedMachines.add(machine.id);
    $('[data-expand]',card).setAttribute('aria-expanded','true');
    $$('[data-model]',card).forEach(button => button.setAttribute('aria-pressed',String(button === model)));
    $('.model-specs',card).innerHTML = renderSpecs(machine);
    $('.model-addons',card).innerHTML = renderMachineAddons(machine);
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

$('#machine-grid').addEventListener('pointermove', event => {
  if (innerWidth < 900 || reducedMotion?.matches) return;
  const card = event.target.closest('.machine-card');
  if (!card) return;
  const bounds = card.getBoundingClientRect();
  card.style.setProperty('--mx', `${event.clientX - bounds.left}px`);
  card.style.setProperty('--my', `${event.clientY - bounds.top}px`);
});
$('#machine-grid').addEventListener('pointerout', event => {
  const card = event.target.closest('.machine-card');
  if (card && !card.contains(event.relatedTarget)) { card.style.removeProperty('--mx'); card.style.removeProperty('--my'); }
});

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

if (location.hash) openCatalogueAnchor(location.hash);
