if (Meteor.isClient) {

  Template.body.helpers({
    // testing out client side template rendering 
    movies: [
      {MovieTitle: 'Amelie', ReleaseYear: 1991, Genre: 'Horror', button1: 'Edit!', button2: 'Delete'},
      {MovieTitle: 'Amelie', ReleaseYear: 1991, Genre: 'Horror', button1: 'Edit!', button2: 'Delete'},
      {MovieTitle: 'Amelie', ReleaseYear: 1991, Genre: 'Horror', button1: 'Edit!', button2: 'Delete'}
    ]

  });

  Template.hello.events({
    'click button': function () {
      // increment the counter when button is clicked
      Session.set('counter', Session.get('counter') + 1);
    }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
    Tasks = new Mongo.Collection("Movies");
  });
}
