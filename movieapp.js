// ********** Collections  start (lib/colelctions.js)  *****************
  
  /*  Here we are defining the collection used for this application, 
       could easily be moved into 'common code' user lib/  */

  // Defining the movie collection 
  Movies = new Mongo.Collection("Movies");

// ********** Collections end   ****************************************


// ********** client Side code start (server.js)  **********************

  if (Meteor.isClient) {

    Template.body.helpers({
      // testing out client side template rendering 
      MovieSortByCreateDate: function () {
        // Show newest tasks first
        return Movies.find({}, {sort: {createdAt: -1}});
      },
      MovieSortByAlphabeticalOrd: function(){
        return Movies.find({}, {sort: {movieTitle: 1}});
      },

      genre: [
        {genre: "Horror"},
        {genre: "Stuff"},
        {genre: "otherstuff"},
      ]
    });

    Template.body.events({
      'submit .new-movie': function (event) {
        // This function is called when the new task form is submitted
        var movieTitle = event.target.movietitle.value;
        var releaseYear = event.target.releaseYear.value;
        var genre = event.target.genre.value;

        Movies.insert({
          movieTitle: movieTitle,
          releaseYear: releaseYear,
          genre: genre,
          createdAt: new Date() // current time
        });

        // Clear form
        event.target.movietitle.value = "";
        event.target.releaseYear.value = "";

        // Prevent default form submit
        return false;
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


