import express from "express";
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import collection from "./src/config.js";
import exp from "constants";
import { log } from "console";
import { name } from "ejs";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const app = express();
const Port = 8080;

app.use(express.json())
// Set the view engine to EJS and set views folder path
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Middleware to parse form data (url-encoded bodies)
app.use(express.urlencoded({ extended: false }));

// Route to render login page
app.get("/login", (req, res) => {
    const {username,password} = req.body;
    console.log(username);
    console.log(password);
    
    res.render("users/login.ejs");
});

app.get("/admin", async(req, res) => {
    try {
        const users = await collection.find({}, 'name password');        // Use async/await to handle the promise
        res.render("users/admin.ejs", {
            id: users  // Pass the users array (only names) to the EJS template
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error retrieving users");
    }
});


app.post("/home", async(req, res) => {
    const data = {
        name: req.body.username,
        password: req.body.password
    }

    const existingUser = await collection.findOne({name:data.name})
    if(existingUser){
        // res.render("index.ejs",{id:"Cannot register"})
        res.render("index.ejs",{
            id: data.name,
           
        })
    }else{
        res.render("users/signup.ejs")
        // console.log(userdata);
    }
    
});

app.get("/signup",async(req,res)=>{
    res.render("users/signup.ejs")
    // console.log(userdata);
});

app.post("/signup",async(req,res)=>{
    const data = {
        name: req.body.username,
        password: req.body.password
    }


    const existingUser = collection.findOne({name:data.name})

    if(existingUser){
        // res.render("index.ejs",{id:"Cannot register"})
        res.render("index.ejs",{
            id: data.name,
           
        })
    }else{
        res.render("index.ejs",{
            id: data.name,
           
        })
        const userdata = collection.insertMany(data);
        console.log(userdata);
    }
})

// Route to handle login form submission
// app.post("/login", (req, res) => {
//     const { username, password } = req.body;
//     console.log(username, password);  // Logging the form data

//     // Handle login logic here (authentication, etc.)
    
//     // After processing, you can redirect or render another view
//     res.send("Login successful!"); // Example response
// });

// Route to render home page
app.get("/home", (req, res) => {
    res.render("index.ejs",{
       
    })
});

// app.post("/home", (req, res) => {

//     const { name,username, password } = req.body;
//     console.log(username, password); 

//     res.render("index.ejs",{name:name});
// });

// Listen on the specified port
app.listen(Port, () => {
    console.log(`App is listening on port ${Port}`);
});

