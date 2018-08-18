'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('work_logs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT
      },
      actor_id:{
        type:Sequelize.INTEGER
      },
      request_id:{
        type:Sequelize.INTEGER
      },
      comments:{
        type:Sequelize.TEXT
      },
      status_in : {
        type:Sequelize.STRING
      },
      status_out : {
        type:Sequelize.STRING
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    }).then(()=>  queryInterface.addIndex('work_logs',['actor_id'])
    ).then(() => queryInterface.addIndex('work_logs', ['request_id'])
    ).then(() =>  queryInterface.addIndex('work_logs', ['status_in'])
    ).then(() =>  queryInterface.addIndex('work_logs', ['status_out']));
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('work_logs');
  }
};