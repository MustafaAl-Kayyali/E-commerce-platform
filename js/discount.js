
window.onload = function () {
    products = JSON.parse(localStorage.getItem("products")) || [];
    const select = document.getElementById("productSelect");

    products.forEach((product, index) => {
        const option = document.createElement("option");
        option.value = index;
        option.textContent = product.name;
        select.appendChild(option);
    });

    document.getElementById("discountForm").addEventListener("submit", function (e) {
        e.preventDefault();
        applyDiscount();
    });
};


function applyDiscount() {
    const select = document.getElementById("productSelect");
    const selectedIndex = parseInt(select.value);
    const discountInput = document.getElementById("discount");
    const startDateInput = document.getElementById("startDate");
    const endDateInput = document.getElementById("endDate");

    if (isNaN(selectedIndex) || selectedIndex < 0 || selectedIndex >= products.length) {
        alert("Please select a valid product.");
        return;
    }

    const discountPercentage = parseFloat(discountInput.value);
    if (isNaN(discountPercentage) || discountPercentage < 0 || discountPercentage > 100) {
        alert("Please enter a valid discount percentage (0–100).");
        return;
    }

    const startDate = new Date(startDateInput.value);
    const endDate = new Date(endDateInput.value);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        alert("Please enter valid start and end dates.");
        return;
    }

    if (startDate >= endDate) {
        alert("End date must be after start date.");
        return;
    }

    const product = products[selectedIndex];

    if (!product.originalPrice) {
        product.originalPrice = product.price;
    }

    product.discount = {
        percentage: discountPercentage,
        start: startDate.toISOString(),
        end: endDate.toISOString()
    };

    localStorage.setItem("products", JSON.stringify(products));

    alert(`Discount of ${discountPercentage}% applied to "${product.name}" from ${startDate.toLocaleString()} to ${endDate.toLocaleString()}.`);

    discountInput.value = "";
    startDateInput.value = "";
    endDateInput.value = "";
    select.value = "";
}
