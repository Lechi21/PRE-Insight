// Event Listener for Form Submission
$(document).ready(function () {
    // Set the Stock Date using your existing getCurrentDate function
    $('#date').text(getCurrentDate());

    // Function to load existing products from the server
    function loadProducts() {
        $.ajax({
            type: 'GET',
            url: 'http://localhost:3000/product', // Server endpoint to fetch products
            success: function (response) {
                $('#inventory-list').empty();

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

                 // Handle row click to redirect to preview.html with the product ID
                $('#inventory-list').on('click', 'tr', function() {
                    const productId = $(this).data('id');
                    
                    // Redirect to preview.html with the product ID in the query string
                    window.location.href = `editProduct.html?id=${encodeURIComponent(productId)}`;
                });
            },
            error: function (error) {
                console.log('Error fetching products:', error);
            }
        });
    };

    // Call loadProducts when the document is ready
    loadProducts();

    // Event Listener for form submissions for both forms
    $('#itemPage, #itemPage2').on('submit', function (e) {
        // e.preventDefault(); // Prevent default form submission

        const formId = $(this).attr('id'); // Get the ID of the form being submitted
        // Conditionally prevent form submission only for itemPage2
        if (formId === 'itemPage2') {
            e.preventDefault(); // Prevent default form submission for itemPage2
        }
        
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
            success: function (response) {
                console.log(response);

                const imageUrl = `http://localhost:3000/${response.createdProduct.productImage}`;

                const newRow = $(`<tr>
                        <td><img src="${imageUrl}" class="item-table-image" width="50"></td>
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
                    </tr>`);

                $('#inventory-list').append(newRow);

                // Conditional behavior based on form ID
                if (formId === 'itemPage') {
                    // For #itemPage, hide the form and the overlay
                    $('#itemPage').hide();
                    $('.formOverlay').hide();
                } else if (formId === 'itemPage2') {
                    // For #itemPage2, redirect to /inventory.html
                    window.location.href = 'inventory.html';
                }

                // Clear the form fields
                $('#' + formId)[0].reset();
                $('#date').text(getCurrentDate()); // Reset stock date

            },
            error: function (error) {
                alert('Error adding item');
                console.log(error);
            }
        });
    });
});