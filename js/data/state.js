const appState = {
    applications: []
};

function initializeState() {
    appState.applications = loadApplications();
}

function getApplications() {
    return appState.applications;
}

function addApplication(applicationData) {
    const newApp = {
        id: generateId(),
        timestamp: Date.now(),
        role: applicationData.role,
        type: applicationData.type,
        companyType: applicationData.companyType,
        source: applicationData.source,
        status: APP_STATUSES.APPLIED
    };

    appState.applications.push(newApp);
    saveApplications(appState.applications);
    return newApp;
}

function updateApplicationStatus(id, newStatus) {
    const app = appState.applications.find(a => a.id === id);
    if (app) {
        app.status = newStatus;
        saveApplications(appState.applications);
        return true;
    }
    return false;
}

function updateApplication(id, applicationData) {
    const app = appState.applications.find(a => a.id === id);
    if (app) {
        app.role = applicationData.role;
        app.type = applicationData.type;
        app.companyType = applicationData.companyType;
        app.source = applicationData.source;
        saveApplications(appState.applications);
        return true;
    }
    return false;
}

function deleteApplication(id) {
    const index = appState.applications.findIndex(a => a.id === id);
    if (index !== -1) {
        appState.applications.splice(index, 1);
        saveApplications(appState.applications);
        return true;
    }
    return false;
}

function getApplicationsBySource(source) {
    return appState.applications.filter(app => app.source === source);
}

function getApplicationsByType(type) {
    return appState.applications.filter(app => app.type === type);
}

function getApplicationsByRole(role) {
    return appState.applications.filter(app =>
        app.role.toLowerCase().includes(role.toLowerCase())
    );
}
