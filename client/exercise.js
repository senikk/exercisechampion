/* Default values */
Session.setDefault("exercisetime", 0);
Session.setDefault("logwho", "you");
Session.setDefault("resultwho", "champion");
Session.setDefault("alert-info", "");
Session.setDefault("alert-ok", "");
Session.setDefault("periode", "week");
Session.setDefault("loading", true);
Session.setDefault("group", null);
exercisingVar = new StoredVar('ExerciseChampion.exercising');

Tracker.autorun(function(){

  Meteor.subscribe("log-current-user");
  Meteor.subscribe("profile-current-user", function () {
  	Session.set("loading", false);  	
  });
  Meteor.subscribe("profile");
  Meteor.subscribe("log");
  Meteor.subscribe("group");
  Meteor.subscribe("stat");
  Meteor.subscribe("recommended");
  Meteor.subscribe("instrument");
  Meteor.subscribe("comment");
  Meteor.subscribe("useremail");

/* Get scores */
  if(Meteor.userId()){

	Meteor.call("score", Meteor.userId(), function (error, score) {
		if (!!error) return;
		Session.set("score", score);
	});

	Meteor.setInterval(function () {
		if (exercisingVar.get()) {
			var log = Log.findOne({_id: exercisingVar.get()});
			var date = (new Date()).getTime();
			if (!!log.pausedate) date = log.pausedate;
			if (!!log.enddate) date = log.enddate;
			var diff = date - log.startdate - (log.pausetime || 0);
			var mins = Math.floor(diff / 1000 / 60);
			Session.set("exercisetime", mins);
		}
	}, 2000);
  }
});

/* Templates */
Template.exercise.helpers({
	loading: function () {
		return Session.get("loading");
	},
	loggedIn: function () {
		return !!Meteor.userId();
	},
	hasprofile: function () {
		var profile = Profile.findOne({owner: Meteor.userId()});
		if (!profile) return false;

		var name = profile.name || "";
		var groupname = profile.groupname || "";

		return name.length > 0 && groupname.length > 0;
	}
});

Template.exercisemain.helpers({
	exercising: function () {
		return exercisingVar.get();
	},
	pause: function () {
		var log = Log.findOne(exercisingVar.get());
		if (!log) return false;
		return !!log.pausedate;
	},
	ended: function () {
		var log = Log.findOne(exercisingVar.get());
		if (!log) return true;
		return !!log.enddate;		
	}
});

Template.exercisemain.events({
	"click .exercise": function () {
		var exercising = exercisingVar.get();
		// if false create new log entry
		// if end put end in entry and go to finalize
		if (exercising) {
			Log.update({_id: exercising}, {$set: {enddate: (new Date()).getTime()}});
			Router.go("endexercise");
		} else {
			var log = Log.insert({
				owner: Meteor.userId(),
				startdate: (new Date()).getTime()
			});

			exercisingVar.set(log);
		}
	},
	"click .pause": function () {
		var exercising = exercisingVar.get();
		if (exercising) {
			var log = Log.findOne(exercising);
		
			if (!!log.pausedate) { // start again
				var diff = (new Date()).getTime() - log.pausedate;
				Log.update({_id: exercising}, {$set: {pausedate: null}, $inc: {pausetime: diff}});
			} else { // pause
				Log.update({_id: exercising}, {$set: {pausedate: (new Date()).getTime()}});
			}
		}
	}
});

Template.exercisestat.helpers({
	"lastweek": function () {
		var lastweek = (new Date()).setDate((new Date()).getDate() - 7);
		return (new Date(lastweek)).getWeekNumber();
	},
	"runnerupmins": function () {
		var profile = Profile.findOne({owner: Meteor.userId()});
		var year = (new Date()).getFullYear();
		var filter = {};
		var sort = {};

		var mins = 0;
		if (!!profile.mins && !!profile.mins[year]) { mins = profile.mins[year].year; }

		filter["mins." + year + ".year"] = {$gt: mins};
		sort["mins." + year + ".year"] = -1;

		var nextprofile = Profile.findOne(filter, {sort: sort});
		if (!nextprofile || !nextprofile.mins) return 0;

		return nextprofile.mins[year].year - mins;
	},
	"lastweekmins": function () {
		var lastweek = (new Date()).setDate((new Date()).getDate() - 7);
		var year = (new Date(lastweek)).getFullYear();
		var week = (new Date(lastweek)).getWeekNumber();
		var profile = Profile.findOne({owner: Meteor.userId()});

		if (!profile.mins || !profile.mins[year]) return 0;

		try { 
			return profile.mins[year].week[week] || 0;
		} catch(e) {
			return 0;
		}
	},
	"profile": function () {
		return Profile.findOne({owner: Meteor.userId()});
	},
	"week": function () {
		return (new Date()).getWeekNumber();
	},
	"year": function () {
		var year = (new Date()).getFullYear();
		return year;
	},
	"yearmins": function () {
		var profile = Profile.findOne({owner: Meteor.userId()});
		var year = (new Date()).getFullYear();

		if (!profile.mins || !profile.mins[year]) return 0;

		return profile.mins[year].year || 0;
	},
	"weekmins": function () {
		var year = (new Date()).getFullYear();
		var week = (new Date()).getWeekNumber();
		var profile = Profile.findOne({owner: Meteor.userId()});

		if (!profile.mins || !profile.mins[year]) return 0;

		try {
			return profile.mins[year].week[week] || 0;	
		} catch(e) {
			return 0;
		}
	},
	"score": function () {
		return Session.get("score");	
	}
})