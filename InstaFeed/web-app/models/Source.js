
module.exports = function(sequelize, DataType) {
    var Source = sequelize.define('Source', {
    	//id is a string to follow sources.json format   
        source_id_name: {
            type: DataType.STRING,
            field: 'source_id_name',
            primaryKey: true   		
    	},
        name: {
            type: DataType.STRING,
            field: 'name'
        }
    },{
    	'timestamps':false,
        classMethods: {
		    associate: function(models) {
		    	// * <-> * many sources to many categories
		        models.Source.belongsToMany(models.Category, {through: 'SourceCategory',foreignKey: 'source',timestamps:false});
		        // 1 -> * one source has many articles
		        models.Source.belongsToMany(models.Article, {through: 'SourceHasManyArticle',foreignKey: 'source', timestamps:false});
                //source and user * <-> *
                models.Source.belongsToMany(models.User, {through: 'Users_Source', timestamps:false});
		    }
		}
    });

    return Source;
};
