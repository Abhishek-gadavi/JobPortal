if (requireLogin()) {
    document.addEventListener("DOMContentLoaded", loadDashboard);
}

async function loadDashboard() {

    try {

        const userId = localStorage.getItem("userId");
        const username =
            localStorage.getItem("username") || "User";

        console.log("Dashboard User ID:", userId);

        document.getElementById("username").textContent =
            username;

        if (!userId || userId === "undefined") {
            throw new Error(
                "User information missing. Please login again."
            );
        }


        // ==========================
        // LOAD AVAILABLE JOBS
        // ==========================

        // Jobs are public
        const jobsResponse = await fetch("/api/jobs");

        if (!jobsResponse.ok) {
            throw new Error(
                "Unable to load available jobs."
            );
        }

        const jobs = await jobsResponse.json();

        console.log("Jobs:", jobs);


        // ==========================
        // LOAD USER APPLICATIONS
        // ==========================

        const appsResponse = await authFetch(
            `/api/applications/user/${encodeURIComponent(userId)}`
        );

        if (!appsResponse) {
            return;
        }

        console.log(
            "Applications API status:",
            appsResponse.status
        );

        if (!appsResponse.ok) {

            const errorText =
                await appsResponse.text();

            console.error(
                "Application API error:",
                errorText
            );

            throw new Error(
                errorText ||
                "Unable to load your applications."
            );
        }

        const applications =
            await appsResponse.json();

        console.log(
            "Applications:",
            applications
        );


        // ==========================
        // COUNTS
        // ==========================

        document.getElementById(
            "jobsCount"
        ).textContent =
            Array.isArray(jobs)
                ? jobs.length
                : 0;


        document.getElementById(
            "applicationsCount"
        ).textContent =
            Array.isArray(applications)
                ? applications.length
                : 0;


        const positiveCount =
            Array.isArray(applications)
                ? applications.filter(app => {

                    const status =
                        String(
                            app.status || ""
                        ).toLowerCase();

                    return [
                        "shortlisted",
                        "selected",
                        "accepted"
                    ].includes(status);

                }).length
                : 0;


        document.getElementById(
            "positiveCount"
        ).textContent =
            positiveCount;



        // ==========================
        // SHOW APPLICATIONS
        // ==========================

        renderApplications(
            Array.isArray(applications) ? applications : [],
            Array.isArray(jobs) ? jobs : []
        );


    } catch (error) {

        console.error(
            "Dashboard Error:",
            error
        );

        document.getElementById(
            "applicationsCount"
        ).textContent = "0";

        const table =
            document.getElementById(
                "applicationTable"
            );

        if (table) {

            table.innerHTML = `
                <tr>
                    <td colspan="4">

                        <div class="empty-state">

                            <h3>
                                Unable to load dashboard
                            </h3>

                            <p>
                                ${escapeHtml(
                                    error.message
                                )}
                            </p>

                        </div>

                    </td>
                </tr>
            `;
        }
    }
}


function renderApplications(applications, jobs) {

    const table = document.getElementById("applicationTable");

    if (!table) {
        console.error("applicationTable element not found");
        return;
    }

    console.log("Applications received:", applications);
    console.log("Jobs received:", jobs);

    if (!applications.length) {

        table.innerHTML = `
            <tr>
                <td colspan="4">

                    <div class="empty-state">

                        <h3>No applications yet</h3>

                        <p>
                            Browse jobs and submit
                            your first application.
                        </p>

                        <a
                            class="btn btn-primary btn-sm"
                            href="/jobs.html">
                            Browse jobs
                        </a>

                    </div>

                </td>
            </tr>
        `;

        return;
    }

    table.innerHTML = applications.map(app => {

        const status = app.status || "PENDING";

        // Find job ID from application
        const applicationJobId =
            app.job?.id ||
            app.jobId ||
            app.job_id;

        // Find actual job from all jobs
        const matchedJob = jobs.find(job =>
            String(job.id) === String(applicationJobId)
        );

        console.log(
            "Application jobId:",
            applicationJobId,
            "Matched Job:",
            matchedJob
        );

        const title =
            app.job?.title ||
            app.jobTitle ||
            matchedJob?.title ||
            "Job";

        const company =
            app.job?.company ||
            app.company ||
            matchedJob?.company ||
            "-";

        const location =
            app.job?.location ||
            app.location ||
            matchedJob?.location ||
            "-";

        return `
            <tr>

                <td>
                    <strong>
                        ${escapeHtml(title)}
                    </strong>
                </td>

                <td>
                    ${escapeHtml(company)}
                </td>

                <td>
                    ${escapeHtml(location)}
                </td>

                <td>
                    <span class="status ${statusClass(status)}">
                        ${escapeHtml(status)}
                    </span>
                </td>

            </tr>
        `;

    }).join("");
}