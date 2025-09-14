const express = require('express');
const cors = require('cors');
const fs = require('fs');


const PORT = 2000;
const app = express();

app.use(express.json());
app.use(cors());
app.use(express.json());

let books = JSON.parse(fs.readFileSync("books.json","utf-8"));
function saveBooksToFile() {
  fs.writeFileSync("books.json", JSON.stringify(books, null, 2));
}


app.get('/book',(req,res)=>{
    res.send(books); 
});
app.get('/book/:id',(req,res)=>{
    const id = req.params.id;
    const book = books.find(b => b.id == id);
    if(!book){
        res.status(404).send("The book is not Existed");
    }
    else res.send(book);
});
app.post('/book',(req,res)=>{
    const newBook = {
        id:books.length+1,
        title:req.body.title,
        author:req.body.author
    };
    books.push(newBook);
    saveBooksToFile();
    console.log(books);
    res.status(201).json(newBook);
});
app.put('/book/:id',(req,res)=>{
    const id = parseInt(req.params.id);
    console.log(id);
    const book = books.findIndex(b => b.id == id);
    books[book] = {id,...req.body};
    saveBooksToFile();
    console.log(books);
    res.status(200).send("The book detials is updated");
});
app.delete('/book/:id',(req,res)=>{
    const bookId = parseInt(req.params.id);
    books = books.filter(b => b.id !== bookId);
    saveBooksToFile();
    console.log(books);
    res.json({ message: "Book deleted successfully" });
});

app.listen(PORT,()=>console.log(`The server is running on ${PORT}`));
