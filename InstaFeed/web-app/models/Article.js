var Sequelize = require('sequelize');

module.exports = function(sequelize, DataType) {
    // var Users_Articles = sequelize.define('Users_Articles',{
    //     id:{
    //         type: Sequelize.INTEGER,
    //         primaryKey: true,
    //         autoIncrement: true
    //     }
    // },
    // {
    //     'timestamps': false
    // });

    var Article = sequelize.define('Article', {
        title: {
            type: DataType.STRING,
            field: 'title'
        },
        author: {
            type: DataType.STRING,
            field: 'author'
        },
        description: {
            type: DataType.STRING,
            field: 'description'
        },
        url: {
            type: DataType.STRING,
            field: 'url'
        },
        // Need to figure out a way to store images in DB
        urlToImage: {
            type: DataType.STRING,
            field: 'urlToImage'
        },
        source: {
            type: DataType.STRING,
            field: 'source'
        },

        publishedAt: {
            type: DataType.STRING,
            field: 'publishedAt'
        }
    },
    {
        //create many to many association for favorite feature
        classMethods: {
            associate: function(models) {
                models.Article.belongsToMany(models.User,{through: 'Users_Articles', timestamps: false});
                models.Article.belongsToMany(models.Comment,{through: 'Article_Comment', timestamps: false});
            }
        },
        'timestamps':false
    });

    return Article;
};
