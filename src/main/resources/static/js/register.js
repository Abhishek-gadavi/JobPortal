const registerForm = document.getElementById("registerForm");
const registerButton = document.getElementById("registerButton");
const registerMessage = document.getElementById("registerMessage");
const togglePassword = document.getElementById("togglePassword");

if (togglePassword) {
    togglePassword.addEventListener("click", () => {
        const password = document.getElementById("password");
        const show = password.type === "password";
        password.type = show ? "text" : "password";
        togglePassword.innerHTML = show ? '<i class="fa-regular fa-eye-slash"></i>' : '<i class="fa-regular fa-eye"></i>';
    });
}

registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    registerMessage.textContent = "";
    registerMessage.className = "form-message";
    registerButton.disabled = true;
    registerButton.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Creating account...';

    const user = {
        name: document.getElementById("fullName").value.trim(),
        email: document.getElementById("email").value.trim(),
        phone: document.getElementById("phone").value.trim(),
        password: document.getElementById("password").value
    };

    try {
        const response = await fetch("/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(user)
        });

        const message = await response.text();
        if (!response.ok) throw new Error(message || "Registration failed.");

        registerMessage.textContent = "Account created successfully. Redirecting to sign in...";
        registerMessage.className = "form-message success";
        setTimeout(() => window.location.replace("/login.html"), 700);
    } catch (error) {
        registerMessage.textContent = error.message || "Unable to register. Please try again.";
        registerMessage.className = "form-message error";
        registerButton.disabled = false;
        registerButton.innerHTML = 'Create account <i class="fa-solid fa-arrow-right"></i>';
    }
});
