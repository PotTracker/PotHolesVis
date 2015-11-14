
function TilfordTree(_parentElement){
    var self = this;

    self.parentElement = _parentElement;

    self.generateJSON();
    //load file data and call initialize

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
        // Create nodes for each unique source and target.
        links.forEach(function(link) {

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


        // Extract the root node.
        var root = links[0].area;
        self.init();
        function nodeByName(name) {
            return nodesByName[name] || (nodesByName[name] = {name: name});
        }

    });




}

TilfordTree.prototype.init = function() {
    var self = this;
    var diameter = 900;

    var tree = d3.layout.tree()
        .size([360, diameter / 2 - 120])
        .separation(function(a, b) { return (a.parent == b.parent ? 1 : 2) / a.depth; });

    var diagonal = d3.svg.diagonal.radial()
        .projection(function(d) { return [d.y, d.x / 180 * Math.PI]; });

    var svg = self.parentElement.append("svg")
        .attr("width", diameter)
        .attr("height", diameter - 150)
        .append("g")
        .attr("transform", "translate(" + diameter / 2 + "," + diameter / 2 + ")");

    var tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function(d) {
            return "<strong> " + d.name + "</strong>";
        });

    svg.call(tip);
        //var root = JSON.parse( d3.values(self.city) );



        var nodes = tree.nodes(self.city),
            links = tree.links(nodes);

        var link = svg.selectAll(".link")
            .data(links)
            .enter().append("path")
            .attr("class", "link")
            .attr("d", diagonal);

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
                if(d.depth == 2){
                    return d.count/1000;
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

    d3.select(self.frameElement).style("height", diameter - 150 + "px");

}