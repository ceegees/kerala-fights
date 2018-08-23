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
    peopleCount: {
      type: DataTypes.INTEGER,
      field: 'people_count'
    },
    leaderId: {
      type: DataTypes.INTEGER,
      field: 'leader_id'
    },
    role: DataTypes.STRING,
    team: DataTypes.STRING,
    serviceStatus: {
      type: DataTypes.INTEGER,
      field: 'service_status'
    },
    json: { 
      type: DataTypes.JSONB 
    },
    info: DataTypes.TEXT,
    status: DataTypes.STRING
  }, {});
  RescueVolunteer.associate = function(models) {
    // associations can be defined here
  };
  return RescueVolunteer;
};
