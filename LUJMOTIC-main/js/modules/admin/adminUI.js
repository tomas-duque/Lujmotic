import { getProducts, createProduct, updateProduct, deleteProduct, validateProduct } from "./productService.js";
import { getOrders, formatOrderForDisplay, updateOrderStatus } from "./ordersService.js";
import { getAdminDashboardStats } from "./adminService.js";
import { getUsers } from "../storage.js";

let editingProductId = null;

const getProductsTableBody = () => document.getElementById("products-table-body");
const getOrdersTableBody = () => document.getElementById("orders-table-body");
const getProductFormModal = () => document.getElementById("product-form-modal");
const getOrderDetailModal = () => document.getElementById("order-detail-modal");

const getSearchInput = () => document.getElementById("product-search-input");
const getCategoryFilter = () => document.getElementById("product-filter-category");

const currentProductFilters = {
    search: "",
    category: "all",
};

const normalizeValue = (value) => String(value || "").toLowerCase();
const formatDate = (value) => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
        return value || "-";
    }
    return date.toLocaleDateString("es-CL", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });
};

const getOrderStatus = (order) => {
    if (order.status) {
        return String(order.status).toLowerCase();
    }
    const fallback = Number(order.id) % 3;
    if (fallback === 0) return "entregado";
    if (fallback === 1) return "pendiente";
    return "procesando";
};

const renderStatusBadge = (status) => {
    const label = status.charAt(0).toUpperCase() + status.slice(1);
    return `<span class="status-pill status-pill--${status}">${label}</span>`;
};

const applyProductFilters = (products) => {
    const categoryFilter = normalizeValue(currentProductFilters.category);

    return products
        .filter((product) => {
            const matchesSearch = normalizeValue(product.name).includes(normalizeValue(currentProductFilters.search));
            const matchesCategory =
                categoryFilter === "all" || normalizeValue(product.category) === categoryFilter;
            return matchesSearch && matchesCategory;
        })
        .sort((a, b) => a.id - b.id);
};

export const renderDashboardStats = () => {
    const stats = getAdminDashboardStats();
    const statsContainer = document.getElementById("admin-stats");

    if (!statsContainer) return;

    const cards = [
        {
            label: "Productos",
            value: stats.totalProducts,
            description: "Inventario activo",
            variant: "products",
        },
        {
            label: "Pedidos",
            value: stats.totalOrders,
            description: "Transacciones totales",
            variant: "orders",
        },
        {
            label: "Usuarios",
            value: stats.registeredUsers,
            description: "Cuentas registradas",
            variant: "users",
        },
        {
            label: "Ingresos",
            value: `$${stats.totalSales.toLocaleString()}`,
            description: "Ventas acumuladas",
            variant: "sales",
        },
    ];

    statsContainer.innerHTML = cards
        .map(
            (card) => `
        <div class="stat-card stat-card--${card.variant}">
            <div class="stat-card-title">
                <span>${card.label}</span>
            </div>
            <p class="stat-value">${card.value}</p>
            <p class="stat-caption">${card.description}</p>
        </div>
    `
        )
        .join("");
};

export const renderProductsTable = () => {
    const products = getProducts();
    const tableBody = getProductsTableBody();

    if (!tableBody) return;

    const visibleProducts = applyProductFilters(products);

    if (visibleProducts.length === 0) {
        tableBody.innerHTML =
            '<tr><td colspan="8" class="table-empty">No se encontraron productos.</td></tr>';
        return;
    }

    tableBody.innerHTML = visibleProducts
        .map((product) => `
        <tr>
            <td>${product.id}</td>
            <td>
                ${product.image ? `<img src="${product.image}" alt="${product.name}" class="admin-product-thumb">` : "-"}
            </td>
            <td>
                <div class="product-cell">
                    <strong>${product.name}</strong>
                    <small>${product.description || "Sin descripción"}</small>
                </div>
            </td>
            <td>$${Number(product.price).toLocaleString()}</td>
            <td>${Number(product.stock)}</td>
            <td><span class="category-pill">${product.category || "Sin categoría"}</span></td>
            <td>${product.talla || "-"}</td>
            <td>
                <button type="button" class="btn-action btn-edit" data-action="edit" data-product-id="${product.id}" title="Editar">✏️</button>
                <button type="button" class="btn-action btn-delete" data-action="delete" data-product-id="${product.id}" title="Eliminar">🗑️</button>
            </td>
        </tr>
    `)
        .join("");
};

