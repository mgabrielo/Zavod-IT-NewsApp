export const up = async function (knex) {
    await knex.schema.createTable('users', function (table) {
        table.increments('id').primary();
        table.string('username', 255).notNullable();
        table.string('email', 255).notNullable().unique();
        table.string('password', 255).notNullable();
        table.enu('role', ['user', 'admin']).defaultTo('user');
        table.timestamps(true, true);
    });

};

export const down = async function (knex) {
    await knex.schema.dropTable('users');
};