'use strict';
module.exports = (sequelize, DataTypes) => {
  var SafeUser = sequelize.define('SafeUser', {
    name: DataTypes.STRING,
    phoneNumber: { 
      type: DataTypes.STRING,
      field: 'phone_number'
    },
    currentLocationType: { 
      type: DataTypes.STRING,
      field: 'current_location_type'
    },
    latLng: { 
      type: DataTypes.GEOMETRY('Point'),
      field:'lat_lng'
    },
    contactInfo: { 
      type: DataTypes.STRING,
      field: 'contact_info'
    },
    type: DataTypes.STRING,
    creatorName: { 
      type: DataTypes.STRING,
      field: 'creator_name'
    },
    creatorPhone: { 
      type: DataTypes.STRING,
      field: 'creator_phone'
    }
  }, {});
  SafeUser.associate = function(models) {
    // associations can be defined here
  };
  return SafeUser;
};