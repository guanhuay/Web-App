var Sequelize = require('sequelize');
module.exports = function(sequelize, DataType) {
    var Time = sequelize.define('Time', {
        TimeID: {
            type: DataType.STRING,
            field: 'timeid',
            unique: true,
            primaryKey: true
        }
    },
    {
        //create many to many association for favorite feature
        classMethods: {
            associate: function(models) {
            	models.Time.belongsTo(models.Currency, {constraints: true});
            }
        },
        'timestamps': false
    });
    return Time;
};