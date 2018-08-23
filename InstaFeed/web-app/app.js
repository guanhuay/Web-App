var http = require('http');
var express = require('express');
var bcrypt = require('bcryptjs');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressHandler = require('express-handlebars');
var flash = require('connect-flash');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var validator = require('validator');
var Sequelize = require("sequelize");
// var connection = new Sequelize('instafeed','username','password',{
// 	dialect: 'postgres' || 'sqlite'
// });
var mysql = require('mysql');
var app = express();
// var server = http.createServer(app);
var server = require('http').Server(app);
var io = require('socket.io')(server);
//io.set();
//import from our own file (direct path) dont need .js
var models = require('./models');
var apirouter = express.Router();
var homerouter = require('./routes/users');

//View Engine
app.set('views', path.join(__dirname,'views'));
app.engine('handlebars', expressHandler({defaultLayout: 'default'}));
app.set('view engine', 'handlebars');



var loginMiddleware = require('./middleware/isAuthenticate.js')(models);
//MiddleWare to catch any error
app.use(function(err, req, res, next) {
    console.log(err);
});


//Confirgure app for bodyParser() && cookiepParser()
//let us grab data from the body of POST
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

//Set Static Folder
app.use(express.static(path.join(__dirname,'public')));
app.use('/img',express.static(path.join(__dirname, 'public/img')));
app.use('/js',express.static(path.join(__dirname, 'public/javascript')));
app.use('/css',express.static(path.join(__dirname, 'public/css')));
app.use('/fonts', express.static(path.join(__dirname, 'public/fonts')));
//Express Session
app.use(session({
	secret: 'secret',
	saveUninitialized: true,
	resave: false,
  	cookie: {
    	maxAge: 6000000
  	}
}));
//Passport init
app.use(passport.initialize());
app.use(passport.session());
// Connect Flash MiddleWare
app.use(flash());
// Set Global Variables MiddleWare
app.use(function(req,res,next){
	res.locals.success_msg = req.flash('success_msg');
	res.locals.error_msg = req.flash('error_msg');
	res.locals.error = req.flash('error');
	res.locals.user = req.user || null;
	next();
});
//Set up port for server to listen on
var port = process.env.PORT || 3000;
//Route for Home and User Sign In and Sign Up feature
app.use('/',homerouter);
//app.use('/users',userrouter);
//API Router
//Routes will all be prefixed with /api
app.use('/api', apirouter);
//MIDDLEWARE -
//Just a test to make sure router is working
apirouter.use(function(req,res,next) {
	console.log("Some processing currently running");
	//always call next cuz after some execution of middleware, we want to continue the request
	next();
})
//Test Route
apirouter.get('/', function(req, res){
	res.json({message:"Welcome to our API!"});
});





apirouter.route('/article')
	//get all articles
	.get(loginMiddleware.isAuthenticate, function(req, res){
		 res.set({
	      statusCode : 200,
	      'Content-Type' : 'application/json'
    	});
		 console.log("get route hit");
		var articleObj = {
			"articles":[]
		};
		var counter = 0;
		// var containData = false;
		models.Article.findAll().then(function(articles){
			var length = articles.length;
			if(length!==0) {

				console.log("articles true");
				articles.forEach(function(article){
					counter++;
					var articleItem = {
                "id": article.id,
			        	"author": article.author,
			            "title": article.title,
			            "description": article.description,
			            "url": article.url,
			            "urlToImage": article.urlToImage,
			            "source": article.source,
			            "publishedAt": article.publishedAt
					}
					articleObj.articles.push(articleItem);
					if (counter === length){
            articleObj.articles.sort(function(a,b){
              if(a.publishedAt && b.publishedAt){
                return new Date(b.publishedAt) - new Date(a.publishedAt);
              }
            });
						res.send(JSON.stringify(articleObj,null,3));
					}
				})
			} else {
				console.log("articles false");
				console.log("not contain data");
				res.end();
			}
		});
	})
	.post(loginMiddleware.isAuthenticate, function(req, res){
			console.log("post article running");
			var articleSource = req.body.source;
			var articles = req.body.articles;
			models.Source.findOne({where:{source_id_name:articleSource}}).then(function(source){
				articles.forEach(function(article){
					//create new JSON in db
					models.Article.findOne({where:{title:article.title}}).then(function(exist){
						if(!exist){
							models.Article.create({
						    	author: article.author,
						        title: article.title,
						        description: article.description,
						        url: article.url,
						        urlToImage: article.urlToImage,
						        source: articleSource,
						        publishedAt: article.publishedAt
				    		}).then(function(articleToBeAdded){
				    			//add article to its source
				    			source.addArticle(articleToBeAdded);
				    		})
						}
					})
				})
			})
			console.log("going to end");
			res.end();
	});


