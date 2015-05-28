// ********** Server Side code start (server.js)  **********************

  if (Meteor.isServer) {
    Meteor.startup(function () {
      UserAnalytics.remove({})
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