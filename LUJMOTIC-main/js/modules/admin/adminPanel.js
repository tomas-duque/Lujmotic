import { validateAdminAccess } from "./adminService.js";
import {
    renderDashboardStats,
    renderProductsTable,
    renderOrdersTable,
    switchTab,
    registerAdminUIEvents,
    showProductForm,
    closeProductForm,
    deleteProductHandler,
    showOrderDetails,
} from "./adminUI.js";
import { getOrders } from "./ordersService.js";

const initializeAdminPanel = () => {
    const accessValidation = validateAdminAccess();

    if (!accessValidation.isAdmin) {
        document.body.innerHTML = `
            <div style="display: flex; justify-content: center; align-items: center; height: 100vh; background: #0a0a0a;">
                <div style="text-align: center; color: white;">
                    <h1 style="font-size: 32px; margin-bottom: 20px;">❌ Acceso Denegado</h1>
                    <p style="font-size: 18px; color: #aaa; margin-bottom: 30px;">${accessValidation.error}</p>
                    <a href="index.html" style="color: #d4af37; text-decoration: none; font-weight: 700;">Volver al inicio</a>
                </div>
            </div>
        `;
        return;
    }

    const userNameElement = document.getElementById("admin-user-name");
    if (userNameElement) {
        userNameElement.innerText = accessValidation.user.name;
    }

    window.switchTab = switchTab;
    window.editProduct = showProductForm;
    window.deleteProductHandler = deleteProductHandler;
    window.closeProductForm = closeProductForm;
    window.viewOrderDetails = showOrderDetails;

    registerAdminUIEvents();

    renderDashboardStats();
    renderProductsTable();
    renderOrdersTable();
    renderUsersTable();
    renderRecentOrders();

    const logoutBtn = document.getElementById("logout-btn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            localStorage.removeItem("currentUser");
            window.location.href = "index.html";
        });
    }
};

const renderRecentOrders = () => {
    const orders = getOrders();
    const recentList = document.querySelector(".recent-orders-list");

    if (!recentList) return;

    if (orders.length === 0) {
        recentList.innerHTML = "<p style='color:#aaa; padding: 18px;'>No hay pedidos recientes.</p>";
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
                    <div style="text-align:right;">
                        <p>Total: <strong>$${order.total.toLocaleString()}</strong></p>
                        <p>${order.items?.length || 0} productos</p>
                    </div>
                </div>
            `
        )
        .join("");
};

const renderUsersTable = () => {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const tableBody = document.getElementById("users-table-body");

    if (!tableBody) return;

    if (users.length === 0) {
        tableBody.innerHTML =
            '<tr><td colspan="4" style="text-align:center; padding: 20px; color: #aaa;">No hay usuarios registrados</td></tr>';
        return;
    }

    tableBody.innerHTML = users
        .map(
            (user) => `
        <tr>
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td><span style="background: ${user.role === "admin" ? "#ff6b6b" : user.role === "proveedor" ? "#ffc95e" : "#4ecdc4"}; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: 700; text-transform: uppercase;">${user.role}</span></td>
            <td><span style="color: #4ecdc4; font-weight: 700;">Activo</span></td>
        </tr>
    `
        )
        .join("");
};

window.addEventListener("DOMContentLoaded", initializeAdminPanel);
