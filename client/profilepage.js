Template.profilepage.helpers({
	'profile': function () {
		return Profile.findOne({owner: Session.get("profilepage")});
	},
	'log': function () {
		var filter = {};

		filter = {owner: Session.get("profilepage")};
		filter["hidden"] = { $ne: true };
		filter["mins"] = { $exists: true };

		var owner = Profile.findOne({owner: Session.get("profilepage")});

		return Log.find(filter, {sort: {startdate: -1}, limit: 100}).map(function(log, index){ 
			log.profile = owner;
			return log;
		});
	},
	'weeks': function () {
		var curr_year = (new Date()).getFullYear();
		var weeks = Profile.findOne({owner: Meteor.userId()}).mins[curr_year].week;

		var result = [];
		Object.keys(weeks).sort().reverse().slice(0,2).forEach(function(key) {
  			result.push({week: key, mins: weeks[key]});
		});

		return result;
	},
	'year': function () {
		var curr_year = (new Date()).getFullYear();
		var result = [];

		var year = Profile.findOne({owner: Session.get("profilepage")}).mins[curr_year].year;

		return {year: curr_year, mins: year};
	},
	'instruments': function () {
		var profile = Profile.findOne({owner: Session.get("profilepage")});
		var instruments = [];
		if (!!profile && !!profile.instrument) {
			Object.keys(profile.instrument).forEach(function (instrumentid) {
				instruments.push(Instrument.findOne(instrumentid));		
			});			
		}

		return instruments;
	},	

});

Template.yearentry