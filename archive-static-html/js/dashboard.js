// Mirrors ROLE_NAV in api/_auth.js — keep these two in sync.
const ROLE_NAV = {
  admin: ['home', 'form', 'registrations', 'leads', 'users', 'sync'],
  poc: ['home', 'form'],
  reader: ['home', 'registrations', 'leads'],
};
const PAGE_TITLES = {
  home: 'Home',
  form: 'New Registration',
  registrations: 'Registrations',
  leads: 'From Website',
  users: 'Users',
  sync: 'Sync to Sheets',
};

// ===== Elements =====
const loginView = document.getElementById('loginView');
const dashboardView = document.getElementById('dashboardView');
const loginForm = document.getElementById('loginForm');
const loginStatus = document.getElementById('loginStatus');
const whoamiUser = document.getElementById('whoamiUser');
const whoamiRole = document.getElementById('whoamiRole');
const logoutBtn = document.getElementById('logoutBtn');

const sidebar = document.getElementById('sidebar');
const sidebarScrim = document.getElementById('sidebarScrim');
const hamburgerBtn = document.getElementById('hamburgerBtn');
const pageTitle = document.getElementById('pageTitle');
const sidebarLinks = document.querySelectorAll('.sidebar-link');

const panels = {
  home: document.getElementById('homeTab'),
  form: document.getElementById('formTab'),
  registrations: document.getElementById('registrationsTab'),
  leads: document.getElementById('leadsTab'),
  users: document.getElementById('usersTab'),
  sync: document.getElementById('syncTab'),
};

const registerForm = document.getElementById('registerForm');
const formStatus = document.getElementById('formStatus');

const detailOverlay = document.getElementById('detailOverlay');
const detailList = document.getElementById('detailList');
const detailClose = document.getElementById('detailClose');

let currentUser = null;

// ===== Shared helpers =====
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

function showDashboard(user) {
  currentUser = user;
  loginView.hidden = true;
  dashboardView.hidden = false;
  whoamiUser.textContent = user.username || '';
  whoamiRole.textContent = user.role || '';

  const allowed = ROLE_NAV[user.role] || [];
  sidebarLinks.forEach((link) => {
    link.hidden = !allowed.includes(link.dataset.tab);
  });

  switchTab('home');
}

