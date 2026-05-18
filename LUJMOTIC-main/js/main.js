import { initializeDefaultUsers, loginUser, registerUser, recoverPassword, saveNewPassword } from "./modules/auth.js";
import { showLogin, showRegister, showForgot, registerModalEvents } from "./modules/modal.js";
import { showUserDropdown } from "./modules/panel.js";
import { addToCart, addToCartWithOptions, clearCart, checkoutCart, setCartChangeHandler, getCart } from "./modules/cart.js";
import { renderCart, updateCartCounter, showSizeGuide, closeSizeGuide } from "./modules/ui.js";
import { getCurrentUser } from "./modules/storage.js";
import { getProducts, initializeDefaultProducts } from "./modules/admin/productService.js";
import { initializeDefaultOrders } from "./modules/admin/ordersService.js";
// Import account modules to ensure they initialize their event listeners
import "./modules/account/accountUI.js";
import "./modules/account/ordersUI.js";

const cartIcon = document.getElementById("cartIcon");

const exposeGlobalHandlers = () => {
    window.showLogin = showLogin;
    window.showRegister = showRegister;
    window.showForgot = showForgot;
    window.loginUser = loginUser;
    window.registerUser = registerUser;
    window.recoverPassword = recoverPassword;
    window.saveNewPassword = saveNewPassword;
    window.showUserDropdown = showUserDropdown;
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

const registerSizeGuideEvents = () => {
    const sizeGuideBtn = document.getElementById("sizeGuideBtn");
    const sizeGuideCloseBtn = document.getElementById("sizeGuideCloseBtn");
    const sizeGuideModal = document.getElementById("sizeGuideModal");

    if (sizeGuideBtn) {
        sizeGuideBtn.addEventListener("click", showSizeGuide);
    }

    if (sizeGuideCloseBtn) {
        sizeGuideCloseBtn.addEventListener("click", closeSizeGuide);
    }

    if (sizeGuideModal) {
        sizeGuideModal.addEventListener("click", (event) => {
            if (event.target === sizeGuideModal) {
                closeSizeGuide();
            }
        });
    }
};

const registerCheckoutEvents = () => {
    const checkoutBtn = document.getElementById("checkoutBtn");
    const clearCartBtn = document.getElementById("clearCartBtn");

    if (checkoutBtn) {
        checkoutBtn.addEventListener("click", checkoutCart);
    }

    if (clearCartBtn) {
        clearCartBtn.addEventListener("click", clearCart);
    }
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
                <img src="${product.image || "images/productos/placeholder.png"}" alt="${product.name}">
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
                <button type="button" class="btn-premium btn-add-cart">Agregar al carrito</button>
            </div>
        `;

        const addBtn = productCard.querySelector(".btn-add-cart");
        if (addBtn) {
            addBtn.addEventListener("click", (event) => {
                addToCartWithOptions(addBtn, product.name, product.price, event);

                const sizeSelect = productCard.querySelector(".product-size");
                const colorSelect = productCard.querySelector(".product-color");
                if (sizeSelect) sizeSelect.value = "";
                if (colorSelect) colorSelect.value = "";
            });
        }

        return productCard;
    };

    const hombreProducts = products.filter((p) => String(p.category || "").toLowerCase() === "hombre");
    const mujerProducts = products.filter((p) => String(p.category || "").toLowerCase() === "mujer");

    hombreProducts.forEach((product) => {
        gridHombre.appendChild(createProductCard(product));
    });

    mujerProducts.forEach((product) => {
        gridMujer.appendChild(createProductCard(product));
    });
};

const initializeApp = () => {
    initializeDefaultUsers();
    initializeDefaultProducts();
    initializeDefaultOrders();
    exposeGlobalHandlers();
    registerModalEvents();
    initializeCartUI();
    registerCartPanelToggle();
    registerSizeGuideEvents();
    registerCheckoutEvents();
    renderStoreProducts();

    const currentUser = getCurrentUser();
    if (currentUser) {
        showUserDropdown(currentUser);
    }
};

window.addEventListener("DOMContentLoaded", initializeApp);
