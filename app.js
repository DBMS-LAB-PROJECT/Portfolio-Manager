var db=require('./database');
const express = require('express');

// Setting the Views Directory
const path = require("path");
const fs = require('fs');

const app = express();
const port = 80;


// EXPRESS SPECIFIC STUFF
app.use('/static', express.static('static')); // For serving static files
app.use(express.urlencoded()); // This will help us bring the data of our form to the express

// PUG SPECIFIC STUFF
var usersRouter = require('./routes/users');
const req = require('express/lib/request');
const res = require('express/lib/response');
app.use('/users', usersRouter);
app.set("view engine", 'pug'); // Setting template engine as pug
app.set('views', path.join(__dirname,'views')); // Setting the Views Directory
// Now we set a folder named views.

// ENDPOINTS
app.get('/', (req, res)=>{
    const con = 'This is our content for the webpage using pug';
    const params = {'title': "Portfolio Builder", 'content': con};
    res.status(200).render('index', params);
}); 
app.post('/', (req, res)=>{
  var sql = 'INSERT INTO user_detail SET ?';
  var submit_button = window.getElementById("endBtn");
  submit_button.onclick = function(){
    db.query(sql, userDetails,function (err, data) { 
        if (err) throw err;
           console.log("User data is inserted successfully "); 
    });
  };
});

// app.post('/', (req,res)=>{
//     name = req.body.name; 
//     mname = req.body.mname;
//     lname = req.body.lname;
//     birthplace = req.body.birthplace;
//     birthdate = req.body.birthdate;
//     profession = req.body.profession;
//     mobile = req.body.mobile; 
//     address = req.body.address;
//     institute = req.body.institute;
//     qualification = req.body.qualification;
//     course = req.body.course;
//     grade = req.body.grade;
    
//     let outputToWrite = `Name of Client is ${name} ${mname} ${lname},
//     Place of birth of Client is ${birthplace},
//     DOB of Client is ${birthdate},
//     Profession of Client is ${profession},
//     Phone number of Client is ${mobile},
//     Address of Client is ${address},
//     Institute of Client is ${institute},
//     Qualification of Client is ${qualification},
//     Course of Client is ${course},
//     Grade of Client is ${grade},`;
//     fs.writeFileSync('output.txt', outputToWrite);
//     const params = {'message': "Your form has been submitted"};
//     res.status(200).render('index', params);
// });

// STARTING THE SERVER
app.listen(port, ()=>{
    console.log(`The app started on port ${port}`);
});
 
