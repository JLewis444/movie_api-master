/* eslint-disable no-console */
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const cors = require('cors');
const { check, validationResult } = require('express-validator');
const path = require('path');
const Models = require('./models.js');

require('./passport.js');





const Movies = Models.Movie;
const Users = Models.User;


// mongoose.connect('mongodb://localhost:27017/dbname', {useNewUrlParser: true});

mongoose.connect('mongodb+srv://myFlixDBadmin:Newthings4eva@myflixdb-bmqp1.mongodb.net/myFlixDB?retryWrites=true&w=majority', {useNewUrlParser: true});

const app = express();

// App Middleware

app.use(express.static(`${__dirname}/public`)); // Route all requests for static files to public folder

app.use(morgan('common')); // Use Morgan Middlware for logging requests

app.use(bodyParser.json()); // Use body-parser middleware

app.use(cors()); // Use CORS - All domains

//app.use(validator()); // Use server-side data validation

var auth = require('./auth')(app);
// console.log("auth: ", auth)
// console.log("auth1: ", auth(app))

// Error Handling Middleware
app.use((err, req, res, next) => {
  // eslint-disable-next-line no-console
  console.error(err.stack);
  res.status(500).send('Something Broke');
});

// GET requests
app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname + '/public/documentation.html'));
  
});






// API Endpoint Routes

// GET all Movies Route
app.get('/movies', passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.find()
    .then(allMovies => res.status(201).json(allMovies)) // Return all movies as JSON
    .catch(err => res.status(500).send(`Error: ${err}`)); // Simple error handling
});

// GET all Users Route (Extra)
app.get('/users', (req, res) => {
  Users.find()
    .then(allUsers => res.status(201).json(allUsers)) // Return all Users as JSON
    .catch(err => res.status(500).send(`Error: ${err}`)); // Simple error handling
});

// GET Movie by Title
app.get('/movies/:title', passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.findOne({ title: req.params.title })
    .then(movie => {
      // Return movie as JSON only if found else return Not Found.
      if (!movie) return res.status(404).send(`${req.params.title} not found`);
      res.status(201).json(movie);
    })
    .catch(err => res.status(500).send(`Error: ${err}`)); // Simple error handling
});

// Get Details of Genre
app.get('/genres/:name', passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.findOne({ 'Genre.Name': req.params.name })
    .then(movie => {
      // Return genre details only if found else return Not Found.
      if (!movie) return res.status(404).send(`${req.params.name} not found`);
      res.status(201).json(movie.Genre);
    })
    .catch(err => res.status(500).send(`Error: ${err}`)); // Simple error handling
});


// get the list of data containing all Movies
app.get('/directors', passport.authenticate('jwt', { session: false}), function(req, res) {
  Directors.find()
  .then(function(movies) {
    res.status(200).json(movies);
  }).catch(function(error) {
    console.error(error);
    res.status(500).send("Error: " + error);
  });
 });
// Get List of Movies by Director Name
app.get('/directors/:name', passport.authenticate('jwt', { session: false }), (req, res) => {
  console.log(req.params.name);
  Movies.findOne({ 'Director.Name': req.params.name })
    .then(movie => {
      // Return director details only if found else return Not Found.
      console.log(movie);
      if (!movie) return res.status(404).send(`${req.params.name} not found`);
      res.status(201).json(movie.Director);
    })
    .catch(err => res.status(500).send(`Error: ${err}`)); // Simple error handling
});

// Add New User
app.post('/users', [
  // Data validation
  check('username', 'Username is required').not().isEmpty(),
  check('username', 'Username must only contain alphanumeric charachters').isAlphanumeric(),
  check('password', 'Password is required').not().isEmpty(),
  check('email', 'Email is required').not().isEmpty(),
  check('email', 'Email does not appear to be valid').isEmail()
], (req, res) => {

  // check the validation object for errors
  var errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  // must work
  const hashedPassword = Users.hashPassword(req.body.password);
  Users.findOne({ username: req.body.username })
    .then(user => {
      // Check if user exists, if not add user
      if (user) return res.status(400).send(`${req.body.username} already exists`);
      Users.create({
        username: req.body.username,
        password: hashedPassword,
        email: req.body.email,
        birthday: req.body.birthday,
      })
        .then(userAdded => res.status(201).json(userAdded)) // Return added user as JSON
        .catch(err => res.status(500).send(`Error: ${err}`)); // Simple error handling
    })
    .catch(err => res.status(500).send(`Error: ${err}`)); // Simple error handling
});

// Modify User
app.put('/users/:username', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOneAndUpdate(
    { username: req.params.username },
    {
      $set: {
        username: req.body.username,
        password: req.body.password,
        email: req.body.email,
        birthday: req.body.birthday,
      },
    },
    { new: true } // Make sure updated document is returned
  )
    .then(updatedUser => res.status(201).json(updatedUser)) // Return modified user as JSON
    .catch(err => res.status(500).send(`Error: ${err}`)); // Simple error handling
});

// Add User Favourite Movie
app.post('/users/:username/movies/:movieid', passport.authenticate('jwt', { session: false }), (req, res) => {
  // Check if movie exists then find user and push movieid to favouriteMovies
  Movies.findOne({ _id: req.params.movieid })
    .then(movie => {
      Users.findOneAndUpdate(
        { username: req.params.username },
        { $push: { favouriteMovies: movie._id } }, // Push found movieid to array
        { new: true } // Make sure updated document is returned
      )
        .then(modifiedUser => res.status(201).json(modifiedUser)) // Return modified user as JSON
        .catch(err => res.status(500).send(`Error: ${err}`)); // Simple error handling
    })
    .catch(err => res.status(500).send(`Error: ${err}`)); // Simple error handling
});


// Delete User Asscociated Movie
app.delete('/users/:username/movies/:movieid', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOneAndUpdate(
    { username: req.params.username },
    { $pull: { favouriteMovies: req.params.movieid } },
    { new: true } // Make sure updated document is returned
  )
    .then(modifiedUser => res.status(201).json(modifiedUser)) // Return modified user as JSON
    .catch(err => res.status(500).send(`Error: ${err}`)); // Simple error handling
});

// Delete User Route
app.delete('/users/:username', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOneAndRemove({ username: req.params.username })
    .then(user => {
      // Check if user exists and send appropriate response
      if (!user) return res.status(400).send(`${req.params.Username} was not found`); // Return message user not found
      res.status(200).send(`${req.params.username} was deleted.`); // Return message of deletion
    })
    .catch(err => res.status(500).send(`Error: ${err}`));
});

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

const port = process.env.PORT || 3001;
app.listen(port, '0.0.0.0', () => {
  console.log('Listening on port 3000');
});
