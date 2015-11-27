
function TilfordTree(_parentElement){
    var self = this;

    self.parentElement = _parentElement;

    self.diameter = 600
    self.svg = self.parentElement.append("svg").attr("width", self.diameter+400)
        .attr("height", self.diameter+300)
        .append("g")
        .attr("transform", "translate(" + self.diameter / 2 + "," + self.diameter / 2 + ")");

    self.generateJSON();
    //load file data and call initialize

    //hard coded angles
    self.angles = {};

    //hardcoded angle values
    self.angles["C"] = 155;
    self.angles["Andheri"] = 110;
    self.angles["H"] = 65;
    self.angles["Bandra"] = 20;
    self.angles["Andheri East"] = -20;
    self.angles["A"] = -65;
    self.angles["G"] = -110;
    self.angles["F"] = -155;
}

TilfordTree.prototype.generateJSON =  function(){
    var self = this;

    self.city ={
        "name" : "mumbai",
        "children":[]
    };

    d3.csv("data/PotHole-Data.csv", function(links) {

        var nodesByName = {};
        var parent,
            child = {name:"",
                count: ""};


        //var angCounter = 0;

        // Create nodes for each unique source and target.
        links.forEach(function(link) {

            //this function will prepare the angles
            //todo need to define angle logic over here
            /*if (!self.angles.hasOwnProperty(link.area)){
             self.angles[link.area] = {
             area: link.area,
             angle: (angCounter * 45 + 20) // using hardcoded values for now on
             }
             console.log(self.angles);
             angCounter++;
             }*/

            parent = link.area = nodeByName(link.area);
            child = link.address = nodeByName(link.address);
            child.count = link.count;

            if (parent.children){
                parent.children.push(child);
            }
            else {
                self.city.children.push(parent);
                parent.children = [child];
            }
        });

        console.log("hi");
        console.log(self.angles);

        // Extract the root node.
        var root = links[0].area;
        self.init("");

        function nodeByName(name) {
            return nodesByName[name] || (nodesByName[name] = {name: name});
        }
    });


}

TilfordTree.prototype.init = function(parentName) {

    var self = this;

    var svg = self.svg;
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
            return "<strong> " + d.name + "</strong>";
        });


    svg.call(tip);

    var  i = -16;
    var nodes = self.tree.nodes(self.city);
    /*nodes.map(function(d) {
     //console.log(d);
     if (d.depth == 2 && d.parent.name == parentName) {
     d.y = d.count % 300 + 300;
     d.x = d.x + i;
     i = i + 3;
     }
     });*/

    links = self.tree.links(nodes);

    var link = svg.selectAll(".link")
        .data(links)
        .enter().append("path")
        .attr("class", "link")
        .attr("d", self.diagonal);

    var node = svg.selectAll(".node")
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
                return d.count/1000;
            }
        })
        .on("click",function(d){

            var angle = self.angles[d.name];
            var parentName = d.name;

            if(d.depth == 1) {
                var  i = -16;
                var tnodes = self.tree.nodes(self.city);
                tnodes.map(function(d) {
                    if (d.depth == 2 && d.parent.name == parentName) {
                        d.y = d.count % 300 + 300;
                        d.x = d.x + i;
                        i = i + 3;
                    }
                });

                var tlinks = self.tree.links(tnodes);

                var tlink = svg.selectAll(".link")
                    .data(tlinks);/*
                 .enter().append("path")
                 .attr("class", "link")
                 .attr("d", diagonal);*/

                var tnode = svg.selectAll(".node")
                    .data(tnodes);

                    /*
                 .enter().append("g")
                 .attr("class", "node");*/

                //console.log(tnode);

                tnode.transition()
                    .duration(3000)
                    .attr("transform", function (d) {
                            return "rotate(" + (d.x - (90 - angle)) + ")translate(" + d.y + ")";
                    });

                tlink.transition()
                    .duration(3000)
                    .attr("transform", function (d) {
                        return "rotate(" + angle + ")translate(" + 0 + ")";
                    });

                //tnode.attr("transform", function(d) { return "rotate(" + (d.x - 90) + ")translate(" + d.y + ")"; });

                //self.init(parentName);
            }
        })
        //setting up the tips
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide);

    node.append("text")
        .attr("dy", ".31em")
        .attr("text-anchor", function(d) { return d.x < 180 ? "start" : "end"; })
        .attr("transform", function(d) { return d.x < 180 ? "translate(8)" : "rotate(180)translate(-8)"; })
        .text(function(d) { if(d.depth != 2){
            return d.name;
        }});
}

TilfordTree.prototype.callFromExt = function(parentName){
    var self = this;
    var  i = -16;
    var tnodes = self.tree.nodes(self.city);
    tnodes.map(function(d) {
        if (d.depth == 2 && d.parent.name == parentName) {
            d.y = d.count % 300 + 300;
            d.x = d.x + i;
            i = i + 3;
        }
    });

    var tlinks = self.tree.links(tnodes);

    var tlink = self.svg.selectAll(".link")
        .data(tlinks);/*
     .enter().append("path")
     .attr("class", "link")
     .attr("d", diagonal);*/

    var tnode = self.svg.selectAll(".node")
        .data(tnodes);

    /*
     .enter().append("g")
     .attr("class", "node");*/

    //console.log(tnode);

    tnode.transition()
        .duration(3000)
        .attr("transform", function (d) {
            return "rotate(" + (d.x - (90 - self.angles[parentName])) + ")translate(" + d.y + ")";
        });

    tlink.transition()
        .duration(3000)
        .attr("transform", function (d) {
            return "rotate(" + self.angles[parentName] + ")translate(" + 0 + ")";
        });
}