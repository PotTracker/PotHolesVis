function MapMumbai(_parentElement, _eventHandlerArea, _eventHandlerPot){
    var self = this;
    self.parentElement = _parentElement;
    self.loc = [];
    self.marker = 0;
    self.circlelayer = 0;
    self.Gmarker = 0;
    self.isPotHole = false;
    self.eventHandlerArea = _eventHandlerArea;
    self.eventHandlerPot = _eventHandlerPot;
    self.layer = 0;
    self.map = new google.maps.Map(self.parentElement[0], {
        zoom: 11,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        center: new google.maps.LatLng(19.12, 72.9167)//,  Mumbai
        //styles:[{"stylers": [{"saturation": -75},{"lightness": 1}]}]
    });
    self.areaCenter = {};

    self.map.set('styles', [
        {
            "elementType": "geometry",
            "stylers": [
                {
                    "hue": "#ff4400"
                },
                {
                    "saturation": -68
                },
                {
                    "lightness": -4
                },
                {
                    "gamma": 0.72
                }
            ]
        },
        {
            "featureType": "road",
            "elementType": "labels.icon"
        },
        {
            "featureType": "landscape.man_made",
            "elementType": "geometry",
            "stylers": [
                {
                    "hue": "#0077ff"
                },
                {
                    "gamma": 3.1
                }
            ]
        },
        {
            "featureType": "water",
            "stylers": [
                {
                    "hue": "#00ccff"
                },
                {
                    "gamma": 0.44
                },
                {
                    "saturation": -33
                }
            ]
        },
        {
            "featureType": "poi.park",
            "stylers": [
                {
                    "hue": "#44ff00"
                },
                {
                    "saturation": -23
                }
            ]
        },
        {
            "featureType": "water",
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "hue": "#007fff"
                },
                {
                    "gamma": 0.77
                },
                {
                    "saturation": 65
                },
                {
                    "lightness": 99
                }
            ]
        },
        {
            "featureType": "water",
            "elementType": "labels.text.stroke",
            "stylers": [
                {
                    "gamma": 0.11
                },
                {
                    "weight": 5.6
                },
                {
                    "saturation": 99
                },
                {
                    "hue": "#0091ff"
                },
                {
                    "lightness": -86
                }
            ]
        },
        {
            "featureType": "transit.line",
            "elementType": "geometry",
            "stylers": [
                {
                    "lightness": -48
                },
                {
                    "hue": "#ff5e00"
                },
                {
                    "gamma": 1.2
                },
                {
                    "saturation": -23
                }
            ]
        },
        {
            "featureType": "transit",
            "elementType": "labels.text.stroke",
            "stylers": [
                {
                    "saturation": -64
                },
                {
                    "hue": "#ff9100"
                },
                {
                    "lightness": 16
                },
                {
                    "gamma": 0.47
                },
                {
                    "weight": 2.7
                }
            ]
        }
    ]);

    self.areaPotCount  = [];
    self.dataDisplay = {};
    self.allPotCount = 0;
    d3.csv("data/PotHole-Data.csv", function(rows) {
        // Create nodes for each unique source and target.
        rows.forEach(function(row) {
            if(row.status == "active") {
                self.loc.push([parseFloat(row.latitude),parseFloat(row.longitude)]);

                if(!self.areaPotCount.hasOwnProperty(row.area)){
                    self.areaPotCount[row.area] = 1;
                }
                else{
                    self.areaPotCount[row.area]++;
                }
                self.allPotCount++;

                var key = "" + row.latitude+","+row.longitude;

                var address = row.address;
                var areaName = row.area;
                var hits = row.count;

                var d = {data: {address: row.address, area: {name:areaName}},count:row.count};

                var address = d.data.address;
                var areaName = d.data.area.name;
                var hits = d.count;

                if(!self.dataDisplay.hasOwnProperty(key)){
                    self.dataDisplay[key] = d;
                }
            }
        });
    });

    //load file data and call initialize
    self.init();
}


MapMumbai.prototype.MapMarker = function(mapData)
{
    var self = this;



    if(self.Gmarker != 0)
    {
        self.Gmarker.setMap(null);
    }
    var googleCoordinates = new google.maps.LatLng(mapData[0], mapData[1]);
    self.map.setCenter(googleCoordinates);
    self.Gmarker= new google.maps.Marker({
        map: self.map,
        draggable: false,
        animation: google.maps.Animation.BOUNCE,
        position: {lat: mapData[0], lng: mapData[1]}
    });
    self.isPothole = false;



}

