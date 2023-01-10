const mongoose = require('mongoose'),
    bcrypt = require('bcryptjs');

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
    Username: { type: String, required: true },
    Password: { type: String, required: true },
    Email: { type: String, required: true },
    Birthday: Date,
    UserId: { type: Number, required: true },
    MovieListids: { type: [Number], required: false }
});


userSchema.statics.hashPassword = (password) => {
    return bcrypt.hashSync(password, 10);
};

userSchema.methods.validatePassword = function (Password) {
    return Password === this.Password;
};



let Movie = mongoose.model('Movie', movieSchema);
let User = mongoose.model('User', userSchema);

module.exports.Movie = Movie;
module.exports.User = User;

//mongoose.connect('mongodb://localhost:27017/myFlixDB', { useNewUrlParser: true});

//mongoose.connect('mongodb + srv://myFlixDBadmin:Luther12@myflixdb.yk3wscy.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });

//mongoose.connect('process.env.Connection_URI', { useNewUrlParser: true, useUnifiedTopology: true });

const uri = "mongodb+srv://myFlixDBadmin:Luther12@myflixdb.yk3wscy.mongodb.net/?retryWrites=true&w=majority";

mongoose.connect(uri);