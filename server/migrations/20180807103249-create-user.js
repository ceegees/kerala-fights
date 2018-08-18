'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      }, 
      provider_id:{
        type:Sequelize.STRING,
        unique:true,
      },
      email: {
        type: Sequelize.STRING
      },
      phone_number:{
        type:Sequelize.STRING
      },
      profile_link : {
        type:Sequelize.STRING,
      },
      status:{
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
    }).then(()=>  queryInterface.addIndex('users',['provider_id'])
    ).then(() => queryInterface.addIndex('users', ['email']));
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('users');
  }
};