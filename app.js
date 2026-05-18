const BRAND_NAME = "VCC50000";
const GPT_ASSISTANT_URL =
  "https://chatgpt.com/g/g-69d308e63dec8191a773b8cf9cf13ddd-vcc50000-ai";

const screens = document.querySelectorAll(".screen");
const navItems = document.querySelectorAll(".nav-item");
const loginForm = document.getElementById("loginForm");
const loginMessage = document.getElementById("loginMessage");
const logoutBtn = document.getElementById("logoutBtn");
const loadDefaultsBtn = document.getElementById("loadDefaults");

const glossaryDrawer = document.getElementById("glossaryDrawer");
const glossaryOverlay = document.getElementById("glossaryOverlay");
const glossarySearch = document.getElementById("glossarySearch");
const glossaryList = document.getElementById("glossaryList");
const closeGlossaryBtn = document.getElementById("closeGlossaryBtn");
const glossaryOpenButtons = document.querySelectorAll(".open-glossary");
const dictionaryPreview = document.getElementById("dictionaryPreview");

const assistantLauncher = document.getElementById("assistantLauncher");
const assistantDrawer = document.getElementById("assistantDrawer");
const assistantOverlay = document.getElementById("assistantOverlay");
const assistantCloseBtn = document.getElementById("assistantCloseBtn");
const assistantCopyLinkBtn = document.getElementById("assistantCopyLinkBtn");
const assistantStatus = document.getElementById("assistantStatus");
const assistantPromptButtons = document.querySelectorAll(".assistant-prompt-btn");
const assistantOpenLink = document.getElementById("assistantOpenLink");

const inputIds = [
  "purchasePrice",
  "monthlyRent",
  "visibleExpenses",
  "vacancyRate",
  "capex",
  "insurance",
  "interestRate",
  "ltv",
  "loanYears",
  "rentGrowth",
  "exitCapRate",
  "holdYears"
];

const defaults = {
  purchasePrice: 500000,
  monthlyRent: 2950,
  visibleExpenses: 880,
  vacancyRate: 6,
  capex: 250,
  insurance: 190,
  interestRate: 6.35,
  ltv: 75,
  loanYears: 30,
  rentGrowth: 3.2,
  exitCapRate: 6.4,
  holdYears: 7
};

