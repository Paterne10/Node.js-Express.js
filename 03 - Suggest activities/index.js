import express from "express"
import axios from "axios"
import bodyParser from "body-parser"
import ejs from "ejs"
import {dirname} from "path"
import path from "path"
import { fileURLToPath } from "url"


const app = express()
const port = 3000
const __dirname = dirname(fileURLToPath(import.meta.url))
const API_URL = "https://bored-api.appbrewery.com"

app.use(express.static("public"))
app.use(bodyParser.urlencoded({ extended: true }));


app.get("/", (req, res) => {
    res.render("index.ejs")
})

app.post("/activity", async (req, res) => {
    console.log(req.body)
    try{
        const activity = await axios.get(API_URL + "/filter?type=" + req.body.type)
        // const randomActivity = activity.data[Math.floor(Math.random() * activity.lenght)]
        const randomActivity = activity.data[Math.floor(Math.random() * activity.data.length)];
        res.render("index.ejs", {content:randomActivity})
    }
    catch(error){
        console.log(error.message)
    }
   
    

})

app.listen(port, () => {
    console.log("Listening on port: " + port)
})