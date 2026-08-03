window.onload = function () {
    loadDashboard();
};

async function loadDashboard() {

    const userId = localStorage.getItem("userId");

    // Load Jobs Count
    const jobs = await fetch("/api/jobs");
    const jobsData = await jobs.json();

    document.getElementById("jobsCount").innerText = jobsData.length;

    // Load User Applications
    const response = await fetch("/api/applications/user/" + userId);

    const appData = await response.json();

    document.getElementById("applicationsCount").innerText = appData.length;

    let table = document.getElementById("applicationTable");

    table.innerHTML = "";

    appData.forEach(app => {

        table.innerHTML += `
            <tr>
                <td>${app.job.title}</td>
                <td>${app.job.company}</td>
                <td>Applied</td>
            </tr>
        `;

    });

    document.getElementById("username").innerText =
        localStorage.getItem("username");
}

function logout() {
    localStorage.clear();
    window.location.href = "login.html";
}