const glossaryTerms = [
  {
    term: "Purchase Price",
    category: "Input",
    short: "Precio de compra del activo.",
    definition:
      "Es el valor al que se adquiere la propiedad. Impacta el monto de deuda, el equity inicial requerido y la base general sobre la cual se evalúa la rentabilidad."
  },
  {
    term: "Monthly Rent",
    category: "Input",
    short: "Renta mensual bruta esperada.",
    definition:
      "Es el ingreso mensual de alquiler antes de descontar vacancia y gastos. Es uno de los principales motores del NOI, del cash flow y del valor de salida."
  },
  {
    term: "Visible Expenses",
    category: "Input",
    short: "Gastos operativos mensuales conocidos.",
    definition:
      "Incluye gastos recurrentes que el owner espera pagar mes a mes, como administración, mantenimiento base, HOA o utilities a cargo del propietario. No incluye deuda."
  },
  {
    term: "Vacancy Rate",
    category: "Input",
    short: "Porcentaje de pérdida por vacancia.",
    definition:
      "Representa la porción estimada de renta que no se cobra por periodos vacíos, rotación o incobrabilidad. Reduce el ingreso efectivo para el cálculo del NOI."
  },
  {
    term: "CapEx",
    category: "Input",
    short: "Reserva mensual para gastos mayores.",
    definition:
      "CapEx significa capital expenditures. Se modela como una reserva mensual para cubrir reemplazos o mejoras de mayor tamaño, como techo, HVAC, acabados o elementos estructurales."
  },
  {
    term: "Insurance",
    category: "Input",
    short: "Costo mensual del seguro.",
    definition:
      "Es el gasto mensual asociado al seguro del inmueble. En Florida suele ser una variable de bastante peso dentro de la estructura de costos."
  },
  {
    term: "Interest Rate",
    category: "Debt",
    short: "Tasa anual del préstamo.",
    definition:
      "Es la tasa de interés usada para calcular el pago periódico del préstamo. A mayor tasa, mayor debt service y normalmente menor cash flow."
  },
  {
    term: "LTV",
    category: "Debt",
    short: "Loan-to-Value del financiamiento.",
    definition:
      "Indica qué porcentaje del precio de compra será financiado por el banco. Un LTV más alto reduce el equity inicial, pero aumenta la deuda y el riesgo financiero."
  },
  {
    term: "Loan Years",
    category: "Debt",
    short: "Plazo del préstamo en años.",
    definition:
      "Es la duración del préstamo. Un plazo más largo suele bajar la cuota mensual, aunque extiende la deuda durante más tiempo."
  },
  {
    term: "Rent Growth",
    category: "Projection",
    short: "Crecimiento anual esperado de renta.",
    definition:
      "Mide cuánto se espera que aumente la renta cada año. Se usa para proyectar ingresos futuros y afecta el NOI proyectado, el valor de salida y el IRR."
  },
  {
    term: "Exit Cap Rate",
    category: "Returns",
    short: "Cap rate usada para la salida.",
    definition:
      "Es la tasa de capitalización aplicada al NOI futuro para estimar el valor de venta. En general, una exit cap más baja produce un valor de salida mayor."
  },
  {
    term: "Hold Years",
    category: "Returns",
    short: "Años estimados de tenencia.",
    definition:
      "Es el tiempo que se planea mantener la propiedad antes de venderla. Afecta las proyecciones, la amortización de deuda, el valor de salida y el IRR."
  },
  {
    term: "NOI",
    category: "Metric",
    short: "Net Operating Income.",
    definition:
      "Es el ingreso operativo neto: renta efectiva menos gastos operativos, antes de deuda. Es una de las métricas más importantes para entender la salud operativa del activo."
  },
  {
    term: "Debt Service",
    category: "Metric",
    short: "Pago periódico de la deuda.",
    definition:
      "Es el total pagado por el préstamo, incluyendo principal e intereses. En este dashboard se calcula con base en la tasa, el monto del préstamo y el plazo."
  },
  {
    term: "Cash Flow",
    category: "Metric",
    short: "Flujo neto después de deuda.",
    definition:
      "Es el dinero que queda luego de descontar gastos operativos y debt service. Si es positivo, la propiedad genera excedente; si es negativo, requiere soporte."
  },
  {
    term: "Expense Ratio",
    category: "Metric",
    short: "Relación de gastos sobre renta.",
    definition:
      "Mide qué porcentaje de la renta bruta se consume en gastos operativos y vacancia. Ayuda a entender qué tan pesada es la estructura de costos."
  },
  {
    term: "DSCR",
    category: "Metric",
    short: "Debt Service Coverage Ratio.",
    definition:
      "Mide cuántas veces el NOI cubre el debt service. Un DSCR más alto suele indicar una estructura financiera más sana y más defendible frente a un lender."
  },
  {
    term: "Exit Value",
    category: "Returns",
    short: "Valor estimado de venta.",
    definition:
      "Es el valor proyectado del activo al final del hold period. Normalmente se calcula dividiendo el NOI del último año entre la exit cap rate."
  },
  {
    term: "IRR",
    category: "Returns",
    short: "Internal Rate of Return.",
    definition:
      "Es la tasa interna de retorno de toda la inversión considerando equity inicial, flujos anuales y venta final. Resume la rentabilidad total del deal."
  },
  {
    term: "Loan Amount",
    category: "Debt",
    short: "Monto financiado por el banco.",
    definition:
      "Es el capital del préstamo obtenido al aplicar el LTV sobre el purchase price. Determina la base del debt service."
  },
  {
    term: "Initial Equity",
    category: "Equity",
    short: "Capital inicial aportado por el inversionista.",
    definition:
      "Es la diferencia entre el purchase price y el loan amount. Representa el dinero que el sponsor o inversionista pone al cierre."
  },
  {
    term: "Cash on Cash",
    category: "Returns",
    short: "Retorno anual sobre el equity invertido.",
    definition:
      "Mide cuánto cash flow anual genera la propiedad en relación con el equity inicial invertido. Es útil para evaluar eficiencia del capital."
  },
  {
    term: "Breakeven Occupancy",
    category: "Metric",
    short: "Ocupación mínima para cubrir estructura.",
    definition:
      "Indica qué porcentaje de ocupación aproximado se necesita para cubrir gastos operativos fijos y deuda. Mientras menor sea, más resiliente suele ser el deal."
  }
];

