// ===== Elements =====
const loginView = document.getElementById('loginView');
const dashboardView = document.getElementById('dashboardView');
const loginForm = document.getElementById('loginForm');
const loginStatus = document.getElementById('loginStatus');
const whoamiUser = document.getElementById('whoamiUser');
const logoutBtn = document.getElementById('logoutBtn');

const tabs = document.querySelectorAll('.dash-tab');
const panels = {
  form: document.getElementById('formTab'),
  registrations: document.getElementById('registrationsTab'),
  leads: document.getElementById('leadsTab'),
};

const registerForm = document.getElementById('registerForm');
const formStatus = document.getElementById('formStatus');

const detailOverlay = document.getElementById('detailOverlay');
const detailList = document.getElementById('detailList');
const detailClose = document.getElementById('detailClose');

// ===== Helpers shared by both tables =====
function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[c]));
}

function formatDate(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return String(iso);
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) +
    ' ' + d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
}

function openDetail(row) {
  detailList.innerHTML = Object.entries(row)
    .filter(([, v]) => v !== '' && v !== null && v !== undefined)
    .map(([k, v]) => {
      const value = k === 'Timestamp' ? formatDate(v) : v;
      return `<dt>${escapeHtml(k)}</dt><dd>${escapeHtml(value)}</dd>`;
    }).join('');
  detailOverlay.hidden = false;
}
detailClose.addEventListener('click', () => { detailOverlay.hidden = true; });
detailOverlay.addEventListener('click', (e) => { if (e.target === detailOverlay) detailOverlay.hidden = true; });

// ===== Auth / view switching =====
function showLogin() {
  loginView.hidden = false;
  dashboardView.hidden = true;
}

function showDashboard(username) {
  loginView.hidden = true;
  dashboardView.hidden = false;
  whoamiUser.textContent = username || '';
}

async function checkSession() {
  try {
    const res = await fetch('/api/whoami');
    if (res.ok) {
      const data = await res.json();
      showDashboard(data.username);
      return;
    }
  } catch {
    /* fall through to login */
  }
  showLogin();
}

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  loginStatus.hidden = true;
  const submitBtn = loginForm.querySelector('button[type="submit"]');
  const originalLabel = submitBtn.textContent;
  submitBtn.disabled = true;
  submitBtn.textContent = 'Signing in…';

  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value;

  try {
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || data.result !== 'success') {
      throw new Error(data.error || 'Invalid username or password');
    }
    loginForm.reset();
    showDashboard(data.username);
  } catch (err) {
    loginStatus.hidden = false;
    loginStatus.textContent = err.message || 'Something went wrong. Please try again.';
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = originalLabel;
  }
});

logoutBtn.addEventListener('click', async () => {
  try {
    await fetch('/api/logout', { method: 'POST' });
  } catch {
    /* ignore network errors on logout */
  }
  registrationsTable.reset();
  leadsTable.reset();
  showLogin();
});

// ===== Tabs =====
tabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    tabs.forEach((t) => t.classList.remove('is-active'));
    tab.classList.add('is-active');
    Object.entries(panels).forEach(([key, panel]) => {
      panel.hidden = key !== tab.dataset.tab;
    });
    if (tab.dataset.tab === 'registrations') registrationsTable.ensureLoaded();
    if (tab.dataset.tab === 'leads') leadsTable.ensureLoaded();
  });
});

// ===== New Registration form =====
if (registerForm) {
  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (registerForm.website && registerForm.website.value) return; // honeypot

    const submitBtn = registerForm.querySelector('button[type="submit"]');
    const originalLabel = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Saving…';

    const formData = new FormData(registerForm);

    try {
      const res = await fetch('/api/register', { method: 'POST', body: formData });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || data.result === 'error') {
        throw new Error(data.error || 'Request failed');
      }

      registerForm.reset();
      document.getElementById('state').value = 'Karnataka';
      formStatus.hidden = false;
      formStatus.className = 'form-status success';
      formStatus.textContent = 'Registration saved. You can enter the next one below.';
      formStatus.scrollIntoView({ behavior: 'smooth', block: 'center' });

      registrationsTable.markStale();
    } catch (err) {
      formStatus.hidden = false;
      formStatus.className = 'form-status error';
      formStatus.textContent = 'Something went wrong saving this registration. Please try again.';
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = originalLabel;
    }
  });
}

