'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return [
      queryInterface.addColumn('marked_locations', 'service_end_date', {
        type: Sequelize.DATE
      })
    ];
  },

  down: (queryInterface, Sequelize) => {
    return [
      queryInterface.removeColumn('marked_locations', 'service_end_date')
    ];
  }
};
