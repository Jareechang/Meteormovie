if (Meteor.isClient) {
  // counter starts at 0
  Session.setDefault('counter', 0);

  Template.body.helpers({
    counter: function () {
      return Session.get('counter');
    },
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
  });
}
