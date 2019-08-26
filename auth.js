var jwtSecret = 'rangerover';
var jwt = require('jsonwebtoken');
const passport = require('passport');
require('./passport.js');

function generateJWTToken(user) {
  return jwt.sign(user, jwtSecret, {
    subject: user.Username,
    expiresIn: '7d',
    algorithm: 'HS256'
  });
}

module.exports = router => {
  router.post('/login', (req, res) => {
    // Use LocalStrategy to check if user in db
    passport.authenticate('local', { session: false }, (err, user, info) => {
      if (err || !user) {
        return res.status(400).json({
          message: `Something is not right: ${info.message}`,
          user,
        });
      }
      // Generate JWT token for client
      req.login(user, { session: false }, err => {
        if (err) res.send(err);
        const token = generateJWTToken(user.toJSON());
        return res.json({ user, token });
      });
    })(req, res);
  });
};