MapMumbai.prototype.circle =  function(areaName) {
    var self = this;

    console.log(self.areaCenter);
    console.log("mapdata:",self.areaCenter[areaName]);
    console.log("my-->",self.map.getZoom());

    if(!self.isPothole) {
        var googleCoordinates = new google.maps.LatLng(self.areaCenter[areaName].lng, self.areaCenter[areaName].lat);
        self.map.setCenter(googleCoordinates);
        //self.map.setCenter(new google.maps.LatLng(19.055503, 72.829565));
        self.map.setZoom(14);
        self.layer.remove();

        // Load the station data. When the data comes back, create an overlay.
    }
    else
    {
        if(self.Gmarker != 0)
        {
            self.Gmarker.setMap(null);
        }

        self.Gmarker= new google.maps.Marker({
            map: self.map,
            draggable: false,
            animation: google.maps.Animation.BOUNCE,
            position: {lat: mapData[0], lng: mapData[1]}
        });
        self.isPothole = false;
    }
    var overlay = new google.maps.OverlayView();

    // Add the container when the overlay is added to the map.
    overlay.onAdd = function () {
        self.circlelayer = d3.select(this.getPanes().overlayMouseTarget).append("div")
            .attr("class", "SvgOverlay");

        var data =  self.loc;

        // Draw each marker as a separate SVG element.
        // We could use a single SVG, but what size would it have?
        overlay.draw = function () {
            var projection = this.getProjection(),
                padding = 10;
            if(self.marker != 0)
                self.marker.remove();
            self.marker = self.circlelayer.selectAll("svg").data(data);

            self.marker.each(transform) // update existing markers
                .enter().append("svg:svg")
                .each(transform)
                .attr("class", "marker")

            self.marker.append("svg:circle")
                .attr("r", function(d,i){
                    return "5"

                })
                .attr("cx", function (d, i) {
                    return padding;
                })
                .attr("cy", padding)
                .on("click", function(d,i) {
                    var key = "" + d[0]+","+d[1];
                    self.eventHandlerPot.OnPotSelection(d,self.dataDisplay[key]);
                });


            function transform(d) {
                d = new google.maps.LatLng(d[0], d[1]);
                d = projection.fromLatLngToDivPixel(d);
                return d3.select(this)
                    .style("left", (d.x - padding) + "px")
                    .style("top", (d.y - padding) + "px");
            }
        };
    };

    // Bind our overlay to the map?
    overlay.setMap(self.map);
}

MapMumbai.prototype.init = function() {
    var self = this;
    if(self.layer != 0) {
        self.layer.remove();
    }
    self.isPothole = false;

    var color = d3.scale.ordinal()
        .domain(self.areaPotCount)
        .range(colorbrewer.BuGn[9]);

    console.log(color);


    if(self.circlelayer != 0) {
        self.circlelayer.remove();
        if(self.Gmarker != 0)
            self.Gmarker.setMap(null);
        self.map.setCenter(new google.maps.LatLng(19.12,  72.9167));
        self.map.setZoom(11);
    }
    google.maps.event.addListener(self.map, 'bounds_changed', function() {
        $map.css({ height: '600px', width: '600px' });
        google.maps.event.trigger(self.map, 'resize');
        self.map.setCenter(new google.maps.LatLng(19.12,  72.9167));
        google.maps.event.clearListeners(self.map, 'bounds_changed');
    });

    var geoJson;
    $.getJSON("data/province.json", function(json) {
        geoJson = json;

        geoJson.features.map(function(d){
            if(d.properties.Center.length != 0) {
                if (!self.areaCenter.hasOwnProperty(d.properties.VARNAME_3)) {
                    self.areaCenter[d.properties.VARNAME_3] = {
                        lat: d.properties.Center[0],
                        lng: d.properties.Center[1]
                    };
                }
            }
        });

        var overlay = new google.maps.OverlayView();
        overlay.onAdd = function () {

            self.layer = d3.select(this.getPanes().overlayMouseTarget).append("div").attr("class", "SvgOverlay");
            var svg = self.layer.append("svg")
                .attr("width", $map.width())
                .attr("height", $map.height());

            self.adminDivisions = svg.append("g").attr("class", "AdminDivisions");

            overlay.draw = function () {
                var markerOverlay = this;
                var overlayProjection = markerOverlay.getProjection();

                // Turn the overlay projection into a d3 projection
                googleMapProjection = function (coordinates) {
                    var googleCoordinates = new google.maps.LatLng(coordinates[1], coordinates[0]);
                    var pixelCoordinates = overlayProjection.fromLatLngToDivPixel(googleCoordinates);
                    return [pixelCoordinates.x, pixelCoordinates.y];
                }

                path = d3.geo.path().projection(googleMapProjection);
                self.adminDivisions.selectAll("path")
                    .data(geoJson.features)
                    .attr("d", path) // update existing paths
                    .attr("class", "myPathClass")
                    .enter().append("svg:path")
                    .attr("d", path)
                    .style("fill",function(d,i){
                        console.log(d.properties.VARNAME_3);
                        console.log(self.areaPotCount[d.properties.VARNAME_3]/self.allPotCount);
                        console.log(color(self.areaPotCount[d.properties.VARNAME_3]));
                        return color(self.areaPotCount[d.properties.VARNAME_3]);

                    })
                    .on("click", function(d,i) {
                        console.log(d.properties.VARNAME_3);
                        self.eventHandlerArea.OnAreaSelection(d.properties.VARNAME_3);
                        self.circle(d.properties.VARNAME_3)
                    });
            };

        };

        overlay.setMap(self.map);

    });
}
