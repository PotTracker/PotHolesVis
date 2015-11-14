
function CountChart(_parentElement){
    var self = this;

    self.parentElement = _parentElement;

    //load file data and call initialize
    self.init();
}


CountChart.prototype.init = function() {
    var self = this;
    var barData = {};

    d3.csv("data/PotHole-Data.csv", function(rows) {

        console.log(rows);
        // Create nodes for each unique source and target.
        rows.forEach(function(row) {

            if(row.status == "active") {
                if (!barData.hasOwnProperty(row.area)) {
                    barData[row.area] = {
                        potholeHitCount:[]
                    }
                }
                barData[row.area].potholeHitCount.push(row.count);
            }
        });

        for(key in barData){
            barData[key].potholeHitCount.sort(function(a, b){return b-a});
        }
        console.log(barData);

        self.printElementsBar(barData["Bandra"].potholeHitCount.slice(0,10));
        // Sort the bar data
        //
    });
}

/**
 * This function will print the bar chart required for the
 * data operations.
 * Reference: http://dataviscourse.net/2015/lectures/lecture-advanced-d3/
 * @param data
 */
CountChart.prototype.printElementsBar = function(data){
    var self = this;

    var x = d3.scale.linear()
        .domain([0, d3.max(data)])
        .range([0, 420]);

    var y = d3.scale.ordinal()
        .domain(data)
        .rangeBands([0, 200]);

    var chart = d3.select("body").append("svg")
        .attr("class", "chart")
        .attr("width", 420)
        .attr("height", 20 * data.length);

    chart.selectAll("rect")
        .data(data)
        .enter().append("rect")
        .attr("y", y)
        .attr("width", x)
        .attr("height", y.rangeBand());

    chart.selectAll("text")
        .data(data)
        .enter().append("text")
        .attr("x", x)
        .attr("y", function(d) { return y(d) + y.rangeBand() / 2; })
        .attr("dx", -3) // padding-right
        .attr("dy", ".35em") // vertical-align: middle
        .attr("text-anchor", "end") // text-align: right
        .text(String);

}

