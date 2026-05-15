const modal = document.getElementById("loginModal");
const loginView = document.getElementById("loginView");
const registerView = document.getElementById("registerView");
const forgotView = document.getElementById("forgotView");
const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");
const forgotForm = document.getElementById("forgotForm");
let scrollLockTop = 0;

export const lockBodyScroll = () => {
    scrollLockTop = window.pageYOffset || document.documentElement.scrollTop || 0;
    document.body.style.top = `-${scrollLockTop}px`;
    document.body.classList.add("scroll-locked");
};

export const unlockBodyScroll = () => {
    document.body.classList.remove("scroll-locked");
    document.body.style.top = "";
    window.scrollTo(0, scrollLockTop);
};

const handleEscapeClose = (event) => {
    if (event.key === "Escape") {
        closeModal();
    }
};

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
    lockBodyScroll();
    document.addEventListener("keydown", handleEscapeClose);
    showLogin();
};

export const closeModal = () => {
    if (modal) {
        modal.style.display = "none";
    }
    unlockBodyScroll();
    document.removeEventListener("keydown", handleEscapeClose);
};

export const registerModalEvents = () => {
    const loginButton = document.getElementById("loginBtn");
    const registerLink = document.getElementById("showRegisterLink");
    const forgotLink = document.getElementById("showForgotLink");
    const loginLink = document.getElementById("showLoginLink");
    const loginFromForgotLink = document.getElementById("showLoginFromForgotLink");

    if (loginButton) {
        loginButton.addEventListener("click", () => {
            openModal();
            showLogin();
        });
    }

    if (registerLink) {
        registerLink.addEventListener("click", (event) => {
            event.preventDefault();
            showRegister();
        });
    }

    if (forgotLink) {
        forgotLink.addEventListener("click", (event) => {
            event.preventDefault();
            showForgot();
        });
    }

    if (loginLink) {
        loginLink.addEventListener("click", (event) => {
            event.preventDefault();
            showLogin();
        });
    }

    if (loginFromForgotLink) {
        loginFromForgotLink.addEventListener("click", (event) => {
            event.preventDefault();
            showLogin();
        });
    }

    window.addEventListener("click", (event) => {
        if (event.target === modal) {
            closeModal();
        }
    });

    if (loginForm) {
        loginForm.addEventListener("submit", (event) => {
            event.preventDefault();
            window.loginUser?.();
        });
    }

    if (registerForm) {
        registerForm.addEventListener("submit", (event) => {
            event.preventDefault();
            window.registerUser?.();
        });
    }

    if (forgotForm) {
        forgotForm.addEventListener("submit", (event) => {
            event.preventDefault();
            window.recoverPassword?.();
        });
    }

    document.querySelectorAll("form").forEach((form) => {
        form.addEventListener("submit", (event) => event.preventDefault());
    });
};
