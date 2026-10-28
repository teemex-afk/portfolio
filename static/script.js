const $ = (s, a = document) => [...a.querySelectorAll(s)];
const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;

const burger = document.getElementById('burger');
const mobile = document.getElementById('mobile');
burger.addEventListener('click', () => mobile.classList.toggle('open'));
$('a', mobile).forEach(a => a.addEventListener('click', () => mobile.classList.remove('open')));

const words = ['Backend Developer', 'CMS Specialist', 'Graphic Designer'];
const typed = document.getElementById('typed');
let w = 0, c = 0, del = false;
function type() {
  const t = words[w];
  typed.textContent = t.slice(0, c);
  if (!del && c === t.length) { del = true; return setTimeout(type, 1400); }
  if (del && c === 0) { del = false; w = (w + 1) % words.length; }
  c += del ? -1 : 1;
  setTimeout(type, del ? 40 : 80);
}
calm ? (typed.textContent = words[0]) : type();

function count(n) {
  const to = +n.dataset.count, b = n.querySelector('b');
  let s = null;
  const f = t => {
    s ??= t;
    const p = Math.min((t - s) / 1500, 1);
    b.textContent = Math.round(to * (1 - Math.pow(1 - p, 3))) + '+';
    if (p < 1) requestAnimationFrame(f);
  };
  requestAnimationFrame(f);
}

const io = new IntersectionObserver(es => es.forEach(e => {
  if (!e.isIntersecting) return;
  e.target.classList.add('in');
  if (e.target.dataset.count) count(e.target);
  io.unobserve(e.target);
}), { threshold: 0.2 });

function tilt(card) {
  card.addEventListener('pointermove', e => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    card.style.setProperty('--mx', x * 100 + '%');
    card.style.setProperty('--my', y * 100 + '%');
    if (!calm) card.style.transform = `perspective(800px) rotateX(${(0.5 - y) * 10}deg) rotateY(${(x - 0.5) * 12}deg) translateY(-4px)`;
  });
  card.addEventListener('pointerleave', () => card.style.transform = '');
}

const svg = d => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
const IC = {
  code: '<polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>',
  bag: '<path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>',
  pin: '<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>',
  home: '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>',
  doc: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>',
  server: '<rect x="2" y="2" width="20" height="8" rx="2"/><rect x="2" y="14" width="20" height="8" rx="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/>'
};
const pick = t => /store|shop/i.test(t) ? 'bag' : /travel|tour/i.test(t) ? 'pin' : /vacation|rental/i.test(t) ? 'home' : /api/i.test(t) ? 'server' : /content|manage/i.test(t) ? 'doc' : 'code';

function esc(s) {
  return String(s).replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
}

const box = document.getElementById('projects-list');
fetch('/api/projects')
  .then(r => r.json())
  .then(list => {
    box.innerHTML = list.map((p, i) =>
      `<article class="card rv k${i % 4 + 1}"><div class="ico">${svg(IC[pick(p.title)])}</div><h3>${esc(p.title)}</h3><p>${esc(p.description)}</p><a href="${esc(p.link)}" target="_blank" rel="noopener">View project</a></article>`
    ).join('');
    $('.card', box).forEach(n => { tilt(n); io.observe(n); });
  })
  .catch(() => { box.textContent = 'Projects could not be loaded. Please refresh.'; });

$('.rv').forEach(n => { io.observe(n); if (n.classList.contains('card')) tilt(n); });

const links = $('.links a');
const so = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) links.forEach(a => a.classList.toggle('on', a.hash === '#' + e.target.id));
}), { rootMargin: '-45% 0px -50% 0px' });
$('main [id]').forEach(s => so.observe(s));

const bar = document.getElementById('progress');
const glow = document.getElementById('glow');
addEventListener('scroll', () => {
  bar.style.width = (scrollY / (document.documentElement.scrollHeight - innerHeight)) * 100 + '%';
}, { passive: true });
addEventListener('pointermove', e => {
  glow.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
});

const track = document.querySelector('.track');
track.innerHTML += track.innerHTML;

if (!calm) {
  const cv = document.getElementById('bg'), g = cv.getContext('2d');
  const col = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim();
  let W, H, P = [];
  const size = () => {
    W = cv.width = innerWidth; H = cv.height = innerHeight;
    P = Array.from({ length: Math.min(70, (W / 18) | 0) }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4
    }));
  };
  size();
  addEventListener('resize', size);
  (function draw() {
    g.clearRect(0, 0, W, H);
    g.fillStyle = g.strokeStyle = col;
    P.forEach((p, i) => {
      p.x = (p.x + p.vx + W) % W;
      p.y = (p.y + p.vy + H) % H;
      g.globalAlpha = 0.5;
      g.fillRect(p.x, p.y, 2, 2);
      for (let j = i + 1; j < P.length; j++) {
        const q = P[j], d = Math.hypot(p.x - q.x, p.y - q.y);
        if (d < 120) {
          g.globalAlpha = (1 - d / 120) * 0.25;
          g.beginPath(); g.moveTo(p.x, p.y); g.lineTo(q.x, q.y); g.stroke();
        }
      }
    });
    requestAnimationFrame(draw);
  })();
}