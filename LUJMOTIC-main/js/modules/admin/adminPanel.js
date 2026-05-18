import { validateAdminAccess } from "./adminService.js";
import {
    renderDashboardStats,
    renderProductsTable,
    renderOrdersTable,
    renderUsersTable,
    renderRecentOrders,
    switchTab,
    registerAdminUIEvents,
} from "./adminUI.js";
import { initializeDefaultProducts } from "./productService.js";
import { initializeDefaultUsers } from "../auth.js";
import { initializeDefaultOrders } from "./ordersService.js";

const initializeAdminPanel = () => {
    const accessValidation = validateAdminAccess();

    if (!accessValidation.isAdmin) {
        document.body.innerHTML = `
            <div class="admin-access-denied">
                <div class="card">
                    <h1>❌ Acceso Denegado</h1>
                    <p>${accessValidation.error}</p>
                    <a href="index.html">Volver al inicio</a>
                </div>
            </div>
        `;
        return;
    }

    const userNameElement = document.getElementById("admin-user-name");
    if (userNameElement) {
        userNameElement.innerText = accessValidation.user.name;
    }

    initializeDefaultUsers();
    initializeDefaultProducts();
    initializeDefaultOrders();

    registerAdminUIEvents();
    registerAdminPanelEvents();

    renderDashboardStats();
    renderProductsTable();
    renderOrdersTable();
    renderUsersTable();
    renderRecentOrders();
};

const registerAdminPanelEvents = () => {
    const logoutBtn = document.getElementById("logout-btn");
    const tabButtons = document.querySelectorAll(".admin-tab-btn");

    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            localStorage.removeItem("currentUser");
            window.location.href = "index.html";
        });
    }

    tabButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const tabName = button.dataset.tab;
            if (tabName) {
                switchTab(tabName);
            }
        });
    });
};

window.addEventListener("DOMContentLoaded", initializeAdminPanel);
