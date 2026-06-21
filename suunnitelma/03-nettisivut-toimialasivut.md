# Toimialasivut (1.1.1–1.1.6) — yhteinen rakenne

> Kaikki kuusi nettisivu-toimialasivua jakavat **saman rakenteen**. Vain hero-osan
> nimi, alateksti ja demokuva vaihtuvat. Tausta = väri 1, teksti = väri 3.

## Sivut ja demokuvat (järjestyksessä)

| # | Sivu | Tiedosto | Web demo -kuva |
|---|------|----------|----------------|
| 1.1.1 | Kauneusala    | `kauneusala.html`  | `web-demo-1.jpg` |
| 1.1.2 | Rakennusala   | `rakennusala.html` | `web-demo-2.jpg` |
| 1.1.3 | Ravintola-ala | `ravintola.html`   | `web-demo-3.jpg` |
| 1.1.4 | Kahvila-ala   | `kahvila.html`     | `web-demo-4.jpg` |
| 1.1.5 | Hyvinvointi   | `hyvinvointi.html` | `web-demo-5.jpg` |
| 1.1.6 | Kukkakauppa   | `kukkakauppa.html` | `web-demo-6.jpg` |

> Demokuvat ovat **vain esimerkkiä varten** (web-demo-1…6.jpg, alkup. "web demo").
> web-demo-7.jpg on yli — vapaana esim. ominaisuudet-sivulle.

## (osa 1) 111 — Toimialahero
- tausta väri 1, teksti väri 3
- **otsikko = sivun nimi** (esim. "Kauneusala")
- alateksti: alalle olennainen sisältö (esim. ajanvaraus + kanta-asiakas, miten
  ne helpottavat arkea ja vahvistavat brändiä)
- nappi: **Katso demo →** (→ demot.html)
- kuva: web demo -kuvan **yläosa** (object-position: top), **ylänurkat pyöristetty**

## (osa 2) Konkreettinen hintalaskuri (.calc2)
Sama kaikilla toimialasivuilla.

- **Basic-sivu — 399 € — aina valittuna** (tausta väri 2, ruksi lukittu).
  Valmis nettisivupohja: etusivu yrityksen tiedoilla + perussivut. Kaikki rakentuu tämän päälle.
- Muut valinnat: tausta väri 1, ruksittavia.
- **Lisäominaisuudet (kertamaksu, ALV 0 %):**
  Lisäsivu 49 € · Yhteydenottolomake 39 € · Galleria 79 € · Karttaintegraatio 29 € ·
  Ajanvarausjärjestelmä 350 € · Kanta-asiakasjärjestelmä 250 € · Verkkokauppa 590 € ·
  Some-syötteen upotus 49 € · Blogi/uutiset 99 € · Monikielisyys 149 € · SEO-perusta 120 € ·
  Uutiskirje-integraatio 79 €
- **Jatkuvat kulut (valinnaiset):**
  Verkkotunnus 19 €/vuosi · Webhotelli & ylläpito 9 €/kk · Päivityspalvelu 39 €/kk
- **Laske hinta** -nappi → näyttää kertahinnan (ALV 0 %) + erittelyn jatkuvista kuluista.
- Tuloksen alla 2 nappia: **+ Lisää palveluita** ja **Lähetä tästä tarjouspyyntö** (→ tarjouspyynto.html)

> Hinnat ovat ehdotuksia — säädettävissä HTML:ssä (`data-price` / `data-recurring`).

## Lisäys sivulle 1.1 (nettisivut.html)
- Ennen alaosaa **kopio etusivun osasta 221 — Näin se hoituu (5 vaihetta)**.
