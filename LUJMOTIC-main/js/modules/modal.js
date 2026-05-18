const modal = document.getElementById("loginModal");
const loginView = document.getElementById("loginView") || document.querySelector("#loginForm");
const registerView = document.getElementById("registerView") || document.getElementById("registerForm");
const forgotView = document.getElementById("forgotView") || document.getElementById("forgotForm");
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
    if (!loginForm) return;
    
    // Reset form
    if (loginForm) loginForm.reset();
    
    // Show/hide views - remove hidden class to override !important
    if (loginForm) {
        loginForm.classList.remove("hidden");
        loginForm.style.display = "block";
    }
    if (registerForm) {
        registerForm.classList.add("hidden");
        registerForm.style.display = "none";
    }
    if (forgotForm) {
        forgotForm.classList.add("hidden");
        forgotForm.style.display = "none";
    }
    
    // Focus email input
    const emailInput = loginForm?.querySelector("#login-email");
    if (emailInput) emailInput.focus();
};

export const showRegister = () => {
    if (!registerForm) return;
    
    // Reset form
    if (registerForm) registerForm.reset();
    
    // Show/hide views - remove hidden class to override !important
    if (loginForm) {
        loginForm.classList.add("hidden");
        loginForm.style.display = "none";
    }
    if (registerForm) {
        registerForm.classList.remove("hidden");
        registerForm.style.display = "block";
    }
    if (forgotForm) {
        forgotForm.classList.add("hidden");
        forgotForm.style.display = "none";
    }
    
    // Focus name input
    const nameInput = registerForm?.querySelector("#register-name");
    if (nameInput) nameInput.focus();
};

export const showForgot = () => {
    if (!forgotForm) return;
    
    // Reset form
    if (forgotForm) forgotForm.reset();
    
    // Show/hide views - remove hidden class to override !important
    if (loginForm) {
        loginForm.classList.add("hidden");
        loginForm.style.display = "none";
    }
    if (registerForm) {
        registerForm.classList.add("hidden");
        registerForm.style.display = "none";
    }
    if (forgotForm) {
        forgotForm.classList.remove("hidden");
        forgotForm.style.display = "block";
    }
    
    // Focus email input
    const emailInput = forgotForm?.querySelector("#forgot-email");
    if (emailInput) emailInput.focus();
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
    // Button to open/navigate modal
    const loginButton = document.getElementById("loginBtn");
    const registerLink = document.getElementById("showRegisterLink");
    const forgotLink = document.getElementById("showForgotLink");
    const loginLink = document.getElementById("showLoginLink");
    const loginFromForgotLink = document.getElementById("showLoginFromForgotLink");

    // Login Button - open modal
    if (loginButton) {
        loginButton.addEventListener("click", (e) => {
            e.preventDefault();
            openModal();
            showLogin();
        });
    }

    // Register Link - switch to register view
    if (registerLink) {
        registerLink.addEventListener("click", (event) => {
            event.preventDefault();
            showRegister();
        });
    }

    // Forgot Link - switch to forgot view
    if (forgotLink) {
        forgotLink.addEventListener("click", (event) => {
            event.preventDefault();
            showForgot();
        });
    }

    // Login Link from register - switch to login view
    if (loginLink) {
        loginLink.addEventListener("click", (event) => {
            event.preventDefault();
            showLogin();
        });
    }

    // Login Link from forgot - switch to login view
    if (loginFromForgotLink) {
        loginFromForgotLink.addEventListener("click", (event) => {
            event.preventDefault();
            showLogin();
        });
    }

    // Close modal when clicking outside (on modal backdrop)
    if (modal) {
        modal.addEventListener("click", (event) => {
            if (event.target === modal) {
                closeModal();
            }
        });
    }

    // Form Submit Handlers
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
};
