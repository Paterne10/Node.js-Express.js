import express from "express";
import axios from "axios";

const port = 3000
const app = express()

app.use(express.static("public"));

app.get("/", async (req, res) => {
    try{
        const randomSecret = await axios.get(" https://secrets-api.appbrewery.com/random")
        res.render("index.ejs", {
            secret: randomSecret.data.secret,
            user: randomSecret.username
        })
    }
    catch(error){
        res.status(500)
    }
    
})

app.listen(port, () => {
    console.log("Listening on port: " + port)
})