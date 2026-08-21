const loginForm =
    document.getElementById("loginForm");

loginForm.addEventListener(
    "submit",
    async function (e) {

        e.preventDefault();

        const email =
            document.getElementById("email").value;

        const password =
            document.getElementById("password").value;

        try {

            const response = await fetch(
                "/api/auth/login",
                {

                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        email: email,
                        password: password
                    })
                }
            );

            if (!response.ok) {

                alert(
                    "Invalid email or password"
                );

                return;
            }

            const data =
                await response.json();

            // SAVE JWT
            localStorage.setItem(
                "token",
                data.token
            );

            // SAVE ROLE
            localStorage.setItem(
                "role",
                data.role
            );

            console.log(
                "JWT saved successfully"
            );

            if (data.role === "ADMIN") {

                window.location.href =
                    "/admin.html";

            } else {

                window.location.href =
                    "/dashboard.html";
            }

        } catch (error) {

            console.error(error);

            alert(
                "Server error. Please try again."
            );
        }
    }
);