module.exports = function(sequelize, DataType) {
    var Comment = sequelize.define('Comment', {
    	//id is a string to follow sources.json format
        description: {
            type: DataType.STRING,
            field: 'description'
    	  },
        replyid: {
            type: DataType.INTEGER,
            field: 'replyid'
        }
    },{
    	  'timestamps':true,
        classMethods: {
		    associate: function(models) {
		    	// each comment belongs to one article
		        models.Comment.belongsTo(models.Article, {timestamps:false});
		        // each comment belongs to one user
		        models.Comment.belongsTo(models.User, {timestamps:false});
		    }
		}
    });

    return Comment;
};
