Template.applayout.helpers({
	alertinfo: function () {
		return Session.get("alert-info");
	},
	alertok: function () {
		return Session.get("alert-ok");
	}
});