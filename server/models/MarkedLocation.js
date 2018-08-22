'use strict';
module.exports = (sequelize, DataTypes) => {
  var MarkedLocation = sequelize.define('MarkedLocation', { 
    type: { type: DataTypes.STRING, field: 'type' },
    contactName: { type: DataTypes.STRING, field: 'contact_name' },
    phoneNumber: { type: DataTypes.STRING, field: 'phone_number' },
    address: { type: DataTypes.TEXT, field: 'address' },
    peopleCount: { type: DataTypes.INTEGER, field: 'people_count' },
    kidsCount: { type: DataTypes.INTEGER, field: 'kids_count' },
    maleCount: { type: DataTypes.INTEGER, field: 'male_count' },
    femaleCount: { type: DataTypes.INTEGER, field: 'female_count' },
    latLng: { 
      type: DataTypes.GEOMETRY('Point'),
      field: 'lat_lng'
    },
    radius: { type: DataTypes.INTEGER, field: 'radius' },
    latitude: { type: DataTypes.DECIMAL(10,7), field: 'latitude' },
    longitude: { type: DataTypes.DECIMAL(10,7), field: 'longitude' },
    information: { type: DataTypes.TEXT, field: 'information' },
    serviceEndDate: { type: DataTypes.DATE, field: 'service_end_date' },
    createdAt: { type: DataTypes.DATE, field: 'created_at' },
    updatedAt: { type: DataTypes.DATE, field: 'updated_at' },
}, {
  tableName: 'marked_locations',
  timestamps: true,
  underscored: true
});
  MarkedLocation.associate = function(models) {
    // associations can be defined here
  };
  return MarkedLocation;
};