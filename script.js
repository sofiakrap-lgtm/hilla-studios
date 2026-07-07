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

  /* LÄHETYS: jos lomakkeella on Static Forms -action, lähetetään data
     palvelimelle (fetch POST). Muuten varafallback: mailto. */
  const action = form.getAttribute("action") || "";
  if (/staticforms/i.test(action)) {
    if ((form.querySelector('[name="_gotcha"]') || {}).value) return; /* botti */
    const setHidden = (n, v) => { const el = form.querySelector('[name="' + n + '"]'); if (el) el.value = v; };
    setHidden("subject", subject);
    setHidden("message", summary);
    setHidden("replyTo", (form.querySelector('[name="email"]')?.value || "").trim());
    const note = result ? result.querySelector("[data-result-note]") : null;
    const okMsg = "Saimme tarjouspyyntösi ja palaamme sinulle pian. Alla näet yhteenvedon valinnoistasi.";
    const errMsg = "Lähetys ei mennyt läpi. Voit kopioida alla olevan yhteenvedon ja lähettää sen sähköpostilla osoitteeseen " + CONTACT_EMAIL + ".";
    fetch(action, { method: "POST", body: new FormData(form), headers: { "Accept": "application/json" } })
      .then((res) => { if (note) note.textContent = res.ok ? okMsg : errMsg; })
      .catch(() => { if (note) note.textContent = errMsg; });
    return;
  }
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
    if (i.checked) {
      const q = Number(i.dataset.qty) || 1;
      const nm = i.closest(".calc2__item").querySelector("strong").textContent.trim();
      items.push({ name: q > 1 ? nm + " (" + q + " kieltä)" : nm, price: Number(i.dataset.price) * q });
    }
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
    /* Koosta kaikki arviot yhdeksi tarjoukseksi ja tallenna, jotta
       tarjouspyyntölomake esitäyttää valinnat. Avaa sitten yhteystietolomake. */
    const items = [];
    let oneTime = 0, monthly = 0;
    ests.forEach((e) => {
      oneTime += e.once || 0;
      (e.items || []).forEach((it) =>
        items.push({ name: it.name, price: it.price != null ? it.price : 0, recurring: false }));
      (e.recurring || []).forEach((r) => {
        const perMonth = r.unit === "kk";
        items.push({ name: perMonth ? r.name : `${r.name} (${r.unit})`, price: r.price, recurring: perMonth });
        if (perMonth) monthly += r.price || 0;
      });
    });
    const payload = { items: items, oneTime: oneTime, monthly: monthly, savedAt: new Date().toISOString() };
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(payload)); } catch (err) {}
    window.location.href = "tarjouspyynto.html";
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
        if (i.checked) once += Number(i.dataset.price) * (Number(i.dataset.qty) || 1);
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
      /* Suoraan hintaerittelyyn (arviot), jossa myös aiemmin lisätyt palvelut */
      window.location.href = "arviot.html";
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
        if (i.checked) once += Number(i.dataset.price) * (Number(i.dataset.qty) || 1);
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
      /* Suoraan hintaerittelyyn (arviot), jossa myös aiemmin lisätyt palvelut */
      window.location.href = "arviot.html";
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
      window.location.href = "index.html";
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
    /* Ruksista suoraan etusivulle */
    window.location.href = "index.html";
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
   7b2. Pakettikorttien pikkutekstit avattaviksi (p402)
   --------------------------------------------------------- */
function initFeatToggle() {
  document.querySelectorAll(".p402__feats li").forEach((li) => {
    if (li.dataset.feattoggle) return;
    const strong = li.querySelector("strong");
    const small = li.querySelector("small");
    if (!strong || !small) return;
    li.dataset.feattoggle = "1";
    const tog = document.createElement("button");
    tog.type = "button";
    tog.className = "p402__feat-toggle";
    tog.textContent = "Lue lisää";
    tog.setAttribute("aria-expanded", "false");
    tog.setAttribute("aria-label", "Näytä lisätietoa");
    strong.insertAdjacentElement("afterend", tog);
    tog.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      const open = !small.hasAttribute("data-open");
      if (open) small.setAttribute("data-open", "");
      else small.removeAttribute("data-open");
      tog.classList.toggle("is-open", open);
      tog.textContent = open ? "Sulje" : "Lue lisää";
      tog.setAttribute("aria-expanded", String(open));
    });
  });
}

/* ---------------------------------------------------------
   7b3. Nettisivun ominaisuuksien lisätieto + demo-nappi
        (avattava nuoli jokaisessa calc2-ominaisuudessa)
   --------------------------------------------------------- */
