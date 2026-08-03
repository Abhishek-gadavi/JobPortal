const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", async function (event) {

    event.preventDefault();

    const user = {
        email: document.getElementById("email").value,
        password: document.getElementById("password").value
    };

    try {

        const response = await fetch("/api/users/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(user)
        });

        if (response.ok) {

            const data = await response.json();

            alert("Login Successful");

            localStorage.setItem("user", JSON.stringify(data));
            localStorage.setItem("userId", data.id);
            localStorage.setItem("username", data.fullName);
            localStorage.setItem("role", data.role);

            if (data.role === "ADMIN") {
                window.location.href = "admin.html";
            } else {
                window.location.href = "dashboard.html";
            }
        } else {

            const message = await response.text();
            alert(message);

        }

    } catch (error) {

        console.log(error);
        alert("Server error. Please try again.");

    }

});

const togglePassword = document.getElementById("togglePassword");
const password = document.getElementById("password");

togglePassword.addEventListener("click", function () {

    if (password.type === "password") {

        password.type = "text";
        togglePassword.classList.replace("fa-eye", "fa-eye-slash");

    } else {

        password.type = "password";
        togglePassword.classList.replace("fa-eye-slash", "fa-eye");

    }

});