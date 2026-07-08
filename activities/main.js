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

app.use(express.static("public"))

app.get("/home-activity", (req, res) => {
    res.render("activity.ejs")
})

app.listen(port, () => {
    console.log("Listening on port: " + port)
})