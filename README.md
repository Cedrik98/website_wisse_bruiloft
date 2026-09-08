# Myrthe & Wisse — 27 maart 2027

Statische website (myrthewisse.nl) in de stijl van de trouwkaart: warm papier,
blauwe koppen, paarse tekst en een zacht groen eucalyptustakje.
Elk onderdeel is een eigen pagina; er wordt niet gescrold door alles heen.

## Pagina's

| Bestand | Pagina |
|---|---|
| `index.html` | Voorpagina: namen, datum, zeilboot en welkomsttekst |
| `programma.html` | Programma van zaterdag, met de zondagochtend als afsluiting |
| `dresscode.html` | Dresscode |
| `locaties.html` | Broerekerk en De Pollepleats, met kaartlinks |
| `vervoer.html` | Vervoer en de bus naar Sneek |
| `overnachten.html` | Overnachtingsmogelijkheden |
| `contact.html` | Ceremoniemeesters |
| `rsvp.html` | RSVP-formulier |

Gedeeld: `style.css` (kleuren en typografie) en `script.js` (menu, diavoorstelling, RSVP).
Het menu bovenaan staat in elke pagina; voeg je een pagina toe, dan moet dat rijtje
in elk bestand hetzelfde blijven. Onderaan elke pagina staat een link naar de volgende.
De menubalk heeft drie standen: boven 84rem (1344px) staat hij ruim, tussen 68 en
84rem wordt hij compacter zodat hij op één regel blijft, en onder 68rem (1088px)
klapt hij samen achter een knop "Menu". Let op: browserzoom telt mee — op 140% zoom
is een venster van 1853px nog maar 1280px "breed" voor de opmaak, en dan geldt de
compacte stand. Zonder die tussenstand brak de balk daar in twee regels.

Geen build-stap, geen dependencies. Online komt het via GitHub Pages
(branch `main`, root, met `CNAME` op myrthewisse.nl).

De links tussen de pagina's staan zonder `.html` (`href="programma"`), zodat de
adresbalk `myrthewisse.nl/programma` toont. GitHub Pages vindt `programma.html`
daar vanzelf bij. Gevolg: dubbelklikken op `index.html` werkt niet meer om door te
klikken, want een browser kan `file:///.../programma` niet vinden. Start lokaal dus:

```
python3 serve.py
```

Dat zet de site op http://localhost:8000 (of de eerstvolgende vrije poort) en zoekt
bij `/programma` net als GitHub Pages het bestand `programma.html` erbij. Een losse
pagina bekijken kan nog steeds met een dubbelklik; alleen het menu werkt dan niet.

## Nog invullen

In `script.js`, bovenaan bij `CONFIG`:

```js
rsvpDeadline: '',   // bijv. '1 februari 2027'
rsvpEndpoint: '',   // adres van het Apps Script, zie hieronder — verplicht
```

Zolang `rsvpDeadline` leeg is, staat er `[datum]` op de RSVP-pagina.

## RSVP: de antwoorden in een spreadsheet

Het formulier vraagt naam, kom je, allergieën, vegetarisch, en de bus van en naar
Van der Valk. Iedereen meldt zich apart aan — één aanmelding is één regel in de sheet.
Wie met z'n tweeën komt, vult het formulier dus twee keer in; dat staat ook boven het
formulier.

Aanmelden kan alleen via dit formulier; er is bewust geen mailoptie. `rsvpEndpoint`
moet dus ingevuld zijn, anders komt een aanmelding nergens aan. Voor de spreadsheet,
ingelogd als **myrthe.wisse@gmail.com**:

