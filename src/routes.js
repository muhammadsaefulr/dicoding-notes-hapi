const { addBooksByHandler, getBooksByIdHandler, editBooksByIdHandler, deleteBooksByIdHandler, getAllBooksByHandler } = require('./handler');
const routes = [
    {
         method: 'POST',
         path: '/books',
        handler: addBooksByHandler,
    },
    {
        method: 'GET',
        path: '/books',
        handler: getAllBooksByHandler,
    },
    {
        method: 'GET',
        path: '/books/{id}',
        handler: getBooksByIdHandler,
    },
    {
        method: 'PUT',
        path: '/books/{id}',
        handler: editBooksByIdHandler,
    },
    {
        method: 'DELETE',
        path: '/books/{id}',
        handler: deleteBooksByIdHandler,
    },
];

module.exports = routes;
