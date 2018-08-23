//MiddleWare sessionExist
//Use for GET /signin and /signup
module.exports = function (models) {
	return{
		sessionExist: function (req,res,next){
			var sessionToken = req.cookies["connect.sid"];
			var sessionKey;
			models.Session.findOne({
				where:{
					sessionKey: sessionToken
				}
			}).then(function(exist){
				if(exist === null){
					next();
				}
				else{
					sessionKey = exist.sessionKey;
					//console.log("the authorized sessionKey is: " + sessionKey);
					//console.log("the request url is: " + url.parse(req.url).pathname);
					var userid = exist.sessionUser;
					models.User.findById(userid).then(function(user){
						var username = user.username;
						res.redirect('/users/'+username);
					})
				}
			})
		}
	}
}