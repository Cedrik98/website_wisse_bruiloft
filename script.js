/* =========================================================
   Myrthe & Wisse
   ---------------------------------------------------------
   AANPASSEN: hieronder de RSVP-datum en het adres van het
   Apps Script waar de antwoorden heen gaan.
   Zie README.md voor het opzetten van de spreadsheet.
   ========================================================= */

const CONFIG = {
  rsvpDeadline: '1 november 2026',                 // <-- bijv. '1 februari 2027' (leeg = toont [datum])
  rsvpEndpoint: 'https://script.google.com/macros/s/AKfycbzIWuDZCaXjm_vX4fQB-rGa9N7rirAkJSDbB6eXEyTO1yI8C4e0PaWgo4QgPD21HO9X/exec',                 // <-- webadres van het Google Apps Script (verplicht)
};

/* ---------- Menu op smalle schermen ---------- */

const menuKnop = document.querySelector('.topbar__knop');
const menu = document.getElementById('hoofdmenu');

if (menuKnop && menu) {
  menuKnop.addEventListener('click', () => {
    const open = menuKnop.getAttribute('aria-expanded') === 'true';
    menuKnop.setAttribute('aria-expanded', String(!open));
    menu.classList.toggle('is-open', !open);
  });
}

/* ---------- Voorpagina: menubalk verschijnt bij hover of scrollen ---------- */

const heroBar = document.querySelector('.topbar--hero');

if (heroBar) {
  const toon = (dichtbijBoven) => {
    const open = menuKnop && menuKnop.getAttribute('aria-expanded') === 'true';
    heroBar.classList.toggle('is-visible', window.scrollY > 40 || dichtbijBoven || open);
  };
  addEventListener('scroll', () => toon(false), { passive: true });
  addEventListener('mousemove', (e) => toon(e.clientY < 80), { passive: true });
  heroBar.addEventListener('focusin', () => heroBar.classList.add('is-visible'));
  if (menuKnop) menuKnop.addEventListener('click', () => toon(true));
  toon(false);
}

/* ---------- Voorpagina: boot en foto's wisselen elkaar af ---------- */

const stage = document.querySelector('.hero__stage');

if (stage && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const slides = Array.from(stage.querySelectorAll('.hero__slide'));

  // de volgende dia alvast ophalen, anders is het kader even leeg bij de wissel
  const alvastLaden = (n) => {
    const img = slides[n % slides.length];
    if (img.loading === 'lazy') img.loading = 'eager';
  };

  if (slides.length > 1) {
    let i = 0;
    alvastLaden(1);
    setInterval(() => {
      if (document.hidden) return;
      slides[i].classList.remove('is-active');
      i = (i + 1) % slides.length;
      slides[i].classList.add('is-active');
      alvastLaden(i + 1);
    }, 5000);
  }
}

/* ---------- RSVP ---------- */

if (CONFIG.rsvpDeadline) {
  document.querySelectorAll('[data-rsvp-deadline]').forEach((el) => {
    el.textContent = CONFIG.rsvpDeadline;
  });
}

const form = document.getElementById('rsvp-form');

if (form) {
  // één regel per aanmelding; iedereen vult het formulier voor zichzelf in
  const lees = () => {
    const veld = (naam) => {
      const el = form.querySelector(`[name="${naam}"]:checked`) || form.querySelector(`[name="${naam}"]`);
      return el ? el.value.trim() : '';
    };
    return [{
      naam: veld('naam'),
      komt: veld('komt'),
      allergieen: veld('allergie') || 'geen',
      vegetarisch: veld('vega'),
      bus: veld('bus'),
    }];
  };

  let bezig = false;
  const verstuurKnop = form.querySelector('button[type="submit"]');

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (bezig) return;                       // dubbelklikken levert anders dubbele regels op
    if (!form.reportValidity()) return;

    bezig = true;
    if (verstuurKnop) {
      verstuurKnop.disabled = true;
      verstuurKnop.textContent = 'Versturen\u2026';
    }

    const gasten = lees();

    if (CONFIG.rsvpEndpoint) {
      try {
        // Google's Apps Script stuurt geen CORS-header terug, dus het antwoord is
        // niet leesbaar. Met mode 'no-cors' komt het verzoek wél aan; we krijgen
        // alleen geen bevestiging terug. Een uitzondering betekent: niet verstuurd.
        await fetch(CONFIG.rsvpEndpoint, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify({ ingezonden: new Date().toISOString(), gasten }),
        });
        toonBedankt(gasten[0]);
        return;
      } catch (fout) {
        // geen verbinding: hieronder vragen we om het opnieuw te proberen
      }
    }

    // geen mailoptie: aanmelden kan alleen via dit formulier
    bezig = false;
    if (verstuurKnop) {
      verstuurKnop.disabled = false;
      verstuurKnop.textContent = 'Verstuur RSVP';
    }

    toonStatus(
      'Het versturen lukte niet. Controleer je internetverbinding en probeer het ' +
      'nog een keer.'
    );
  });

  // de hele pagina schakelt om, zodat duidelijk is dat het gelukt is
  function toonBedankt(g) {
    const intro = document.querySelector('.page__intro');
    if (intro) intro.remove();

    const blok = document.createElement('div');
    blok.className = 'bedankt';

    const kop = document.createElement('p');
    kop.className = 'statement';
    kop.textContent = g.komt === 'ja' ? 'Dank je wel!' : 'Dank je wel voor het laten weten';

    const onder = document.createElement('p');
    onder.className = 'statement statement--sub';
    onder.textContent = g.komt === 'ja'
      ? 'We hebben je aanmelding ontvangen'
      : 'Jammer dat je er niet bij kunt zijn';

    const tekst = document.createElement('div');
    tekst.className = 'prose';
    const regel = document.createElement('p');
    if (g.komt === 'ja') {
      regel.append('Tot 27 maart, ');
      const naam = document.createElement('strong');
      naam.textContent = g.naam;
      regel.append(naam, '!');
    }

    tekst.append(regel);

    if (g.komt === 'ja') {
      const verder = document.createElement('p');
      verder.append('Nog even nalezen wat er die dag gebeurt? ');
      const link = document.createElement('a');
      link.className = 'link';
      link.href = 'programma.html';
      link.textContent = 'Bekijk het programma';
      verder.append(link, '.');
      tekst.append(verder);
    }
    blok.append(kop, onder, tekst);
    form.replaceWith(blok);
    blok.scrollIntoView({ block: 'center', behavior: 'smooth' });
  }

  function toonStatus(bericht) {
    let status = form.querySelector('.rsvp__status');
    if (!status) {
      status = document.createElement('p');
      status.className = 'rsvp__status';
      status.setAttribute('role', 'status');
      form.append(status);
    }
    status.textContent = bericht;
  }
}