export const renderOrdersTable = () => {
    const orders = getOrders();
    const tableBody = getOrdersTableBody();

    if (!tableBody) return;

    if (orders.length === 0) {
        tableBody.innerHTML =
            '<tr><td colspan="8" class="table-empty">No hay pedidos registrados.</td></tr>';
        return;
    }

    tableBody.innerHTML = orders
        .map((order) => {
            const formatted = formatOrderForDisplay(order);
            const status = getOrderStatus(order);
            const itemNames = (order.items || []).map((item) => item.name).join(", ");
            return `
            <tr>
                <td>#${order.id}</td>
                <td>${order.user}</td>
                <td>${order.email}</td>
                <td title="${itemNames}">${formatted.itemCount} producto(s)</td>
                <td>${formatted.formattedTotal}</td>
                <td>${formatted.formattedDate}</td>
                <td class="order-status-cell">
                    <select class="order-status-select" data-order-id="${order.id}" title="Cambiar estado">
                        <option value="pendiente" ${status === "pendiente" ? "selected" : ""}>Pendiente</option>
                        <option value="procesando" ${status === "procesando" ? "selected" : ""}>Procesando</option>
                        <option value="entregado" ${status === "entregado" ? "selected" : ""}>Entregado</option>
                    </select>
                </td>
                <td class="order-actions-cell">
                    <button type="button" class="btn-action btn-view" data-action="view" data-order-id="${order.id}" title="Ver detalles">👁️</button>
                </td>
            </tr>
        `;
        })
        .join("");
};

export const renderUsersTable = () => {
    const users = getUsers();
    const tableBody = document.getElementById("users-table-body");

    if (!tableBody) return;

    if (users.length === 0) {
        tableBody.innerHTML =
            '<tr><td colspan="5" class="table-empty">No hay usuarios registrados</td></tr>';
        return;
    }

    const sortedUsers = [...users].sort((a, b) => {
        const dateA = new Date(a.createdAt || 0).getTime();
        const dateB = new Date(b.createdAt || 0).getTime();
        return dateB - dateA;
    });

    tableBody.innerHTML = sortedUsers
        .map(
            (user) => `
        <tr>
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td><span class="role-pill role-pill--${user.role}">${user.role}</span></td>
            <td>${formatDate(user.createdAt || "-")}</td>
            <td><span class="status-pill status-pill--activo">Activo</span></td>
        </tr>
    `
        )
        .join("");
};

export const renderRecentOrders = () => {
    const orders = getOrders();
    const recentList = document.querySelector(".recent-orders-list");

    if (!recentList) return;

    if (orders.length === 0) {
        recentList.innerHTML = '<p class="recent-order-empty">No hay pedidos recientes.</p>';
        return;
    }

    const latestOrders = [...orders].slice(-3).reverse();
    recentList.innerHTML = latestOrders
        .map((order) => {
            const status = getOrderStatus(order);
            return `
                <div class="recent-order-card">
                    <div>
                        <strong>Pedido #${order.id}</strong>
                        <p>${order.user} · ${formatDate(order.date)}</p>
                    </div>
                    <div class="recent-order-meta">
                        ${renderStatusBadge(status)}
                        <p>Total: <strong>$${order.total.toLocaleString()}</strong></p>
                    </div>
                </div>
            `;
        })
        .join("");
};

