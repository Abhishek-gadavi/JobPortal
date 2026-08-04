// =========================
// ADMIN DASHBOARD
// =========================

window.onload = () => {
    loadDashboard();
};

// =========================
// LOAD DASHBOARD
// =========================

async function loadDashboard() {
    await loadCounts();
    await loadJobs();
    await loadApplications();
}

// =========================
// DASHBOARD COUNTS
// =========================

async function loadCounts() {

    try {

        // Jobs
        const jobsRes = await fetch("/api/jobs");
        const jobs = await jobsRes.json();

        document.getElementById("totalJobs").innerText = jobs.length;

        const companies = [...new Set(jobs.map(job => job.company))];
        document.getElementById("totalCompanies").innerText = companies.length;

        // Users
        const usersRes = await fetch("/api/users");
        const users = await usersRes.json();

        document.getElementById("totalUsers").innerText =
            Array.isArray(users) ? users.length : 0;

        // Applications
        const appRes = await fetch("/api/applications");
        const applications = await appRes.json();

        document.getElementById("totalApplications").innerText =
            applications.length;

    } catch (err) {

        console.error("Dashboard Error:", err);

    }

}

// =========================
// LOAD JOBS
// =========================

async function loadJobs() {

    try {

        const response = await fetch("/api/jobs");
        const jobs = await response.json();

        const table = document.getElementById("jobTable");
        table.innerHTML = "";

        jobs.forEach(job => {

            table.innerHTML += `
                <tr>

                    <td>${index+1}</td>

                    <td>${job.title}</td>

                    <td>${job.company}</td>

                    <td>${job.location}</td>

                    <td>${job.salary}</td>

                    <td>${job.skills || "-"}</td>

                    <td>${job.experience}</td>

                    <td>
                        <button class="editBtn"
                            onclick="editJob(${job.id})">
                            Edit
                        </button>
                    </td>

                    <td>
                        <button class="deleteBtn"
                            onclick="deleteJob(${job.id})">
                            Delete
                        </button>
                    </td>

                </tr>
            `;

        });

    } catch (err) {

        console.error("Load Jobs Error:", err);

    }

}

// =========================
// ADD JOB
// =========================

document.getElementById("jobForm").addEventListener("submit", addJob);

async function addJob(e) {

    e.preventDefault();

    const job = {

        title: document.getElementById("title").value,
        company: document.getElementById("company").value,
        location: document.getElementById("location").value,
        salary: document.getElementById("salary").value,
        skills: document.getElementById("skills").value,
        experience: document.getElementById("experience").value,
        description: document.getElementById("description").value

    };

    const response = await fetch("/api/jobs/add", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(job)

    });

    if (response.ok) {

        alert("Job Added Successfully");

        document.getElementById("jobForm").reset();

        loadDashboard();

    } else {

        alert("Failed to Add Job");

    }

}

// =========================
// DELETE JOB
// =========================

async function deleteJob(id) {

    if (!confirm("Delete this job?")) return;

    const response = await fetch("/api/jobs/" + id, {

        method: "DELETE"

    });

    if (response.ok) {

        alert("Job Deleted Successfully");

        loadDashboard();

    } else {

        alert("Unable to Delete Job");

    }

}

// =========================
// EDIT JOB
// =========================

async function editJob(id) {

    const response = await fetch("/api/jobs/" + id);

    const job = await response.json();

    document.getElementById("title").value = job.title;
    document.getElementById("company").value = job.company;
    document.getElementById("location").value = job.location;
    document.getElementById("salary").value = job.salary;
    document.getElementById("skills").value = job.skills || "";
    document.getElementById("experience").value = job.experience;
    document.getElementById("description").value = job.description;

    const form = document.getElementById("jobForm");

    form.onsubmit = async function (e) {

        e.preventDefault();

        const updatedJob = {

            title: document.getElementById("title").value,
            company: document.getElementById("company").value,
            location: document.getElementById("location").value,
            salary: document.getElementById("salary").value,
            skills: document.getElementById("skills").value,
            experience: document.getElementById("experience").value,
            description: document.getElementById("description").value

        };

        const updateResponse = await fetch("/api/jobs/" + id, {

            method: "PUT",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(updatedJob)

        });

        if (updateResponse.ok) {

            alert("Job Updated Successfully");

            form.reset();

            form.onsubmit = addJob;

            loadDashboard();

        } else {

            alert("Failed to Update Job");

        }

    };

}
// ================= LOAD APPLICATIONS =================

async function loadApplications() {

    try {

        const response = await fetch("/api/applications");

        const applications = await response.json();

        const table = document.getElementById("applicationTable");

        table.innerHTML = "";

        applications.forEach(app => {

            table.innerHTML += `
                <tr>

                    <td>${app.applicantName}</td>

                    <td>${app.email}</td>

                    <td>${app.phone}</td>

                    <td>${app.job ? app.job.title : "-"}</td>

                    <td>
                        <button class="downloadBtn"
                            onclick="downloadResume('${app.resume}')">
                            Download Resume
                        </button>
                    </td>

                    <td>

                        <select onchange="updateStatus(${app.id}, this.value)">

                            <option value="Pending"
                                ${app.status==="Pending" ? "selected" : ""}>
                                Pending
                            </option>

                            <option value="Shortlisted"
                                ${app.status==="Shortlisted" ? "selected" : ""}>
                                Shortlisted
                            </option>

                            <option value="Rejected"
                                ${app.status==="Rejected" ? "selected" : ""}>
                                Rejected
                            </option>

                            <option value="Selected"
                                ${app.status==="Selected" ? "selected" : ""}>
                                Selected
                            </option>

                        </select>

                    </td>

                </tr>
            `;

        });

    } catch (e) {

        console.error(e);

        alert("Unable to load applications");

    }

}
// ================= DOWNLOAD RESUME =================

function downloadResume(fileName) {

    if (!fileName) {

        alert("Resume not found");

        return;

    }

    window.open("/api/resume/" + fileName, "_blank");

}
// ================= UPDATE STATUS =================

async function updateStatus(id, status) {

    try {

        const response = await fetch(
            `/api/applications/${id}/status?status=${status}`,
            {
                method: "PUT"
            }
        );

        if (response.ok) {

            alert("Status Updated Successfully");

            loadApplications();

        } else {

            alert("Failed to Update Status");

        }

    } catch (e) {

        console.error(e);

        alert("Server Error");

    }

}
// ================= REFRESH =================

async function refreshDashboard() {

    await loadDashboard();

    alert("Dashboard Refreshed");

}
// ================= VIEW APPLICATIONS =================

function viewApplications() {

    document.querySelector(".table-section:last-of-type")
        .scrollIntoView({

            behavior: "smooth"

        });

}
// ================= LOGOUT =================

function logout() {

    localStorage.clear();

    window.location.href = "/login.html";

}