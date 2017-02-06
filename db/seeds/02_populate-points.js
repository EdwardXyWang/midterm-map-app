exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries

  return knex("points").del()
    .then(function () {
      return Promise.all([
        // Inserts seed entries
        knex("points").insert({lat: 49.281049, long: -123.107174, description: "Snug, modern Japanese restaurant with sustainably sourced sushi & sashimi for eat-in or takeout.",
          image: "http://bigoven-res.cloudinary.com/image/upload/t_recipe-256/sushi-4.jpg", point_title: "Tsuki Sushi Bar", map_id: 1, created_by: 1}),
        knex("points").insert({lat: 49.277901, long: -123.125677, description: "Traditional & creative sushi plus basic Japanese dishes are served in a small neighbourhood joint.",
          image: "https://s3-media3.fl.yelpcdn.com/bphoto/nPQhClRpP59zn1GDWc1HRA/348s.jpg", point_title: "Yamato Sushi", map_id: 1, created_by: 1}),
        knex("points").insert({lat: 49.276467, long: -123.120883, description: "Vibrant, colorful eatery specializing in sustainably caught Japanese fish & creative hot entrees.",
          image: "http://www.sensesinspired.com/wp-content/uploads/2012/08/Minami_aburi.jpg", point_title: "Minami", map_id: 1, created_by: 1}),
        knex("points").insert({lat: 49.285223, long: -123.107049, description: "Offer a wide range of products and rent complete formal and casual Highland dress for every occasion.",
          image: "http://www.houseofmclaren.com/storefront.jpg", point_title: "House of McLaren", map_id: 2, created_by: 2}),
        knex("points").insert({lat: 49.284557, long: -123.108313, description: "Gallery for art, clothing & jewelry made by indigenous peoples of the Pacific Northwest & Canada.",
          image: "http://hillsnativea238.corecommerce.com/design/images/hills/vancouver_2.jpg", point_title: "Hill's Native Art", map_id: 2, created_by: 2}),
        knex("points").insert({lat: 49.280556, long: -123.103535, description: "It has feng shui products, oriental gifts items, amulets and talisman supplies.",
          image: "https://s3-media1.fl.yelpcdn.com/bphoto/qYv2bnammBQwPqCqZ3_ecA/ls.jpg", point_title: "Chinese Zodiac Gifts & Souvenirs", map_id: 2, created_by: 2}),
        knex("points").insert({lat: 49.285183, long: -123.104173, description: "Pikachus are to be found here!",
          image: "http://vignette2.wikia.nocookie.net/pokemon/images/0/0c/Map_of_Pallet_Town.PNG/revision/latest?cb=20120906071537", point_title: "Pallet Town", map_id: 3, created_by: 2}),
        knex("points").insert({lat: 49.282143, long: -123.110405, description: "The Pewter Gym is the official Gym of Pewter City. It is based on Rock-type Pokémon. The Gym Leader is Brock.",
          image: "http://cdn.bulbagarden.net/upload/6/63/Pewter_Gym_Battlefield.png", point_title: "Pewter Gym", map_id: 4, created_by: 1})
      ]);
    });
};
