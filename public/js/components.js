/* ============================================================
   Solutions 360 — shared layout
   Replaces public/js/components.js entirely.
   ============================================================ */

/* ---------- LOADER ---------- */
const LOADER_HTML = '<div id="s3-loader"><svg viewBox="0 0 240 240" role="status" aria-label="Loading"><defs><clipPath id="s3lSphere"><circle cx="120" cy="120" r="66"/></clipPath></defs><g clip-path="url(#s3lSphere)"><circle cx="120" cy="120" r="66" fill="var(--gold)"/><g fill="none" stroke="var(--bg)" stroke-width="7"><ellipse cx="120" cy="120" rx="66" ry="24"/><ellipse class="s3l-lon" cx="120" cy="120" rx="66" ry="66"/><ellipse class="s3l-lon" cx="120" cy="120" rx="66" ry="66"/></g></g><g class="s3l-ring" fill="none" stroke="var(--teal)" stroke-width="10" stroke-linecap="round"><path d="M120 16 A104 104 0 0 0 120 224"/><path d="M120 224 A104 104 0 0 0 152 219" opacity=".45"/></g><g class="s3l-arc" fill="none" stroke="var(--teal)" stroke-width="6" stroke-linecap="round"><path d="M120 34 A86 86 0 0 1 194 77" opacity=".8"/></g></svg></div>';

(function mountLoader() {
  var root = document.documentElement;
  if (!root.classList.contains('s3-loading')) return;
  document.body.insertAdjacentHTML('afterbegin', LOADER_HTML);

  var MIN_MS;
  if (sessionStorage.getItem('s3seen')) {
    MIN_MS = 1400;
  } else {
    MIN_MS = 2600;
    sessionStorage.setItem('s3seen', '1');
  }

  var start = Date.now();
  var done = false;

  function hide() {
    if (done) return;
    done = true;
    root.classList.remove('s3-loading');
    var el = document.getElementById('s3-loader');
    if (!el) return;
    el.classList.add('s3-out');
    setTimeout(function () { el.remove(); }, 500);
  }
  function finish() {
    setTimeout(hide, Math.max(0, MIN_MS - (Date.now() - start)));
  }

  if (document.readyState === 'complete') finish();
  else window.addEventListener('load', finish);
  setTimeout(hide, 6000);
})();


/* ---------- small inline icons for the menu panels ---------- */
function ico(d) {
  return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">' + d + '</svg>';
}
const I = {
  building: ico('<path d="M3 21h18"/><path d="M5 21V6l7-3 7 3v15"/><path d="M10 21v-5h4v5"/><path d="M9 9h1M14 9h1M9 12h1M14 12h1"/>'),
  people:   ico('<circle cx="9" cy="8" r="3"/><path d="M3 20a6 6 0 0112 0"/><path d="M16 6.5a3 3 0 010 5.8"/><path d="M18 20a6 6 0 00-3-5.2"/>'),
  shield:   ico('<path d="M12 3l8 4v5c0 5-3.5 8-8 9-4.5-1-8-4-8-9V7l8-4z"/><path d="M9 12l2 2 4-4"/>'),
  globe:    ico('<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 3 2.5 15 0 18M12 3c-2.5 3-2.5 15 0 18"/>'),
  cap:      ico('<path d="M12 4L2 9l10 5 10-5-10-5z"/><path d="M6 11.5V16c0 1.5 2.7 3 6 3s6-1.5 6-3v-4.5"/>'),
  book:     ico('<path d="M4 5.5A2 2 0 016 4h5v16H6a2 2 0 01-2-2z"/><path d="M20 5.5A2 2 0 0018 4h-5v16h5a2 2 0 002-2z"/>'),
  passport: ico('<rect x="4" y="3" width="16" height="18" rx="2"/><circle cx="12" cy="10" r="3"/><path d="M9 17h6"/>'),
  coin:     ico('<circle cx="12" cy="12" r="9"/><path d="M12 7v10M9.5 9.5h4a1.8 1.8 0 010 3.6h-3a1.8 1.8 0 000 3.6h4"/>'),
  home:     ico('<path d="M3 10.5L12 4l9 6.5"/><path d="M5 10v10h14V10"/><path d="M9 20v-5h6v5"/>'),
  star:     ico('<path d="M12 3.5l2.6 5.4 5.9.8-4.3 4.1 1 5.9-5.2-2.8-5.2 2.8 1-5.9L3.5 9.7l5.9-.8z"/>')
};

