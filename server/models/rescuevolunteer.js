'use strict';
module.exports = (sequelize, DataTypes) => {
  var RescueVolunteer = sequelize.define('RescueVolunteer', {
    name: DataTypes.STRING,
    phoneNumber: { 
      type: DataTypes.STRING,
      field: 'phone_number'
    },
    latitude: DataTypes.DECIMAL(10,7),
    longitude: DataTypes.DECIMAL(10,7),
    type: DataTypes.STRING,
    info: DataTypes.TEXT,
    status: DataTypes.STRING
  }, {});
  RescueVolunteer.associate = function(models) {
    // associations can be defined here
  };
  return RescueVolunteer;
};
