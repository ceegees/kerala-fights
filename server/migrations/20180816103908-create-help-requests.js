'use strict';
//CREATE EXTENSION postgis;
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('help_requests', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      source:{
        type:Sequelize.STRING
      },
      person_name:{
        type:Sequelize.STRING
      },
      phone_number: {
        type:Sequelize.STRING
      },
      people_count:{
        type:Sequelize.INTEGER
      },
      type:{
        type:Sequelize.STRING
      },
      location:{
        type:Sequelize.STRING
      },
      district :{
        type:Sequelize.STRING
      },
      power_backup :{
        type:Sequelize.STRING
      },
      lat_lng:{
        type:Sequelize.GEOMETRY('Point')
      },
      information:{
        type:Sequelize.TEXT
      },
      address:{
        type:Sequelize.TEXT
      },
      json:{
        type:Sequelize.JSONB
      },
      parent_id:{
        type:Sequelize.INTEGER,
      },
      ref_id:{
        type:Sequelize.STRING,
        unique:true
      },
      remote_id:{
        type:Sequelize.INTEGER, 
      },
      status:{
        type:Sequelize.STRING,
        defaultValue:"NEW"
      },
      operator_severity:{
        type:Sequelize.INTEGER,
        defaultValue:-1
      },
      operator_status:{
        type:Sequelize.STRING,
        defaultValue:'NEW'
      },
      operator_updated_at:{
        type: Sequelize.DATE
      },
      operator_lock_at:{
        type:Sequelize.DATE
      },
      operator_id:{
        type:Sequelize.INTEGER
      },
      retry_at: {
        type: Sequelize.DATE
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    }).then(()=>  queryInterface.addIndex('help_requests',['operator_status'])
      ).then(() => queryInterface.addIndex('help_requests', ['operator_severity'])
      ).then(() =>  queryInterface.addIndex('help_requests', ['remote_id'])
      ).then(() =>  queryInterface.addIndex('help_requests', ['ref_id'])
      ).then(()=> queryInterface.addIndex('help_requests', ['status'])
      ).then(()=> queryInterface.addIndex('help_requests', ['district'])
      ).then(()=> queryInterface.addIndex('help_requests', ['lat_lng'])
      ).then(()=> queryInterface.addIndex('help_requests', ['parent_id'])
      ).then(()=> queryInterface.addIndex('help_requests', ['phone_number']));
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('help_requests');
  }
};