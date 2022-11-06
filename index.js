const express = require('express'),
    morgan = require('morgan'),
    fs = require('fs'), // import built in node modules fs and path 
    path = require('path');

const app = express();
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), { flags: 'a' })

app.use(morgan('combined', { stream: accessLogStream }));


const bodyParser = require('body-parser'),
    methodOverride = require('method-override');

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());
app.use(methodOverride());

app.use((err, req, res, next) => {
    // logic
});

const express = require('express');
const app = express();

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
        release_date: '1018' 

        title: 'Avengers Endgame',
        director: 'Anthony and Joe Russo',
        release_date: '2019'

        title: 'Avengers Infinity War',
        director: 'Anthony and Joe Russo',
        release_date: '2018'

        title: 'Captian America Civil War',
        director: 'Anthony Russo',
        release_date: '2016'

        title: 'Spiderman No Way Home',
        director: 'Jon Watts',
        release_date: '2021'

        title: 'Shang Chi',
        director: 'Destin Daniel Cretton',
        release_date: '2021'

        title: 'Deadpool',
        director: 'Tim Miller',
        release_date: '2016'

        title: 'Thor Ragnarok',
        director: 'Taika Waititi',
        release_date: '2017'

        title: 'Amazing Spiderman 2',
        director: 'Marc Webb',
        release_date: '2014'

        title: 'Logan',
        director: 'James Mangold',
        release_date: '2017'
    },
]

// GET requests
app.get('/', (req, res) => {
    res.send('Welcome to my book club!');
});

app.get('/documentation', (req, res) => {
    res.sendFile('public/documentation.html', { root: __dirname });
});

app.get('/books', (req, res) => {
    res.json(topBooks);
});

app.get('/movies', (req, res) => {
    res.json(topMovies);
}); 

app.get('/', (req, res) => {
    res.send('Get out dude')
});


app.listen(8080, () => {
    console.log('Your app is listening on port 8080.');
});