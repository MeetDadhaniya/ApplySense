function saveApplications(applications) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(applications));
        return true;
    } catch (error) {
        console.error('Error saving to localStorage:', error);
        return false;
    }
}

function loadApplications() {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error('Error loading from localStorage:', error);
        return [];
    }
}

function clearApplications() {
    try {
        localStorage.removeItem(STORAGE_KEY);
        return true;
    } catch (error) {
        console.error('Error clearing localStorage:', error);
        return false;
    }
}

function exportToCSV(applications) {
    if (!applications || applications.length === 0) {
        alert('No applications to export');
        return;
    }

    const headers = ['Date Added', 'Role', 'Type', 'Company Type', 'Source', 'Status'];

    const rows = applications.map(app => [
        formatDate(app.timestamp),
        app.role,
        capitalizeWords(app.type),
        capitalizeWords(app.companyType.replace('-', ' ')),
        SOURCE_LABELS[app.source],
        capitalizeWords(app.status)
    ]);

    const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', `applysense_applications_${Date.now()}.csv`);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
