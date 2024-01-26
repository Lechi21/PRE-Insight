"use strict";

const Orders = [
    {
        addItem: "",
        salesDate: '06.01.2024',
        startingAmount: '5700',
        closingAmount: '85700',
        // status: 'Pending'
    },
    {
        addItem: "",
        salesDate: '#',
        startingAmount: '#',
        closingAmount: '#',
        // status: 'Declined'
    },
    {
        addItem: "",
        salesDate: '#',
        startingAmount: '#',
        closingAmount: '#',
        // status: 'Active'
    },
]
Orders.forEach(order => {
    const tr = document.createElement('tr');
    const trContent = `
        <td>${order.addItem}</td>
        <td>${order.salesDate}</td>
        <td>${order.startingAmount}</td>
        <td>${order.closingAmount}</td>
    `;
    tr.innerHTML = trContent;
    document.querySelector('table tbody').appendChild(tr);
});


$(document).ready(function () {

    $.validator.setDefaults({
        errorClass: 'form_error',
        errorElement: 'label'
    });

    $("#messageForm").validate({
        ignore: [],
        rules: {
            message: {
                minlength: 5,
                maxlength: 1024,
                required: true
            }
        },
        messages: {
            message: {
                required: "Please insert at least 5 characters."
            }
        }
    });
});


var addingMessage = false;

function updateAddedLog() {
    if (!addingMessage && $("#messageForm").valid()) {
        addingMessage = true;
        $.ajax({type: 'POST',
            data: {
                'id': $('#messageForm').find('#id').val(),
                'message': $('#messageForm').find('#message').val()
            },

            url: $("#addLogURL").val(),
            success: function (data) {
                $("#message").val('');
                $("#addedLog").before(data);
            },
            error: function (data) {
                alert(data);
            },
            complete: function (jqXHR, textStatus) {
                addingMessage = false;
            }
        });
    }
}
