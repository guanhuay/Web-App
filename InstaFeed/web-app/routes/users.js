var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var validator = require('validator');
var bcrypt = require('bcryptjs');
var models = require('../models');
var url = require('url');
var loginMiddleware = require('../middleware/isAuthenticate.js')(models);
var sessionMiddleware = require('../middleware/sessionExist.js')(models);
var toonavatar = require('cartoon-avatar');
//General Page
//------------------------------------------------------------------------------------------------------------------------------
// Home Route
router.get('/', function(req,res){
	res.statusCode = 200;
    res.render('home');
});

//DashBoard Route for typical user
router.get('/users/:user', loginMiddleware.isAuthenticate, function(req,res){
	var username = req.params['user'];
	res.statusCode = 301;
	res.redirect('/feed/'+username);

});
//------------------------------------------------------------------------------------------------------------------------------

//Sign Up Page
//------------------------------------------------------------------------------------------------------------------------------
//Sign Up GET Method
router.get('/signup', sessionMiddleware.sessionExist, function(req,res){
    res.statusCode = 200;
    res.render('signup');
})

//Sign Up POST Method
router.post('/signup', function(req,res){
	var uname = req.body.username;
	var email = req.body.email;
	var sex = req.body.sex;
	var psw = req.body.password;
	var psw2 = req.body.password2;
	//simple test the form submit message
	//console.log(uname + " " + email + " " + psw + " " + psw2 + " ");

	//Validation
	var duplicateErrors = 0;
	models.User.findAll().then(function(user){
		//case1: when user already exist in the database
		for(var i=0;i<user.length;i++){
			if(user[i].username === uname){
				duplicateErrors = 1;
			}
			else if(user[i].email === email){
				duplicateErrors = 2;
			}
		}
		//case2: when some field are missing
		if(validator.isEmpty(uname) || validator.isEmpty(email) || validator.isEmpty(psw) || validator.isEmpty(psw2)){
			res.render('signup', {
				validateErrors: "Some field is missing! Please make sure all filed are filled!"
			});
		}
		//case 3: email not valid
		else if(!validator.isEmail(email)){
			res.render('signup', {
				validateErrors: "Email is not valid!"
			});
		}
		//case 4: password not match
		else if(!validator.equals(psw,psw2)){
			res.render('signup', {
				validateErrors: "Passwords does not match!"
			});
		}
		//case 5: password length is too short
		else if(!validator.isLength(psw,{min:8,max:undefined})){
			res.render('signup', {
				validateErrors: "Password length is too short, it must be at least of length 8!"
			});
		}
		//case 6: password does not contain letter
		else if(validator.isNumeric(psw)){
			res.render('signup', {
				validateErrors: "Password must be at least 8 characters mixed with number and letter!"
			});
		}
		//for case 1 & 2
		else if(duplicateErrors === 1){
			res.render('signup',{
				validateErrors: "Username has already taken! Please try another one!"
			});
		}
		else if(duplicateErrors === 2){
			res.render('signup',{
				validateErrors: "Email has already used! Please try another one!"
			});
		}
		//if all case passed, create the new user
		else{
			var url = toonavatar.generate_avatar({"gender":sex})
			let epass = bcrypt.hashSync(psw,10);
			models.User.create({
				username: uname,
				sex: sex,
				email: email,
				password: epass,
				avatar: url
			})
			req.flash('success_msg', 'You are now registered with InstaFeed, Congradulation!');
			res.statusCode = 301;
			res.redirect('/signin');
		}
	});
});
//------------------------------------------------------------------------------------------------------------------------------


//Signin page
//------------------------------------------------------------------------------------------------------------------------------
//Sign In GET Method
router.get('/signin', sessionMiddleware.sessionExist, function(req,res){
	// console.log("the connect sid is: "+ req.cookies["connect.sid"]);
    res.statusCode = 200;
    res.render('signin');
});

//Sign in Local Strategy definiton
passport.use('local', new LocalStrategy(
  function(username, password, done) {
    models.User.findOne({where:{username:username}}).then(function(user){
      //console.log("the LocalStrategy return " + user.username);
      //console.log(user);
      if(user === null || user === undefined){
      	return done(null,false, {message: "User not found!"});
      }
      if (user.username !== username) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (bcrypt.compareSync(password, user.password) === false) {
      	//console.log("the password is not match!");
        return done(null, false, { message: 'Incorrect password.' });
      }
      //console.log("the user match!!!");
      return done(null, user);
    });
}));

