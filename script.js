/* =========================================================
   Studio Blomma – jaettu logiikka (vanilla JS)
   Sisältää: navigaatio, scroll-animaatiot, hintalaskuri,
   tarjouspyyntölomakkeen esitäyttö + mailto-koonti.
   ========================================================= */

/* ---------------------------------------------------------
   1. Yhteinen datamalli: moduulit ja hinnat
   --------------------------------------------------------- */
const STORAGE_KEY = "blomma.offer";
const CONTACT_EMAIL = "info@studioblomma.com";

/* Toimialat */
const INDUSTRIES = {
  leipomo:  { label: "Leipomo" },
  kahvila:  { label: "Kahvila" },
  ravintola:{ label: "Ravintola" },
  kampaamo: { label: "Kampaamo" },
  muu:      { label: "Muu ala" },
};

/* Sivuston laajuus (radio – valitaan tasan yksi) */
const SCOPE_OPTIONS = [
  { id: "scope-one",   name: "Yksisivuinen",        desc: "Tiivis yhden sivun esittely – kaikki olennainen yhdellä vierityksellä.", price: 390 },
  { id: "scope-small", name: "Pieni sivusto",        desc: "3–5 sivua: etusivu, palvelut, tietoa, yhteystiedot.",                  price: 690 },
  { id: "scope-large", name: "Laaja sivusto",        desc: "6+ sivua, oma rakenne ja laajemmat sisällöt.",                          price: 1190 },
];

/* Lisämoduulit (checkbox) */
const MODULES = [
  { id: "shop",      name: "Verkkokauppa / tilaukset", desc: "Tuotteet, ostoskori ja maksut tai ennakkotilauslomake.", price: 590 },
  { id: "booking",   name: "Ajanvaraus / pöytävaraus", desc: "Asiakkaat varaavat ajan tai pöydän suoraan sivustolta.",  price: 350 },
  { id: "menu",      name: "Online-ruokalista", desc: "Selkeä, helposti päivitettävä lista tuotteista tai annoksista.", price: 220 },
  { id: "gallery",   name: "Kuvagalleria", desc: "Houkutteleva galleria töistäsi ja tuotteistasi.",          price: 150 },
  { id: "logo",      name: "Logosuunnittelu", desc: "Uniikki logo, joka kiteyttää yrityksesi luonteen.",        price: 350 },
  { id: "brand",     name: "Visuaalinen brändipäivitys", desc: "Värit, fontit ja graafinen ilme yhtenäiseksi paketiksi.", price: 590 },
  { id: "multilang", name: "Monikielisyys", desc: "Sivusto kahdella tai useammalla kielellä.",                price: 290 },
  { id: "content",   name: "Sisällöntuotanto", desc: "Tekstit ja kuvaukset kirjoitettuna puolestasi.",           price: 320 },
  { id: "seo",       name: "Hakukoneoptimointi (SEO)", desc: "Näy Googlessa – tekninen ja sisällöllinen perusoptimointi.", price: 280 },
  { id: "upkeep",    name: "Ylläpito (kk-maksu)", desc: "Päivitykset, varmuuskopiot ja pieni tuki joka kuukausi.",  price: 39, recurring: true },
];

/* Suositukset toimialoittain (id-listat) */
const RECOMMENDED = {
  leipomo:  ["shop", "gallery", "content", "seo"],
  kahvila:  ["menu", "gallery", "booking", "seo"],
  ravintola:["menu", "booking", "gallery", "multilang"],
  kampaamo: ["booking", "gallery", "logo", "seo"],
  muu:      ["logo", "seo", "content"],
};

/* Apuri hinnan muotoiluun */
const euro = (n) => new Intl.NumberFormat("fi-FI", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);

/* ---------------------------------------------------------
   2. Navigaatio (mobiilivalikko) + scroll-animaatiot
   --------------------------------------------------------- */
function initNav() {
  const toggle = document.querySelector(".nav__toggle");
  const links = document.querySelector(".nav__links");
  if (toggle && links) {
    toggle.addEventListener("click", () => {
      const open = links.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
      toggle.textContent = open ? "✕" : "☰";
    });
    links.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => {
        links.classList.remove("is-open");
        toggle.textContent = "☰";
      })
    );
  }
}

