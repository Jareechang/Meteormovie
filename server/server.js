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

    Meteor.methods({
      UserAnalyticsUpdate: function(DataID, genreName, guestCookieID){
        console.log('id ' + DataID);
        console.log('genre ' + genreName );
        console.log(guestCookieID);
        UserAnalytics.update({_id: DataID, 'genrecounter.genre': genreName},
                             {$inc: { 'genrecounter.$.count': 1 } }    
        )
      }
    })
  }

// ********** Server Side code end ************************************