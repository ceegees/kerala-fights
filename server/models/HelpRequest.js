'use strict';
module.exports = (sequelize, DataTypes) => {
  var HelpRequest = sequelize.define('HelpRequest', {
 
    personName: { 
      type: DataTypes.STRING, 
      field:'person_name'
    },
    source:{
      type:DataTypes.STRING
    },
    phoneNumber: { 
      type: DataTypes.STRING ,
      field:'phone_number'
    },
    peopleCount: { 
      type: DataTypes.INTEGER, 
      field: 'people_count' 
    },
    parentId: { 
      type: DataTypes.INTEGER, 
      field: 'parent_id' 
    },
    retryAt:{
      type:DataTypes.DATE,
      field:'retry_at'
    },
    type: { type: DataTypes.STRING },
    location: { type: DataTypes.STRING },
    district: { type: DataTypes.STRING },
    information: { type: DataTypes.TEXT },
    address: { type: DataTypes.TEXT },
    powerBackup: {
      type:DataTypes.STRING,
      field:'power_backup'
    },
    latLng: { 
      type: DataTypes.GEOMETRY('Point'),
      field:'lat_lng'
    },
    json: { 
      type: DataTypes.JSONB 
    },
    refId:{
      type:DataTypes.STRING,
      field:'ref_id'
    },
    remoteId:{
      type:DataTypes.INTEGER,
      field:'remote_id'
    },
    status:{type:DataTypes.STRING},
    operatorStatus:{
      type:DataTypes.STRING,
      field:'operator_status'
    },
    operatorLockAt:{
      type:DataTypes.DATE,
      field:'operator_lock_at'
    },
    operatorId:{
      type:DataTypes.INTEGER,
      field:'operator_id'
    },
    operatorSeverity:{
      type:DataTypes.INTEGER,
      field:'operator_severity',
      defaultValue:-1
    },
    operatorUpdatedAt:{
      type: DataTypes.DATE, 
      field: 'operator_updated_at' 
    },
    createdAt: { type: DataTypes.DATE, field: 'created_at' },
    updatedAt: { type: DataTypes.DATE, field: 'updated_at' },
  }, {
    tableName: 'help_requests', 
  });
  HelpRequest.associate = function(models) { 
  };
  HelpRequest.prototype.chanegStatus = function(message,newStatus,user){



    // models.WorkLog.create({
    //   messages:messages,
    //   statusIn:
    //   statusOut:
    //   actorId:
    //   requestId:this.id
    // }).then(log => {

    // }).then()

  }
  return HelpRequest;
};