function getEl(id) {
  return document.getElementById(id);
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function normalizeText(value) {
  return String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function isLoggedIn() {
  return localStorage.getItem("estateiq_logged_in") === "true";
}

function setText(id, value) {
  const el = getEl(id);
  if (el) {
    el.textContent = value;
  }
}

function setMessage(text = "", tone = "neutral") {
  if (!loginMessage) return;
  loginMessage.textContent = text;
  loginMessage.className = `message ${tone}`;
}

function setSessionUI() {
  const sessionState = getEl("sessionState");
  const sessionHint = getEl("sessionHint");
  const loggedIn = isLoggedIn();

  if (sessionState) {
    sessionState.textContent = loggedIn ? "Conectado" : "Invitado";
  }

  if (sessionHint) {
    sessionHint.textContent = loggedIn
      ? "Sesión activa. El dashboard está listo."
      : "Debes iniciar sesión para acceder al dashboard.";
  }
}

function setBrandName() {
  document.querySelectorAll("[data-brand]").forEach((el) => {
    el.textContent = BRAND_NAME;
  });
  document.title = `${BRAND_NAME} | Florida Real Estate Dashboard`;
}

function syncBodyModalState() {
  const glossaryOpen = glossaryDrawer?.classList.contains("open");
  const assistantOpen = assistantDrawer?.classList.contains("open");

  if (glossaryOpen || assistantOpen) {
    document.body.classList.add("modal-open");
  } else {
    document.body.classList.remove("modal-open");
  }
}

const fmtCurrency = (value) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(Number.isFinite(value) ? value : 0);

const fmtPercent = (value, digits = 1) =>
  `${(Number.isFinite(value) ? value : 0).toFixed(digits)}%`;

function safeNumber(id) {
  const el = getEl(id);
  if (!el) return 0;
  const parsed = Number(el.value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function saveInputs() {
  const data = {};
  inputIds.forEach((id) => {
    data[id] = safeNumber(id);
  });
  localStorage.setItem("estateiq_inputs", JSON.stringify(data));
}

function loadInputs() {
  let saved = {};

  try {
    saved = JSON.parse(localStorage.getItem("estateiq_inputs") || "{}");
  } catch (error) {
    saved = {};
  }

  inputIds.forEach((id) => {
    const el = getEl(id);
    if (!el) return;
    el.value = saved[id] ?? defaults[id];
  });
}

function resetDefaults() {
  inputIds.forEach((id) => {
    const el = getEl(id);
    if (!el) return;
    el.value = defaults[id];
  });

  saveInputs();
  calculate();
}

function showScreen(id) {
  screens.forEach((screen) => {
    screen.classList.toggle("active-screen", screen.id === id);
  });

  navItems.forEach((item) => {
    item.classList.toggle("active", item.dataset.screen === id);
  });
}

function navigateTo(id) {
  if (id === "dashboardScreen" && !isLoggedIn()) {
    showScreen("loginScreen");
    setMessage("Debes iniciar sesión para abrir el dashboard.", "error");
    return;
  }

  showScreen(id);

  if (id === "dashboardScreen") {
    calculate();
  }
}

function openGlossary(term = "") {
  if (!glossaryDrawer) return;

  glossaryDrawer.classList.add("open");
  glossaryDrawer.setAttribute("aria-hidden", "false");
  syncBodyModalState();

  if (glossarySearch) {
    glossarySearch.value = term || "";
    renderGlossary(glossarySearch.value, term || "");

    window.setTimeout(() => {
      glossarySearch.focus();
    }, 50);
  }
}

function closeGlossary() {
  if (!glossaryDrawer) return;

  glossaryDrawer.classList.remove("open");
  glossaryDrawer.setAttribute("aria-hidden", "true");
  syncBodyModalState();
}

function renderGlossary(query = "", activeTerm = "") {
  if (!glossaryList) return;

  const normalizedQuery = normalizeText(query);
  const normalizedActive = normalizeText(activeTerm);

  const filtered = glossaryTerms.filter((item) => {
    const haystack = normalizeText(
      `${item.term} ${item.category} ${item.short} ${item.definition}`
    );
    return haystack.includes(normalizedQuery);
  });

  glossaryList.innerHTML = "";

  if (!filtered.length) {
    glossaryList.innerHTML =
      '<div class="glossary-empty">No encontré resultados para esa búsqueda.</div>';
    return;
  }

  filtered.forEach((item) => {
    const card = document.createElement("article");
    card.className = "glossary-card";

    if (normalizeText(item.term) === normalizedActive && normalizedActive) {
      card.classList.add("active");
    }

    card.innerHTML = `
      <div class="glossary-card-head">
        <h4>${item.term}</h4>
        <span class="glossary-category">${item.category}</span>
      </div>
      <p class="glossary-short">${item.short}</p>
      <p class="glossary-body">${item.definition}</p>
    `;

    glossaryList.appendChild(card);
  });
}

function renderDictionaryPreview() {
  if (!dictionaryPreview) return;

  const previewTerms = glossaryTerms.slice(0, 6);

  dictionaryPreview.innerHTML = previewTerms
    .map(
      (item) => `
        <button type="button" class="preview-card" data-term="${item.term}">
          <span>${item.category}</span>
          <strong>${item.term}</strong>
          <p>${item.short}</p>
        </button>
      `
    )
    .join("");

  dictionaryPreview.querySelectorAll(".preview-card").forEach((card) => {
    card.addEventListener("click", () => {
      const term = card.dataset.term || "";
      openGlossary(term);
    });
  });
}

function setAssistantStatus(message, tone = "neutral") {
  if (!assistantStatus) return;
  assistantStatus.textContent = message;
  assistantStatus.className = `assistant-status ${tone}`;
}

function openAssistantDrawer() {
  if (!assistantDrawer) return;

  assistantDrawer.classList.add("open");
  assistantDrawer.setAttribute("aria-hidden", "false");
  syncBodyModalState();
}

function closeAssistantDrawer() {
  if (!assistantDrawer) return;

  assistantDrawer.classList.remove("open");
  assistantDrawer.setAttribute("aria-hidden", "true");
  syncBodyModalState();
}

async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    const temp = document.createElement("textarea");
    temp.value = text;
    temp.setAttribute("readonly", "");
    temp.style.position = "absolute";
    temp.style.left = "-9999px";
    document.body.appendChild(temp);
    temp.select();

    try {
      document.execCommand("copy");
      document.body.removeChild(temp);
      return true;
    } catch (fallbackError) {
      document.body.removeChild(temp);
      return false;
    }
  }
}

function setupVirtualAssistant() {
  if (assistantOpenLink) {
    assistantOpenLink.href = GPT_ASSISTANT_URL;
  }

  assistantLauncher?.addEventListener("click", openAssistantDrawer);
  assistantCloseBtn?.addEventListener("click", closeAssistantDrawer);
  assistantOverlay?.addEventListener("click", closeAssistantDrawer);

  assistantCopyLinkBtn?.addEventListener("click", async () => {
    const copied = await copyToClipboard(GPT_ASSISTANT_URL);

    if (copied) {
      setAssistantStatus("Assistant link copied.", "success");
    } else {
      setAssistantStatus("Could not copy the link.", "error");
    }
  });

  assistantPromptButtons.forEach((button) => {
    button.addEventListener("click", async () => {
      const prompt = button.dataset.prompt || "";
      const copied = await copyToClipboard(prompt);

      if (copied) {
        setAssistantStatus("Prompt copied. Paste it inside VCC50000 AI.", "success");
      } else {
        setAssistantStatus("Could not copy the prompt.", "error");
      }
    });
  });
}

function monthlyPayment(ratePerMonth, totalMonths, principal) {
  if (principal <= 0 || totalMonths <= 0) return 0;
  if (ratePerMonth === 0) return principal / totalMonths;

  return (
    (ratePerMonth * principal) /
    (1 - Math.pow(1 + ratePerMonth, -totalMonths))
  );
}

function npv(rate, cashflows) {
  return cashflows.reduce((acc, cashflow, index) => {
    return acc + cashflow / Math.pow(1 + rate, index);
  }, 0);
}

function computeIRR(cashflows) {
  const hasPositive = cashflows.some((value) => value > 0);
  const hasNegative = cashflows.some((value) => value < 0);

  if (!hasPositive || !hasNegative) return 0;

  let low = -0.9999;
  let high = 1;
  let npvLow = npv(low, cashflows);
  let npvHigh = npv(high, cashflows);
  let attempts = 0;

  while (npvLow * npvHigh > 0 && attempts < 60) {
    high *= 2;
    npvHigh = npv(high, cashflows);
    attempts += 1;

    if (high > 1024) return 0;
  }

  if (npvLow * npvHigh > 0) return 0;

  for (let i = 0; i < 200; i += 1) {
    const mid = (low + high) / 2;
    const npvMid = npv(mid, cashflows);

    if (Math.abs(npvMid) < 1e-7) return mid;

    if (npvLow * npvMid < 0) {
      high = mid;
      npvHigh = npvMid;
    } else {
      low = mid;
      npvLow = npvMid;
    }
  }

  return (low + high) / 2;
}

function amortizeOneYear(balance, payment, monthlyRate) {
  let remaining = balance;

  for (let month = 0; month < 12; month += 1) {
    const interestPortion = remaining * monthlyRate;
    const principalPortion = Math.max(0, payment - interestPortion);
    remaining = Math.max(0, remaining - principalPortion);
  }

  return remaining;
}

function renderFlags(flags) {
  const container = getEl("riskFlags");
  if (!container) return;

  container.innerHTML = "";

  flags.forEach((flag) => {
    const el = document.createElement("span");
    el.className = `flag ${flag.tone}`;
    el.textContent = flag.label;
    container.appendChild(el);
  });
}

function updateDealRead({
  dscr,
  irr,
  cashOnCash,
  breakEvenOccupancy,
  cashFlowAnnual,
  exitValue,
  purchasePrice
}) {
  const badge = getEl("dealScoreLabel");
  const title = getEl("dealSummaryTitle");
  const text = getEl("dealSummaryText");

  let label = "En revisión";
  let titleText = "Esperando evaluación";
  let bodyText = "Completa los supuestos del deal para generar lectura ejecutiva.";
  let tone = "neutral";

  if (purchasePrice > 0 && exitValue > 0) {
    if (dscr >= 1.3 && irr >= 0.12 && cashOnCash >= 7 && cashFlowAnnual > 0) {
      label = "Strong";
      titleText = "La operación se percibe fuerte para presentación.";
      bodyText =
        "Existe cobertura saludable de deuda, flujo positivo y retorno competitivo. El deal luce más sólido para una narrativa comercial.";
      tone = "positive";
    } else if (dscr >= 1.1 && irr >= 0.08 && cashFlowAnnual >= 0) {
      label = "Watchlist";
      titleText = "El deal es defendible, pero requiere seguimiento.";
      bodyText =
        "La operación mantiene una lectura razonable, aunque depende más del crecimiento de renta y de una salida disciplinada.";
      tone = "watch";
    } else {
      label = "Weak";
      titleText = "La estructura financiera todavía se ve frágil.";
      bodyText =
        "Conviene revisar precio de compra, renta o deuda antes de usar esta versión como propuesta final.";
      tone = "negative";
    }
  }

  if (badge) {
    badge.textContent = label;
    badge.className = `score-badge ${tone}`;
  }

  if (title) {
    title.textContent = titleText;
  }

  if (text) {
    text.textContent = bodyText;
  }

  renderFlags([
    {
      label: dscr >= 1.25 ? "DSCR saludable" : dscr >= 1.1 ? "DSCR ajustado" : "DSCR débil",
      tone: dscr >= 1.25 ? "good" : dscr >= 1.1 ? "warn" : "bad"
    },
    {
      label: cashFlowAnnual >= 0 ? "Cash flow positivo" : "Cash flow negativo",
      tone: cashFlowAnnual >= 0 ? "good" : "bad"
    },
    {
      label: cashOnCash >= 8 ? "CoC competitivo" : cashOnCash >= 5 ? "CoC moderado" : "CoC bajo",
      tone: cashOnCash >= 8 ? "good" : cashOnCash >= 5 ? "warn" : "bad"
    },
    {
      label:
        breakEvenOccupancy <= 85
          ? "Breakeven cómodo"
          : breakEvenOccupancy <= 95
          ? "Breakeven ajustado"
          : "Breakeven exigente",
      tone:
        breakEvenOccupancy <= 85
          ? "good"
          : breakEvenOccupancy <= 95
          ? "warn"
          : "bad"
    },
    {
      label: irr >= 0.12 ? "IRR sólida" : irr >= 0.08 ? "IRR media" : "IRR baja",
      tone: irr >= 0.12 ? "good" : irr >= 0.08 ? "warn" : "bad"
    }
  ]);
}

function calculate() {
  const purchasePrice = Math.max(0, safeNumber("purchasePrice"));
  const monthlyRent = Math.max(0, safeNumber("monthlyRent"));
  const visibleExpenses = Math.max(0, safeNumber("visibleExpenses"));
  const vacancyRate = clamp(safeNumber("vacancyRate") / 100, 0, 0.35);
  const capex = Math.max(0, safeNumber("capex"));
  const insurance = Math.max(0, safeNumber("insurance"));
  const annualInterestRate = clamp(safeNumber("interestRate") / 100, 0, 1);
  const ltv = clamp(safeNumber("ltv") / 100, 0, 0.95);
  const loanYears = Math.max(1, Math.round(safeNumber("loanYears") || 30));
  const rentGrowth = clamp(safeNumber("rentGrowth") / 100, -0.1, 0.15);
  const exitCapRate = clamp(safeNumber("exitCapRate") / 100, 0.01, 0.2);
  const holdYears = Math.max(1, Math.round(safeNumber("holdYears") || 7));

  saveInputs();

  const fixedOperatingMonthly = visibleExpenses + capex + insurance;
  const vacancyMonthly = monthlyRent * vacancyRate;
  const totalExpensesMonthly = fixedOperatingMonthly + vacancyMonthly;

  const noiMonthly = monthlyRent - totalExpensesMonthly;
  const noiAnnual = noiMonthly * 12;

  const loanAmount = purchasePrice * ltv;
  const initialEquity = Math.max(0, purchasePrice - loanAmount);

  const monthlyRate = annualInterestRate / 12;
  const totalLoanMonths = loanYears * 12;

  const debtServiceMonthly = monthlyPayment(monthlyRate, totalLoanMonths, loanAmount);
  const debtServiceAnnual = debtServiceMonthly * 12;

  const cashFlowMonthly = noiMonthly - debtServiceMonthly;
  const cashFlowAnnual = cashFlowMonthly * 12;

  const expenseRatio = monthlyRent > 0 ? (totalExpensesMonthly / monthlyRent) * 100 : 0;
  const dscr = debtServiceAnnual > 0 ? noiAnnual / debtServiceAnnual : 0;
  const cashOnCash = initialEquity > 0 ? (cashFlowAnnual / initialEquity) * 100 : 0;
  const breakEvenOccupancy =
    monthlyRent > 0 ? ((fixedOperatingMonthly + debtServiceMonthly) / monthlyRent) * 100 : 0;

  setText("noiMonthly", fmtCurrency(noiMonthly));
  setText("noiAnnual", fmtCurrency(noiAnnual));
  setText("debtService", fmtCurrency(debtServiceMonthly));
  setText("cashFlow", fmtCurrency(cashFlowMonthly));
  setText("expenseRatio", fmtPercent(expenseRatio, 1));
  setText("dscr", `${dscr.toFixed(2)}x`);
  setText("loanAmountMetric", fmtCurrency(loanAmount));
  setText("equityRequiredMetric", fmtCurrency(initialEquity));
  setText("cashOnCash", fmtPercent(cashOnCash, 2));
  setText("breakEvenOccupancy", fmtPercent(breakEvenOccupancy, 1));

  const projectionBody = getEl("projectionBody");
  if (projectionBody) {
    projectionBody.innerHTML = "";
  }

  const opexGrowth = 0.02;
  const cashflows = [-initialEquity];
  let remainingLoan = loanAmount;
  let finalYearNoiAnnual = noiAnnual;

  for (let year = 1; year <= holdYears; year += 1) {
    const grownMonthlyRent = monthlyRent * Math.pow(1 + rentGrowth, year - 1);
    const grownFixedOpex = fixedOperatingMonthly * Math.pow(1 + opexGrowth, year - 1);
    const grownVacancy = grownMonthlyRent * vacancyRate;

    const noiYearMonthly = grownMonthlyRent - (grownFixedOpex + grownVacancy);
    const noiYearAnnual = noiYearMonthly * 12;
    const cashFlowYear = noiYearAnnual - debtServiceAnnual;

    finalYearNoiAnnual = noiYearAnnual;

    if (projectionBody) {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${year}</td>
        <td>${fmtCurrency(grownMonthlyRent * 12)}</td>
        <td>${fmtCurrency(noiYearAnnual)}</td>
        <td>${fmtCurrency(debtServiceAnnual)}</td>
        <td class="${cashFlowYear >= 0 ? "positive-cell" : "negative-cell"}">${fmtCurrency(cashFlowYear)}</td>
      `;
      projectionBody.appendChild(row);
    }

    cashflows.push(cashFlowYear);
    remainingLoan = amortizeOneYear(remainingLoan, debtServiceMonthly, monthlyRate);
  }

  const exitValue = finalYearNoiAnnual / exitCapRate;
  const saleProceeds = Math.max(0, exitValue - remainingLoan);

  if (cashflows.length > 0) {
    cashflows[cashflows.length - 1] += saleProceeds;
  }

  const dealIRR = computeIRR(cashflows);

  setText("exitValue", fmtCurrency(exitValue));
  setText("irr", fmtPercent(dealIRR * 100, 2));

  const sensitivityBody = getEl("sensitivityBody");
  if (sensitivityBody) {
    sensitivityBody.innerHTML = "";
  }

  [-400, -200, 0, 200, 400, 600].forEach((delta) => {
    const scenarioRent = Math.max(0, monthlyRent + delta);
    const scenarioVacancy = scenarioRent * vacancyRate;
    const scenarioNoiAnnual =
      (scenarioRent - (fixedOperatingMonthly + scenarioVacancy)) * 12;
    const scenarioValue = scenarioNoiAnnual / exitCapRate;

    if (sensitivityBody) {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${fmtCurrency(scenarioRent)}</td>
        <td>${fmtCurrency(scenarioNoiAnnual)}</td>
        <td>${fmtCurrency(scenarioValue)}</td>
      `;
      sensitivityBody.appendChild(row);
    }
  });

  updateDealRead({
    dscr,
    irr: dealIRR,
    cashOnCash,
    breakEvenOccupancy,
    cashFlowAnnual,
    exitValue,
    purchasePrice
  });
}

navItems.forEach((item) => {
  item.addEventListener("click", () => {
    navigateTo(item.dataset.screen);
  });
});

loginForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  const email = (getEl("email")?.value || "").trim();
  const password = getEl("password")?.value || "";
  const emailValid = /\S+@\S+\.\S+/.test(email);

  if (!emailValid || password.length < 4) {
    setMessage("Ingresa un email válido y una contraseña de al menos 4 caracteres.", "error");
    return;
  }

  localStorage.setItem("estateiq_logged_in", "true");
  setSessionUI();
  setMessage("Acceso concedido.", "success");
  navigateTo("dashboardScreen");
});

