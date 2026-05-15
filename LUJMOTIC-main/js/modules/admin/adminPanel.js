import { validateAdminAccess } from "./adminService.js";
import {
    renderDashboardStats,
    renderProductsTable,
    renderOrdersTable,
    switchTab,
    registerAdminUIEvents,
} from "./adminUI.js";
import { getOrders } from "./ordersService.js";
import { getUsers } from "../storage.js";

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

const renderRecentOrders = () => {
    const orders = getOrders();
    const recentList = document.querySelector(".recent-orders-list");

    if (!recentList) return;

    if (orders.length === 0) {
        recentList.innerHTML = '<p class="recent-order-empty">No hay pedidos recientes.</p>';
        return;
    }

    const latestOrders = orders.slice(-3).reverse();
    recentList.innerHTML = latestOrders
        .map(
            (order) => `
                <div class="recent-order-card">
                    <div>
                        <strong>Pedido #${order.id}</strong>
                        <p>${order.user} · ${new Date(order.date).toLocaleDateString("es-CL")}</p>
                    </div>
                    <div class="recent-order-meta">
                        <p>Total: <strong>$${order.total.toLocaleString()}</strong></p>
                        <p>${order.items?.length || 0} productos</p>
                    </div>
                </div>
            `
        )
        .join("");
};

const renderUsersTable = () => {
    const users = getUsers();
    const tableBody = document.getElementById("users-table-body");

    if (!tableBody) return;

    if (users.length === 0) {
        tableBody.innerHTML =
            '<tr><td colspan="4" class="table-empty">No hay usuarios registrados</td></tr>';
        return;
    }

    tableBody.innerHTML = users
        .map(
            (user) => `
        <tr>
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td><span class="role-pill role-pill--${user.role}">${user.role}</span></td>
            <td><span class="status-pill">Activo</span></td>
        </tr>
    `
        )
        .join("");
};

window.addEventListener("DOMContentLoaded", initializeAdminPanel);
