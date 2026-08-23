function getToken() {
    return localStorage.getItem("token");
}

function getRole() {
    return localStorage.getItem("role");
}

function isLoggedIn() {
    return Boolean(getToken());
}

function requireLogin() {
    if (!isLoggedIn()) {
        const next = encodeURIComponent(
            window.location.pathname + window.location.search
        );

        window.location.replace(
            `/login.html?next=${next}`
        );

        return false;
    }

    return true;
}

function requireAdmin() {
    if (!requireLogin()) {
        return false;
    }

    if (getRole() !== "ADMIN") {
        window.location.replace("/dashboard.html");
        return false;
    }

    return true;
}

function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
    localStorage.removeItem("username");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userPhone");

    window.location.replace("/login.html");
}

async function authFetch(url, options = {}) {
    const token = getToken();

    if (!token) {
        logout();
        return null;
    }

    const headers = new Headers(options.headers || {});

    headers.set(
        "Authorization",
        `Bearer ${token}`
    );

    const response = await fetch(url, {
        ...options,
        headers
    });

    if (response.status === 401) {
        logout();
        return null;
    }

    if (response.status === 403) {
        throw new Error(
            "You are not authorized to perform this action."
        );
    }

    return response;
}

async function hydrateCurrentUser() {
    const userId = localStorage.getItem("userId");
    const username = localStorage.getItem("username");
    const email = localStorage.getItem("userEmail");
    const phone = localStorage.getItem("userPhone");

    if (!userId) {
        return null;
    }

    return {
        id: userId,
        name: username || "User",
        email: email || "",
        phone: phone || ""
    };
}

function escapeHtml(value) {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function statusClass(status) {
    const normalized =
        String(status || "PENDING").toLowerCase();

    if (normalized === "selected") {
        return "status-selected";
    }

    if (normalized === "shortlisted") {
        return "status-shortlisted";
    }

    if (normalized === "rejected") {
        return "status-rejected";
    }

    if (normalized === "accepted") {
        return "status-selected";
    }

    return "status-pending";
}