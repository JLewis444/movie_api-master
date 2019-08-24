const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const uuid = require('uuid');
const mongoose = require('mongoose');
const Models = require('./models.js');
const passport = require('passport');
require('./passport');
const cors = require('cors');
const {check, validationResult } = require('express-validator');
const path = require('path');



const app = express();
const Movies = Models.Movie;
const Users = Models.User;


// mongoose.connect('mongodb://localhost:27017/dbname', {useNewUrlParser: true});

mongoose.connect('mongodb+srv://myFlixDBadmin:Newthings4eva@myflixdb-bmqp1.mongodb.net/myFlixDB?retryWrites=true&w=majority', {useNewUrlParser: true});



// uses morgan logger middleware
app.use(morgan('common'));

// routes all requests for static files to 'public' folder
app.use(express.static('public'));

app.use(cors());

//app.use(validator());

app.use(bodyParser.json());

var auth = require('./auth');
// console.log("auth: ", auth)
// console.log("auth1: ", auth(app))

// GET requests
app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname + '/public/documentation.html'));
  
});

app.post('/login', (req, res) => {
  passport.authenticate('local', { session : false}, (error, user, info) => {
    if (error || !user) {
      return res.status(400).json({
        message: 'Something is not right',
        user: user
      });
    }
    req.login(user, { session: false }, (error) => {
      if (error) {
        res.send(error);
      }
      // var token = generateJWTToken(user.toJSON());
        var token = auth(user.toJSON());
      return res.json({ user, token });
    });
  })(req, res);
});
// get the list of data containing all Movies
app.get('/movies', passport.authenticate('jwt', { session: false}), function(req, res) {
 Movies.find()
 .then(function(movies) {
   res.status(200).json(movies);
 }).catch(function(error) {
   console.error(error);
   res.status(500).send("Error: " + error);
 });
});


// get the list of all users
app.get('/users', function(req, res) {

  Users.find()
  .then(function(users) {
    res.status(201).json(users)
  })
  .catch(function(err) {
    console.error(err);
    res.status(500).send("Error: " + err);
  });
});

// adding new user data to the list of users
app.post('/users',[ 
  //Validation logic here for request
  check('Username', 'Not Valid').isLength({ min: 5 }),
  check('Username').isAlphanumeric(),
  check('Password').exists(),
  check('Email').exists(),
  check('Email').isEmail(),
],function(req, res) {

  // check the validation object for errors
  var errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }


 

  var hashedPassword = Users.hashPassword(req.body.Password);
Users.findOne({ Username : req.body.Username })
.then(function(user){
  if (user) {
    return res.status(400).send(req.body.Username + "already exists");
  } else {
    Users
    .create({
      Username: req.body.Username,
      Password: hashedPassword,
      Email: req.body.Email,
      Birthday: req.body.Birthday
    })
    .then(function(user) {res.status(201).json(user) })
    .catch(function(error) {
      console.error(error);
      res.status(500).send("Error: " + error);
    })
  }
}).catch(function(error) {
  console.error(error);
  res.status(500).send("Error: " + error);
});
});

// deleting a user from the list: by id
app.delete('/users/:id', function(req, res) {
  let user = Users.find((user) => { return user.id === req.params.id});

  if (user) {
    Users = Users.filter(function(obj) {
      return obj.id !== req.params.id;
    });
    res.status(201).send('User' + user.name + 'with id' + req.params.id + 'was deleted.')
  }
});

// get a user from the list: by username
app.get('/users/:Username', function(req, res) {
  Users.findOne({ Username : req.params.Username })
  .then(function(user) {
    res.json(user)
  })
  .catch(function(err) {
    console.error(err);
    res.status(500).send("Error: " + err);
  });
});

// update user info: by username
app.put('/users/:Username', function(req, res) {
  Users.findOneAndUpdate({ Username : req.params.Username }, { $set :
   {
     Username : req.body.Username,
     Password : req.body.Password, // should be . not :
     Email : req.body.Email,
     Birthday : req.body.Birthday
   }},
   { new : true },
   function(err, updateUser) {
     if(err) {
       console.error(err);
       res.status(500).send("Error: " + err);
     } else {
       res.json(updatedUser)
     }
   })
});

// add a favorite Movie for a user
app.post('/users/:Username/Movies/:MovieID', (req, res) => {
Users.findOneAndUpdate({ Username : req.params.Username }, {
  $push : { FavoriteMovies : req.params.MovieID }
},
{ new : true },
function(err, updatedUser) {
  if (err) {
    console.error(err);
    res.status(500).send("Error: " + err);
  } else {
    res.json(updatedUser)
  }
})
});

// learning


app.use((err, req, res, next) => {
  var logEntryTimestamp = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
  var logEntry = `${logEntryTimestamp} - Error: ${err.stack}`;
  console.error(logEntry);
  res.status(500).send('Something went wrong!');
});

var port = process.env.PORT || 3001;
//app.listen(port, "0.0.0.0", () => {
  //console.log('Listening on Port 3000');
//});
app.listen(port);