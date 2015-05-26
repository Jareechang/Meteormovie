// ********** Collections  start (lib/colelctions.js)  *****************
  
  /*  Here we are defining the collection used for this application, 
       could easily be moved into 'common code' user lib/  */

  // Defining the movie collection 
  Movies = new Mongo.Collection("Movies");

// ********** Collections end   ****************************************


// ********** client Side code start (server.js)  **********************

  if (Meteor.isClient) {
    // set session for sorting tables
    Session.set("DefaultSort", -1);

    Template.body.helpers({
      // testing out client side template rendering 
      MovieSortByCreateDate: function () {
        // Show newest tasks first
        return Movies.find({}, {sort: {createdAt: Session.get("DefaultSort")}});
      },

      genre: [
        {genre: "Horror"},
        {genre: "Stuff"},
        {genre: "otherstuff"},
      ]
    });

    Template.body.events({
      'submit .new-movie': function (e) {
        // prevent default behaviour 
        e.preventDefault();
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
          SearchTitle: movieTitle.toUpperCase(),
          createdAt: new Date() 
        });

        // Clear form
        e.target.movietitle.value = "";
        e.target.releaseYear.value = "";

        // Prevent default form submit
        return false;
      },
      // event for sorting movie title
      "click .sortTitle": function(){    
          // Show newest tasks first
         if(Session.get("DefaultSort") === -1){
            Session.set("DefaultSort", 1);
         }else{
            Session.set("DefaultSort", -1);
         }
          
         console.log(Session.get("DefaultSort"));
      }

    });

    Template.movieDetails.events({
      
      "click .edit": function(){
        console.log(this._id);
        console.dir(Movies.findOne(this._id));

      }

    })
  }
// ********** client Side code end (server.js)  **********************


// ********** Server Side code start (server.js)  **********************

  if (Meteor.isServer) {
    Meteor.startup(function () {
      // code to run on server at startup
    });
  }

// ********** Server Side code end ************************************