function initFeatureInfo() {
  const ARVIO = "Hinta on arvio yleisestä toteutuksesta. Jos työ vaatii merkittävästi tavallista enemmän (esim. laajat räätälöinnit tai monimutkaiset integraatiot), hinta voi tarkentua – mutta vain poikkeustapauksissa.";
  const INFO = {
    "Basic-sivu": { t: "Valmis nettisivu, joka sisältää etusivun, palvelut/tuotteet, tietoa meistä, yhteystiedot ja yhteydenottolomakkeen, gallerian/referenssit sekä hinnaston. Tämän päälle rakennetaan kaikki muut ominaisuudet." },
    "Brändi-aloituspaketti": { t: "Osa brändäyspakettia. Teemme sinulle kelpo logon (emme ylibrändättyä), löydämme sopivan värimaailman ja valitsemme toimivat fonttiyhdistelmät Google Fonts -valikoimasta. Sivusi saa heti yhtenäisen, viimeistellyn ilmeen. Valittu oletuksena, voit poistaa sen, jos et tarvitse sitä." },
    "Lisäsivu": { t: "Yksi lisäsivu Basicin päälle, esimerkiksi UKK, tarina tai oma kampanjasivu. Sama ilme, oma kohta valikossa.", d: "demot.html" },
    "Karttaintegraatio": { t: "Upotettu kartta, joka näyttää sijaintisi suoraan sivulla. Asiakas löytää perille ilman erillistä hakua.", d: "demot.html" },
    "Ajanvarausjärjestelmä": { t: "Ajanvaraus toteutetaan liittämällä sivustoosi luotettava varausjärjestelmä, joka sopii juuri sinun alallesi. Esimerkkejä: Vello, Timma, Calendly tai Acuity. Asiakas varaa ajan itse verkossa vuorokauden ympäri, ja varaus näkyy suoraan kalenterissasi – mukana varausvahvistukset ja muistutukset.", d: "demot.html", note: ARVIO },
    "Pöytävarausjärjestelmä": { t: "Pöytävaraus toteutetaan integroimalla ravintola-alan varausjärjestelmä sivustolle. Esimerkkejä: TableOnline, ResDiary tai OpenTable. Asiakas valitsee ajankohdan ja seurueen koon, ja varaus ohjautuu suoraan teille.", d: "demot.html", note: ARVIO },
    "Kanta-asiakasjärjestelmä": { t: "Toteutetaan kanta-asiakas- tai jäsenyystyökalulla, joka liitetään sivustoon. Esimerkkejä: MailerLite tai Mailchimp (edut ja viestintä) tai kevyt oma leimakortti-/etujärjestelmä. Palkitset uskolliset asiakkaat eduilla ja kampanjoilla, ja saat heidät palaamaan.", d: "demot.html", note: ARVIO },
    "Verkkokauppa": { t: "Verkkokauppa rakennetaan sopivalla kauppa-alustalla tuotteidesi ja arkesi ympärille. Esimerkkejä: WooCommerce, Shopify tai kevyt Stripe-/MyCashflow-pohjainen ratkaisu. Sisältää tuotteet, ostoskorin ja maksut – tarvittaessa myös toimitustavat ja varastonhallinnan.", d: "demot.html", note: ARVIO },
    "Blogi / uutiset": { t: "Toteutetaan helppokäyttöisellä julkaisunäkymällä, jolla lisäät juttuja, vinkkejä ja uutisia itse ilman koodia. Tuore sisältö parantaa myös löydettävyyttä Googlessa.", d: "demot.html", note: ARVIO },
    "Uutiskirje-integraatio": { t: "Kerää sähköpostiosoitteita ja lähetä uutiskirjeitä. Pidät asiakkaat ajan tasalla tarjouksista ja uutuuksista.", d: "demot.html" },
    "Some-syötteen upotus": { t: "Instagram- tai muu some-syöte näkyy suoraan sivulla ja päivittyy automaattisesti, kun julkaiset uutta.", d: "demot.html" },
    "Monikielisyys (+1 kieli)": { t: "Sivusto myös toisella kielellä, esimerkiksi englanniksi. Tavoitat laajemman yleisön. Hinta on per lisättävä kieli.", d: "demot.html" },
    "Hakukoneoptimoinnin perusta (SEO)": { t: "Perus-SEO kuntoon: sivujen otsikot, metakuvaukset, rakenne ja nopeus sekä Google-näkyvyyden perusasetukset (esim. Google Search Console). Parantaa löydettävyyttä hakukoneissa.", note: ARVIO },
    "Webhotelli & ylläpito": { t: "Sivusi tarvitsee palvelintilan (webhotelli). Hoidamme teknisen ylläpidon, jotta sivu pysyy pystyssä ja turvallisena." },
    "Verkkotunnus (domain)": { t: "Oma osoite, esimerkiksi yrityksesi.fi. Hankimme ja kytkemme sen sivustoosi." },
    "Päivityspalvelu": { t: "Hoidamme sisältö- ja tekniset päivitykset puolestasi, jotta sinun ei tarvitse koskea koodiin." },
    "Rekry-lomakkeiden vastaanotto": { t: "Toteutetaan lomaketyökalulla, joka kerää hakemukset ja liitteet (esim. CV) ja lähettää ne koottuna sähköpostiisi. Esimerkkejä: Static Forms, Formspree tai vastaava.", d: "demot.html", note: ARVIO },
    "Hintalaskuri omalle sivulle": { t: "Rakennamme sivullesi vastaavan interaktiivisen hintalaskurin kuin tämä. Asiakas valitsee palvelut, saa hinta-arvion heti ja voi lähettää sen pohjalta tarjouspyynnön.", d: "demot.html", note: ARVIO }
  };
  document.querySelectorAll(".calc2__item").forEach((item) => {
    if (item.dataset.featinfo) return;
    const strong = item.querySelector("strong");
    if (!strong) return;
    const info = INFO[strong.textContent.trim()];
    if (!info) return;
    item.dataset.featinfo = "1";
    item.classList.add("has-info");

    const tog = document.createElement("button");
    tog.type = "button";
    tog.className = "calc2__info-toggle";
    tog.setAttribute("aria-expanded", "false");
    tog.setAttribute("aria-label", "Lisätietoa ominaisuudesta");
    item.appendChild(tog);

    const panel = document.createElement("div");
    panel.className = "calc2__info";
    panel.hidden = true;
    panel.innerHTML =
      "<p>" + info.t + "</p>" +
      (info.note ? '<p class="calc2__info-note">' + info.note + "</p>" : "") +
      (info.d ? '<a href="' + info.d + '" target="_blank" rel="noopener" class="btn btn--ghost calc2__info-demo">Katso demo</a>' : "");
    item.insertAdjacentElement("afterend", panel);

    tog.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      const open = panel.hidden;
      panel.hidden = !open;
      item.classList.toggle("is-open", open);
      tog.classList.toggle("is-open", open);
      tog.setAttribute("aria-expanded", String(open));
    });
  });
}

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

