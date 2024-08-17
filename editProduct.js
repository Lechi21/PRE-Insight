
$(document).ready(function() {
    const urlParams = new URLSearchParams(window.location.search);

    const imageUrl = urlParams.get('imageUrl');
    const name = urlParams.get('name');
    const description = urlParams.get('description');
    const availableStock = urlParams.get('availableStock');
    const purchasePrice = urlParams.get('purchasePrice');
    const sellingPrice = urlParams.get('sellingPrice');
    const productId = urlParams.get('id');
    
    // Set the product image
    $('#productCoverImage').attr('src', decodeURIComponent(imageUrl));
    
    // Set the product name in the heading
    $('h1').text(decodeURIComponent(name));
    
    // Set the product details
    $('#productId').text(productId);
    $('#productDescription').text(decodeURIComponent(description));
    $('.availableStock').text(decodeURIComponent(availableStock));
    $('#purchasePrice').text(`NGN${decodeURIComponent(purchasePrice)}`);
    $('#sellingPrice').text(`NGN${decodeURIComponent(sellingPrice)}`);
});


function editForm() {
    // Get the product details
    const productId = $('#productId').text();
    const name = $('h1').text();
    const description = $('#productDescription').text();
    const availableStock = $('.availableStock').text();
    const purchasePrice = $('#purchasePrice').text().replace('NGN', '').trim();
    const sellingPrice = $('#sellingPrice').text().replace('NGN', '').trim();
    const imageUrl = $('#productCoverImage').attr('src');

    // Prepare data to be sent for updating
    const updatedProduct = {
        name: name,
        description: description,
        availableStock: availableStock,
        purchasePrice: parseFloat(purchasePrice), // Ensure price is a number
        sellingPrice: parseFloat(sellingPrice),   // Ensure price is a number
        imageUrl: imageUrl
    };

    // Sending data to server (update endpoint)
    $.ajax({
        url: `http://localhost:3000/product/${productId}`,
        type: 'PATCH',
        data: JSON.stringify(updatedProduct),
        contentType: 'application/json',
        success: function(response) {
            alert('Product updated successfully');
            // Optionally redirect or update the UI
        },
        error: function(error) {
            alert('Error updating product');
            console.error(error);
        }
    });
}



function deleteForm() {
     // Get the product ID
    const productId = $('#productId').text();

    $.ajax({
        url: `http://localhost:3000/product/${productId}`,
        type: 'DELETE',
        success: function(response) {
            alert('Product deleted successfully');
            // Redirect to the products list or homepage
            window.location.href = 'inventory.html'; // Adjust the URL as needed
        },
        error: function(error) {
            alert('Error deleting product');
            console.error(error);
        }
    });
}

