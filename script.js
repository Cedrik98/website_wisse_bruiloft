/* =========================================================
   Myrthe & Wisse
   ---------------------------------------------------------
   AANPASSEN: hieronder het mailadres, de RSVP-datum en
   (optioneel) het adres waar de antwoorden heen mogen.
   Zie README.md voor het opzetten van de spreadsheet.
   ========================================================= */

const CONFIG = {
  rsvpEmail: 'rsvp@myrthewisse.nl', // <-- vul hier je eigen mailadres in
  rsvpDeadline: '1 oktober 2026',                 // <-- bijv. '1 februari 2027' (leeg = toont [datum])
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
  const lijst = form.querySelector('#gasten');
  const sjabloon = form.querySelector('#gast-sjabloon');
  const knopErbij = form.querySelector('#gast-erbij');
  let teller = 0;

  const gastErbij = (titel) => {
    teller += 1;
    const blok = sjabloon.content.firstElementChild.cloneNode(true);
    blok.innerHTML = blok.innerHTML.replaceAll('__n__', String(teller));
    blok.querySelector('.gast__titel').textContent = titel;

    const weg = blok.querySelector('.gast__weg');
    if (teller === 1) {
      weg.remove();
    } else {
      weg.hidden = false;
      weg.addEventListener('click', () => {
        blok.remove();
        knopErbij.hidden = false;
      });
    }

    lijst.append(blok);
    return blok;
  };

  gastErbij('Jij');

  knopErbij.addEventListener('click', () => {
    const blok = gastErbij('Wie neem je mee?');
    knopErbij.hidden = true;                       // één +1 is genoeg
    blok.querySelector('input[type="text"]').focus();
  });

  // per gast één regel, zodat het zo de spreadsheet in kan
  const lees = () => Array.from(form.querySelectorAll('.gast')).map((blok) => {
    const waarde = (veld) => {
      const el = blok.querySelector(`[data-veld="${veld}"]:checked`)
              || blok.querySelector(`input[data-veld="${veld}"]`);
      return el ? el.value.trim() : '';
    };
    return {
      naam: waarde('naam'),
      komt: waarde('komt'),
      allergieen: waarde('allergie') || 'geen',
      vegetarisch: waarde('vega'),
      bus: waarde('bus'),
    };
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;

    const gasten = lees();

    if (CONFIG.rsvpEndpoint) {
      try {
        await fetch(CONFIG.rsvpEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify({ ingezonden: new Date().toISOString(), gasten }),
        });
        form.querySelectorAll('input, button').forEach((el) => { el.disabled = true; });
        toonStatus('Dank je wel, we hebben je aanmelding ontvangen. Tot 27 maart!');
        return;
      } catch (fout) {
        // geen verbinding: dan alsnog per mail
      }
    }

    const regels = gasten.map((g) => [
      'Naam: ' + g.naam,
      'Komt: ' + g.komt,
      'Allergieën: ' + g.allergieen,
      'Vegetarisch: ' + g.vegetarisch,
      'Bus naar Van der Valk: ' + g.bus,
    ].join('\n'));

    const mailto = 'mailto:' + CONFIG.rsvpEmail +
      '?subject=' + encodeURIComponent('RSVP Myrthe & Wisse — ' + (gasten[0] ? gasten[0].naam : '')) +
      '&body=' + encodeURIComponent(regels.join('\n\n'));

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
