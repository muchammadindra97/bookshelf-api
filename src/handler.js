const { nanoid } = require('nanoid')
const books = require('./books')

const addBookHandler = (request, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading
  } = request.payload

  if (typeof name === 'undefined' || name === null) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku'
    })

    response.code(400)
    return response
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'
    })

    response.code(400)
    return response
  }

  const id = nanoid(16)
  const finished = pageCount === readPage
  const insertedAt = new Date().toISOString()
  const updatedAt = insertedAt

  const newBook = {
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
    updatedAt
  }

  books.push(newBook)

  const response = h.response({
    status: 'success',
    message: 'Buku berhasil ditambahkan',
    data: {
      bookId: newBook.id
    }
  })

  response.code(201)
  return response
}

const getAllBooksHandler = (request) => {
  const { name, reading, finished } = request.query

  let result = books

  if (name) {
    result = result.filter(book => book.name.toLowerCase().includes(name.toLowerCase()))
  }

  if (parseInt(reading) === 1) {
    result = result.filter(book => book.reading === true)
  } else if (parseInt(reading) === 0) {
    result = result.filter(book => book.reading === false)
  }

  if (parseInt(finished) === 1) {
    result = result.filter(book => book.finished === true)
  } else if (parseInt(finished) === 0) {
    result = result.filter(book => book.finished === false)
  }

  return {
    status: 'success',
    data: { books: result.map(({ id, name, publisher }) => ({ id, name, publisher })) }
  }
}

const getBookByIdHandler = (request, h) => {
  const { id } = request.params

  const book = books.find(b => b.id === id)

  if (book !== undefined) {
    return {
      status: 'success',
      data: { book }
    }
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan'
  })

  response.code(404)
  return response
}

const editBookByIdHandler = (request, h) => {
  const { id } = request.params
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading
  } = request.payload

  if (typeof name === 'undefined' || name === null) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku'
    })

    response.code(400)
    return response
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount'
    })

    response.code(400)
    return response
  }

  const bookIndex = books.findIndex(b => b.id === id)

  if (bookIndex !== -1) {
    const updatedAt = new Date().toISOString()

    books[bookIndex] = {
      ...books[bookIndex],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      updatedAt
    }

    return {
      status: 'success',
      message: 'Buku berhasil diperbarui'
    }
  }

  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan'
  })

  response.code(404)
  return response
}

const deleteBookByIdHandler = (request, h) => {
  const { id } = request.params

  const bookIndex = books.findIndex(book => book.id === id)

  if (bookIndex !== -1) {
    books.splice(bookIndex, 1)

    return {
      status: 'success',
      message: 'Buku berhasil dihapus'
    }
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan'
  })

  response.code(404)
  return response
}

module.exports = {
  addBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler
}
