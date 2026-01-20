function calculateResponseRateBySource() {
    const applications = getApplications();
    const sourceStats = {};

    Object.values(APP_SOURCES).forEach(source => {
        sourceStats[source] = {
            total: 0,
            responses: 0,
            percentage: 0
        };
    });

    applications.forEach(app => {
        if (sourceStats[app.source]) {
            sourceStats[app.source].total++;

            if (app.status === APP_STATUSES.RESPONSE || app.status === APP_STATUSES.INTERVIEW) {
                sourceStats[app.source].responses++;
            }
        }
    });

    Object.keys(sourceStats).forEach(source => {
        const stats = sourceStats[source];
        if (stats.total > 0) {
            stats.percentage = calculatePercentage(stats.responses, stats.total);
        }
    });

    return sourceStats;
}

function getOverallResponseRate() {
    const applications = getApplications();
    const total = applications.length;

    if (total === 0) return 0;

    const responses = applications.filter(app =>
        app.status === APP_STATUSES.RESPONSE || app.status === APP_STATUSES.INTERVIEW
    ).length;

    return calculatePercentage(responses, total);
}
