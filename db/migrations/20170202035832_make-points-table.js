
exports.up = function(knex, Promise) {
    return knex.schema.createTable("points", function (table) {
    table.increments();
    table.float("lat");
    table.float("long");
    table.string("description");
    table.string("image"); // path to where image is stored locally
    table.string("point_title");
    table.integer("map_id").unsigned();
    table.foreign("map_id").references("maps.id");
    table.integer("created_by").unsigned();
    table.foreign("created_by").references("users.id");
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable("points");
};
