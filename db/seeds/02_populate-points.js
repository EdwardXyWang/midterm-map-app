exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries

  return knex("points").del()
    .then(function () {
      return Promise.all([
        // Inserts seed entries
        knex("points").insert({id: 1, lat: 49.281, long: -123.108, description: "Test one",
          image:, point_title: "One", map_id: 1, created_by: 1}}),
        knex("points").insert({id: 2, lat: 49.290, long: -123.109, description: "Test two",
          image:, point_title: "Two", map_id: 1, created_by: 1}}),
        knex("points").insert({id: 3, lat: 49.282, long: -123.107, description: "Test three",
          image:, point_title: "Three", map_id: 1, created_by: 1}}),
        knex("points").insert({id: 4, lat: 49.283, long: -123.106, description: "Test four",
          image:, point_title: "Four", map_id: 2, created_by: 2}}),
        knex("points").insert({id: 5, lat: 49.284, long: -123.105, description: "Test five",
          image:, point_title: "Five", map_id: 2, created_by: 2}}),
        knex("points").insert({id: 6, lat: 49.285, long: -123.104, description: "Test six",
          image:, point_title: "Six", map_id: 2, created_by: 2}})
      ]);
    });
};
