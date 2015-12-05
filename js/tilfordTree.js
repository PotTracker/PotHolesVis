
function TilfordTree(_parentElement, _areaEventHandler, _potEventHandler,_cityEventHandler){
    var self = this;

    self.parentElement = _parentElement;
    self.areaEventHandler = _areaEventHandler;
    self.potEventHandler = _potEventHandler;
    self.cityEventHandler = _cityEventHandler;

    self.diameter = 550;
    self.svg = self.parentElement.append("svg").attr("width", self.diameter+400)
        .attr("height", self.diameter+300)
        .append("g")
        .attr("transform", "translate(" + 230  + "," + 230 + ")");

    self.generateJSON();
    //load file data and call initialize

    //hard coded angles
    self.angles = {};

    //hardcoded angle values
    self.angles["Borivali"] = 45;
    self.angles["Bombay city"] = -10;
    self.angles["Andheri"] = 130;
    self.angles["Vikhroli"] = 180;
    self.angles["Thane"] = 80;
    self.angles["Andheri East"] = -90;
    self.angles["Mira Bhayandar"] = 95;
    self.angles["Gorai"] = 70;
}

TilfordTree.prototype.generateJSON =  function(){
    var self = this;

    self.city ={
        "name" : "mumbai",
        "children":[]
    };

    d3.csv("data/PotHole-Data.csv", function(links) {

        console.log("hit");
        var nodesByName = {};
        var parent,
            child = {name:"",
                count: ""};

        // Create nodes for each unique source and target.
        links.forEach(function(link) {
            if(link.status === "active") {
                parent = link.area = nodeByName(link.area);
                parent.data = link;
                child = link.id = nodeByName(link.id);
                child.count = link.count;
                child.hospital = link.hospital;
                child.school = link.school;
                child.data = link;

                if (parent.children) {
                    parent.children.push(child);
                }
                else {
                    self.city.children.push(parent);
                    parent.children = [child];
                }
            }
        });

        console.log(self.city);

        //check whether the data has any lattitude and longitude near by hospital
        self.addHospitalInformation();

        // Extract the root node.
        var root = links[0].area;
        self.init("");

        function nodeByName(name) {
            return nodesByName[name] || (nodesByName[name] = {name: name});
        }
    });
}

