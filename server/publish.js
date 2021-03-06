//Meteor.publish("bandtop", function () {
//	var curr_year = (new Date()).getFullYear();
//	var sort = {};
//	sort["mins." + curr_year + ".year"] = -1;
//
//	var results = Group.find({}, sort).map(function(group, index){
//    	group.index = index + 1;
//    	if (!!group.mins) {
//	    	group.result = group.mins[curr_year].year;
//    	} else {
//    		group.result = 0;
//    	}
//    	return group;
//    });
//
//  	return results;
//});

Meteor.publish("profile-current-user", function () {
  return Profile.find({owner: this.userId});
});

Meteor.publish("profile", function () {
  return Profile.find();
});

Meteor.publish("log", function () {
  return Log.find({}, {limit: 100, sort: {'startdate': -1}});
});

Meteor.publish("log-current-user", function () {
  return Log.find({owner: this.userId}, {limit: 100, sort: {'startdate': -1}});
});

Meteor.publish("comment", function () {
  return Comment.find();
});

Meteor.publish("group", function () {
  var groupProfileIds = Profile.find().map(function(p) { return p.group});
  return Group.find({_id: {$in: groupProfileIds}});
});

Meteor.publish("stat", function () {
  return Stat.find();
});

Meteor.publish("recommended", function () {
  return Recommended.find();
});

Meteor.publish("instrument", function () {
  return Instrument.find();
});

Meteor.publish("useremail", function () {
  var user = Meteor.users.findOne(this.userId);
  if (user.emails[0].address == "terje@senikk.com" || user.emails[0].address == "hegeae@gmail.com") {
	return Meteor.users.find({}, {fields: {'emails': 1}});
  } else {
  	return [];
  }
});