/* Demokarusellin syvälinkki: ?demo=<ala> keskittää oikean demokortin */
function initDemoDeepLink() {
  const track = document.querySelector(".dcar__track");
  if (!track) return;
  const slug = new URLSearchParams(window.location.search).get("demo");
  const isDefault = !slug;
  // Ilman syvälinkkiä Velora (hyvinvointi) keskelle oletuksena
  const targetSlug = slug || "hyvinvointi";
  const card = track.querySelector('.dcar__card[data-demo="' + targetSlug + '"]');
  if (!card) return;
  const center = () => {
    const target = card.offsetLeft - (track.clientWidth - card.offsetWidth) / 2;
    track.scrollTo({ left: Math.max(0, target), behavior: isDefault ? "auto" : "smooth" });
    if (!isDefault) card.classList.add("is-target");
  };
  // Syvälinkillä vieritetään sivu karuselliin; oletuskeskitys tehdään hiljaa paikallaan
  if (!isDefault) {
    const sec = document.getElementById("demo-nettisivut");
    if (sec) sec.scrollIntoView({ block: "start" });
  }
  // Odota, että kuvat ja asettelu ovat valmiina, jotta keskitys osuu oikein
  window.setTimeout(center, 120);
}

/* ---------------------------------------------------------
   7c. Määrävalitsin (esim. Monikielisyys): +/- napeilla useampi
       kieli. Kukin yksikkö = data-price. Kokonaishinta = hinta × määrä.
   --------------------------------------------------------- */
function initQtySteppers() {
  const euro = (n) => n.toLocaleString("fi-FI") + " €";
  document.querySelectorAll("input[data-qty]").forEach((cb) => {
    if (cb.dataset.qtyInit) return;
    const item = cb.closest(".calc2__item");
    if (!item) return;
    cb.dataset.qtyInit = "1";
    const unit = Number(cb.dataset.price) || 0;
    const priceEl = item.querySelector(".calc2__price");
    const label = item.querySelector(".calc2__label");

    const stepper = document.createElement("span");
    stepper.className = "calc2__qty";
    stepper.hidden = true;
    stepper.innerHTML =
      '<button type="button" class="calc2__qty-btn" data-qd="-1" aria-label="Vähennä kieliä">−</button>' +
      '<span class="calc2__qty-num" data-qty-num>1</span>' +
      '<button type="button" class="calc2__qty-btn" data-qd="1" aria-label="Lisää kieli">+</button>' +
      '<span class="calc2__qty-label">kieltä</span>';
    (label || item).appendChild(stepper);
    const numEl = stepper.querySelector("[data-qty-num]");

    function render() {
      const q = Number(cb.dataset.qty) || 1;
      numEl.textContent = q;
      stepper.hidden = !cb.checked;
      if (priceEl) {
        priceEl.textContent = cb.checked
          ? euro(unit * q)
          : unit + " € / lisättävä kieli";
      }
    }

    cb.addEventListener("change", () => {
      if (!cb.checked) cb.dataset.qty = "1";
      render();
    });
    stepper.querySelectorAll("[data-qd]").forEach((b) => {
      b.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        let q = (Number(cb.dataset.qty) || 1) + Number(b.dataset.qd);
        q = Math.max(1, Math.min(9, q));
        cb.dataset.qty = String(q);
        render();
      });
    });
    render();
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
  initFeatureInfo();
  initQtySteppers();
  initCalcModal();
  initCalcStart();
  initArviot();
  initPackageAdd();
  initBna();
  initDemoDeepLink();
});
