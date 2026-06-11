(() => {
  const STORAGE_KEYS = {
    theme: 'qtt_theme',
    plan: 'qtt_selected_plan',
    session: 'qtt_session',
    inputs: 'qtt_saved_inputs',
  };

  const $ = (id) => document.getElementById(id);
  const savedInputs = readJSON(STORAGE_KEYS.inputs, {});

  function readJSON(key, fallback) {
    try {
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : fallback;
    } catch {
      return fallback;
    }
  }

  function writeJSON(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function formatNumber(value, digits = 4) {
    if (!Number.isFinite(value)) return 'N/A';
    const abs = Math.abs(value);
    if (abs >= 1000) return value.toLocaleString(undefined, { maximumFractionDigits: digits });
    return Number(value.toFixed(digits)).toString();
  }

  function parseList(raw) {
    if (!raw) return [];
    return raw.split(/[ ,\n\t]+/).map((v) => Number(v.trim())).filter(Number.isFinite);
  }

  function saveInput(id, value) {
    if (!id) return;
    savedInputs[id] = value;
    writeJSON(STORAGE_KEYS.inputs, savedInputs);
  }

  function loadSavedInput(el) {
    if (el?.id && Object.prototype.hasOwnProperty.call(savedInputs, el.id)) {
      el.value = savedInputs[el.id];
    }
  }

  function setResult(id, html) {
    const el = $(id);
    if (el) el.innerHTML = html;
  }

  function flashCard(el) {
    const card = el?.closest?.('.tool-card, .auth-card, .price-card, .stat, .feature-card');
    if (!card) return;
    card.classList.remove('flash');
    void card.offsetWidth;
    card.classList.add('flash');
    window.setTimeout(() => card.classList.remove('flash'), 240);
  }

  function calcAverage() {
    const nums = parseList($('avgNumbers')?.value);
    const weights = parseList($('avgWeights')?.value);
    if (!nums.length) return setResult('avgResult', 'Average will appear here.');

    if (weights.length === nums.length && weights.some((w) => w !== 0)) {
      const weightedSum = nums.reduce((sum, num, i) => sum + num * weights[i], 0);
      const weightTotal = weights.reduce((sum, w) => sum + w, 0);
      const avg = weightTotal !== 0 ? weightedSum / weightTotal : nums.reduce((a, b) => a + b, 0) / nums.length;
      setResult('avgResult', `Weighted average: <strong>${formatNumber(avg)}</strong>`);
    } else {
      const avg = nums.reduce((a, b) => a + b, 0) / nums.length;
      setResult('avgResult', `Average: <strong>${formatNumber(avg)}</strong>`);
    }
  }

  function calcStopLoss() {
    const entry = Number($('slEntry')?.value);
    const distance = Number($('slDistance')?.value);
    const side = $('slSide')?.value || 'long';
    const unit = $('slUnit')?.value || 'price';
    if (!Number.isFinite(entry) || !Number.isFinite(distance)) return setResult('slResult', 'Stop loss level will appear here.');

    const offset = unit === 'percent' ? entry * (distance / 100) : distance;
    const stop = side === 'long' ? entry - offset : entry + offset;
    setResult('slResult', `Stop loss: <strong>${formatNumber(stop)}</strong> (${side}, ${unit})`);
  }

  function calcRisk() {
    const balance = Number($('riskBalance')?.value);
    const percent = Number($('riskPercent')?.value);
    if (!Number.isFinite(balance) || !Number.isFinite(percent)) return setResult('riskResult', 'Risk amount will appear here.');
    setResult('riskResult', `Risk amount: <strong>${formatNumber(balance * (percent / 100))}</strong>`);
  }

  function calcLotSize() {
    const riskAmount = Number($('lotRisk')?.value);
    const stopLoss = Number($('lotStop')?.value);
    const pipValue = Number($('lotPipValue')?.value);
    const currency = ($('lotCurrency')?.value || 'USD').toUpperCase();
    if (![riskAmount, stopLoss, pipValue].every(Number.isFinite) || stopLoss <= 0 || pipValue <= 0) return setResult('lotResult', 'Lot size will appear here.');
    setResult('lotResult', `Estimated lot size: <strong>${formatNumber(riskAmount / (stopLoss * pipValue), 3)}</strong> ${currency}`);
  }

  function calcRR() {
    const entry = Number($('rrEntry')?.value);
    const stop = Number($('rrStop')?.value);
    const target = Number($('rrTarget')?.value);
    if (![entry, stop, target].every(Number.isFinite)) return setResult('rrResult', 'Risk / Reward will appear here.');
    const risk = Math.abs(entry - stop);
    const reward = Math.abs(target - entry);
    const ratio = risk > 0 ? reward / risk : NaN;
    setResult('rrResult', `Risk: <strong>${formatNumber(risk)}</strong> · Reward: <strong>${formatNumber(reward)}</strong> · R/R: <strong>${formatNumber(ratio, 2)}:1</strong>`);
  }

  function calcPL() {
    const entry = Number($('plEntry')?.value);
    const exit = Number($('plExit')?.value);
    const qty = Number($('plQty')?.value || 1);
    const mult = Number($('plMultiplier')?.value || 1);
    if (![entry, exit, qty, mult].every(Number.isFinite)) return setResult('plResult', 'Profit / Loss will appear here.');
    const pnl = (exit - entry) * qty * mult;
    setResult('plResult', `${pnl >= 0 ? 'Profit' : 'Loss'}: <strong>${formatNumber(pnl)}</strong>`);
  }

  function calcCompound() {
    const start = Number($('cmpStart')?.value);
    const monthly = Number($('cmpReturn')?.value);
    const months = Number($('cmpMonths')?.value);
    const contrib = Number($('cmpContrib')?.value || 0);
    if (![start, monthly, months, contrib].every(Number.isFinite) || months < 0) return setResult('cmpResult', 'Compounding value will appear here.');

    let capital = start;
    let totalContrib = 0;
    const rate = monthly / 100;
    for (let i = 0; i < months; i += 1) {
      capital = capital * (1 + rate) + contrib;
      totalContrib += contrib;
    }
    const profit = capital - start - totalContrib;
    setResult('cmpResult', `Final value: <strong>${formatNumber(capital)}</strong><br>Profit: <strong>${formatNumber(profit)}</strong>`);
  }

  function calcMargin() {
    const value = Number($('marginValue')?.value);
    const leverage = Number($('marginLev')?.value);
    if (![value, leverage].every(Number.isFinite) || leverage <= 0) return setResult('marginResult', 'Margin will appear here.');
    setResult('marginResult', `Required margin: <strong>${formatNumber(value / leverage)}</strong>`);
  }

  function calcDrawdown() {
    const peak = Number($('ddPeak')?.value);
    const current = Number($('ddCurrent')?.value);
    if (![peak, current].every(Number.isFinite) || peak <= 0) return setResult('ddResult', 'Drawdown will appear here.');
    const amount = peak - current;
    setResult('ddResult', `Drawdown: <strong>${formatNumber(amount)}</strong> (${formatNumber((amount / peak) * 100, 2)}%)`);
  }

  function calcBreakeven() {
    const entry = Number($('beEntry')?.value);
    const fees = Number($('beFees')?.value);
    if (![entry, fees].every(Number.isFinite)) return setResult('beResult', 'Breakeven will appear here.');
    setResult('beResult', `Long BE: <strong>${formatNumber(entry + fees)}</strong> · Short BE: <strong>${formatNumber(entry - fees)}</strong>`);
  }

  function calcPip() {
    const lot = Number($('pipLot')?.value);
    const pipSize = Number($('pipSize')?.value);
    const move = Number($('pipMove')?.value);
    const contract = Number($('pipContract')?.value);
    if (![lot, pipSize, move, contract].every(Number.isFinite) || pipSize <= 0) return setResult('pipResult', 'Pip value will appear here.');
    setResult('pipResult', `Pip value: <strong>${formatNumber((move / pipSize) * contract * lot)}</strong>`);
  }

  function calcWinRate() {
    const wins = Number($('wrWins')?.value);
    const losses = Number($('wrLosses')?.value);
    const avgWin = Number($('wrAvgWin')?.value);
    const avgLoss = Number($('wrAvgLoss')?.value);
    if (![wins, losses, avgWin, avgLoss].every(Number.isFinite) || wins < 0 || losses < 0) return setResult('wrResult', 'Win rate will appear here.');
    const total = wins + losses;
    if (!total) return setResult('wrResult', 'Win rate will appear here.');
    const winRate = wins / total;
    const expectancy = winRate * avgWin - (1 - winRate) * avgLoss;
    setResult('wrResult', `Win rate: <strong>${formatNumber(winRate * 100, 2)}%</strong> · Expectancy: <strong>${formatNumber(expectancy)}</strong>`);
  }

  function calculateAll() {
    calcAverage();
    calcStopLoss();
    calcRisk();
    calcLotSize();
    calcRR();
    calcPL();
    calcCompound();
    calcMargin();
    calcDrawdown();
    calcBreakeven();
    calcPip();
    calcWinRate();
  }

  function applyTheme(theme) {
    document.body.classList.toggle('light-mode', theme === 'light');
    localStorage.setItem(STORAGE_KEYS.theme, theme);
    const toggle = $('themeToggle');
    if (toggle) toggle.textContent = theme === 'light' ? 'Neon Mode' : 'Light Mode';
  }

  function updateSessionChip() {
    const chip = $('sessionChip');
    if (!chip) return;
    const session = readJSON(STORAGE_KEYS.session, null);
    const plan = localStorage.getItem(STORAGE_KEYS.plan) || 'Starter';

    if (session?.email) {
      chip.textContent = `${session.name || session.email} · ${session.plan || plan}`;
      chip.title = 'Click to logout';
      chip.style.cursor = 'pointer';
      chip.onclick = () => {
        localStorage.removeItem(STORAGE_KEYS.session);
        location.reload();
      };
    } else {
      chip.textContent = `Guest mode · ${plan}`;
      chip.title = 'Select a plan or sign in';
      chip.onclick = null;
    }
  }

  function initThemeToggle() {
    applyTheme(localStorage.getItem(STORAGE_KEYS.theme) || 'dark');
    const toggle = $('themeToggle');
    if (toggle) {
      toggle.addEventListener('click', () => {
        const next = document.body.classList.contains('light-mode') ? 'dark' : 'light';
        applyTheme(next);
        flashCard(toggle);
      });
    }
  }

  function initFilters() {
    const chips = Array.from(document.querySelectorAll('[data-filter]'));
    const cards = Array.from(document.querySelectorAll('.tool-card'));
    chips.forEach((chip) => {
      chip.addEventListener('click', () => {
        chips.forEach((c) => c.classList.remove('active'));
        chip.classList.add('active');
        const filter = chip.dataset.filter;
        cards.forEach((card) => {
          card.style.display = filter === 'all' || card.dataset.category === filter ? '' : 'none';
        });
      });
    });
  }

  function initInputs() {
    document.querySelectorAll('input, select, textarea').forEach((el) => {
      loadSavedInput(el);
      if (!el.id || el.id === 'themeToggle') return;
      el.addEventListener('input', () => {
        saveInput(el.id, el.value);
        calculateAll();
        flashCard(el);
      });
      el.addEventListener('change', () => {
        saveInput(el.id, el.value);
        calculateAll();
      });
    });
    calculateAll();
  }

  function initPricing() {
    document.querySelectorAll('.plan-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const plan = btn.dataset.plan || 'Starter';
        localStorage.setItem(STORAGE_KEYS.plan, plan);
        updateSessionChip();
        flashCard(btn);
        window.location.href = 'signup.html';
      });
    });
  }

  function setSession(user) {
    writeJSON(STORAGE_KEYS.session, user);
    localStorage.setItem(STORAGE_KEYS.plan, user.plan || localStorage.getItem(STORAGE_KEYS.plan) || 'Starter');
    updateSessionChip();
  }

  function getUsers() {
    return readJSON('qtt_users', []);
  }

  function signupUser({ name, email, password, plan }) {
    const users = getUsers();
    if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      return { ok: false, message: 'Account already exists. Please log in.' };
    }
    const user = { name, email, password, plan: plan || localStorage.getItem(STORAGE_KEYS.plan) || 'Starter' };
    users.push(user);
    writeJSON('qtt_users', users);
    setSession({ name, email, plan: user.plan });
    return { ok: true, message: 'Account created successfully.' };
  }

  function loginUser({ email, password }) {
    const users = getUsers();
    const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    if (!user) return { ok: false, message: 'Invalid email or password.' };
    setSession({ name: user.name, email: user.email, plan: user.plan });
    return { ok: true, message: 'Signed in successfully.' };
  }

  function initAuthPages() {
    const signupForm = $('signupForm');
    const loginForm = $('loginForm');

    if (signupForm) {
      const planField = $('selectedPlan');
      if (planField) planField.value = localStorage.getItem(STORAGE_KEYS.plan) || 'Starter';
      const signupMessage = $('signupMessage');
      const notice = $('signupNotice');
      const session = readJSON(STORAGE_KEYS.session, null);
      if (session && notice) notice.textContent = `You are already signed in as ${session.email}.`;

      signupForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const name = $('signupName')?.value.trim();
        const email = $('signupEmail')?.value.trim();
        const password = $('signupPassword')?.value;
        const plan = $('selectedPlan')?.value || 'Starter';
        if (!name || !email || !password) {
          if (signupMessage) signupMessage.textContent = 'Please fill every field.';
          return;
        }
        const result = signupUser({ name, email, password, plan });
        if (signupMessage) signupMessage.textContent = result.message;
        if (result.ok) window.setTimeout(() => { window.location.href = 'index.html'; }, 700);
      });
    }

    if (loginForm) {
      const loginMessage = $('loginMessage');
      loginForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const email = $('loginEmail')?.value.trim();
        const password = $('loginPassword')?.value;
        if (!email || !password) {
          if (loginMessage) loginMessage.textContent = 'Please enter email and password.';
          return;
        }
        const result = loginUser({ email, password });
        if (loginMessage) loginMessage.textContent = result.message;
        if (result.ok) window.setTimeout(() => { window.location.href = 'index.html'; }, 700);
      });
    }
  }

  function initPageAnimations() {
    document.querySelectorAll('.tool-card, .feature-card, .price-card, .stat').forEach((card, index) => {
      card.style.animationDelay = `${Math.min(index * 60, 400)}ms`;
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    initThemeToggle();
    initFilters();
    initInputs();
    initPricing();
    initAuthPages();
    updateSessionChip();
    initPageAnimations();
  });
})();
