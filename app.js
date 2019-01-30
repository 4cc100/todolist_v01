// jshint esversion: 6

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const _ = require('lodash');
require('dotenv').config()

const app = express();

mongoose.connect(process.env.DB_URL, {useNewUrlParser: true}); 

const itemsSchema = new mongoose.Schema({
  name: String
});

const Item = mongoose.model("Item", itemsSchema);


const listSchema = new mongoose.Schema({
  name: String,
  items: [itemsSchema]
});

const List = mongoose.model("List", listSchema);


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
  const listName = req.body.list;

  const item = new Item({
    name: itemName
  });

  if (listName === "Today") {
    item.save();
    res.redirect('/');
  } else {
    List.findOne({name: listName}, (err, results) => {
      results.items.push(item);
      results.save();
      res.redirect('/' + _.lowerCase(listName));
    });
  }


});

app.post('/delete', (req, res) => {
  const checkedItemId = req.body.checkbox;
  const listName = req.body.listName;

  if (listName === "Today") {
    Item.findByIdAndRemove({_id: checkedItemId}, (err) => {
      if (!err) {
        console.log("Deleted item successfully");
        res.redirect('/');
      }
    });
  } else {
    List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkedItemId}}}, (err, results)=>{
      if (!err) {
        res.redirect('/' + _.lowerCase(listName));
      }
    });
  }
 
});

app.get('/:customList', (req, res) => {
  const listName = req.params.customList;


  List.findOne({name: _.capitalize(listName)}, (err, results) => {
    if (!err){
      if (!results) {
        const list = new List({
          name: _.capitalize(listName),
          items: defaultItems
        });
        list.save();
        res.redirect('/' + _.lowerCase(listName));
      } else {
        res.render('list', {listTitle: _.capitalize(results.name), newListItems: results.items });
      }
    } 
  });
});

app.get('/about', (req, res) => {
  res.render('about');
});

app.listen(process.env.PORT || 3000, () => {
  console.log("The server has started successfully");
});
