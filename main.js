// main.js (shared by the English and Chinese sites)
// All page content lives in the *_data.js files. Edit those, not this file.

const IS_ZH = (document.documentElement.lang || "").toLowerCase().startsWith("zh");

document.addEventListener('DOMContentLoaded', () => {
  safeRun(initMobileNav);
  safeRun(renderSidebar);
  if (document.getElementById('home-content')) safeRun(renderHome);
  if (document.getElementById('pub-list')) safeRun(renderPublications);
  if (document.getElementById('news-list')) safeRun(renderNews);
  if (document.getElementById('aboutme-content')) safeRun(renderAboutMe);
  if (document.getElementById('contact-content')) safeRun(renderContact);
  safeRun(initFooterYear);
});

function safeRun(fn) {
  try { fn(); } catch (e) { console.error(`[main.js] ${fn.name} failed:`, e); }
}

function bullets(items) {
  const list = (items || []).filter(Boolean);
  return list.length ? `<ul class="bullet-list">${list.map(d => `<li>${d}</li>`).join('')}</ul>` : '';
}

/* ========== Mobile nav ========== */
function initMobileNav() {
  const nav = document.querySelector('header nav');
  const btn = document.querySelector('.nav-toggle');
  const linksWrap = document.querySelector('.nav-links');
  if (!nav || !btn || !linksWrap) return;

  btn.addEventListener('click', (e) => {
    e.preventDefault();
    const open = nav.classList.toggle('nav-open');
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  linksWrap.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => nav.classList.remove('nav-open'));
  });
  document.addEventListener('click', (e) => {
    if (e.target && !nav.contains(e.target)) nav.classList.remove('nav-open');
  });
  window.addEventListener('resize', () => {
    if (window.innerWidth > 1000) nav.classList.remove('nav-open');
  });
}

/* ========== Sidebar ========== */
function renderSidebar() {
  const container = document.getElementById('sidebar-container');
  if (!container || typeof sidebarData === 'undefined') return;
  const sb = sidebarData;

  const listHtml = (sb.infoList || []).map(item => {
    const external = item.link && /^https?:/.test(item.link);
    const content = item.link
      ? `<a href="${item.link}"${external ? ' target="_blank" rel="noopener"' : ''}>${item.text}</a>`
      : item.text;
    return `<li><i class="${item.icon}" aria-hidden="true"></i> ${content}</li>`;
  }).join('');

  container.innerHTML = `
    <img src="${sb.image}" alt="${sb.name}" class="profile-img">
    <div class="sidebar-name">${sb.name}</div>
    <div class="sidebar-title">${sb.title}</div>
    <div class="sidebar-school">${sb.prev_edu}</div>
    <ul class="sidebar-info">${listHtml}</ul>
  `;
}

/* ========== Research / project cards ========== */
function renderPublications() {
  const container = document.getElementById('pub-list');
  if (!container || typeof pubData === 'undefined') return;
  container.className = "pub-grid";

  if (typeof pubIntro !== 'undefined' && pubIntro) {
    const intro = document.getElementById('pub-intro');
    if (intro) intro.innerHTML = pubIntro;
  }

  container.innerHTML = pubData.map(pub => {
    const tag = pub.detailUrl ? 'a' : 'div';
    const href = pub.detailUrl ? ` href="${pub.detailUrl}"` : '';
    const links = (pub.links || []).map(l =>
      `<a class="btn-link" href="${l.url}" target="_blank" rel="noopener">${l.text}</a>`).join('');
    return `
    <${tag}${href} class="pub-card${pub.detailUrl ? '' : ' static'}">
      <div class="pub-content">
        ${pub.type ? `<div class="pub-type">${pub.type}</div>` : ''}
        <div class="pub-title">${pub.title}</div>
        <div class="pub-meta">
          ${pub.authors ? `${pub.authors}<br>` : ''}
          ${[pub.venue, pub.year].filter(Boolean).join(', ')}
        </div>
        ${bullets(pub.details)}
        ${links ? `<div class="pub-links">${links}</div>` : ''}
        <div class="pub-keywords">
          ${(pub.keywords || []).map(k => `<span class="keyword-tag">${k}</span>`).join('')}
        </div>
      </div>
    </${tag}>`;
  }).join('');
}

