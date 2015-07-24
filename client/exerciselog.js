Template.exerciselog.helpers({
	log: function () {
		var filter = {};

		if (ActiveRoute.path('/log/you')) {
			filter = {owner: Meteor.userId()};
		}

		filter["hidden"] = { $ne: true };

		if (!ActiveRoute.path('/log/now')) {
			filter["enddate"] = { $exists: true };
		} else {
			filter["enddate"] = { $exists: false };
			filter["startdate"] = { $gte: (new Date()).getTime() - 1000*60*60*2 };
		}

		return Log.find(filter, {sort: {startdate: -1}, limit: 100}).map(function(log, index){ 
			log.profile = Profile.findOne({owner: log.owner});
			return log;
		});
	}
});

Template.exerciselogentry.helpers({
	currentuser: function () {
		return this.owner == Meteor.userId();
	},
	currentcolor: function () {
		return (this.owner == Meteor.userId()) ? "panel-success":"panel-info";
	}
});

Template.exerciselogentry.events({
	"click .showcomments": function () {
		Router.go("/comments/log/" + this._id);		
	},
	"click .remove": function () {
		console.log(this._id);
		Log.update({_id: this._id}, {$set: {hidden: true}});
	}
});