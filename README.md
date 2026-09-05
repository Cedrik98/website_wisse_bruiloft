# Myrthe & Wisse — 27 maart 2027

Statische website (myrthewisse.nl) in de stijl van de trouwkaart: warm papier,
blauwe koppen, paarse tekst en een zacht groen eucalyptustakje.
Elk onderdeel is een eigen pagina; er wordt niet gescrold door alles heen.

## Pagina's

| Bestand | Pagina |
|---|---|
| `index.html` | Voorpagina: namen, datum, zeilboot en welkomsttekst |
| `programma.html` | Programma van zaterdag |
| `dresscode.html` | Dresscode |
| `locaties.html` | Broerekerk en De Pollepleats, met kaartlinks |
| `vervoer.html` | Vervoer en de bus naar Sneek |
| `overnachten.html` | Overnachtingsmogelijkheden |
| `zondag.html` | Zondag 28 maart |
| `contact.html` | Ceremoniemeesters |
| `rsvp.html` | RSVP-formulier |

Gedeeld: `style.css` (kleuren en typografie) en `script.js` (alleen voor het RSVP-formulier).
Het menu bovenaan staat in elke pagina; voeg je een pagina toe, dan moet dat rijtje
in elk bestand hetzelfde blijven. Onderaan elke pagina staat een link naar de volgende.

Geen build-stap, geen dependencies. Openen kan met een dubbelklik op `index.html`;
online komt het via GitHub Pages (branch `main`, root, met `CNAME` op myrthewisse.nl).

## Nog invullen

In `script.js`, bovenaan bij `CONFIG`:

```js
rsvpEmail:    'rsvp@myrthewisse.nl', // eigen mailadres
rsvpDeadline: '',                    // bijv. '1 februari 2027'
```

Zolang `rsvpDeadline` leeg is, staat er `[datum]` op de RSVP-pagina.

Het formulier werkt zonder server: bij versturen opent de mailapp met een ingevulde mail.
Wil je de antwoorden liever automatisch binnenkrijgen, vervang dan het submit-blok in
`script.js` door een POST naar bijvoorbeeld Formspree, Basin of een Google Form.

## Kleuren & fonts

Aanpassen in `style.css` onder `:root`. De waarden zijn uit de kaarten gehaald:

| Variabele | Kleur | Gebruik |
|---|---|---|
| `--paper` | `#F7F2EE` | achtergrond |
| `--navy` | `#0B4A85` | koppen |
| `--navy-deep` | `#0A2C63` | namen op de voorpagina |
| `--purple` | `#6B5590` | lopende tekst |
| `--purple-soft` | `#8C7FA5` | tijden, labels |
| `--sage` / `--sage-light` | `#7D8B7A` / `#A7B2A5` | het takje |
| `--ink` | `#22406B` | de zeilboot |

Fonts: Playfair Display (koppen) en Cormorant Garamond (tekst), via Google Fonts.

## Bron van de inhoud

De teksten komen uit *Informatie website.docx*; waar de kaarten in `reference_img/`
daarvan afwijken, volgt de site **de kaarten** (die zijn nieuwer):

- tijden: 13.30 welkom · 14.00 ceremonie · 15.00 taart & bubbels · 16.00 uitzwaaien ·
  16.30 aperitivo · 18.30 diner & feest · 01.00 bus (docx had 14.30 / 16.00 / 17.30 / 20.30);
- "taart & bubbels" in plaats van "taart & champagne";
- zondag: "koffie & Fries ontbijt" vanaf 10.00 uur (de eindtijd 13.00 uur komt uit de docx);
- aanspreekvorm "je/jou" in plaats van "jullie";
- domein myrthewisse.nl.

Alleen uit de docx: de bus van 01.00 uur, het hoofdstuk Overnachten en de RSVP-lijst.
De ceremoniemeesters komen van de kaart.