/* ---------- menu data ---------- */
const MENU = [
  { label: 'Home', href: '/' },
  {
    label: 'About',
    href: '/about',
    lead: {
      title: 'About Solutions 360',
      text: 'An Islamabad consultancy that keeps counselling, attestation and visa filing under one roof.',
      cta: 'Read our story', href: '/about'
    },
    items: [
      { icon: I.building, title: 'Who we are',  text: 'How the office works and what we handle in-house.', href: '/about' },
      { icon: I.people,   title: 'Our team',    text: 'The counsellors and case officers who will handle your file.', href: '/team' },
      { icon: I.shield,   title: 'Attestation', text: 'HEC, IBCC, embassy legalisation and certified translation.', href: '/about#attestation' }
    ]
  },
  {
    label: 'Countries',
    href: '/countries',
    lead: {
      title: 'Where our students go',
      text: 'We file applications into 26 countries. These four take the most students from Pakistan.',
      cta: 'All 26 countries', href: '/countries'
    },
    items: [
      { icon: I.globe, title: 'United Kingdom', text: '150+ universities. Two-year post-study work visa.', href: '/countries#uk' },
      { icon: I.globe, title: 'Canada',         text: '100+ universities. PGWP route to work after study.', href: '/countries#canada' },
      { icon: I.globe, title: 'Australia',      text: '80+ universities. Post-study work rights included.', href: '/countries#australia' },
      { icon: I.globe, title: 'Germany',        text: '50+ universities. Low or no tuition at public ones.', href: '/countries#germany' }
    ]
  },
  {
    label: 'Courses',
    href: '/courses',
    lead: {
      title: 'Find a course you can get into',
      text: 'Shortlists built around entry requirements you can meet this intake, not next year.',
      cta: 'Browse all courses', href: '/courses'
    },
    items: [
      { icon: I.cap,  title: 'Undergraduate', text: 'Bachelor programmes after FSc, A-Levels or equivalent.', href: '/courses#undergraduate' },
      { icon: I.book, title: 'Postgraduate',  text: 'Masters and MPhil routes after a Pakistani bachelor.', href: '/courses#postgraduate' },
      { icon: I.coin, title: 'Scholarships',  text: 'Merit awards and fee waivers you are eligible for.', href: '/courses#scholarships' }
    ]
  },
  { label: 'Success stories', href: '/success-stories' },
  { label: 'Contact', href: '/contact' }
];

/* ---------- build nav ---------- */
function buildNav() {
  var top =
    '<div class="topbar"><div class="topbar-inner">' +
      '<span>Mon&ndash;Sat, 11:00 AM &ndash; 6:00 PM &middot; Islamabad</span>' +
      '<div class="top-links">' +
        '<a href="mailto:solution360int@gmail.com">solution360int@gmail.com</a>' +
        '<a href="/whatsapp">+92 314 444 1280</a>' +
      '</div>' +
    '</div></div>';

  var links = '';
  MENU.forEach(function (m, i) {
    if (!m.items) {
      links += '<li class="s3nav-li"><a class="s3nav-link" href="' + m.href + '">' + m.label + '</a></li>';
      return;
    }
    var panel =
      '<div class="s3panel" id="s3panel-' + i + '"><div class="s3panel-in">' +
        '<div class="s3panel-lead">' +
          '<h4>' + m.lead.title + '</h4>' +
          '<p>' + m.lead.text + '</p>' +
          '<a href="' + m.lead.href + '">' + m.lead.cta + ' &rarr;</a>' +
        '</div>' +
        '<div class="s3panel-grid">' +
          m.items.map(function (it) {
            return '<a class="s3panel-item" href="' + it.href + '">' +
                     '<span class="s3panel-ico">' + it.icon + '</span>' +
                     '<span><b>' + it.title + '</b><em>' + it.text + '</em></span>' +
                   '</a>';
          }).join('') +
        '</div>' +
      '</div></div>';

    links +=
      '<li class="s3nav-li has-panel">' +
        '<button class="s3nav-link s3nav-btn" aria-expanded="false" aria-controls="s3panel-' + i + '">' +
          m.label +
          '<svg class="s3nav-caret" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg>' +
        '</button>' + panel +
      '</li>';
  });

  return top +
    '<nav id="navbar">' +
      '<div class="nav-inner">' +
        '<a href="/" class="logo">' +
          '<div class="logo-icon">S3</div>' +
          '<div class="logo-text">Solutions 360<span>Study Abroad Consultants</span></div>' +
        '</a>' +
        '<button class="s3burger" id="s3burger" aria-label="Menu" aria-expanded="false"><span></span><span></span><span></span></button>' +
        '<div class="s3nav-wrap" id="s3navWrap">' +
          '<ul class="s3nav">' + links + '</ul>' +
          '<a href="/contact" class="s3nav-cta">Free counselling</a>' +
        '</div>' +
      '</div>' +
    '</nav>';
}

