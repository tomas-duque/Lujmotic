import { getData, clearCurrentUser } from "./storage.js";

const userDropdownContainer = document.getElementById("userDropdownContainer");
const userDropdownBtn = document.getElementById("userDropdownBtn");
const userDropdown = document.getElementById("userDropdown");
const userName = document.getElementById("userName");
const dropdownUserName = document.getElementById("dropdownUserName");
const dropdownUserEmail = document.getElementById("dropdownUserEmail");
const dropdownMenu = document.getElementById("dropdownMenu");
const loginButton = document.getElementById("loginBtn");

let isDropdownOpen = false;

const toggleUserDropdown = () => {
    isDropdownOpen = !isDropdownOpen;
    userDropdown.classList.toggle("active");
    userDropdownBtn.classList.toggle("active");
};

document.addEventListener("click", (e) => {
    if (!userDropdownContainer?.contains(e.target) && isDropdownOpen) {
        isDropdownOpen = false;
        userDropdown?.classList.remove("active");
        userDropdownBtn?.classList.remove("active");
    }
});

if (userDropdownBtn) {
    userDropdownBtn.addEventListener("click", toggleUserDropdown);
}

export const showUserDropdown = (user) => {
    if (!userDropdownContainer || !userName || !dropdownUserName || !dropdownUserEmail) return;

    userName.innerText = user.name;
    dropdownUserName.innerText = user.name;
    dropdownUserEmail.innerText = user.email;

    if (dropdownMenu) {
        dropdownMenu.innerHTML = "";
    }

    const menuItems = [];

    if (user.role === "admin") {
        menuItems.push({
            label: "Panel Admin",
            icon: "⚙️",
            action: () => {
                window.location.href = "admin.html";
            }
        });
        menuItems.push({
            label: "Mi Cuenta",
            icon: "👤",
            action: () => {
                alert("Función en desarrollo");
            }
        });
    } else if (user.role === "proveedor") {
        menuItems.push({
            label: "Panel Proveedor",
            icon: "📦",
            action: () => {
                alert("Panel Proveedor en desarrollo");
            }
        });
        menuItems.push({
            label: "Mi Cuenta",
            icon: "👤",
            action: () => {
                alert("Función en desarrollo");
            }
        });
    } else {
        menuItems.push({
            label: "Mi Cuenta",
            icon: "👤",
            action: () => {
                alert("Mi Cuenta en desarrollo");
            }
        });
        menuItems.push({
            label: "Mis Pedidos",
            icon: "📋",
            action: () => {
                alert("Mis Pedidos en desarrollo");
            }
        });
    }

    menuItems.forEach((item) => {
        const itemEl = document.createElement("div");
        itemEl.className = "dropdown-item";
        itemEl.innerHTML = `<span>${item.icon}</span> <span>${item.label}</span>`;
        itemEl.addEventListener("click", () => {
            item.action();
            isDropdownOpen = false;
            userDropdown?.classList.remove("active");
            userDropdownBtn?.classList.remove("active");
        });
        if (dropdownMenu) {
            dropdownMenu.appendChild(itemEl);
        }
    });

    const separatorEl = document.createElement("div");
    separatorEl.className = "dropdown-item separator";
    if (dropdownMenu) {
        dropdownMenu.appendChild(separatorEl);
    }

    const logoutEl = document.createElement("div");
    logoutEl.className = "dropdown-item logout";
    logoutEl.innerHTML = `<span>🚪</span> <span>Cerrar Sesión</span>`;
    logoutEl.addEventListener("click", logoutUser);
    if (dropdownMenu) {
        dropdownMenu.appendChild(logoutEl);
    }

    if (userDropdownContainer) {
        userDropdownContainer.style.display = "flex";
    }
    if (loginButton) {
        loginButton.style.display = "none";
    }
};

export const logoutUser = () => {
    clearCurrentUser();

    const adminBtn = document.getElementById("admin-panel-btn");
    const proveedorBtn = document.getElementById("proveedor-panel-btn");
    if (adminBtn) adminBtn.remove();
    if (proveedorBtn) proveedorBtn.remove();

    isDropdownOpen = false;
    if (userDropdown) {
        userDropdown.classList.remove("active");
    }
    if (userDropdownBtn) {
        userDropdownBtn.classList.remove("active");
    }

    if (userDropdownContainer) {
        userDropdownContainer.style.display = "none";
    }
    if (loginButton) {
        loginButton.style.display = "block";
    }

    if (loginButton) {
        loginButton.innerText = "Iniciar sesión";
    }

    alert("Sesión cerrada correctamente.");
    location.reload();
};
