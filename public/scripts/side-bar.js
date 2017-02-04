$(() =>{

  $.ajax({
    method: "GET",
    url: "/maps"
  }).done((maps) => {
    for(map of maps) {
      $("<a>").attr("href", "#").data("map_id", map.id).text(map.map_title).addClass("list-group-item").appendTo($(".map-list"));
    }
  });


  $(".map-list").on("click", "a", function () {
    $(".maps-pane").addClass("hide-pane");
    $(".points-pane").removeClass("hide-pane");
    const map_id = $(this).data().map_id;

    $.ajax({
      method: "GET",
      url: "/maps/" + map_id
    }).done((points) => {
      for(point of points) {
      $("<a>").attr("href", "#").text(point.point_title).addClass("list-group-item").appendTo($(".points-list"));
      }
      $("<div>").text("Map Created by: " + points[0].first_name + " " + points[0].last_name).appendTo($(".map-created-by"));
    });

  });

})
