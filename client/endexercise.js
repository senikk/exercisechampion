Template.endexercise.helpers({
	log: function () {
		return Log.findOne({_id: exercisingVar.get()});		
	},
	recommended: function () {
		var profile = Profile.findOne({owner: Meteor.userId()});
		return Recommended.findOne({group: profile.group}, {sort: {timestamp: 1}});		
	}
});

Template.endexercise.events({
	"click .addlog": function (event, template) {
		var log = exercisingVar.get();
		var body = template.find(".body").value;
		var recommended = false;
		var rec = template.find(".recommended");
		if (rec) { recommended = rec.value; }

		Meteor.call("endlog", log, body, recommended);

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