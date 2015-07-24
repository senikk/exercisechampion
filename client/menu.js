Template.menu.helpers({
	"loggedIn": function () {
		return !!Meteor.userId();
	},
	"profile": function () {
		return Profile.findOne({owner: Meteor.userId()});
	},
	"active": function () {
		var exercising = exercisingVar.get();
		return !exercising ? "" : "active";
	},
	"isactive": function () {
		return !!exercisingVar.get();
	},
	"exercisetime": function () {
		return Session.get("exercisetime");
	}
});

Template.menu.events({
	"click .home": function () {
		Router.go("/");
	},
	"click .exerciselog": function () {
		Router.go("log");
	},
	"click .exerciseresult": function () {
		Router.go("result");
	},
	"click .profile": function () {
		Router.go("profile");
	},
	"click .logout": function (event) {
		event.preventDefault();
        Meteor.logout();
		Router.go("/");
	}
});