
module.exports = function(sequelize, DataType) {
    var Category = sequelize.define('Category', {
        name: {
            type: DataType.STRING,
            field: 'name'
        }
    },{
    	'timestamps':false,
        classMethods: {
            associate: function(models) {
                models.Category.belongsToMany(models.Source, {through: 'SourceCategory',foreignKey: 'category_id',timestamps:false});
            }
        }    	
    });
    
    return Category;

};
