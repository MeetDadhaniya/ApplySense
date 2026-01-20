function getRoleInsights() {
    const applications = getApplications();
    const roleStats = {};

    applications.forEach(app => {
        const roleName = app.role;

        if (!roleStats[roleName]) {
            roleStats[roleName] = {
                role: roleName,
                total: 0,
                responses: 0,
                percentage: 0
            };
        }

        roleStats[roleName].total++;

        if (app.status === APP_STATUSES.RESPONSE || app.status === APP_STATUSES.INTERVIEW) {
            roleStats[roleName].responses++;
        }
    });

    Object.values(roleStats).forEach(stats => {
        if (stats.total > 0) {
            stats.percentage = calculatePercentage(stats.responses, stats.total);
        }
    });

    return Object.values(roleStats);
}

function getStrongestRole() {
    const roleInsights = getRoleInsights();

    if (roleInsights.length === 0) return null;

    const qualifiedRoles = roleInsights.filter(r => r.total >= 2);

    if (qualifiedRoles.length === 0) {
        return roleInsights.sort((a, b) => b.percentage - a.percentage)[0];
    }

    const highestPercentage = Math.max(...qualifiedRoles.map(r => r.percentage));

    if (highestPercentage === 0) {
        const mostApplied = qualifiedRoles.sort((a, b) => b.total - a.total)[0];
        mostApplied.isMostApplied = true;
        return mostApplied;
    }

    return qualifiedRoles.sort((a, b) => b.percentage - a.percentage)[0];
}
