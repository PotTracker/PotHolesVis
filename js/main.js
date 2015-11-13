(function () {

    function init(){

            var mapMumbai   = new MapMumbai(d3.select("#map-mumbai"));
            var tilfordTree = new TilfordTree(d3.select("#tilford-tree"));
            var countChart  = new CountChart(d3.select("#count-chart"));
            var timeChart   = new TimeChart(d3.select("#time-chart"));
    }

    //this will call the init function
    init();
})();