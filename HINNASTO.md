# Studio Blomma — Hinnasto (koottu)

> Kaikki hinnat ALV 0 %. Tämä on koostettu sivuston nykyisistä hinnoista.
> Lopussa on lista **ristiriidoista**, jotka kannattaa yhtenäistää.

---

## 1. Nettisivut — hintalaskuri (kertamaksu)

Lähde: `ominaisuudet.html` (laskuri), `laskuri.html`

| Ominaisuus | Hinta |
|---|---|
| Basic-sivu (etusivu, palvelut/tuotteet, meistä, yhteystiedot + lomake, galleria/referenssit, hinnasto) | **399 €** |
| Brändi-aloituspaketti (logo + väripaletti + fontit) | **120 €** |
| Lisäsivu | 50 € |
| Karttaintegraatio | 30 € |
| Ajanvarausjärjestelmä | 150 € |
| Pöytävarausjärjestelmä | 90 € |
| Kanta-asiakasjärjestelmä | 250 € |
| Verkkokauppa | 550 € |
| Hintalaskuri omalle sivulle | 290 € |
| Blogi / uutiset | 140 € |
| Rekry-lomakkeiden vastaanotto | 150 € |
| Some-syötteen upotus | 50 € |
| Monikielisyys (+1 kieli) | 80 € / kieli |
| Hakukoneoptimoinnin perusta (SEO) | 120 € |
| Uutiskirje-integraatio | 79 € |

### Jatkuvat lisäpalvelut

| Palvelu | Hinta |
|---|---|
| Verkkotunnus (domain) | 20 € / vuosi |
| Webhotelli & ylläpito | 10 € / kk |
| Päivityspalvelu | 40 € / kk |

---

## 2. Valmiit paketit

Lähde: `paketit.html`, `palvelut.html`

| Paketti | Näytetty hinta | Sisältö |
|---|---|---|
| Brändäys | 120 € | Logo, värit, fontit |
| Basic-sivu + brändäys (**Suosituin**) | 519 € | Basic-nettisivu + brändäys |
| Verkkokauppa + brändäys | 1069 € | Verkkokauppasivusto + brändäys |

---

## 3. Brändipalvelut

Lähde: `brandi-identiteetti.html`

| Palvelu | Hinta |
|---|---|
| Brändipaketti (**Suosituin**) — logo + värimaailma + fontit ja grafiikat | alk. 299 € |
| Logon suunnittelu | alk. 99 € |
| Värisuunnittelu | alk. 79 € |
| Graafien ja fonttien sommittelu | alk. 99 € |
| Kuvaus (räätälöity, ota yhteyttä) | alk. 99 € |

---

## 4. Some-palvelut

Lähde: `some.html`

| Palvelu | Hinta | Sisältö |
|---|---|---|
| Some freesaus | alk. 249 € | Instagramin asennus + 3 kk somesisältö + automatisoitu julkaiseminen |
| Some alku | alk. 399 € | Some freesaus + brändäys |
| Some kasvu | alk. 649 € | Instagramin asennus + 6 kk somesisältö + automatisoitu julkaiseminen |

---

## 5. Etusivun nostohinnat

Lähde: `index.html` (s403), `alkaen.svg`

| Nosto | Hinta |
|---|---|
| Nettisivut alkaen | 399 € |
| Verkkokauppa | alk. 949 € |
| Nettisivu | alk. 299 € |
| Kanta-asiakasjärjestelmä | alk. 250 € |

---

## 6. Ideointilomakkeen hinnat

Lähde: `ideointilomake.html`

| Kohde | Hinta |
|---|---|
| Lisäsivu | 49 € / kpl |
| Karttaintegraatio | 29 € |
| Some-syötteen upotus | 49 € |
| Hakukoneoptimoinnin perusta (SEO) | 120 € |
| Uutiskirje-integraatio | 79 € |
| Lisäkieli | 149 € |
| Ajanvaraus — perusupotus | 199 € |
| Ajanvaraus — räätälöity | 350 € |

**Kolmansien osapuolten kulut (asiakas maksaa suoraan palveluntarjoajalle, ei sisälly Blomman hintaan):**
- Timmaa-ajanvaraus: 15 €/kk/tekijä
- Paytrail (maksut): 14,90 €/kk + maksukohtainen kulu
- Stripe: ~1,5 % + 0,25 €/maksu
- ALV-velvollisuus alkaa, kun liikevaihto ylittää 20 000 €/vuosi (2025→)

---

## ⚠️ Ristiriidat, jotka pitää yhtenäistää

1. **Pakettien näyttöhinta vs. laskuriin lisättävä hinta** (`paketit.html`):
   - Brändäys: näytetään **120 €**, mutta `data-price="129"`
   - Basic-sivu + brändäys: näytetään **519 €**, mutta `data-price="499"`
   - Verkkokauppa + brändäys: näytetään **1069 €**, mutta `data-price="890"`

2. **Yksittäisten ominaisuuksien hinnat: laskuri vs. ideointilomake**
   - Lisäsivu: laskuri **50 €** / ideointilomake **49 €**
   - Karttaintegraatio: laskuri **30 €** / ideointilomake **29 €**
   - Some-syötteen upotus: laskuri **50 €** / ideointilomake **49 €**
   - Lisäkieli: laskuri **80 €** / ideointilomake **149 €**

3. **"Nettisivu alk. 299 €"** etusivulla (`index.html`), vaikka Basic-sivu on laskurissa **399 €**.

4. **Basic + brändäys** erikseen laskettuna: 399 € + 120 € = 519 € ✓ (paketin näyttöhinta täsmää, mutta `data-price` ei).
   **Verkkokauppa + brändäys** erikseen: 399 € + 550 € + 120 € = 1069 € ✓ (näyttöhinta täsmää).
