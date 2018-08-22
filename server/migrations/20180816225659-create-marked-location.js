'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('marked_locations', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      type:{
        type:Sequelize.STRING
      },
      information:{
        type:Sequelize.TEXT
      },
      lat_lng:{
        type:Sequelize.GEOMETRY('Point')
      },
      radius:{
        type:Sequelize.INTEGER,
        defaultValue:10
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('marked_locations');
  }
};