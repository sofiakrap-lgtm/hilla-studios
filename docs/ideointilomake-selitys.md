# Studio Blomma — Hintalaskuri → Ideointilomake

**Tarkka selitys siitä, mitä lomake sisältää ja miten se toimii asiakkaan näkökulmasta.**
Päivitetty: 24.6.2026 · Koskee tiedostoja `laskuri.html`, toimiala-/kategorialaskureita,
`arviot.html`, `tarjouspyynto.html` ja `ideointilomake.html` sekä jaettua `script.js`-logiikkaa.

---

## 1. Kokonaiskuva: mihin ideointilomake sijoittuu

Studio Blomman asiakaspolku etenee viidessä vaiheessa (kuvattu sivulla
**Näin se toimii**):

1. **Hintalaskuri** — asiakas kokoaa itse haluamansa palvelut ja näkee hinnan reaaliajassa.
2. **Suunnittelu** — tarjouspyynnön jälkeen asiakas saa **ideointilomakkeen**, jossa hän
   kuvailee vapaasti toiveensa brändistä ja sivustosta.
3. **Nettisivun toteutus** — Blomma rakentaa sivun annettujen tietojen pohjalta.
4. **Arviot demosivusta** — asiakas tarkastelee demon ja antaa palautteen.
5. **Valmis nettisivu.**

Ideointilomake on siis **vaihe 2:n työkalu**: se on yksityiskohtainen "design brief",
joka kerää kaiken sen tiedon, jota pelkkä hintalaskuri ei kerää. Hintalaskuri kertoo
*mitä* asiakas haluaa ja *mitä se maksaa*; ideointilomake kertoo *miltä sen pitää näyttää
ja tuntua* ja *millä reunaehdoilla* projekti tehdään.

Tärkeä periaate: lomakkeen yläosa **tunnistaa hintalaskurissa tehdyt valinnat** ja näyttää
ne asiakkaalle, jottei mitään tarvitse syöttää kahteen kertaan.

---

## 2. Tekninen perusta lyhyesti

- Sivusto on **staattinen** (HTML + CSS + vanilla JS, ei palvelinta eikä tietokantaa).
- Hintalaskurin valinnat tallennetaan **selaimen localStorageen** avaimella
  `blomma.estimates`. Tämä on lista arvio-olioita, joista jokaisella on:
  `id`, `label` (esim. "Kahvila-ala" tai "Logon suunnittelu"), `once` (kertahinta),
  `items` (valitut ominaisuudet hintoineen) ja `recurring` (jatkuvat kulut).
- Koska tieto on localStoragessa, se **säilyy saman selaimen sisällä** sivulta toiselle
  siirryttäessä — myös laskurista ideointilomakkeeseen.
- **Lähetys tapahtuu sähköpostina (`mailto:`)**: lomake kokoaa vastaukset valmiiksi
  tekstiviestiksi ja avaa asiakkaan oman sähköpostiohjelman. Mitään ei lähetetä
  taustalla palvelimelle — tämä on tietoisesti **demototeutus**.

---

## 3. Polku hintalaskurista ideointilomakkeeseen (konkreettisesti)

### 3.1 Hintalaskurin valinta ja arvioiden tallennus

Hintalaskuri (`laskuri.html`) tarjoaa neljä kategoriaa:

- **Nettisivut** → toimialakohtainen laskuri (`.calc2`): pohjana **Basic-sivu 399 €**,
  jonka päälle rastitaan lisäominaisuuksia (esim. Ajanvarausjärjestelmä, Verkkokauppa,
  Monikielisyys, SEO…). Jokaisella on selkeä kertahinta, ALV 0 %.
- **Sosiaalinen media** → some-laskuri (`.calc3`).
- **Brändi-identiteetti** (`brandi-identiteetti.html`) → kortit, joista valitaan osia
  (Logon suunnittelu, Värisuunnittelu, Graafien ja fonttien sommittelu, Kuvaus) napilla
  "Lisää hintalaskuriin".
- **Paketit** → valmiit kokonaisuudet.

