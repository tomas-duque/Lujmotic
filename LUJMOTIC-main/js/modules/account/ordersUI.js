import { getCurrentUserOrders, getOrderItemCount, formatOrderDate } from "./ordersService.js";
import { lockBodyScroll, unlockBodyScroll } from "../modal.js";

const ordersModal = document.getElementById("ordersModal");
const ordersSummary = document.getElementById("orders-summary");
const ordersList = document.getElementById("orders-list");
const closeOrdersModalBtn = document.getElementById("closeOrdersModal");

const buildOrderItem = (item) => {
    const quantity = item.qty || 1;
    return `<li>${item.name} x${quantity}</li>`;
};

const renderOrders = () => {
    if (!ordersList || !ordersSummary) return;

    const orders = getCurrentUserOrders();
    if (orders.length === 0) {
        ordersSummary.innerHTML = `<p class="orders-empty-text">Aún no tienes pedidos realizados.</p>`;
        ordersList.innerHTML = "";
        return;
    }

    ordersSummary.innerHTML = `<p><strong>${orders.length}</strong> pedido${orders.length > 1 ? "s" : ""} registrados</p>`;
    ordersList.innerHTML = orders
        .slice()
        .reverse()
        .map((order) => {
            const itemCount = getOrderItemCount(order);
            const productsHtml = Array.isArray(order.items)
                ? order.items.map(buildOrderItem).join("")
                : "";

            return `
                <article class="order-card">
                    <div class="order-card-header">
                        <strong>Pedido #${order.id}</strong>
                        <span class="order-card-date">${formatOrderDate(order.date)}</span>
                    </div>
                    <div class="order-card-meta">
                        <span><strong>${itemCount}</strong> producto${itemCount === 1 ? "" : "s"}</span>
                        <span><strong>Total:</strong> $${order.total.toLocaleString()}</span>
                    </div>
                    <ul class="order-items">
                        ${productsHtml}
                    </ul>
                </article>
            `;
        })
        .join("");
};

export const openOrdersPanel = () => {
    if (!ordersModal) return;
    renderOrders();
    ordersModal.style.display = "flex";
    lockBodyScroll();
    window.addEventListener("keydown", handleEscapeClose);
};

export const closeOrdersPanel = () => {
    if (!ordersModal) return;
    ordersModal.style.display = "none";
    unlockBodyScroll();
    window.removeEventListener("keydown", handleEscapeClose);
};

const handleEscapeClose = (event) => {
    if (event.key === "Escape") {
        closeOrdersPanel();
    }
};

if (closeOrdersModalBtn) {
    closeOrdersModalBtn.addEventListener("click", closeOrdersPanel);
}

if (ordersModal) {
    ordersModal.addEventListener("click", (event) => {
        if (event.target === ordersModal) {
            closeOrdersPanel();
        }
    });
}
