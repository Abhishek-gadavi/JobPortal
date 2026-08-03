console.log("apply.js loaded");

document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM Loaded");

    const applyForm = document.getElementById("applyForm");
    console.log("Form:", applyForm);

    applyForm.addEventListener("submit", (e) => {
        e.preventDefault();
        alert("Submit intercepted");
        console.log("Submit intercepted");
    });
});


const applyForm = document.getElementById("applyForm");

if (applyForm) {

    applyForm.addEventListener("submit", async function (e) {

        e.preventDefault();

        const params = new URLSearchParams(window.location.search);

        const jobId = params.get("jobId");
        const userId = localStorage.getItem("userId");

        const resumeFile = document.getElementById("resume").files[0];

        if (!resumeFile) {
            alert("Please upload your resume.");
            return;
        }

        const formData = new FormData();

        formData.append("applicantName", document.getElementById("fullName").value);
        formData.append("email", document.getElementById("email").value);
        formData.append("phone", document.getElementById("phone").value);
        formData.append("resume", resumeFile);

        try {

            const response = await fetch(`/api/applications/apply/${jobId}/${userId}`, {
                method: "POST",
                body: formData
            });

            if (response.ok) {

                alert("Application Submitted Successfully");

                window.location.href = "/dashboard.html";

            } else {

                const error = await response.text();
                alert("Application Failed\n" + error);

            }

        } catch (error) {

            console.error(error);
            alert("Server Error");

        }

    });

}