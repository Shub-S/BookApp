// //document.addEventListener("DOMContentLoaded", function() {
//   const bookForm = document.getElementById("bookForm");

//   bookForm.addEventListener("submit", function(event) {
//     event.preventDefault();

//     const bookName = document.getElementById("bookName").value;
//     const bookAuthor = document.getElementById("bookAuthor").value;
//     const bookDescription = document.getElementById("bookDescription").value;

//     console.log("Book Name:", bookName);
//     console.log("Book Author:", bookAuthor);
//     console.log("Book Description:", bookDescription);

//     // Add your form submission logic here (e.g., sending data to the server via AJAX)
    
//     // Close the modal after submission
//     const modalElement = document.getElementById('bookModal');
//     const modal = bootstrap.Modal.getInstance(modalElement);
//     modal.hide();

//     // Optionally, clear the form fields after submission
//     bookForm.reset();
//   });
// });



document.addEventListener("DOMContentLoaded", function() {
    const bookForm = document.getElementById("bookForm");

    // Fetch all existing books and add them to the table
    $.ajax({
        url: 'http://localhost:8000/navneet/api/books',
        method: 'GET',
        success: function(data) {
            const books = data.books;
            books.forEach(function(book) {
                addBookToTable(book);
            });
        },
        error: function(err) {
            alert('Error fetching books');
        }
    });

    bookForm.addEventListener("submit", function(event) {
        event.preventDefault();

        const bookName = document.getElementById("bookName").value;
        const bookAuthor = document.getElementById("bookAuthor").value;
        const bookDescription = document.getElementById("bookDescription").value;

        const bookData = {
            bookName: bookName,
            bookAuthor: bookAuthor,
            bookDesc: bookDescription
        };
        console.log(bookData);

        // Send POST request to server
        $.ajax({
            url:'http://localhost:8000/navneet/api/book',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': document.querySelector('input[name="csrfmiddlewaretoken"]').value
            },
            data: JSON.stringify(bookData),
            success: function(data){
                    if (data.success) {
                        // Add the new book to the table
                        addBookToTable({
                            bookId: data.bookId, 
                            bookName: bookName,
                            bookAuthor: bookAuthor,
                            bookDesc: bookDescription
                        });
        
                        // Close the modal and reset the form
                        const modalElement = document.getElementById('bookModal');
                        const modal = bootstrap.Modal.getInstance(modalElement);
                        modal.hide();
                        bookForm.reset();
                    }
            }  ,
            error:function(err){
                alert('Error adding book');
            }
        })
        
    });

    function addBookToTable(bookData) {
        const tableBody = document.querySelector(".table-group-divider");
        const row = document.createElement("tr");
        row.setAttribute('data-id', bookData.bookId);
        row.innerHTML = `
            <th scope="row">${bookData.bookId}</th>
            <td>${bookData.bookName}</td>
            <td>${bookData.bookAuthor}</td>
            <td>${bookData.bookDesc}</td>
            <td>
                <button class="btn btn-warning edit-button" data-id="${bookData.bookId}">Edit</button>
                <button class="btn btn-danger delete-button" data-id="${bookData.bookId}">Delete</button>
            </td>
        `;
        tableBody.appendChild(row);
        addEventListenersToRow(row);
    }

    function addEventListenersToRow(row) {
        const editButton = row.querySelector(".edit-button");
        const deleteButton = row.querySelector(".delete-button");

        editButton.addEventListener("click", handleEditButtonClick);
        deleteButton.addEventListener("click", handleDeleteButtonClick);
    }

    function handleEditButtonClick() {
        const row = this.closest("tr");
        const bookId = row.getAttribute('data-id');
        const bookNameCell = row.querySelector("td:nth-child(2)");
        const bookAuthorCell = row.querySelector("td:nth-child(3)");
        const bookDescCell = row.querySelector("td:nth-child(4)");
        const actionCell = row.querySelector("td:nth-child(5)");

        const bookName = bookNameCell.innerText;
        const bookAuthor = bookAuthorCell.innerText;
        const bookDesc = bookDescCell.innerText;

        bookNameCell.innerHTML = `<input type="text" class="form-control" value="${bookName}">`;
        bookAuthorCell.innerHTML = `<input type="text" class="form-control" value="${bookAuthor}">`;
        bookDescCell.innerHTML = `<input type="text" class="form-control" value="${bookDesc}">`;
        actionCell.innerHTML = `
            <button class="btn btn-success save-button" data-id="${bookId}">Save</button>
            <button class="btn btn-secondary cancel-button" data-id="${bookId}">Cancel</button>
        `;

        const saveButton = actionCell.querySelector(".save-button");
        const cancelButton = actionCell.querySelector(".cancel-button");

        saveButton.addEventListener("click", handleSaveButtonClick);
        cancelButton.addEventListener("click", handleCancelButtonClick);
    }

    function handleSaveButtonClick() {
        const row = this.closest("tr");
        const bookId = row.getAttribute('data-id');
        const bookNameCell = row.querySelector("td:nth-child(2)");
        const bookAuthorCell = row.querySelector("td:nth-child(3)");
        const bookDescCell = row.querySelector("td:nth-child(4)");

        const updatedBookData = {
            bookName: bookNameCell.querySelector("input").value,
            bookAuthor: bookAuthorCell.querySelector("input").value,
            bookDesc: bookDescCell.querySelector("input").value
        };

        $.ajax({
            url: `http://localhost:8000/navneet/api/books/${bookId}/update`,
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': document.querySelector('input[name="csrfmiddlewaretoken"]').value
            },
            data: JSON.stringify(updatedBookData),
            success: function(data) {
                if (data.success) {
                    bookNameCell.innerHTML = updatedBookData.bookName;
                    bookAuthorCell.innerHTML = updatedBookData.bookAuthor;
                    bookDescCell.innerHTML = updatedBookData.bookDesc;
                    handleCancelButtonClick.call(this); // Reset action buttons
                }
            }.bind(this),
            error: function(err) {
                alert('Error updating book');
            }
        });
    }

    function handleCancelButtonClick() {
        const row = this.closest("tr");
        const bookId = row.getAttribute('data-id');
        const bookNameCell = row.querySelector("td:nth-child(2)");
        const bookAuthorCell = row.querySelector("td:nth-child(3)");
        const bookDescCell = row.querySelector("td:nth-child(4)");
        const actionCell = row.querySelector("td:nth-child(5)");

        const bookName = bookNameCell.querySelector("input").value;
        const bookAuthor = bookAuthorCell.querySelector("input").value;
        const bookDesc = bookDescCell.querySelector("input").value;

        bookNameCell.innerHTML = bookName;
        bookAuthorCell.innerHTML = bookAuthor;
        bookDescCell.innerHTML = bookDesc;
        actionCell.innerHTML = `
            <button class="btn btn-warning edit-button" data-id="${bookId}">Edit</button>
            <button class="btn btn-danger delete-button" data-id="${bookId}">Delete</button>
        `;

        addEventListenersToRow(row);
    }

    function handleDeleteButtonClick() {
        const row = this.closest("tr");
        const bookId = row.getAttribute('data-id');

        $.ajax({
            url: `http://localhost:8000/navneet/api/books/${bookId}/remove`,
            method: 'DELETE',
            headers: {
                'X-CSRFToken': document.querySelector('input[name="csrfmiddlewaretoken"]').value
            },
            success: function(data) {
                if (data.succes) {
                    row.remove();
                }
            },
            error: function(err) {
                alert('Error deleting book');
            }
        });
    }
});
