import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import db from "./db.js";

passport.use(new GoogleStrategy(
    {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:3000/auth/google/callback"
    },
    (accessToken, refreshToken, profile, done) => {
        // Check if this Google account already exists in your database
        const user = db.prepare("SELECT * FROM users WHERE mail = ?")
            .get(profile.emails[0].value);

        if (user) {
            // User already exists — just log them in
            return done(null, user);
        }

        // First time signing in — create a new user
        db.prepare("INSERT INTO users (mail, name) VALUES (?, ?)")
            .run(profile.emails[0].value, profile.displayName);

        const newUser = db.prepare("SELECT * FROM users WHERE mail = ?")
            .get(profile.emails[0].value);

        return done(null, newUser);
    }
));

// Save user id to session
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// Retrieve full user from session id on each request
passport.deserializeUser((id, done) => {
    const user = db.prepare("SELECT * FROM users WHERE id = ?").get(id);
    done(null, user);
});

export default passport;