$(function(){
     
   var guestCookieID = document.cookie.replace('meteorGuestMovieApp=','');

    // fetches user data from collection by GUEST ID then get the genrecounter attribute
    var userData = UserAnalytics.find({guestID: guestCookieID}).fetch();

    $('#add-movie').on('click', function(){
        userData =  UserAnalytics.find({guestID: guestCookieID}).fetch();
        filterData = _.filter(userData,function(item){
            return item.count > 0
        })
    })
    if(userData){
        userData = userData[0].genrecounter;
        // Filter results for items only have count greater than zero
        var filterData = _.filter(userData,function(item){
            return item.count > 0
        })

        var height = 350;
        var width = 350;
        var chart1;
        nv.addGraph(function() {
            var chart1 = nv.models.pieChart()
                .x(function(d) { 
                    return d.genre 
                })
                .y(function(d) { return d.count })
                .donut(true)
                .width(width)
                .height(height)
                .padAngle(.08)
                .cornerRadius(5)
                .id('donut1'); // allow custom CSS for this one svg
            chart1.title("100%");
            chart1.pie.donutLabelsOutside(true).donut(true).labelType("percent") ;
            d3.select("#test1")
                .datum(filterData)
                .transition().duration(1200)
                .call(chart1);
            //nv.utils.windowResize(chart1.update);
            return chart1;
        });
    }
  
})
  