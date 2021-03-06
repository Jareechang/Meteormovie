// ********************* Client helper methods start   *********************************************

  // Helper function to set Cookie
  var setCookie = function (c_name,value,exdays){
      var exdate=new Date();
      exdate.setDate(exdate.getDate() + exdays);
      var c_value=escape(value) + 
        ((exdays==null) ? "" : ("; expires="+exdate.toUTCString()));
      document.cookie=c_name + "=" + c_value;
  }

  // Helper function to get cookie 
  var getCookie = function(c_name){
       var i,x,y,ARRcookies=document.cookie.split(";");
      for (i=0;i<ARRcookies.length;i++){
        x=ARRcookies[i].substr(0,ARRcookies[i].indexOf("="));
        y=ARRcookies[i].substr(ARRcookies[i].indexOf("=")+1);
        x=x.replace(/^\s+|\s+$/g,"");

        if (x==c_name){
         return unescape(y);
        }
      }
  }

  // Helper method for generating the analytics counter * adding a count key to the intial data set
  var defaultGenreCount = function(){
    var baseData = Genre.find().fetch()
    _.each(baseData, function(name){
      name.count = 0;
    })
    return baseData;
  }

// ********************* Client helper methods end  *******************************************

// ********** client Side code start (client/client.js)  ***************************************

  if (Meteor.isClient) {

    Meteor.startup(function () {
      // set session for sorting tables
      Session.set("sortOption", {searchTitle: -1});
      Session.set('editHidden?', true);

      /* 
        Here we are using cookies to persist Guest's data based on the random id assigned to their cookie. 
        If it exists, we assign a new ID for a duration of 120 days 
      */
      if(!getCookie('meteorGuestMovieApp')){
        // Give guest user a new cookie
        setCookie('meteorGuestMovieApp', Random.id(), 120);
      }
      
    });

    Template.body.rendered = function(){
      Session.set('userData', UserAnalytics.find({guestID: getCookie('meteorGuestMovieApp') }).fetch());

    // fetches user data from collection by GUEST ID then get the genrecounter attribute
    setTimeout(function(){
      var userData = Session.get('userData');

      // Filter results for items only have count greater than zero

       var userData = _.filter(Session.get('userData')[0].genrecounter,function(item){
            return item.count > 0
        })

        var height = 350;
        var width = 350;


        var chart = nv.models.pieChart()
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

        nv.addGraph(function() {
            chart.title("100%");
            chart.pie.donutLabelsOutside(true).donut(true).labelType("percent") ;
            d3.select("#chart")
                .datum(userData)
                .transition().duration(1200)
                .call(chart);
            //nv.utils.windowResize(chart1.update);
            return chart;
        });

      
    
      Tracker.autorun(function () {
        
          var newData =  _.filter(Session.get('userData')[0].genrecounter,function(item){
              return item.count > 0
          })
          if(newData && newData.length > 0){
              d3.select('#chart').datum(newData).call(chart);
              chart.update();
          }
          
      });


    },10000)
    
    }
    Template.body.helpers({
    
      // Get all the movies from collection
      MovieSortByTitle: function () {
        return Movies.find({ createdBy: getCookie('meteorGuestMovieApp') }, {sort: Session.get("sortOption") });
      },
      // Data for populating UI genre selections
      Genre: function(){
        return Genre.find({}, {sort: {genre: 1}});
      },
      // Get the current Movie details being clicked
      editMovie: function(){
        return Movies.findOne({createdBy: getCookie('meteorGuestMovieApp'), 
                               _id: Session.get('editMovieID', this._id)});
      }

    });

    Template.body.events({
      'submit .new-movie': function (e) {
        // prevent default behaviour 
        e.preventDefault();
        
        /* 
          Here we are initially creating a collection for the guest users based on the ID assigned to them
          Additionally, we add a document for managing their analytics
        */

        // If they are a new guest, create a new document to manage their data
        if(UserAnalytics.find({guestID: getCookie('meteorGuestMovieApp')} ).count() === 0 ){

          UserAnalytics.insert({
              guestID: getCookie('meteorGuestMovieApp'),
              // Using helper to create the base counter set 
              genrecounter: defaultGenreCount(Genre.find().fetch())
          })
          
        } 
       
        // Gets the values from the form on submit
        var movieTitle = e.target.movietitle.value;
        var releaseYear = e.target.releaseYear.value;
        var genre = e.target.genre.value;

        // Movies collection insertion 
        Movies.insert({
          movieTitle: movieTitle,
          releaseYear: releaseYear,
          genre: genre,
          // implementing a normalized searchtitle (all-CAPS) in the document to 
          // off-set case-sensitve sorting  
          searchTitle: movieTitle.toLowerCase(),
          createdBy: getCookie('meteorGuestMovieApp'),
          createdAt: new Date() 
        });

        // Find the guest User data document ** to get its document ID 
        var guestDataID = UserAnalytics.findOne({guestID: getCookie('meteorGuestMovieApp')})._id;
        var guestCookieID = getCookie('meteorGuestMovieApp');

        Meteor.call('UserAnalyticsUpdate', guestDataID, genre, guestCookieID, function(err, res){
            if(err){
              console.log(err);
            }else{
              // Updating chart when Guest adds new movie
              var updateData = Session.get('userData');
              var updateField = _.find(updateData[0].genrecounter, function(analytics){
                  return analytics.genre === genre
              })
              updateField.count += 1; 
              Session.set('userData', updateData);
            }
        });
        
        // Clear form
        e.target.movietitle.value = "";
        e.target.releaseYear.value = "";

        // Prevent default form submit
        return false;
      },
      // event for sorting movie title

      "click .sortTitle, click .sortYear": function(e){  
      
        // Show newest tasks first
        switch(e.handleObj.selector){
            case '.sortTitle':
              if(Session.get("sortOption").searchTitle === -1){
                  Session.set("sortOption", {searchTitle: 1});
              }else{
                  Session.set("sortOption", {searchTitle: -1});
              }
              break;
            case '.sortYear':
              if(Session.get("sortOption").releaseYear === -1){
                  Session.set("sortOption", {releaseYear: 1});
              }else{
                  Session.set("sortOption", {releaseYear: -1});
              }
              break;
        }
      },

      // Update event handler to update data in the selected document
      "click .update": function(e,template){
        var editMovieTitle = template.find('input[name=edtMovieTitle]').value;
        var editReleaseYear = template.find('input[name=edtReleaseYear]').value;
        var editGenre = template.find('select[name=edtGenre]').value;
        
        // Update the document with the edited details
        Movies.update({ _id: Session.get('editMovieID')}, 
                      {
                        movieTitle: editMovieTitle,
                        releaseYear: editReleaseYear,
                        Genre: editGenre 
                      });
        // Reset the Movie ID to clear inputs
        Session.set('editMovieID', null);
        
        // upon updating hide edit section and reset edit hidden session variables
        $('.edit-section').toggleClass('hide');
        Session.set('editHidden?', true);
      },

      "click .cancel": function(){
        // Hide the edit section
        $('.edit-section').toggleClass('hide');
        Session.set('editHidden?', true);
      }

    });

    Template.movieDetails.events({
      // Edit event handler to assign ID to session
      "click .edit": function(){
        // Set session for storing the id on document clicked
        Session.set('editMovieID', this._id);
        // Only execute when edit section is hidden
        if(Session.get('editHidden?')){
          $('.edit-section').toggleClass('hide');
          Session.set('editHidden?', false);
        }
        // Scroll back up to the top
        $("html, body").animate({
           scrollTop: $('.edit-section').offset().top
        },"slow");

      },
      // Delete event handler 
      "click .delete": function(){
          var thisRef = this; 
          Movies.remove(thisRef._id);

          // Updating Chart when Guest deletes movies
          var deleteData = Session.get('userData');
          var deleteField = _.find(deleteData[0].genrecounter, function(analytics){
              return analytics.genre === thisRef.genre
          })

          deleteField.count -= 1; 
          Session.set('userData', deleteData);
          
      }

    })
  }
// ********** client Side code end (client.js)  **********************
