# Studio Blomma — sivuston rakenne (muokkauspohja)

> Päivitettävä kartta koko sivustosta. Käytä numeroita (väri 1–14) sisältöön.
> Päivitetään aina, kun osia lisätään.

## Globaalit (joka sivulla)
- Header / nav
- **300** Alalaidan banneri — tausta 11, teksti 1, logo 1
- Footer

---

## ETUSIVU — `index.html`
- **106** Hero — kuva 1, otsikko, CTA-napit
- **201** Toimialojen liukulistaus (marquee)
- **208** Visuaalisuus & strategia (lausebanneri)
- **218** Sopeudumme alaasi + demot — kuva 4
- **219** Jotain extraa — 3 lisäpalvelukorttia
- **221** Näin se hoituu — 5 vaihetta
- **403** Hinnoittelu — 3 pakettikorttia
- **702** Arvostelut — tähdet x/5
- **801** Brändäysdemot + tyytyväisyystakuu

## PALVELUT — `palvelut.html`
- **212** Hero + aaltoteksti (liukuväri 1→11)
- **223** Nettisivuja joka lähtöön — 4 korttia (13/14)
- **908** Onko sinulla idea? — kuva 6, tummennus 40 %
- **800** Upgreidaa brändisi — accordion
- **815** Some-suunnittelu — tilasto + demo feed
- **402** Paketit — Freesaus / Nettisivut kuntoon / Kasvu
- **804** Verkkokauppa — kuva 5
- **215** Ajanhallinta + kalenteri
- **901** Tarjouspyyntöjen automatisointi — 2 esimerkkiä
- **906** Usein kysyttyä (FAQ)
- **801** Brändäysdemot + takuu (sama kuin etusivu)

---

## HINTALASKURI — `laskuri.html` [taso 1]
- **803** Kategoriavalinta (2×2): Nettisivut · Some · Brändi · Paketit
- **906** FAQ
- **801** Brändäysdemot + takuu

> **Hinta-arviot (kori)** — `arviot.html`. Jokainen laskettu erittely tallentuu
> (localStorage). Erittelyssä aina napit: **+ Lisää palvelu** (→ laskuri.html),
> **↑ Muokkaa valintoja**, ja **Hinta-arviot & tarjouspyyntö** (→ arviot.html).
> Arviot-sivulla kaikki arviot yhdessä, yhteissumma ja **Lähetä tarjouspyyntö**.

### 1.1 Nettisivut — `nettisivut.html` ✅
- Ala-/toimintovalitsin: 7 toimialanappia + iso "toimintojen mukaan" -laatikko
- **221** Näin se hoituu (kopio etusivulta) — ennen alaosaa

Toimialasivut (sama rakenne — ks. `03-nettisivut-toimialasivut.md`):
osa **111** (toimialahero: nimi + alateksti + demokuva + "Katso demo") +
**konkreettinen hintalaskuri** (Basic 399 € aina mukana + lisäominaisuudet + jatkuvat kulut).

- **1.1.1** Kauneusala     `kauneusala.html`   ✅  (web-demo-1)
- **1.1.2** Rakennusala    `rakennusala.html`  ✅  (web-demo-2)
- **1.1.3** Ravintola-ala  `ravintola.html`    ✅  (web-demo-3)
- **1.1.4** Kahvila-ala    `kahvila.html`      ✅  (web-demo-4)
- **1.1.5** Hyvinvointi    `hyvinvointi.html`  ✅  (web-demo-5)
- **1.1.6** Kukkakauppa    `kukkakauppa.html`  ✅  (web-demo-6)
- **1.1.7** Ominaisuudet   `ominaisuudet.html` ✅  (myös "Joku muu")
    - Otsikko + avattava kategorialista (tausta 1, teksti 3, napit väri 11)
    - Kategoriat: Verkkokauppa · Ajanvarausjärjestelmä · Kanta-asiakkuusjärjestelmä ·
      Hintalaskuri omalle sivulle · Blogi · Rekry-lomakkeet · Muu
    - "+" avaa laskurin (Basic aina mukana + ominaisuudet, kategorian oma esivalittuna);
      "Laske hinta" → lisäpalvelut-ikkuna (ohita/valitse) → hinta (ALV 0 %) + tarjouspyyntö
    - "Muu" → teksti erikoistapauksista + "Ota yhteyttä" -nappi

### 1.2 Sosiaalinen media — `some.html` ✅
- **402** Some-paketit (pelkistetty: pieni pallura, suoraan auki):
  Some alku (499€) · Some freesaus (349€) · Some kasvu (749€)
- **701** Miksi panostaa someen — 3 väitettä + lähteet (tausta 1, teksti 3)
- **801** Brändäysdemot + takuu
### 1.3 Brändi-identiteetti — `brandi-identiteetti.html` ⏳
### 1.4 Paketit             — `paketit.html`             ⏳

---

## MUUT SIVUT
- `meista.html` — Hero + sisältö [kesken]
- `demot.html` — Hero + demolista + CTA
- `yhteys.html` — Hero + yhteydenotto
- `tarjouspyynto.html` — Hero + lomake
- `nain-se-toimii.html` — Hero + 3 askelta + arvot + CTA

## DEMOT (demot.html)
- D1 Kukkakauppa · D2 Kynsitekniikko · D3 Rakennusyritys ·
  D4 Kakkukauppa · **D5 Wellness/Joogastudio (Velora Movement)** · D6 Kauneushoitola
  → spec: `02-demo-wellness.md`

## SISÄISET (ei navigaatiossa)
- `sivupohja.html` · `tyyliopas.html` · `paletti.html` · `varipaletti.html`

---

### Tila
- ✅ Valmiit: Etusivu, Palvelut, Hintalaskuri, Nettisivut 1.1, Toimialasivut 1.1.1–1.1.7
- ⏳ Tulossa: 1.2 some, 1.3 brändi, 1.4 paketit, Meistä