1. Ga naar [sheets.new](https://sheets.new) en noem het bestand bijvoorbeeld
   "RSVP Myrthe & Wisse". Zet in rij 1, van A tot en met F:
   `Ingezonden` · `Naam` · `Komt` · `Allergieën` · `Vegetarisch` · `Bus`
2. **Extensies → Apps Script**. Gooi weg wat er staat en plak:

   ```js
   function doPost(e) {
     const blad = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
     const data = JSON.parse(e.postData.contents);
     data.gasten.forEach(function (g) {
       blad.appendRow([new Date(data.ingezonden), g.naam, g.komt,
                       g.allergieen, g.vegetarisch, g.bus]);
     });
     return ContentService.createTextOutput('ok');
   }
   ```

   Opslaan met het diskette-icoon.
3. Rechtsboven **Implementeren → Nieuwe implementatie**. Klik op het tandwiel bij
   "Type selecteren" en kies **Web-app**. Dan:
   - Uitvoeren als: **Ik (myrthe.wisse@gmail.com)**
   - Wie heeft toegang: **Iedereen** — let op, *niet* "Iedereen met een Google-account",
     want dan moeten je gasten inloggen en wordt er niets opgeslagen.
4. Google vraagt om toestemming: **Toegang controleren** → kies het account →
   "Google heeft deze app niet geverifieerd" → **Geavanceerd** → **Ga naar Naamloos
   project (onveilig)** → **Toestaan**. Dat is normaal voor een eigen script.
5. Kopieer de **Web-app-URL** (eindigt op `/exec`) en plak die in `rsvpEndpoint`
   in `script.js`. Kwijt? In de Apps Script-editor: **Implementeren → Implementaties
   beheren**, daar staat hij onder "Web-app". Let op dat het adres op `/exec` eindigt;
   de `/dev`-variant is alleen een testadres dat voor gasten niet werkt.
6. Vul het formulier op de site één keer in met je eigen naam en kijk of de regel in
   de sheet verschijnt. Verwijder die testregel daarna.

Downloaden als Excel kan via **Bestand → Downloaden → Microsoft Excel**. Wil je een
mailtje bij elke aanmelding: in de sheet **Extra → Meldingsregels instellen**.

### Waarom het versturen "blind" gebeurt

Google's Apps Script stuurt geen CORS-header terug, waardoor een browser het antwoord
niet mag lezen. Het verzoek gaat daarom met `mode: 'no-cors'`: het komt wél aan, maar
we krijgen geen bevestiging terug (`type: opaque`, `status: 0`). Het formulier meldt
dus "dank je wel" zodra het verzoek de deur uit is. Alleen als er echt geen verbinding
is, mislukt de `fetch` en vraagt het formulier om het nog eens te proberen.

Gevolg: de site kan niet zien of Google de regel echt heeft opgeslagen. Omdat er geen
mailterugval meer is, is dat het enige zwakke punt: staat de implementatie verkeerd,
dan ziet een gast "dank je wel" terwijl er niets in de sheet komt. Controleer daarom
na elke wijziging aan het Apps Script één keer met een testaanmelding of de regel
verschijnt, en kijk tussendoor af en toe in de sheet. Een snelle controle of de implementatie openbaar staat,
kan ook zonder browser:

```
curl -sL "<jouw /exec-URL>" | grep -o "Scriptfunctie niet gevonden: doGet"
```

Komt die tekst terug, dan is de web-app bereikbaar zonder inloggen — precies goed.
Krijg je in plaats daarvan een inlogpagina, dan staat "Wie heeft toegang" verkeerd.

Pas je het Apps Script aan, dan moet je **een nieuwe implementatie maken** (of de
bestaande bewerken en het versienummer ophogen) — anders blijft de oude versie draaien.

## Kleuren & fonts

Aanpassen in `style.css` onder `:root`. De waarden zijn uit de kaarten gehaald:

| Variabele | Kleur | Gebruik |
|---|---|---|
| `--paper` | `#F7F2EE` | achtergrond |
| `--navy` | `#0B4A85` | koppen |
| `--navy-deep` | `#0A2C63` | namen op de voorpagina |
| `--purple` | `#6B5590` | lopende tekst |
| `--purple-soft` | `#8C7FA5` | tijden, labels |
| `--sage` | `#7D8B7A` | onderstrepingen, focusrand |

Fonts: Playfair Display (koppen) en Cormorant Garamond (tekst), via Google Fonts.

### Lettergroottes: één knop

Alle maten hangen aan de basisregel in `body`:

```css
font-size: clamp(1.25rem, .4vw + 1.15rem, 1.6rem);   /* 20px → 25,6px */
```

Alles daaronder staat in `em`, dus als een breuk van die basis: labels en kopjes
in kapitalen `.72em`, knoppen `.78em`, plaatsnamen in het programma `.82em`,
kaarttitels `1.2em`, de introzin op de voorpagina `1.12em`. Wil je de site groter
of kleiner, verander dan alleen die ene regel — alles schuift mee en de verhoudingen
blijven gelijk.

Alleen de zeven display-maten hebben een eigen `clamp()`: de namen op de voorpagina,
de datum, "Friesland", de paginatitels en de twee `.statement`-regels. Die staan
bewust los omdat ze sneller mee moeten groeien met de schermbreedte.

Zet nooit een vaste `rem`-maat in een onderdeel: dat was precies waarom pagina's
eerder onderling verschilden.

### Kolombreedtes

Dezelfde valkuil geldt voor breedtes. De maten staan bij elkaar bovenin:
`--measure` (44rem) is de leeskolom voor alle lopende tekst, `.page` (74rem) is
de buitenmaat van een pagina, en de kaartrasters zitten daartussen
(`.cards` 64rem, `.cards--three` 74rem).

Die maten staan als `min(44rem, 100%)` genoteerd, en dat is geen franje: deze blokken
worden met `margin: auto` gecentreerd in een flex-kolom, waardoor ze op hun inhoud
worden gemeten in plaats van op de beschikbare ruimte. Zonder die `100%` werd het
kaartraster op een telefoon 502px breed in een scherm van 390px. Zet er dus altijd
`min(..., 100%)` omheen.

Waarom dat uitmaakt: bij dezelfde lettergrootte bepaalt de breedte van het blok
hoe lang de regels zijn, en dáár zie je verschil tussen pagina's. Ter controle,
gemeten op een scherm van 1440px: vervoer 66 tekens per regel, contact 60,
RSVP 61, locaties 46, programma 36, overnachten 32. Blijf in die bandbreedte;
een blok dat er ver buiten valt, valt op als "een andere pagina".

## Beeld

In `imgs/` staan de originelen én de versies die de site gebruikt:

| Gebruikt | Origineel | Waar |
|---|---|---|
| `boot.png` | `boat.png` | voorpagina |
| `takje.png` | `laurier_point_right.png` | onder elke paginatitel |
| `takje-klein.png` | `laurier_point_left.png` | onder de namen, en boven de opmerking bij het programma |
| `takje-hart.png` | `hearth_laurier.png` | onder de titel op de RSVP-pagina, en als afsluiting bij de ceremoniemeesters |
| `broerekerk.jpg` | `boerenkerk.jpeg` | locatiekaart |
| `pollepleats.jpg` | `polleplaats.jpeg` | locatiekaart |
| `samen-op-het-water.jpg`, `samen-zeilen.jpg`, `zonsondergang.jpg`, `aan-boord.jpg`, `surfles.jpg` | de WhatsApp-foto's | diavoorstelling op de voorpagina |

Op de voorpagina wisselen de zeilboot en die vijf foto's elkaar af: elke 5 seconden
een zachte overvloeier, in de volgorde waarin ze in `index.html` staan. Een foto
toevoegen of weghalen is een `<img class="hero__slide">` erbij of eruit; de tekening
staat als eerste en is dus ook wat je ziet zonder JavaScript. Wie "verminder
beweging" aan heeft staan, ziet alleen de tekening.

De menubalk staat op de voorpagina verborgen en schuift in beeld zodra je met de muis
naar de bovenrand gaat of een klein stukje scrollt. Op de andere pagina's staat hij
gewoon vast bovenaan.

De tekeningen hadden het papier van de kaart als vlakke achtergrond; in de gebruikte
versies is die weggehaald (transparant) en is de rand strak bijgesneden, zodat ze
op de achtergrond van de site passen. Vervang je een tekening, doe dat dan ook —
anders zie je een lichte rechthoek om de illustratie.

De takjes zijn daarna optisch gecentreerd: er staat wat lege ruimte aan één kant,
zodat het zwaartepunt van de tekening in het midden valt en niet het kader.
Zonder die correctie hangt bijvoorbeeld `takje-klein.png` zichtbaar links,
omdat de bladeren links zitten en de kale steel naar rechts uitsteekt.

De foto's zijn verkleind naar max 1000px.

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
