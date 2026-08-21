const registerForm =
    document.getElementById("registerForm");

registerForm.addEventListener(
    "submit",
    async function (e) {

        e.preventDefault();

        const user = {

            name: document.getElementById("fullName").value,

            email: document.getElementById("email").value,

            password: document.getElementById("password").value,

            phone: document.getElementById("phone").value
        };

        try {

            const response = await fetch(
                "/api/auth/register",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify(user)
                }
            );

            const data = await response.text();

            if (response.ok) {

                alert("Registration Successful!");

                window.location.href =
                    "/login.html";

            } else {

                alert(
                    "Registration Failed: " + data
                );
            }

        } catch (error) {

            console.error(error);

            alert(
                "Server Error. Please try again."
            );
        }
    }
);


// SHOW / HIDE PASSWORD

const togglePassword =
    document.getElementById("togglePassword");

if (togglePassword) {

    togglePassword.addEventListener(
        "click",
        function () {

            const password =
                document.getElementById("password");

            if (password.type === "password") {

                password.type = "text";
                togglePassword.innerHTML = "🙈";

            } else {

                password.type = "password";
                togglePassword.innerHTML = "👁";
            }
        }
    );
}