/* =========================================================
   Myrthe & Wisse — RSVP
   ---------------------------------------------------------
   AANPASSEN: vul hieronder het RSVP-mailadres en de
   uiterste RSVP-datum in. Deze pagina heeft verder geen JS.
   ========================================================= */

const CONFIG = {
  rsvpEmail: 'rsvp@myrthewisse.nl', // <-- vul hier je eigen mailadres in
  rsvpDeadline: '',                 // <-- bijv. '1 februari 2027' (leeg = toont [datum])
};

if (CONFIG.rsvpDeadline) {
  document.querySelectorAll('[data-rsvp-deadline]').forEach((el) => {
    el.textContent = CONFIG.rsvpDeadline;
  });
}

document.querySelectorAll('[data-rsvp-mail]').forEach((el) => {
  el.textContent = CONFIG.rsvpEmail;
  el.href = 'mailto:' + CONFIG.rsvpEmail;
});

/* ---------- Versturen opent een ingevulde mail ----------
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
    const regels = [
      'Naam: ' + (data.get('naam') || '-'),
      'E-mail: ' + (data.get('email') || '-'),
      'Aanwezig: ' + data.get('aanwezig'),
      'Aantal personen: ' + (data.get('personen') || '-'),
      'Bus naar Van der Valk Sneek: ' + (data.get('bus') ? 'ja' : 'nee'),
      'Zondag koffie & Fries ontbijt: ' + (data.get('zondag') ? 'ja' : 'nee'),
      'Dieetwensen/allergieën: ' + ((data.get('dieet') || '').trim() || '-'),
      '',
      (data.get('bericht') || '').trim(),
    ];

    const subject = 'RSVP Myrthe & Wisse — ' + (data.get('naam') || '');
    const mailto =
      'mailto:' + CONFIG.rsvpEmail +
      '?subject=' + encodeURIComponent(subject) +
      '&body=' + encodeURIComponent(regels.join('\n').trim());

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
