// ********** Collections  start (lib/colelctions.js)  *****************
  
  /*  Here we are defining the collection used for this application, 
       could easily be moved into 'common code' user lib/  */

  // Defining the movie collection 
  Movies = new Mongo.Collection("Movies");
  Genre = new Mongo.Collection("Genre");

  // A collection for managing the user's data
  UserAnalytics = new Mongo.Collection("UserAnalytics");

// ********** Collections end   ****************************************