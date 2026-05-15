export const getOrders = () => {
    return JSON.parse(localStorage.getItem("orders")) || [];
};

export const getOrderById = (id) => {
    const orders = getOrders();
    return orders.find((o) => o.id === parseInt(id));
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
        formattedDate: new Date(order.date).toLocaleDateString("es-CL"),
        itemCount: order.items?.length || 0,
    };
};
