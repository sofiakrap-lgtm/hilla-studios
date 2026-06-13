# Sivu 1 — Oma palvelusivu (Studio Blomma)

> Blomman oma sivu, jossa Sofia tarjoaa palveluitaan. Tästä linkitetään
> demosivuille. **Visuaalinen ilme = `CLAUDE.md`:n kovat arvot** (ei toisteta tässä).

## Perusrakenne

- **Yksisivuinen** — ei alasivuja, kaikki yhdellä sivulla.
- Houkutteleva, **professionaali, tosi selkeä** visuaalinen ulkonäkö.
- Suomenkielinen.

## Sisältölohkot

### 1. Hero
- Selkeä, houkutteleva avaus.
- **Mainitaan halvin mahdollinen hinta** nettisivulle ("alkaen X €"). → *hinta vahvistettava, ks. Avoimet päätökset.*
- CTA hintalaskuriin + tarjouspyyntöön.

### 2. Palvelut & hinnoittelu (selkeästi eritelty)
Tarkkaan eriteltynä: **mitä palveluita on tarjolla** ja **mistä hinnasta alkaen**.

Palvelukategoriat:
- **Nettisivujen rakentaminen** (eri tasot/paketit)
- **Brändäys:**
  - Logosuunnittelu
  - Mainosten suunnittelu
  - *(muut brändäykseen liittyvät — täydennetään)*

Viesti: **edullinen hinta** ja **joustavuus**. Jokaisella palvelulla
"alkaen"-hinta näkyvissä.

### 3. Hintalaskuri (ydinkomponentti)
- Sivun **keskeisin toiminto** — siihen ohjataan monesta kohtaa (hero, palvelut, CTA:t).
- Käyttäjä valitsee toimialan → näkee sen alan vaihtoehdot.
- Toimialat: kukkakauppa · kahvila · ravintola · tilauskakut · kauneushoitola · jooga-/pilateskurssi.
- Kunkin laskurin sisältö Sofian erikseen määrittelemä.
- *Tekninen kysymys:* erillinen `laskuri.html` vai upotettu omalle sivulle? → Avoimet päätökset.

### 4. Läpinäkyvyys-osio
Korostaa, että **kaikki on läpinäkyvää**:
- **Hinnoittelu läpinäkyvää** — hinta näkyy etukäteen laskurilla, ei piilokuluja.
- **Suunnitteluprosessi läpinäkyvä** — asiakas tietää tarkalleen miten edetään.

### 5. Näin se toimii (prosessi / asiakaspolku)
1. Asiakas **täyttää lomakkeen** → tekee **tarjouspyynnön**.
2. Tarjouspyyntö **hyväksytään**.
3. Asiakkaalle lähetetään **ideointikaavake** (ks. alla).

### 6. Kuvituskuvat
- Muutamia kuvituskuvia sivulle (lämmin filmikuva, ks. brändin kuvamaailma).

### 7. CTA / yhteydenotto
- Selkeä loppukehotus: laske hinta / tee tarjouspyyntö.

## Ideointikaavake (tärkeä erillinen osa)
Lähetetään asiakkaalle **tarjouspyynnön hyväksymisen jälkeen**. Kysyy tärkeitä
suunnittelukysymyksiä. **Interaktiivinen.** Asiakas voi lisätä mm.:

- **Omia kuvia** (useita)
- **Pinterest-boardeja**
- **Esimerkkisivuja** (samankaltaisia nettisivuja) + **miksi tykkää niistä**
- **Värikoodit** ja **fontit**
  - Huom: fonttien pitää olla **Google Fonts** -fontteja.
- Kuvien siirto / lataus on mietittävä (tekninen ratkaisu).

> ⚠️ **Tekninen reunaehto:** repo on staattinen (HTML + CSS + vanilla JS, ei
> backendia). Kuvien/tiedostojen lataus ja lomakedata vaativat erikseen
> ratkaisun → ks. Avoimet päätökset.

## Avoimet päätökset (Sofia päättää — kysy ennen kuin täytät)

1. **Halvin hinta:** mikä on "nettisivut alkaen ___ €" -luku?
2. **Brändin värisävy:** Bitter Cacao `#3D2A1C` — vahvistetaanko sellaisenaan?
3. **Toimialojen yleistys/laajennus:** Sofia kutsui ehdotuksia. Mahdollisia
   lisättäviä/yleistäviä kategorioita: *hyvinvointi/terapia*, *valokuvaaja/luova
   yrittäjä*, *putiikki/verkkokauppa*, *“muu ala / räätälöity”* kaikkien
   ulkopuolisille. → Pidetäänkö nykyiset 6 vai lisätäänkö?
4. **Hintalaskurin sijainti:** oma `laskuri.html` (kuten nyt) vai upotus
   yksisivuiselle sivulle?
5. **Lomakkeiden tekniikka (staattinen sivu):** miten tarjouspyyntö ja
   ideointikaavakkeen data + kuvat liikkuvat? Vaihtoehtoja:
   - sähköposti (`mailto:` — ei tiedostojen latausta)
   - kolmannen osapuolen lomakepalvelu (esim. Formspree / Netlify Forms / Google Forms)
   - upotettu ulkoinen työkalu
   Tämä ratkaisee kuvien latauksen ja interaktiivisuuden.
6. **Brändäyspalvelut:** logon ja mainosten lisäksi muita (esim. somegrafiikat,
   käyntikortit, menut)?
