const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
import { User } from "./src/models/user";


const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.SECRET_KEY
};
 
module.exports = passport => {
  passport.use(
    new JwtStrategy(opts, async(jwt_payload, done) => {
      let user = await User.findById(jwt_payload.id);
      if(user) { 
        return done(null, user);
      }
      return done(null, false, { msg: "User Not Found"})
    })
  );
};