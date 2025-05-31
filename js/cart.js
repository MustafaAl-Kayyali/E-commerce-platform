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
        const itemPrice = parseFloat(item.price);
        const itemQuantity = parseInt(item.quantity);
        const itemTotal = itemPrice * itemQuantity;

        totalItems += itemQuantity;
        subtotal += itemTotal;

        const itemElement = document.createElement("div");
        itemElement.className = "cart-item";
        itemElement.innerHTML = `
            <div class="item-image">
                <img src="${item.img}" alt="${item.name}" />
            </div>
            <div class="item-details">
                <h4>${item.name}</h4>
                <p>${item.description}</p>
                <p>Price: $${itemPrice.toFixed(2)}</p>
                <p>Quantity: ${itemQuantity}</p>
                <p>Total: $${itemTotal.toFixed(2)}</p>
                <button class="btn btn-danger remove-btn" data-index="${index}" style="margin-top: 10px;     border-radius: 4px;  color: white; border: none; padding: 10 font-size: 14px; display: flex; align-items: center; justify-content: center;"
" >
                    <i class="fas fa-trash"></i> Remove
                </button>
            </div>
        `;
        cartItemsContainer.appendChild(itemElement);
    });

    itemCount.textContent = `${totalItems} item${totalItems > 1 ? "s" : ""}`;
    subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
    totalElement.textContent = `$${subtotal.toFixed(2)}`;

    // ✅ التعامل مع زر الحذف
    const removeButtons = document.querySelectorAll('.remove-btn');
    removeButtons.forEach(button => {
        button.addEventListener('click', function () {
            const index = parseInt(this.getAttribute('data-index'));
            cart.splice(index, 1); // احذف العنصر
            localStorage.setItem("cart", JSON.stringify(cart)); // تحديث التخزين
            location.reload(); // إعادة تحميل الصفحة لتحديث العرض
        });
    });
});
