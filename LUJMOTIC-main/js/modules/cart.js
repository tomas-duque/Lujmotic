import { getData, saveData, getCurrentUser } from "./storage.js";
import { openModal, showLogin } from "./modal.js";
import { showCheckoutSummary } from "./ui.js";

let cart = getData("cart") || [];
let cartChangeHandler = () => {};

const notifyCartChange = () => {
    saveData("cart", cart);
    cartChangeHandler(cart);
};

export const setCartChangeHandler = (handler) => {
    cartChangeHandler = typeof handler === "function" ? handler : () => {};
};

export const getCart = () => cart;

export const addToCart = (name, price, event) => {
    if (event) {
        event.stopPropagation();
    }

    const existingItem = cart.find((item) => item.name === name);

    if (existingItem) {
        existingItem.qty += 1;
    } else {
        cart.push({ name, price, qty: 1 });
    }

    notifyCartChange();
    const cartPanel = document.getElementById("cartPanel");

    if (cartPanel) {
        cartPanel.style.display = "block";
    }
};

export const addToCartWithOptions = (button, name, price, event) => {
    if (event) {
        event.stopPropagation();
    }

    const productInfo = button.closest(".product-info");
    const size = productInfo?.querySelector(".product-size")?.value;
    const color = productInfo?.querySelector(".product-color")?.value;

    if (!size || !color) {
        alert("Selecciona talla y color antes de agregar.");
        return;
    }

    addToCart(`${name} - Talla ${size} - Color ${color}`, price, event);
};

export const removeItem = (index, event) => {
    if (event) {
        event.stopPropagation();
    }

    const item = cart[index];

    if (!item) return;

    if (item.qty > 1) {
        item.qty -= 1;
    } else {
        cart.splice(index, 1);
    }

    notifyCartChange();
};

export const clearCart = () => {
    if (cart.length === 0) {
        alert("El carrito ya está vacío.");
        return;
    }

    const confirmed = confirm("¿Deseas vaciar el carrito?");
    if (!confirmed) return;

    cart = [];
    notifyCartChange();

    alert("Carrito vaciado correctamente.");
};

export const checkoutCart = () => {
    if (cart.length === 0) {
        alert("Tu carrito está vacío.");
        return;
    }

    const currentUser = getCurrentUser();

    if (!currentUser) {
        openModal();
        showLogin();
        alert("Debes iniciar sesión para finalizar la compra.");
        return;
    }

    const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    const order = {
        id: Date.now(),
        user: currentUser.name,
        email: currentUser.email,
        items: [...cart],
        total,
        date: new Date().toLocaleString(),
        status: "pendiente",
    };

    const orders = getData("orders") || [];
    orders.push(order);
    saveData("orders", orders);

    cart = [];
    notifyCartChange();
    showCheckoutSummary(order);
    alert("Compra realizada con éxito.");
};