async function checkSession() {
  try {
    const res = await fetch('/api/whoami');
    if (res.ok) {
      const data = await res.json();
      showDashboard(data);
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
    showDashboard(data);
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
  usersLoaded = false;
  showLogin();
});

// ===== Sidebar / navigation =====
function switchTab(key) {
  sidebarLinks.forEach((link) => link.classList.toggle('is-active', link.dataset.tab === key));
  Object.entries(panels).forEach(([k, panel]) => { panel.hidden = k !== key; });
  pageTitle.textContent = PAGE_TITLES[key] || '';
  closeSidebar();

  if (key === 'home') loadHome();
  if (key === 'registrations') registrationsTable.ensureLoaded();
  if (key === 'leads') leadsTable.ensureLoaded();
  if (key === 'users') loadUsers();
}

sidebarLinks.forEach((link) => {
  link.addEventListener('click', () => switchTab(link.dataset.tab));
});

function openSidebar() {
  sidebar.classList.add('is-open');
  sidebarScrim.hidden = false;
}
function closeSidebar() {
  sidebar.classList.remove('is-open');
  sidebarScrim.hidden = true;
}
hamburgerBtn.addEventListener('click', openSidebar);
sidebarScrim.addEventListener('click', closeSidebar);

// ===== Home / analytics =====
const homeStatus = document.getElementById('homeStatus');
const homeContent = document.getElementById('homeContent');
let homeLoaded = false;

const STAT_ICONS = {
  registrations: '<path d="M6 3h6l4 4v10a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z"/><path d="M12 3v4h4"/>',
  leads: '<circle cx="10" cy="10" r="7"/><path d="M3 10h14M10 3c1.8 2 2.8 4.4 2.8 7s-1 5-2.8 7c-1.8-2-2.8-4.4-2.8-7s1-5 2.8-7Z"/>',
  callback: '<path d="M4 4h6l1.6 4-2 1.4a10 10 0 0 0 4 4l1.4-2 4 1.6v3a1 1 0 0 1-1 1C10 17 3 10 3 5a1 1 0 0 1 1-1Z"/>',
  districts: '<path d="M10 17s6-5.3 6-9.5A6 6 0 0 0 4 7.5C4 11.7 10 17 10 17Z"/><circle cx="10" cy="7.5" r="2"/>',
  students: '<circle cx="7.5" cy="6.5" r="2.5"/><path d="M2.8 16c.6-2.6 2.4-4 4.7-4s4.1 1.4 4.7 4"/><circle cx="14.5" cy="7" r="2"/><path d="M13 16c.4-1.9 1.6-3 3.2-3"/>',
};

function statCard(icon, tone, value, label) {
  return `<div class="stat-card">
    <div class="stat-card-icon ${tone}"><svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${icon}</svg></div>
    <div class="stat-card-value">${escapeHtml(value)}</div>
    <div class="stat-card-label">${escapeHtml(label)}</div>
  </div>`;
}

function miniTable(headers, rows, emptyText) {
  if (!rows.length) return `<p class="empty-note">${escapeHtml(emptyText)}</p>`;
  return `<table class="mini-table">
    <thead><tr>${headers.map((h) => `<th${h.num ? ' class="num"' : ''}>${escapeHtml(h.label)}</th>`).join('')}</tr></thead>
    <tbody>${rows.join('')}</tbody>
  </table>`;
}

async function loadHome() {
  homeStatus.hidden = true;
  homeContent.innerHTML = '<p class="empty-note">Loading…</p>';

  try {
    const res = await fetch('/api/analytics');
    const data = await res.json().catch(() => ({}));
    if (!res.ok || data.result !== 'success') {
      throw new Error(data.error || 'Could not load analytics');
    }
    homeLoaded = true;
    renderHome(data);
  } catch (err) {
    homeContent.innerHTML = '';
    homeStatus.hidden = false;
    homeStatus.className = 'form-status error';
    homeStatus.textContent = err.message || 'Could not load analytics.';
  }
}

function renderHome(data) {
  if (data.scope === 'own') {
    const rows = data.recentRegistrations.map((r) => `<tr>
      <td>${escapeHtml(formatDate(r.created_at))}</td>
      <td>${escapeHtml(r.school_name || '—')}</td>
      <td>${escapeHtml(r.district || '—')}</td>
      <td>${escapeHtml(r.board || '—')}</td>
    </tr>`);
    homeContent.innerHTML = `
      <div class="stat-grid-cards">
        ${statCard(STAT_ICONS.registrations, 'ink', data.totals.schoolRegistrations, 'Your Registrations')}
      </div>
      <div class="analytics-panel">
        <h3>Your Recent Submissions</h3>
        ${miniTable(
          [{ label: 'Date' }, { label: 'School' }, { label: 'District' }, { label: 'Board' }],
          rows,
          'No registrations submitted yet.'
        )}
      </div>`;
    return;
  }

  const boardRows = data.boardBreakdown.map((b) => `<tr><td>${escapeHtml(b.board)}</td><td class="num">${escapeHtml(b.count)}</td></tr>`);
  const districtRows = data.districtBreakdown.map((d) => `<tr><td>${escapeHtml(d.district)}</td><td class="num">${escapeHtml(d.count)}</td></tr>`);
  const recentRegRows = data.recentRegistrations.map((r) => `<tr>
    <td>${escapeHtml(formatDate(r.created_at))}</td>
    <td>${escapeHtml(r.school_name || '—')}</td>
    <td>${escapeHtml(r.district || '—')}</td>
    <td>${escapeHtml(r.board || '—')}</td>
  </tr>`);
  const recentLeadRows = data.recentLeads.map((l) => `<tr>
    <td>${escapeHtml(formatDate(l.created_at))}</td>
    <td>${escapeHtml(l.name || '—')}</td>
    <td>${escapeHtml(l.district || '—')}</td>
    <td>${l.request_callback ? '<span class="badge badge-yes">Yes</span>' : '<span class="badge badge-no">No</span>'}</td>
  </tr>`);

  homeContent.innerHTML = `
    <div class="stat-grid-cards">
      ${statCard(STAT_ICONS.registrations, 'ink', data.totals.schoolRegistrations, 'School Registrations')}
      ${statCard(STAT_ICONS.leads, 'teal', data.totals.websiteLeads, 'Website Leads')}
      ${statCard(STAT_ICONS.callback, 'gold', data.totals.callbackRequests, 'Callback Requests')}
      ${statCard(STAT_ICONS.districts, 'rose', data.totals.districts, 'Districts Covered')}
    </div>
    <div class="analytics-grid">
      <div class="analytics-panel">
        <h3>Registrations by Board</h3>
        ${miniTable([{ label: 'Board' }, { label: 'Count', num: true }], boardRows, 'No registrations yet.')}
      </div>
      <div class="analytics-panel">
        <h3>Registrations by District</h3>
        ${miniTable([{ label: 'District' }, { label: 'Count', num: true }], districtRows, 'No registrations yet.')}
      </div>
    </div>
    <div class="analytics-section-title">Recent Activity</div>
    <div class="analytics-grid">
      <div class="analytics-panel">
        <h3>Recent Registrations</h3>
        ${miniTable([{ label: 'Date' }, { label: 'School' }, { label: 'District' }, { label: 'Board' }], recentRegRows, 'No registrations yet.')}
      </div>
      <div class="analytics-panel">
        <h3>Recent Website Leads</h3>
        ${miniTable([{ label: 'Date' }, { label: 'Name' }, { label: 'District' }, { label: 'Callback' }], recentLeadRows, 'No leads yet.')}
      </div>
    </div>`;
}

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
      homeLoaded = false;
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

// ===== Generic table controller (Registrations / From Website) =====
function createTableController(config) {
  const {
    sheetParam, searchInput, refreshBtn, countEl, statusEl, tableEl, tableBody,
    searchGetters, renderRow, colSpan, defaultSortKey, computed,
    equalityFilters, populateFilter,
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

  function ensureLoaded() { if (!state.loaded) load(); }
  function markStale() { state.loaded = false; }
  function reset() { state.rows = []; state.loaded = false; }

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
      if (state.sortKey === key) { state.sortDir = state.sortDir === 'asc' ? 'desc' : 'asc'; }
      else { state.sortKey = key; state.sortDir = 'asc'; }
      render();
    });
  });

  searchInput.addEventListener('input', render);
  equalityFilters.forEach(({ select }) => select.addEventListener('change', render));
  refreshBtn.addEventListener('click', load);

  return { ensureLoaded, markStale, reset };
}

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

