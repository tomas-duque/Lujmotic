import { removeItem } from "./cart.js";

export const renderCart = (cart) => {
    const container = document.getElementById("cart-items");
    const totalText = document.getElementById("cart-total");

    if (!container || !totalText) return;

    container.innerHTML = "";
    let total = 0;

    if (!cart || cart.length === 0) {
        const emptyMessage = document.createElement("p");
        emptyMessage.className = "cart-empty-message";
        emptyMessage.textContent = "Tu carrito está vacío";
        container.appendChild(emptyMessage);
    } else {
        cart.forEach((item, index) => {
            const subtotal = item.price * item.qty;
            total += subtotal;

            const cartItem = document.createElement("div");
            cartItem.className = "cart-item";

            const cartItemDetails = document.createElement("div");
            cartItemDetails.className = "cart-item-details";
            cartItemDetails.innerHTML = `
                <strong>${item.name}</strong>
                <small>x${item.qty} - $${item.price.toLocaleString()}</small>
            `;

            const cartItemActions = document.createElement("div");
            cartItemActions.className = "cart-item-actions";

            const priceTag = document.createElement("span");
            priceTag.className = "cart-item-price";
            priceTag.textContent = `$${subtotal.toLocaleString()}`;

            const removeButton = document.createElement("button");
            removeButton.type = "button";
            removeButton.className = "cart-remove-btn";
            removeButton.textContent = "✕";
            removeButton.addEventListener("click", (event) => {
                event.stopPropagation();
                removeItem(index);
            });

            cartItemActions.appendChild(priceTag);
            cartItemActions.appendChild(removeButton);
            cartItem.appendChild(cartItemDetails);
            cartItem.appendChild(cartItemActions);
            container.appendChild(cartItem);
        });
    }

    totalText.innerText = "Total: $" + total.toLocaleString();
};

export const updateCartCounter = (cart) => {
    const counter = document.getElementById("cart-count");
    const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);

    if (counter) {
        counter.innerText = totalItems;
    }
};

export const showCheckoutSummary = (order) => {
    const checkoutMsg = document.getElementById("checkout-msg");

    if (checkoutMsg) {
        checkoutMsg.innerHTML = `
            <strong>Compra realizada con éxito</strong><br>
            Pedido: #${order.id}<br>
            Cliente: ${order.user}<br>
            Total: $${order.total.toLocaleString()}<br>
            Fecha: ${order.date}
        `;
    }
};

export const showSizeGuide = () => {
    const sizeGuideModal = document.getElementById("sizeGuideModal");
    if (sizeGuideModal) {
        sizeGuideModal.style.display = "flex";
    }
};

export const closeSizeGuide = () => {
    const sizeGuideModal = document.getElementById("sizeGuideModal");
    if (sizeGuideModal) {
        sizeGuideModal.style.display = "none";
    }
};
