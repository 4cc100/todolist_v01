// jshint esversion: 6

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

require('dotenv').config()

const app = express();

mongoose.connect(process.env.DB_URL, {useNewUrlParser: true}); 

const itemsSchema = new mongoose.Schema({
  name: String
});

const Item = mongoose.model("Item", itemsSchema);

const todo1 = new Item({
  name:"Welcome to your todo list"
});

const todo2 = new Item({
  name:"Use + button to add a new todo"
});

const todo3 = new Item({
  name:"Use the checkbox to uncheck todo"
});

const defaultItems = [todo1, todo2, todo3]

// Item.insertMany(defaultItems, (err) => {
//   if (err) {
//     console.log(err);
//   } else {
//     console.log("Defaults added succesfully");
//   }
// });


app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('public'));

app.get('/', function(req, res){
 
  Item.find({}, (err, results) => {
    res.render("list", {listTitle: "Today", newListItems: results });
  });

});

app.post('/', function(req, res) {
  const item = req.body.newItem;

  if(req.body.list === "Work"){
    workItems.push(item);
    res.redirect('/work');
  } else {
    items.push(item);
    res.redirect('/');
  }
});

app.get('/work', function(req, res) {
  res.render('list', {listTitle: "Work List", newListItems: workItems});
});

app.get('/about', function(req, res) {
  res.render('about');
});

app.listen(3000, function() {
  console.log("The server is running on port 3000");
});
