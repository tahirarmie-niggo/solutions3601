const LOADER_HTML = '<div id="s3-loader"><svg viewBox="0 0 240 240" role="status" aria-label="Loading"><defs><clipPath id="s3lSphere"><circle cx="120" cy="120" r="66"/></clipPath></defs><g clip-path="url(#s3lSphere)"><circle cx="120" cy="120" r="66" fill="var(--gold)"/><g fill="none" stroke="var(--bg)" stroke-width="7"><ellipse cx="120" cy="120" rx="66" ry="24"/><ellipse class="s3l-lon" cx="120" cy="120" rx="66" ry="66"/><ellipse class="s3l-lon" cx="120" cy="120" rx="66" ry="66"/></g></g><g class="s3l-ring" fill="none" stroke="var(--teal)" stroke-width="10" stroke-linecap="round"><path d="M120 16 A104 104 0 0 0 120 224"/><path d="M120 224 A104 104 0 0 0 152 219" opacity=".45"/></g><g class="s3l-arc" fill="none" stroke="var(--teal)" stroke-width="6" stroke-linecap="round"><path d="M120 34 A86 86 0 0 1 194 77" opacity=".8"/></g></svg></div>';

const NAV_HTML = '<div class="topbar"><div class="topbar-inner"><span>Mon-Sat: 11:00 AM - 6:00 PM | Islamabad, Pakistan</span><div class="top-links"><a href="mailto:solution360int@gmail.com">solution360int@gmail.com</a><a href="/whatsapp">+92 314 444 1280</a></div></div></div><nav id="navbar"><div class="nav-inner"><a href="/" class="logo"><div class="logo-icon">S3</div><div class="logo-text">Solutions 360<span>Study Abroad Consultants</span></div></a><button class="nav-toggle" onclick="toggleMenu()"><span></span><span></span><span></span></button><ul class="nav-links" id="navLinks"><li><a href="/">Home</a></li><li><a href="/about">About</a></li><li><a href="/countries">Countries</a></li><li><a href="/courses">Courses</a></li><li><a href="/success-stories">Success Stories</a></li><li><a href="/contact">Contact</a></li><li><a href="/whatsapp" class="nav-cta">Free Counselling</a></li></ul></div></nav>';

const FOOTER_HTML = '<footer><div class="footer-grid"><div class="footer-brand"><div class="f-logo">Solutions 360<span>Study Abroad Consultants</span></div><p>Pakistan trusted study abroad consultancy. Based in Islamabad.</p><div class="social-links"><a href="/whatsapp" class="social-btn">WhatsApp</a><a href="mailto:solution360int@gmail.com" class="social-btn">Email Us</a></div></div><div class="footer-col"><h5>Quick Links</h5><a href="/">Home</a><a href="/about">About Us</a><a href="/countries">Countries</a><a href="/courses">Courses</a><a href="/success-stories">Success Stories</a><a href="/contact">Contact</a></div><div class="footer-col"><h5>Countries</h5><a href="/countries">United Kingdom</a><a href="/countries">Canada</a><a href="/countries">Australia</a><a href="/countries">Germany</a><a href="/countries">Italy</a><a href="/countries">View All</a></div><div class="footer-col"><h5>Contact Us</h5><a href="tel:+923144441280">+92 314 444 1280</a><a href="mailto:solution360int@gmail.com">solution360int@gmail.com</a><a href="#">Islamabad, Pakistan</a><a href="/whatsapp" class="wa-link">Chat on WhatsApp</a></div></div><div class="footer-bottom"><p>Solutions 360 2026. All rights reserved.</p><span class="footer-badge">TRUSTED CONSULTANTS</span></div></footer><a href="/whatsapp" class="whatsapp-fab" title="Chat on WhatsApp"><svg viewBox="0 0 24 24" fill="currentColor" width="26" height="26"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg></a>';

(function mountLoader() {
  var root = document.documentElement;
  if (!root.classList.contains('s3-loading')) return;
  document.body.insertAdjacentHTML('afterbegin', LOADER_HTML);

  var MIN_MS = 1400;                // guaranteed minimum display time
  if (sessionStorage.getItem('s3seen')) MIN_MS = 0;   // only full loader on first view
  else sessionStorage.setItem('s3seen', '1');

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

  setTimeout(hide, 6000);           // safety net
})();

function injectLayout() {
  document.getElementById('nav-placeholder').innerHTML = NAV_HTML;
  document.getElementById('footer-placeholder').innerHTML = FOOTER_HTML;
  var path = window.location.pathname;
  document.querySelectorAll('.nav-links a').forEach(function(a) {
    if (a.getAttribute('href') === path) a.classList.add('active');
  });
  window.addEventListener('scroll', function() {
    document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 40);
  });
}

function toggleMenu() {
  document.getElementById('navLinks').classList.toggle('open');
}

document.addEventListener('DOMContentLoaded', injectLayout);
