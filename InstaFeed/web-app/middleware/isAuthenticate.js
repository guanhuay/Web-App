
//MiddleWare isAuthenticate
//Use for GET or POST /setting/:user and /dashboard
module.exports = function (models) {
	return{
		isAuthenticate: function (req,res,next){
			
			var sessionToken = req.cookies["connect.sid"];
			console.log("sessionToken is " + sessionToken);
			if (sessionToken === undefined || sessionToken === null){
				res.statusCode = 301;
				res.redirect('/signin');
			}
			else{
				// var sessionKey;
				models.Session.findOne({
					where:{
						sessionKey: sessionToken
					}
				}).then(function(exist){
					if(exist === null || exist === undefined){
						//req.flash('error_msg','You are not logged in');
						console.log("you are not logged in");
						res.statusCode = 301;
						res.redirect('/signin');
					}
					else {
						next();
					}
				})

			} 


		}
	};	
};

