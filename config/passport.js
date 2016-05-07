var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var User = mongoose.model('User');



passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({ username: username }).populate('userRole').exec( function (err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (!user.validPassword(password)) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      if (user.userRole.title == 'pending') {
        return done(null, false, { message: 'Your user has to be activated first. Please contact the director for more info' });
      }
      console.log("user "+ user.username +  " logged " +  " with role " + user.userRole.title );
      return done(null, user);
    });
    
  }
));


