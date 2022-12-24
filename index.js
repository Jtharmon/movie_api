const mongoose = require('mongoose');
const Models = require('./models.js');
const passport = require('passport');

const Movies = Models.Movie;
const Users = Models.User;


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

app.use((err, req, res, next) => {
    // logic
});



// GET requests
app.get('/movie-api/', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.send('Welcome to my book club!');
});

//RETURNS DOCUMENTATIONHTML
app.get('/movie-api/documentation', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.sendFile('public/documentation.html', { root: __dirname });
    
});

//RETURNS A LIST OF MOVIES
app.get('/movie-api/movies', passport.authenticate('jwt', { session: false }), (req, res) => {
    Movies.find({}, (err, movies) => {
        res.send(movies)
    })
}); 


//GETS DATA ABOUT A MOVIE BY MOVIE TITLE
app.get('/movie-api/movie/:title', passport.authenticate('jwt', { session: false }), (req, res) => {

})

//RETURNS DATA ABOUT A GENRE
app.get('/movie-api/genre/:name', passport.authenticate('jwt', { session: false }), (req, res) => {
    Movies.findOne({ 'Genre.Name': req.params.name }, (err, movies) => {
        res.send(movies.Genre)

    })
})

//RETUENS DATA ABOUT A DIRECTOR
app.get('/movie-api/movies/director/:name', passport.authenticate('jwt', { session: false }), (req, res) => {
    Movies.findOne({ 'Director.Name': req.params.name }, (err, movies) => {
        res.send(movies?.Director);
    })
});

//ALLOWS NEW REGISTERS 
app.put('/movie-api/user/:userid', passport.authenticate('jwt', { session: false }), (req, res) => {
    Users.findOne({ 'userid': req.params.userid })
        .then((user) => {
            if (user) {
                res.status(500).send("User already exists");
            }
            else {
                Users.create({
                    userid: req.body.userid,
                    Name: req.body.Name,
                    Email: req.body.Email,
                    Birthday: req.body.Birthday,
                    MovieListids: req.body.MovieListids,
                    Password: req.body.Password
                }).then((user) => {
                    res.status(201).send(user)
                })
            }
        })
});
//ALLOWS USERS TO UPDATE THEIR USER INFO
app.post('/movie-api/users', passport.authenticate('jwt', { session: false }), (req, res) => {
    Users.findOneAndUpdate({ 'userid': req.body.userId }, { $set: req.body }, { new: true }, (err, user) => {
        res.send(user)
    })
       
});

//ALLOWS USERS TO ADD MOVIE TO THEIR FAVORITE MOVIE LIST
app.post('/movie-api/user/favoriteMovie', passport.authenticate('jwt', { session: false }), async (req, res) => {
    Users.findOneAndUpdate({ 'userid': req.body.userId }, { $push: { 'MovieListids': req.body.Movieid } }).then(user => {
        res.status(201).send("User has successfully added " + req.body.Movieid + " to their movie list");
    })
});

//ALLOWS USERS TO REMOVE A MOVIE FROM THEIR FAVORITE MOVIE LIST
app.delete('/movie-api/user/:userid/favoriteMovie/:MovieID', passport.authenticate('jwt', { session: false }), (req, res) => {
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
app.delete('/movie-api/user/:userid', passport.authenticate('jwt', { session: false }), (req, res) => {
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

app.listen(8080, () => {
    console.log('Your app is listening on port 8080.');
});