logoutBtn?.addEventListener("click", () => {
  localStorage.removeItem("estateiq_logged_in");
  setSessionUI();
  setMessage("Sesión cerrada.", "neutral");
  showScreen("loginScreen");
});

loadDefaultsBtn?.addEventListener("click", resetDefaults);

inputIds.forEach((id) => {
  getEl(id)?.addEventListener("input", calculate);
});

glossaryOpenButtons.forEach((btn) => {
  btn.addEventListener("click", () => openGlossary());
});

closeGlossaryBtn?.addEventListener("click", closeGlossary);
glossaryOverlay?.addEventListener("click", closeGlossary);

glossarySearch?.addEventListener("input", (event) => {
  renderGlossary(event.target.value);
});

document.querySelectorAll(".inline-help").forEach((btn) => {
  btn.addEventListener("click", () => {
    const term = btn.dataset.term || "";
    openGlossary(term);
  });
});

setupVirtualAssistant();

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeGlossary();
    closeAssistantDrawer();
  }
});

function setupVirtualAssistant() {
  if (assistantOpenLink) {
    assistantOpenLink.href = GPT_ASSISTANT_URL;
  }

  assistantLauncher?.addEventListener("click", openAssistantDrawer);
  assistantCloseBtn?.addEventListener("click", closeAssistantDrawer);
  assistantOverlay?.addEventListener("click", closeAssistantDrawer);

  assistantCopyLinkBtn?.addEventListener("click", async () => {
    const copied = await copyToClipboard(GPT_ASSISTANT_URL);

    if (copied) {
      setAssistantStatus("Assistant link copied.", "success");
    } else {
      setAssistantStatus("Could not copy the link.", "error");
    }
  });

  assistantPromptButtons.forEach((button) => {
    button.addEventListener("click", async () => {
      const prompt = button.dataset.prompt || "";
      const copied = await copyToClipboard(prompt);

      if (copied) {
        setAssistantStatus("Prompt copied. Paste it inside VCC50000 AI.", "success");
      } else {
        setAssistantStatus("Could not copy the prompt.", "error");
      }
    });
  });
}

setBrandName();
loadInputs();
setSessionUI();
renderGlossary();
renderDictionaryPreview();

if (isLoggedIn()) {
  showScreen("dashboardScreen");
} else {
  showScreen("loginScreen");
}

calculate();