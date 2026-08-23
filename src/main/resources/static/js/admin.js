let editingJobId = null;

if (requireAdmin()) {
    document.addEventListener("DOMContentLoaded", () => {
        document.getElementById("jobForm").addEventListener("submit", saveJob);
        document.getElementById("cancelEditButton").addEventListener("click", resetJobForm);
        loadDashboard();
    });
}

async function loadDashboard() {
    await Promise.all([loadJobs(), loadApplications(), loadCounts()]);
}

async function loadCounts() {
    try {
        const [jobsRes, usersRes, appsRes] = await Promise.all([
            authFetch("/api/jobs"),
            authFetch("/api/users"),
            authFetch("/api/applications")
        ]);
        if (!jobsRes || !usersRes || !appsRes) return;
        const [jobs, users, applications] = await Promise.all([jobsRes.json(), usersRes.json(), appsRes.json()]);
        document.getElementById("totalJobs").textContent = Array.isArray(jobs) ? jobs.length : 0;
        document.getElementById("totalUsers").textContent = Array.isArray(users) ? users.length : 0;
        document.getElementById("totalApplications").textContent = Array.isArray(applications) ? applications.length : 0;
        document.getElementById("totalCompanies").textContent = Array.isArray(jobs) ? new Set(jobs.map(job => job.company).filter(Boolean)).size : 0;
    } catch (error) {
        showAdminMessage(error.message, true);
    }
}

async function loadJobs() {
    const table = document.getElementById("jobTable");
    try {
        const response = await authFetch("/api/jobs");
        if (!response) return;
        if (!response.ok) throw new Error("Unable to load jobs.");
        const jobs = await response.json();
        if (!jobs.length) {
            table.innerHTML = '<tr><td colspan="6">No jobs have been added yet.</td></tr>';
            return;
        }
        table.innerHTML = jobs.map((job, index) => `<tr>
            <td>${index + 1}</td>
            <td><strong>${escapeHtml(job.title || "-")}</strong></td>
            <td>${escapeHtml(job.company || "-")}</td>
            <td>${escapeHtml(job.location || "-")}</td>
            <td>${escapeHtml(job.experience || "-")}</td>
            <td><div class="action-row"><button class="btn btn-secondary btn-sm" onclick="editJob(${Number(job.id)})"><i class="fa-solid fa-pen"></i> Edit</button><button class="btn btn-danger btn-sm" onclick="deleteJob(${Number(job.id)})"><i class="fa-solid fa-trash"></i> Delete</button></div></td>
        </tr>`).join("");
    } catch (error) {
        table.innerHTML = `<tr><td colspan="6">${escapeHtml(error.message)}</td></tr>`;
    }
}

async function saveJob(e) {
    e.preventDefault();
    const job = {
        title: document.getElementById("title").value.trim(),
        company: document.getElementById("company").value.trim(),
        location: document.getElementById("location").value.trim(),
        salary: document.getElementById("salary").value.trim(),
        experience: document.getElementById("experience").value.trim(),
        skills: document.getElementById("skills").value.trim(),
        description: document.getElementById("description").value.trim()
    };

    try {
        const response = await authFetch(editingJobId ? `/api/jobs/${editingJobId}` : "/api/jobs/add", {
            method: editingJobId ? "PUT" : "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(job)
        });
        if (!response) return;
        if (!response.ok) throw new Error(editingJobId ? "Failed to update job." : "Failed to add job.");
        showAdminMessage(editingJobId ? "Job updated successfully." : "Job added successfully.", false);
        resetJobForm();
        await loadDashboard();
    } catch (error) {
        showAdminMessage(error.message, true);
    }
}

async function editJob(id) {
    try {
        const response = await authFetch(`/api/jobs/${id}`);
        if (!response) return;
        if (!response.ok) throw new Error("Unable to load this job.");
        const job = await response.json();
        editingJobId = id;
        ["title", "company", "location", "salary", "experience", "skills", "description"].forEach(key => {
            document.getElementById(key).value = job[key] || "";
        });
        document.getElementById("formTitle").textContent = "Edit job";
        document.getElementById("formSubtitle").textContent = "Update the selected opportunity.";
        document.getElementById("saveJobButton").textContent = "Save changes";
        document.getElementById("cancelEditButton").classList.remove("hidden");
        window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
        showAdminMessage(error.message, true);
    }
}

function resetJobForm() {
    editingJobId = null;
    document.getElementById("jobForm").reset();
    document.getElementById("formTitle").textContent = "Add a job";
    document.getElementById("formSubtitle").textContent = "Publish a new opportunity.";
    document.getElementById("saveJobButton").textContent = "Add job";
    document.getElementById("cancelEditButton").classList.add("hidden");
}

async function deleteJob(id) {
    if (!confirm("Delete this job listing?")) return;
    try {
        const response = await authFetch(`/api/jobs/${id}`, { method: "DELETE" });
        if (!response) return;
        if (!response.ok) throw new Error("Unable to delete job.");
        showAdminMessage("Job deleted successfully.", false);
        await loadDashboard();
    } catch (error) {
        showAdminMessage(error.message, true);
    }
}

async function loadApplications() {
    const table = document.getElementById("applicationTable");
    try {
        const response = await authFetch("/api/applications");
        if (!response) return;
        if (!response.ok) throw new Error("Unable to load applications.");
        const applications = await response.json();
        if (!applications.length) {
            table.innerHTML = '<tr><td colspan="5">No applications received yet.</td></tr>';
            return;
        }
        table.innerHTML = applications.map(app => `<tr>
            <td><strong>${escapeHtml(app.applicantName || "-")}</strong><div class="muted">${escapeHtml(app.email || "-")}</div></td>
            <td>${escapeHtml(app.job?.title || "-")}<div class="muted">${escapeHtml(app.job?.company || "-")}</div></td>
            <td>${escapeHtml(app.phone || "-")}</td>
            <td><button class="btn btn-secondary btn-sm" onclick="downloadResume('${encodeURIComponent(app.resume || "")}')"><i class="fa-solid fa-download"></i> Resume</button></td>
            <td><select class="status-select" onchange="updateStatus(${Number(app.id)}, this.value)">
                ${["Pending", "Shortlisted", "Rejected", "Selected"].map(status => `<option value="${status}" ${app.status === status ? "selected" : ""}>${status}</option>`).join("")}
            </select></td>
        </tr>`).join("");
    } catch (error) {
        table.innerHTML = `<tr><td colspan="5">${escapeHtml(error.message)}</td></tr>`;
    }
}

async function updateStatus(id, status) {
    try {
        const response = await authFetch(`/api/applications/${id}/status?status=${encodeURIComponent(status)}`, { method: "PUT" });
        if (!response) return;
        if (!response.ok) throw new Error("Unable to update status.");
        showAdminMessage("Application status updated.", false);
        await loadCounts();
    } catch (error) {
        showAdminMessage(error.message, true);
        await loadApplications();
    }
}

async function downloadResume(encodedFileName) {
    if (!encodedFileName) {
        showAdminMessage("Resume file is not available.", true);
        return;
    }
    try {
        const response = await authFetch(`/api/resume/${encodedFileName}`);
        if (!response) return;
        if (!response.ok) throw new Error("Unable to download resume.");
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = decodeURIComponent(encodedFileName);
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(url);
    } catch (error) {
        showAdminMessage(error.message, true);
    }
}

function showAdminMessage(message, isError) {
    const box = document.getElementById("adminMessage");
    box.textContent = message;
    box.className = `form-message ${isError ? "error" : "success"}`;
}
