# assets/

Studio Blomman mediakirjasto. Pidä tiedostot oikeassa alikansiossa, niin
brändi pysyy järjestyksessä.

| Kansio | Sisältö | Formaatti |
|--------|---------|-----------|
| `logot/` | Logot ja wordmarkit | `.svg` |
| `grafiikat/` | Grafiikat, badget, nuolet, kukkamotiivit, raidat | `.svg` |
| `kuvat/` | Valokuvat (lämmin filmikuva, ihmiset työn äärellä) | `.jpg` |

## Nimeäminen

- **pienet kirjaimet, väliviivat** välilyöntien sijaan: `studio-blomma-logo.svg`
- kuvaava nimi: `nola-beauty-hero.jpg`, `kukkamotiivi-burnt-tangerine.svg`
- ei ääkkösiä eikä välilyöntejä tiedostonimissä (toimii kaikilla palvelimilla)

## Käyttö sivuilla

Viittaa tiedostoihin suhteellisella polulla, esim. `sivupohja.html`:

```html
<img src="assets/logot/studio-blomma-logo.svg" alt="Studio Blomma">
<img src="assets/kuvat/nola-beauty-hero.jpg" alt="Nola Beauty House">
```

> `.gitkeep`-tiedostot pitävät tyhjät kansiot mukana gitissä — voit jättää ne paikoilleen.
