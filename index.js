import pg from "pg";
import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

app.listen(port, ()=> {
    console.log(`listening ${port}`);
});

app.use(bodyParser.urlencoded({extended: false}));

app.use(express.static("public"));

const db = new pg.Client({
    user: "postgres",
    password: "#####",
    host: "localhost",
    port: 5432,
    database: "books"
});

db.connect();

app.get("/", async (req, res) =>
{
    let books = await db.query("SELECT * FROM book ORDER BY registered DESC");
    console.log(books.rows);
    res.render("index.ejs", {books: books.rows});
});

app.get("/create", async(req, res) => 
{
    res.render("create.ejs");
});

app.post("/create", async(req, res) => 
{
    console.log(req.body);
    let title = req.body.title;
    let author = req.body.author;
    let url = `https://www.googleapis.com/books/v1/volumes?q=intitle:${encodeURIComponent(title)}+inauthor:${encodeURIComponent(author)}`;
    let book = await axios(url);
    console.log(book.data);
    if (book.data.totalItems == 0)
    {
        res.sendStatus(404);
        return;
    }

    let creation = new Date();
    let insert = await db.query("INSERT INTO book (name, description, img, registered, rating) VALUES ($1, $2, $3, $4, $5) RETURNING id", 
        [title, req.body.desc, book.data.items[0].volumeInfo.imageLinks.thumbnail, creation, req.body.rating]);

    if (insert.rows.length == 0)
    {
        res.sendStatus(404);
        return;
    }

    for(const key in req.body){
        if(key.indexOf("note")===0){
            await db.query("INSERT INTO note (registered, text, book_id) VALUES ($1, $2, $3)", 
            [creation, req.body[key], insert.rows[0].id]);
           }
     }

    res.redirect("/book?id=" + insert.rows[0].id);
});

app.get("/book", async (req, res) =>
{
    if (!req.query.id)
    {
        res.sendStatus(404);
        return;
    }


    let book = await db.query("SELECT * FROM book WHERE id = $1 LIMIT 1", [req.query.id]);
    if (book.rows.length == 0)
    {
        res.sendStatus(404);
        return;
    }

    let notes = await db.query("SELECT text FROM note WHERE book_id = $1", [req.query.id]);

    res.render("book.ejs", {book: book.rows[0], notes: notes.rows});
});

app.get("/edit", async (req, res) =>
{
    if (!req.query.id)
    {
        res.sendStatus(404);
        return;
    }


    let book = await db.query("SELECT * FROM book WHERE id = $1 LIMIT 1", [req.query.id]);
    if (book.rows.length == 0)
    {
        res.sendStatus(404);
        return;
    }

    let notes = await db.query("SELECT text FROM note WHERE book_id = $1", [req.query.id]);

    res.render("edit.ejs", {book: book.rows[0], notes: notes.rows});
});

app.delete("/book/:bookid", async (req, res) => {
    if (!req.params.bookid)
    {
        res.sendStatus(404);
        return;
    }

    await db.query("DELETE FROM note WHERE book_id = $1", [req.params.bookid]);
    await db.query("DELETE FROM book WHERE id = $1", [req.params.bookid]);
    res.sendStatus(200);

});

app.post("/edit/book/:bookid", async (req, res) => {
    if (!req.params.bookid)
    {
        res.sendStatus(404);
        return;
    }

    await db.query("DELETE FROM note WHERE book_id = $1", [req.params.bookid]);
    await db.query("UPDATE book SET description = $1, rating = $2  WHERE id = $3", 
    [req.body.desc, req.body.rating, req.params.bookid]);
    let creation = new Date();

    for(const key in req.body){
        if(key.indexOf("note")===0){
            await db.query("INSERT INTO note (registered, text, book_id) VALUES ($1, $2, $3)", 
            [creation, req.body[key], req.params.bookid]);
           }
     }

    res.redirect("/book?id=" + req.params.bookid);
});