Kun asiakas painaa **"Laske hinta"** (tai "Lisää hintalaskuriin"), `script.js` kutsuu
funktiota `upsertEstimate()`, joka tallentaa valinnat `blomma.estimates`-listaan.
Saman kategorian uusi laskenta **päivittää** vanhan arvion samalla `id`:llä — ei luo
duplikaattia. Tämän jälkeen selain ohjautuu **`arviot.html`-sivulle**.

### 3.2 Arviot-sivu ("Lasketut hinta-arviosi")

`arviot.html` lukee `blomma.estimates`-listan ja näyttää sen korteittain:

- Jokainen arvio omana korttinaan: otsikko, valitut ominaisuudet hintoineen ja
  kertahinta (ALV 0 %).
- **Kaikki yhteensä** -loppusumma.
- Toiminnot: **"+ Lisää palvelu"** (takaisin laskuriin), **"Lähetä tarjouspyyntö"**
  (kokoaa arviot sähköpostiksi `mailto:`-linkillä) ja **"Tyhjennä"**.

Tässä vaiheessa asiakas on käytännössä tehnyt **tarjouspyynnön**: hän tietää, mitä on
valinnut ja paljonko se maksaa.

### 3.3 Siirtyminen ideointilomakkeeseen

Ideointilomakkeeseen pääsee napista **"Ideointilomakkeen demo"**, joka löytyy useilta
sivuilta (mm. Näin se toimii, Demot, Etusivu, Meistä, Nettisivut). Prosessin tarinassa
asiakas saa lomakkeen, kun hän on lähettänyt tarjouspyynnön — eli kun hintalaskuri on jo
tehty. Lomakkeen kolmas osa hyödyntää suoraan laskurissa tallennettuja valintoja.

---

## 4. Ideointilomakkeen sisältö — osa osalta

Lomake (`ideointilomake.html`) on jaettu **seitsemään osaan**. Mikään kenttä ei ole
pakollinen: asiakas voi täyttää vain ne, joihin hänellä on vastaus, ja hypätä loput yli.
Tämä on korostettu heti lomakkeen alussa.

### Osa 1 · Perustiedot
- Yrityksen / projektin nimi
- Toimiala (esim. kahvila, kynsistudio, rakennusliike)
- Yhteyshenkilö ja sähköposti (vierekkäin)
- Puhelin
- **Nykyinen sivusto tai some** — *toistettava kenttä*: "+ Lisää linkki tai some" lisää
  uuden rivin, joten asiakas voi listata vaikka Instagramin, Facebookin ja vanhan sivun.

**Tarkoitus:** kuka tilaa, miltä alalta ja mistä lähtötilanteesta lähdetään.

### Osa 2 · Yrityksesi & tavoitteet
- Kuvaile yritystäsi muutamalla lauseella (vapaa teksti)
- Kuka on ihanneasiakkaasi? (kohderyhmä)
- **Mitä haluat sivustolla saavuttaa?** (monivalinta): Lisää yhteydenottoja ·
  Myynti verkossa · Ajanvaraukset · Näkyvyys & brändi · Tiedon jakaminen ·
  Uskottavuus & luotettavuus
- Tärkein toiminto (CTA): mitä kävijän toivotaan tekevän (varaa aika, soita, osta…)

**Tarkoitus:** ymmärtää liiketoiminnan tavoite, jotta sivun rakenne ja toimintakehotteet
osuvat oikein.

### Osa 3 · Sivut, sisältö & toiminnot  *(tämä osa keskustelee hintalaskurin kanssa)*
- **Laskuri-huomautus (sininen/korostettu laatikko)**: kertoo, että lomake on jatkoa
  hintalaskurin tarjouspyynnölle ja että laskurissa valitut ominaisuudet ovat jo mukana.
  Lisäksi se ilmoittaa:
  - **"Olet valinnut Basic-paketin."** ja luettelee, mitä Basiciin **aina** kuuluu:
    Etusivu, Palvelut / Tuotteet, Tietoa meistä, Yhteystiedot + lomake,
    Galleria / Referenssit ja Hinnasto.
  - Jos laskurista löytyy valintoja, ne listataan: *"Lisäksi laskurissa: …"*.
