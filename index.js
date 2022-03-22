// IMPORTING THE MODULES
const express = require('express')
const exphbs = require("express-handlebars")
const pool = require('./db/comn')

const app = express()

//CONFIG OF THE HANDLEBARS
app.engine('handlebars', exphbs.engine())
app.set('view engine', 'handlebars')

//CONFIG FOR TO GET THE BODY
app.use(
    express.urlencoded({
        extended: true
    })
)
app.use(express.json())

// CONFIG OF THE CSS
app.use(express.static('public'))

//ROUTERS
app.post('/books/insertbook', (req,res) => { //ENVIANDO DADOS PARA O DB
    const title = req.body.title 
    const pageqty = req.body.pageqty

    const sql = `INSERT INTO books (??, ??) VALUES (?,?)`
    const data = ['title','pagesqty', title, pageqty]

    pool.query(sql, data, (err) => {
        if(err){
            console.log(err)
        }
        res.redirect('/books')
    })
})

app.get('/books', (req,res) => { //PEGAR TODOS OS DADOS DO DB
    const sql = "SELECT * FROM books"

    pool.query(sql, (err, data) => {
        if(err){
            console.log(err)
            return
        }

        const books = data
        //console.log(books)
        res.render('books', {books})

    })
})

// MAIN ROUTER
app.get('/', (req, res) => {
    res.render('home')
})

app.get('/books/:id', (req,res) => { //PEGAR APEGAS UM DADO ESPECIFICO PELA URL PARA O DATABASE
    const id = req.params.id
    const sql = `SELECT * FROM books WHERE ?? = ?`

    const data = ['id', id]

    pool.query(sql, data, (err, data) => {
        if(err){
            console.log(err)
            return
        }
        const book = data[0]
        res.render('book', {book})
    })
})

app.get('/books/edit/:id', (req,res) => {
    const id = req.params.id
    const sql = `SELECT * FROM books WHERE id = ${id}`


    pool.query(sql, (err, data) => {
        if(err){
            console.log(err)
            return
        }

        const book = data[0]
        res.render('editbook', {book})
    })
})

app.post('/books/updadatebook', (req, res) => {

    const id =  req.body.id
    const title = req.body.title
    const pageqty = req.body.pageqty

    const sql = `UPDATE books SET ?? = ?, ?? = ? WHERE id = ${id}`
    const data = ['title', title, 'pagesqty', pageqty]

    pool.query(sql, data, (err) => {
        if(err){
            console.log(err)
            return
        }
        res.redirect('/books')
    })

})

app.post('/books/remove/:id', (req,res) => {
    const id = req.params.id
    const sql = `DELETE FROM books WHERE id = ${id}`

    pool.query(sql, (err) => {
        if(err){
            console.log(err)
            return
        }
        res.redirect('/books')
    })
})

app.listen(3000) //PORT