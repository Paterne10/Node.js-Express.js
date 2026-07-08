import express from "express"
import bodyParser, { json } from "body-parser"
import ejs from "ejs"
import {dirname} from "path"
import path from "path"
import {fileURLToPath} from "url"
import bcrypt from "bcrypt";
import Database from "better-sqlite3"

const db = new Database('user-registration.db');
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    userId INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(255) UNIQUE,
    password VARCHAR(255)
  )
`);
const __dirname = dirname(fileURLToPath(import.meta.url));
const port = 3001
const app = express()
const userName = "admin"
const yourPassword = "admin"

app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static("public"));


app.get("/form", (req, res) => {
    res.sendFile(path.join(__dirname + "/public/sign-in.html"))
} )

app.post("/sign-in", async (req, res) => {

  try {
    
    const user = db.prepare("SELECT * FROM users WHERE name = ?").get(req.body.name)
  
    if(!user){
      return res.sendStatus(401)
    }
    
    const matchPassword = await bcrypt.compare(req.body.password, user.password)

    if(matchPassword){
      return res.sendStatus(200)
    }
    else{
      return res.sendStatus(401)
    }

    return res.sendStatus(200); 
  } catch (err) {
    res.sendStatus(500);
  }
});

app.listen(port, () => {
    console.log("Listening on port " + port)
} ) 