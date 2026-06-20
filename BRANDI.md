# Brändi — värit & fontit (täytetty)

Tämä on rakennekirjaston (muokkausdokumentti) **kohtien 1 ja 2 täytetty versio**:
sisältö ja tyyli, jotka kirjasto jätti tarkoituksella pois. Värit ja fontit on
poimittu nykyisestä toteutuksesta (`style.css`).

> **Periaate:** osiokoodi = rakenne. Väri, fontti, kuva, grafiikka ja logo = sisältö/tyyli.
> Viittaa aina **numeroon** (esim. ”väri 5”, ”fontti 1”) — ei hexiin tai nimeen.

Visuaalinen kartta selaimessa: **[paletti.html](paletti.html)**
CSS-muuttujat: `style.css` → `:root` (`--vari-1 … --vari-11`, `--fontti-1 … --fontti-4`).

---

## 1. Värit

### Peruspaletti (väri 1–6) — rakenneroolit

| Nro | Rooli | Hex | CSS-muuttuja |
|-----|-------|-----|--------------|
| väri 1 | päätausta | `#FFF6EC` | `var(--vari-1)` |
| väri 2 | toissijainen tausta / osiot | `#FFEFE0` | `var(--vari-2)` |
| väri 3 | otsikkoteksti | `#1E1726` | `var(--vari-3)` |
| väri 4 | leipäteksti | `#4A4253` | `var(--vari-4)` |
| väri 5 | CTA / korostus | `#FF5C7A` | `var(--vari-5)` |
| väri 6 | ääriviivat / jakoviivat | `#1E1726` @ 10 % | `var(--vari-6)` |

### Korostusvärit (väri 7–11)

| Nro | Rooli | Hex | CSS-muuttuja |
|-----|-------|-----|--------------|
| väri 7 | korttipinta / valkoinen | `#FFFFFF` | `var(--vari-7)` |
| väri 8 | brändikorostus (violetti) | `#7B4DFF` | `var(--vari-8)` |
| väri 9 | korostus (lime) | `#C8F169` | `var(--vari-9)` |
| väri 10 | korostus (keltainen) | `#FFD23F` | `var(--vari-10)` |
| väri 11 | korostus (turkoosi) | `#2ED3C6` | `var(--vari-11)` |

### Tummennukset (hover-tilat)

| Pari | Hex | CSS-muuttuja |
|------|-----|--------------|
| väri 5 tummennus | `#F23E63` | `var(--vari-5-dark)` |
| väri 8 tummennus | `#5B2EE0` | `var(--vari-8-dark)` |

---

## 2. Fontit

| Nro | Fontti | Rooli | Paino / tyyli | CSS-muuttuja |
|-----|--------|-------|---------------|--------------|
| fontti 1 | Bricolage Grotesque | otsikot (display) | 800, lihava | `var(--fontti-1)` |
| fontti 2 | Bricolage Grotesque | väliotsikot (display) | 600, medium | `var(--fontti-2)` |
| fontti 3 | Plus Jakarta Sans | leipäteksti (sans) | 400, regular | `var(--fontti-3)` |
| fontti 4 | Plus Jakarta Sans | eyebrow / caps-pikkutekstit | 700, ISOT, harvennettu (0.14em) | `var(--fontti-4)` |

Fontit ladataan Google Fontsista (ks. `<head>` jokaisessa HTML-tiedostossa).

---

## 3. Assets (numeroidut tiedostot)

```
/assets
  /kuvat       → kuva-1.webp, kuva-2.webp …      (viittaus: kuva 1)
  /grafiikat   → grafiikka-1.svg, grafiikka-2.svg … (viittaus: grafiikka 1)
  /logot       → logo-1.svg, logo-2.svg …        (viittaus: logo 1)
```

Tarkemmat ohjeet: [`assets/README.md`](assets/README.md).

---

## 4. Esimerkkikäsky (rakenne + tyyli + sisältö)

> ”Rakenna sivu: 1xx + 2xx + 7xx + 3xx. Värit: tausta **väri 1**, otsikot **väri 3**,
> CTA **väri 5**. Fontit: otsikot **fontti 1**, leipä **fontti 3**. Assetit:
> hero = **kuva 1** + **logo 1**, 2xx-ikonit = **grafiikka 2–4**.”

Sivukartta (tuleva, rakennetaan sivu pala kerrallaan):
**Pääsivu** · Palvelut · Meistä · Demot · Ota yhteyttä — ja oikealla aina iso
nappi **Hintalaskuriin**.
