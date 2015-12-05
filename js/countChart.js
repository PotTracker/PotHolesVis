
function CountChart(_parentElement){
    var self = this;

    self.parentElement = _parentElement;
    var parseDate = d3.time.format("%m/%d/%Y").parse;
    self.activePotholes = [];
    var start = new Date("Sep 8, 2013 00:00:00");
    var end = new Date("Dec 13, 2015 00:00:00");
    var area = ["Andheri East", "Andheri", "Bombay city", "Borivali",  "Gorai", "Mira Bhayandar", "Thane", "Uttan", "Vikhroli"];
    for(var i = 0; i < 9; i++)
    {
        self.activePotholes[area[i]] = [];
    }
    var noofdates = 0;
    var noofrows = 0;
    d3.csv("data/PotHole-Data.csv", function(rows) {
        while (start <= end) {
            noofdates++;
            for(var i = 0; i < 9; i++)
            {
                self.activePotholes[area[i]].push([Date.parse(start), 0]);
            }
            rows.forEach(function (row) {
                if( start >=parseDate(row.starttime) ){
                    noofrows++;
                    if(row.endtime.length){
                        if( start < parseDate(row.endtime)) {
                            (self.activePotholes[row.area][self.activePotholes[row.area].length - 1][1])++;
                        }
                    }
                    else {
                        (self.activePotholes[row.area][self.activePotholes[row.area].length - 1][1])++;
                    }
                }
            })
            start.setDate(start.getDate() + 1);
        }
        console.log("came out:",noofdates, ",", noofrows);
        // var n = Date.parse(parseDate(end));
        // console.log(n)
        console.log("yogesh",self.activePotholes);
        console.log(d3.entries(self.activePotholes));
        var modifiedactivePotholes = [];
        var count =0;
        for (var k in self.activePotholes) {
            console.log(k);
            var newFeature = {
                "key": k,
                "values": self.activePotholes[k],
                "seriesIndex": count++
            };
            modifiedactivePotholes.push(newFeature);
        }
        self.activePotholes = modifiedactivePotholes;
        console.log(self.activePotholes);
        //load file data and call initialize
        self.initnvD3stackAreaChart();
    });
}


CountChart.prototype.initnvD3stackAreaChart = function() {
    var self = this;
    nv.addGraph(function() {
        var chart = nv.models.stackedAreaChart()
                .x(function(d) { return d[0] })
                .y(function(d) { return d[1] })
                .clipEdge(true)
                .showControls(false)
                .useInteractiveGuideline(true)
            ;

        chart.xAxis
            .showMaxMin(false)
            .tickFormat(function(d) { return d3.time.format('%x')(new Date(d)) });

        chart.yAxis
            .tickFormat(d3.format(',.2f'));
        // chart.xDomain([1043989200000, 1217476800000]);
        d3.select('#count-chart svg')
            .datum(self.activePotholes)
            .transition().duration(500).call(chart);

        nv.utils.windowResize(chart.update);

        return chart;
    });
}

/**
 * This function will print the bar chart required for the
 * data operations.
 * Reference: http://dataviscourse.net/2015/lectures/lecture-advanced-d3/
 * @param data
 */
