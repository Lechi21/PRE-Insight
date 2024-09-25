$(document).ready(function () {
    // Get the productId from the URL query string
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    if (productId) {
        // Fetch the product details from the server using the product ID
        $.ajax({
            type: 'GET',
            url: `http://localhost:3000/product/${productId}`, // Server endpoint to fetch the product by ID
            success: function (response) {
                const product = response.product; // Assuming response.product contains the product details

                // Populate the page with product details
                $('#productCoverImage').attr('src', `http://localhost:3000/${product.productImage}`);
                $('h1').text(product.name);
                $('#productId').text(product._id);
                $('#productName').val(product.name); // Populate form input fields
                $('#productDescription').val(product.description);
                $('#availableStock').val(product.availableStock);
                $('#purchasePrice').val(product.purchasePrice ? product.purchasePrice.toFixed(2) : '0.00');
                $('#sellingPrice').val(product.sellingPrice ? product.sellingPrice.toFixed(2) : '0.00');
            },
            error: function (error) {
                console.log('Error fetching product details:', error);
            }
        });
    } else {
        alert('No product ID found in the URL');
    }

    // Attach click event handler for the edit button
    $('#editBtn').click(function () {
        const productId = $('#productId').text(); // Get the product ID from the populated field
        editForm(productId); // Call the edit form function with the product ID
    });

    // Handle form submission inside the modal
    $('#modalForm').on('submit', function (e) {
        e.preventDefault(); // Prevent default form submission behavior

        const productId = $('#productId').text().trim(); // Get and trim the product ID

        // Capture updated form data
        const updatedProduct = {
            name: $('#productName').val(),
            description: $('#productDescription').val(),
            availableStock: $('#availableStock').val(),
            purchasePrice: $('#purchasePrice').val(),
            sellingPrice: $('#sellingPrice').val()
        };

        // Use FormData to handle file upload along with other form data
        const formData = new FormData();
        Object.keys(updatedProduct).forEach(key => {
            formData.append(key, updatedProduct[key]); // Append all fields to FormData
        });

        // If there's an image being uploaded, append it to FormData
        if ($('#productImageUrl')[0].files[0]) {
            formData.append('productImage', $('#productImageUrl')[0].files[0]);
        }

        // Send PATCH request to update the product
        $.ajax({
            url: `http://localhost:3000/product/${productId}`, // Use productId correctly
            type: 'PATCH',
            data: formData,
            processData: false, // Required for FormData
            contentType: false, // Required for FormData
            success: function (response) {
                alert('Product updated successfully!');
                window.location.href = 'inventory.html'; // Optionally redirect to inventory
            },
            error: function (error) {
                alert('Error updating product');
                console.error('Update Error:', error);
            }
        });
    });
});

// Function to show the edit form modal
function editForm(productId) {
    console.log('Editing product with ID:', productId); // Debugging
    // Show the edit product modal
    $('#editProductModal').css('display', 'block');

    // Close the modal when the close button is clicked
    $('.close').click(function () {
        $('#editProductModal').css('display', 'none');
    });
}

function deleteForm() {
    // Show the pop-up
    $('#deleteConfirmationPopup').css('display', 'flex');

    // Get the product ID
    const productId = $('#productId').text();
    // When the delete button in the pop-up is clicked
    $('#confirmDelete').on('click', function () {
        $.ajax({
            url: `http://localhost:3000/product/${productId}`,
            type: 'DELETE',
            success: function (response) {
                // Redirect to the products list or homepage
                window.location.href = 'inventory.html'; // Adjust the URL as needed
            },
            error: function (error) {
                alert('Error deleting product');
                console.error('Delete Error:', error);
            }
        });
        // Hide the pop-up after deletion
        $('#deleteConfirmationPopup').css('display', 'none');
    });
    // When the cancel button in the pop-up is clicked
    $('#cancelDelete').on('click', function () {
        // Hide the pop-up
        $('#deleteConfirmationPopup').css('display', 'none');
    });
}
