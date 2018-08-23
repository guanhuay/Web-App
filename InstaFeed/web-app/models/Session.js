var Sequelize = require('sequelize');

module.exports = function(sequelize, DataType) {

    var Session = sequelize.define('Session', {
        sessionKey: {
            type: DataType.STRING,
            field: 'sessionKey'
        },
        sessionUser: {
            type: DataType.INTEGER,
            field: 'sessionUser'
        }
    },
    {
        classMethods:{
            //create belongsTo association
            associate: function(models) {
                //models.Session.belongsTo(models.User.id,{through: 'User', timestamps: false});
                models.Session.belongsTo(models.User, {foreignKey: 'sessionUser'});
            }
        },
        'timestamps': false
    });
    return Session;
};