- **"Haluatko lisätä sivuja tai toimintoja laskurissa valitsemiesi lisäksi?"**
  — yksi yhtenäinen monivalinta (sivut ja toiminnot on yhdistetty samaan listaan ja
  päällekkäisyydet poistettu): Blogi / ajankohtaista · Verkkokauppa & maksut · Ajanvaraus ·
  Usein kysyttyä · Uutiskirjeen tilaus · Some-syöte · Kartta & sijainti ·
  Kanta-asiakkuus / edut · Asiakasarvostelut · Chat / pikaviesti.
  - Pieni vihje muistuttaa, että Basiciin kuuluvia sivuja **ei tarvitse** valita tästä.
  - **Automaattinen merkintä:** jos asiakas on jo valinnut jonkin näistä hintalaskurissa
    (esim. Verkkokauppa), kohta **esivalitaan** ja sen viereen tulee oranssi
    **"jo laskurissa"** -merkki. Näin asiakas näkee heti, mikä on jo mukana.
- **"Puuttuuko listoilta jokin?"** — *toistettava vapaa lisäys* ("+ Lisää oma"):
  asiakas voi kirjoittaa omia sivuja tai toimintoja (esim. tapahtumakalenteri, jäsensivut).
- **"Onko sinulla jo valmista sisältöä?"** (monivalinta): Valmiit tekstit · Valokuvat ·
  Logo · Brändivärit · Tarvitsen apua sisällön kanssa.
- **Kielet** — *toistettava kenttä*: alustavasti sivusto tehdään yhdellä kielellä, mutta
  asiakas voi lisätä useampia.

**Tarkoitus:** täydentää hintalaskurin tekninen sisältö ilman päällekkäisyyttä — asiakas
näkee selvästi, mikä on jo valittu ja mitä hän voi vielä lisätä.

### Osa 4 · Visuaalinen ilme & brändi
- **Missä vaiheessa brändisi ilme on?** (yksi valinta): Valmis ilme · Osittain valmis ·
  Aloitetaan nollasta
- Väritoiveet (värit joista pidät / joita vältät)
- Fontti- / typografiatunnelma (klassinen, moderni, leikkisä…)
- Tyyli / tunnelma 3–5 sanalla (esim. lämmin, rohkea, lähestyttävä)
- Kuvamaailma (esim. filmikuva, luonnonvalo, oikeat ihmiset työn äärellä)

**Tarkoitus:** antaa suunnittelijalle suunta visuaaliseen ilmeeseen.

### Osa 5 · Inspiraatio
- **Sivustot, joista pidät** — *toistettava* + lyhyt perustelu miksi
- Linkki Pinterest-tauluun / moodboardiin
- **Kilpailijat** — *toistettava* (linkit tai nimet)
- **Mitä EI haluta** (tyylit, värit, elementit, joita asiakas karsastaa)

**Tarkoitus:** kalibroida maku nopeasti — esimerkit ja "ei-toiveet" säästävät kierroksia.

### Osa 6 · Aikataulu & käytäntö
- **Onko sinulla jo verkko-osoite (domain)?** Kyllä / Ei, tarvitsen apua
- Toivottu aikataulu tai deadline
- **Alustava budjetti** (valikko): alle 300 € · 300–600 € · 600–1000 € · yli 1000 € ·
  en osaa vielä sanoa
- **Kuka päivittää sivustoa jatkossa?** Itse / Toivon että te hoidatte / En osaa sanoa

**Tarkoitus:** projektin reunaehdot — aikataulu, budjetti, ylläpitomalli ja domain-tilanne.

### Osa 7 · Vapaa sana
- Yksi iso tekstikenttä: unelmat, huolet, ideat, ihan mikä vain.

---

## 5. Älykkäät toiminnot, jotka asiakas huomaa

1. **Toistettavat kentät** ("+ Lisää …"): useissa kohdissa asiakas voi lisätä rivejä
   (some-linkit, kielet, inspiraatiosivut, kilpailijat, omat lisäykset). Lisätyn rivin voi
   poistaa ×-napista.
2. **Hintalaskurin valintojen tunnistus**: osa 3 lukee `blomma.estimates`-listan ja
   näyttää tehdyt valinnat sekä Basic-paketin sisällön.