/* ========== Home ========== */
function setText(id, value) {
  const el = document.getElementById(id);
  if (el && value !== undefined) el.innerText = value;
}

function renderHome() {
  if (typeof homeData === 'undefined') return;
  const h = homeData;
  const L = h.labels || {};

  document.getElementById('home-name').innerHTML = `${h.header.name}${h.header.name_alt ? ` <span class="name-alt">${h.header.name_alt}</span>` : ''}`;
  setText('home-title', h.header.title);
  setText('home-dept', h.header.department);
  document.getElementById('home-bio').innerHTML = h.header.bio.map(p => `<p>${p}</p>`).join('');

  setText('interests-title', L.interests);
  setText('edu-title', L.education);
  setText('exp1-title', L.exp1);
  setText('exp2-title', L.exp2);
  setText('list1-title', L.list1);
  setText('list2-title', L.list2);
  setText('footer-title', L.footer);

  const interestsEl = document.getElementById('interests-list');
  interestsEl.innerHTML = (h.interests || []).map(t => `<span class="interest-chip">${t}</span>`).join('');

  document.getElementById('edu-list').innerHTML = (h.education || []).map(edu => `
    <li>
      <div class="list-header-row">
        <span class="list-header">${edu.school}</span>
        <span class="list-period">${edu.period}</span>
      </div>
      <div class="list-sub">${edu.degree}</div>
      ${bullets(edu.details)}
    </li>
  `).join('');

  // Two experience blocks, rendered as cards with bullet points
  const card = (item) => `
    <div class="experience-compact-card">
      <div class="experience-row-top">
        <span class="experience-lab">${item.org || ''}</span>
        <span class="experience-time">${item.period || ''}</span>
      </div>
      <div class="experience-role">${item.role || ''}${item.supervisor ? ` <span class="experience-sup">· ${item.supervisor}</span>` : ''}</div>
      ${bullets(item.details)}
    </div>`;

  document.getElementById('exp1-list').innerHTML = (h.exp1 || []).map(card).join('');
  document.getElementById('exp2-list').innerHTML = (h.exp2 || []).map(card).join('');

  document.getElementById('list1').innerHTML = (h.list1 || []).map(item => `<li>${item}</li>`).join('');
  document.getElementById('list2').innerHTML = (h.list2 || []).map(item => `<li>${item}</li>`).join('');

  setText('footer-note', h.footer.text);
  const btn = document.getElementById('btn-cv');
  btn.href = h.footer.cvLink;
  btn.innerText = h.footer.cvText;
}

/* ========== News ========== */
function parseNewsDate(s) {
  const m = String(s || "").trim().match(/^(\d{4})-(\d{2})(?:-(\d{2}))?$/);
  if (!m) return null;
  return { y: +m[1], mo: +m[2] - 1, d: m[3] ? +m[3] : null, t: new Date(+m[1], +m[2] - 1, m[3] ? +m[3] : 1).getTime() };
}

function formatNewsDate(p) {
  if (IS_ZH) return p.d ? `${p.mo + 1}月${p.d}日` : `${p.mo + 1}月`;
  const names = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return p.d ? `${names[p.mo]} ${p.d}` : names[p.mo];
}

