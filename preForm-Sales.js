
$(document).ready(function () {
    $('#itemDropdown').select2({
        placeholder: 'Search for items...',
        allowClear: true,
        width: '100%',
        templateResult: formatOption, // Custom function for option rendering
        templateSelection: formatOption // Custom function for selected option rendering
    });

    fetchInventoryData(); // Fetch inventory data
    fetchSalesData();     // Fetch existing sales data to index.html
});

let cartItems = []; // Declare cartItems in the global scope
let currentSerialNumber = 1;

// Custom format function
function formatOption(item) {
    // If the item has no id, return the item as plain text (used for placeholders)
    if (!item.id) {
        return item.text;
    }

    const $option = $(
        `<span class="hover-option">
            ${item.text}
        </span>`
    );

    return $option; // Return the jQuery object
}

function fetchInventoryData() {
    // Fetch inventory data from the backend
    $.ajax({
        url: "http://localhost:3000/product", // Ensure this is your actual endpoint
        method: "GET",
        success: function (data) {
            console.log('Inventory data:', data);
            populateDropdown(data.products); // Assuming the response contains an array of products
        },
        error: function (error) {
            console.error("Failed to fetch inventory data. Please try again later.", error);
        }
    });
}

function populateDropdown(products) {
    const $itemDropdown = $("#itemDropdown");

    // Clear existing options
    $itemDropdown.empty();

    $itemDropdown.append('<option></option>');

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

function addForm(event) {
    event.preventDefault();

    const selectedOption = $("#itemDropdown option:selected");
    const productId = selectedOption.val();
    const itemName = selectedOption.text();
    const quantity = parseFloat($("input[name='quantity']").val());
    const unitPrice = parseFloat($("input[name='unitPrice']").val());
    const expenses = parseFloat($("input[name='expenses']").val()) || 0;
    const totalPrice = parseFloat($("input[name='totalPrice']").val());
    const note = $("#txArea").val();
    const saveNotes = $('input[name="enableText"]').is(":checked");

    if (!productId || isNaN(quantity) || quantity <= 0 || isNaN(unitPrice) || isNaN(totalPrice)) {
        alert("Please enter valid values for all required fields.");
        return false;
    }

    const newItem = {
        productId: productId,
        name: itemName,
        quantity: quantity,
        unitPrice: unitPrice,
        totalPrice: totalPrice,
        expenses: expenses,
        note: saveNotes ? note : "", // Include the note if selected
    };

    // Add the new item to the cart array
    cartItems.push(newItem);

    // Display the new item in the preview-container
    displayPreviewItem(newItem);

    // Reset form fields after adding item
    resetForm();
    closePopup();
}

function closePopup() {
    $(".formOverlay").fadeOut();
    $(".inventory-box").fadeOut();
}


function resetForm() {
    // Reset the Select2 dropdown and clear selected value
    $("#itemDropdown").val(null).trigger('change'); // Reset Select2 dropdown to its placeholder

    // Clear all input fields in the form
    $("input[name='quantity']").val('');
    $("input[name='unitPrice']").val('');
    $("input[name='expenses']").val('');
    $("input[name='totalPrice']").val('');
    $("#txArea").val('');
    $("input[name='enableText']").prop("checked", false); // Uncheck the "save notes" checkbox
}

function displayPreviewItem(item) {
    const itemHtml = `
        <div class="preview-item" data-product-id="${item.productId}">
            <div class="checker">
                <div class="name-note">
                    <h4>${item.name}</h4>
                    <p class="note-text">${item.note ? item.note : "No notes added"}</p>
                </div>
                <div class="price-quantity">
                    <p class="tos">Total: ${item.totalPrice}</p>
                    <p>${item.quantity} Pieces</p>
                </div>
            </div>
            <div class="edit-delete-buttons">
                <button class="delete-item" onclick="deleteItem(this, '${item.productId}')">Remove</button>
            </div>
        </div>
    `;
    $(".preview-container").append(itemHtml);
}

function deleteItem(button, productId) {
    $(button).closest(".preview-item").remove(); // Remove item from DOM

    // Remove the item from cartItems array
    cartItems = cartItems.filter(item => item.productId !== productId);
}

function closeSales() {
    $(".preview-container").remove();
}


// SEND SALES TO DATABASE AND UPDATE CART AND TABLE
function addSales(event) {
    event.preventDefault();

    if (cartItems.length === 0) {
        alert("No items in the cart to submit.");
        return;
    }

    // Prepare the payload
    const salesData = {
        items: cartItems
    };

    // Send the cart items to the server using AJAX
    $.ajax({
        url: "http://localhost:3000/sales",
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify(salesData), // Send data as JSON
        success: function(response) {
            console.log("Sales successfully submitted:", response);
            alert("Sales successfully submitted.");

            // Clear the cart and preview container after successful submission
            cartItems = [];
            $(".preview-container").empty();

             // Summarize all the items into a single table row
            const totalQuantity = response.createdSales.reduce((sum, item) => sum + item.quantity, 0);
            const totalAmount = response.createdSales.reduce((sum, item) => sum + item.totalAmount, 0);
            const itemNames = response.createdSales.map(item => item.name).join(', ');
                const newRow = `
                    <tr>
                        <td>${currentSerialNumber++}</td>
                        <td>${itemNames}</td>
                        <td>${totalQuantity}</td>
                        <td>${totalAmount.toFixed(2)}</td>
                    </tr>
                `;
            // Append the new consolidated row to the sales table
            const $tableBody = $(".stock-sales tbody");
            $tableBody.append(newRow);

            // Optionally, clear any previously entered sales data in the form
            resetForm();
        },
        error: function(error) {
            console.error("Failed to submit sales:", error);
            alert("Failed to submit sales. Please try again.");
        }
    });
}

function fetchSalesData() {
    // Fetch existing sales data from the backend
    $.ajax({
        url: "http://localhost:3000/sales", // Ensure this is your actual sales endpoint
        method: "GET",
        success: function(data) {
            console.log('Sales data:', data);
            populateSalesTable(data.sales); // Assuming the response contains an array of sales
        },
        error: function(error) {
            console.error("Failed to fetch sales data. Please try again later.", error);
        }
    });
}

function populateSalesTable(sales) {
    const $tableBody = $(".stock-sales tbody");

    // Clear existing rows (optional, if you want to refresh the table every time)
    $tableBody.empty();

    // Populate the table with sales data
    sales.forEach(item => {
        const newRow = `
            <tr>
                <td>${currentSerialNumber++}</td>
                <td>${item.name}</td>
                <td>${item.quantity}</td>
                <td>${item.totalAmount.toFixed(2)}</td>
            </tr>
        `;
        $tableBody.append(newRow);
    });
}