apirouter.route('/source')
	.get(loginMiddleware.isAuthenticate, function(req, res){
		res.set({
	      statusCode : 200,
	      'Content-Type' : 'application/json'
    	});
		var sourceObj = {
			"sources":[]
		};
		var counter = 0;
		// var containData = false;
		models.Source.findAll().then(function(sources){
			var length = sources.length;
			console.log("length is :" + length);
			if(length!==0) {
				console.log("source true");
				sources.forEach(function(source){

					var sourceItem = {
						"id": source.id - 1,
						"name": source.name,
						"source_id_name": source.source_id_name,
						"articles": []
					};
					sourceObj.sources.push(sourceItem);
					source.getArticles().then(function(articles){
						for (var j=0;j<articles.length;j++){
							var articleId = articles[j].id;
							console.log(articleId);
							sourceObj.sources[source.id-1].articles.push(articleId);
						}
						counter++;
						console.log("count is :" + counter);
						if (counter === length){
							res.send(JSON.stringify(sourceObj,null,3));
						}
					})
				})
			} else {
				console.log("articles false");
				console.log("not contain data");
				res.end();
			}
		});
	})

apirouter.route('/news/:id')
  .get(loginMiddleware.isAuthenticate, function(req, res) {
    var articleid = req.params.id;
    models.Article.findById(articleid).then(function(article){
      if(!article) {
        res.set({
          statusCode : 504,
          'Content-Type' : 'application/json'
        });
        res.end("504 bad gateway, cannot get artlce by id");
      } else {
        res.set({
          statusCode : 200,
          'Content-Type' : 'application/json'
        });
        var singleArticle = {
          "id": article.id,
          "author": article.author,
          "title": article.title,
          "description": article.description,
          "url": article.url,
          "urlToImage": article.urlToImage,
          "source": article.source,
          "publishedAt": article.publishedAt,
          "comments":[]
        }
        article.getComments().then(function(comments){
          //console.log(comments);
          var comment_size = comments.length;
          if(comment_size > 0) {
            var count = 0;
            console.log("comment size is " + comment_size);
            //for(var k=0; k < comment_size; k++) {
            comments.forEach(function(comment){
              //console.log("this object : " + comments[k].description);
              //console.log("test k : " + k);
              models.User.findById(comment.UserId).then(function(user) {
                if(user) {
                  //console.log("-----------user exist " + k);
                  models.User.findById(comment.replyid).then(function(replyUser) {
                    if(replyUser) {
                      var username = user.username;
                      var replyusername = replyUser.username;
                    } else {
                      var username = user.username;
                      var replyusername = null;
                    }
                    var commentObj = {
                      "id": comment.id,
                      "description": comment.description,
                      "userid": comment.UserId,
                      "username": username,
                      "avatar": user.avatar,
                      "replyid": comment.replyid,
                      "replyuser": replyusername,
                      "create": comment.createdAt,
                      "update": comment.updatedAt,
                    }
                    singleArticle.comments.push(commentObj);
                    count++;
                    //console.log(singleArticle);
                    if(count===comment_size){
                      singleArticle.comments.sort(function(a,b) {
                          return a.id - b.id;
                      });
                      res.send(JSON.stringify(singleArticle, null, 2));
                    }
                  });
                } else {
                  console.log("-----------user does not exist");
                  res.end(JSON.stringify(singleArticle, null, 2));
                }
              });
            });
          } else {
            console.log("no comment");
            res.send(JSON.stringify(singleArticle, null, 2));
          }
        });

      }
    });
  });

