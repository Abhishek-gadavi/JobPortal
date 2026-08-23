let currentJobId = null;

if (requireLogin()) {
    document.addEventListener("DOMContentLoaded", initApplicationPage);
}

async function initApplicationPage() {

    const params = new URLSearchParams(window.location.search);
    currentJobId = params.get("jobId");

    if (!currentJobId) {

        document.getElementById("jobSummary").innerHTML = `
            <div class="empty-state">
                <h3>Job not selected</h3>
                <p>Please return to the jobs page and choose a role.</p>
            </div>
        `;

        document.getElementById("applyButton").disabled = true;

        return;
    }

    try {

        const user = await hydrateCurrentUser();

        document.getElementById("fullName").value =
            localStorage.getItem("username") ||
            user?.name ||
            "";

        document.getElementById("email").value =
            localStorage.getItem("userEmail") ||
            user?.email ||
            "";

        document.getElementById("phone").value =
            localStorage.getItem("userPhone") ||
            user?.phone ||
            "";

        await loadJobSummary();

    } catch (error) {

        showMessage(error.message, true);
    }

    document
        .getElementById("applyForm")
        .addEventListener(
            "submit",
            submitApplication
        );
}


async function loadJobSummary() {

    const response = await authFetch(
        `/api/jobs/${encodeURIComponent(currentJobId)}`
    );

    if (!response) {
        return;
    }

    if (!response.ok) {
        throw new Error(
            "Unable to load the selected job."
        );
    }

    const job = await response.json();

    const skills = String(job.skills || "")
        .split(",")
        .map(skill => skill.trim())
        .filter(Boolean);

    document.getElementById("jobSummary").innerHTML = `

        <div class="job-top">

            <div class="job-logo">
                ${escapeHtml(
                    (job.company || "J")
                        .charAt(0)
                        .toUpperCase()
                )}
            </div>

            <div>

                <h2>
                    ${escapeHtml(job.title || "Job")}
                </h2>

                <div class="job-company">
                    ${escapeHtml(job.company || "Company")}
                </div>

            </div>

        </div>

        <p>
            <b>Location:</b>
            ${escapeHtml(job.location || "Not specified")}
        </p>

        <p>
            <b>Salary:</b>
            ${escapeHtml(job.salary || "Not disclosed")}
        </p>

        <p>
            <b>Experience:</b>
            ${escapeHtml(job.experience || "Not specified")}
        </p>

        <h3>About the role</h3>

        <p>
            ${escapeHtml(
                job.description ||
                "No job description provided."
            )}
        </p>

        <div>
            ${
                skills.length
                    ? skills
                        .map(
                            skill =>
                                `<span class="skill">${escapeHtml(skill)}</span>`
                        )
                        .join("")
                    : "Skills not specified"
            }
        </div>
    `;
}


async function submitApplication(e) {

    e.preventDefault();

    const userId =
        localStorage.getItem("userId");

    const token =
        localStorage.getItem("token");

    const file =
        document.getElementById("resume")
            .files[0];

    const button =
        document.getElementById("applyButton");

    console.log("Job ID:", currentJobId);
    console.log("User ID:", userId);
    console.log("Token exists:", !!token);

    if (!userId) {

        showMessage(
            "User ID not found. Please login again.",
            true
        );

        return;
    }

    if (!token) {

        showMessage(
            "Authentication token missing. Please login again.",
            true
        );

        return;
    }

    if (!file) {

        showMessage(
            "Please upload your resume.",
            true
        );

        return;
    }


    const formData =
        new FormData();

    formData.append(
        "applicantName",
        document
            .getElementById("fullName")
            .value
            .trim()
    );

    formData.append(
        "email",
        document
            .getElementById("email")
            .value
            .trim()
    );

    formData.append(
        "phone",
        document
            .getElementById("phone")
            .value
            .trim()
    );

    formData.append(
        "resume",
        file
    );


    button.disabled = true;

    button.innerHTML =
        "Submitting...";

    showMessage("");


    try {

        const response = await authFetch(

            `/api/applications/apply/${encodeURIComponent(currentJobId)}/${encodeURIComponent(userId)}`,

            {
                method: "POST",
                body: formData
            }
        );

        if (!response) {
            return;
        }

        console.log(
            "Application status:",
            response.status
        );

        if (!response.ok) {

            const errorText =
                await response.text();

            throw new Error(
                errorText ||
                "Application could not be submitted."
            );
        }


        showMessage(
            "Application submitted successfully!",
            false,
            true
        );

        setTimeout(() => {

            window.location.replace(
                "/dashboard.html"
            );

        }, 800);


    } catch (error) {

        console.error(
            "Apply error:",
            error
        );

        showMessage(
            error.message ||
            "Unable to submit application.",
            true
        );

        button.disabled = false;

        button.innerHTML =
            "Submit Application";
    }
}


function showMessage(
    message,
    isError = false,
    isSuccess = false
) {

    const box =
        document.getElementById(
            "applyMessage"
        );

    if (!box) {
        return;
    }

    box.textContent = message;

    box.className =
        `form-message${
            isError
                ? " error"
                : isSuccess
                ? " success"
                : ""
        }`;
}