export const showProductForm = (productId = null) => {
    const formModal = getProductFormModal();
    const formTitle = document.getElementById("form-title");
    const form = document.getElementById("product-form");

    if (!formModal || !form) return;

    editingProductId = productId;

    if (productId) {
        const product = getProducts().find((p) => p.id === productId);
        if (product) {
            formTitle.innerText = "Editar Producto";
            document.getElementById("product-name").value = product.name;
            document.getElementById("product-price").value = product.price;
            document.getElementById("product-description").value = product.description || "";
            document.getElementById("product-category").value = product.category || "";
            document.getElementById("product-image").value = product.image || "";
            document.getElementById("product-stock").value = product.stock;
            document.getElementById("product-talla").value = product.talla || "";
            document.getElementById("product-color").value = product.color || "";
        }
    } else {
        formTitle.innerText = "Crear Nuevo Producto";
        form.reset();
    }

    formModal.classList.remove("hidden");
};

export const closeProductForm = () => {
    const formModal = getProductFormModal();
    if (formModal) {
        formModal.classList.add("hidden");
    }
    editingProductId = null;
};

export const saveProductFromForm = () => {
    const productData = {
        name: document.getElementById("product-name")?.value.trim() || "",
        price: document.getElementById("product-price")?.value || "",
        description: document.getElementById("product-description")?.value.trim() || "",
        category: document.getElementById("product-category")?.value || "",
        image: document.getElementById("product-image")?.value.trim() || "",
        stock: document.getElementById("product-stock")?.value || "",
        talla: document.getElementById("product-talla")?.value || "",
        color: document.getElementById("product-color")?.value || "",
    };

    const validation = validateProduct(productData);
    if (!validation.isValid) {
        alert("Errores:\n" + validation.errors.join("\n"));
        return;
    }

    try {
        if (editingProductId) {
            updateProduct(editingProductId, productData);
            alert("Producto actualizado correctamente.");
        } else {
            createProduct(productData);
            alert("Producto creado correctamente.");
        }
        closeProductForm();
        renderProductsTable();
        renderDashboardStats();
    } catch (error) {
        alert(`Error: ${error.message}`);
    }
};

export const deleteProductHandler = (id) => {
    if (confirm("¿Estás seguro de que deseas eliminar este producto?")) {
        try {
            deleteProduct(id);
            alert("Producto eliminado correctamente.");
            renderProductsTable();
            renderDashboardStats();
        } catch (error) {
            alert(`Error: ${error.message}`);
        }
    }
};

export const showOrderDetails = (orderId) => {
    const order = getOrders().find((o) => o.id === orderId);
    if (!order) {
        alert("Pedido no encontrado.");
        return;
    }

    const modal = document.getElementById("order-detail-modal");
    const content = document.getElementById("order-detail-content");
    if (!modal || !content) return;

    const status = getOrderStatus(order);
    const items = order.items || [];
    const itemMarkup = items
        .map(
            (item) => `
                <div class="order-item-row">
                    <span>${item.name}</span>
                    <span>x${item.qty}</span>
                    <strong>$${item.price.toLocaleString()}</strong>
                </div>
            `
        )
        .join("");

    content.innerHTML = `
        <div class="order-detail-grid">
            <div>
                <p class="detail-label">Pedido</p>
                <h3>#${order.id}</h3>
            </div>
            <div>
                <p class="detail-label">Cliente</p>
                <p>${order.user}</p>
            </div>
            <div>
                <p class="detail-label">Email</p>
                <p>${order.email}</p>
            </div>
            <div>
                <p class="detail-label">Fecha</p>
                <p>${formatDate(order.date)}</p>
            </div>
            <div>
                <p class="detail-label">Estado</p>
                <p>${renderStatusBadge(status)}</p>
            </div>
            <div>
                <p class="detail-label">Total</p>
                <p>$${order.total.toLocaleString()}</p>
            </div>
        </div>
        <div class="order-detail-items">
            <div class="order-detail-items-header">
                <h4>Productos</h4>
                <span>${items.length} artículo(s)</span>
            </div>
            ${items.length ? itemMarkup : '<p class="empty-text">Este pedido no tiene productos registrados.</p>'}
        </div>
    `;

    modal.classList.remove("hidden");
};

