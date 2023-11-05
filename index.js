const mongoose = require('mongoose');
const Models = require('./models.js');
const passport = require('passport');
const cors = require('cors');
const { check, validationResult, body, param } = require('express-validator');
require('dotenv').config()


const Movies = Models.Movie;
const Users = Models.User;

//mongoose.connect('mongodb://localhost:27017/CinemaDB', { useNewUrlParser: true, useUnifiedTopology: true }); // for local testing
mongoose.connect(process.env.CONNECTION_URI, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.set('strictQuery', true);

const express = require('express');
const morgan = require('morgan');
const fs = require('fs'); // import built in node modules fs and path 
const path = require('path');

const app = express();
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), { flags: 'a' })

let auth = require('./auth')(app);

app.use(morgan('combined', { stream: accessLogStream }));


const bodyParser = require('body-parser');
const methodOverride = require('method-override');

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());
app.use(methodOverride());
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH']
}));


app.use((err, req, res, next) => {
    // logic
});



// GET requests
app.get('/movie-api/', cors(), (req, res) => {
    res.send('Welcome to my book club!');
});

//RETURNS DOCUMENTATIONHTML
app.get('/movie-api/documentation', cors(), passport.authenticate('jwt', { session: false }), (req, res) => {
    res.sendFile('public/documentation.html', { root: __dirname });

});

//RETURNS A LIST OF MOVIES
app.get('/movie-api/movies', cors(), passport.authenticate('jwt', { session: false }), (req, res) => {
    Movies.find({}, (err, movies) => {
        res.send(movies)
    })
});


//GETS DATA ABOUT A MOVIE BY MOVIE TITLE
app.get('/movie-api/movie/:title', cors(), passport.authenticate('jwt', { session: false }), (req, res) => {

})

//RETURNS DATA ABOUT A GENRE
app.get('/movie-api/genre/:name', cors(), passport.authenticate('jwt', { session: false }), (req, res) => {
    Movies.findOne({ 'Genre.Name': req.params.name }, (err, movies) => {
        res.send(movies.Genre)

    })
})

//RETUENS DATA ABOUT A DIRECTOR
app.get('/movie-api/movies/director/:name', cors(), passport.authenticate('jwt', { session: false }), (req, res) => {
    Movies.findOne({ 'Director.Name': req.params.name }, (err, movies) => {
        res.send(movies?.Director);
    })
});


//ALLOWS USERS TO UPDATE THEIR USER INFO
app.put('/movie-api/users', cors(), passport.authenticate('jwt', { session: false }), (req, res) => {
    Users.findOneAndUpdate({ 'userid': req.body.userId }, { $set: req.body }, { new: true }, (err, user) => {
        res.send(user)
    })

});

//CREATE NEW USER 
app.post('/movie-api/user', cors(),
    //email must be email
    [
        check('Username', 'Username is required').isLength({ min: 5 }),
        check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
        check('Password', 'Password is required').not().isEmpty(),
        check('Email', 'Email does not appear to be valid').isEmail()
    ],
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        let hashedPassword = Users.hashPassword(req.body.Password);
        Users.findOne({ Username: req.body.Username }) // Search to see if a user with the requested username already exists
            .then((user) => {
                if (user) {
                    //If the user is found, send a response that it already exists
                    return res.status(400).send(req.body.Name + ' already exists');
                } else {
                    Users
                        .create({
                            Username: req.body.Username,
                            Password: hashedPassword,
                            Email: req.body.Email,
                            Birthday: req.body.Birthday,
                            UserId: req.body.UserId
                        })
                        .then((user) => { res.status(201).json(user) })
                        .catch((error) => {
                            console.error(error);
                            res.status(500).send('Error: ' + error);
                        });
                }
            })
            .catch((error) => {
                console.error(error);
                res.status(500).send('Error: ' + error);
            });
    });


//ALLOWS USERS TO ADD MOVIE TO THEIR FAVORITE MOVIE LIST
app.post('/movie-api/user/favoriteMovie', cors(), passport.authenticate('jwt', { session: false }), async (req, res) => {
    Users.findOneAndUpdate({ 'userid': req.body.userId }, { $push: { 'MovieListids': req.body.Movieid } }).then(user => {
        res.status(201).send("User has successfully added " + req.body.Movieid + " to their movie list");
    })
});

//ALLOWS USERS TO REMOVE A MOVIE FROM THEIR FAVORITE MOVIE LIST
app.delete('/movie-api/user/:userid/favoriteMovie/:MovieID', cors(), passport.authenticate('jwt', { session: false }), (req, res) => {
    Users.findOneAndUpdate(
        { userid: req.params.userid },
        {
            $pull: { MovieListids: req.params.MovieID },
        },
        { new: true },
        (err, updatedUser) => {
            console.log(updatedUser.MovieListids)
            if (err) {
                console.log(err);
                res.status(500).send('Error ' + err);
            } else {
                res.json(updatedUser);
            }
        }
    );
});

//ALLOWS USERS TO DEREGISTER THEIR ACCOUNT 
app.delete('/movie-api/user/:userid', cors(), passport.authenticate('jwt', { session: false }), (req, res) => {
    Users.findOneAndRemove({ userid: req.params.userid })
        .then((user) => {
            if (!user) {
                res.status(400).send(req.params.Username + ' was not found');
            } else {
                res.status(200).send(req.params.Username + ' was deleted.');
            }
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
    res.send('Successful DELETE request removing data on the user');
});


// //const port = process.env.PORT || 8080;
// //app.listen(port, '0.0.0.0', () => {
// //console.log('Listening on Port ' + port);
// //});


app.listen(process.env.PORT || 8080)

