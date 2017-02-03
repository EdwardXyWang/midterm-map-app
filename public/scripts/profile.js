$(() => {

  const pathname = window.location.pathname;
  //  //Accesses user's first name and last name
  //   $.ajax({
  //   method: "GET",
  //   url: pathname
  // }).done((names) => {
  //   for(name of names) {
  //     $("<h4>")text(name.first_name + " " + name.last_name).addClass("list-group-item").appendTo($(".map-list"));
  //   }
  // });

  //Accesses list of maps that user has created
  $.ajax({
    method: "GET",
    url: pathname + "/maps"
  }).done((maps) => {
    for(map of maps) {
      $("<a>").attr("href", "#").text(map.map_title).addClass("list-group-item").appendTo($(".map-list"));
    }
  });

   //Accesses list of maps that user has contributed to
   $.ajax({
    method: "GET",
    url: pathname + "/contributions"
  }).done((contributions) => {
    for(contribution of contributions) {
      $("<a>").attr("href", "#").text(contribution.map_title).addClass("list-group-item").appendTo($(".map-contributions"));
    }
  });

     //Accesses list of user's favoutite maps
     $.ajax({
    method: "GET",
    url: pathname + "/favourites"
  }).done((favourites) => {
    for(favourite of favourites) {
      $("<a>").attr("href", "#").text(favourite.map_title).addClass("list-group-item").appendTo($(".map-favourites"));
    }
  });

});