// ===== Users (admin only) =====
const userForm = document.getElementById('userForm');
const usersStatus = document.getElementById('usersStatus');
const usersTableBody = document.getElementById('usersTableBody');
const newUsername = document.getElementById('newUsername');
const newPassword = document.getElementById('newPassword');
const newRole = document.getElementById('newRole');
const newDistricts = document.getElementById('newDistricts');
const userFormSubmitBtn = userForm.querySelector('button[type="submit"]');

let usersLoaded = false;
let editingUsername = null;

async function loadUsers() {
  usersStatus.hidden = true;
  usersTableBody.innerHTML = '<tr class="table-empty-row"><td colspan="5">Loading…</td></tr>';
  try {
    const res = await fetch('/api/users');
    const data = await res.json().catch(() => ({}));
    if (!res.ok || data.result !== 'success') throw new Error(data.error || 'Could not load users');
    usersLoaded = true;
    renderUsers(data.users);
  } catch (err) {
    usersTableBody.innerHTML = '';
    usersStatus.hidden = false;
    usersStatus.className = 'form-status error';
    usersStatus.textContent = err.message || 'Could not load users.';
  }
}

function renderUsers(users) {
  if (!users.length) {
    usersTableBody.innerHTML = '<tr class="table-empty-row"><td colspan="5">No users yet.</td></tr>';
    return;
  }
  const roleBadge = { admin: 'badge-admin', poc: 'badge-poc', reader: 'badge-reader' };
  usersTableBody.innerHTML = users.map((u) => `<tr>
    <td>${escapeHtml(u.username)}</td>
    <td><span class="badge ${roleBadge[u.role] || ''}">${escapeHtml(u.role)}</span></td>
    <td>${u.districts && u.districts.length ? escapeHtml(u.districts.join(', ')) : '—'}</td>
    <td>${escapeHtml(formatDate(u.created_at))}</td>
    <td class="user-row-actions">
      <button type="button" class="icon-btn" data-edit="${escapeHtml(u.username)}">Edit</button>
      <button type="button" class="icon-btn danger" data-delete="${escapeHtml(u.username)}">Delete</button>
    </td>
  </tr>`).join('');

  usersTableBody.querySelectorAll('[data-edit]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const u = users.find((x) => x.username === btn.dataset.edit);
      if (!u) return;
      editingUsername = u.username;
      newUsername.value = u.username;
      newUsername.disabled = true;
      newPassword.value = '';
      newPassword.required = false;
      newPassword.placeholder = 'Leave blank to keep current password';
      newRole.value = u.role;
      newDistricts.value = (u.districts || []).join(', ');
      userFormSubmitBtn.textContent = 'Update User';
      userForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  usersTableBody.querySelectorAll('[data-delete]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      if (!confirm(`Delete user "${btn.dataset.delete}"? This cannot be undone.`)) return;
      try {
        const res = await fetch(`/api/users?username=${encodeURIComponent(btn.dataset.delete)}`, { method: 'DELETE' });
        const data = await res.json().catch(() => ({}));
        if (!res.ok || data.result !== 'success') throw new Error(data.error || 'Could not delete user');
        loadUsers();
      } catch (err) {
        usersStatus.hidden = false;
        usersStatus.className = 'form-status error';
        usersStatus.textContent = err.message || 'Could not delete user.';
      }
    });
  });
}

