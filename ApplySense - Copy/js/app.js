document.addEventListener('DOMContentLoaded', () => {
  initializeApp();
});

function initializeApp() {
  initializeState();

  initializeForm();

  renderApplicationsList();
  renderInsights();

  setupExportButton();
  setupClearDataButton();
}

function setupExportButton() {
  // Create export button if it doesn't exist
  let exportBtn = document.getElementById('export-btn');

  if (!exportBtn) {
    const header = document.querySelector('.header');
    if (header) {
      exportBtn = document.createElement('button');
      exportBtn.id = 'export-btn';
      exportBtn.className = 'export-btn';
      exportBtn.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
          <polyline points="7 10 12 15 17 10"></polyline>
          <line x1="12" y1="15" x2="12" y2="3"></line>
        </svg>
        Export CSV
      `;
      header.appendChild(exportBtn);
    }
  }

  if (exportBtn) {
    exportBtn.addEventListener('click', () => {
      const applications = getApplications();
      exportToCSV(applications);
    });
  }
}

function setupClearDataButton() {
  window.clearAllData = function () {
    if (confirm('Are you sure you want to delete ALL applications? This cannot be undone.')) {
      clearApplications();
      initializeState();
      renderApplicationsList();
      renderInsights();
      console.log('All data cleared');
    }
  };
}

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  @keyframes slideOut {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(100%);
      opacity: 0;
    }
  }

  .application-item {
    animation: fadeInUp 0.3s ease;
  }

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .error-message {
    display: none;
    color: #ef4444;
    font-size: 14px;
    margin-top: 8px;
    transition: opacity 0.2s;
  }

  .export-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 18px;
    background: #6366f1;
    color: white;
    border: none;
    border-radius: 8px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    font-size: 14px;
  }

  .export-btn:hover {
    background: #4f46e5;
    transform: translateY(-1px);
  }

  .delete-btn {
    background: none;
    border: none;
    color: #94a3b8;
    cursor: pointer;
    padding: 8px;
    border-radius: 6px;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .delete-btn:hover {
    background: #fee2e2;
    color: #ef4444;
  }

  .edit-btn {
    background: none;
    border: none;
    color: #94a3b8;
    cursor: pointer;
    padding: 8px;
    border-radius: 6px;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .edit-btn:hover {
    background: #dbeafe;
    color: #2563eb;
  }

  .btn-secondary {
    background: #f1f5f9;
    color: #475569;
    padding: 11px 20px;
    font-size: 14px;
    font-weight: 500;
    border: 1px solid #cbd5e1;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s;
    font-family: inherit;
    margin-left: 8px;
  }

  .btn-secondary:hover {
    background: #e2e8f0;
    border-color: #94a3b8;
  }

  .btn-editing {
    background: #f59e0b;
  }

  .btn-editing:hover {
    background: #d97706;
  }

  .app-actions {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .empty-state {
    padding: 60px 20px;
    text-align: center;
  }

  .role-insight-card {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    padding: 16px 18px;
    border-radius: 8px;
    transition: all 0.2s;
  }

  .role-insight-card:hover {
    border-color: #cbd5e1;
    background: #f1f5f9;
  }

  .role-info {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .role-name {
    font-size: 15px;
    font-weight: 600;
    color: #1e293b;
  }

  .role-meta {
    font-size: 13px;
    color: #64748b;
  }

  .role-stat-badge {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 2px;
  }

  .stat-percentage {
    font-size: 24px;
    font-weight: 700;
    color: #2563eb;
    line-height: 1;
  }

  .stat-label {
    font-size: 12px;
    color: #64748b;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .stat-badge-green {
    background: #dcfce7;
    color: #16a34a;
  }

  .stat-badge-blue {
    background: #dbeafe;
    color: #2563eb;
  }

  .stat-badge-yellow {
    background: #fef3c7;
    color: #d97706;
  }

  .stat-badge-red {
    background: #fee2e2;
    color: #dc2626;
  }
`;
document.head.appendChild(style);
