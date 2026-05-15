import { initializeDefaultUsers, loginUser, registerUser, recoverPassword, saveNewPassword } from "./modules/auth.js";
import { showLogin, showRegister, showForgot, registerModalEvents } from "./modules/modal.js";
import { showUserDropdown, logoutUser } from "./modules/panel.js";
import { addToCart, addToCartWithOptions, removeItem, clearCart, checkoutCart, setCartChangeHandler, getCart } from "./modules/cart.js";
import { renderCart, updateCartCounter, showSizeGuide, closeSizeGuide } from "./modules/ui.js";
import { getCurrentUser } from "./modules/storage.js";
import { validateAdminAccess } from "./modules/admin/adminService.js";
import { getProducts, initializeDefaultProducts } from "./modules/admin/productService.js";

const cartIcon = document.getElementById("cartIcon");

const exposeGlobalHandlers = () => {
    window.addToCart = addToCart;
    window.addToCartWithOptions = addToCartWithOptions;
    window.removeItem = removeItem;
    window.clearCart = clearCart;
    window.checkoutCart = checkoutCart;
    window.showLogin = showLogin;
    window.showRegister = showRegister;
    window.showForgot = showForgot;
    window.loginUser = loginUser;
    window.registerUser = registerUser;
    window.recoverPassword = recoverPassword;
    window.saveNewPassword = saveNewPassword;
    window.logoutUser = logoutUser;
    window.showSizeGuide = showSizeGuide;
    window.closeSizeGuide = closeSizeGuide;
};

const initializeCartUI = () => {
    setCartChangeHandler((cart) => {
        updateCartCounter(cart);
        renderCart(cart);
    });

    const initialCart = getCart();
    updateCartCounter(initialCart);
    renderCart(initialCart);
};

const registerCartPanelToggle = () => {
    if (!cartIcon) return;

    cartIcon.addEventListener("click", (event) => {
        event.stopPropagation();
        const cartPanel = document.getElementById("cartPanel");
        const isVisible = cartPanel?.style.display === "block";
        if (cartPanel) {
            cartPanel.style.display = isVisible ? "none" : "block";
        }
        if (!isVisible) {
            renderCart(getCart());
        }
    });

    document.addEventListener("click", (event) => {
        const cartPanel = document.getElementById("cartPanel");
        if (
            cartPanel?.style.display === "block" &&
            !cartPanel.contains(event.target) &&
            !cartIcon.contains(event.target)
        ) {
            cartPanel.style.display = "none";
        }
    });
};

const renderStoreProducts = () => {
    const products = getProducts();
    const gridHombre = document.querySelector("#seccion-hombre .grid");
    const gridMujer = document.querySelector("#seccion-mujer .grid");

    if (!gridHombre || !gridMujer) return;

    gridHombre.innerHTML = "";
    gridMujer.innerHTML = "";

    const createProductCard = (product) => {
        const productCard = document.createElement("div");
        productCard.className = "producto-card";

        productCard.innerHTML = `
            <div class="img-container">
                <img src="${product.image || 'images/productos/placeholder.png'}" alt="${product.name}">
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <p>$${product.price.toLocaleString()}</p>
                <div class="product-options">
                    <select class="product-size">
                        <option value="">Talla</option>
                        <option value="S">S</option>
                        <option value="M">M</option>
                        <option value="L">L</option>
                        <option value="XL">XL</option>
                    </select>
                    <select class="product-color">
                        <option value="">Color</option>
                        <option value="Negro">Negro</option>
                        <option value="Beige">Beige</option>
                        <option value="Blanco">Blanco</option>
                    </select>
                </div>
                <button class="btn-premium btn-add-cart" onclick="addToCart('${product.name}', ${product.price}, event)">Agregar al carrito</button>
            </div>
        `;

        const addBtn = productCard.querySelector(".btn-add-cart");
        if (addBtn) {
            addBtn.addEventListener("click", () => {
                setTimeout(() => {
                    const sizeSelect = productCard.querySelector(".product-size");
                    const colorSelect = productCard.querySelector(".product-color");
                    if (sizeSelect) sizeSelect.value = "";
                    if (colorSelect) colorSelect.value = "";
                }, 100);
            });
        }

        return productCard;
    };

    const hombreProducts = products.filter(p => p.category === "hombre");
    const mujerProducts = products.filter(p => p.category === "mujer");

    hombreProducts.forEach(product => {
        gridHombre.appendChild(createProductCard(product));
    });

    mujerProducts.forEach(product => {
        gridMujer.appendChild(createProductCard(product));
    });
};

const initializeApp = () => {
    initializeDefaultUsers();
    initializeDefaultProducts();
    registerModalEvents();
    exposeGlobalHandlers();
    initializeCartUI();
    registerCartPanelToggle();
    renderStoreProducts();

    const currentUser = getCurrentUser();
    if (currentUser) {
        showUserDropdown(currentUser);
    }
};

const updateNavBarButtons = (user) => {
    const navbar = document.querySelector(".nav-actions");
    if (!navbar) return;

    const adminBtn = document.getElementById("admin-panel-btn");
    const proveedorBtn = document.getElementById("proveedor-panel-btn");
    if (adminBtn) adminBtn.remove();
    if (proveedorBtn) proveedorBtn.remove();

    if (!user) return;
};

const addProveedorPanelButton = () => {
};

window.addEventListener("DOMContentLoaded", initializeApp);
