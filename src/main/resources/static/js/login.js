const loginForm = document.getElementById("loginForm");
const loginButton = document.getElementById("loginButton");
const loginMessage = document.getElementById("loginMessage");
const togglePassword = document.getElementById("togglePassword");

if (isLoggedIn()) {
    window.location.replace(getRole() === "ADMIN" ? "/admin.html" : "/dashboard.html");
}

if (togglePassword) {
    togglePassword.addEventListener("click", () => {
        const password = document.getElementById("password");
        const show = password.type === "password";
        password.type = show ? "text" : "password";
        togglePassword.innerHTML = show ? '<i class="fa-regular fa-eye-slash"></i>' : '<i class="fa-regular fa-eye"></i>';
    });
}

loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    loginMessage.textContent = "";
    loginMessage.className = "form-message";
    loginButton.disabled = true;
    loginButton.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Signing in...';

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    try {
        const response = await fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        if (!response.ok) {
            throw new Error("Invalid email or password.");
        }

        const data = await response.json();

        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role);

        localStorage.setItem("userId", data.userId);
        localStorage.setItem("username", data.username);
        localStorage.setItem("userEmail", data.email);
        localStorage.setItem("userPhone", data.phone);

        const params = new URLSearchParams(window.location.search);
        const next = params.get("next");
        const safeNext = next && next.startsWith("/") && !next.startsWith("//") ? next : null;
        const destination = data.role === "ADMIN" ? "/admin.html" : (safeNext || "/dashboard.html");
        window.location.replace(destination);
    } catch (error) {
        loginMessage.textContent = error.message || "Unable to sign in. Please try again.";
        loginMessage.className = "form-message error";
        loginButton.disabled = false;
        loginButton.innerHTML = 'Sign in <i class="fa-solid fa-arrow-right"></i>';
    }
});
