
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
//console.log(knex.select("id").from("users").pluck("id"));

  return knex("maps").del()
    .then(function () {
      return Promise.all([
        // Inserts seed entries
        knex("maps").insert({map_title: "Sushi Restaurants", created_by: 1}),
        knex("maps").insert({map_title: "Gift Shops", created_by: 2}),
        knex("maps").insert({map_title: "Poke Stops", created_by: 1}),
        knex("maps").insert({map_title: "Gyms", created_by: 2})
      ]);
    });
};
