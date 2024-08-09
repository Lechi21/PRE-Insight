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


    // Function to get the current date and format it
    function getCurrentDate() {
        var today = new Date();

        var daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        var monthsOfYear = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

        var dayOfWeek = daysOfWeek[today.getDay()];
        var day = today.getDate();
        var month = monthsOfYear[today.getMonth()];
        var year = today.getFullYear();

        // Get the correct suffix for the day
        var suffix = getDaySuffix(day);

        return dayOfWeek + " " + day + suffix + " " + month + " " + year;
    }

    function getDaySuffix(day) {
        if (day > 3 && day < 21) return "th"; // 4th to 20th are "th"
        switch (day % 10) {
            case 1: return "st";
            case 2: return "nd";
            case 3: return "rd";
            default: return "th";
        }
    }
    // Display the current date in the 'date' div
    document.getElementById('date').textContent = getCurrentDate();