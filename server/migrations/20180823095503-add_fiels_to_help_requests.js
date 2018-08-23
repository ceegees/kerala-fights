'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return [
      queryInterface.addColumn('help_requests', 'fulfilled_by', {
        type: Sequelize.INTEGER
      }),
      queryInterface.addColumn('help_requests', 'service_feedback', {
        type: Sequelize.TEXT
      }),
      queryInterface.addColumn('help_requests', 'service_provider_rating', {
        type: Sequelize.INTEGER
      }),
      queryInterface.addIndex('help_requests', ['fulfilled_by'])
    ];
  },

  down: (queryInterface, Sequelize) => {
    return [
      queryInterface.removeColumn('help_requests', 'fulfilled_by'),
      queryInterface.removeColumn('help_requests', 'service_feedback'),
      queryInterface.removeColumn('help_requests', 'service_provider_rating')
    ];
  }
};
