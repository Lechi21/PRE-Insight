$(document).ready(function () {
    fetchInventoryData();
});

function fetchInventoryData() {
    // Fetch inventory data from the backend
    $.ajax({
        url: "http://localhost:3000/product", // Ensure this is your actual endpoint
        method: "GET",
        success: function (data) {
            populateDropdown(data.products); // Assuming the response contains an array of products
        },
        error: function (error) {
            console.error("Error fetching inventory data:", error);
        }
    });
}

function populateDropdown(products) {
    const $itemDropdown = $("#itemDropdown");

    // Clear existing options
    $itemDropdown.empty();

    // Add default "Select Item" option
    const defaultOption = $("<option>", {
        text: "Select Item",
        disabled: true,
        selected: true
    });
    $itemDropdown.append(defaultOption);

    // Populate dropdown with product names
    products.forEach(product => {
        const option = $("<option>", {
            value: product._id, // Use product ID as value
            text: product.name, // Display product name
            "data-price": product.sellingPrice, // Attach price as a data attribute for later use
            "data-stock": product.availableStock // Store available stock
        });
        $itemDropdown.append(option);
    });

    // Event listener to update unit price when an item is selected
    $itemDropdown.change(function () {
        const selectedOption = $(this).find("option:selected");
        const unitPriceInput = $("input[name='unitPrice']");
        const quantityInput = $("input[name='quantity']");
        const totalPriceInput = $("input[name='totalPrice']");

        // Set unit price from the selected item's selling price
        const selectedPrice = parseFloat(selectedOption.data("price"));
        unitPriceInput.val(selectedPrice.toFixed(2));

        // Calculate total price if quantity is already entered
        calculateTotalPrice();
    });

    // Event listeners for quantity and expenses changes
    const $quantityInput = $("input[name='quantity']");
    const $expensesInput = $("input[name='expenses']");

    // Event listener to calculate total price when quantity is entered or changed
    $quantityInput.on("input", calculateTotalPrice);
    $expensesInput.on("input", calculateTotalPrice);
}

function calculateTotalPrice() {
    const $itemDropdown = $("#itemDropdown");
    const selectedOption = $itemDropdown.find("option:selected");
    const unitPrice = parseFloat(selectedOption.data("price"));
    const availableStock = parseInt(selectedOption.data("stock")); // Get available stock
    const $quantityInput = $("input[name='quantity']");
    const $expensesInput = $("input[name='expenses']");
    const $totalPriceInput = $("input[name='totalPrice']");

    const quantity = parseFloat($quantityInput.val());
    const expenses = parseFloat($expensesInput.val());

    // Validate quantity against available stock
    if (quantity > availableStock) {
        alert(`You cannot enter a quantity greater than the available stock (${availableStock}).`);
        $quantityInput.val(availableStock); // Optionally set quantity to available stock
        return; // Exit the function if quantity is invalid
    }

    // Ensure the selected item, quantity, and optional expenses are valid numbers
    if (!isNaN(unitPrice) && !isNaN(quantity)) {
        let total = unitPrice * quantity;

        // If expenses are provided, add them to the total calculation
        if (!isNaN(expenses)) {
            total += expenses; // Assuming expense is per item, hence multiply by quantity
        }

        $totalPriceInput.val(total.toFixed(2));
    } else {
        $totalPriceInput.val(""); // Clear total price if invalid inputs
    }
}
