import { getUsers, saveUsers, saveCurrentUser } from "./storage.js";
import { showLogin, closeModal } from "./modal.js";
import { showUserDropdown } from "./panel.js";

const normalizeEmail = (email) => String(email || "").trim().toLowerCase();

const setRecoverMessage = (message, type = "error") => {
    const recoverMsg = document.getElementById("recover-msg");
    if (!recoverMsg) return;

    recoverMsg.innerHTML = `<p class="form-message ${type === "success" ? "form-success" : "form-error"}">${message}</p>`;
};

const defaultUsers = [
    {
        name: "Administrador",
        email: "admin@lujmotic.com",
        password: "admin123",
        role: "admin",
        createdAt: new Date().toISOString(),
    },
    {
        name: "Proveedor",
        email: "proveedor@lujmotic.com",
        password: "proveedor123",
        role: "proveedor",
        createdAt: new Date().toISOString(),
    },
];

export const initializeDefaultUsers = () => {
    let users = getUsers();
    if (!Array.isArray(users)) {
        users = [];
    }

    defaultUsers.forEach((defaultUser) => {
        if (!users.find((user) => normalizeEmail(user.email) === normalizeEmail(defaultUser.email))) {
            users.push(defaultUser);
        }
    });

    saveUsers(users);
};

export const registerUser = () => {
    const name = document.getElementById("register-name")?.value.trim();
    const email = normalizeEmail(document.getElementById("register-email")?.value);
    const password = document.getElementById("register-password")?.value.trim();

    if (!name || !email || !password) {
        alert("Por favor completa todos los campos.");
        return;
    }

    const users = getUsers();
    const userExists = users.find((user) => normalizeEmail(user.email) === email);

    if (userExists) {
        alert("Este correo ya está registrado.");
        return;
    }

    users.push({
        name,
        email,
        password,
        role: "cliente",
        createdAt: new Date().toISOString(),
    });

    saveUsers(users);
    alert("Cuenta creada correctamente. Ahora puedes iniciar sesión.");
    showLogin();
    // Prefill login email and focus password for a smooth flow
    const loginEmail = document.getElementById("login-email");
    const loginPassword = document.getElementById("login-password");
    if (loginEmail) loginEmail.value = email || "";
    if (loginPassword) loginPassword.focus();
};

export const loginUser = () => {
    const email = normalizeEmail(document.getElementById("login-email")?.value);
    const password = document.getElementById("login-password")?.value.trim();

    if (!email || !password) {
        alert("Por favor ingresa correo y contraseña.");
        return;
    }

    const users = getUsers();
    if (!Array.isArray(users)) {
        alert("Error interno: usuarios no disponibles. Recarga la página.");
        return;
    }

    const user = users.find((item) => normalizeEmail(item.email) === email && item.password === password);

    if (!user) {
        alert("Correo o contraseña incorrectos.");
        return;
    }

    const currentUser = {
        ...user,
        email,
        role: user.role || "cliente",
        createdAt: user.createdAt || new Date().toISOString(),
    };

    const userIndex = users.findIndex((item) => normalizeEmail(item.email) === email);
    if (userIndex !== -1) {
        users[userIndex] = currentUser;
        saveUsers(users);
    }

    saveCurrentUser(currentUser);
    showUserDropdown(currentUser);
    closeModal();
    alert("Bienvenido/a " + currentUser.name + ". ¡Sesión iniciada correctamente!");
};

export const recoverPassword = () => {
    const email = normalizeEmail(document.getElementById("forgot-email")?.value);
    const recoverMsg = document.getElementById("recover-msg");

    if (!email) {
        setRecoverMessage("Ingresa tu correo electrónico.");
        return;
    }

    const users = getUsers();
    const userExists = users.find((user) => normalizeEmail(user.email) === email);

    if (!userExists) {
        setRecoverMessage("No existe una cuenta con ese correo.");
        return;
    }

    if (recoverMsg) {
        recoverMsg.innerHTML = `
            <form id="recoverForm">
                <p class="form-message form-success">Cuenta encontrada. Ingresa tu nueva contraseña.</p>
                <div class="input-field">
                    <label>Nueva contraseña</label>
                    <input id="new-password" name="new-password" type="password" placeholder="Nueva contraseña" required>
                </div>
                <button type="submit" id="save-password-btn" data-email="${email}" class="btn-premium">
                    GUARDAR CONTRASEÑA
                </button>
            </form>
        `;

        // focus the new password input
        const newPassInput = document.getElementById("new-password");
        if (newPassInput) newPassInput.focus();
    }
};

export const saveNewPassword = (email) => {
    const normalizedEmail = normalizeEmail(email);
    const newPassword = document.getElementById("new-password")?.value.trim();

    if (!newPassword) {
        alert("Escribe una nueva contraseña.");
        return;
    }

    const users = getUsers();
    const userIndex = users.findIndex((user) => normalizeEmail(user.email) === normalizedEmail);

    if (userIndex === -1) {
        alert("Usuario no encontrado.");
        return;
    }

    users[userIndex].password = newPassword;
    saveUsers(users);

    const recoverMsg = document.getElementById("recover-msg");
    if (recoverMsg) {
        recoverMsg.innerHTML = "";
    }


    const forgotEmail = document.getElementById("forgot-email");
    if (forgotEmail) forgotEmail.value = "";

    showLogin();
    alert("Contraseña actualizada correctamente.");
    // Modal stays open for new login
};

// Setup event delegation for password recovery
document.addEventListener("DOMContentLoaded", () => {
    const recoverMsg = document.getElementById("recover-msg");
    if (recoverMsg) {
        // handle click on dynamically created save button
        recoverMsg.addEventListener("click", (event) => {
            const button = event.target.closest("#save-password-btn");
            if (!button) return;

            const email = button.dataset.email;
            if (!email) return;

            saveNewPassword(email);
        });

        // handle submit (ENTER) on dynamic recover form
        document.addEventListener("submit", (event) => {
            const form = event.target;
            if (form && form.id === "recoverForm") {
                event.preventDefault();
                const btn = form.querySelector('#save-password-btn');
                const email = btn?.dataset?.email;
                if (email) {
                    saveNewPassword(email);
                }
            }
        });
    }
});
