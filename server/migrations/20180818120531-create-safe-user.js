'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('SafeUsers', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      phone_number: {
        type: Sequelize.STRING
      },
      current_location_type: {
        type: Sequelize.STRING
      },
      lat_lng:{
        type:Sequelize.GEOMETRY('Point')
      },
      contact_info: {
        type:Sequelize.TEXT
      },
      type: {
        type: Sequelize.STRING,
        defaultValue: "SELF"
      },
      creator_name: {
        type: Sequelize.STRING
      },
      creator_phone: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('SafeUsers');
  }
};