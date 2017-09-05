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
    })
})

app.get('/items', function(req, res) {
  res.render("new_item")
})

app.post('/create_user', function(req, res) {

  const userToCreate = models.User.build({
    name: req.body.name,
    email: req.body.email,
    bio: req.body.bio
  })
  userToCreate.save().then(function() {
    res.redirect('/users')
  })
})


  app.post('/delete_user/:idOfTheUser', function(req, res) {
    console.log('the id is   ' + req.params.idOfTheUser);
    models.User.destroy({
      where: {
        id: req.params.idOfTheUser
      }
    }).then(function(){
      res.redirect('/users')
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
