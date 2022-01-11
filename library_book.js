

// Create and access DOM elements. 
//////////////////  Form Fields  ///////////////////////////////////////////////
const bookSubmit = document.querySelector('.bookSubmit');
const cancelSubmit = document.querySelector('.cancelSubmitButton');
const addBook = document.querySelector('.addBook');
const submitBookButton = document.querySelector('.submitBookButton');
const form = document.getElementById('bookForm');
const bookName = document.getElementById('bookName');
const author = document.getElementById('author');
const pages = document.getElementById('pages');
const published = document.getElementById('published');
const read = document.getElementById('read');

//////////////////  Book Container  ///////////////////////////////////////////////
const bookShelf = document.querySelector('.bookShelf');


//////////////////  Create Book Card/////////////////////////////////////////////////
const create_book_card = function (book) {
    const card_container = document.createElement('div');
    card_container.classList.add('card_container');
    const card = document.createElement('div');
    const book_title = document.createElement('h3');
    const book_author = document.createElement('p');
    const book_pages = document.createElement('p');
    const book_publication = document.createElement('p');
    const book_has_been_read = document.createElement('p');

///////////////////  Buttons  ////////////////////////////////////////////////////////
    const card_button_container = document.createElement('div');
        card_button_container.classList.add('card_button_container');
    const book_update_info = document.createElement('button');
        book_update_info.classList.add('book_upd');
        book_update_info.textContent = 'Update Info'
    const book_remove = document.createElement('button');
        book_remove.classList.add('book_rmv');
        book_remove.textContent = 'Remove';

////////////////////  Add Event Listener///////////////////////////////////////////////    
    book_remove.addEventListener('click', (e) => {
        remove_book(e);
    });
    book_update_info.addEventListener('click', (e) => {
        update(e);
    })

////////////////////  Add Text To Elements //////////////////////////////////////////////
    card_container.setAttribute('id', `${book.bookId}`);
    book_title.textContent = `${book.title}`;
    book_author.textContent = `Author: ${book.author}`;
    book_pages.textContent = `Number of pages: ${book.pages}`;
    book_publication.textContent = `Published: ${book.publication_date}`;
    book_has_been_read.textContent = `This book has ${book.read == 'on' ? 'been read' : 'not been read'}`;
    
    
////////////////////  Append  ////////////////////////////////////////////////////////////
    card.append(book_title, book_author, book_pages, book_publication, book_has_been_read);
    card_button_container.append(book_update_info,book_remove);
    card_container.append(card, card_button_container);
    bookShelf.append(card_container);
}   


////////////////////  Book Object  ////////////////////////////////////////////////////////
class book {
    constructor(title, author, pages, published, read) {
        this.bookId = generator.next().value;
        this.title = title;
        this.author = author;
        this.pages = pages;
        this.publication_date = published;
        this.read = read;
    }
}
////////////////////  ID Generator  /////////////////////////////////////////////////////////
function* infinite() {
    let index = 0;
    while (true) {
        yield index++;
    }
}
const generator = infinite();


Storage.prototype.retrieve = function (item) {
    searched_item = JSON.parse(localStorage.getItem(item, JSON.stringify(item)));
    return searched_item;
}

Storage.prototype.addBook = function (book) {
        localStorage.setItem(`${book.title}`.toLowerCase(), JSON.stringify(book));
}

function remove_book(e) {
    current_book = e.currentTarget.parentNode.parentNode.firstChild;
    let current_book_title = current_book.firstChild.textContent.toLowerCase();
    let current_book_id = current_book.parentNode.getAttribute('id');
    let book_to_remove = localStorage.retrieve(current_book_title);
    if (book_to_remove['bookId'].toString() === current_book_id) {
        localStorage.removeItem(current_book_title);
    }
    display_books();
}

function populate_form(book) {
    current_book = book.currentTarget.parentNode.parentNode.firstChild;
    bookName.value = current_book.firstChild.textContent;
    author.value = (current_book.firstChild.nextElementSibling.textContent).slice(8);
    pages.value = (current_book.firstChild.nextElementSibling.nextElementSibling.textContent).slice(17);
    published.value = (current_book.firstChild.nextElementSibling.nextElementSibling.nextElementSibling.textContent).slice(10);
    read.checked = current_book.firstChild.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.textContent 
    == 'This book has been read' ? true : false;
}



function update(book) {
    populate_form(book);
    display_form();
}

const refresh_display = function () {
    while(bookShelf.firstChild){
        bookShelf.removeChild(bookShelf.firstChild);
    }
}

////////////////////////////////////////////////////////////////////////////////
function create_base_storage() {
localStorage.addBook(new book("The Hobbit", "J.R.R Tolkien", "295", "1975", 'on'));
localStorage.addBook(new book("The Temple", "Mathew Reilly", "490", "1990", 'off'));
localStorage.addBook(new book("Harry Potter", "J.K Rowling", "500", "2000", 'on'));
}
///////////////////////////////////////////////////////////////////////////////


function toggle(element) { 
    if(element.classList.contains('hideMe')) { 
        element.classList.remove('hideMe'); 
    } 
    else { 
        element.classList.add('hideMe'); 
    }
}

function display_form() {
    toggle(bookSubmit);
    toggle(addBook);
    toggle(bookShelf);
}

function display_books() {
    refresh_display();
    if (localStorage.length > 0){
        for (let i = localStorage.length-1; i >= 0; i--) {
            let current_title = localStorage.key(i);
            create_book_card(localStorage.retrieve(current_title));
        }
    }
}

function display_book(book) {
    let book_info = localStorage.getItem(book, JSON.stringify(book));
    return book_info;
}

function reset_form() {
    bookName.value = ''; author.value = ''; pages.value = ''; published.value ='';
    read.checked = false;
}

function check_storage() {
    let current_title = bookName.value;
    for (let i = localStorage.length-1; i >= 0; i--) {
        let old_title = localStorage.key(i);
        if (current_title.toLowerCase() == old_title.toLowerCase()) {
            localStorage.removeItem(localStorage.key(i));
        }
    }
}

// Event Listeners
//// Submit books to local_storage
addBook.addEventListener('click', () => {
    display_form();
});

form.addEventListener('submit', (e) => {
    e.preventDefault();
    check_storage();
    localStorage.addBook(new book(
        bookName.value, author.value, pages.value, published.value, read.checked == true ? 'on' : 'off'));
    reset_form();
    display_form();
    display_books();
});


cancelSubmit.addEventListener('click', () => {
    reset_form();
    display_form();
});

create_base_storage();
display_books();

