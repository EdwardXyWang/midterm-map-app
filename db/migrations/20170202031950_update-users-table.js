
exports.up = function(knex, Promise) {
    return knex.schema.table("users", function (table) {
    table.dropColumn("name");
    table.string("email");
    table.string("password");
    table.string("first_name");
    table.string("last_name");
  })
};

exports.down = function(knex, Promise) {
    return knex.schema.table("users", function (table) {
    table.string("name");
    table.dropColumn("email");
    table.dropColumn("password");
    table.dropColumn("first_name");
    table.dropColumn("last_name");
  })
};
