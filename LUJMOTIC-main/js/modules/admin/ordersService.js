export const getOrders = () => {
    return JSON.parse(localStorage.getItem("orders")) || [];
};

export const getOrderById = (id) => {
    const orders = getOrders();
    return orders.find((o) => o.id === parseInt(id));
};

export const saveOrders = (orders) => {
    localStorage.setItem("orders", JSON.stringify(orders));
};

export const updateOrderStatus = (orderId, newStatus) => {
    const orders = getOrders();
    const orderIndex = orders.findIndex((o) => o.id === parseInt(orderId));
    
    if (orderIndex === -1) {
        throw new Error("Pedido no encontrado.");
    }
    
    const validStatuses = ["pendiente", "procesando", "entregado"];
    const normalizedStatus = String(newStatus || "").trim().toLowerCase();
    
    if (!validStatuses.includes(normalizedStatus)) {
        throw new Error("Estado inv\u00e1lido. Los valores permitidos son: " + validStatuses.join(", "));
    }
    
    orders[orderIndex].status = normalizedStatus;
    saveOrders(orders);
    return orders[orderIndex];
};

export const initializeDefaultOrders = () => {
    const existingOrders = getOrders();
    if (existingOrders.length > 0) return;

    const products = JSON.parse(localStorage.getItem("products")) || [];
    if (products.length === 0) return;

    const sampleItems = products.slice(0, 2).map((product) => ({
        name: product.name,
        price: Number(product.price) || 0,
        qty: 1,
    }));

    const sampleOrder = {
        id: Date.now(),
        user: "Cliente Demo",
        email: "cliente@lujmotic.com",
        items: sampleItems,
        total: sampleItems.reduce((sum, item) => sum + item.price * item.qty, 0),
        date: new Date().toISOString(),
        status: "pendiente",
    };

    saveOrders([sampleOrder]);
};

export const getOrderStats = () => {
    const orders = getOrders();

    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    const averageOrderValue =
        totalOrders > 0 ? (totalRevenue / totalOrders).toFixed(2) : 0;

    return {
        totalOrders,
        totalRevenue,
        averageOrderValue,
    };
};

export const formatOrderForDisplay = (order) => {
    return {
        ...order,
        formattedTotal: `$${order.total.toLocaleString()}`,
        formattedDate: new Date(order.date).toLocaleDateString("es-CL", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        }),
        itemCount: order.items?.length || 0,
    };
};
