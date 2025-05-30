window.onload = function () {
    const products = JSON.parse(localStorage.getItem("products")) || [];
    const productList = document.querySelector(".product-list");

    if (!productList) {
        console.error("No element with class 'product-list' found.");
        return;
    }

    if (products.length === 0) {
        productList.innerHTML = "<p>No products available.</p>";
        return;
    }

    products.forEach((product, index) => {
        const productElement = document.createElement("div");
        productElement.className = "product-item";
        productElement.innerHTML = `
            <img src="${product.image}" alt="${product.name}" style="width: 120px; height: auto;">
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <div>
                <button id="minus-${index}" onclick="quantityMinus(${index})" disabled>-</button>
                <span class="quantity" id="quantity-${index}">0</span>
                <button id="plus-${index}" onclick="quantityPlus(${index})">+</button>
            </div>
            <p class="price">${parseFloat(product.price).toFixed(2) } </p>
            <button onclick="addToCart(${index})">Add to Cart</button>
        `;
        productList.appendChild(productElement);
    });
};

function updateButtonStates(index, currentQuantity, maxQuantity) {
    const minusBtn = document.getElementById(`minus-${index}`);
    const plusBtn = document.getElementById(`plus-${index}`);

    minusBtn.disabled = currentQuantity <= 0;
    plusBtn.disabled = currentQuantity >= maxQuantity;
}
let MaxQuantity=0;
function quantityPlus(index) {
    const products = JSON.parse(localStorage.getItem("products")) || [];
    const quantityElement = document.getElementById(`quantity-${index}`);
    let currentQuantity = parseInt(quantityElement.textContent) || 0;
    const maxQuantity = products[index]?.quantity || 0;
    

    if (currentQuantity < maxQuantity) {
        currentQuantity += 1;
        quantityElement.textContent = currentQuantity;
        MaxQuantity=currentQuantity;
    }
    console.log(MaxQuantity);

    updateButtonStates(index, currentQuantity, maxQuantity);
}

function quantityMinus(index) {
    const products = JSON.parse(localStorage.getItem("products")) || [];
    const quantityElement = document.getElementById(`quantity-${index}`);
    let currentQuantity = parseInt(quantityElement.textContent) || 0;

    if (currentQuantity > 0) {
        currentQuantity -= 1;
        quantityElement.textContent = currentQuantity;
        MaxQuantity=currentQuantity;
    }
        console.log(MaxQuantity);

    const maxQuantity = products[index]?.quantity || 0;
    updateButtonStates(index, currentQuantity, maxQuantity);
}

function addToCart(index) {
    const products = JSON.parse(localStorage.getItem("products")) || [];
    const quantityElement = document.getElementById(`quantity-${index}`);
    const quantity = parseInt(quantityElement.textContent) || 0;

    if (quantity <= 0) {
        alert("Please select a quantity greater than 0.");
        return;
    }

    const maxQuantity = products[index]?.quantity || 0;

    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    const existingItem = cart.find(item => item.productId === index);
    const totalInCart = existingItem ? existingItem.quantity + quantity : quantity;

    if (totalInCart > maxQuantity) {
        alert(`Only ${maxQuantity - (existingItem?.quantity || 0)} item(s) remaining for this product.`);
        return;
    }

    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({ productId: index, quantity });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    alert(`Added ${quantity} item(s) of product "${products[index]?.name}" to the cart.`);
    quantityElement.textContent = 0;

    updateButtonStates(index, 0, maxQuantity);
}
function getCurrentProductPrice(product) {
    const now = new Date();

    if (
        product.discount &&
        product.discount.start &&
        product.discount.end &&
        new Date(product.discount.start) <= now &&
        now <= new Date(product.discount.end)
    ) {
        const discountedPrice = product.originalPrice - (product.originalPrice * product.discount.percentage / 100);
        return parseFloat(discountedPrice).toFixed(2);
    }

    return parseFloat(product.originalPrice || product.price).toFixed(2);
}
