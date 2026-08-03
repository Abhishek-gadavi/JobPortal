const registerForm = document.getElementById("registerForm");

if(registerForm){
registerForm.addEventListener("submit",function(e){
e.preventDefault();
const user={
fullName:document.getElementById("fullName").value,
email:document.getElementById("email").value,
password:document.getElementById("password").value,
phone:document.getElementById("phone").value,
role:document.getElementById("role").value
};
fetch("/api/users/register",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify(user)
})
.then(res=>res.json())
.then(data=>{
alert("Registration Successful");
window.location="/login";
})
.catch(err=>{
alert("Registration Failed");
});
});
}
const loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", function (e) {

        e.preventDefault();

        const user = {
            email: document.getElementById("email").value,
            password: document.getElementById("password").value
        };

        fetch("/api/users/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(user)
        })
        .then(response => {

            if (!response.ok) {
                throw new Error("Invalid Email or Password");
            }

            return response.json();

        })
        .then(user => {

            console.log("Login Response:", user);

            localStorage.setItem("userId", user.id);
            localStorage.setItem("username", user.fullName);
            localStorage.setItem("role", user.role);

            console.log("Stored userId:", localStorage.getItem("userId"));

            alert("Login Successful");

            window.location.href = "/dashboard.html";
        })
        .catch(error => {

            alert(error.message);

        });

    });

}
const container = document.getElementById("jobContainer");

if (container) {

    fetch("http://localhost:8080/api/jobs")
        .then(response => response.json())
        .then(data => {

            data.forEach(job => {

                container.innerHTML += `
                    <div class="job-card">
                        <h2>${job.title}</h2>
                        <h3>${job.company}</h3>
                        <p>📍 ${job.location}</p>
                        <p>💰 Salary: ${job.salary}</p>
                        <p>Experience: ${job.experience}</p>
                        <p>Skills: ${job.skills}</p>
                        <p>${job.description}</p>
                        <button onclick="apply(${job.id})">
                            Apply Now
                        </button>
                    </div>
                `;

            });

        });

}
function apply(id){

    window.location="/apply.html?jobId="+id;

}
const password = document.getElementById("password");
const togglePassword = document.getElementById("togglePassword");

if (password && togglePassword) {

    togglePassword.addEventListener("click", function () {

        if (password.type === "password") {

            password.type = "text";

            this.classList.remove("fa-eye-slash");
            this.classList.add("fa-eye");

        } else {

            password.type = "password";

            this.classList.remove("fa-eye");
            this.classList.add("fa-eye-slash");

        }

    });

}