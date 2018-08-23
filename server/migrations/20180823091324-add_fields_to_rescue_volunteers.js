'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return [
      queryInterface.addColumn('RescueVolunteers', 'people_count', {
        type: Sequelize.INTEGER
      }),
      queryInterface.addColumn('RescueVolunteers', 'leader_id', {
        type: Sequelize.INTEGER
      }),
      queryInterface.addColumn('RescueVolunteers', 'role', {
        type: Sequelize.STRING
      }),
      queryInterface.addColumn('RescueVolunteers', 'team', {
        type: Sequelize.STRING
      }),
      queryInterface.addColumn('RescueVolunteers', 'service_status', {
        type: Sequelize.STRING
      }),
      queryInterface.addColumn('RescueVolunteers', 'json', {
        type: Sequelize.JSONB
      }),
      queryInterface.addIndex('RescueVolunteers', ['leader_id'])
    ];
  },

  down: (queryInterface, Sequelize) => {
    return [
      queryInterface.removeColumn('RescueVolunteers', 'people_count'),
      queryInterface.removeColumn('RescueVolunteers', 'leader_id'),
      queryInterface.removeColumn('RescueVolunteers', 'role'),
      queryInterface.removeColumn('RescueVolunteers', 'team'),
      queryInterface.removeColumn('RescueVolunteers', 'service_status'),
      queryInterface.removeColumn('RescueVolunteers', 'json')
    ];
  }
};
