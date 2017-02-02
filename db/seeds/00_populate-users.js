
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex("users").del()
    .then(function () {
      return Promise.all([
        // Inserts seed entries
        knex("users").insert({id: 1, email: "ash@pokemon.com", password: "pikachu", first_name: "Ash", last_name: "Ketchum"}),
        knex("users").insert({id: 2, email: "gary@pokemon.com", password: "growlithe", first_name: "Gary", last_name: "Oak"})
      ]);
    });
};

