const TABLE_NAME = 'user';

module.exports = {
  up: async (query, Sequelize) =>
    query.sequelize.transaction((t) =>
      query.createTable(
        TABLE_NAME,
        {
          id: {
            type: Sequelize.STRING,
            primaryKey: true,
            allowNull: false,
          },
          name: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          email: {
            type: Sequelize.STRING,
            allowNull: true,
          },
          zip: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          created_at: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
          },
          updated_at: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
          },
          archived: {
            type: Sequelize.DATE,
            allowNull: true,
          },
        },
        { transaction: t },
      ),
    ),

  down: async (query) =>
    query.sequelize.transaction((t) =>
      query.dropTable(TABLE_NAME, { transaction: t }),
    ),
};
