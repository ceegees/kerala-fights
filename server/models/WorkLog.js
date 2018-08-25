'use strict';
module.exports = (sequelize, DataTypes) => {
  var WorkLog = sequelize.define('WorkLog', {
     actorId :{
      type:DataTypes.INTEGER,
      field: 'actor_id' 
    },
    requestId:{
      type:DataTypes.INTEGER,
      field: 'request_id' 
    },
    comments:{
      type:DataTypes.TEXT
    },
    statusIn:{
      type:DataTypes.STRING,
      field: 'status_in' 
    },
    statusOut : {
      type:DataTypes.STRING,
      field: 'status_out' 
    },
    createdAt: { 
      type: DataTypes.DATE, 
      field: 'created_at' 
    },
    updatedAt: { 
      type: DataTypes.DATE, field: 'updated_at' 
    },
  }, {
    tableName: 'work_logs',
    timestamps: true, 
  });
  WorkLog.associate = function(models) {
    // associations can be defined here
  };

  return WorkLog;
};