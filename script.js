/* =========================================================
   Myrthe & Wisse
   ---------------------------------------------------------
   AANPASSEN: hieronder het mailadres, de RSVP-datum en
   (optioneel) het adres waar de antwoorden heen mogen.
   Zie README.md voor het opzetten van de spreadsheet.
   ========================================================= */

const CONFIG = {
  rsvpEmail: 'myrthe.wisse@gmail.com', // <-- vul hier je eigen mailadres in
  rsvpDeadline: '1 november 2026',                 // <-- bijv. '1 februari 2027' (leeg = toont [datum])
  rsvpEndpoint: 'https://script.google.com/macros/s/AKfycbz3aicWf5xX7VjrINawwSflT8MsAUiHHa8QdwkDvCYzNsQ-hoSGEgVBottRmbqtdwo3lw/exec',                 // <-- webadres van het Google Apps Script (leeg = per mail)
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

document.querySelectorAll('[data-rsvp-mail]').forEach((el) => {
  el.textContent = CONFIG.rsvpEmail;
  el.href = 'mailto:' + CONFIG.rsvpEmail;
});

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

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;

    const gasten = lees();

    if (CONFIG.rsvpEndpoint) {
      try {
        const antwoord = await fetch(CONFIG.rsvpEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify({ ingezonden: new Date().toISOString(), gasten }),
        });
        if (!antwoord.ok) throw new Error('status ' + antwoord.status);

        // Google stuurt een inlogpagina terug als de implementatie niet op
        // "Iedereen" staat; dan is er niets opgeslagen ondanks status 200.
        let tekst = 'ok';
        try { tekst = (await antwoord.text()).trim(); } catch (e) { /* niet leesbaar: aannemen dat het goed ging */ }
        if (tekst && !/^ok/i.test(tekst)) throw new Error('onverwacht antwoord van de spreadsheet');
        form.querySelectorAll('input, button').forEach((el) => { el.disabled = true; });
        toonStatus('Dank je wel, we hebben je aanmelding ontvangen. Tot 27 maart!');
        return;
      } catch (fout) {
        // niet opgeslagen: dan alsnog per mail, zodat de aanmelding niet verloren gaat
      }
    }

    const g = gasten[0];
    const regels = [
      'Naam: ' + g.naam,
      'Komt: ' + g.komt,
      'Allergieën: ' + g.allergieen,
      'Vegetarisch: ' + g.vegetarisch,
      'Bus naar Van der Valk: ' + g.bus,
    ].join('\n');

    const mailto = 'mailto:' + CONFIG.rsvpEmail +
      '?subject=' + encodeURIComponent('RSVP Myrthe & Wisse — ' + g.naam) +
      '&body=' + encodeURIComponent(regels);

    window.location.href = mailto;
    toonStatus(
      'Je mailprogramma opent met een ingevulde mail. Versturen en klaar! ' +
      'Gebeurt er niets? Mail ons dan op ' + CONFIG.rsvpEmail + '.'
    );
  });

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