apirouter.route('/currentuser')
  .get(loginMiddleware.isAuthenticate, function(req, res) {
    var cookie = req.cookies["connect.sid"];
    if(!cookie) res.end();
    console.log(cookie);
    models.Session.findOne({ where: { sessionKey: cookie}}).then(function(session) {
      models.User.findById(session.sessionUser).then(function(user) {
        var currentUserObj = {
          "id": user.id,
          "username": user.username,
          "sex": user.sex,
          "email": user.email,
          "avatar": user.avatar
        }
        res.send(JSON.stringify(currentUserObj));
      });
    });
  });

app.get('/feed/:user', loginMiddleware.isAuthenticate, function(req, res) {
	res.set({
		statusCode : 200,
		'Content-Type' : 'text/html',
	});
	//res.sendFile(__dirname + '/views/feedo.handlebars');
	res.render('feedo');
});




//get specific article
app.get('/news/:id/', loginMiddleware.isAuthenticate, function(req, res) {
  //var username = req.params('user');
  var articleid = req.params.id;
  models.Article.findById(articleid).then(function(article){
    if(!article) {
      res.set({
        statusCode : 504,
        'Content-Type' : 'text/html',
      });
      res.end("504 bad gateway");
    } else {
      res.set({
        statusCode : 200,
        'Content-Type' : 'text/html'
      });
      // var singleArticle = {
      //   "id": article.id,
      //   "author": article.author,
      //   "title": article.title,
      //   "description": article.description,
      //   "url": article.url,
      //   "urlToImage": article.urlToImage,
      //   "source": article.source,
      //   "publishedAt": article.publishedAt
      // }
      // console.log(singleArticle);
      res.render('news', {articleid: article.id});
    }
  })

});



apirouter.route('/:user/source')
	.get(function(req,res){

		var username = req.params.user;
		var favSourceObj = {
			"userName": username,
			"sourceList":[]
		}
		models.User.findOne({where:{username:username}}).then(function(user){
			console.log("user:"+user);
			user.getSources().then(function(sources){
				var length = sources.length;
				console.log("sources:"+sources);
				    if(length!==0) {
			    	console.log("source exists ");
    			    res.set({
					        statusCode : 200,
					        'Content-Type' : 'text/html',
					      });
					var counter = 0;
					sources.forEach(function(source){
						favSourceObj.sourceList.push(source.source_id_name);
						counter++;
						if (counter === sources.length){
							res.send(JSON.stringify(favSourceObj, null, 3));
						}
					})


			    } else{
				    	res.set({
						        statusCode : 504,
						        'Content-Type' : 'text/html',
						      });
						      res.end();
					    }

			})
		})

	})

	.put(loginMiddleware.isAuthenticate, function(req,res){
		res.set({
		statusCode : 200,
		'Content-Type' : 'text/html',
		});
		var username = req.params.user;
		var aSources = req.body.sources;
		models.User.findOne({where:{username:username}}).then(function(user){
			models.Source.findAll({where:{source_id_name:{in:aSources}}}).then(function(sources){
				user.setSources(sources);
        res.send(username);
			})


	})
})
//Favorite and Unfavorite feature for each user
apirouter.route('/:user/favorite')
	.get(loginMiddleware.isAuthenticate, function(req,res){

		var username = req.params.user;
		var favObj = {
			"userName": username,
			"favoriteList":[]
		}

		models.User.findOne({where:{username: username}}).then(function(user){
			user.getArticles().then(function(articles){
			var length = articles.length;
			var counter = 0;
			if (length !== 0){
				res.statusCode = 200;
				articles.forEach(function(article){
					ArticleObj = {
					    "id": article.id,
			        "author": article.author,
			        "title": article.title,
			        "description": article.description,
			        "url": article.url,
			        "urlToImage": article.urlToImage,
			        "source": article.source,
			        "publishedAt": article.publishedAt
					}
					favObj.favoriteList.push(ArticleObj);
					counter++;
					if (counter === length){
						res.send(JSON.stringify(favObj, null, 3));
					}
				})
			} else{
				res.statusCode = 200;
				res.send();
			}

			})
		})

	})

	.post(loginMiddleware.isAuthenticate, function(req,res){
		var username = req.params['user'];
		console.log(username);
		var title = req.body.title;
		console.log(title);
		models.User.findOne({
			where:{
				username: username
			}
		}).then(function(user){
			models.Article.findOne({
				where:{
					title: title
				}
			}).then(function(article){
				article.addUsers(user.id);
				res.statusCode = 200;
				res.end();
			})
		})
})

	.delete(loginMiddleware.isAuthenticate, function(req,res){
		var username = req.params['user'];
		console.log(username);
		var title = req.body.title;
		console.log(title);
		models.User.findOne({
			where:{
				username: username
			}
		}).then(function(user){
			models.Article.findOne({
				where:{
					title: title
				}
			}).then(function(article){
				console.log(article);
				article.removeUsers(user.id);
				res.statusCode = 200;
				res.end();
			})
		})
})



