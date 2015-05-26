// ********** Collections  start (lib/colelctions.js)  *****************
  
  /*  Here we are defining the collection used for this application, 
       could easily be moved into 'common code' user lib/  */

  // Defining the movie collection 
  Movies = new Mongo.Collection("Movies");
  Genre = new Mongo.Collection("Genre");

// ********** Collections end   ****************************************


// ********** client Side code start (server.js)  **********************

  if (Meteor.isClient) {
    // set session for sorting tables
    Session.set("sortOption", {searchTitle: -1});

    Template.body.helpers({
      // testing out client side template rendering 
      MovieSortByTitle: function () {
        // Show newest tasks first
        return Movies.find({}, {sort: Session.get("sortOption") });
      },
      // data for populating UI genre selections
      Genre: function(){
        return Genre.find({}, {sort: {genre: 1}});
      }
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
          searchTitle: movieTitle.toUpperCase(),
          createdAt: new Date() 
        });

        // Clear form
        e.target.movietitle.value = "";
        e.target.releaseYear.value = "";

        // Prevent default form submit
        return false;
      },
      // event for sorting movie title
      "click .sortTitle": function(e){   
        // variable to determine which sort option = e.handleObj.selector
          // Show newest tasks first
         if(Session.get("sortOption").searchTitle === -1){
             Session.set("sortOption", {searchTitle: 1});
         }else{
             Session.set("sortOption", {searchTitle: -1});
         }
      }

    });

    Template.movieDetails.events({
      // s
      "click .edit": function(){
        console.log(this._id);
        console.dir(Movies.findOne(this._id));
      },
      // delete event handler 
      "click .delete": function(){
        Movies.remove(this._id);
      }

    })
  }
// ********** client Side code end (server.js)  **********************


// ********** Server Side code start (server.js)  **********************

  if (Meteor.isServer) {
    Meteor.startup(function () {
      // Initially seed the database with Genre data from private/genre.json 
      if(Genre.find().count() === 0) {
        Assets.getText("genre.json", function(err,data){
          JSON.parse(data).forEach(function(item,i,arr){
            Genre.insert(item);
          })
        });
      }
    });
  }

// ********** Server Side code end ************************************


