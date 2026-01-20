function getUnderperformingSources() {
    const sourceStats = calculateResponseRateBySource();
    const warnings = [];

    Object.entries(sourceStats).forEach(([source, stats]) => {
        if (stats.total >= 4 && stats.percentage === 0) {
            warnings.push({
                source: source,
                sourceName: SOURCE_LABELS[source],
                total: stats.total,
                message: `Stop applying via ${SOURCE_LABELS[source]} (0% response after ${stats.total} applications)`
            });
        }
    });

    return warnings;
}

function compareJobVsInternship() {
    const jobs = getApplicationsByType(APP_TYPES.JOB);
    const internships = getApplicationsByType(APP_TYPES.INTERNSHIP);

    const jobResponses = jobs.filter(app =>
        app.status === APP_STATUSES.RESPONSE || app.status === APP_STATUSES.INTERVIEW
    ).length;

    const internshipResponses = internships.filter(app =>
        app.status === APP_STATUSES.RESPONSE || app.status === APP_STATUSES.INTERVIEW
    ).length;

    const jobRate = calculatePercentage(jobResponses, jobs.length);
    const internshipRate = calculatePercentage(internshipResponses, internships.length);

    return {
        jobs: {
            total: jobs.length,
            responses: jobResponses,
            percentage: jobRate
        },
        internships: {
            total: internships.length,
            responses: internshipResponses,
            percentage: internshipRate
        },
        recommendation: getRecommendation(jobRate, internshipRate, jobs.length, internships.length)
    };
}

function getRecommendation(jobRate, internshipRate, jobCount, internshipCount) {
    if (jobCount < 3 || internshipCount < 3) {
        return 'Track more applications to get insights';
    }

    if (internshipRate > jobRate + 10) {
        return 'Internships receive more responses than jobs';
    } else if (jobRate > internshipRate + 10) {
        return 'Jobs receive more responses than internships';
    } else {
        return 'Similar response rates for jobs and internships';
    }
}
