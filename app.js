const express = require('express');
const moongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const passport = require('passport');

//initialize app
const app = express()

//Middleware
// Form Data Middleware
app.use(bodyParser.urlencoded({
    extended:false
}));
//JSON body Middleware
app.use(bodyParser.json());
//cors middleware
app.use(cors());
//setting up the static directory
app.use(express.static(path.join(__dirname, 'public')))

//Use passport middleware
app.use(passport.initialize());

require('./config/passport')(passport);

//Get Database configuration and connect with DB
const db = require('./config/keys').mongoURI;

moongoose.connect(db, { useNewUrlParser:true, useUnifiedTopology: true})
.then(()=> {
    console.log(`DB Successfully connected ${db}`);
}).catch((err)=>{
    console.log(`Unable to login to db ${{err}}`);
    
})

// app.get('/', (req, res)=>{
//     return res.send("<h1>Hello Jonathan</h1>");
// });

const users = require('./routes/api/users');
app.use('/api/users', users);

const issue = require('./routes/api/issue');
app.use('/api/issue', issue);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server Started on port ${PORT}`);
    
}) 