# Studio Blomma — projektisuunnitelma

> Tämä kansio kerää **vaatimukset ja rakenteen** Blomman sivustoille.
> Tarkoitus: erotella mitä ominaisuuksia kukin sivu tarvitsee **ennen
> rakentamista**. Visuaalinen ilme tulee aina `CLAUDE.md`:n kovista arvoista.

## Sivut

| # | Sivu | Tyyppi | Tila | Spec |
|---|------|--------|------|------|
| 1 | **Oma palvelusivu** (Studio Blomma) | Yksisivuinen | Vaatimukset kerätään | [`01-oma-sivu.md`](01-oma-sivu.md) |
| 2 | Demo — *(toimiala avoin)* | Demo | Ei aloitettu | – |
| 3 | Demo — *(toimiala avoin)* | Demo | Ei aloitettu | – |
| 4 | Demo — *(toimiala avoin)* | Demo | Ei aloitettu | – |

Oma sivu on keskus: siitä linkitetään demosivuille.

## Läpileikkaavat konseptit (koskee useaa sivua)

### Hintalaskuri
Sivuston **ydinkomponentti** — siihen ohjataan monesta kohtaa. Avattaessa
käyttäjä valitsee toimialan, ja laskuri näyttää juuri sen alan vaihtoehdot.

**Toimialat (lukittu tällä hetkellä):**
1. Kukkakauppa
2. Kahvila
3. Ravintola
4. Tilauskakkujen valmistus (tilauskakut)
5. Kauneushoitola
6. Jooga-/pilateskurssi

> Kunkin laskurin sisältö on Sofian erikseen määrittelemä.
> Yleistys-/laajennusehdotukset: ks. `01-oma-sivu.md` → Avoimet päätökset.

### Asiakaspolku (yhteinen kaikille)
1. Asiakas täyttää lomakkeen → tekee **tarjouspyynnön**
2. Tarjouspyyntö hyväksytään
3. Asiakkaalle lähetetään **ideointikaavake** (interaktiivinen) →
   ks. `01-oma-sivu.md` → Ideointikaavake

## Käytettävissä olevat assetit

- **Logot** (`assets/logot/`): web-valmiit, rajatut versiot — `wordmark-vaaka.svg`,
  `wordmark-pino.svg`, `wordmark-kaari.svg`, `merkki.svg` (SB-leima). Käytetään
  maskattuna (väritetään CSS:llä brändiväreihin). Alkuperäiset täydet tiedostot
  ovat `assets/grafiikat/`-kansiossa.
- **Grafiikat** (`assets/grafiikat/`): nuolet, kukat, tähdet, kipinä sekä retro-
  kuvitukset (kahvi, kädet, henkilöt, kirjekuori ym.). Web-valmiit, rajatut nimet:
  `kukka.svg`, `tahti.svg`, `kipina.svg`, `nuoli-yloikea.svg`, `henkilo-laptop.svg` jne.
- **Kuvat** (`assets/kuvat/`): lämpimät filmikuvat (toimisto, kokkaus, workshops ym.)
  sekä portfolio-screenshotit `demo-1…7.jpg`.
