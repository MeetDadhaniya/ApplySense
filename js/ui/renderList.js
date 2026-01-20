function renderApplicationsList() {
  const section = document.querySelector('.applications-section');
  if (!section) return;

  const applications = getApplications();

  const existingItems = section.querySelectorAll('.application-item');
  existingItems.forEach(item => item.remove());

  if (applications.length === 0) {
    renderEmptyState(section);
    return;
  }

  const emptyState = section.querySelector('.empty-state');
  if (emptyState) emptyState.remove();

  const sortedApps = [...applications].reverse();
  sortedApps.forEach(app => {
    const appElement = createApplicationElement(app);
    section.appendChild(appElement);
  });
}

function createApplicationElement(app) {
  const div = document.createElement('div');
  div.className = 'application-item';
  div.dataset.id = app.id;

  const typeLabel = capitalizeWords(app.type);
  const companyLabel = capitalizeWords(app.companyType.replace('-', ' '));
  const sourceLabel = SOURCE_LABELS[app.source];

  div.innerHTML = `
    <div class="app-info">
      <h4 class="app-title">${app.role}</h4>
      <p class="app-meta">${typeLabel} · ${companyLabel} · ${sourceLabel}</p>
    </div>
    <div class="app-actions">
      <div class="select-wrapper select-wrapper-small">
        <select class="form-select status-select" data-id="${app.id}">
          <option value="${APP_STATUSES.APPLIED}" ${app.status === APP_STATUSES.APPLIED ? 'selected' : ''}>Applied</option>
          <option value="${APP_STATUSES.RESPONSE}" ${app.status === APP_STATUSES.RESPONSE ? 'selected' : ''}>Response</option>
          <option value="${APP_STATUSES.INTERVIEW}" ${app.status === APP_STATUSES.INTERVIEW ? 'selected' : ''}>Interview</option>
          <option value="${APP_STATUSES.REJECTED}" ${app.status === APP_STATUSES.REJECTED ? 'selected' : ''}>Rejected</option>
        </select>
      </div>
      <button class="edit-btn" data-id="${app.id}" aria-label="Edit application" title="Edit application">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
        </svg>
      </button>
      <button class="delete-btn" data-id="${app.id}" aria-label="Delete application" title="Delete application">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="3 6 5 6 21 6"></polyline>
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
        </svg>
      </button>
    </div>
  `;

  const statusSelect = div.querySelector('.status-select');
  statusSelect.addEventListener('change', handleStatusChange);

  const editBtn = div.querySelector('.edit-btn');
  editBtn.addEventListener('click', handleEdit);

  const deleteBtn = div.querySelector('.delete-btn');
  deleteBtn.addEventListener('click', handleDelete);

  return div;
}

function renderEmptyState(section) {
  const emptyDiv = document.createElement('div');
  emptyDiv.className = 'empty-state';
  emptyDiv.innerHTML = `
    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="opacity: 0.3; margin: 0 auto 16px;">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
      <polyline points="14 2 14 8 20 8"></polyline>
      <line x1="12" y1="18" x2="12" y2="12"></line>
      <line x1="9" y1="15" x2="15" y2="15"></line>
    </svg>
    <p style="color: #64748b; text-align: center; font-size: 16px;">No applications yet. Add your first application above!</p>
  `;
  section.appendChild(emptyDiv);
}

function handleStatusChange(e) {
  const id = e.target.dataset.id;
  const newStatus = e.target.value;

  updateApplicationStatus(id, newStatus);
  renderInsights();
}

function handleEdit(e) {
  const btn = e.currentTarget;
  const id = btn.dataset.id;

  editApplication(id);
}

function handleDelete(e) {
  const btn = e.currentTarget;
  const id = btn.dataset.id;

  if (confirm('Are you sure you want to delete this application?')) {
    deleteApplication(id);
    renderApplicationsList();
    renderInsights();
  }
}
