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

Meteor.publish("profile", function () {
  return Profile.find();
});

Meteor.publish("log", function () {
  return Log.find();
});

Meteor.publish("comment", function () {
  return Comment.find();
});

Meteor.publish("group", function () {
  return Group.find();
});

Meteor.publish("stat", function () {
  return Stat.find();
});

Meteor.publish("recommended", function () {
  return Recommended.find();
});
