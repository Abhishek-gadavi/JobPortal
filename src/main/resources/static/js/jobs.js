let allJobs = [];

if (requireLogin()) {
    document.addEventListener("DOMContentLoaded", initJobs);
}

async function initJobs() {

    document
        .getElementById("searchJob")
        .addEventListener("input", filterJobs);

    document
        .getElementById("searchLocation")
        .addEventListener("input", filterJobs);

    document
        .getElementById("clearFilters")
        .addEventListener("click", () => {

            document.getElementById("searchJob").value = "";
            document.getElementById("searchLocation").value = "";

            filterJobs();
        });

    await loadJobs();
}

async function loadJobs() {

    const container =
        document.getElementById("jobsContainer");

    try {

        // IMPORTANT: authFetch sends JWT
        const response = await fetch("/api/jobs");
        if (!response) {
            return;
        }

        if (!response.ok) {
            throw new Error(
                "Unable to load jobs. Status: " + response.status
            );
        }

        allJobs = await response.json();

        console.log("Jobs:", allJobs);

        filterJobs();

    } catch (error) {

        console.error("Job loading error:", error);

        container.innerHTML = `
            <div class="empty-state">
                <h3>Unable to load jobs</h3>
                <p>${escapeHtml(error.message)}</p>
            </div>
        `;
    }
}

function filterJobs() {

    const keyword = document
        .getElementById("searchJob")
        .value
        .toLowerCase()
        .trim();

    const location = document
        .getElementById("searchLocation")
        .value
        .toLowerCase()
        .trim();

    const filtered = allJobs.filter(job => {

        const data = `
            ${job.title || ""}
            ${job.company || ""}
            ${job.skills || ""}
        `.toLowerCase();

        return (
            data.includes(keyword) &&
            String(job.location || "")
                .toLowerCase()
                .includes(location)
        );
    });

    document.getElementById("jobsSummary").textContent =
        `${filtered.length} opportunities found`;

    displayJobs(filtered);
}

function displayJobs(jobs) {

    const container =
        document.getElementById("jobsContainer");

    if (jobs.length === 0) {

        container.innerHTML = `
            <div class="empty-state">
                <h3>No Jobs Available</h3>
            </div>
        `;

        return;
    }

    container.innerHTML = jobs.map(job => `

        <article class="job-card">

            <h2>${escapeHtml(job.title)}</h2>

            <h3>
                ${escapeHtml(job.company)}
            </h3>

            <p>
                <b>Location:</b>
                ${escapeHtml(job.location)}
            </p>

            <p>
                <b>Salary:</b>
                ₹${escapeHtml(job.salary)}
            </p>

            <p>
                <b>Experience:</b>
                ${escapeHtml(job.experience)}
            </p>

            <p>
                <b>Skills:</b>
                ${escapeHtml(job.skills || "Not specified")}
            </p>

            <p>
                ${escapeHtml(job.description || "")}
            </p>

            <button
                class="btn btn-primary"
                onclick="applyJob(${Number(job.id)})">

                Apply Now

            </button>

        </article>

    `).join("");
}

function applyJob(jobId) {

    window.location.href =
        `/apply.html?jobId=${jobId}`;
}