function initReveal() {
  const items = document.querySelectorAll(".reveal");
  if (!items.length || !("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("is-in"));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("is-in");
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  items.forEach((el) => io.observe(el));
}

/* Aseta vuosiluku footeriin */
function initYear() {
  document.querySelectorAll("[data-year]").forEach((el) => {
    el.textContent = new Date().getFullYear();
  });
}

/* ---------------------------------------------------------
   3. HINTALASKURI (laskuri.html)
   --------------------------------------------------------- */
function initCalculator() {
  const root = document.querySelector("[data-calc]");
  if (!root) return;

  const chipsWrap = root.querySelector("[data-industry-chips]");
  const lockedView = root.querySelector("[data-calc-locked]");
  const modulesView = root.querySelector("[data-calc-modules]");
  const industryLabel = root.querySelector("[data-summary-industry]");

  let industry = null;

  /* --- Rakenna toimialavalitsimet --- */
  Object.entries(INDUSTRIES).forEach(([key, info]) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "chip";
    btn.dataset.industry = key;
    btn.textContent = info.label;
    btn.addEventListener("click", () => selectIndustry(key));
    chipsWrap.appendChild(btn);
  });

  /* --- Rakenna moduuliryhmät --- */
  buildScopeGroup(modulesView);
  buildModulesGroup(modulesView);

  const form = modulesView.querySelector("form");

  function selectIndustry(key, scroll = true) {
    industry = key;
    chipsWrap.querySelectorAll(".chip").forEach((c) =>
      c.classList.toggle("is-active", c.dataset.industry === key)
    );
    lockedView.style.display = "none";
    modulesView.style.display = "grid";
    industryLabel.textContent = `Toimiala: ${INDUSTRIES[key].label}`;
    highlightRecommended(key);
    recalc();
    if (scroll) modulesView.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function highlightRecommended(key) {
    const recs = RECOMMENDED[key] || [];
    form.querySelectorAll("[data-option]").forEach((opt) => {
      const id = opt.dataset.option;
      const isRec = recs.includes(id);
      opt.classList.toggle("is-recommended", isRec);
      const badge = opt.querySelector(".rec-badge");
      if (badge) badge.style.display = isRec ? "" : "none";
    });
  }

  form.addEventListener("change", recalc);

  /* --- Laske summa ja päivitä sivupalkki --- */
  function recalc() {
    const selection = readSelection(form);
    renderSummary(root, selection, industry);
  }

  /* --- Tee tarjouspyyntö: tallenna valinnat ja siirry lomakkeelle --- */
  // Esivalinta URL-parametrista (esim. laskuri.html?ala=ravintola)
  const preset = new URLSearchParams(window.location.search).get("ala");
  if (preset && INDUSTRIES[preset]) {
    selectIndustry(preset, false);
  }

  const goBtn = root.querySelector("[data-calc-submit]");
  goBtn.addEventListener("click", () => {
    const selection = readSelection(form);
    if (!selection.items.length) {
      goBtn.classList.add("shake");
      setTimeout(() => goBtn.classList.remove("shake"), 500);
      return;
    }
    const payload = {
      industry,
      industryLabel: industry ? INDUSTRIES[industry].label : "",
      items: selection.items,
      oneTime: selection.oneTime,
      monthly: selection.monthly,
      savedAt: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    window.location.href = "tarjouspyynto.html";
  });
}

/* Rakenna laajuus-ryhmä (radio) */
function buildScopeGroup(container) {
  const group = document.createElement("section");
  group.className = "module-group reveal";
  group.innerHTML = `
    <h3>Sivuston laajuus</h3>
    <p>Valitse lähtökohta – tätä voidaan tarkentaa yhdessä.</p>
    <div class="option-grid option-grid--3" data-scope-grid></div>`;
  const grid = group.querySelector("[data-scope-grid]");
  SCOPE_OPTIONS.forEach((opt, i) => {
    const label = document.createElement("label");
    label.className = "option";
    label.dataset.option = opt.id;
    label.innerHTML = `
      <input type="radio" name="scope" value="${opt.id}" ${i === 1 ? "checked" : ""}
             data-name="${opt.name}" data-price="${opt.price}">
      <span class="option__box"></span>
      <span class="option__text">
        <span class="option__name">${opt.name}</span>
        <span class="option__desc">${opt.desc}</span>
      </span>
      <span class="option__price">${euro(opt.price)}</span>`;
    grid.appendChild(label);
  });
  // Lomake käärii ryhmät
  let form = container.querySelector("form");
  if (!form) {
    form = document.createElement("form");
    form.addEventListener("submit", (e) => e.preventDefault());
    container.appendChild(form);
  }
  form.appendChild(group);
}

/* Rakenna lisämoduulit (checkbox) */
function buildModulesGroup(container) {
  const form = container.querySelector("form");
  const group = document.createElement("section");
  group.className = "module-group reveal";
  group.innerHTML = `
    <h3>Lisätoiminnot</h3>
    <p>Valitse mitä tarvitset. <strong>Keltaisella merkityt</strong> ovat alallesi suositeltuja.</p>
    <div class="option-grid option-grid--2" data-modules-grid></div>`;
  const grid = group.querySelector("[data-modules-grid]");
  MODULES.forEach((mod) => {
    const label = document.createElement("label");
    label.className = "option";
    label.dataset.option = mod.id;
    const priceText = mod.recurring ? `${euro(mod.price)}/kk` : euro(mod.price);
    label.innerHTML = `
      <input type="checkbox" name="${mod.id}"
             data-name="${mod.name}" data-price="${mod.price}"
             data-recurring="${mod.recurring ? "1" : "0"}">
      <span class="option__box"></span>
      <span class="option__text">
        <span class="option__name">${mod.name}
          <span class="rec-badge" style="display:none">Suositus</span>
        </span>
        <span class="option__desc">${mod.desc}</span>
      </span>
      <span class="option__price">${priceText}</span>`;
    grid.appendChild(label);
  });
  form.appendChild(group);
}

/* Lue valinnat lomakkeesta -> { items[], oneTime, monthly } */
function readSelection(form) {
  const items = [];
  let oneTime = 0;
  let monthly = 0;

  // Laajuus (radio)
  const scope = form.querySelector('input[name="scope"]:checked');
  if (scope) {
    const price = Number(scope.dataset.price);
    oneTime += price;
    items.push({ id: scope.value, name: scope.dataset.name, price, recurring: false });
  }

  // Moduulit (checkbox)
  form.querySelectorAll('input[type="checkbox"]:checked').forEach((cb) => {
    const price = Number(cb.dataset.price);
    const recurring = cb.dataset.recurring === "1";
    if (recurring) monthly += price;
    else oneTime += price;
    items.push({ id: cb.name, name: cb.dataset.name, price, recurring });
  });

  return { items, oneTime, monthly };
}

/* Renderöi sivupalkin yhteenveto */
function renderSummary(root, selection, industry) {
  const list = root.querySelector("[data-summary-list]");
  const oneTimeEl = root.querySelector("[data-summary-onetime]");
  const monthlyRow = root.querySelector("[data-summary-monthly-row]");
  const monthlyEl = root.querySelector("[data-summary-monthly]");
  const grandEl = root.querySelector("[data-summary-grand]");

  list.innerHTML = "";
  if (!selection.items.length) {
    list.innerHTML = `<li class="summary__empty">Ei vielä valintoja – valitse moduulit vasemmalta.</li>`;
  } else {
    selection.items.forEach((it) => {
      const li = document.createElement("li");
      const priceText = it.recurring ? `${euro(it.price)}/kk` : euro(it.price);
      li.innerHTML = `<span class="label">${it.name}</span><span class="price">${priceText}</span>`;
      list.appendChild(li);
    });
  }

  oneTimeEl.textContent = euro(selection.oneTime);
  grandEl.textContent = euro(selection.oneTime);
  if (selection.monthly > 0) {
    monthlyRow.style.display = "";
    monthlyEl.textContent = `${euro(selection.monthly)}/kk`;
  } else {
    monthlyRow.style.display = "none";
  }
}

/* ---------------------------------------------------------
   4. TARJOUSPYYNTÖ (tarjouspyynto.html)
   --------------------------------------------------------- */
function initOfferForm() {
  const form = document.querySelector("[data-offer-form]");
  if (!form) return;

  const stored = loadStoredOffer();

  /* --- Rakenna esikuva-URL-rivit dynaamisesti --- */
  const urlWrap = form.querySelector("[data-url-rows]");
  const addUrlBtn = form.querySelector("[data-add-url]");
  function addUrlRow() {
    const row = document.createElement("div");
    row.className = "url-row";
    row.innerHTML = `
      <input type="url" class="input" name="reference" placeholder="https://esimerkki.fi">
      <button type="button" class="btn-mini" data-remove-url aria-label="Poista rivi">−</button>`;
    row.querySelector("[data-remove-url]").addEventListener("click", () => row.remove());
    urlWrap.appendChild(row);
  }
  if (addUrlBtn) addUrlBtn.addEventListener("click", addUrlRow);
  addUrlRow();

  /* --- Esitäyttö laskurin valinnoista --- */
  if (stored) {
    renderPrefill(form, stored);
  } else {
    const banner = document.querySelector("[data-prefill-banner]");
    if (banner) banner.style.display = "none";
    const aside = document.querySelector("[data-offer-summary]");
    if (aside) {
      aside.querySelector("[data-offer-list]").innerHTML =
        `<li class="offer-empty">Et tullut laskurin kautta. Voit <a href="laskuri.html" style="color:var(--sun)">laskea hinnan ensin</a> tai täyttää lomakkeen suoraan.</li>`;
      const total = aside.querySelector("[data-offer-total]");
      if (total) total.style.display = "none";
    }
  }

  /* --- Lähetys: koosta yhteenveto + avaa mailto --- */
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    handleOfferSubmit(form, stored);
  });
}

function loadStoredOffer() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (err) {
    return null;
  }
}

