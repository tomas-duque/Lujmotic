import { getData, getCurrentUser } from "../storage.js";

export const getCurrentUserOrders = () => {
    const currentUser = getCurrentUser();
    if (!currentUser || !currentUser.email) return [];

    const orders = getData("orders") || [];
    return orders.filter((order) => order.email === currentUser.email);
};

export const getOrderItemCount = (order) => {
    if (!order || !Array.isArray(order.items)) return 0;
    return order.items.reduce((total, item) => total + (item.qty || 1), 0);
};

export const formatOrderDate = (orderDate) => {
    const date = new Date(orderDate);
    if (Number.isNaN(date.getTime())) return "Fecha desconocida";
    return date.toLocaleDateString("es-CL", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });
};
