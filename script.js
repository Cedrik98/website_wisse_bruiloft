/* =========================================================
   Myrthe & Wisse — kleine interacties
   ---------------------------------------------------------
   AANPASSEN: vul hieronder het RSVP-mailadres en de
   uiterste RSVP-datum in. De rest gaat vanzelf.
   ========================================================= */

const CONFIG = {
  rsvpEmail: 'rsvp@myrtheenwisse.nl', // <-- vul hier jullie eigen mailadres in
  rsvpDeadline: '',                   // <-- bijv. '1 februari 2027' (leeg = toont [datum])
};

/* ---------- RSVP-datum & mailadres invullen ---------- */

if (CONFIG.rsvpDeadline) {
  document.querySelectorAll('[data-rsvp-deadline]').forEach((el) => {
    el.textContent = CONFIG.rsvpDeadline;
  });
}

document.querySelectorAll('[data-rsvp-mail]').forEach((el) => {
  el.textContent = CONFIG.rsvpEmail;
  el.href = 'mailto:' + CONFIG.rsvpEmail;
});

/* ---------- Navigatiebalk tonen na de hero ---------- */

const topbar = document.getElementById('topbar');
const hero = document.getElementById('top');

if (topbar && hero && 'IntersectionObserver' in window) {
  new IntersectionObserver(
    ([entry]) => topbar.classList.toggle('is-visible', !entry.isIntersecting),
    { rootMargin: '-70% 0px 0px 0px' }
  ).observe(hero);
}

/* ---------- Actieve sectie markeren ---------- */

const navLinks = Array.from(document.querySelectorAll('.topbar__nav a'));
const sections = navLinks
  .map((link) => document.querySelector(link.getAttribute('href')))
  .filter(Boolean);

if (sections.length && 'IntersectionObserver' in window) {
  const spy = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((link) =>
          link.classList.toggle('is-current', link.getAttribute('href') === '#' + entry.target.id)
        );
      });
    },
    { rootMargin: '-45% 0px -50% 0px' }
  );
  sections.forEach((section) => spy.observe(section));
}

/* ---------- Zachte fade-in per sectie ---------- */

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const revealables = document.querySelectorAll('.section, .footer');

if (!reduceMotion && 'IntersectionObserver' in window) {
  const revealer = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: '0px 0px -12% 0px' }
  );
  revealables.forEach((el) => {
    el.classList.add('reveal');
    revealer.observe(el);
  });
}

/* ---------- RSVP: opent een ingevulde mail ----------
   Geen server nodig. Wil je de antwoorden liever direct in
   een inbox of spreadsheet? Vervang het onderstaande blok
   door een POST naar bijv. Formspree, Basin of Google Forms.
------------------------------------------------------ */

const form = document.getElementById('rsvp-form');

if (form) {
  form.addEventListener('submit', (event) => {
    event.preventDefault();

    if (!form.reportValidity()) return;

    const data = new FormData(form);
    const komt = data.get('aanwezig');
    const regels = [
      'Naam: ' + (data.get('naam') || '-'),
      'E-mail: ' + (data.get('email') || '-'),
      'Aanwezig: ' + komt,
      'Aantal personen: ' + (data.get('personen') || '-'),
      'Bus naar Van der Valk Sneek: ' + (data.get('bus') ? 'ja' : 'nee'),
      'Zondag koffie & Fries lekkers: ' + (data.get('zondag') ? 'ja' : 'nee'),
      'Dieetwensen/allergieën: ' + ((data.get('dieet') || '').trim() || '-'),
      '',
      (data.get('bericht') || '').trim(),
    ];

    const subject = 'RSVP Myrthe & Wisse — ' + (data.get('naam') || '');
    const body = regels.join('\n').trim();
    const mailto =
      'mailto:' + CONFIG.rsvpEmail +
      '?subject=' + encodeURIComponent(subject) +
      '&body=' + encodeURIComponent(body);

    window.location.href = mailto;
    showStatus(
      'Je mailprogramma opent met een ingevulde mail. Versturen en klaar! ' +
      'Gebeurt er niets? Mail ons dan op ' + CONFIG.rsvpEmail + '.'
    );
  });
}

function showStatus(message) {
  let status = form.querySelector('.rsvp__status');
  if (!status) {
    status = document.createElement('p');
    status.className = 'rsvp__status';
    status.setAttribute('role', 'status');
    form.append(status);
  }
  status.textContent = message;
}
