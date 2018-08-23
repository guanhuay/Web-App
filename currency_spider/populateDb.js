var fs = require('fs');
var models = require('./models');
var Sequelize = require('sequelize');
var Promise = require('bluebird');

models.sequelize.sync().then(function() {
    models.Time.create({
    }).then(function(u1){
      models.Currency.create({
      });
  });
});