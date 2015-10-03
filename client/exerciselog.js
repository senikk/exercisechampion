Template.exerciselog.helpers({
	log: function () {
		var filter = {};

		if (ActiveRoute.path('/log/you')) {
			filter = {owner: Meteor.userId()};
		}

		filter["hidden"] = { $ne: true };

		if (!ActiveRoute.path('/log/now')) {
			filter["mins"] = { $exists: true };
		} else {
			filter["mins"] = { $exists: false };
			filter["startdate"] = { $gte: (new Date()).getTime() - 1000*60*60*2 };
		}

		return Log.find(filter, {sort: {startdate: -1}, limit: 100}).map(function(log, index){ 
			log.profile = Profile.findOne({owner: log.owner});
			return log;
		});
	},
	weeks: function () {
		var curr_year = (new Date()).getFullYear();
		var weeks = Profile.findOne({owner: Meteor.userId()}).mins[curr_year].week;

		var result = [];
		Object.keys(weeks).sort().reverse().forEach(function(key) {
  			result.push({week: key, mins: weeks[key]});
		});

		return result;
	},
	year: function () {
		return (new Date()).getFullYear();
	},
	exercising: function () {
		return !!exercisingVar.get();
	}
});

Template.exerciselogentry.helpers({
	currentuser: function () {
		return this.owner == Meteor.userId();
	},
	currentcolor: function () {
		return (this.owner == Meteor.userId()) ? "panel-success":"panel-info";
	},
	bodyoredit: function () {
		return this.body || this.edit;
	}
});

Template.exerciselogentry.events({
	"click .showcomments": function () {
		if (this.edit) return;
		Router.go("/comments/log/" + this._id);		
	},
	"click .remove": function () {
		Log.update({_id: this._id}, {$set: {hidden: true}});
	},
	"click .edit": function () {
		Log.update({_id: this._id}, {$set: {edit: true}});
	},
	"click .save": function (event, template) {
		var body = template.find(".body").value;
		Log.update({_id: this._id}, {$set: {edit: false, body: body}});
	}
});

Template.logexercise.helpers({
	recommended: function () {
		var profile = Profile.findOne({owner: Meteor.userId()});
		return Recommended.findOne({group: profile.group}, {sort: {timestamp: 1}});		
	}
});

Template.logexercise.events({
	"click .addlog": function (event, template) {
		var body = template.find(".body").value || "";
		var mins = parseInt(template.find(".mins").value) | 0;
		var owner = Meteor.userId();
		var instrument = Session.get("instrument");

		if (body.length == 0) {
			setAlertInfo("You need to enter what exercises you did");
			return;
		}

		if (mins <= 0) {
			setAlertInfo("You need to enter minutes you practised");
			return;
		}

		var recommended = false;
		var rec = template.find(".recommended");
		if (rec) { recommended = rec.value; }

		Meteor.call("addlog", owner, mins, body, recommended, instrument);

		// update score (need to move)
		Meteor.call("score", Meteor.userId(), function (error, score) {
			if (!!error) return;
			Session.set("score", score);
		});

		template.find(".body").value = "";
		template.find(".mins").value = "";
	}
});