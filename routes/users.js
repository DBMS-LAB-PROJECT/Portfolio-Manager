// const jsdom = require("jsdom");
// const { JSDOM } = jsdom;
var express = require('express');
var router = express.Router();
var db=require('../database');

// router.get('/form', function(req, res, next) { 
// res.render('users'); 
// });
// global.document = new JSDOM('index.pug').window.document;

router.post('/create', function(req, res, next) {  
  // store all the user input data
  const userDetails=req.body;
  var sql = 'INSERT INTO user_details SET ?';
  // var submit_button = window.getElementById("endBtn");
  // submit_button.onclick = function(){
    db.query(sql, userDetails,function (err, data) { 
        if (err) throw err;
           console.log("User data is inserted successfully "); 
          //  alert("User data is inserted successfully");
    });
  // }
 res.redirect('/users/form');  // redirect to user form page after inserting the data
}); 
module.exports = router;