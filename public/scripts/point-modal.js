$(() => {
  function initMap() {
    var vancouver = {lat: 49.261, lng: -123.123};
    var map = new google.maps.Map(document.getElementById('modal-map'), {
      zoom: 12,
      center: vancouver
    });
    var marker = new google.maps.Marker({
      position: vancouver,
      map: map
    });
  }







  $('#new-point-modal').on('shown.bs.modal', function() {
    initMap();

    var defaultBounds = new google.maps.LatLngBounds(
    new google.maps.LatLng(49.208824, -123.273213),
    new google.maps.LatLng(49.337625, -122.981046));

    var input = $(".modal-form #location")[0];
    var searchBox = new google.maps.places.SearchBox(input, {
      bounds: defaultBounds
    });
  });
});
