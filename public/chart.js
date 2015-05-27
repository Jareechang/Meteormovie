$(function(){
     
    // genreCollection.insert({
    //   count: 
    // })

    var testdata = [
        {key: "One", y: 20},
        {key: "Two", y: 20},
        {key: "Three", y: 20},
        {key: "Four", y: 20},
        {key: "Five", y: 5},
        {key: "Six", y: 5},
        {key: "Seven", y: 10}
    ];

    var height = 350;
    var width = 350;
    var chart1;
    nv.addGraph(function() {
        var chart1 = nv.models.pieChart()
            .x(function(d) { return d.key })
            .y(function(d) { return d.y })
            .donut(true)
            .width(width)
            .height(height)
            .padAngle(.08)
            .cornerRadius(5)
            .id('donut1'); // allow custom CSS for this one svg
        chart1.title("100%");
        chart1.pie.donutLabelsOutside(true).donut(true);
        d3.select("#test1")
            .datum(testdata)
            .transition().duration(1200)
            .call(chart1);
        //nv.utils.windowResize(chart1.update);
        return chart1;
    });
})
  