function renderPrefill(form, stored) {
  // Banneri näkyviin
  const banner = document.querySelector("[data-prefill-banner]");
  if (banner) banner.style.display = "flex";

  // Esitäytä toimiala
  if (stored.industry) {
    const sel = form.querySelector('select[name="industry"]');
    if (sel) sel.value = stored.industry;
  }

  // Esitäytä budjetti laskurin summasta
  const budget = form.querySelector('[name="budget"]');
  if (budget && stored.oneTime) {
    const monthlyText = stored.monthly ? ` + ${euro(stored.monthly)}/kk ylläpito` : "";
    budget.value = `n. ${euro(stored.oneTime)}${monthlyText} (laskurin arvio)`;
  }

  // Sivupalkin tarjousyhteenveto
  const aside = document.querySelector("[data-offer-summary]");
  if (!aside) return;
  const list = aside.querySelector("[data-offer-list]");
  list.innerHTML = "";
  stored.items.forEach((it) => {
    const li = document.createElement("li");
    const priceText = it.recurring ? `${euro(it.price)}/kk` : euro(it.price);
    li.innerHTML = `<span>${it.name}</span><span class="price">${priceText}</span>`;
    list.appendChild(li);
  });
  const totalEl = aside.querySelector("[data-offer-total-amount]");
  if (totalEl) {
    const monthlyText = stored.monthly ? ` + ${euro(stored.monthly)}/kk` : "";
    totalEl.textContent = `${euro(stored.oneTime)}${monthlyText}`;
  }
}

