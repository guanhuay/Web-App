var Sequelize = require('sequelize');
var bcrypt = require('bcryptjs');

module.exports = function(sequelize, DataType) {

    var User = sequelize.define('User', {
        username: {
            type: DataType.STRING,
            field: 'username',
            unique: true
        },
        sex: {
            type: DataType.STRING,
            field: 'sex'
        },
        email: {
            type: DataType.STRING,
            field: 'email',
            unique: true
        },
        password: {
            type: DataType.STRING,
            field: 'password'
        },
        avatar: {
            type: DataType.STRING,
            field: 'avatar'
        }
    },
    {
        //create many to many association for favorite feature
        classMethods: {
            associate: function(models) {
                models.User.belongsToMany(models.Article,{through: 'Users_Articles', timestamps: false});
                models.User.belongsToMany(models.Comment,{through: 'Users_Comment', timestamps: false});
                models.User.belongsToMany(models.Source, {through: 'Users_Source', timestamps:false});
            }
        },
        'timestamps': false
    });
    return User;
};
// function comparePassword(username,inputPassword,done){
//  models.User.findOne({where:{username:username}}).then(function(user){
//      var isMatch = bcrypt.compareSync(inputPassword, user.password);
//      console.log("the password is match? " + isMatch);
//      if(isMatch){
//          return done(null,user);
//      }
//      else{
//          return done(null, false);
//      }
//  });
// }
