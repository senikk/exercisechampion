Template.applayout.helpers({
	loading: function () {
		return !!Session.get("loading");
	},
	alertinfo: function () {
		return Session.get("alert-info");
	},
	alertok: function () {
		return Session.get("alert-ok");
	}
});