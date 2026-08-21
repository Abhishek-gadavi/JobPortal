function getToken() {
    return localStorage.getItem("token");
}

function getRole() {
    return localStorage.getItem("role");
}

function isLoggedIn() {
    return getToken() !== null;
}

function requireLogin() {

    if (!isLoggedIn()) {
        window.location.href = "/login.html";
    }
}

function requireAdmin() {

    if (!isLoggedIn()) {
        window.location.href = "/login.html";
        return;
    }

    if (getRole() !== "ADMIN") {
        alert("Access Denied! Admin only.");
        window.location.href = "/dashboard.html";
    }
}

function logout() {

    localStorage.removeItem("token");
    localStorage.removeItem("role");

    window.location.href = "/login.html";
}


/*
    Use this instead of normal fetch()
    for protected APIs.
*/
async function authFetch(url, options = {}) {

    const token = getToken();

    const headers = {
        ...options.headers,
        "Authorization": "Bearer " + token
    };

    const response = await fetch(url, {
        ...options,
        headers: headers
    });

    if (response.status === 401) {

        alert("Session expired. Please login again.");

        logout();

        return null;
    }

    if (response.status === 403) {
        alert("You are not authorized to perform this action.");
    }

    return response;
}