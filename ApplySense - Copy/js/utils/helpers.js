function formatDate(timestamp) {
    const date = new Date(timestamp);
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

function formatPercentage(value) {
    return Math.round(value);
}

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function capitalizeWords(str) {
    return str.split(' ').map(word => capitalize(word)).join(' ');
}

function generateId() {
    return Date.now() + Math.random().toString(36).substr(2, 9);
}

function calculatePercentage(part, total) {
    if (total === 0) return 0;
    return (part / total) * 100;
}
