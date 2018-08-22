'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return [
      queryInterface.addColumn('marked_locations', 'contact_name', {
        type: Sequelize.STRING
      }),
      queryInterface.addColumn('marked_locations', 'phone_number', {
        type: Sequelize.STRING
      }),
      queryInterface.addColumn('marked_locations', 'address', {
        type: Sequelize.TEXT
      }),
      queryInterface.addColumn('marked_locations', 'people_count', {
        type: Sequelize.INTEGER
      }),
      queryInterface.addColumn('marked_locations', 'kids_count', {
        type: Sequelize.INTEGER
      }),
      queryInterface.addColumn('marked_locations', 'male_count', {
        type: Sequelize.INTEGER
      }),
      queryInterface.addColumn('marked_locations', 'female_count', {
        type: Sequelize.INTEGER
      }),
      queryInterface.addColumn('marked_locations', 'latitude', {
        type: Sequelize.DECIMAL(10,7)
      }),
      queryInterface.addColumn('marked_locations', 'longitude', {
        type: Sequelize.DECIMAL(10,7)
      })
    ];
  },

  down: (queryInterface, Sequelize) => {
    return [
      queryInterface.removeColumn('marked_locations', 'contact_name'),
      queryInterface.removeColumn('marked_locations', 'phone_number'),
      queryInterface.removeColumn('marked_locations', 'address'),
      queryInterface.removeColumn('marked_locations', 'people_count'),
      queryInterface.removeColumn('marked_locations', 'kids_count'),
      queryInterface.removeColumn('marked_locations', 'male_count'),
      queryInterface.removeColumn('marked_locations', 'female_count'),
      queryInterface.removeColumn('marked_locations', 'latitude'),
      queryInterface.removeColumn('marked_locations', 'longitude')
    ];
  }
};
