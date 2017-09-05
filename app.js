const express = require('express'),
  mustacheExpress = require('mustache-express'),
  bodyParser = require('body-parser'),
  sequelize = require('sequelize'),
  models = require("./models");

const app = express();

app.engine('mustache', mustacheExpress());
app.set('views', './views');
app.set('view engine', 'mustache')

app.use(bodyParser.urlencoded({
  extended: false
}));

app.get('/', function(req, res) {
  res.render("index");
})

app.get('/items', function(req, res) {
  models.Item.findAll()
    .then(function(itemsList) {
      res.render('itemsGui', {
        itemsList: itemsList
      })
    console.log('iiiitems', itemsList);})
})
app.get('/newItem', function(req,res){
  res.render('newItem')
})

app.post('/createItem_form', function(req, res) {

  const userToCreate = models.Item.build({
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    quantity: req.body.quantity
  })
  userToCreate.save().then(function() {
    res.redirect('/items')
  })
})


  app.post('/delete_item/:idOfTheUser', function(req, res) {
    console.log('the id is   ' + req.params.idOfTheUser);
    models.Item.destroy({
      where: {
        id: req.params.idOfTheUser
      }
    }).then(function(){
      res.redirect('/items')
    })

  })



app.listen(3000, function() {
  console.log('Express running on http://localhost:3000/.')
});

process.on('SIGINT', function() {
  console.log("\nshutting down");
  const index = require('./models/index')
  index.sequelize.close()

  // give it a second
  setTimeout(function() {
    console.log('process exit');
    process.exit(0);
  }, 1000)
});
