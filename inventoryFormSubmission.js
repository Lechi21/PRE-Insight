
// Event Listener for Form Submission

$(document).ready(function() {
    // Set the Stock Date using your existing getCurrentDate function
    $('#date').text(getCurrentDate());

    // Function to load existing products from the server
    function loadProducts() {
        $.ajax({
            type: 'GET',
            url: 'http://localhost:3000/product', // Server endpoint to fetch products
            success: function(response) {
                // Clear the current table contents
                $('#inventory-list').empty();

                // Populate the table with the existing products
                response.products.forEach(product => {
                    const newRow = `
                        <tr>
                            <td>${product._id}</td>
                            <td>${product.name}</td>
                            <td>${product.description}</td>
                            <td>${product.availableStock}</td>
                            <td>${product.stockDate}</td>
                            <td>${product.purchasePrice}</td>
                            <td>${product.sellingPrice}</td>
                        </tr>
                    `;
                    $('#inventory-list').append(newRow);
                });
            },
            error: function(error) {
                console.log('Error fetching products:', error);
            }
        });
    }

    // Call loadProducts when the document is ready
    loadProducts();

    $('#itemPage').on('submit', function(e) {
        e.preventDefault(); // Prevent default form submission

        // Collect the Form Data
        const itemName = $('input[name="itemName"]').val();
        const description = $('input[name="description"]').val();
        const availableStock = $('input[name="availableStock"]').val();
        const purchasePrice = $('input[name="purchasePrice"]').val();
        const sellingPrice = $('input[name="sellingPrice"]').val();
        const stockDate = $('#date').text(); // Getting the current date value from the Stock Date div

        const formData = {
            itemName: itemName,
            description: description,
            availableStock: availableStock,
            purchasePrice: purchasePrice,
            sellingPrice: sellingPrice,
            stockDate: stockDate
        };

        // Send Data to the Server
        $.ajax({
            type: 'POST',
            url: 'http://localhost:3000/product', // Server endpoint
            data: JSON.stringify(formData),
            contentType: 'application/json',
            success: function(response) {
                alert('Item added successfully!');
                console.log(response);

                // Add the new product to the table
                const newRow = `
                    <tr>
                        <td>${response.createdProduct._id}</td>
                        <td>${response.createdProduct.name}</td>
                        <td>${response.createdProduct.description}</td>
                        <td>${response.createdProduct.availableStock}</td>
                        <td>${response.createdProduct.stockDate}</td>
                        <td>${response.createdProduct.purchasePrice}</td>
                        <td>${response.createdProduct.sellingPrice}</td>
                    </tr>
                `;
                $('#inventory-list').append(newRow);

                // Clear the form fields
                $('#itemPage')[0].reset();
                $('#date').text(getCurrentDate()); // Reset stock date

                // Close the form and overlay
                $('#itemPage').hide(); // Hide the form
                $('.formOverlay').hide(); // Hide the overlay
            },
            error: function(error) {
                alert('Error adding item');
                console.log(error);
            }
        });
    });

    // Function to toggle the popup visibility
    function togglePopup() {
        $('#itemPage').toggle(); // Toggles visibility
        $('.formOverlay').toggle(); // Toggles visibility
    }

    // Event listeners for opening and closing the popup
    $('#add').on('click', function(event) {
        event.preventDefault(); // Prevent default behavior
        togglePopup(); // Show the popup
    });

    $('#itemClose').on('click', function() {
        togglePopup(); // Hide the popup
    });
});
