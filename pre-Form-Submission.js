function addSales(event) {
    event.preventDefault(); // Prevent the default form submission behavior

    const selectedOption = $("#itemDropdown option:selected");
    const productId = selectedOption.val(); // Get the selected productId from the dropdown
    const itemName = selectedOption.text(); // Get the selected item name (if you need to display it)
    const quantity = $("input[name='quantity']").val(); // Get the entered quantity
    const unitPrice = $("input[name='unitPrice']").val(); // Get the unit price
    const expenses = $("input[name='expenses']").val(); // Get the entered expenses
    const totalPrice = $("input[name='totalPrice']").val(); // Get the calculated total price
    const note = $("#txArea").val(); // Get the note entered in the textarea
    const saveNotes = $('input[name="enableText"]').is(":checked"); // Check if the user enabled saving notes

    // Log values for debugging
    console.log('Product ID:', productId);
    console.log('Quantity:', quantity);

    // Create an object representing the new sale
    const newSale = {
        productId: productId, // Pass the productId as expected by the backend
        quantity: quantity,
        expenses: expenses || 0,
        note: saveNotes ? note : "" // Save the note only if the user selected the option
    };

    // Send the new sale data to the server via AJAX
    $.ajax({
        url: "http://localhost:3000/sales", // URL of your API endpoint for posting sales
        method: "POST",
        data: JSON.stringify(newSale),
        contentType: "application/json",
        success: function (response) {
            // Display the new item in the preview section
            displayPreviewItem({
                name: itemName, // We still need the name for display purposes
                quantity: newSale.quantity,
                totalPrice: totalPrice
            });

            // Add the new sale to the table
            addSaleToTable({
                name: itemName, // Displaying the name as per your table
                quantity: newSale.quantity,
                totalPrice: totalPrice
            });

            // Reset the form fields after adding the item
            resetForm();
        },
        error: function (xhr, status, error) {
            console.log(xhr.responseText); // Log the error response for debugging
            alert("Failed to add sale. Please try again later.");
        }
    });
}