TilfordTree.prototype.addHospitalInformation = function() {
    var self = this;
    /*
    console.log(self.city.children);
    for(var i = 0 ; i < self.city.children.length ; i++)
    {
        for(j = 0 ; self.city.children[i].children.length ; j++)
        {
            console.log(self.city.children[i].children[j]);
        }
    }

    var service = new google.maps.places.PlacesService(map);
    service.nearbySearch({
        location: pyrmont,
        radius: 100,
        types: ['hospital']
    }, callback);

    function callback(results, status) {
        console.log(status);
        console.log(results);
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            for (var i = 0; i < results.length; i++) {
                console.log(results[i]);
            }
        }
    }
    */
}
TilfordTree.prototype.init = function(parentName) {

    var self = this;

    var diameter = self.diameter;

    self.tree = d3.layout.tree()
        .size([360, diameter / 2 - 120])
        .separation(function(a, b) { return (a.parent == b.parent ? 1 : 2) / a.depth; });

    self.diagonal = d3.svg.diagonal.radial()
        .projection(function(d) { return [d.y, d.x / 180 * Math.PI]; });

    var tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function(d) {
            if(d.depth == 2) {
                return "<strong> " + d.count + "</strong>";
            }
            else{
                return "<strong> " + d.name + "</strong>";
            }
        });


    self.svg.call(tip);

    var  i = -16;
    var nodes = self.tree.nodes(self.city);
    links = self.tree.links(nodes);

    var link = self.svg.selectAll(".link")
        .data(links)
        .enter().append("path")
        .attr("class", "link")
        .attr("d", self.diagonal);

    var node = self.svg.selectAll(".node")
        .data(nodes)
        .enter().append("g")
        .attr("class", "node")
        .attr("transform", function(d) { return "rotate(" + (d.x - 90) + ")translate(" + d.y + ")"; })


    node.append("circle")
        .attr("r", function(d){
            if(d.depth == 0){
                return 10;
            }
            if(d.depth == 1){
                return 7;
            }
            if(d.depth == 2 ){
                return d.count/1000  < 2 ? 3 : d.count/1000;
            }
        })
        .on("click",function(d){

            var angle = self.angles[d.name];
            var parentName = d.name;

            if(d.depth == 0) {
                self.cityEventHandler.OnCitySelection();
            }

            //call external event as per the strcuture needed by map
            if(d.depth == 1) {
                var arr = [];
               /* console.log(d.data);
                arr[1] = parseFloat(d.data.latitude);
                arr[0] = parseFloat(d.data.longitude);
                var mapData = {properties: {Center: arr}};*/
                self.areaEventHandler.OnAreaSelection(d.name);
            }

            if(d.depth == 2) {

                console.log(d.data.area.name);
                self.areaEventHandler.OnAreaSelection(d.data.area.name);

                var arr = [];
                 arr[0] = parseFloat(d.data.latitude);
                 arr[1] = parseFloat(d.data.longitude);

                var mapData = {properties: {Center: arr}};
                self.potEventHandler.OnPotSelection(arr,d);

            }

            /*if(d.depth == 1) {
                var  i = -16;
                var tnodes = self.tree.nodes(self.city);

                tnodes.map(function(d) {
                    if (d.depth == 2 && d.parent.name == parentName) {
                        d.y = 225 ;
                        d.x = d.x + i;
                        i = i + 3;
                    }
                });



                var tlinks = self.tree.links(tnodes);

                var tlink = self.svg.selectAll(".link")
                    .data(tlinks);

                var tnode = self.svg.selectAll(".node")
                    .data(tnodes);

                tnode.select("text")
                    .attr("dy", ".31em")
                    .attr("style",function(d) {
                        if(d.depth == 2 && d.parent.name == parentName) {
                            return 'display:visible;';
                        }
                        else if(d.depth == 2){
                            return 'display:none;';
                        }
                    });

                tnode.transition()
                    .duration(3000)
                    .attr("transform", function (d) {
                        if(d.name != "mumbai") {
                            return "rotate(" + (d.x - (90 - angle)) + ")translate(" + d.y + ")";
                        }
                    });

                tlink.transition()
                    .duration(3000)
                    .attr("transform", function (d) {
                        return "rotate(" + angle + ")translate(" + 0 + ")";
                    });

                //
                self.generateJSON();
            }*/
        })
        .style("fill",function(d){
            console.log(d.hospital);
                if(d.hospital == 1){
                    return "red";
                }
                else if(d.school == 1){
                    return "green";
                }
                else{
                   return "lightgrey";
                }
            })
        .style("stroke","black")
        //setting up the tips
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide);

    node.append("text")
        .attr("dy", ".31em")
        .attr("text-anchor", function(d) { return d.x < 180 ? "start" : "end"; })
        .attr("transform", function(d) {
            if(d.depth == 1){
                return d.x < 180 ? "translate(8)" : "rotate(180)translate(-8)";
            }
            else if(d.depth == 2) {
                return d.x < 180 ? "translate(10)" : "translate(60)";
            }
        })
        .attr("style",function(d) {
            if(d.depth == 2){
                return 'display:none;';
            }
        })
        .text(function(d) {
            if(d.depth == 1){
                return d.name;
            }
            else if(d.depth == 2){
                return d.data.starttime;
            }
        });
}

TilfordTree.prototype.callAreaFromExt = function(parentName) {
    var self = this;
    var angle = self.angles[parentName];
    var d = {depth: 1};


    if (d.depth == 1) {
        var i = -16;
        var tnodes = self.tree.nodes(self.city);

        tnodes.map(function (d) {
            if (d.depth == 2 && d.parent.name == parentName) {
                d.y = 225;
                d.x = d.x + i;
                i = i + 3;
            }
        });


        var tlinks = self.tree.links(tnodes);

        var tlink = self.svg.selectAll(".link")
            .data(tlinks);

        var tnode = self.svg.selectAll(".node")
            .data(tnodes);

        tnode.select("text")
            .attr("dy", ".31em")
            .attr("style", function (d) {
                if (d.depth == 2 && d.parent.name == parentName) {
                    return 'display:visible;';
                }
                else if (d.depth == 2) {
                    return 'display:none;';
                }
            });

        tnode.transition()
            .duration(3000)
            .attr("transform", function (d) {
                if (d.name != "mumbai") {
                    return "rotate(" + (d.x - (90 - angle)) + ")translate(" + d.y + ")";
                }
            });

        tlink.transition()
            .duration(3000)
            .attr("transform", function (d) {
                return "rotate(" + angle + ")translate(" + 0 + ")";
            });

        self.generateJSON();
    }
}