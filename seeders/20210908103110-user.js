'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * */
    await queryInterface.bulkInsert('Users', [{
      username: 'admin',
      email: "admin@gmail.com",
      password: "admin",
      avatarfilename: "",
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
    
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example: */
    await queryInterface.bulkDelete('Users', null, {});
    
  }
};