io.on('connection', function(socket) {
  console.log("user has connected to socket >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
  socket.on('sendNormalComment', function(normalComment) {
    console.log("gotcha client normal comment");
    var articleid = normalComment.article;
    var commentuser = normalComment.commentuser;
    //var replyuser = normalComment.replyuser;
    var content = normalComment.val;
    var avatar = normalComment.avatar;
    models.Article.findById(articleid).then(function(article) {
      models.User.findById(commentuser).then(function(cu) {
      //  models.User.findById(replyuser).then(function(ru) {
            models.Comment.create({
              description: content,
              replyid: null,
              ArticleId: articleid,
              UserId: commentuser
            }).then(function(comment) {
              article.addComment(comment);
              cu.addComment(comment);
              var updateNormalComment = {
                "articleid": articleid,
                "commentid": comment.id,
                "content": content,
                "cuid": commentuser,
                "cuname": cu.username,
                "create": comment.createdAt,
                "update": comment.updateAt,
                "avatar": avatar
              }
              socket.emit('successfulAddNormalComment', updateNormalComment);
              socket.broadcast.emit('successfulAddNormalComment', updateNormalComment);
            });
      //  });
      });
    });
  });

  socket.on('sendReplyComment', function(replyComment) {
    var articleid = replyComment.article;
    var commentuser = replyComment.commentuser;
    var replyuser = replyComment.replyuser;
    var content = replyComment.val;
    var avatar = replyComment.avatar;
    models.Article.findById(articleid).then(function(article) {
      models.User.findById(commentuser).then(function(cu) {
        models.User.findById(replyuser).then(function(ru) {
            models.Comment.create({
              description: content,
              replyid: replyuser,
              ArticleId: articleid,
              UserId: commentuser
            }).then(function(comment) {
              article.addComment(comment);
              cu.addComment(comment);
              var updateReplyComment = {
                "articleid": articleid,
                "commentid": comment.id,
                "content": content,
                "cuid": commentuser,
                "cuname": cu.username,
                "avatar": avatar,
                "replyid": replyuser,
                "replyuser": ru.username,
                "create": comment.createdAt,
                "update": comment.updateAt
              }
              socket.emit('successfulReply', updateReplyComment);
              socket.broadcast.emit('successfulReply', updateReplyComment);
            });
        });
      });
    });

  });

  socket.on('sendEditComment', function(editComment) {
    var content = editComment.val;
    var commentid = editComment.commentid;
    var articleid = editComment.articleid;
    var avatar = editComment.avatar;
    console.log("gonna edit comment in article " + articleid);
    models.Comment.findById(commentid).then(function(comment) {
      if(comment) {
        comment.update({
          description: content
        }, {fields: ['description']}).then(function(){
          var updateEditComment = {
            "content": content,
            "commentid": commentid,
            "articleid": articleid,
            "avatar": avatar
          }
          socket.emit('successfulEdit', updateEditComment);
          socket.broadcast.emit('successfulEdit', updateEditComment);
        })
      }
    })
  })
});

//Fire up server
models.sequelize.sync().then(function(){
    server.listen(port, function() {
        console.log('Server started on port: ' + port);
    });
});
