var jwt = require('jsonwebtoken');
var atob = require('atob');
var express = require('express')
var app = express();
var Cryptr = require('cryptr'),
    cryptr = new Cryptr('myTotalySecretKey');
//---------------------------------------------signup page call------------------------------------------------------
exports.signup = function (req, res) {
    message = '';
    if (req.method == "POST") {
        var post = req.body;
        var pass = post.password;
        var fname = post.full_name;
        var eml = post.emailaddress;

        var sql = "INSERT INTO `users`(`full_name`,`email`, `password`) VALUES ('" + fname + "','" + eml + "','" + pass + "')";

        var query = db.query(sql, function (err, result) {
            if (err) {
                message = 'Registration failed ' + err;
                res.render('signup.ejs', { message: message });
            }
            else {
                message = "Succesfully! Your account has been created.";
                //res.render('signup.ejs', { message: message });
                /* var dec_pass = atob(pass);
                var encrypted_pass = cryptr.encrypt(dec_pass); */
                // var sql = "SELECT full_name, email, password FROM `users` WHERE `full_name`='" + fname + "' and password = '" + pass + "'";
                var sql = "SELECT full_name, email, password FROM `users` WHERE `full_name`='" + fname + "' and password = '" + pass + "'";
                db.query(sql, function (err, results) {
                    if (results != "") {
                        var data = JSON.stringify(results);
                        var secret = 'SECRETKEY';
                        var now = Math.floor(Date.now() / 1000),
                            iat = (now - 10),
                            expiresIn = 7200,
                            expr = (now + expiresIn),
                            notBefore = (now - 10),
                            jwtId = Math.random().toString(36).substring(7);
                        var payload = {
                            iat: iat,
                            jwtid: jwtId,
                            audience: 'profile',
                            data: data
                        };

                        jwt.sign(payload, secret, { algorithm: 'HS256', expiresIn: expiresIn }, function (err, token) {
                            if (err) {
                                res.json({
                                    "results":
                                    {
                                        "status": false,
                                        "msg": 'Error occurred while generating token'
                                    }
                                });
                            }
                            else {
                                if (token != false) {
                                    req.session.email = results[0].email;
                                    req.session.emailaddress=req.body.emailaddress;
                                    req.body.token=token;
                                    emailaddress=req.body.emailaddress
                                    var sql = "SELECT * FROM `users` WHERE `email`='" + req.body.emailaddress + "'";
                                    db.query(sql, function (err, result) {
                                        res.render('profile.ejs', { data: result });
                                    });
/*                                   res.json({

                                        "status": true,
                                        "msg": 'Registration completed sucessfully',
                                        "token": token,
                                        "data": results[0]

                                    });  */

                                }
                                else {
                                    message = 'Token cannot found';
                                    res.render('signup.ejs', { message: message });
                                }

                            }
                        });
                    }
                    else if (results == "") {
                        message = 'Wrong Credentials.';
                        res.render('signup.ejs', { message: message });
                    }
                });
                /*                db.query(sql, function (err, results) {
                                    if (results.length) {
                                        req.session.email = results[0].email;
                                        var email=req.session.email
                                       // req.session.user = results[0];
                                       // console.log(results[0].id);
                                       res.redirect('/profile');
                                      // res.render('dashboard.ejs', { user: email });
                                    }
                                    else {
                                        message = 'Wrong Credentials.';
                                        res.render('signup.ejs', { message: message });
                                    }
                        
                                }); */
            }
        });

    } else {
        res.render('signup');
    }
};

//-----------------------------------------------login page call------------------------------------------------------
exports.login = function (req, res) {
    var message = '';
    var sess = req.session;

    if (req.method == "POST") {
        var post = req.body;
        var name = post.user_name;
        var pass = post.password;

        var sql = "SELECT id, full_name, last_name, user_name FROM `users` WHERE `user_name`='" + name + "' and password = '" + pass + "'";
        db.query(sql, function (err, results) {
            if (results.length) {
                req.session.userId = results[0].id;
                req.session.user = results[0];
                console.log(results[0].id);
                res.redirect('/home/dashboard');
            }
            else {
                message = 'Wrong Credentials.';
                res.render('index.ejs', { message: message });
            }

        });
    } else {
        res.render('index.ejs', { message: message });
    }

};
//-----------------------------------------------dashboard page functionality----------------------------------------------

exports.dashboard = function (req, res, next) {

    /*  var user = req.session.user,
         userId = req.session.userId;
     console.log('ddd=' + userId);
     if (userId == null) {
         res.redirect("/login");
         return;
     }
 
     var sql = "SELECT * FROM `users` WHERE `id`='" + userId + "'";
 
     db.query(sql, function (err, results) {
         res.render('dashboard.ejs', { user: user });
     }); */
};
//------------------------------------logout functionality----------------------------------------------
exports.logout = function (req, res) {
    req.session.destroy(function (err) {
        res.redirect("/signup");
    })
};
//--------------------------------render user details after login--------------------------------
exports.profile = function (req, res) {
   /*  var email = req.session.emailaddress;
   
    if (email == null) {
        res.redirect("/signup");
        return;
    }

    var sql = "SELECT * FROM `users` WHERE `email`='" + email + "'";
    db.query(sql, function (err, result) {
        res.render('profile.ejs', { data: result });
    }); */
};
//---------------------------------edit users details after login----------------------------------
exports.editprofile = function (req, res) {
    var emailaddress = req.session.email;
    if (emailaddress == null) {
        res.redirect("/profile");
        return;
    }
    var sql = "SELECT * FROM `users` WHERE `email`='" + emailaddress + "'";
    db.query(sql, function (err, results) {
        res.render('edit_profile.ejs', { data: results });
    }); 
   // res.render('edit_profile.ejs', { data: results });
};

exports.update = function (req, res) {
    var emailaddress = req.session.email;
    message='';
    if (req.method == "POST") {
        var post = req.body;
        var pass = post.password;
        var fname = post.full_name;
        var eml = post.emailaddress;

        var sql = "update `users` set `full_name`='" + fname + "',`email`='" + eml + "', `password`='" + pass + "' where email='" + emailaddress + "'";

        var query = db.query(sql, function (err, result) {
            if (err) {
                message = 'Updation failed ' + err;
                res.redirect("/profile");
            }
            else {
                message = 'Updation Success ' + err;
                res.redirect('/signup')
               // res.render('signup.ejs', { message: message });
            }

});
}
    
};
