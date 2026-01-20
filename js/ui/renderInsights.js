function renderInsights() {
    const applications = getApplications();

    if (applications.length === 0) {
        hideInsights();
        return;
    }

    showInsights();
    renderResponseRateStats();
    renderStrongestRole();
    renderJobVsInternshipInsight();
    renderWarnings();
}

function hideInsights() {
    const section = document.querySelector('.insights-section');
    if (section) {
        section.style.display = 'none';
    }
}

function showInsights() {
    const section = document.querySelector('.insights-section');
    if (section) {
        section.style.display = 'block';
    }
}

function renderResponseRateStats() {
    const statsGrid = document.querySelector('.stats-grid');
    if (!statsGrid) return;

    const sourceStats = calculateResponseRateBySource();
    statsGrid.innerHTML = '';

    Object.entries(sourceStats).forEach(([source, stats]) => {
        if (stats.total === 0) return; // Skip sources with no applications

        const statItem = document.createElement('div');
        statItem.className = 'stat-item';

        const badgeClass = getBadgeClass(stats.percentage);
        const sign = stats.percentage > 0 ? '+' : '';

        statItem.innerHTML = `
      <span class="stat-label">${SOURCE_LABELS[source]}</span>
      <span class="stat-badge ${badgeClass}">${sign}${formatPercentage(stats.percentage)}% (${stats.responses}/${stats.total})</span>
    `;

        statsGrid.appendChild(statItem);
    });

    if (statsGrid.children.length === 0) {
        statsGrid.innerHTML = '<p style="color: #64748b; grid-column: 1/-1;">Add applications to see response rates</p>';
    }
}

function getBadgeClass(percentage) {
    if (percentage >= 50) return 'stat-badge-green';
    if (percentage >= 30) return 'stat-badge-blue';
    if (percentage > 0) return 'stat-badge-yellow';
    return 'stat-badge-red';
}

function renderStrongestRole() {
    const roleBlock = document.querySelector('.insight-block');
    if (!roleBlock) return;

    const strongestRole = getStrongestRole();

    if (!strongestRole) {
        roleBlock.innerHTML = `
      <h5 class="insight-heading">Your strongest role right now</h5>
      <p class="insight-text" style="color: #64748b;">Add more applications to see insights</p>
    `;
        return;
    }

    const isZeroResponse = strongestRole.isMostApplied || strongestRole.percentage === 0;
    const heading = isZeroResponse ? 'Most applied role' : 'Your strongest role right now';
    const responseText = isZeroResponse
        ? '<span class="stat-label">no responses yet</span>'
        : `<span class="stat-percentage">${formatPercentage(strongestRole.percentage)}%</span>
       <span class="stat-label">response</span>`;

    roleBlock.innerHTML = `
    <h5 class="insight-heading">${heading}</h5>
    <div class="role-insight-card">
      <div class="role-info">
        <span class="role-name">${strongestRole.role}</span>
        <span class="role-meta">${strongestRole.total} application${strongestRole.total > 1 ? 's' : ''} tracked</span>
      </div>
      <div class="role-stat-badge">
        ${responseText}
      </div>
    </div>
  `;
}

function renderJobVsInternshipInsight() {
    const insightBlocks = document.querySelectorAll('.insight-block');
    const focusBlock = insightBlocks[1];

    if (!focusBlock) return;

    const comparison = compareJobVsInternship();

    focusBlock.innerHTML = `
    <h5 class="insight-heading">Where you should focus next</h5>
    <p class="insight-text">${comparison.recommendation}</p>
  `;
}

function renderWarnings() {
    const alertContainer = document.querySelector('.alert-warning');
    if (!alertContainer) return;

    const warnings = getUnderperformingSources();

    if (warnings.length === 0) {
        alertContainer.style.display = 'none';
        return;
    }

    const warning = warnings[0];
    alertContainer.style.display = 'flex';

    const alertText = alertContainer.querySelector('.alert-text');
    if (alertText) {
        alertText.textContent = warning.message;
    }
}
