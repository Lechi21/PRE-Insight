
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
                    const imageUrl = `http://localhost:3000/${product.productImage}`;
                    const newRow = `
                        <tr data-id="${product._id}">
                            <td><img src="${imageUrl}" class="item-table-image" width="50"></td>
                            <td class="item-name-column">
                                <div class="item-table-name">
                                    <strong>${product.name}</strong>
                                </div>
                                <div class="item-table-id">
                                    ${product._id}
                                </div>
                            </td>
                            <td class="description-column">${product.description}</td>
                            <td>${product.availableStock}</td>
                            <td>${product.stockDate}</td>
                            <td>${product.purchasePrice}</td>
                            <td>${product.sellingPrice}</td>
                        </tr>
                    `;
                    $('#inventory-list').append(newRow);
                });

                $('#inventory-list').on('click', 'tr', function() {
                    const productId = $(this).data('id');
                    window.location.href = `editProduct.html?id=${productId}`;
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

        // Create FormData object to handle file and text data
        const formData = new FormData(this); // 'this' refers to the form element

        // Add the current date manually to the form data
        formData.append('stockDate', $('#date').text());

        // Send Data to the Server
        $.ajax({
            type: 'POST',
            url: 'http://localhost:3000/product', // Server endpoint
            data: formData,
            processData: false, // Prevent jQuery from automatically transforming the data into a query string
            contentType: false, // Needed to tell jQuery not to set content type header
            success: function(response) {
                alert('Item added successfully!');
                console.log(response);

                // Add the new product to the table
                const newRow = $(`
                    <tr>
                    <td><img src="${response.createdProduct.productImage}" class="item-table-image" width="50"></td>
                        <td class="item-name-column">
                            <div class="item-table-name">
                                <strong>${response.createdProduct.name}</strong>
                            </div>
                            <div class="item-table-id">
                                ${response.createdProduct._id}
                            </div>
                        </td>
                        <td class="description-column">${response.createdProduct.description}</td>
                        <td>${response.createdProduct.availableStock}</td>
                        <td>${response.createdProduct.stockDate}</td>
                        <td>${response.createdProduct.purchasePrice}</td>
                        <td>${response.createdProduct.sellingPrice}</td>
                    </tr>
                `);

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
});