var fs = require('fs');
var models = require('./models');
var Sequelize = require('sequelize');
var Promise = require('bluebird');
const bcrypt = require('bcryptjs');
var toonavatar = require('cartoon-avatar');
//var Promise = require('./bluebird');
models.sequelize.sync().then(function() {
    //create user table and initialize the relationship
    let pass1 = bcrypt.hashSync("123",10);
    let pass2 = bcrypt.hashSync("456",10);
	var url = toonavatar.generate_avatar({"gender":"male"});
  var url2 = toonavatar.generate_avatar({"gender":"female"});
    models.User.create({
        username: "admin",
        sex: "Male",
        email: "admin@gmail.com",
        password: pass1,
        avatar: url
    }).then(function(u1){
      models.User.create({
        username: "Bar",
        sex: "Female",
        email: "ngfp@gmail.com",
        password: pass2,
        avatar: url2
      });
  });
	// load articles into DB
	fs.readFile('json/articles.json', function(err, data) {
	    var news_data = JSON.parse(data);
	    var articles = news_data['articles'];
	    var articleSource = news_data['source'];
	    articles.forEach(function(article) {
	        models.Article.create({
	        	author: article.author,
	            title: article.title,
	            description: article.description,
	            url: article.url,
	            urlToImage: article.urlToImage,
	            source: articleSource,
	            publishedAt: article.publishedAt
	        });
        });
    });
	fs.readFile('json/sources.json', function(err, data) {
		// load sources into DB
	    var news_data = JSON.parse(data);
	    var sources = news_data['sources'];
	    var  count = 1;
	    sources.forEach(function(source) {

	        models.Source.create({
	        	id:count++,
	        	source_id_name: source.id,
	        	name: source.name
	        	//need to add more in the future
	        }).then(function(sourceCreated){
	        	models.Article.findAll({
	        		where:{source:sourceCreated.source_id_name}
	        	}).then(function(articles){
	        		// console.log(articles.title);
	        		articles.forEach(function(article){
	        			sourceCreated.addArticle(article);
	        		})
	        	})
	        });
        });
    });

  models.User.findById(1).then(function(u1) {
    models.User.findById(2).then(function(u2){
      models.Article.findById(1).then(function(a1) {
        models.Comment.create({
          description: "Hellow World!",
          replyid:2,
          UserId: u1.id,
          ArticleId: a1.id
        }).then(function(c1) {
          models.Comment.create({
            description: "Good day<><><",
            replyid:1,
            UserId: u2.id,
            ArticleId: a1.id
          }).then(function(c2) {
            u1.addComment(c1);
            u2.addComment(c2);
            a1.addComment(c1);
            a1.addComment(c2);
            // c1.set(UserId, u1.id);
            // c2.set(UserId, u2.id);
            // c1.set(ArticleId, a1.id);
            // c1.set(ArticleId, a1.id);
          })
        })
      });
    })
  });

});