/* Koosta valinnoista siisti yhteenveto */
function buildOfferSummary(form, stored) {
  const get = (name) => (form.querySelector(`[name="${name}"]`)?.value || "").trim();
  const getAll = (name) =>
    Array.from(form.querySelectorAll(`[name="${name}"]:checked`)).map((el) => el.value);
  const getUrls = () =>
    Array.from(form.querySelectorAll('[name="reference"]'))
      .map((el) => el.value.trim())
      .filter(Boolean);

  const lines = [];
  lines.push("TARJOUSPYYNTÖ – Studio Blomma");
  lines.push("================================");
  lines.push("");
  lines.push("YHTEYSTIEDOT");
  lines.push(`Nimi: ${get("name") || "-"}`);
  lines.push(`Yritys: ${get("company") || "-"}`);
  lines.push(`Sähköposti: ${get("email") || "-"}`);
  lines.push(`Puhelin: ${get("phone") || "-"}`);
  lines.push(`Toimiala: ${get("industry") ? (INDUSTRIES[get("industry")]?.label || get("industry")) : "-"}`);
  lines.push("");

  if (stored && stored.items?.length) {
    lines.push("LASKURIN VALINNAT");
    stored.items.forEach((it) => {
      const priceText = it.recurring ? `${euro(it.price)}/kk` : euro(it.price);
      lines.push(`- ${it.name}: ${priceText}`);
    });
    const monthlyText = stored.monthly ? ` + ${euro(stored.monthly)}/kk ylläpito` : "";
    lines.push(`Arvio yhteensä: ${euro(stored.oneTime)}${monthlyText}`);
    lines.push("");
  }

  lines.push("SUUNNITTELUTOIVEET");
  lines.push(`Värimaailma: ${getAll("palette").join(", ") || "-"}`);
  lines.push(`Tyyli: ${getAll("style").join(", ") || "-"}`);
  lines.push(`Interaktiiviset elementit: ${getAll("interactive").join(", ") || "-"}`);
  const urls = getUrls();
  lines.push(`Esikuva-sivustot: ${urls.length ? urls.join(", ") : "-"}`);
  lines.push("");
  lines.push("PROJEKTI");
  lines.push(`Aikataulu: ${get("timeline") || "-"}`);
  lines.push(`Budjetti: ${get("budget") || "-"}`);
  lines.push("");
  lines.push("LISÄTIEDOT");
  lines.push(get("notes") || "-");

  return lines.join("\n");
}

