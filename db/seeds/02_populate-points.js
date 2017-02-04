exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries

  return knex("points").del()
    .then(function () {
      return Promise.all([
        // Inserts seed entries
        knex("points").insert({lat: 49.281, long: -123.108, description: "Test one",
          image: "http://www.fillmurray.com/200/200", point_title: "One", map_id: 1, created_by: 1}),
        knex("points").insert({lat: 49.290, long: -123.109, description: "Test two",
          image: "http://www.fillmurray.com/200/200", point_title: "Two", map_id: 1, created_by: 1}),
        knex("points").insert({lat: 49.282, long: -123.107, description: "Test three",
          image: "http://www.fillmurray.com/200/200", point_title: "Three", map_id: 1, created_by: 1}),
        knex("points").insert({lat: 49.283, long: -123.106, description: "Test four",
          image: "http://www.fillmurray.com/200/200", point_title: "Four", map_id: 2, created_by: 2}),
        knex("points").insert({lat: 49.284, long: -123.105, description: "Test five",
          image: "http://www.fillmurray.com/200/200", point_title: "Five", map_id: 2, created_by: 2}),
        knex("points").insert({lat: 49.285, long: -123.104, description: "Test six",
          image: "http://www.fillmurray.com/200/200", point_title: "Six", map_id: 2, created_by: 2}),
        knex("points").insert({lat: 49.286, long: -123.106, description: "Test seven",
          image: "http://www.fillmurray.com/200/200", point_title: "Seven", map_id: 3, created_by: 2}),
        knex("points").insert({lat: 49.287, long: -123.105, description: "Test eight",
          image: "http://www.fillmurray.com/200/200", point_title: "Eight", map_id: 4, created_by: 1})
      ]);
    });
};