export const registerAdminUIEvents = () => {
    const closeButton = document.getElementById("form-close-btn");
    const saveButton = document.getElementById("form-save-btn");
    const addButton = document.getElementById("add-product-btn");
    const cancelButton = document.getElementById("form-cancel-btn");
    const productsTableBody = getProductsTableBody();
    const ordersTableBody = getOrdersTableBody();
    const searchInput = getSearchInput();
    const categoryFilter = getCategoryFilter();
    const formModal = getProductFormModal();
    const orderDetailModal = getOrderDetailModal();
    const orderDetailClose = document.getElementById("order-detail-close-btn");

    if (closeButton) {
        closeButton.addEventListener("click", closeProductForm);
    }
    if (saveButton) {
        saveButton.addEventListener("click", saveProductFromForm);
    }
    if (cancelButton) {
        cancelButton.addEventListener("click", closeProductForm);
    }
    if (addButton) {
        addButton.addEventListener("click", () => showProductForm());
    }
    if (searchInput) {
        searchInput.addEventListener("input", (event) => {
            currentProductFilters.search = event.target.value;
            renderProductsTable();
        });
    }
    if (categoryFilter) {
        categoryFilter.addEventListener("change", (event) => {
            currentProductFilters.category = event.target.value;
            renderProductsTable();
        });
    }
    if (formModal) {
        formModal.addEventListener("click", (event) => {
            if (event.target === formModal) {
                closeProductForm();
            }
        });
    }
    if (orderDetailModal) {
        orderDetailModal.addEventListener("click", (event) => {
            if (event.target === orderDetailModal) {
                orderDetailModal.classList.add("hidden");
            }
        });
    }
    if (orderDetailClose) {
        orderDetailClose.addEventListener("click", () => {
            if (orderDetailModal) {
                orderDetailModal.classList.add("hidden");
            }
        });
    }
    if (productsTableBody) {
        productsTableBody.addEventListener("click", (event) => {
            const button = event.target.closest("button[data-action]");
            if (!button) return;
            const action = button.dataset.action;
            const productId = Number(button.dataset.productId);
            if (action === "edit") {
                showProductForm(productId);
            } else if (action === "delete") {
                deleteProductHandler(productId);
            }
        });
    }
    if (ordersTableBody) {
        ordersTableBody.addEventListener("click", (event) => {
            const button = event.target.closest("button[data-action='view']");
            if (!button) return;
            const orderId = Number(button.dataset.orderId);
            showOrderDetails(orderId);
        });
        
        ordersTableBody.addEventListener("change", (event) => {
            if (event.target.classList.contains("order-status-select")) {
                const select = event.target;
                const orderId = Number(select.dataset.orderId);
                const newStatus = select.value;
                
                try {
                    updateOrderStatus(orderId, newStatus);
                    renderOrdersTable();
                    renderDashboardStats();
                    renderRecentOrders();
                } catch (error) {
                    alert("Error: " + error.message);
                    renderOrdersTable();
                }
            }
        });
    }
};

export const switchTab = (tabName) => {
    const tabs = document.querySelectorAll(".admin-tab-content");
    const tabButtons = document.querySelectorAll(".admin-tab-btn");

    tabs.forEach((tab) => {
        tab.classList.add("hidden");
        tab.classList.remove("active");
    });
    tabButtons.forEach((btn) => btn.classList.remove("active"));

    const activeTab = document.getElementById(`tab-${tabName}`);
    const activeBtn = document.querySelector(`.admin-tab-btn[data-tab="${tabName}"]`);

    if (activeTab) {
        activeTab.classList.remove("hidden");
        activeTab.classList.add("active");
    }
    if (activeBtn) activeBtn.classList.add("active");

    if (tabName === "productos") {
        renderProductsTable();
    } else if (tabName === "pedidos") {
        renderOrdersTable();
    } else if (tabName === "usuarios") {
        renderUsersTable();
    } else if (tabName === "dashboard") {
        renderDashboardStats();
        renderRecentOrders();
    }
};
