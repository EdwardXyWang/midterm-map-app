
exports.up = function(knex, Promise) {
    return knex.schema.createTable("maps", function (table) {
    table.increments();
    table.string("map_title");
    table.integer("created_by").unsigned();
    table.foreign("created_by").references("users.id");
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable("maps");
};
