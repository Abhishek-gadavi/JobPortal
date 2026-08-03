const API_URL = "http://localhost:8080/api/jobs";

let allJobs = [];

// Load jobs when page opens
window.onload = function () {
    loadJobs();
};

// Fetch all jobs
function loadJobs() {

    fetch(API_URL)
        .then(response => {

            if (!response.ok) {
                throw new Error("Failed to load jobs");
            }

            return response.json();
        })
        .then(data => {

            allJobs = data;
            displayJobs(allJobs);

        })
        .catch(error => {

            console.error("Error:", error);

            document.getElementById("jobsContainer").innerHTML =
                "<h2 style='text-align:center;color:red;'>Unable to load jobs.</h2>";
        });

}


// Display jobs
function displayJobs(jobs) {

    const jobsContainer = document.getElementById("jobsContainer");

    jobsContainer.innerHTML = "";

    if (jobs.length === 0) {

        jobsContainer.innerHTML =
            "<h2 style='text-align:center;'>No Jobs Available</h2>";

        return;
    }

    jobs.forEach(job => {

        jobsContainer.innerHTML += `

        <div class="job-card">

            <h2>${job.title}</h2>

            <div class="company">${job.company}</div>

            <div class="info">
                 <b>Location:</b> ${job.location}
            </div>

            <div class="info">
                 <b>Salary:</b> ₹${job.salary}
            </div>

            <div class="info">
                 <b>Experience:</b> ${job.experience}
            </div>

            <div class="skills">
                <b>Skills:</b>
                ${job.skills ? job.skills : "Not Specified"}
            </div>

            <div class="description">
                <b>Job Description</b>
                <br><br>
                ${job.description}
            </div>

            <button
                class="apply-btn"
                onclick="applyJob(${job.id})">

                Apply Now

            </button>

        </div>

        `;

    });

}


// Search jobs
function searchJobs() {

    const keyword = document
        .getElementById("searchJob")
        .value
        .toLowerCase()
        .trim();

    const filteredJobs = allJobs.filter(job =>

        job.title &&
        job.title.toLowerCase().includes(keyword)

    );

    displayJobs(filteredJobs);

}


// Apply Job
function applyJob(jobId) {

    window.location.href =
        "apply.html?jobId=" + jobId;

}