function renderNews() {
  const container = document.getElementById('news-list');
  if (!container || typeof newsData === 'undefined') return;

  const items = newsData.map(it => ({ ...it, p: parseNewsDate(it.date) })).filter(it => it.p);
  items.sort((a, b) => b.p.t - a.p.t);

  const groups = new Map();
  items.forEach(it => {
    if (!groups.has(it.p.y)) groups.set(it.p.y, []);
    groups.get(it.p.y).push(it);
  });

  container.innerHTML = Array.from(groups.keys()).sort((a, b) => b - a).map(year => `
    <div class="news-year-block">
      <div class="news-year">${year}</div>
      <ul class="news-list">
        ${groups.get(year).map(it => `
          <li><span class="news-date">${formatNewsDate(it.p)}</span><span class="news-text">${it.text}</span></li>
        `).join('')}
      </ul>
    </div>
  `).join('');
}

/* ========== About me ========== */
function renderAboutMe() {
  const container = document.getElementById('aboutme-content');
  if (!container || typeof aboutmeData === 'undefined') return;
  const d = aboutmeData;

  const introHtml = Array.isArray(d.intro)
    ? `<div class="about-intro">${d.intro.map(p => `<p>${p}</p>`).join("")}</div>` : "";

  const sections = (d.sections || []).map(sec => {
    const media = (sec.media || []).filter(m => m && m.src);
    const grid = media.length
      ? `<div class="media-grid${media.length === 1 ? ' single' : ''}">${media.map(m => `
          <figure class="media-block">
            <div class="media-visual"><img src="${m.src}" alt="${m.alt || m.title || ''}" loading="lazy"${m.position ? ` style="object-position:${m.position}"` : ''}></div>
            ${m.title ? `<figcaption class="media-title">${m.title}</figcaption>` : ''}
          </figure>`).join('')}</div>`
      : '';
    return `
      <div class="about-section">
        <h3>${sec.title || ''}</h3>
        ${sec.desc ? `<p class="about-desc">${sec.desc}</p>` : ''}
        ${grid}
      </div>`;
  }).join('');

  container.innerHTML = introHtml + sections;
}

/* ========== Contact ========== */
function escapeHTML(str) {
  return String(str).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;").replaceAll("'", "&#039;");
}

function copyText(text, btn) {
  const doneLabel = IS_ZH ? "已复制" : "Copied";
  const done = () => {
    const old = btn.textContent;
    btn.textContent = doneLabel;
    setTimeout(() => (btn.textContent = old), 1000);
  };
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(done).catch(fallback);
  } else { fallback(); }
  function fallback() {
    const ta = document.createElement("textarea");
    ta.value = text; document.body.appendChild(ta); ta.select();
    try { document.execCommand("copy"); } catch (e) {}
    document.body.removeChild(ta); done();
  }
}

function renderContact() {
  const root = document.getElementById("contact-content");
  if (!root || typeof contactData === 'undefined') return;

  const rows = (contactData.items || []).map((item, i) => {
    const external = item.href && /^https?:/.test(item.href);
    const value = item.href
      ? `<a href="${item.href}"${external ? ' target="_blank" rel="noopener noreferrer"' : ''}>${escapeHTML(item.value)}</a>`
      : escapeHTML(item.value);
    const note = item.note ? `<span class="contact-note">${escapeHTML(item.note)}</span>` : '';
    const copy = item.copy ? `<button class="copy-btn" type="button" data-i="${i}">${IS_ZH ? "复制" : "Copy"}</button>` : '';
    return `
      <div class="contact-row">
        <i class="${item.icon}" aria-hidden="true"></i>
        <div class="contact-label">${escapeHTML(item.label)}</div>
        <div class="contact-value">${value}${note}</div>
        <div>${copy}</div>
      </div>`;
  }).join('');

  root.innerHTML = `
    <div class="contact-intro">${(contactData.intro || []).map(t => `<p>${escapeHTML(t)}</p>`).join('')}</div>
    <div class="contact-list">${rows}</div>
    ${contactData.footer ? `<div class="contact-footer">${escapeHTML(contactData.footer)}</div>` : ''}
  `;

  root.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', () => copyText(contactData.items[+btn.dataset.i].value, btn));
  });
}

function initFooterYear() {
  const el = document.getElementById('year');
  if (el) el.textContent = new Date().getFullYear();
}
