const express = require('express');
const morgan = require('morgan');
const fs = require('fs'); // import built in node modules fs and path 
const path = require('path');

const app = express();
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), { flags: 'a' })

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

let topBooks = [
    {
        title: 'Harry Potter and the Sorcerer\'s Stone',
        author: 'J.K. Rowling'
    },
    {
        title: 'Lord of the Rings',
        author: 'J.R.R. Tolkien'
    },
    {
        title: 'Twilight',
        author: 'Stephanie Meyer'
    }
];

let topMovies = [
    {
        title: 'Black Panther',
        director: 'Ryan Coogler',
        release_date: '2018'
    },
    {
        title: 'Avengers Endgame',
        director: 'Anthony and Joe Russo',
        release_date: '2019'
    },
    {
        title: 'Avengers Infinity War',
        director: 'Anthony and Joe Russo',
        release_date: '2018'
    },
    {
        title: 'Captian America Civil War',
        director: 'Anthony Russo',
        release_date: '2016'
    },
    {
        title: 'Spiderman No Way Home',
        director: 'Jon Watts',
        release_date: '2021'
    },
    {
        title: 'Shang Chi',
        director: 'Destin Daniel Cretton',
        release_date: '2021'
    },
    {
        title: 'Deadpool',
        director: 'Tim Miller',
        release_date: '2016'
    },
    {
        title: 'Thor Ragnarok',
        director: 'Taika Waititi',
        release_date: '2017'
    },
    {
        title: 'Amazing Spiderman 2',
        director: 'Marc Webb',
        release_date: '2014'
    },
    {
        title: 'Logan',
        director: 'James Mangold',
        release_date: '2017'
    }
]

// GET requests
app.get('/movie-api/', (req, res) => {
    res.send('Welcome to my book club!');
});

app.get('/movie-api/documentation', (req, res) => {
    res.sendFile('public/documentation.html', { root: __dirname });
});

app.get('/movie-api/books', (req, res) => {
    res.json(topBooks);
});

app.get('/movie-api/movies', (req, res) => {
    res.json(topMovies);
}); 

app.post('/movie-api/books', (req, res) => {
    let book = req.body
    topBooks.push(book)
    res.json(book)
})

app.post('/movie-api/movies', (req, res) => {
    let movie = req.body
    topMovies.push(movie)
    res.json(movie)
})

app.delete('/movie-api/books/:title', (req, res) => {
    let book = topBooks.find((book) => { return book.title === req.params.title })

    if (book) {
        topBooks = topBooks.filter((book) => { return book.title !== req.params.title });
        res.status(200).send('book ' + req.params.title + ' was deleted. ');
    }
    else {
        res.status(404).send();
    }
})

app.delete('/movie-api/movies/:title', (req, res) => {
    let movie = topMovies.find((movie) => { return movie.title === req.params.title })

    if (movie) {
        topMovies = topMovies.filter((movie) => { return movie.title !== req.params.title });
        res.status(200).send('movie ' + req.params.title + ' was deleted. ');
    }

    else {
        res.status(404).send();
    }
})

app.get('/movie-api/movie/:title', (req, res) => {
    let movie = topMovies.find((movie) => { return movie.title === req.params.title })
    res.json(movie)

})

app.get('/movie-api/movies/:genre', (req, res) => {
    res.send('Successful GET request returning ' + req.params.genre + ' specific movies');
});

app.get('/movie-api/movies/director/:name', (req, res) => {
    res.send('Successful GET request returning ' + req.params.name + ' specific data');
});

app.put('/movie-api/users', (req, res) => {
    res.send('Successful PUT creating new user');
});

app.post('/movie-api/users', (req, res) => {
    res.send('Successful POST updating user info');
});

app.put('/movie-api/user/favoriteMovie', (req, res) => {
    res.send('Successful PUT request adding favorite movie');
});

app.delete('/movie-api/user/favoriteMovie/:title', (req, res) => {
    res.send('Successful DELETE request removing data');
});

app.delete('/movie-api/user/:id', (req, res) => {
    res.send('Successful DELETE request removing data on the user');
});

app.listen(8080, () => {
    console.log('Your app is listening on port 8080.');
});