# assets/

Numeroitu mediakirjasto. Viittaan tiedostoihin **numerolla** (esim. "kuva 3"),
ja ohjelma hakee oikean tiedoston tästä kansiosta.

| Kansio | Tiedostot | Formaatti |
|--------|-----------|-----------|
| `logot/` | `logo-1.svg`, `logo-2.svg` … | `.svg` |
| `grafiikat/` | `grafiikka-1.svg`, `grafiikka-2.svg` … | `.svg` |
| `kuvat/` | `kuva-1.webp`, `kuva-2.webp` … | `.webp` (tai `.jpg`) |

## Nimeämissääntö

- **pienet kirjaimet + väliviiva + juokseva numero:** `kuva-1.webp`, `grafiikka-2.svg`, `logo-1.svg`
- **ei ääkkösiä, ei välilyöntejä** (toimii kaikilla palvelimilla)
- kuvat mieluiten `.webp` (kevyt), grafiikat ja logot `.svg`

## Käyttö

Viittaan tiedostoon numerolla: *"hero = kuva 1 + logo 1, 2xx-ikonit = grafiikka 2–4"*.
HTML:ssä polku on suhteellinen, esim. `assets/kuvat/kuva-1.webp`.

> Värit ja fontit: ks. **`tyyliopas.html`** (väri 1–9, fontti 1–4).
> `.gitkeep` pitää tyhjät kansiot mukana gitissä — voit jättää ne paikoilleen.
