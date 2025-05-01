document.addEventListener('DOMContentLoaded', () => {
    const addBookForm = document.getElementById('addBookForm');
    const booksContainer = document.getElementById('booksContainer');

    const fetchBooks = async () => {
        const response = await fetch('https://webtechnologyproject.onrender.com/books');
        const books = await response.json();
        renderBooks(books);
    };

    const renderBooks = (books) => {
        booksContainer.innerHTML = books.map(book => `
            <div class="book-card" data-id="${book.id}">
                <div>
                    <h3>${book.title}</h3>
                    <p>By ${book.author}</p>
                </div>
                <div class="book-actions">
                    <button class="edit-btn" onclick="editBook(${book.id})">Edit</button>
                    <button onclick="deleteBook(${book.id})">Delete</button>
                </div>
            </div>
        `).join('');
    };

    addBookForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const newBook = {
            title: document.getElementById('title').value,
            author: document.getElementById('author').value
        };

        await fetch('https://webtechnologyproject.onrender.com/books', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newBook)
        });

        addBookForm.reset();
        fetchBooks();
    });

    fetchBooks();
});

window.deleteBook = async (id) => {
    await fetch(`https://webtechnologyproject.onrender.com/books/${id}`, { method: 'DELETE' });
    location.reload();
};


window.editBook = (id) => {
    const bookCard = document.querySelector(`[data-id="${id}"]`);
    const title = bookCard.querySelector('h3').textContent;
    const author = bookCard.querySelector('p').textContent.replace('By ', '');
    
    bookCard.innerHTML = `
        <form onsubmit="saveBook(${id})">
            <input value="${title}" required>
            <input value="${author}" required>
            <button type="submit">Save</button>
        </form>
    `;
};

window.saveBook = async (id) => {
    const form = event.target;
    const updatedBook = {
        title: form.querySelector('input:nth-child(1)').value,
        author: form.querySelector('input:nth-child(2)').value
    };

    await fetch(`https://webtechnologyproject.onrender.com/books/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedBook)
    });

    location.reload();
};
