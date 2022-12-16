const mongoose = require('mongoose');

let movieSchema = mongoose.Schema({
    Title: { type: String, required: true },
    Description: { type: String, required: true },
    Genre: {
        Name: String,
        Description: String
    },
    Director: {
        Name: String,
        Bio: String
    },
    Actors: [String],
    ImagePath: String,
    Featured: Boolean
});

let userSchema = mongoose.Schema({
    Name: { type: String, required: true },
    Password: { type: String, required: true },
    Email: { type: String, required: true },
    Birthday: Date,
    userid: { type: Number, required: true },
    MovieListids: { type: [Number], required: true }
});

let Movie = mongoose.model('Movie', movieSchema);
let User = mongoose.model('User', userSchema);

module.exports.Movie = Movie;
module.exports.User = User;

mongoose.connect('mongodb://localhost:27017/myFlixDB', { useNewUrlParser: true});