function handleOfferSubmit(form, stored) {
  const summary = buildOfferSummary(form, stored);
  const name = (form.querySelector('[name="name"]')?.value || "").trim();
  const subject = `Tarjouspyyntö${name ? " – " + name : ""} | Studio Blomma`;

  // Näytä yhteenveto sivulla
  const result = document.querySelector("[data-offer-result]");
  if (result) {
    result.querySelector("[data-result-text]").textContent = summary;
    result.classList.add("is-visible");
    result.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  /*
   * LÄHETYS:
   * Tällä hetkellä lomake avaa käyttäjän sähköpostiohjelman valmiiksi
   * täytetyllä viestillä (mailto). Backendia ei ole.
   *
   * Kun haluat oikean automaattisen lähetyksen, korvaa alla oleva
   * mailto-osuus esim. Formspreellä:
   *
   *   1. Luo lomake osoitteessa https://formspree.io ja ota talteen
   *      endpoint-osoite, esim. https://formspree.io/f/xxxxxxx
   *   2. Lähetä data fetchillä:
   *
   *      fetch("https://formspree.io/f/xxxxxxx", {
   *        method: "POST",
   *        headers: { "Accept": "application/json", "Content-Type": "application/json" },
   *        body: JSON.stringify({ subject, summary })
   *      }).then(() => { /* näytä kiitosviesti *\/ });
   *
   *   Vaihtoehtoja: Formspree, Web3Forms, Getform, Netlify Forms,
   *   EmailJS tai oma backend-endpoint.
   */
  const mailto = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(summary)}`;
  window.location.href = mailto;
}

/* ---------------------------------------------------------
   4b. Hinta-arviot (kori) — jaettu localStorage-tila
   --------------------------------------------------------- */
const ESTIMATES_KEY = "blomma.estimates";
function loadEstimates() { try { return JSON.parse(localStorage.getItem(ESTIMATES_KEY)) || []; } catch (e) { return []; } }
function saveEstimates(a) { try { localStorage.setItem(ESTIMATES_KEY, JSON.stringify(a)); } catch (e) {} }
function upsertEstimate(est) {
  const a = loadEstimates();
  const i = a.findIndex((e) => e.id === est.id);
  if (i >= 0) a[i] = est; else a.push(est);
  saveEstimates(a);
}
function removeEstimate(id) { saveEstimates(loadEstimates().filter((e) => e.id !== id)); }
function buildCalcEstimate(root, id, label, once, recurring) {
  const items = [];
  root.querySelectorAll("input[data-price]").forEach((i) => {
    if (i.checked) items.push({ name: i.closest(".calc2__item").querySelector("strong").textContent.trim(), price: Number(i.dataset.price) });
  });
  return { id, label: label || "Hinta-arvio", once, items, recurring: recurring || [] };
}

function initArviot() {
  const wrap = document.querySelector("[data-arviot]");
  if (!wrap) return;
  const fmt = (n) => n.toLocaleString("fi-FI") + " €";
  const listEl = wrap.querySelector("[data-arviot-list]");
  const totalEl = wrap.querySelector("[data-arviot-total]");
  const emptyEl = wrap.querySelector("[data-arviot-empty]");
  const actionsEl = wrap.querySelector("[data-arviot-actions]");

  function render() {
    const ests = loadEstimates();
    if (!ests.length) {
      listEl.innerHTML = "";
      if (emptyEl) emptyEl.hidden = false;
      if (actionsEl) actionsEl.hidden = true;
      if (totalEl) totalEl.textContent = "0 €";
      return;
    }
    if (emptyEl) emptyEl.hidden = true;
    if (actionsEl) actionsEl.hidden = false;
    let grand = 0;
    listEl.innerHTML = ests.map((e) => {
      grand += e.once || 0;
      const items = (e.items || []).map((it) => `<li><span>${it.name}</span><span>${it.price != null ? fmt(it.price) : "sis."}</span></li>`).join("");
      const recs = (e.recurring || []).map((r) => `<li class="rec"><span>${r.name}</span><span>${fmt(r.price)}/${r.unit}</span></li>`).join("");
      return `<article class="arviot__card"><header><h3>${e.label}</h3><button type="button" class="arviot__remove" data-remove="${e.id}" aria-label="Poista">&times;</button></header><ul class="arviot__items">${items}${recs}</ul><p class="arviot__sub">Kertahinta (ALV 0 %): <strong>${fmt(e.once || 0)}</strong></p></article>`;
    }).join("");
    if (totalEl) totalEl.textContent = fmt(grand);
    listEl.querySelectorAll("[data-remove]").forEach((b) => b.addEventListener("click", () => { removeEstimate(b.dataset.remove); render(); }));
  }
  render();

  const sendBtn = wrap.querySelector("[data-arviot-send]");
  if (sendBtn) sendBtn.addEventListener("click", () => {
    const ests = loadEstimates();
    if (!ests.length) return;
    const lines = ["TARJOUSPYYNTÖ – Studio Blomma", "(hintalaskurin arviot)", "================================", ""];
    let grand = 0;
    ests.forEach((e) => {
      lines.push(e.label);
      (e.items || []).forEach((it) => lines.push(`  - ${it.name}: ${it.price != null ? fmt(it.price) : "sis."}`));
      (e.recurring || []).forEach((r) => lines.push(`  - ${r.name}: ${fmt(r.price)}/${r.unit}`));
      lines.push(`  Yhteensä: ${fmt(e.once || 0)} (ALV 0 %)`);
      lines.push("");
      grand += e.once || 0;
    });
    lines.push(`KAIKKI YHTEENSÄ: ${fmt(grand)} (ALV 0 %)`);
    const mailto = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("Tarjouspyyntö (hintalaskuri) | Studio Blomma")}&body=${encodeURIComponent(lines.join("\n"))}`;
    window.location.href = mailto;
  });

  const clearBtn = wrap.querySelector("[data-arviot-clear]");
  if (clearBtn) clearBtn.addEventListener("click", () => { saveEstimates([]); render(); });
}

