let editingApplicationId = null;

function initializeForm() {
    const form = document.querySelector('.application-form');
    const errorMessage = document.querySelector('.error-message');

    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        handleFormSubmit(form, errorMessage);
    });
}

function handleFormSubmit(form, errorMessage) {
    // Get form values
    const type = document.getElementById('app-type').value;
    const role = document.getElementById('role').value.trim();
    const companyType = document.getElementById('company-type').value;
    const source = document.getElementById('app-source').value;

    // Validate all fields
    if (!type || !role || !companyType || !source) {
        showError(errorMessage);
        return;
    }

    hideError(errorMessage);

    if (editingApplicationId) {
        // Update existing application
        updateApplication(editingApplicationId, {
            type,
            role,
            companyType,
            source
        });
        cancelEdit();
        showSuccessFeedback('✓ Application updated successfully');
    } else {
        // Add new application
        addApplication({
            type,
            role,
            companyType,
            source
        });
        showSuccessFeedback('✓ Application added successfully');
    }

    // Clear form
    form.reset();

    // Update UI
    renderApplicationsList();
    renderInsights();
}

function editApplication(id) {
    const applications = getApplications();
    const app = applications.find(a => a.id === id);

    if (!app) return;

    // Populate form
    document.getElementById('app-type').value = app.type;
    document.getElementById('role').value = app.role;
    document.getElementById('company-type').value = app.companyType;
    document.getElementById('app-source').value = app.source;

    // Set edit mode
    editingApplicationId = id;

    // Change button text
    const submitBtn = document.querySelector('.btn-primary');
    if (submitBtn) {
        submitBtn.textContent = 'Update Application';
        submitBtn.classList.add('btn-editing');
    }

    // Show cancel button
    showCancelButton();

    // Scroll to form
    document.querySelector('.form-card').scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}

function cancelEdit() {
    editingApplicationId = null;

    // Reset button text
    const submitBtn = document.querySelector('.btn-primary');
    if (submitBtn) {
        submitBtn.textContent = 'Add Application';
        submitBtn.classList.remove('btn-editing');
    }

    // Hide cancel button
    hideCancelButton();

    // Clear form
    document.querySelector('.application-form').reset();
}

function showCancelButton() {
    let cancelBtn = document.getElementById('cancel-edit-btn');

    if (!cancelBtn) {
        cancelBtn = document.createElement('button');
        cancelBtn.id = 'cancel-edit-btn';
        cancelBtn.type = 'button';
        cancelBtn.className = 'btn btn-secondary';
        cancelBtn.textContent = 'Cancel';
        cancelBtn.onclick = cancelEdit;

        const submitBtn = document.querySelector('.btn-primary');
        submitBtn.parentNode.insertBefore(cancelBtn, submitBtn.nextSibling);
    }

    cancelBtn.style.display = 'inline-block';
}

function hideCancelButton() {
    const cancelBtn = document.getElementById('cancel-edit-btn');
    if (cancelBtn) {
        cancelBtn.style.display = 'none';
    }
}

function showError(errorElement) {
    if (errorElement) {
        errorElement.style.display = 'block';
        errorElement.style.opacity = '1';
    }
}

function hideError(errorElement) {
    if (errorElement) {
        errorElement.style.display = 'none';
        errorElement.style.opacity = '0';
    }
}

function showSuccessFeedback(message = '✓ Application added successfully') {
    // Create a temporary success message
    const successMsg = document.createElement('div');
    successMsg.className = 'success-message';
    successMsg.textContent = message;
    successMsg.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #10b981;
    color: white;
    padding: 12px 24px;
    border-radius: 8px;
    font-weight: 500;
    z-index: 1000;
    animation: slideIn 0.3s ease;
  `;

    document.body.appendChild(successMsg);

    setTimeout(() => {
        successMsg.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => successMsg.remove(), 300);
    }, 2000);
}
