export const renderCart = (cart) => {
    const container = document.getElementById("cart-items");
    const totalText = document.getElementById("cart-total");

    if (!container || !totalText) return;

    container.innerHTML = "";
    let total = 0;

    if (!cart || cart.length === 0) {
        container.innerHTML =
            "<p style='color:#777; text-align:center; padding: 20px;'>Tu carrito está vacío</p>";
    } else {
        cart.forEach((item, index) => {
            const subtotal = item.price * item.qty;
            total += subtotal;
            container.innerHTML += `
                <div class="cart-item" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px; border-bottom:1px solid #222; padding-bottom:10px;">
                    <div>
                        <strong style="color:white; font-size:14px;">${item.name}</strong><br>
                        <small style="color:#aaa;">x${item.qty} - $${item.price.toLocaleString()}</small>
                    </div>
                    <div style="display:flex; align-items:center; gap:12px;">
                        <span style="color:#d4af37; font-weight:bold;">$${subtotal.toLocaleString()}</span>
                        <button onclick="removeItem(${index}, event)" style="color:#ff4d4d; border:none; background:none; cursor:pointer; font-size:18px; font-weight:bold; padding:5px;">✕</button>
                    </div>
                </div>
            `;
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
