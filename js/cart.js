window.addEventListener('DOMContentLoaded', function () {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const cartItemsContainer = document.getElementById("cartItems");
    const emptyCart = document.getElementById("emptyCart");
    const itemCount = document.getElementById("itemCount");
    const subtotalElement = document.getElementById("subtotal");
    const totalElement = document.getElementById("total");
    const checkoutBtn = document.getElementById("checkoutBtn");

    if (cart.length === 0) {
        emptyCart.style.display = "block";
        itemCount.textContent = "0 items";
        checkoutBtn.disabled = true;
        return;
    }

    emptyCart.style.display = "none";
    checkoutBtn.disabled = false;

    let totalItems = 0;
    let subtotal = 0;

    cart.forEach((item, index) => {
        const now = new Date();
        let currentPrice = item.price;
        
        // Check if discount is still valid
        if (item.discountInfo && 
            new Date(item.discountInfo.start) <= now && 
            now <= new Date(item.discountInfo.end)) {
            currentPrice = item.price; // Use stored discounted price
        } else if (item.discountInfo) {
            // Discount has expired, use original price
            currentPrice = item.originalPrice;
            // Update the item's price in cart
            cart[index].price = item.originalPrice;
            localStorage.setItem("cart", JSON.stringify(cart));
        }

        const itemPrice = parseFloat(currentPrice);
        const itemQuantity = parseInt(item.quantity);
        const itemTotal = itemPrice * itemQuantity;

        totalItems += itemQuantity;
        subtotal += itemTotal;

        const itemElement = document.createElement("div");
        itemElement.className = "cart-item";
        
        let priceDisplay = `<p>Price: $${itemPrice.toFixed(2)}</p>`;
        if (item.discountInfo && 
            new Date(item.discountInfo.start) <= now && 
            now <= new Date(item.discountInfo.end)) {
            priceDisplay = `
                <p>
                    <span style="text-decoration: line-through; color: gray;">$${item.originalPrice.toFixed(2)}</span>
                    <span style="color: red; font-weight: bold;">$${itemPrice.toFixed(2)}</span>
                    <small style="color: green;">(${item.discountInfo.percentage}% off)</small>
                </p>`;
        }

        itemElement.innerHTML = `
            <div class="item-image">
                <img src="${item.image || item.img}" alt="${item.name}" />
            </div>
            <div class="item-details">
                <h4>${item.name}</h4>
                <p>${item.description}</p>
                ${priceDisplay}
                <p>Quantity: ${itemQuantity}</p>
                <p>Total: $${itemTotal.toFixed(2)}</p>
                <button class="btn btn-danger remove-btn" data-index="${index}" style="margin-top: 10px; 
                border-radius: 4px; color: white; border: none; padding: 10px; font-size: 14px; display: flex; align-items: center; justify-content: center;">
                    <i class="fas fa-trash"></i> Remove
                </button>
            </div>
        `;
        cartItemsContainer.appendChild(itemElement);
    });

    itemCount.textContent = `${totalItems} item${totalItems > 1 ? "s" : ""}`;
    subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
    totalElement.textContent = `$${subtotal.toFixed(2)}`;

    const removeButtons = document.querySelectorAll('.remove-btn');
    removeButtons.forEach(button => {
        button.addEventListener('click', function () {
            const index = parseInt(this.getAttribute('data-index'));
            cart.splice(index, 1); 
            localStorage.setItem("cart", JSON.stringify(cart));
            location.reload();
        });
    });
});