/* ---------- footer ---------- */
const FOOTER_HTML =
  '<footer><div class="footer-grid">' +
    '<div class="footer-brand">' +
      '<div class="f-logo">Solutions 360<span>Study Abroad Consultants</span></div>' +
      '<p>An Islamabad consultancy handling university placement, document attestation and visa filing for Pakistani students.</p>' +
      '<div class="social-links">' +
        '<a href="/whatsapp" class="social-btn">WhatsApp</a>' +
        '<a href="mailto:solution360int@gmail.com" class="social-btn">Email us</a>' +
      '</div>' +
    '</div>' +
    '<div class="footer-col"><h5>Company</h5>' +
      '<a href="/about">About us</a><a href="/team">Our team</a>' +
      '<a href="/success-stories">Success stories</a><a href="/contact">Contact</a>' +
    '</div>' +
    '<div class="footer-col"><h5>Destinations</h5>' +
      '<a href="/countries#uk">United Kingdom</a><a href="/countries#canada">Canada</a>' +
      '<a href="/countries#australia">Australia</a><a href="/countries#germany">Germany</a>' +
      '<a href="/countries">All 26 countries</a>' +
    '</div>' +
    '<div class="footer-col"><h5>Get in touch</h5>' +
      '<a href="tel:+923144441280">+92 314 444 1280</a>' +
      '<a href="mailto:solution360int@gmail.com">solution360int@gmail.com</a>' +
      '<a href="/contact">Islamabad, Pakistan</a>' +
      '<a href="/whatsapp" class="wa-link">Chat on WhatsApp</a>' +
    '</div>' +
  '</div>' +
  '<div class="footer-bottom">' +
    '<p>&copy; Solutions 360, 2026. All rights reserved.</p>' +
    '<span class="footer-badge">HEC &middot; IBCC &middot; EMBASSY ATTESTATION</span>' +
  '</div></footer>' +
  '<a href="/whatsapp" class="whatsapp-fab" title="Chat on WhatsApp"><svg viewBox="0 0 24 24" fill="currentColor" width="26" height="26"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg></a>';


/* ---------- wire it up ---------- */
function injectLayout() {
  var navHost = document.getElementById('nav-placeholder');
  var footHost = document.getElementById('footer-placeholder');
  if (navHost) navHost.innerHTML = buildNav();
  if (footHost) footHost.innerHTML = FOOTER_HTML;

  var path = window.location.pathname.replace(/\/$/, '') || '/';

  /* mark the current section */
  document.querySelectorAll('.s3nav-li').forEach(function (li) {
    var direct = li.querySelector(':scope > a.s3nav-link');
    if (direct && direct.getAttribute('href') === path) li.classList.add('current');
    li.querySelectorAll('.s3panel a').forEach(function (a) {
      if (a.getAttribute('href').split('#')[0] === path) li.classList.add('current');
    });
  });

  /* dropdown behaviour: hover on desktop, tap on touch */
  var isTouch = window.matchMedia('(hover: none)').matches;
  var panels = document.querySelectorAll('.s3nav-li.has-panel');

  function closeAll(except) {
    panels.forEach(function (li) {
      if (li === except) return;
      li.classList.remove('open');
      var b = li.querySelector('.s3nav-btn');
      if (b) b.setAttribute('aria-expanded', 'false');
    });
  }

  panels.forEach(function (li) {
    var btn = li.querySelector('.s3nav-btn');

    btn.addEventListener('click', function (e) {
      e.preventDefault();
      var open = li.classList.toggle('open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      closeAll(li);
    });

    if (!isTouch) {
      li.addEventListener('mouseenter', function () {
        closeAll(li);
        li.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      });
      li.addEventListener('mouseleave', function () {
        li.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
      });
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeAll(null);
  });
  document.addEventListener('click', function (e) {
    if (!e.target.closest('.s3nav-li')) closeAll(null);
  });

  /* mobile drawer */
  var burger = document.getElementById('s3burger');
  var wrap = document.getElementById('s3navWrap');
  if (burger && wrap) {
    burger.addEventListener('click', function () {
      var open = wrap.classList.toggle('open');
      burger.classList.toggle('x', open);
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  /* shadow on scroll */
  var bar = document.getElementById('navbar');
  if (bar) {
    window.addEventListener('scroll', function () {
      bar.classList.toggle('scrolled', window.scrollY > 40);
    }, { passive: true });
  }
}

document.addEventListener('DOMContentLoaded', injectLayout);
