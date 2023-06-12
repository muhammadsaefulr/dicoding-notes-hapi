const { nanoid } = require("nanoid");
const books = require('./books');

// Baris Untuk Menghandle Permintaan Menambah Buku
const addBooksByHandler = async (request, h) => {
    try {
      const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;
      const insertedAt = new Date().toISOString();
      const updatedAt = insertedAt;
      const finished = pageCount === readPage;
      const id = nanoid(16);
     
      //Jika Nama Buku Kosong Maka Akan Menjalkan Kode Ini
      if (!name) {
        return h.response({
          status: 'fail',
          message: 'Gagal menambahkan buku. Mohon isi nama buku',
        }).code(400);
      }
     //Jika Readpage Lebih besar dari pageCount Maka Kode Akan Menjalan Kode Ini Untuk Mengembalikan Respons Yang Diminta
      if (pageCount < readPage) {
        return h.response({
          status: 'fail',
          message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
        }).code(400);
      }
  
      const newBooks = {
        id,
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        finished,
        reading,
        insertedAt,
        updatedAt,
      };
  
      books.push(newBooks);
  //Jika Buku Berhasil Di Tambahkan Maka Kode Akan Menjalan Kode Ini Untuk Mengembalikan Respons Yang Diminta 
      const isSuccess = books.some(book => book.id === id);
      if (isSuccess) {
        return h.response({
          status: 'success',
          message: 'Buku berhasil ditambahkan',
          data: {
            bookId: id,
          },
        }).code(201);
      }
  //Jika Buku Gagal Di Tambahkan Maka Kode Akan Menjalan Kode Ini Untuk Mengembalikan Respons Yang Diminta
      return h.response({
        status: 'error',
        message: 'Buku gagal ditambahkan',
      }).code(500);
    } catch (error) {
      return h.response({
        status: 'error',
        message: error.message,
      }).code(500);
    }
  };
  

//Baris Untuk Menghandle Mengambil Data Buku Dari ID
const getBooksByIdHandler = async (request, h) =>{
   const { id } = request.params;
   console.log(books);
   const book = books.filter((book) => book.id === id)[0];
//Jika Buku Ditemukan Maka Kode Ini Akan Menampilkan Data Json
   if(book){
    const response = h.response({
        status: 'success',
        data: {
            book
        }
    });
    response.code(200);
    return response;
   }
//Jika Buku Tidak Ditemukan Maka Kode Akan Menjalan Kode Ini Untuk Mengembalikan Respons Yang Diminta
   const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan'
   });
   response.code(404);
   return response;
};

//Baris Untuk Menghandle Pengeditan Buku
const editBooksByIdHandler = async (request, h) => {
    const { id } = request.params;

    const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;
    const index = books.findIndex((book) => book.id === id);
    if(index !== -1){

       //Jika Nama Buku Kosong Maka Akan Menjalkan Kode Ini
       if (!name) {
        return h.response({
          status: 'fail',
          message: 'Gagal memperbarui buku. Mohon isi nama buku',
        }).code(400);
      }

     //Jika Readpage Lebih besar dari pageCount Maka Kode Akan Menjalan Kode Ini Untuk Mengembalikan Respons
      if (pageCount < readPage) {
        return h.response({
          status: 'fail',
          message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
        }).code(400);
      }

        const finished = pageCount == readPage ? true : false;
        const updatedAt = new Date().toISOString();
        books[index] = {
            ...books[index],
            name, 
            year, 
            author, 
            summary, 
            publisher, 
            pageCount, 
            readPage,
            finished, 
            reading, 
            updatedAt
        }
        //Jika Data Buku Berhasil Diperbarui Maka Akan Menjalankan Proses Ini
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil diperbarui'
        });
        response.code(200);
        return response;
    }
    //Jika Id Buku Tidak Ada Maka Akan Menjalankan Proses Ini
    const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Id tidak ditemukan'
    });

    response.code(404);
    return response;

};

//Baris Untuk Menghandle Proses Penghapusan Data Buku
const deleteBooksByIdHandler = async (request, h) => {
    const { id } = request.params;

    const index = books.findIndex((book) => book.id === id)
    
    //Jika Proses Penghapusan Berhasil
    if(index > -1){
        books.splice(index, 1);
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil dihapus',
        });
        response.code(200);
        return response;
    }
    // Jika Id Buku Tidak Ditemukan Maka Proses Penghapusan Di Batalkan
    const response = h.response({
        status: 'fail',
        message: 'Buku gagal dihapus. Id tidak ditemukan',
    });
    response.code(404);
    return response;
};

const getAllBooksByHandler = async (request, h) => {
  const { name, reading, finished } = request.query;
  let booksFilter = books;

  if(name){
      booksFilter = booksFilter.filter((book) => book.name.toLowerCase().includes(name.toLowerCase()));
  }

  if(reading){
      booksFilter = booksFilter.filter((book) => book.reading == Number(reading));    
  }

  if(finished){
      booksFilter = booksFilter.filter((book) => book.finished == Number(finished));    
  }

  const response = h.response({
      status : 'success',
      data : {
          books: booksFilter.map((book) => ({
              id : book.id,
              name: book.name,
              publisher: book.publisher
          }))     
      }        
  });

  response.code(200);
  return response;
}


module.exports = { 
  addBooksByHandler,
  getBooksByIdHandler,
  editBooksByIdHandler,
  deleteBooksByIdHandler,
  getAllBooksByHandler
};
