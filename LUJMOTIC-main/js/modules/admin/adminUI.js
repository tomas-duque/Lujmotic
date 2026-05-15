import { getProducts, createProduct, updateProduct, deleteProduct, validateProduct } from "./productService.js";
import { getOrders, formatOrderForDisplay } from "./ordersService.js";
import { getAdminDashboardStats } from "./adminService.js";

let editingProductId = null;

const getProductsTableBody = () => document.getElementById("products-table-body");
const getOrdersTableBody = () => document.getElementById("orders-table-body");
const getProductFormModal = () => document.getElementById("product-form-modal");

export const renderDashboardStats = () => {
    const stats = getAdminDashboardStats();
    const statsContainer = document.getElementById("admin-stats");

    if (!statsContainer) return;

    const statCards = [
        { label: "Productos", value: stats.totalProducts, variant: "products" },
        { label: "Pedidos", value: stats.totalOrders, variant: "orders" },
        { label: "Usuarios", value: stats.registeredUsers, variant: "users" },
        { label: "Ventas Totales", value: `$${stats.totalSales.toLocaleString()}`, variant: "sales" },
    ];

    statsContainer.innerHTML = statCards
        .map(
            (stat) => `
        <div class="stat-card stat-card--${stat.variant}">
            <h3>${stat.label}</h3>
            <p class="stat-value">${stat.value}</p>
        </div>
    `
        )
        .join("");
};

export const renderProductsTable = () => {
    const products = getProducts();
    const tableBody = getProductsTableBody();

    if (!tableBody) return;

    if (products.length === 0) {
        tableBody.innerHTML =
            '<tr><td colspan="8" class="table-empty">No hay productos registrados</td></tr>';
        return;
    }

    tableBody.innerHTML = products
        .map((product) => `
        <tr>
            <td>${product.id}</td>
            <td>
                ${
                    product.image
                        ? `<img src="${product.image}" alt="${product.name}" class="admin-product-thumb">`
                        : "-"
                }
            </td>
            <td>${product.name}</td>
            <td>$${product.price.toLocaleString()}</td>
            <td>${product.stock}</td>
            <td>${product.category || "-"}</td>
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
            '<tr><td colspan="7" class="table-empty">No hay pedidos registrados</td></tr>';
        return;
    }

    tableBody.innerHTML = orders
        .map((order) => {
            const formatted = formatOrderForDisplay(order);
            const itemNames = formatted.items.map((item) => item.name).join(", ");
            return `
            <tr>
                <td>#${order.id}</td>
                <td>${order.user}</td>
                <td>${order.email}</td>
                <td title="${itemNames}">${formatted.itemCount} producto(s)</td>
                <td>${formatted.formattedTotal}</td>
                <td>${formatted.formattedDate}</td>
                <td>
                    <button type="button" class="btn-action btn-view" data-action="view" data-order-id="${order.id}" title="Ver detalles">👁️</button>
                </td>
            </tr>
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

    const details = order.items
        .map((item) => `${item.name} x${item.qty} - $${item.price.toLocaleString()}`)
        .join("\n");

    alert(
        `Pedido #${order.id}\nCliente: ${order.user}\nEmail: ${order.email}\nFecha: ${order.date}\n\nProductos:\n${details}\n\nTotal: $${order.total.toLocaleString()}`
    );
};

export const registerAdminUIEvents = () => {
    const closeButton = document.getElementById("form-close-btn");
    const saveButton = document.getElementById("form-save-btn");
    const addButton = document.getElementById("add-product-btn");
    const cancelButton = document.getElementById("form-cancel-btn");
    const productsTableBody = getProductsTableBody();
    const ordersTableBody = getOrdersTableBody();

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

    const formModal = getProductFormModal();
    if (formModal) {
        formModal.addEventListener("click", (e) => {
            if (e.target === formModal) {
                closeProductForm();
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
    }
};

export const switchTab = (tabName) => {
    const tabs = document.querySelectorAll(".admin-tab-content");
    const tabButtons = document.querySelectorAll(".admin-tab-btn");

    tabs.forEach((tab) => {
        tab.style.display = "none";
    });
    tabButtons.forEach((btn) => {
        btn.classList.remove("active");
    });

    const activeTab = document.getElementById(`tab-${tabName}`);
    const activeBtn = document.querySelector(`.admin-tab-btn[data-tab="${tabName}"]`);

    if (activeTab) activeTab.style.display = "block";
    if (activeBtn) activeBtn.classList.add("active");

    if (tabName === "productos") {
        renderProductsTable();
    } else if (tabName === "pedidos") {
        renderOrdersTable();
    }
};
