import { getUsers, saveUsers, saveCurrentUser } from "./storage.js";
import { showLogin, showRegister, showForgot } from "./modal.js";
import { showUserDropdown } from "./panel.js";

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
    };

    if (!user.role) {
        const userIndex = users.findIndex((item) => item.email === email);
        if (userIndex !== -1) {
            users[userIndex] = currentUser;
            saveUsers(users);
        }
    }

    saveCurrentUser(currentUser);
    alert(`Bienvenido/a ${currentUser.name} - Rol: ${currentUser.role}`);
    showUserDropdown(currentUser);
    document.getElementById("loginModal").style.display = "none";
};

export const recoverPassword = () => {
    const email = document.getElementById("forgot-email")?.value.trim();
    const msg = document.getElementById("recover-msg");

    if (!email) {
        if (msg) msg.innerText = "Ingresa tu correo electrónico.";
        return;
    }

    const users = getUsers();
    const userExists = users.find((user) => user.email === email);

    if (!userExists) {
        if (msg) msg.innerText = "No existe una cuenta con ese correo.";
        return;
    }

    if (msg) {
        msg.innerHTML = `
            <div class="input-field" style="margin-top: 20px;">
                <label>Nueva contraseña</label>
                <input id="new-password" type="password" placeholder="Nueva contraseña">
            </div>
            <button class="btn-premium" onclick="saveNewPassword('${email}')">
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

    alert("Contraseña actualizada correctamente.");

    const forgotEmail = document.getElementById("forgot-email");
    const recoverMsg = document.getElementById("recover-msg");

    if (forgotEmail) forgotEmail.value = "";
    if (recoverMsg) recoverMsg.innerHTML = "";

    showLogin();
};