function resetUserForm() {
  editingUsername = null;
  userForm.reset();
  newUsername.disabled = false;
  newPassword.required = true;
  newPassword.placeholder = 'min. 6 characters';
  userFormSubmitBtn.textContent = 'Add User';
}

userForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  usersStatus.hidden = true;
  userFormSubmitBtn.disabled = true;

  const districts = newDistricts.value.split(',').map((d) => d.trim()).filter(Boolean);
  const payload = { username: newUsername.value.trim(), role: newRole.value, districts };
  if (newPassword.value) payload.password = newPassword.value;

  try {
    const res = await fetch('/api/users', {
      method: editingUsername ? 'PATCH' : 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || data.result !== 'success') throw new Error(data.error || 'Could not save user');
    resetUserForm();
    loadUsers();
  } catch (err) {
    usersStatus.hidden = false;
    usersStatus.className = 'form-status error';
    usersStatus.textContent = err.message || 'Could not save user.';
  } finally {
    userFormSubmitBtn.disabled = false;
  }
});

// ===== Sync to Sheets (admin only) =====
const syncBtn = document.getElementById('syncBtn');
const syncStatus = document.getElementById('syncStatus');

syncBtn.addEventListener('click', async () => {
  syncStatus.hidden = true;
  syncBtn.disabled = true;
  const originalLabel = syncBtn.textContent;
  syncBtn.textContent = 'Syncing…';

  try {
    const res = await fetch('/api/sync-sheets', { method: 'POST' });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || data.result !== 'success') throw new Error(data.error || 'Sync failed');
    syncStatus.hidden = false;
    syncStatus.className = 'form-status success';
    syncStatus.textContent = `Synced — ${data.websiteRows} website leads, ${data.dashboardRows} school registrations.`;
  } catch (err) {
    syncStatus.hidden = false;
    syncStatus.className = 'form-status error';
    syncStatus.textContent = err.message || 'Sync failed.';
  } finally {
    syncBtn.disabled = false;
    syncBtn.textContent = originalLabel;
  }
});

// ===== Init =====
checkSession();