// ===== Generic table controller =====
// Handles fetching a sheet's rows through /api/leads?sheet=..., then
// client-side search/sort/filter/render for that table.
function createTableController(config) {
  const {
    sheetParam,           // 'dashboard' | 'website'
    searchInput, refreshBtn, countEl, statusEl, tableEl, tableBody,
    searchGetters,        // (row) => string[]
    renderRow,             // (row, index) => tbody <tr> HTML string
    colSpan,
    defaultSortKey,
    computed,               // { [computedKey]: (row) => value } for sort keys starting with "_"
    equalityFilters,       // [{ select, field }] — field is a real row key
    populateFilter,        // optional (rows) => void, fills a <select>'s dynamic options
  } = config;

  const state = { rows: [], loaded: false, sortKey: defaultSortKey, sortDir: 'desc' };

  async function load() {
    statusEl.hidden = true;
    tableBody.innerHTML = '';
    countEl.textContent = 'Loading…';

    try {
      const res = await fetch(`/api/leads?sheet=${sheetParam}`);
      const data = await res.json().catch(() => ({}));
      if (!res.ok || data.result !== 'success') {
        throw new Error(data.error || 'Could not load registrations');
      }
      state.rows = data.rows || [];
      state.loaded = true;
      if (populateFilter) populateFilter(state.rows);
      render();
    } catch (err) {
      statusEl.hidden = false;
      statusEl.className = 'form-status error';
      statusEl.textContent = err.message || 'Could not load registrations.';
      countEl.textContent = '';
    }
  }

  function ensureLoaded() {
    if (!state.loaded) load();
  }

  function markStale() {
    state.loaded = false;
  }

  function reset() {
    state.rows = [];
    state.loaded = false;
  }

  function getFiltered() {
    const q = searchInput.value.trim().toLowerCase();
    return state.rows.filter((row) => {
      for (const { select, field } of equalityFilters) {
        if (select.value && row[field] !== select.value) return false;
      }
      if (q) {
        const haystack = searchGetters(row).join(' ').toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }

  function sortRows(rows) {
    const key = state.sortKey;
    const dir = state.sortDir === 'asc' ? 1 : -1;
    return rows.slice().sort((a, b) => {
      let av = key.startsWith('_') ? computed[key](a) : a[key];
      let bv = key.startsWith('_') ? computed[key](b) : b[key];

      if (key === 'Timestamp') {
        av = av ? new Date(av).getTime() : 0;
        bv = bv ? new Date(bv).getTime() : 0;
        return (av - bv) * dir;
      }
      av = (av || '').toString().toLowerCase();
      bv = (bv || '').toString().toLowerCase();
      if (av < bv) return -1 * dir;
      if (av > bv) return 1 * dir;
      return 0;
    });
  }

  function render() {
    const rows = sortRows(getFiltered());
    countEl.textContent = `${rows.length} of ${state.rows.length}`;

    tableEl.querySelectorAll('thead th').forEach((th) => {
      th.classList.toggle('is-sorted', th.dataset.sort === state.sortKey && state.sortDir === 'asc');
      th.classList.toggle('is-sorted-desc', th.dataset.sort === state.sortKey && state.sortDir === 'desc');
    });

    if (rows.length === 0) {
      tableBody.innerHTML = `<tr class="table-empty-row"><td colspan="${colSpan}">No registrations match your filters.</td></tr>`;
      return;
    }

    tableBody.innerHTML = rows.map((row) => renderRow(row, state.rows.indexOf(row))).join('');
  }

  tableBody.addEventListener('click', (e) => {
    const tr = e.target.closest('tr[data-index]');
    if (!tr) return;
    const row = state.rows[Number(tr.dataset.index)];
    if (row) openDetail(row);
  });

  tableEl.querySelectorAll('thead th').forEach((th) => {
    th.addEventListener('click', () => {
      const key = th.dataset.sort;
      if (state.sortKey === key) {
        state.sortDir = state.sortDir === 'asc' ? 'desc' : 'asc';
      } else {
        state.sortKey = key;
        state.sortDir = 'asc';
      }
      render();
    });
  });

  searchInput.addEventListener('input', render);
  equalityFilters.forEach(({ select }) => select.addEventListener('change', render));
  refreshBtn.addEventListener('click', load);

  return { ensureLoaded, markStale, reset };
}

// ===== "Registrations" table (dashboard's full form) =====
function computeContact(row) {
  return row['Principal Name'] || row['Coordinator Name'] || row['School Name'] || '—';
}
function computePhone(row) {
  return row['Principal Mobile Number'] || row['School Contact Number'] || row['Coordinator Mobile Number'] || '—';
}

const regFilterBoard = document.getElementById('regFilterBoard');

const registrationsTable = createTableController({
  sheetParam: 'dashboard',
  searchInput: document.getElementById('regSearchInput'),
  refreshBtn: document.getElementById('regRefreshBtn'),
  countEl: document.getElementById('regRowCount'),
  statusEl: document.getElementById('regTableStatus'),
  tableEl: document.getElementById('regTable'),
  tableBody: document.getElementById('regTableBody'),
  colSpan: 6,
  defaultSortKey: 'Timestamp',
  computed: { _contact: computeContact, _phone: computePhone },
  searchGetters: (row) => [
    computeContact(row), computePhone(row), row['District'], row['School Name'],
    row['School Email Id'], row['Principal Name'], row['Coordinator Name'], row['Message'],
  ],
  equalityFilters: [{ select: regFilterBoard, field: 'School Board' }],
  populateFilter: (rows) => {
    const boards = Array.from(new Set(rows.map((r) => r['School Board']).filter(Boolean))).sort();
    const current = regFilterBoard.value;
    regFilterBoard.innerHTML = '<option value="">All Boards</option>' +
      boards.map((b) => `<option value="${escapeHtml(b)}">${escapeHtml(b)}</option>`).join('');
    regFilterBoard.value = boards.includes(current) ? current : '';
  },
  renderRow: (row, index) => `<tr data-index="${index}">
    <td>${escapeHtml(formatDate(row['Timestamp']))}</td>
    <td>${escapeHtml(computeContact(row))}</td>
    <td>${escapeHtml(computePhone(row))}</td>
    <td>${escapeHtml(row['District'] || '—')}</td>
    <td>${escapeHtml(row['School Name'] || '—')}</td>
    <td>${escapeHtml(row['School Board'] || '—')}</td>
  </tr>`,
});

// ===== "From Website" table (quick-lead form) =====
const leadFilterCallback = document.getElementById('leadFilterCallback');

const leadsTable = createTableController({
  sheetParam: 'website',
  searchInput: document.getElementById('leadSearchInput'),
  refreshBtn: document.getElementById('leadRefreshBtn'),
  countEl: document.getElementById('leadRowCount'),
  statusEl: document.getElementById('leadTableStatus'),
  tableEl: document.getElementById('leadTable'),
  tableBody: document.getElementById('leadTableBody'),
  colSpan: 5,
  defaultSortKey: 'Timestamp',
  computed: {},
  searchGetters: (row) => [row['Name'], row['District'], row['Phone']],
  equalityFilters: [{ select: leadFilterCallback, field: 'Request Callback' }],
  renderRow: (row, index) => {
    const cbClass = row['Request Callback'] === 'Yes' ? 'badge-yes' : 'badge-no';
    return `<tr data-index="${index}">
      <td>${escapeHtml(formatDate(row['Timestamp']))}</td>
      <td>${escapeHtml(row['Name'] || '—')}</td>
      <td>${escapeHtml(row['District'] || '—')}</td>
      <td>${escapeHtml(row['Phone'] || '—')}</td>
      <td><span class="badge ${cbClass}">${escapeHtml(row['Request Callback'] || 'No')}</span></td>
    </tr>`;
  },
});

// ===== Init =====
checkSession();
