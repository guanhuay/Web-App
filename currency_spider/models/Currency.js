var Sequelize = require('sequelize');
module.exports = function(sequelize, DataType) {
    var Currency = sequelize.define('Currency', {
        Timeid: {
            type: DataType.STRING,
            field: 'time_id',
        },
        // CurrencyName: {
        //     type: DataType.STRING,
        //     field: 'currencyName'
        // },
        // BuyingRate: {
        //     type: DataType.STRING,
        //     field: 'buyingRate'
        // },
        // CashBuyingRate: {
        //     type: DataType.STRING,
        //     field: 'cashBuyingRate'
        // },
        // SellingRate: {
        //     type: DataType.STRING,
        //     field: 'sellingRate'
        // },
        // CashSellingRate: {
        //     type: DataType.STRING,
        //     field: 'cashSellingRate'
        // },
        // MiddleRate: {
        //     type: DataType.STRING,
        //     field: 'middleRate'
        // },
        DateTime: {
            type: DataType.STRING,
            field: 'dateTime'
        }
    },
    {
        //create many to many association for favorite feature
        classMethods: {
            associate: function(models) {
                models.Currency.hasMany(models.Time, {foreignKey: 'time_id', sourceKey: 'timeid', constraints: true, onDelete: 'cascade', hooks: true});
            }
        },
        'timestamps': false
    });
    return Currency;
};