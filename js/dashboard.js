// ===== Elements =====
const loginView = document.getElementById('loginView');
const dashboardView = document.getElementById('dashboardView');
const loginForm = document.getElementById('loginForm');
const loginStatus = document.getElementById('loginStatus');
const whoamiUser = document.getElementById('whoamiUser');
const logoutBtn = document.getElementById('logoutBtn');

const tabs = document.querySelectorAll('.dash-tab');
const panels = { form: document.getElementById('formTab'), table: document.getElementById('tableTab') };

const registerForm = document.getElementById('registerForm');
const formStatus = document.getElementById('formStatus');

const searchInput = document.getElementById('searchInput');
const filterSource = document.getElementById('filterSource');
const filterCallback = document.getElementById('filterCallback');
const filterBoard = document.getElementById('filterBoard');
const refreshBtn = document.getElementById('refreshBtn');
const rowCount = document.getElementById('rowCount');
const tableStatus = document.getElementById('tableStatus');
const tableBody = document.getElementById('leadsTableBody');
const table = document.getElementById('leadsTable');

const detailOverlay = document.getElementById('detailOverlay');
const detailList = document.getElementById('detailList');
const detailClose = document.getElementById('detailClose');

// ===== State =====
let allRows = [];
let rowsLoaded = false;
let sortKey = 'Timestamp';
let sortDir = 'desc';

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
  allRows = [];
  rowsLoaded = false;
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
    if (tab.dataset.tab === 'table' && !rowsLoaded) {
      loadLeads();
    }
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

      rowsLoaded = false; // next visit to the table tab should re-fetch
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

// ===== All Registrations table =====
function computeContact(row) {
  return row['Name'] || row['Principal Name'] || row['Coordinator Name'] || row['School Name'] || '—';
}
function computePhone(row) {
  return row['Phone'] || row['Principal Mobile Number'] || row['School Contact Number'] || row['Coordinator Mobile Number'] || '—';
}

async function loadLeads() {
  tableStatus.hidden = true;
  tableBody.innerHTML = '';
  rowCount.textContent = 'Loading…';

  try {
    const res = await fetch('/api/leads');
    const data = await res.json().catch(() => ({}));
    if (!res.ok || data.result !== 'success') {
      throw new Error(data.error || 'Could not load registrations');
    }
    allRows = data.rows || [];
    rowsLoaded = true;
    populateBoardFilter();
    renderTable();
  } catch (err) {
    tableStatus.hidden = false;
    tableStatus.className = 'form-status error';
    tableStatus.textContent = err.message || 'Could not load registrations.';
    rowCount.textContent = '';
  }
}

function populateBoardFilter() {
  const boards = Array.from(new Set(allRows.map((r) => r['School Board']).filter(Boolean))).sort();
  const current = filterBoard.value;
  filterBoard.innerHTML = '<option value="">All Boards</option>' +
    boards.map((b) => `<option value="${escapeHtml(b)}">${escapeHtml(b)}</option>`).join('');
  filterBoard.value = boards.includes(current) ? current : '';
}

function getRowsFiltered() {
  const q = searchInput.value.trim().toLowerCase();
  const src = filterSource.value;
  const cb = filterCallback.value;
  const board = filterBoard.value;

  return allRows.filter((row) => {
    if (src && row['Source'] !== src) return false;
    if (cb && row['Request Callback'] !== cb) return false;
    if (board && row['School Board'] !== board) return false;
    if (q) {
      const haystack = [
        computeContact(row), computePhone(row), row['District'], row['School Name'],
        row['School Email Id'], row['Principal Name'], row['Coordinator Name'], row['Message'],
      ].join(' ').toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    return true;
  });
}

function sortRows(rows) {
  const key = sortKey;
  const dir = sortDir === 'asc' ? 1 : -1;
  return rows.slice().sort((a, b) => {
    let av, bv;
    if (key === '_contact') { av = computeContact(a); bv = computeContact(b); }
    else if (key === '_phone') { av = computePhone(a); bv = computePhone(b); }
    else { av = a[key]; bv = b[key]; }

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

function formatDate(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return String(iso);
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) +
    ' ' + d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[c]));
}

function renderTable() {
  const rows = sortRows(getRowsFiltered());
  rowCount.textContent = `${rows.length} of ${allRows.length}`;

  document.querySelectorAll('.dash-table thead th').forEach((th) => {
    th.classList.toggle('is-sorted', th.dataset.sort === sortKey && sortDir === 'asc');
    th.classList.toggle('is-sorted-desc', th.dataset.sort === sortKey && sortDir === 'desc');
  });

  if (rows.length === 0) {
    tableBody.innerHTML = '<tr class="table-empty-row"><td colspan="8">No registrations match your filters.</td></tr>';
    return;
  }

  tableBody.innerHTML = rows.map((row, i) => {
    const sourceClass = row['Source'] === 'Dashboard' ? 'badge-dashboard' : 'badge-website';
    const cbClass = row['Request Callback'] === 'Yes' ? 'badge-yes' : 'badge-no';
    return `<tr data-index="${allRows.indexOf(row)}">
      <td>${escapeHtml(formatDate(row['Timestamp']))}</td>
      <td><span class="badge ${sourceClass}">${escapeHtml(row['Source'] || '—')}</span></td>
      <td>${escapeHtml(computeContact(row))}</td>
      <td>${escapeHtml(computePhone(row))}</td>
      <td>${escapeHtml(row['District'] || '—')}</td>
      <td>${escapeHtml(row['School Name'] || '—')}</td>
      <td>${escapeHtml(row['School Board'] || '—')}</td>
      <td><span class="badge ${cbClass}">${escapeHtml(row['Request Callback'] || 'No')}</span></td>
    </tr>`;
  }).join('');
}

tableBody.addEventListener('click', (e) => {
  const tr = e.target.closest('tr[data-index]');
  if (!tr) return;
  const row = allRows[Number(tr.dataset.index)];
  if (row) openDetail(row);
});

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

table.querySelectorAll('thead th').forEach((th) => {
  th.addEventListener('click', () => {
    const key = th.dataset.sort;
    if (sortKey === key) {
      sortDir = sortDir === 'asc' ? 'desc' : 'asc';
    } else {
      sortKey = key;
      sortDir = 'asc';
    }
    renderTable();
  });
});

[searchInput, filterSource, filterCallback, filterBoard].forEach((el) => {
  el.addEventListener('input', renderTable);
  el.addEventListener('change', renderTable);
});
refreshBtn.addEventListener('click', loadLeads);

// ===== Init =====
checkSession();
