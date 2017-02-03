$(() => {

  const pathname = window.location.pathname;
  $.ajax({
    method: "GET",
    url: pathname + "/maps"
  }).done((maps) => {
    for(map of maps) {
      $("<a>").attr("href", "#").text(map.map_title).addClass("list-group-item").appendTo($(".map-list"));
    }
  });


   $.ajax({
    method: "GET",
    url: pathname + "/contributions"
  }).done((contributions) => {
    for(contribution of contributions) {
      $("<a>").attr("href", "#").text(contribution.map_title).addClass("list-group-item").appendTo($(".map-contributions"));
    }
  });


     $.ajax({
    method: "GET",
    url: pathname + "/favourites"
  }).done((favourites) => {
    for(favourite of favourites) {
      $("<a>").attr("href", "#").text(favourite.map_title).addClass("list-group-item").appendTo($(".map-favourites"));
    }
  });

});