//serialize method for session
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  models.User.findById(id).then(function(user) {
    //console.log('deserializing user:',user);
    done(null, user);
  }).catch(function(err) {
    if (err) {
      throw err;
    }
 });
});

//Sign In POST Method
router.post(['/signin'],
  	passport.authenticate('local', {failureRedirect: '/signin', failureFlash: true}),
  	function(req,res){
		// console.log("the connect sid is: "+ req.cookies["connect.sid"]);
		//create a new session entry for this user when log in
		models.User.findOne({where:{username: req.body.username}}).then(function(user){
			models.Session.create({
				sessionKey: req.cookies["connect.sid"],
				sessionUser: user.id,
			})
		});
  		res.statusCode = 301;
  		res.redirect('/users/'+ req.body.username);
});

//Logout Route
router.get('/logout',function(req,res){
    //console.log("the request sessionKey is: " + req.cookies['connect.sid']);
	req.logOut();
	req.flash('success_msg', 'You are logged out');
	//clearup session
    req.session.destroy();
	res.statusCode = 302;
	res.redirect('/signin');
})
//------------------------------------------------------------------------------------------------------------------------------


//User Setting Route
//------------------------------------------------------------------------------------------------------------------------------
//Setting GET Method
router.get('/setting/:user', loginMiddleware.isAuthenticate, function(req,res){
	res.statusCode = 200;
	// res.render('setting');
	models.User.findOne({
		where:{
			username: req.params['user']
		}
	}).then(function(user){
		res.render('setting', {
			username: req.params['user']
		});
	})
})

//Setting POST Method
router.post('/setting/:user', loginMiddleware.isAuthenticate, function(req,res){
	var uname = req.body.username;
	// var email = req.body.email;
	var psw = req.body.password;
	var psw2 = req.body.password2;
	var olduname = req.params['user']
	// var avatar = req.body.avatar;
	// console.log("the avatar is: " + avatar);
	//console.log(uname + " " + email + " " + psw + " " + psw2 + " ");
	var usernameFlag;
	var passwordFlag;
	//case 1: username field not empty, update it
	if(!validator.isEmpty(uname)){
		models.User.update({
			username: uname
		},{
			where: {
				username: olduname
			}
		})
		usernameFlag = 1;
	}
	else{
		usernameFlag = 0;
	}
	//case 2: password 1 and 2 field match, is not empty, contain letter and with length >=8, update it
	if(!validator.isEmpty(psw) && !validator.isEmpty(psw2) && validator.equals(psw,psw2) && validator.isLength(psw,{min:8,max:undefined}) && !validator.isNumeric(psw)){
		var epass = bcrypt.hashSync(psw,10);
		models.User.update({
			password: epass
		},{
			where: {
				username: olduname
			}
		})
		passwordFlag = 1;
	}
	else{
		passwordFlag = 0;
	}
	// //case 3: change avatar
	// if(avatar === "on"){
	// 	models.User.findOne({
	// 		where:{
	// 			username: olduname
	// 		}
	// 	}).then(function(user){
	// 		var url = toonavatar.generate_avatar({"gender":user.sex});
	// 		models.User.update({
	// 			avatar: url
	// 		},{
	// 			where: {
	// 				username: olduname
	// 			}
	// 		})
	// 	})
	// }
	//flag = 0 means update failed, flag = 1 means update successfully
	if(usernameFlag === 0 && passwordFlag === 0){
		req.flash('error_msg', 'Update failed, please make sure you type in the correct information!');
		res.statusCode = 302;
		res.redirect('/setting/'+ olduname);
	}
	else if(usernameFlag === 0 && passwordFlag === 1){
		req.flash('success_msg', 'You are successfully update your password!');
		req.flash('error_msg', 'Your username does not update successfully!')
		res.statusCode = 302;
		res.redirect('/setting/'+ olduname);
	}
	else if(usernameFlag === 1 && passwordFlag === 0){
		req.flash('success_msg', 'You are successfully update your username!');
		req.flash('error_msg', 'Your password does not update successfully!')
		res.statusCode = 302;
		res.redirect('/setting/'+ olduname);
	}
	else if(usernameFlag === 1 && passwordFlag === 1){
		req.flash('success_msg', 'You are successfully update your information!');
		res.statusCode = 302;
		res.redirect('/setting/'+ olduname);
	}
})


router.get('/:user/favorite', loginMiddleware.isAuthenticate, function(req,res){
	// console.log("the connect sid is: "+ req.cookies["connect.sid"]);
    res.statusCode = 200;
    res.render('favorite');
});




module.exports = router;
