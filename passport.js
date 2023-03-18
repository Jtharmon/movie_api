const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const Models = require('./models.js');
const passportJWT = require('passport-jwt');

let Users = Models.User;
let JWTStrategy = passportJWT.Strategy;
let ExtractJwt = passportJWT.ExtractJwt;

passport.use(
    new LocalStrategy(
        {
            usernameField: 'username',
            passwordField: 'password',
        },
        (username, password, callback) => {
            console.log(username + '  ' + password);
            Users.findOne({ username: username }, (error, user) => {
                if (error) {
                    console.log(error);
                    return callback(error);
                }

                if (!user) {
                    console.log('incorrect username');
                    return callback(null, false, {
                        message: 'Incorrect username or password.',
                    });
                }

                if (!user.validatePassword(password)) {
                    console.log('incorrect password');
                    return callback(null, false, {
                        message: 'Incorrect password.',
                    });
                }
                console.log('finished');
                return callback(null, user);
            });
        }
    )
);

passport.use(
    new JWTStrategy(
        {
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        },
        (jwtPayload, callback) => {
            return Users.findOne({ _id: jwtPayload._id })
                .then((user) => {
                    return callback(null, user);
                })
                .catch((error) => {
                    return callback(error);
                });
        }
    )
);

module.exports = passport;