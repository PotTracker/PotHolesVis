/**
 * Created by sunny on 12/2/2015.
 */
function MobileDataConverter(latitude,longitude,counter){
    var jsonData;
    var newData = [];
    var logdata = "" +  counter + ";" + latitude + ";" + longitude + ";";

    var pyrmont = {lat: latitude, lng: longitude};

    var map = new google.maps.Map(document.getElementById('map'));
    var service = new google.maps.places.PlacesService(map);
    service.nearbySearch({
        location: pyrmont,
        radius: 100,
        types: ['hospital']
    }, callback);

    function callback(results, status) {
       //console.log(status);
        //console.log(results);
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            //for (var i = 0; i < results.length; i++) {
            logdata = logdata + "H;" + " ";
            //}
        }
        else{
            logdata = logdata + " ;" + " ";
        }


    var geocoder = new google.maps.Geocoder;
    geocoder.geocode({'location': pyrmont}, function(results, status) {
        if (status === google.maps.GeocoderStatus.OK) {
            if (results[1]) {
                logdata  = logdata + results[1].formatted_address + ";";
                //console.log(results[1].formatted_address);
            } else {
                logdata  = logdata + " " + "; ";
                console.log('No results found');
            }
        } else {
            logdata  = logdata + " " + "; ";
            console.log('Geocoder failed due to: ' + status);
        }
    });

    $.getJSON("data/province.json", function(json) {
        for(var i = 0 ; i < json.features.length ; i++ ) {

            var areaNo = i;
            var area = json.features[areaNo].properties.VARNAME_3;
            var lat = json.features[areaNo].geometry.coordinates[0][0];
            var latLngArr = [];
            for (var c = 0; c < lat.length; c++) {
                latLngArr.push({lat: lat[c][0], lng: lat[c][1]});
            }
            var triangle = new google.maps.Polygon({paths: latLngArr});
            var result = google.maps.geometry.poly.containsLocation(new google.maps.LatLng(longitude,latitude), triangle);
            if(result == true){
                logdata  = logdata + area + ";";
                console.log(logdata);
            }
        }
    });

    }
}