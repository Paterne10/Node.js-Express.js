import "dotenv/config"
import './passport.js'
import express from "express"
import bodyParser, { json } from "body-parser"
import ejs from "ejs"
import {dirname} from "path"
import path from "path"
import {fileURLToPath} from "url"
import session from "express-session";
import passport from "passport";


const app = express()
const port = 3000
const __dirname = dirname(fileURLToPath(import.meta.url))

app.use(express.static("public"))
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 } 
}))

app.use(passport.initialize())
app.use(passport.session())

// redirect the user to google
app.get("/auth/google",
  passport.authenticate("google", { scope: ["email", "profile"], prompt: "select_account" })
);

//Google redirects back here after the user allows access
app.get("/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/form" }),
  (req, res) => {
    res.render("welcome.ejs", {user: req.user}); // success — send them to your app
  }
);

// Log out
app.get("/logout", (req, res) => {
  req.logout(() => {
    res.redirect("/form");
  });
});


app.get("/form", (req, res) => {
    console.log("directory" + __dirname)
    res.sendFile(path.join(__dirname + "/public/form.html"))
})

app.get("/welcome", (req, res) => {
    res.send("<h1>Welcome to our website.</h1>")
})

app.listen(port, () => {
    console.log("Listening on port " + port)
} ) 