# Myrthe & Wisse — 27 maart 2027

Statische one-page website (myrtheenwisse.nl) met alle info uit *Informatie website.docx*,
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
rsvpEmail:    'rsvp@myrtheenwisse.nl', // eigen mailadres
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

## Let op: tijden

De site volgt de tijden uit *Informatie website.docx*:
13.30 / 14.00 / 14.30 · 16.00 aperitivo · 17.30 diner · 20.30 feest · 01.00 bus.
Op de kaart in `reference_img/` staan andere tijden (15.00 taart, 16.30 aperitivo, 18.30 diner & feest).
Even checken welke versie klopt.
