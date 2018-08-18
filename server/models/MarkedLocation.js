'use strict';
module.exports = (sequelize, DataTypes) => {
  var MarkedLocation = sequelize.define('MarkedLocation', { 
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