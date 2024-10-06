$(document).ready(function () {
    $('#itemDropdown').select2({
        placeholder: 'Search for items...',
        allowClear: true,
        width: '100%',
        templateResult: formatOption, // Custom function for option rendering
        templateSelection: formatOption // Custom function for selected option rendering
    });

    fetchInventoryData();
});

// Custom format function
function formatOption(item) {
    // If the item has no id, return the item as plain text (used for placeholders)
    if (!item.id) {
        return item.text; 
    }

    const $option = $(
        `<span class="hover-option ${item.text === 'Add new item...' ? 'red-text' : ''}">
            ${item.text}
        </span>`
    );

    return $option; // Return the jQuery object
}

function fetchInventoryData() {
    // AJAX request to fetch inventory data from the backend
    $.ajax({
        url: "http://localhost:3000/product", // URL of the API endpoint for fetching products
        method: "GET", // Using GET method to retrieve data
        success: function (data) {
            // On success, populate the dropdown with the retrieved product data
            populateDropdown(data.products);
        },
        error: function () {
            // Handle errors and notify the user if the request fails
            alert("Failed to fetch inventory data. Please try again later.");
        }
    });
}

$("#itemDropdown").on('select2:select', function (e) {
    const selectedValue = e.params.data.id;
    const unitPriceInput = $("input[name='unitPrice']");
    const expensesInput = $("input[name='expenses']");

    if (selectedValue === "manual-entry") {
        // Show the manual entry input and allow manual unit price entry
        $("#manualItem").show();
        unitPriceInput.prop('readonly', false); // Allow manual unit price entry
        unitPriceInput.val(''); // Clear any existing value
        expensesInput.prop('disabled', false); // Disable the expenses input for manual items
        expensesInput.val(0);
    } else {
        // Hide the manual entry input and use the predefined unit price
        $("#manualItem").hide();
        const selectedOption = $(this).find("option:selected");
        const selectedPrice = parseFloat(selectedOption.data("price"));
        unitPriceInput.prop('readonly', true); // Prevent manual unit price changes
        unitPriceInput.val(selectedPrice ? selectedPrice.toFixed(2) : ''); // Set the selected item's price
        expensesInput.prop('disabled', false); // Enable the expenses input for pre-defined items
    }
});


function populateDropdown(products) {
    const $itemDropdown = $("#itemDropdown");
    $itemDropdown.empty();

    // Default "Select Item" option
    $itemDropdown.append('<option></option>'); // For Select2's placeholder

    // Loop through products and add options
    products.forEach(product => {
        $itemDropdown.append(`<option value="${product._id}" data-price="${product.sellingPrice}">${product.name}</option>`);
    });

    // Add manual entry option
    $itemDropdown.append('<option class="manual-entry" value="manual-entry">Add new item...</option>');

    // Event listener: when a user selects an item from the dropdown
    $itemDropdown.change(function () {
        const selectedOption = $(this).find("option:selected");
        const unitPriceInput = $("input[name='unitPrice']");
        const quantityInput = $("input[name='quantity']");
        const totalPriceInput = $("input[name='totalPrice']");

        // Get the price of the selected item and set it in the unit price field
        const selectedPrice = parseFloat(selectedOption.data("price"));
        unitPriceInput.val(selectedPrice.toFixed(2)); // Display price as a formatted number

        // Recalculate the total price based on the new selection
        calculateTotalPrice();
    });

    // Event listeners for the quantity and expenses fields to update total price
    const $quantityInput = $("input[name='quantity']");
    const $expensesInput = $("input[name='expenses']");

    $quantityInput.on("input", function () {
        // Validate quantity input before recalculating total price
        validateNumericInput($(this), 'quantity');
        calculateTotalPrice();
    });
    
    $expensesInput.on("input", function () {
        // Validate expenses input before recalculating total price
        validateNumericInput($(this), 'expenses');
        calculateTotalPrice();
    });
}

function validateNumericInput($input, fieldName) {
    // Validate that the input is a valid number and not negative
    const value = $input.val();
    if (isNaN(value) || value < 0) {
        alert(`Please enter a valid number for ${fieldName}.`); // Show an alert if input is invalid
        $input.val(''); // Clear the input field if the value is invalid
    }
}

