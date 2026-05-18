import { getCurrentUser } from "../storage.js";

export const validateAdminAccess = () => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
        return { isAdmin: false, error: "Debes iniciar sesión." };
    }
    const allowedRoles = ["admin", "proveedor"];
    if (!allowedRoles.includes(currentUser.role)) {
        return { isAdmin: false, error: "Acceso denegado. Solo administradores o proveedores autorizados." };
    }
    return { isAdmin: true, user: currentUser };
};

export const getAdminDashboardStats = () => {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const orders = JSON.parse(localStorage.getItem("orders")) || [];
    const products = JSON.parse(localStorage.getItem("products")) || [];

    const totalSales = orders.reduce((sum, order) => sum + order.total, 0);
    const totalOrders = orders.length;
    const registeredUsers = users.length;
    const totalProducts = products.length;

    return {
        totalProducts,
        totalOrders,
        registeredUsers,
        totalSales,
        products,
        orders,
        users,
    };
};
