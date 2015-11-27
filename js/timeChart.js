
function TimeChart(_parentElement){
    var self = this;

    self.parentElement = _parentElement;

    //load file data and call initialize
    self.init();
}


TimeChart.prototype.init = function() {
    var self = this;


    var margin = {top: 20, right: 20, bottom: 30, left: 50},
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    var parseDate = d3.time.format("%m/%d/%Y").parse;

    var date_sort_asc = function (date1, date2) {
        // This is a comparison function that will result in dates being sorted in
        // ASCENDING order. As you can see, JavaScript's native comparison operators
        // can be used to compare dates. This was news to me.
        if (date1.starttime > date2.starttime) return 1;
        if (date1.starttime < date2.starttime) return -1;
        return 0;
    };

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    var x = d3.time.scale()
        .range([0, width]);

    var y = d3.scale.linear()
        .range([height, 0]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

    var area = d3.svg.area()
        .x(function(d) { return x(d.starttime); })
        .y0(height)
        .y1(function(d) { return y(d.PotCount); });

    var svg = self.parentElement.append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var areaData = {};
    d3.csv("data/PotHole-Data.csv", function(rows) {
        // Create nodes for each unique source and target.
        rows.forEach(function(row) {
            //console.log(row);
            if(row.status == "active") {
                if (!areaData.hasOwnProperty(row.area)) {
                    areaData[row.area] =[];
                }
                var obj =  {starttime:parseDate(row.starttime),
                    PotCount: getRandomInt(10,53)}
                //console.log(row.starttime);
                areaData[row.area].push(obj);
                //console.log(areaData[row.area]);
            }
        });

        console.log(areaData);
        var keys = Object.keys(areaData);
        console.log(keys);
        /*for (i=0;i<keys.length;i++){
         areaData[keys[i]].startTime.sort(date_sort_asc);
         var jmax = areaData[keys[i]].startTime.length;
         //console.log(jmax);
         var Countc = 0;
         for (j=0;j<jmax;j++){
         Countc = Countc + 1;
         areaData[keys[i]].PotCount.push(Countc);
         }

         }*/
        console.log(areaData["A"]);


        var data = areaData["F"];
        data.sort(date_sort_asc);


        //console.log(parseDate(data[2].starttime));
        x.domain(d3.extent(data, function(d) { return d.starttime ; }));
        y.domain([0, d3.max(data, function(d) { return d.PotCount; })]);

        svg.append("path")
            .datum(data)
            .attr("class", "area")
            .attr("d", area);

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("# Potholes");


    });
}