const modal = document.getElementById("loginModal");
const loginView = document.getElementById("loginView");
const registerView = document.getElementById("registerView");
const forgotView = document.getElementById("forgotView");

export const showLogin = () => {
    if (!loginView || !registerView || !forgotView) return;

    loginView.style.display = "block";
    registerView.style.display = "none";
    forgotView.style.display = "none";
};

export const showRegister = () => {
    if (!loginView || !registerView || !forgotView) return;

    loginView.style.display = "none";
    registerView.style.display = "block";
    forgotView.style.display = "none";
};

export const showForgot = () => {
    if (!loginView || !registerView || !forgotView) return;

    loginView.style.display = "none";
    registerView.style.display = "none";
    forgotView.style.display = "block";
};

export const openModal = () => {
    if (modal) {
        modal.style.display = "flex";
    }
    showLogin();
};

export const closeModal = () => {
    if (modal) {
        modal.style.display = "none";
    }
};

export const registerModalEvents = () => {
    const loginButton = document.getElementById("loginBtn");

    if (loginButton) {
        loginButton.addEventListener("click", () => {
            openModal();
            showLogin();
        });
    }

    window.addEventListener("click", (event) => {
        if (event.target === modal) {
            closeModal();
        }
    });

    document.querySelectorAll("form").forEach((form) => {
        form.addEventListener("submit", (event) => event.preventDefault());
    });
};
