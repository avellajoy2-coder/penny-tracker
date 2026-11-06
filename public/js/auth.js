
const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");

// LOGIN
if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const message = document.getElementById("message");

        try {
            const response = await fetch("/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: document.getElementById("email").value,
                    password: document.getElementById("password").value
                })
            });

            const data = await response.json();
            message.textContent = data.message;

            if (response.ok) {
                window.location.href = "/dashboard.html";
            }
        } catch (error) {
            message.textContent = "Unable to connect to server.";
        }
    });
}

// REGISTER
if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const message = document.getElementById("message");

        try {
            const response = await fetch("/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name: document.getElementById("name").value,
                    email: document.getElementById("email").value,
                    password: document.getElementById("password").value
                })
            });

            const data = await response.json();
            message.textContent = data.message;

            if (response.ok) {
                window.location.href = "/dashboard.html";
            }
        } catch (error) {
            message.textContent = "Unable to connect to server.";
        }
    });
}
