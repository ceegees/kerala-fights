'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return [
      queryInterface.addColumn('marked_locations', 'district', {
        type: Sequelize.STRING
      }),
      queryInterface.addColumn('marked_locations', 'json', {
        type: Sequelize.JSONB
      })
    ];
  },

  down: (queryInterface, Sequelize) => {
    return [
      queryInterface.removeColumn('marked_locations', 'district'),
      queryInterface.removeColumn('marked_locations', 'json')
    ];
  }
};
