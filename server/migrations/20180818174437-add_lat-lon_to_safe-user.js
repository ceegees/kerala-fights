'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return [
      queryInterface.addColumn('SafeUsers', 'latitude', {
        type: Sequelize.DECIMAL(10,7)
      }),
      queryInterface.addColumn('SafeUsers', 'longitude', {
        type: Sequelize.DECIMAL(10,7)
      })
    ];
  },
  down: (queryInterface, Sequelize) => {
    return [
      queryInterface.removeColumn('SafeUsers', 'latitude'),
      queryInterface.removeColumn('SafeUsers', 'longitude')
    ];
  }
};
