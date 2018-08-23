'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return [
      queryInterface.addColumn('users', 'leader_id', {
        type: Sequelize.INTEGER
      }),
      queryInterface.addColumn('users', 'role', {
        type: Sequelize.STRING
      }),
      queryInterface.addColumn('users', 'team', {
        type: Sequelize.STRING
      }),
      queryInterface.addColumn('users', 'aadhar_number', {
        type: Sequelize.STRING
      }),
      queryInterface.addColumn('users', 'password_token', {
        type: Sequelize.STRING
      }),
      queryInterface.addColumn('users', 'json', {
        type: Sequelize.JSONB
      }),
      queryInterface.addIndex('users', ['leader_id', 'aadhar_number'])
    ];
  },

  down: (queryInterface, Sequelize) => {
    return [
      queryInterface.removeColumn('users', 'leader_id'),
      queryInterface.removeColumn('users', 'role'),
      queryInterface.removeColumn('users', 'team'),
      queryInterface.removeColumn('users', 'aadhar_number'),
      queryInterface.removeColumn('users', 'password_token'),
      queryInterface.removeColumn('users', 'json')
    ];
  }
};
