
function makepoints(logid) {
	var log = Log.findOne({_id: logid});
	var user = log.owner;
	var mins = log.mins;

	// log points
	var d = new Date(log.startdate);
	var curr_year = d.getFullYear();
	var curr_month = d.getMonth(); curr_month++;
	var curr_week = d.getWeekNumber();
	var curr_year_week = curr_month == 1 && curr_week == 53 ? curr_year - 1 : curr_year;

	// profile points
	var profile = Profile.findOne({owner: user});
	var contesters = Profile.find({group: profile.group, mins: {$exists: true}}).count() || 1;

	var inc = {};
	inc["mins." + curr_year + ".year"] = mins;
	inc["mins." + curr_year_week + ".week." + curr_week] = mins;
	inc["mins." + curr_year + ".month." + curr_month] = mins;

	if(log.instrumentid != "") {
		inc["instrument." + log.instrumentid + ".mins." + curr_year + ".year"] = mins;
		inc["instrument." + log.instrumentid + ".mins." + curr_year_week + ".week." + curr_week] = mins;
		inc["instrument." + log.instrumentid + ".mins." + curr_year + ".month." + curr_month] = mins;		
	}

	Profile.update({owner: user}, {$inc: inc});

	// group points
	inc = {};
	mins = Math.floor(mins / contesters);
	inc["mins." + curr_year + ".year"] = mins;
	inc["mins." + curr_year_week + ".week." + curr_week] = mins;
	inc["mins." + curr_year + ".month." + curr_month] = mins;

	Group.update({_id: profile.group}, {$inc: inc});
	Log.update({_id: log._id}, {$set: {group: profile.group, groupmins: mins, groupcontesters: contesters}});

	// instrument points
	if (log.instrumentid != "") {
		inc = {};
		mins = log.mins;
		inc["mins." + curr_year + ".year"] = mins;
		inc["mins." + curr_year_week + ".week." + curr_week] = mins;
		inc["mins." + curr_year + ".month." + curr_month] = mins;

		Instrument.update({_id: log.instrumentid}, {$inc: inc});
		Log.update({_id: log._id}, {$set: {instrumentmins: mins}});			
	}
}

Meteor.methods({
	addinstrument: function (instrument) {
		if (instrument == null) throw new Meteor.Error(400, "Instrument name empty");

		instrument = instrument.trim().capitalize();
		if (instrument.length == 0) throw new Meteor.Error(400, "Instrument name empty");

		if (Instrument.findOne({name: { $regex : new RegExp(instrument, "i") }}) != null) throw new Meteor.Error(400, "Allready added " + instrument);

		console.log("inserting " + instrument);

		Instrument.insert({
			name: instrument,
			startdate: (new Date()).getTime()
		});
	},
	removeprofile: function (profile) {
		Profile.remove(profile);
	},
	removegroup: function (group) {
		Group.remove(group);
	},
	addlog: function (owner, mins, body, recommended, instrument) {	
		var instrumentname = "";
		var instrumentid = "";
		
		if (instrument != null) {
			instrumentname = instrument.name;
			instrumentid = instrument._id;
		}

		var logid = Log.insert({
			owner: owner,
			startdate: (new Date()).getTime(),
			body: body,
			recommended: !!recommended,
			mins: mins,
			instrumentname: instrumentname,
			instrumentid: instrumentid
		});

		makepoints(logid);
	},
	endlog: function (logid, mins, body, recommended, instrument, localtime) {
		var instrumentname = "";
		var instrumentid = "";		
	
		if (instrument != null) {
			instrumentname = instrument.name;
			instrumentid = instrument._id;
		}

		var log = Log.findOne({_id: logid});
		var diff = localtime - (new Date()).getTime();
		var starttime = log.startdate - diff;
		var endtime = log.enddate - diff;

		Log.update({_id: logid}, {$set: {
			body: body,
			recommended: !!recommended,
			mins: mins,
			instrumentname: instrumentname,
			instrumentid: instrumentid,
			startdate: starttime,
			enddate: endtime
		}});

		makepoints(logid);
	},
	score: function (user) {
		var profile = Profile.findOne({owner: user});
		var members = Profile.find().count();
		var groupmembers = 0;
		if (profile != null) groupmembers = Profile.find({group: profile.group}).count();

  		var curr_year = (new Date()).getFullYear();
  		var mins = 0;
  		var memberposition = members;
  		var groupposition = groupmembers;
  		var memberpercent = 100;
  		var grouppercent = 100;

  		if (!!profile && !!profile.mins && !!profile.mins[curr_year]) {
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
	},
	grouptoprofile: function (groupname) {
		var group = Group.findOne({name: new RegExp(groupname,'i')},{sort: {timestamp: 1}});
		var profile = Profile.findOne({owner: Meteor.userId()});
		var groupid = "";

		// existing group
		if (!!group) {
			groupid = group._id;
			groupname = group.name;
		} else {
			groupid = Group.insert({
				owner: Meteor.userId(),
				timestamp: (new Date()).getTime(),
				name: groupname
			});
		}

		// update profile
		if (!!profile) {
			Profile.update({_id: profile._id}, {$set: {
				groupname: groupname,
				group: groupid
			}});
		} else {
			Profile.insert({
				owner: Meteor.userId(),
				timestamp: (new Date()).getTime(),
				groupname: groupname,
				group: groupid
			});
		}
	},
	fixit: function () {
		console.log("fixit profile");

		var profiles = Profile.find({'mins.2016.week.2': {$exists: 1}}).fetch();
		var groups = Group.find({'mins.2016.week.2': {$exists: 1}}).fetch();

		console.log("profiles");
		for(var i in profiles) {
			var mins = profiles[i]['mins']['2016']['week']['2'];
			console.log(profiles[i]._id + " = " + mins);
			Profile.update({_id: profiles[i]._id}, {$inc: {'mins.2016.week.1': mins}, $unset: {'mins.2016.week.2': ''}});
		}

		console.log("groups");
		for(var i in groups) {
			var mins = groups[i]['mins']['2016']['week']['2'];
			console.log(groups[i]._id + " = " + mins);
			Group.update({_id: groups[i]._id}, {$inc: {'mins.2016.week.1': mins}, $unset: {'mins.2016.week.2': ''}});
		}
	}
});