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

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('public'));

app.get('/', (req, res) => {
 
  Item.find({}, (err, results) => {
    if(results.length === 0) {
      Item.insertMany(defaultItems, (err) => {
        if (err) {
          console.log(err);
        } else {
          console.log("Defaults added succesfully");
        }
      });
      res.redirect('/');
    } else {
      res.render("list", {listTitle: "Today", newListItems: results });
    }

  });

});

app.post('/', (req, res) => {
  const itemName = req.body.newItem;

  const newItem = new Item({
    name: itemName
  });

  newItem.save();
  res.redirect('/');

});

app.post('/delete', (req, res) => {
  const checkedItemId = req.body.checkbox;
  Item.findByIdAndRemove({_id: checkedItemId}, (err) => {
    if(err) {
      console.log(err);
    } else {
      console.log("Deleted item successfully");
      res.redirect('/');
    }
  })
});

app.get('/work', (req, res) => {
  res.render('list', {listTitle: "Work List", newListItems: workItems});
});

app.get('/about', (req, res) => {
  res.render('about');
});

app.listen(3000, () => {
  console.log("The server is running on port 3000");
});
