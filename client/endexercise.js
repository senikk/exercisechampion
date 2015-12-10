Template.endexercise.helpers({
	log: function () {
		return Log.findOne({_id: exercisingVar.get()});		
	},
	recommended: function () {
		var profile = Profile.findOne({owner: Meteor.userId()});
		return Recommended.findOne({group: profile.group}, {sort: {timestamp: 1}});		
	},
	mins: function () {
		var log = Log.findOne(exercisingVar.get());
		if (log == null) return 0;
		var diff = log.enddate - log.startdate - (log.pausetime || 0);
		var mins = Math.floor(diff / 1000 / 60);
		return mins;
	}
});

Template.endexercise.events({
	"click .addlog": function (event, template) {
		var log = exercisingVar.get();
		var mins = parseInt(template.find(".mins").value) || 0;
		var body = template.find(".body").value || "";
		var inst = template.find(".instrument").value || "";
		var recommended = false;
		var rec = template.find(".recommended");
		if (rec) { recommended = rec.value; }
		var instrument = Instrument.findOne({name: inst});

		var l = Log.findOne(exercisingVar.get());
		var diff = l.enddate - l.startdate - (l.pausetime || 0);
		var timermins = Math.floor(diff / 1000 / 60);

		if (mins < 1) {
			setAlertInfo("You are not allowed to register less than 1 minute");
			return;
		}

		if (mins > 150) {
			setAlertInfo("You are not allowed to register more than 2.5 hours with the timer function.")
			return;
		}

		if (mins > timermins) {
			setAlertInfo("You are not allowed to register more minutes than the reached minutes with the timer.");
			return;
		}

		if (inst != "" && instrument == null) {
			setAlertInfo("You need to choose an instrument from available instruments when searching");
			return;
		}

		Meteor.call("endlog", log, mins, body, recommended, instrument, (new Date()).getTime());

		// update score (need to move)
		Meteor.call("score", Meteor.userId(), function (error, score) {
			if (!!error) return;
			Session.set("score", score);
		});

		// End exercise
		exercisingVar.set(null);
		Session.set("exercisetime", 0);
		Router.go("log");
	},
	"click .remove": function (event, template) {
		Log.remove({_id: exercisingVar.get()});
		exercisingVar.set(null);
		Session.set("exercisetime", 0);
		Router.go("/");		
	}
});