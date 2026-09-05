# Myrthe & Wisse — 27 maart 2027

Statische one-page website (myrthewisse.nl) met alle info uit *Informatie website.docx*,
in de stijl van de trouwkaart: warm gebroken wit papier, donkerblauwe inkt, zacht eucalyptusgroen.

## Bestanden

| Bestand | Inhoud |
|---|---|
| `index.html` | Alle content + de illustraties (inline SVG: zeilboot, varentakje, eucalyptustakje) |
| `style.css` | Kleurenpalet en typografie, bovenin als CSS-variabelen |
| `script.js` | Navigatiebalk, fade-ins en het RSVP-formulier |

Geen build-stap, geen dependencies. Openen kan met een dubbelklik op `index.html`;
online zetten is een kwestie van de drie bestanden uploaden (of via GitHub Pages / Netlify).

## Nog invullen

In `script.js`, bovenaan bij `CONFIG`:

```js
rsvpEmail:    'rsvp@myrthewisse.nl', // eigen mailadres
rsvpDeadline: '',                      // bijv. '1 februari 2027'
```

Zolang `rsvpDeadline` leeg is, staat er `[datum]` op de pagina — precies zoals in het Word-document.

Het RSVP-formulier werkt zonder server: bij versturen opent de mailapp met een ingevulde mail.
Wil je de antwoorden liever automatisch binnenkrijgen, vervang dan het submit-blok onderin
`script.js` door een POST naar bijvoorbeeld Formspree, Basin of een Google Form.

## Kleuren & fonts

Aanpassen in `style.css` onder `:root`:
`--paper #F7F3EA` · `--paper-soft #FAF8F2` · `--navy #24364B` · `--navy-warm #283A52`
· `--sage #7D8B7A` · `--lavender #A59AB2`.
Fonts: Playfair Display (titels) en Cormorant Garamond (tekst), via Google Fonts.

## Bron van de inhoud

De teksten komen uit *Informatie website.docx*; waar de kaarten in `reference_img/`
daarvan afwijken, volgt de site **de kaarten** (die zijn nieuwer):

- tijden: 13.30 welkom · 14.00 ceremonie · 15.00 taart & bubbels · 16.00 uitzwaaien ·
  16.30 aperitivo · 18.30 diner & feest · 01.00 bus (docx had 14.30 / 16.00 / 17.30 / 20.30);
- "taart & bubbels" in plaats van "taart & champagne";
- zondag: "koffie & Fries ontbijt" vanaf 10.00 uur (de eindtijd 13.00 uur komt uit de docx);
- aanspreekvorm "je/jou" in plaats van "jullie";
- domein **myrthewisse.nl** (niet myrtheenwisse.nl).

Alleen in de docx en dus alleen daaruit overgenomen: de bus van 01.00 uur naar
Van der Valk Sneek, het hoofdstuk Overnachten en de RSVP-lijst.
De ceremoniemeesters en het citaat van Grote Panda & Kleine Draak komen van de kaarten.
