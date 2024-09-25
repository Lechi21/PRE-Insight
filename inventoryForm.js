function togglePopup(){
    var screenWidth = window.innerWidth;
    var tabletView = 1200;
    var mobileView = 768;

    if (screenWidth >= 768){
        return toggleButton();
    } else if (screenWidth === 1200){
        return toggleButton();
    }
    else if (screenWidth <= 768){
        return window.location.replace('inventory2.html');
    }
};

//JavaScript to toggle popup visibility
function toggleButton(){
    var itemPage = document.getElementById('itemPage');
    var overlay = document.querySelector('.formOverlay');
    itemPage.style.display = 'block';
    overlay.style.display = 'block';
}

//JavaScript to ensure popup opens and stays open on first click
document.addEventListener('DOMContentLoaded', function (){
    const addProductButton = document.getElementById('add');
    const itemPage = document.getElementById('itemPage');
    var overlay = document.querySelector('.formOverlay');
    const itemCloseButton = document.getElementById('itemClose');

    addProductButton.addEventListener('click', function (event) {
        event.preventDefault(); // Prevent default form submission behavior
        itemPage.style.display = 'block';
        // overlay.style.display = 'block';
    });

    itemCloseButton.addEventListener('click', function (){
        itemPage.style.display = 'none';
        overlay.style.display = 'none';
    });
});




// Search and Filter Function

function filterTable() {
    const searchInput = document.getElementById('search-input').value.toLowerCase();
    const filterValue = document.getElementById('filter-select').value.toLowerCase();
    const table = document.getElementById('inventory-table');
    const rows = table.getElementsByTagName('tr');

    for (let i = 1; i < rows.length; i++) {
        const cells = rows[i].getElementsByTagName('td');
        let match = true;

        // Check search input
        if (searchInput) {
            match = false;
            for (let j = 0; j < cells.length; j++) {
                if (cells[j].innerText.toLowerCase().includes(searchInput)) {
                    match = true;
                    break;
                }
            }
        }

        // Check filter
        if (filterValue) {
            const itemCell = cells[1].innerText.toLowerCase();
            const stockCell = cells[3].innerText.toLowerCase();

            if (!(itemCell.includes(filterValue) || stockCell.includes(filterValue))) {
                match = false;
            }
        }

        rows[i].style.display = match ? '' : 'none';
    }
};
