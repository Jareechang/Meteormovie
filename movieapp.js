
// ********** client Side code start (client/client.js)  **********************

  if (Meteor.isClient) {

    // set session for sorting tables
    Session.set("sortOption", {searchTitle: -1});
    Session.set('editHidden?', true);

    Template.body.helpers({
    
      // Get all the movies from collection
      MovieSortByTitle: function () {
        return Movies.find({}, {sort: Session.get("sortOption") });
      },
      // Data for populating UI genre selections
      Genre: function(){
        return Genre.find({}, {sort: {genre: 1}});
      },
      // Get the current Movie details being clicked
      editMovie: function(){
        return Movies.findOne(Session.get('editMovieID', this._id));
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
          searchTitle: movieTitle.toLowerCase(),
          createdAt: new Date() 
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
      }

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
        // Scroll back up to the top
        $("html, body").animate({
           scrollTop:0
        },"slow");
        // Only execute when edit section is hidden
        if(Session.get('editHidden?')){
          $('.edit-section').toggleClass('hide');
          Session.set('editHidden?', false);
        }

      },
      // Delete event handler 
      "click .delete": function(){
        Movies.remove(this._id);
      }

    })
  }
// ********** client Side code end (client.js)  **********************
