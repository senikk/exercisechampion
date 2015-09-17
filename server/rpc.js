
function makepoints(logid) {
	var log = Log.findOne({_id: logid});
	var user = log.owner;
	var mins = log.mins;

	// log points
	var d = new Date(log.startdate);
	var curr_year = d.getFullYear();
	var curr_week = d.getWeekNumber();
	var curr_month = d.getMonth(); curr_month++;

	// profile points
	var profile = Profile.findOne({owner: user});
	var contesters = Profile.find({group: profile.group, mins: {$exists: true}}).count() || 1;

	var inc = {};
	inc["mins." + curr_year + ".year"] = mins;
	inc["mins." + curr_year + ".week." + curr_week] = mins;
	inc["mins." + curr_year + ".month." + curr_month] = mins;

	Profile.update({owner: user}, {$inc: inc});

	// group points
	mins = Math.floor(mins / contesters);
	inc["mins." + curr_year + ".year"] = mins;
	inc["mins." + curr_year + ".week." + curr_week] = mins;
	inc["mins." + curr_year + ".month." + curr_month] = mins;

	Group.update({_id: profile.group}, {$inc: inc});
	Log.update({_id: log._id}, {$set: {group: profile.group, groupmins: mins, groupcontesters: contesters}});
}

Meteor.methods({
	removeprofile: function (profile) {
		Profile.remove(profile);
	},
	removegroup: function (group) {
		Group.remove(group);
	},
	addlog: function (owner, mins, body, recommended) {
		var logid = Log.insert({
			owner: owner,
			startdate: (new Date()).getTime(),
			body: body,
			recommended: !!recommended,
			mins: mins
		});

		makepoints(logid);
	},
	endlog: function (logid, body, recommended) {
		var log = Log.findOne({_id: logid});
		var diff = log.enddate - log.startdate - (log.pausetime || 0);
		var mins = Math.floor(diff / 1000 / 60);

		Log.update({_id: logid}, {$set: {
			body: body,
			recommended: !!recommended,
			mins: mins
		}});

		makepoints(logid);
	},
	score: function (user) {
		var profile = Profile.findOne({owner: user});
		var members = Profile.find().count();
		var groupmembers = Profile.find({group: profile.group}).count();

  		var curr_year = (new Date()).getFullYear();
  		var mins = 0;
  		var memberposition = members;
  		var groupposition = groupmembers;
  		var memberpercent = 100;
  		var grouppercent = 100;

  		if (!!profile.mins) {
	  		mins = profile.mins[curr_year].year || 0;
	  	}

	  	var gtmins = {};
	  	gtmins["mins." + curr_year + ".year"] = {$gt: mins};

	  	memberposition = Profile.find(gtmins).count()+1 || members;
	  		
		gtmins["group"] = profile.group;
		groupposition = Profile.find(gtmins).count()+1 || groupmembers;
  	
	  	if (members > 1) {
			memberpercent = 100 - Math.floor((memberposition-1)/(members-1)*100);
  		}

  		if (groupmembers > 1) {
			grouppercent = 100 - Math.floor((groupposition-1)/(groupmembers-1)*100);
  		}

		return {
			members: members,
			memberpercent: memberpercent,
			memberposition: memberposition,
			groupmembers: groupmembers,
			grouppercent: grouppercent,
			groupposition: groupposition
		};
	}
});