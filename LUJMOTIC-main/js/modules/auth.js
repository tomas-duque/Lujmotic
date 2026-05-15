import { getUsers, saveUsers, saveCurrentUser } from "./storage.js";
import { showLogin, showRegister, showForgot } from "./modal.js";
import { showUserDropdown } from "./panel.js";

const recoverMsg = document.getElementById("recover-msg");

const setRecoverMessage = (message, type = "error") => {
    if (!recoverMsg) return;

    recoverMsg.innerHTML = `<p class="form-message ${type === "success" ? "form-success" : "form-error"}">${message}</p>`;
};

const defaultUsers = [
    {
        name: "Administrador",
        email: "admin@lujmotic.com",
        password: "admin123",
        role: "admin",
    },
    {
        name: "Proveedor",
        email: "proveedor@lujmotic.com",
        password: "proveedor123",
        role: "proveedor",
    },
];

export const initializeDefaultUsers = () => {
    let users = getUsers();
    if (!Array.isArray(users)) {
        users = [];
    }

    defaultUsers.forEach((defaultUser) => {
        if (!users.find((user) => user.email === defaultUser.email)) {
            users.push(defaultUser);
        }
    });

    saveUsers(users);
};

export const registerUser = () => {
    const name = document.getElementById("register-name")?.value.trim();
    const email = document.getElementById("register-email")?.value.trim();
    const password = document.getElementById("register-password")?.value.trim();

    if (!name || !email || !password) {
        alert("Por favor completa todos los campos.");
        return;
    }

    const users = getUsers();
    const userExists = users.find((user) => user.email === email);

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
};

export const loginUser = () => {
    const email = document.getElementById("login-email")?.value.trim();
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

    const user = users.find((item) => item.email === email && item.password === password);

    if (!user) {
        alert("Correo o contraseña incorrectos.");
        return;
    }

    const currentUser = {
        ...user,
        role: user.role || "cliente",
        createdAt: user.createdAt || new Date().toISOString(),
    };

    const userIndex = users.findIndex((item) => item.email === email);
    if (userIndex !== -1) {
        users[userIndex] = currentUser;
        saveUsers(users);
    }

    saveCurrentUser(currentUser);
    showUserDropdown(currentUser);
    document.getElementById("loginModal").style.display = "none";
};

export const recoverPassword = () => {
    const email = document.getElementById("forgot-email")?.value.trim();

    if (!email) {
        setRecoverMessage("Ingresa tu correo electrónico.");
        return;
    }

    const users = getUsers();
    const userExists = users.find((user) => user.email === email);

    if (!userExists) {
        setRecoverMessage("No existe una cuenta con ese correo.");
        return;
    }

    if (recoverMsg) {
        recoverMsg.innerHTML = `
            <div class="input-field">
                <label>Nueva contraseña</label>
                <input id="new-password" type="password" placeholder="Nueva contraseña">
            </div>
            <button type="button" id="save-password-btn" data-email="${email}" class="btn-premium">
                GUARDAR CONTRASEÑA
            </button>
        `;
    }
};

export const saveNewPassword = (email) => {
    const newPassword = document.getElementById("new-password")?.value.trim();

    if (!newPassword) {
        alert("Escribe una nueva contraseña.");
        return;
    }

    const users = getUsers();
    const userIndex = users.findIndex((user) => user.email === email);

    if (userIndex === -1) {
        alert("Usuario no encontrado.");
        return;
    }

    users[userIndex].password = newPassword;
    saveUsers(users);

    if (recoverMsg) {
        recoverMsg.innerHTML = "";
    }

    const forgotEmail = document.getElementById("forgot-email");
    if (forgotEmail) forgotEmail.value = "";

    showLogin();
    alert("Contraseña actualizada correctamente.");
};

if (recoverMsg) {
    recoverMsg.addEventListener("click", (event) => {
        const button = event.target.closest("#save-password-btn");
        if (!button) return;

        const email = button.dataset.email;
        if (!email) return;

        saveNewPassword(email);
    });
}