/* ---------------------------------------------------------
   5. Käynnistys
   --------------------------------------------------------- */
/* ---------------------------------------------------------
   6. Konkreettinen hintalaskuri (toimialasivut, .calc2)
   --------------------------------------------------------- */
function initCalc2() {
  const fmt = (n) => n.toLocaleString("fi-FI") + " €";
  document.querySelectorAll(".calc2").forEach((root) => {
    const btn = root.querySelector(".calc2__calc");
    const result = root.querySelector(".calc2__result");
    const totalEl = root.querySelector("[data-total]");
    const recBox = root.querySelector("[data-recurring-list]");
    if (!btn) return;

    btn.addEventListener("click", () => {
      let once = 0;
      root.querySelectorAll("input[data-price]").forEach((i) => {
        if (i.checked) once += Number(i.dataset.price);
      });
      const recs = [];
      root.querySelectorAll("input[data-recurring]").forEach((i) => {
        if (i.checked) {
          const name = i.closest(".calc2__item").querySelector("strong").textContent;
          recs.push({ name, price: Number(i.dataset.recurring), unit: i.dataset.unit });
        }
      });
      totalEl.textContent = fmt(once);
      recBox.innerHTML = recs.length
        ? "<h4>Mahdolliset jatkuvat kulut</h4>" +
          recs.map((r) => `<div><span>${r.name}</span><span>${fmt(r.price)}/${r.unit}</span></div>`).join("")
        : "";
      upsertEstimate(buildCalcEstimate(root, location.pathname, (document.querySelector(".n111__title")?.textContent.trim() || (document.title.split("–")[0] || "").trim()), once, recs));
      result.hidden = false;
      result.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });

    const more = root.querySelector(".calc2__more");
    if (more) {
      more.addEventListener("click", () => {
        root.querySelector(".calc2__list").scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  });
}

/* ---------------------------------------------------------
   7. Ominaisuuslaskuri (1.1.7) — kaksivaiheinen (.calc3)
      ominaisuudet -> Laske hinta -> lisäpalvelut-ikkuna -> hinta
   --------------------------------------------------------- */
function initCalc3() {
  const fmt = (n) => n.toLocaleString("fi-FI") + " €";
  document.querySelectorAll(".calc3").forEach((root) => {
    const next = root.querySelector(".calc3__next");
    const extra = root.querySelector(".calc3__extra");
    const result = root.querySelector(".calc2__result");
    const totalEl = root.querySelector("[data-total]");
    const recBox = root.querySelector("[data-recurring-list]");
    if (!next || !extra || !result) return;

    /* Talletetaan otsikko jo nyt (ennen kuin laskuri siirretään ikkunaan) */
    const estLabel = (root.closest(".omin__row")?.querySelector(".omin__q")?.textContent || "Ominaisuus").trim();

    function showResult(includeExtra) {
      let once = 0;
      root.querySelectorAll("input[data-price]").forEach((i) => {
        if (i.checked) once += Number(i.dataset.price);
      });
      const recs = [];
      if (includeExtra) {
        extra.querySelectorAll("input[data-recurring]").forEach((i) => {
          if (i.checked) {
            const name = i.closest(".calc2__item").querySelector("strong").textContent;
            recs.push({ name, price: Number(i.dataset.recurring), unit: i.dataset.unit });
          }
        });
      }
      totalEl.textContent = fmt(once);
      recBox.innerHTML = recs.length
        ? "<h4>Mahdolliset jatkuvat kulut</h4>" +
          recs.map((r) => `<div><span>${r.name}</span><span>${fmt(r.price)}/${r.unit}</span></div>`).join("")
        : "";
      upsertEstimate(buildCalcEstimate(root, location.pathname + "::" + estLabel, estLabel, once, recs));
      extra.hidden = true;
      result.hidden = false;
      result.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }

    next.addEventListener("click", () => {
      result.hidden = true;
      extra.hidden = false;
      extra.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
    const skip = root.querySelector(".calc3__skip");
    if (skip) skip.addEventListener("click", () => showResult(false));
    const show = root.querySelector(".calc3__show");
    if (show) show.addEventListener("click", () => showResult(true));
    const more = root.querySelector(".calc3__more");
    if (more) more.addEventListener("click", () => {
      result.hidden = true;
      extra.hidden = true;
      root.querySelector(".calc2__list").scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
}

/* ---------------------------------------------------------
   7a. Hintalaskuri-ikkuna (täysruutu) + askelmittari
       Siirtää calc2/calc3-laskurin täysruutu-ikkunaan ja
       lisää askelmittarin, joka täyttyy etenemisen mukaan.
   --------------------------------------------------------- */
function initCalcModal() {
  let autoOpened = false;
  document.querySelectorAll(".calc2, .calc3, [data-lask]").forEach((root) => {
    if (root.dataset.modalized) return;
    root.dataset.modalized = "1";

    const isCalc3 = root.classList.contains("calc3");
    const isPkg = root.hasAttribute("data-lask") && !root.classList.contains("calc2") && !isCalc3;
    const fromStart = new URLSearchParams(location.search).has("laskuri");
    const offset = fromStart ? 1 : 0;
    const baseSteps = isCalc3
      ? ["Ominaisuudet", "Lisäpalvelut", "Hinta-arvio"]
      : isPkg
      ? ["Valitse paketti", "Lisää koriin"]
      : ["Valitse ominaisuudet", "Hinta-arvio"];
    const steps = fromStart ? ["Kategoria"].concat(baseSteps) : baseSteps;

    /* Avauspainike laskurin paikalle */
    const launch = document.createElement("div");
    launch.className = "lask-launch";
    launch.innerHTML =
      '<button type="button" class="btn btn--primary btn--lg">Avaa hintalaskuri</button>';
    root.parentNode.insertBefore(launch, root);

    /* Modaalin runko */
    const modal = document.createElement("div");
    modal.className = "lask-modal";
    modal.hidden = true;
    const stepsHtml = steps
      .map(
        (l, i) =>
          '<div class="lask-step" data-step="' + i + '">' +
          '<span class="lask-step__dot">' + (i + 1) + "</span>" +
          '<span class="lask-step__label">' + l + "</span></div>"
      )
      .join('<span class="lask-step__line"></span>');
    modal.innerHTML =
      '<div class="lask-modal__backdrop" data-lask-close></div>' +
      '<div class="lask-modal__box" role="dialog" aria-modal="true" aria-label="Hintalaskuri">' +
      '<div class="lask-modal__bar">' +
      '<div class="lask-steps">' + stepsHtml + "</div>" +
      '<button type="button" class="lask-modal__x" data-lask-close aria-label="Sulje ikkuna">&times;</button>' +
      "</div>" +
      '<div class="lask-modal__body"></div></div>';
    document.body.appendChild(modal);
    modal.querySelector(".lask-modal__body").appendChild(root);

    function setStep(n) {
      const cur = n + offset;
      modal.querySelectorAll(".lask-step").forEach((s) => {
        const i = Number(s.dataset.step);
        s.classList.toggle("is-done", i < cur);
        s.classList.toggle("is-active", i === cur);
      });
    }
    setStep(0);

    function open() {
      modal.hidden = false;
      document.body.style.overflow = "hidden";
      setStep(0);
    }
    function close() {
      modal.hidden = true;
      document.body.style.overflow = "";
    }
    launch.querySelector("button").addEventListener("click", open);
    modal.querySelectorAll("[data-lask-close]").forEach((el) =>
      el.addEventListener("click", close)
    );
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !modal.hidden) close();
    });

    /* Askelmittarin eteneminen (kytketään olemassa oleviin nappeihin) */
    if (isCalc3) {
      const next = root.querySelector(".calc3__next");
      if (next) next.addEventListener("click", () => setStep(1));
      root.querySelectorAll(".calc3__skip, .calc3__show").forEach((b) =>
        b.addEventListener("click", () => setStep(2))
      );
      const more = root.querySelector(".calc3__more");
      if (more) more.addEventListener("click", () => setStep(0));
    } else if (isPkg) {
      root.querySelectorAll("[data-add-package]").forEach((b) =>
        b.addEventListener("click", () => setStep(1))
      );
    } else {
      const calc = root.querySelector(".calc2__calc");
      if (calc) calc.addEventListener("click", () => setStep(1));
      const more = root.querySelector(".calc2__more");
      if (more) more.addEventListener("click", () => setStep(0));
    }

    /* Tultiin kategoriavalinnasta -> avaa ensimmäinen ikkuna heti */
    if (fromStart && !autoOpened) {
      autoOpened = true;
      open();
    }
  });
}

/* ---------------------------------------------------------
   7a2. Hintalaskurin aloitus- ja välivalinnat täysruutu-
        ikkunassa. Kategoria = 1. askel, ikkuna avautuu heti.
   --------------------------------------------------------- */
function buildLaskWindow(content, opts) {
  /* Vie valinnan linkit eteenpäin laskuri-ikkunassa (?laskuri=1) */
  content.querySelectorAll("a[href]").forEach((a) => {
    const href = a.getAttribute("href");
    if (
      href &&
      href.indexOf("?") === -1 &&
      href.indexOf("#") === -1 &&
      /\.html$/.test(href) &&
      href !== "laskuri.html"
    ) {
      a.setAttribute("href", href + "?laskuri=1");
    }
  });

  const steps = ["Kategoria", "Valinnat", "Hinta-arvio"];
  const active = opts.active || 0;

  /* Muista sisällön alkuperäinen paikka, jotta se voidaan palauttaa kun
     ikkuna suljetaan (muuten sivu jää tyhjäksi ja näyttää etusivulta) */
  const placeholder = document.createComment("lask-content");
  content.parentNode.insertBefore(placeholder, content);

  const modal = document.createElement("div");
  modal.className = "lask-modal";
  modal.hidden = true;
  const stepsHtml = steps
    .map(
      (l, i) =>
        '<div class="lask-step' +
        (i < active ? " is-done" : i === active ? " is-active" : "") +
        '" data-step="' + i + '">' +
        '<span class="lask-step__dot">' + (i + 1) + "</span>" +
        '<span class="lask-step__label">' + l + "</span></div>"
    )
    .join('<span class="lask-step__line"></span>');
  const titleHtml = opts.title
    ? '<h2 class="lask-start__title">' + opts.title + "</h2>"
    : "";
  modal.innerHTML =
    '<div class="lask-modal__backdrop" data-lask-close></div>' +
    '<div class="lask-modal__box" role="dialog" aria-modal="true" aria-label="Hintalaskuri">' +
    '<div class="lask-modal__bar">' +
    '<div class="lask-steps">' + stepsHtml + "</div>" +
    '<button type="button" class="lask-modal__x" data-lask-close aria-label="Sulje ikkuna">&times;</button>' +
    "</div>" +
    '<div class="lask-modal__body">' + titleHtml + "</div></div>";
  document.body.appendChild(modal);
  const modalBody = modal.querySelector(".lask-modal__body");

  function open() {
    modalBody.appendChild(content);
    modal.hidden = false;
    document.body.style.overflow = "hidden";
  }
  function close() {
    modal.hidden = true;
    document.body.style.overflow = "";
    /* Palauta valinta takaisin sivulle, jotta sivu näyttää normaalilta */
    placeholder.parentNode.insertBefore(content, placeholder);
  }
  modal.querySelectorAll("[data-lask-close]").forEach((el) =>
    el.addEventListener("click", close)
  );
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !modal.hidden) close();
  });

  if (opts.openNow) open();
}

function initCalcStart() {
  const fromStart = new URLSearchParams(location.search).has("laskuri");

  /* Laskuri-sivun kategoriavalinta: aina ikkunassa, avautuu heti */
  const grid = document.querySelector(".l803__grid");
  if (grid) {
    buildLaskWindow(grid, { active: 0, title: "Mitä haluat laskea?", openNow: true });
  }

  /* Nettisivut-välivalinta (n11): ikkunassa vain laskurivirran kautta */
  const n11 = document.querySelector(".n11 .container");
  if (n11 && fromStart) {
    buildLaskWindow(n11, { active: 1, title: "", openNow: true });
  }
}

/* ---------------------------------------------------------
   7b. Valmiit paketit -> lisää hinta-arvioiden koriin
   --------------------------------------------------------- */
function initPackageAdd() {
  document.querySelectorAll("[data-add-package]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const label = btn.dataset.label || "Paketti";
      const price = Number(btn.dataset.price) || 0;
      let names = [];
      try { names = JSON.parse(btn.dataset.items || "[]"); } catch (e) { names = []; }
      const items = names.map((n) => ({ name: n, price: null }));
      upsertEstimate({ id: "paketti::" + label, label, once: price, items, recurring: [] });
      window.location.href = "arviot.html";
    });
  });
}

/* ---------------------------------------------------------
   7c. Demot — ennen/jälkeen -slaideri (.bna)
   --------------------------------------------------------- */
function initBna() {
  document.querySelectorAll(".bna").forEach((bna) => {
    bna.querySelectorAll("[data-bna-toggle]").forEach((btn) => {
      btn.addEventListener("click", () => bna.classList.toggle("is-result"));
    });
  });
}

/* ---------------------------------------------------------
   8. Käynnistys
   --------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  initNav();
  initReveal();
  initYear();
  initCalculator();
  initOfferForm();
  initCalc2();
  initCalc3();
  initCalcModal();
  initCalcStart();
  initArviot();
  initPackageAdd();
  initBna();
});