function calculateTotalPrice() {
    const $itemDropdown = $("#itemDropdown");
    const selectedOption = $itemDropdown.find("option:selected");
    const $quantityInput = $("input[name='quantity']");
    const $unitPriceInput = $("input[name='unitPrice']");
    const $expensesInput = $("input[name='expenses']");
    const $totalPriceInput = $("input[name='totalPrice']");

    let unitPrice;
    let availableStock;

    // Check if manual entry is selected
    if (selectedOption.val() === "manual-entry") {
        // Get manually entered unit price
        unitPrice = parseFloat($unitPriceInput.val());
        availableStock = Infinity; // No stock limit for manual entry

        const quantity = parseFloat($quantityInput.val()); // Get entered quantity

        // Ensure that both unit price and quantity are valid
        if (!isNaN(unitPrice) && !isNaN(quantity)) {
            let total = unitPrice * quantity; // Calculate total WITHOUT expenses for manual entries
            $totalPriceInput.val(total.toFixed(2)); // Update total price input field
        } else {
            $totalPriceInput.val(""); // Clear total price if input is invalid
        }
    } else {
        // For predefined items, get unit price from selected dropdown item
        unitPrice = parseFloat(selectedOption.data("price"));
        availableStock = parseInt(selectedOption.data("stock")); // Get available stock from the selected item
        $unitPriceInput.val(unitPrice.toFixed(2)); // Update unit price input with selected item's price

        const quantity = parseFloat($quantityInput.val()); // Get entered quantity
        const expenses = parseFloat($expensesInput.val()) || 0; // Get expenses or default to 0

        // Check if the entered quantity exceeds available stock
        if (quantity > availableStock) {
            alert(`You cannot enter a quantity greater than the available stock (${availableStock}).`);
            $quantityInput.val(availableStock); // Adjust quantity to the max available stock
            return;
        }

        // Calculate the total price if the unit price and quantity are valid numbers
        if (!isNaN(unitPrice) && !isNaN(quantity)) {
            let total = unitPrice * quantity + expenses; // Calculate total with expenses for predefined items
            $totalPriceInput.val(total.toFixed(2)); // Update total price input field
        } else {
            $totalPriceInput.val(""); // Clear total price if input is invalid
        }
    }
}

function addForm(event) {
    event.preventDefault(); // Prevent form submission

    const selectedOption = $("#itemDropdown option:selected");
    const productId = selectedOption.val();

    let itemName;
    if (productId === "manual-entry") {
        const manualInput = $("#manualItemName"); // Select the manual entry input
        
        // Check if the manual input field exists and has a value
        if (manualInput.length > 0 && manualInput.val().trim()) {
            itemName = manualInput.val().trim(); // Get name from the input field and trim whitespace
        } else {
            alert("Please enter a valid item name.");
            return false;
        }
    } else {
        itemName = selectedOption.text(); // Use selected item name for non-manual entries
    }

    
    const quantity = parseFloat($("input[name='quantity']").val()); // Get the entered quantity
    const unitPrice = parseFloat($("input[name='unitPrice']").val()); // Get the unit price
    const expenses = parseFloat($("input[name='expenses']").val()); // Get the entered expenses
    const totalPrice = parseFloat($("input[name='totalPrice']").val()); // Get the calculated total price
    const note = $("#txArea").val(); // Get the note entered in the textarea
    const saveNotes = $('input[name="enableText"]').is(":checked"); // Check if user enabled saving notes

    // Validate the quantity to ensure it's a positive number
    if (!quantity || isNaN(quantity) || quantity <= 0) {
        alert("Please enter a valid quantity.");
        return false;
    }

    // Ensure that required fields are not empty
    if (!unitPrice || !totalPrice) {
        alert("Please complete all the required fields.");
        return false;
    }
    

    // Create an object representing the new item
    const newItem = {
        productId: productId !== "manual-entry" ? productId : null, // Exclude productId for manual entries
        name: itemName,
        quantity: quantity,
        unitPrice: unitPrice,
        totalPrice: totalPrice,
        expenses: expenses || 0,
        note: saveNotes ? note : "", // Save the note only if the user selected the option
    };

    // Display the new item in the preview section
    displayPreviewItem(newItem);

    // Reset the form fields after adding the item
    resetForm();

    // Close the popup after adding the item
    closePopup();
}

function handleDropdownChange() {
    const dropdown = document.getElementById('itemDropdown');
    const manualInput = document.getElementById('manualItemName');
    
    if (dropdown.value === 'manual-entry') {
        manualInput.style.display = 'block'; // Show manual input field
    } else {
        manualInput.style.display = 'none'; // Hide manual input field
    }
}

function closePopup() {
    // Hide the form overlay and the inventory form container
    $(".formOverlay").fadeOut();
    $(".inventory-box").fadeOut();
}

function resetForm() {
    // Reset the Select2 dropdown and clear selected value
    $("#itemDropdown").val(null).trigger('change'); // Reset Select2 dropdown to its placeholder

    // Reset manual entry fields if they are visible
    $("#manualItem").hide(); // Hide manual item input
    $("#manualItemName").val(''); // Clear manual item name input

    // Clear all input fields in the form
    $("input[name='quantity']").val('');
    $("input[name='unitPrice']").val('');
    $("input[name='expenses']").val('');
    $("input[name='totalPrice']").val('');
    $("#txArea").val('');
    $("input[name='enableText']").prop("checked", false); // Uncheck the "save notes" checkbox
}


function displayPreviewItem(item) {
    // Build the HTML structure for the preview item
    const itemHtml = `
        <div class="preview-item">
            <div class="checker">
                <div class="name-note">
                    <h4>${item.name}</h4>
                    <p class="note-text">${item.note ? item.note : "No notes added"}</p>
                </div>
                <div class="price-quantity">
                    <p class="tos">${item.totalPrice}</p>
                    <p>${item.quantity} Pieces</p>
                </div>
            </div>
            <div class="edit-delete-buttons">
                <button class="delete-item" onclick="deleteItem(this)">Remove</button>
            </div>
        </div>
    `;

    // Append the preview item to the preview container
    $(".preview-container").append(itemHtml);
}

function deleteItem(button) {
    $(button).closest(".preview-item").remove(); // Remove the item
}

function closeSales() {
    // Clear all preview items when closing sales
    $(".preview-container").empty();
}