3. **Automaattinen esivalinta + "jo laskurissa" -merkki**: laskurissa valitut toiminnot
   näkyvät valmiiksi rastitettuina, jottei asiakas valitse samaa kahdesti.
4. **Ei pakollisia kenttiä**: asiakas etenee omaan tahtiin ja voi jättää kohtia tyhjäksi.

---

## 6. Lähetys — mitä tapahtuu, kun asiakas painaa "Lähetä"

Kun asiakas painaa **"Lähetä ideointilomake"**:

1. JavaScript käy läpi kaikki osat ja kentät ja kokoaa niistä **selkeän tekstiviestin**.
   Jokaisen osan otsikko tulee väliotsikoksi (esim. `=== 2 · Yrityksesi & tavoitteet ===`)
   ja jokainen vastattu kenttä omalle rivilleen muodossa `• Kysymys: vastaus`.
   Tyhjät kentät jätetään pois.
2. Selain avaa asiakkaan **oman sähköpostiohjelman** valmiilla viestillä:
   - Vastaanottaja: `info@studioblomma.com`
   - Aihe: `Ideointilomake – [yrityksen nimi]`
   - Viestin runko: koottu yhteenveto.
3. Asiakas voi vielä **tarkistaa ja muokata** viestiä ennen lähettämistä, ja painaa lopuksi
   sähköpostiohjelmastaan Lähetä.

Tämä on demototeutus: tietoja **ei tallenneta** Blomman järjestelmään automaattisesti, vaan
ne kulkevat sähköpostina. Sama mailto-periaate on käytössä myös arviot-sivun
"Lähetä tarjouspyyntö" -napissa.

---

## 7. Asiakkaan kokemus käytännössä — esimerkkikävely

1. **Maria** (kahvilayrittäjä) avaa hintalaskurin ja valitsee kategoriaksi *Nettisivut*.
2. Hän valitsee Basic-pohjan (399 €) päälle *Ajanvarausjärjestelmän* ja *Verkkokaupan*,
   ja näkee summan päivittyvän. Hän painaa **"Laske hinta"**.
3. Hänet ohjataan **Arviot-sivulle**, jossa näkyy hänen arvionsa ja loppusumma. Hän voi
   lähettää tarjouspyynnön suoraan tai jatkaa suunnitteluun.
4. Maria avaa **Ideointilomakkeen**. Heti osassa 3 hän näkee tekstin
   *"Olet valinnut Basic-paketin. Lisäksi laskurissa: Kahvila-ala, Verkkokauppa…"*,
   ja huomaa, että **Verkkokauppa on jo valmiiksi rastitettu** ja merkitty
   "jo laskurissa". Hänen ei tarvitse valita sitä uudelleen.
5. Hän täydentää tavoitteet, väritoiveet, tunnelman ("lämmin, kutsuva, paikallinen"),
   pari inspiraatiosivua ja toiveaikataulun. Loput hän jättää tyhjäksi.
6. Hän painaa **"Lähetä ideointilomake"**, tarkistaa avautuvan sähköpostin ja lähettää sen.
   Blomma saa yhdellä viestillä sekä hinta-arvion taustan että koko design briefin.

---

## 8. Reunaehdot ja hyvä tietää

- **Selainkohtaisuus:** hintalaskurin valinnat säilyvät vain samassa selaimessa ja
  laitteessa (localStorage). Jos asiakas vaihtaa laitetta, valinnat eivät seuraa mukana.
- **Tyhjentäminen:** arviot-sivun "Tyhjennä" poistaa tallennetut arviot, jolloin myös
  ideointilomakkeen osa 3 näyttää pelkän Basic-paketin ilman lisävalintoja.
- **Demoluonne:** lähetys perustuu sähköpostiin (`mailto:`), ei taustajärjestelmään.
- **Ei pakollisia kenttiä:** lomakkeen voi lähettää, vaikka vain osa olisi täytetty.
- **Yhtenäisyys Basicin kanssa:** Basiciin kuuluvia osia (etusivu, palvelut, meistä,
  yhteystiedot + lomake, galleria/referenssit, hinnasto) **ei tarjota** erikseen
  lisävalintoina laskurissa eikä lomakkeessa, jotta asiakas ei maksa samasta kahdesti.
