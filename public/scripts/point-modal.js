$(() => {
  var map, searchBox;
  var markers = [];

  function initMap() {
    var vancouver = {lat: 49.261, lng: -123.123};
    map = new google.maps.Map(document.getElementById('modal-map'), {
      zoom: 14,
      center: vancouver
    });
  }

  function clearForm() {
    $(".modal-form")[0].reset();
  }

  $('#point-modal').on('shown.bs.modal', function() {
    initMap();

    var defaultBounds = new google.maps.LatLngBounds(
    new google.maps.LatLng(49.208824, -123.273213),
    new google.maps.LatLng(49.337625, -122.981046));

    var input = $(".modal-form #location")[0];
    searchBox = new google.maps.places.SearchBox(input, {
      bounds: defaultBounds
    });


    searchBox.addListener("places_changed", function () {
      for (let marker of markers) {
        marker.setMap(null);
      }

      var places = searchBox.getPlaces();

      if (places.length === 0) {
        return;
      }

      var place = places[0];

      if (!place.geometry) {
        console.log("Returned place contains no geometry");
        return;
      }

      var marker = new google.maps.Marker({
        map: map,
        title: place.name,
        position: place.geometry.location
      });

      map.setCenter(marker.getPosition());

      markers.push(marker);

    })
  });

  $("#point-modal").on("hidden.bs.modal", function() {
    clearForm();
  });

  $("#point-modal .submit-point").on("click", function() {
    $(".modal-form").submit();
    $("#point-modal").modal('hide');
  })

  $(".modal-form").on("submit", function(event) {
    event.preventDefault();

    var place = searchBox.getPlaces()[0];

    var formData = $(this).serialize();

    formData += "&lat=" + place.geometry.location.lat();
    formData += "&long=" + place.geometry.location.lng();

    $.ajax({
      url: "/maps/1",
      method: "POST",
      data: formData
    }).then(function () {
      console.log("Inserted!");
    });

    console.log(formData);
  })

});
