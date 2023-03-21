const jwtSecret = 'your_jwt_secret'; // This has to be the same key used in the JWTStrategy

const jwt = require('jsonwebtoken'),
    passport = require('passport');

require('./passport'); // Your local passport file

function generateJWTToken(user) {
    return jwt.sign(user, jwtSecret, {
        subject: user.Username,
        expiresIn: '7d',
        algorithm: 'HS256',
    });
}

/* POST login. */
module.exports = (router) => {
    router.post('/login', (req, res) => {
        passport.authenticate(
            'local',
            { session: false },
            (error, user, info) => {
                if (error || !user) {
                    return res.status(400).json({
                        message: 'Hold up somethings off',
                        user: user,
                        error: error,
                        info: info,
                    });
                }
                req.login(user, { session: false }, (error) => {
                    if (error) {
                        res.send(error);
                    }
                    let token = generateJWTToken(user.toJSON());
                    return res.status(200).json({
                        message: "Login Successful",
                        user: user,
                        token: token
                    });
                });
            }
        )(req, res);
    });
};